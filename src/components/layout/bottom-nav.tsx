"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Radio, HeartHandshake, Recycle, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { isNavItemActive } from "@/lib/nav";

const mobileNavItems = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Radar", href: "/rescue", icon: Radio },
  { label: "Donasi", href: "/donate", icon: HeartHandshake },
  { label: "Limbah", href: "/waste", icon: Recycle },
  { label: "Dompet", href: "/wallet", icon: Wallet },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi bawah"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-border px-4 py-2 flex items-center justify-around"
    >
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        const active = isNavItemActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-col items-center gap-1 text-[10px] font-medium font-label transition-all rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              active
                ? "text-primary font-bold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
