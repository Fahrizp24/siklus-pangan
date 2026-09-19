"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { signIn } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import logoText from "@/assets/logo-text.webp";

function getErrorMessage(errorCode: string | null): string | null {
  switch (errorCode) {
    case "login_donor_required":
      return "Halaman Donasi Pangan hanya dapat diakses oleh Donatur. Silakan masuk sebagai Donatur.";
    case "login_beneficiary_required":
      return "Halaman Klaim Makanan hanya dapat diakses oleh Penerima Manfaat. Silakan masuk sebagai Penerima.";
    case "login_waste_required":
      return "Halaman Pengelolaan Limbah Organik memerlukan akun Donatur atau Pengolah BSF.";
    case "login_wallet_required":
      return "Halaman Dompet Sirkular memerlukan akun Donatur atau Pengolah BSF.";
    case "admin_login_required":
      return "Konsol Pengawas Admin memerlukan otentikasi hak akses Administrator.";
    case "forbidden_admin_only":
      return "Akses ditolak: Akun Anda tidak memiliki hak akses Administrator.";
    case "unauthorized_role_donor":
      return "Peran akun Anda bukan Donatur, sehingga tidak dapat mengakses registrasi donasi.";
    case "unauthorized_role_beneficiary":
      return "Peran akun Anda bukan Penerima Manfaat, sehingga tidak dapat mengakses tiket klaim.";
    case "unauthorized_role_waste":
      return "Peran akun Anda tidak memiliki akses ke operasional limbah organik.";
    case "unauthorized_role_wallet":
      return "Peran akun Anda tidak memiliki akses ke dompet sirkular.";
    case "login_required":
      return "Silakan masuk terlebih dahulu untuk mengakses halaman tersebut.";
    case "auth_callback_failed":
      return "Verifikasi autentikasi gagal atau sesi telah kedaluwarsa. Silakan coba lagi.";
    default:
      return null;
  }
}

function LoginFormContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const urlNotice = getErrorMessage(errorParam);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const demoAccounts = [
    {
      role: "Donatur",
      email: "donor@gmail.com",
      highlight: errorParam === "login_donor_required",
    },
    {
      role: "Penerima",
      email: "organisasi@gmail.com",
      highlight: errorParam === "login_beneficiary_required",
    },
    {
      role: "Pengolah BSF",
      email: "pengolah@gmail.com",
      highlight: errorParam === "login_waste_required" || errorParam === "login_wallet_required",
    },
    {
      role: "Admin",
      email: "admin@gmail.com",
      highlight: errorParam === "admin_login_required",
    },
  ];

  function fillDemo(demoEmail: string) {
    setEmail(demoEmail);
    setPassword("password123");
    setError("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const result = await signIn(formData);
      if (result && !result.success && result.error) {
        setError(result.error);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "NEXT_REDIRECT") {
        return;
      }
      setError("Terjadi kesalahan saat masuk. Silakan periksa email dan password.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)] space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-headline tracking-tight">
          Masuk
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-body">
          Gunakan email dan kata sandi akun ekosistem Anda.
        </p>
      </div>

      {/* Role Protection Context Notice */}
      {urlNotice && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-700 dark:text-amber-400 font-body animate-in fade-in"
        >
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <span>{urlNotice}</span>
        </div>
      )}

      {/* Quick Demo Persona Switcher for Hackathon Judges */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold font-headline uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
            Mode Demo Juri (1-Klik Isi Akun)
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">TCC 2026 UTM</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {demoAccounts.map((acc) => (
            <button
              key={acc.role}
              type="button"
              onClick={() => fillDemo(acc.email)}
              className={`px-2 py-1.5 rounded-lg border text-[11px] font-headline font-semibold transition-all text-center cursor-pointer active:scale-95 ${
                acc.highlight
                  ? "border-primary bg-primary text-primary-foreground shadow-xs ring-2 ring-primary/20"
                  : "border-border bg-card hover:bg-muted text-foreground hover:border-primary/50"
              }`}
              title={`Klik untuk mengisi email ${acc.email}`}
            >
              {acc.role}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Banner */}
        {error && (
          <div
            role="alert"
            className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-2.5 text-xs text-destructive font-body"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-xs font-bold font-headline text-foreground block"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full rounded-xl border border-border bg-muted/30 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-xs font-bold font-headline text-foreground block"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-muted/30 pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
              aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={pending}
          className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-headline font-bold text-sm shadow-xs hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-2"
        >
          {pending ? "Memverifikasi…" : "Masuk"}
        </Button>
      </form>

      {/* Switch to Signup */}
      <div className="pt-3 border-t border-border/80 text-center">
        <p className="text-xs text-muted-foreground font-body">
          Belum punya akun?{" "}
          <Link
            href="/signup"
            className="font-bold text-primary hover:underline underline-offset-4"
          >
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between py-8 px-4 sm:px-6 selection:bg-primary/20 selection:text-primary">
      {/* Top Header with Back Button (Left) & Brand Logo (Right) */}
      <div className="w-full max-w-lg mx-auto flex items-center justify-between gap-3 pb-6">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted border-border font-headline transition-all"
        >
          <Link href="/">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </Button>

        <Link href="/" className="inline-block group py-1">
          <Image
            src={logoText}
            alt="SiklusPangan"
            priority
            className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>
      </div>

      {/* Main Login Card wrapped in Suspense for safe searchParams usage */}
      <main className="w-full max-w-lg mx-auto">
        <Suspense
          fallback={
            <div className="rounded-3xl border border-border bg-card p-9 text-center text-xs text-muted-foreground font-body">
              Memuat form masuk…
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-lg mx-auto pt-6 text-center text-xs text-muted-foreground font-body">
        <p>© {new Date().getFullYear()} SiklusPangan</p>
      </footer>
    </div>
  );
}
