import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoText from "@/assets/logo-text.webp";

export const metadata = {
  title: "404 - Halaman Tidak Ditemukan | SiklusPangan",
  description: "Halaman yang Anda tuju tidak ditemukan.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between py-8 px-4 sm:px-6 selection:bg-primary/20 selection:text-primary">
      {/* Top Header with Back Button (Left) & Brand Logo (Right) - Matching max-w-lg */}
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

      {/* Main 404 Card - Quiet & Matching max-w-lg */}
      <main className="w-full max-w-lg mx-auto my-auto py-4">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)] text-center space-y-5">
          <div className="font-mono text-5xl sm:text-6xl font-extrabold text-muted-foreground/30 tracking-tight select-none">
            404
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground font-headline tracking-tight">
              Halaman Tidak Ditemukan
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-body max-w-sm mx-auto leading-relaxed">
              Halaman yang Anda tuju tidak tersedia atau rutenya telah dipindahkan.
            </p>
          </div>

          {/* Action Hub */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              asChild
              className="w-full sm:w-auto rounded-xl bg-primary text-primary-foreground font-headline font-bold text-xs px-5 py-2.5 shadow-xs hover:bg-primary/90"
            >
              <Link href="/">
                <span>Ke Halaman Utama</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto rounded-xl border-border font-headline font-semibold text-xs px-5 py-2.5 text-foreground hover:bg-muted"
            >
              <Link href="/rescue">
                <span>Radar Makanan</span>
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-lg mx-auto pt-6 text-center text-xs text-muted-foreground font-body">
        <p>© {new Date().getFullYear()} SiklusPangan</p>
      </footer>
    </div>
  );
}
