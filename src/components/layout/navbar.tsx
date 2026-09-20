"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  CheckCircle2,
  Menu,
  X,
  LayoutDashboard,
  User,
  Trophy,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  GUEST_NAV,
  MAIN_NAV,
  DONOR_NAV,
  BENEFICIARY_NAV,
  PROCESSOR_NAV,
  ADMIN_NAV,
} from "@/lib/nav";
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

  let navItems = GUEST_NAV;
  if (currentUser?.role === "donor") {
    navItems = DONOR_NAV;
  } else if (currentUser?.role === "beneficiary") {
    navItems = BENEFICIARY_NAV;
  } else if (currentUser?.role === "processor") {
    navItems = PROCESSOR_NAV;
  } else if (currentUser?.role === "admin") {
    navItems = ADMIN_NAV;
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
        <nav className="hidden md:flex items-center gap-5 lg:gap-8 h-full">
          {navItems.map((item) => {
            const active = isItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center h-full text-sm transition-all font-headline tracking-normal",
                  active
                    ? "font-bold text-primary border-b-2 border-primary"
                    : "font-medium text-neutral/80 hover:text-primary border-b-2 border-transparent"
                )}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions & Auth State */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            /* Logged In State */
            <>
              {/* User Profile Dropdown (Hover to reveal Dashboard, Leaderboard & Detail Profil) */}
              <div className="relative group hidden sm:block">
                <Link
                  href="/profile"
                  className={cn(
                    "flex items-center gap-3 pl-1 p-1 rounded-xl transition-all hover:bg-muted/50 cursor-pointer",
                    pathname === "/profile" && "bg-accent/60"
                  )}
                  title="Menu Profil & Dashboard"
                >
                  <div className="flex flex-col text-right max-w-[130px] lg:max-w-[180px]">
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="font-headline text-sm font-bold text-neutral group-hover:text-primary transition-colors leading-tight truncate">
                        {currentUser.name}
                      </span>
                      {currentUser.isVerified && (
                        <CheckCircle2 className="h-4 w-4 text-primary fill-primary/10 shrink-0" />
                      )}
                    </div>
                    <span className="font-body text-[11px] text-muted-foreground leading-tight truncate">
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

                {/* Dropdown Menu on Hover */}
                <div className="absolute right-0 top-full pt-2 w-64 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-150 z-50 pointer-events-none group-hover:pointer-events-auto">
                  <div className="rounded-2xl border border-border/80 bg-white p-2 shadow-xl ring-1 ring-black/5">
                    {/* User Info Snippet */}
                    <div className="px-3 py-2 border-b border-border/50 mb-1">
                      <p className="text-xs font-bold text-neutral truncate font-headline">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate font-body">
                        {currentUser.roleDescription}
                      </p>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-0.5">
                      <Link
                        href="/dashboard"
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold font-headline transition-colors",
                          pathname === "/dashboard"
                            ? "bg-primary/10 text-primary"
                            : "text-neutral hover:bg-muted hover:text-primary"
                        )}
                      >
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <LayoutDashboard className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-bold">Dashboard ESG</div>
                          <div className="text-[10px] text-muted-foreground font-normal font-body">
                            Metrik emisi, kalkulator & dampak
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/leaderboard"
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold font-headline transition-colors",
                          pathname === "/leaderboard"
                            ? "bg-primary/10 text-primary"
                            : "text-neutral hover:bg-muted hover:text-primary"
                        )}
                      >
                        <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60">
                          <Trophy className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-bold">Wall of Fame</div>
                          <div className="text-[10px] text-muted-foreground font-normal font-body">
                            Peringkat dampak komunitas
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/disputes"
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold font-headline transition-colors",
                          pathname === "/disputes"
                            ? "bg-primary/10 text-primary"
                            : "text-neutral hover:bg-muted hover:text-primary"
                        )}
                      >
                        <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200/60">
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-bold">Pusat Sengketa</div>
                          <div className="text-[10px] text-muted-foreground font-normal font-body">
                            Resolusi & tiket kendala pangan
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/profile"
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold font-headline transition-colors",
                          pathname === "/profile"
                            ? "bg-primary/10 text-primary"
                            : "text-neutral hover:bg-muted hover:text-primary"
                        )}
                      >
                        <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-bold">Detail Akun & Profil</div>
                          <div className="text-[10px] text-muted-foreground font-normal font-body">
                            Data pribadi, peran & keamanan
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
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
            <div className="mb-4 border-b border-border/60 pb-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-border/80 bg-muted">
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
                    <span className="font-headline text-sm font-bold text-neutral">
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

              {/* Mobile Quick Action Buttons for Dashboard & Detail Profil */}
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold font-headline transition-colors",
                    pathname === "/dashboard"
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-muted/40 text-neutral border-border/80 hover:bg-muted"
                  )}
                >
                  <LayoutDashboard className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-semibold font-headline transition-colors",
                    pathname === "/profile"
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-muted/40 text-neutral border-border/80 hover:bg-muted"
                  )}
                >
                  <User className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                  <span>Detail Profil</span>
                </Link>
              </div>
            </div>
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

            {/* Mobile Extra Links for Logged In Users */}
            {currentUser && (
              <div className="pt-2 mt-2 border-t border-border/60 space-y-1">
                <Link
                  href="/leaderboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-headline transition-colors",
                    pathname === "/leaderboard"
                      ? "bg-primary/10 font-bold text-primary"
                      : "font-medium text-neutral hover:bg-muted"
                  )}
                >
                  <span>Wall of Fame</span>
                  {pathname === "/leaderboard" && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </Link>
                <Link
                  href="/disputes"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-headline transition-colors",
                    pathname === "/disputes"
                      ? "bg-primary/10 font-bold text-primary"
                      : "font-medium text-neutral hover:bg-muted"
                  )}
                >
                  <span>Pusat Sengketa</span>
                  {pathname === "/disputes" && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
