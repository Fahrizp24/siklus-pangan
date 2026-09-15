import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

export function RoutePlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <AppShell>
      <main className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center p-6">
        <section className="glass-panel w-full rounded-2xl p-8 text-center">
          <Construction className="mx-auto mb-4 h-10 w-10 text-blue-400" />
          <p className="text-sm font-semibold text-emerald-400">Route aktif</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-50">{title}</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">{description}</p>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4" /> Kembali ke beranda
          </Link>
        </section>
      </main>
    </AppShell>
  );
}
