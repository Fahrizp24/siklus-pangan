"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Bell,
  SlidersHorizontal,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MAIN_NAV, DONOR_NAV, BENEFICIARY_NAV, PROCESSOR_NAV } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import logoText from "@/assets/logo-text.webp";

export interface NavbarUser {
  name: string;
  role?: string;
  roleDescription: string;
  avatarUrl?: string;
  isVerified?: boolean;
}

interface NavbarProps {
  user?: NavbarUser | null;
}

export function Navbar({ user: initialUser }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<NavbarUser | null>(initialUser ?? null);

  useEffect(() => {
    if (initialUser !== undefined) {
      setCurrentUser(initialUser);
      return;
    }

    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (authUser) {
        const metadata = authUser.user_metadata || {};
        let displayName = metadata.display_name;
        let role = metadata.role || "donor";

        try {
          const { data: prof } = await supabase
            .from("profiles")
            .select("display_name, role")
            .eq("id", authUser.id)
            .single();
          if (prof?.display_name) displayName = prof.display_name;
          if (prof?.role) role = prof.role;
        } catch {}

        setCurrentUser({
          name:
            displayName ||
            metadata.full_name ||
            authUser.email?.split("@")[0] ||
            "Pengguna",
          role,
          roleDescription:
            role === "donor"
              ? "Donatur Pangan Terverifikasi"
              : role === "processor"
              ? "Pengolah Residu Organik"
              : role === "admin"
              ? "Administrator & Auditor"
              : "Penerima Manfaat",
          avatarUrl: metadata.avatar_url,
          isVerified: true,
        });
      } else {
        setCurrentUser(null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const metadata = session.user.user_metadata || {};
        let displayName = metadata.display_name;
        let role = metadata.role || "donor";

        try {
          const { data: prof } = await supabase
            .from("profiles")
            .select("display_name, role")
            .eq("id", session.user.id)
            .single();
          if (prof?.display_name) displayName = prof.display_name;
          if (prof?.role) role = prof.role;
        } catch {}

        setCurrentUser({
          name:
            displayName ||
            metadata.full_name ||
            session.user.email?.split("@")[0] ||
            "Pengguna",
          role,
          roleDescription:
            role === "donor"
              ? "Donatur Pangan Terverifikasi"
              : role === "processor"
              ? "Pengolah Residu Organik"
              : role === "admin"
              ? "Administrator & Auditor"
              : "Penerima Manfaat",
          avatarUrl: metadata.avatar_url,
          isVerified: true,
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [initialUser]);

  let navItems = MAIN_NAV;
  if (currentUser?.role === "donor") {
    navItems = DONOR_NAV;
  } else if (currentUser?.role === "beneficiary") {
    navItems = BENEFICIARY_NAV;
  } else if (currentUser?.role === "processor") {
    navItems = PROCESSOR_NAV;
  }

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
        <Link href="/" className="flex items-center group py-1">
          <Image
            src={logoText}
            alt="SiklusPangan"
            priority
            className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
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

        {/* Right: Actions & Auth State */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            /* Logged In State */
            <>
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

              {/* User Profile Card (Clickable to /profile) */}
              <Link
                href="/profile"
                className={cn(
                  "hidden sm:flex items-center gap-3 pl-1 group p-1 rounded-xl transition-all hover:bg-muted/50",
                  pathname === "/profile" && "bg-accent/60"
                )}
                title="Buka Profil Akun"
              >
                <div className="flex flex-col text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="font-headline text-sm font-bold text-neutral group-hover:text-primary transition-colors leading-tight">
                      {currentUser.name}
                    </span>
                    {currentUser.isVerified && (
                      <CheckCircle2 className="h-4 w-4 text-primary fill-primary/10 shrink-0" />
                    )}
                  </div>
                  <span className="font-body text-[11px] text-muted-foreground leading-tight">
                    {currentUser.roleDescription}
                  </span>
                </div>
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border/80 group-hover:border-primary bg-muted shadow-xs transition-colors">
                  {currentUser.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                </div>
              </Link>
            </>
          ) : (
            /* Logged Out / Guest State */
            <div className="hidden sm:flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="rounded-xl text-xs font-semibold text-neutral hover:text-primary font-headline"
              >
                <Link href="/login">Masuk</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs font-headline px-3.5"
              >
                <Link href="/signup">Daftar</Link>
              </Button>
            </div>
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
          {currentUser ? (
            /* Mobile Logged In Section */
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="mb-4 flex items-center justify-between border-b border-border/60 pb-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border/80 group-hover:border-primary bg-muted">
                  {currentUser.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                      {currentUser.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline text-sm font-bold text-neutral group-hover:text-primary transition-colors">
                      {currentUser.name}
                    </span>
                    {currentUser.isVerified && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary fill-primary/10" />
                    )}
                  </div>
                  <span className="font-body text-[11px] text-muted-foreground">
                    {currentUser.roleDescription}
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-bold text-primary font-headline group-hover:underline">
                Profil →
              </span>
            </Link>
          ) : (
            /* Mobile Guest Login / Register Section */
            <div className="mb-4 flex items-center gap-2 border-b border-border/60 pb-3">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="w-1/2 rounded-xl text-xs font-semibold border-border font-headline"
              >
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Masuk
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="w-1/2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 font-headline"
              >
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  Daftar
                </Link>
              </Button>
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
