import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoText from "@/assets/logo-text.webp";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between py-8 px-4 sm:px-6 selection:bg-primary/20 selection:text-primary">
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

      <main className="w-full max-w-lg mx-auto">
        <div className="rounded-3xl border border-border bg-card p-7 sm:p-9 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)] space-y-6">
          {children}
        </div>
      </main>

      <footer className="w-full max-w-lg mx-auto pt-6 text-center text-xs text-muted-foreground font-body">
        <p>© {new Date().getFullYear()} SiklusPangan</p>
      </footer>
    </div>
  );
}
