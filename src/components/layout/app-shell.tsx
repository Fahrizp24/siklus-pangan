"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, ShieldCheck, Recycle, Award, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { label: "Surplus Radar", href: "/rescue", icon: ShieldCheck },
    { label: "Biokonversi Limbah", href: "/waste", icon: Recycle },
    { label: "Wall of Fame", href: "/leaderboard", icon: Award },
    { label: "Dasbor ESG", href: "/dashboard", icon: Leaf },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-50 glass-panel border-b border-border/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all">
            <Leaf className="w-5 h-5 text-primary" />
          </div>
          <span className="font-headline font-bold text-lg tracking-tight text-foreground">
            Siklus<span className="text-primary">Pangan</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/70">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold font-label transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Action */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-background hover:bg-muted border border-border text-xs font-semibold font-label text-foreground transition-all shadow-xs"
          >
            <User className="w-3.5 h-3.5 text-primary" />
            <span>Masuk</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-background border border-border text-foreground hover:bg-muted"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-border px-4 py-3 flex flex-col gap-2 z-40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold font-label transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 pb-20 md:pb-8">{children}</div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-border px-4 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 text-[10px] font-medium font-label transition-all",
                isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
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
