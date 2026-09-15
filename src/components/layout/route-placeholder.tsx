import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";

export function RoutePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <AppShell>
      <main className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center p-6">
        <section className="glass-panel w-full rounded-2xl p-8 text-center shadow-sm">
          <Construction className="mx-auto mb-4 h-10 w-10 text-primary" />
          <p className="text-sm font-semibold text-primary font-label">Route aktif</p>
          <h1 className="mt-2 text-3xl font-bold font-headline text-foreground">{title}</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground font-body">{description}</p>
          <div className="mt-6">
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/" className="inline-flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Kembali ke beranda
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
