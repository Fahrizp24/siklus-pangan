import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh auth session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Extract user role (prioritizing user_metadata, then querying profiles table as fallback)
  let role: string | undefined = user?.user_metadata?.role;
  if (user && !role) {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      role = profile?.role;
    } catch {
      role = undefined;
    }
  }

  // 1. Jika pengguna sudah login dan membuka halaman auth (/login, /signup, /register)
  if (user && (pathname === "/login" || pathname === "/signup" || pathname === "/register")) {
    const url = request.nextUrl.clone();
    if (role === "beneficiary") {
      url.pathname = "/rescue";
    } else if (role === "admin") {
      url.pathname = "/admin";
    } else if (role === "processor") {
      url.pathname = "/waste";
    } else {
      url.pathname = "/dashboard";
    }
    return NextResponse.redirect(url);
  }

  // 2. Proteksi Halaman Donasi Pangan: /donate, /donate/*, /rescue/new (Khusus Donatur & Admin)
  const isDonateRoute = pathname.startsWith("/donate") || pathname === "/rescue/new";
  if (isDonateRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      url.searchParams.set("error", "login_donor_required");
      return NextResponse.redirect(url);
    }
    if (role !== "donor" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = role === "beneficiary" ? "/rescue" : "/";
      url.searchParams.set("error", "unauthorized_role_donor");
      return NextResponse.redirect(url);
    }
  }

  // 3. Proteksi Halaman Klaim Pangan: /claims, /claims/* (Khusus Penerima Manfaat / Beneficiary & Admin)
  const isClaimsRoute = pathname.startsWith("/claims");
  if (isClaimsRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      url.searchParams.set("error", "login_beneficiary_required");
      return NextResponse.redirect(url);
    }
    if (role !== "beneficiary" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = role === "donor" ? "/donate" : "/";
      url.searchParams.set("error", "unauthorized_role_beneficiary");
      return NextResponse.redirect(url);
    }
  }

  // 4. Proteksi Halaman Limbah Organik: /waste, /waste/* (Khusus Donatur, Pengolah BSF, & Admin)
  const isWasteRoute = pathname.startsWith("/waste");
  if (isWasteRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      url.searchParams.set("error", "login_waste_required");
      return NextResponse.redirect(url);
    }
    if (role !== "donor" && role !== "processor" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/rescue";
      url.searchParams.set("error", "unauthorized_role_waste");
      return NextResponse.redirect(url);
    }
  }

  // 5. Proteksi Halaman Dompet Sirkular: /wallet, /wallet/* (Khusus Donatur, Pengolah BSF, & Admin)
  const isWalletRoute = pathname.startsWith("/wallet");
  if (isWalletRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      url.searchParams.set("error", "login_wallet_required");
      return NextResponse.redirect(url);
    }
    if (role !== "donor" && role !== "processor" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/rescue";
      url.searchParams.set("error", "unauthorized_role_wallet");
      return NextResponse.redirect(url);
    }
  }

  // 6. Proteksi Halaman Sengketa / Disputes: /disputes, /disputes/* (Khusus Beneficiary, Donor, & Admin)
  const isDisputesRoute = pathname.startsWith("/disputes");
  if (isDisputesRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      url.searchParams.set("error", "login_required");
      return NextResponse.redirect(url);
    }
    if (role !== "beneficiary" && role !== "donor" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("error", "unauthorized_role_disputes");
      return NextResponse.redirect(url);
    }
  }

  // 7. Proteksi Halaman Admin Konsol: /admin, /admin/* (Khusus Role Admin Saja)
  const isAdminRoute = pathname.startsWith("/admin");
  if (isAdminRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      url.searchParams.set("error", "admin_login_required");
      return NextResponse.redirect(url);
    }
    if (role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("error", "forbidden_admin_only");
      return NextResponse.redirect(url);
    }
  }

  // 8. Proteksi Halaman Profil: /profile, /profile/* (Semua Pengguna yang Sudah Login)
  const isProfileRoute = pathname.startsWith("/profile");
  if (isProfileRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    url.searchParams.set("error", "login_required");
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (.svg, .png, .jpg, .jpeg, .gif, .webp)
     * - static api/scripts
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
