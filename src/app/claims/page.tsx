import { AppShell } from "@/components/layout/app-shell";
import { ClaimsClientWrapper } from "@/components/pages/claims/claims-client-wrapper";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface ClaimsPageProps {
  searchParams: Promise<{ token?: string; claimId?: string; listingId?: string }>;
}

export default async function ClaimsPage({ searchParams }: ClaimsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let claimData: any = null;

  try {
    let query = supabase
      .from("food_claims")
      .select(`
        id,
        qr_token,
        portions_claimed,
        is_collected,
        collected_at,
        created_at,
        listing_id,
        food_listings (
          id,
          title,
          image_url,
          portions,
          safe_until,
          cooked_at,
          storage_method,
          dietary_tags,
          risky_ingredients,
          handling_notes
        )
      `)
      .order("created_at", { ascending: false });

    if (params.token) {
      query = query.eq("qr_token", params.token);
    } else if (params.claimId) {
      query = query.eq("id", params.claimId);
    } else if (user) {
      query = query.eq("claimant_id", user.id).eq("is_collected", false);
    }

    const { data } = await query.limit(1).maybeSingle();
    claimData = data;
  } catch (err) {
    console.warn("ClaimsPage fetch error:", err);
  }

  let profileName = user?.user_metadata?.display_name || "Penerima Manfaat";
  if (user) {
    const { data: prof } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single();
    if (prof?.display_name) profileName = prof.display_name;
  }

  return (
    <AppShell>
      <main className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <ClaimsClientWrapper
          initialClaim={claimData}
          user={user ? { id: user.id, name: profileName } : null}
        />
      </main>
    </AppShell>
  );
}
