"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShieldCheck, Recycle, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  const mobileNavItems = [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Donasi", href: "/rescue", icon: ShieldCheck },
    { label: "Limbah", href: "/waste", icon: Recycle },
    { label: "Dompet", href: "/wallet", icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 pb-20 md:pb-8">{children}</div>

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
