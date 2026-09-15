"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Recycle,
  Bell,
  SlidersHorizontal,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MAIN_NAV } from "@/lib/nav";

interface NavbarUser {
  name: string;
  roleDescription: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

interface NavbarProps {
  user?: NavbarUser | null;
}

export function Navbar({
  user = {
    name: "PT Boga Sejahtera",
    roleDescription: "Verified Commercial Waste Generator",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    isVerified: true,
  },
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = MAIN_NAV;

  const isItemActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-xs transition-transform group-hover:scale-105">
            <Recycle className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-lg font-extrabold tracking-tight text-secondary">
              Siklus<span className="text-secondary">Pangan</span>
            </span>
            <span className="font-label text-[9px] font-bold tracking-[0.22em] text-muted-foreground uppercase leading-none">
              Circularity Platform
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          {navItems.map((item) => {
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-1.5 h-full text-sm transition-all font-headline",
                  active
                    ? "font-bold text-primary border-b-2 border-primary"
                    : "font-medium text-neutral hover:text-primary border-b-2 border-transparent"
                )}
              >
                <span>{item.label}</span>
                {active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Button */}
          <button
            type="button"
            className="p-2 rounded-lg text-neutral hover:text-primary hover:bg-muted/70 transition-colors relative"
            aria-label="Notifikasi"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-white" />
          </button>

          {/* Preferences / Filter Button */}
          <button
            type="button"
            className="p-2 rounded-lg text-neutral hover:text-primary hover:bg-muted/70 transition-colors"
            aria-label="Filter dan Pengaturan"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>

          {/* Vertical Separator */}
          <div className="hidden sm:block h-8 w-[1px] bg-border/80 mx-1" />

          {/* User Profile Card */}
          {user ? (
            <div className="hidden sm:flex items-center gap-3 pl-1">
              <div className="flex flex-col text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="font-headline text-sm font-bold text-neutral leading-tight">
                    {user.name}
                  </span>
                  {user.isVerified && (
                    <CheckCircle2 className="h-4 w-4 text-primary fill-primary/10 shrink-0" />
                  )}
                </div>
                <span className="font-body text-[11px] text-muted-foreground leading-tight">
                  {user.roleDescription}
                </span>
              </div>
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border/80 bg-muted shadow-xs">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary/90 transition-colors"
            >
              Masuk
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral hover:bg-muted transition-colors ml-1"
            aria-label="Menu Navigasi"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/80 bg-white px-4 py-4 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {/* Mobile User Profile Section */}
          {user && (
            <div className="mb-4 flex items-center gap-3 border-b border-border/60 pb-3">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border/80 bg-muted">
                {user.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline text-sm font-bold text-neutral">
                    {user.name}
                  </span>
                  {user.isVerified && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary fill-primary/10" />
                  )}
                </div>
                <span className="font-body text-[11px] text-muted-foreground">
                  {user.roleDescription}
                </span>
              </div>
            </div>
          )}

          {/* Mobile Nav Links */}
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const active = isItemActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-headline transition-colors",
                    active
                      ? "bg-primary/10 font-bold text-primary"
                      : "font-medium text-neutral hover:bg-muted"
                  )}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
