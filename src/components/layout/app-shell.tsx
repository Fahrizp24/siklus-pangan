"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Radio,
  HeartHandshake,
  Recycle,
  Wallet,
  Ticket,
  Trophy,
  User,
  LogIn,
  LayoutDashboard,
  Leaf,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar, NavbarUser } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { createClient } from "@/lib/supabase/client";

export interface AppShellProps {
  children: React.ReactNode;
  role?: string | null;
  user?: NavbarUser | null;
}

let cachedRole: string | null = null;

export function AppShell({ children, role: initialRole, user: initialUser }: AppShellProps) {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(() => {
    if (initialRole !== undefined && initialRole !== null) return initialRole;
    return null;
  });

  const effectiveRole = role || initialRole;

  useEffect(() => {
    if (initialRole) {
      cachedRole = initialRole;
      setRole(initialRole);
      try {
        localStorage.setItem("siklus_cached_role", initialRole);
      } catch {}
      return;
    }

    // Safely restore cached role on client AFTER hydration
    if (cachedRole) {
      setRole(cachedRole);
    } else if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("siklus_cached_role");
        if (stored) {
          cachedRole = stored;
          setRole(stored);
        }
      } catch {}
    }

    const supabase = createClient();
    if (!cachedRole) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          const userRole = user.user_metadata?.role || "donor";
          cachedRole = userRole;
          setRole(userRole);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("siklus_cached_role", userRole);
            } catch {}
          }
        } else {
          cachedRole = null;
          setRole(null);
          if (typeof window !== "undefined") {
            try {
              localStorage.removeItem("siklus_cached_role");
            } catch {}
          }
        }
      });
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userRole = session.user.user_metadata?.role || "donor";
        cachedRole = userRole;
        setRole(userRole);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("siklus_cached_role", userRole);
          } catch {}
        }
      } else {
        cachedRole = null;
        setRole(null);
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("siklus_cached_role");
          } catch {}
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [initialRole]);

  let mobileNavItems = [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Radar", href: "/rescue", icon: Radio },
    { label: "ESG", href: "/dashboard", icon: Leaf },
    { label: "Fame", href: "/leaderboard", icon: Trophy },
    { label: "Masuk", href: "/login", icon: LogIn },
  ];

  if (effectiveRole === "donor") {
    mobileNavItems = [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Radar", href: "/rescue", icon: Radio },
      { label: "Donasi", href: "/donate", icon: HeartHandshake },
      { label: "Limbah", href: "/waste", icon: Recycle },
      { label: "Dompet", href: "/wallet", icon: Wallet },
    ];
  } else if (effectiveRole === "beneficiary") {
    mobileNavItems = [
      { label: "Radar", href: "/rescue", icon: Radio },
      { label: "Klaim", href: "/claims", icon: Ticket },
      { label: "Fame", href: "/leaderboard", icon: Trophy },
      { label: "Profil", href: "/profile", icon: User },
    ];
  } else if (effectiveRole === "processor") {
    mobileNavItems = [
      { label: "Limbah", href: "/waste", icon: Recycle },
      { label: "Dompet", href: "/wallet", icon: Wallet },
      { label: "ESG", href: "/dashboard", icon: Leaf },
      { label: "Fame", href: "/leaderboard", icon: Trophy },
      { label: "Profil", href: "/profile", icon: User },
    ];
  } else if (effectiveRole === "admin") {
    mobileNavItems = [
      { label: "Admin", href: "/admin", icon: Shield },
      { label: "ESG", href: "/dashboard", icon: LayoutDashboard },
      { label: "Radar", href: "/rescue", icon: Radio },
      { label: "Limbah", href: "/waste", icon: Recycle },
      { label: "Dompet", href: "/wallet", icon: Wallet },
    ];
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navbar */}
      <Navbar role={effectiveRole} user={initialUser} />

      {/* Main Content Area */}
      <div className="flex-1 pb-16 md:pb-0">{children}</div>

      {/* Global Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-border px-4 py-2 flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 text-[10px] font-medium font-label transition-all",
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default AppShell;
