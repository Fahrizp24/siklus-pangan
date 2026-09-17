"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { signUp } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export default function SignupForm() {
  const [role, setRole] = useState("beneficiary");
  const [organization, setOrganization] = useState("individual");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(formData: FormData) {
    setPending(true);
    setMessage(null);

    try {
      const result = await signUp(formData);
      if (result.success) {
        setMessage({
          text: result.message ?? "Akun berhasil dibuat. Silakan periksa email untuk konfirmasi akun Anda.",
          isError: false,
        });
      } else {
        setMessage({
          text: result.error ?? "Gagal membuat akun.",
          isError: true,
        });
      }
    } catch {
      setMessage({
        text: "Terjadi kesalahan koneksi saat membuat akun.",
        isError: true,
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-headline tracking-tight">
          Daftar Akun
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground font-body">
          Lengkapi data untuk mulai menggunakan platform.
        </p>
      </div>

      {message && (
        <div
          role="status"
          className={`p-4 rounded-2xl border flex flex-col gap-2 ${
            message.isError
              ? "bg-destructive/10 border-destructive/25 text-destructive"
              : "bg-emerald-500/10 border-emerald-500/25 text-emerald-900 dark:text-emerald-200"
          }`}
        >
          <div className="flex items-start gap-2.5">
            {message.isError ? (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold font-headline text-sm">
                {message.isError ? "Pendaftaran Belum Berhasil" : "Akun Berhasil Dibuat"}
              </h4>
              <p className="text-xs font-body mt-0.5 opacity-90 leading-relaxed">
                {message.text}
              </p>
            </div>
          </div>

          {!message.isError && (
            <Button
              asChild
              className="self-start mt-1 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/login">
                <span>Lanjut Masuk</span>
              </Link>
            </Button>
          )}
        </div>
      )}

      {(!message || message.isError) && (
        <form action={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="displayName"
                className="text-xs font-bold font-headline text-foreground block"
              >
                Nama lengkap
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  placeholder="Nama lengkap"
                  className="w-full rounded-xl border border-border bg-muted/30 pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body"
                />
              </div>
            </div>

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
                  placeholder="nama@email.com"
                  className="w-full rounded-xl border border-border bg-muted/30 pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  autoComplete="new-password"
                  minLength={8}
                  required
                  placeholder="Min 8 karakter"
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

            <div className="space-y-1.5">
              <label
                htmlFor="phoneNumber"
                className="text-xs font-bold font-headline text-foreground block"
              >
                Nomor telepon
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  placeholder="08123456789"
                  className="w-full rounded-xl border border-border bg-muted/30 pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="address"
              className="text-xs font-bold font-headline text-foreground block"
            >
              Alamat
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3 pointer-events-none" />
              <textarea
                id="address"
                name="address"
                required
                rows={2}
                placeholder="Alamat lengkap operasional"
                className="w-full rounded-xl border border-border bg-muted/30 pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body resize-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="role"
              className="text-xs font-bold font-headline text-foreground block"
            >
              Daftar sebagai
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body cursor-pointer"
            >
              <option value="beneficiary">Penerima manfaat</option>
              <option value="donor">Donatur</option>
              <option value="processor">Pengolah limbah</option>
            </select>
          </div>

          {role === "beneficiary" && (
            <fieldset className="p-3.5 rounded-2xl bg-muted/20 border border-border/80 space-y-3">
              <legend className="text-xs font-semibold text-muted-foreground px-1">
                Tipe penerima manfaat
              </legend>

              <div className="flex gap-5">
                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-body text-foreground">
                  <input
                    type="radio"
                    name="isOrganization"
                    value="individual"
                    checked={organization === "individual"}
                    onChange={() => setOrganization("individual")}
                    className="accent-primary w-4 h-4"
                  />
                  <span>Perorangan</span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-body text-foreground">
                  <input
                    type="radio"
                    name="isOrganization"
                    value="organization"
                    checked={organization === "organization"}
                    onChange={() => setOrganization("organization")}
                    className="accent-primary w-4 h-4"
                  />
                  <span>Organisasi</span>
                </label>
              </div>

              {organization === "organization" && (
                <div className="space-y-1.5 pt-1">
                  <label
                    htmlFor="organizationCapacity"
                    className="text-xs font-bold font-headline text-foreground block"
                  >
                    Jumlah anggota/kapasitas
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="organizationCapacity"
                      name="organizationCapacity"
                      type="number"
                      min="1"
                      required
                      placeholder="Kapasitas penerima manfaat"
                      className="w-full rounded-xl border border-border bg-card pl-10 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono"
                    />
                  </div>
                </div>
              )}
            </fieldset>
          )}

          <Button
            type="submit"
            disabled={pending}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-headline font-bold text-sm shadow-xs hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {pending ? "Membuat akun…" : "Daftar"}
          </Button>
        </form>
      )}

      <div className="pt-3 border-t border-border/80 text-center">
        <p className="text-xs text-muted-foreground font-body">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-bold text-primary hover:underline underline-offset-4"
          >
            Masuk
          </Link>
        </p>
      </div>
    </>
  );
}
