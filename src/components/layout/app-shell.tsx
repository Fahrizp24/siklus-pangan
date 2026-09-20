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
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { createClient } from "@/lib/supabase/client";

interface AppShellProps {
  children: React.ReactNode;
}

let cachedRole: string | null = null;

function getInitialRole(): string | null {
  if (cachedRole) return cachedRole;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("siklus_cached_role");
      if (stored) {
        cachedRole = stored;
        return cachedRole;
      }
    } catch {}
  }
  return null;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(getInitialRole);

  useEffect(() => {
    const supabase = createClient();
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
  }, []);

  let mobileNavItems = [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Radar", href: "/rescue", icon: Radio },
    { label: "ESG", href: "/dashboard", icon: Leaf },
    { label: "Fame", href: "/leaderboard", icon: Trophy },
    { label: "Masuk", href: "/login", icon: LogIn },
  ];

  if (role === "donor") {
    mobileNavItems = [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Radar", href: "/rescue", icon: Radio },
      { label: "Donasi", href: "/donate", icon: HeartHandshake },
      { label: "Limbah", href: "/waste", icon: Recycle },
      { label: "Dompet", href: "/wallet", icon: Wallet },
    ];
  } else if (role === "beneficiary") {
    mobileNavItems = [
      { label: "Radar", href: "/rescue", icon: Radio },
      { label: "Klaim", href: "/claims", icon: Ticket },
      { label: "Fame", href: "/leaderboard", icon: Trophy },
      { label: "Profil", href: "/profile", icon: User },
    ];
  } else if (role === "processor") {
    mobileNavItems = [
      { label: "Limbah", href: "/waste", icon: Recycle },
      { label: "Dompet", href: "/wallet", icon: Wallet },
      { label: "ESG", href: "/dashboard", icon: Leaf },
      { label: "Fame", href: "/leaderboard", icon: Trophy },
      { label: "Profil", href: "/profile", icon: User },
    ];
  } else if (role === "admin") {
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
      <Navbar />

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
