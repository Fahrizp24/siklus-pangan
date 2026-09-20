"use client";

import React from "react";
import { ShieldCheck, AlertCircle, AlertOctagon, HelpCircle } from "lucide-react";

export function DisputesPolicyCard() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-6">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex items-center gap-2 border-b border-border/80 pb-3">
          <HelpCircle className="w-4 h-4 text-primary" />
          <h3 className="font-headline font-bold text-sm sm:text-base text-foreground">
            Alur Penegakan Standar & Protokol 3-Strike SiklusPangan
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700">
              <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">1</span>
              <span>STRIKE PERTAMA</span>
            </div>
            <h4 className="font-headline font-bold text-xs text-foreground">Peringatan & Audit Mandiri</h4>
            <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
              Donatur menerima notifikasi peringatan resmi dan diwajibkan mengunggah checklist verifikasi suhu kulkas/chiller 4°C sebelum dapat mempublikasikan donasi baru.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-orange-700">
              <span className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">2</span>
              <span>STRIKE KEDUA</span>
            </div>
            <h4 className="font-headline font-bold text-xs text-foreground">Penangguhan Akses 7 Hari</h4>
            <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
              Akses publikasi makanan surplus ditangguhkan selama 7x24 jam. Donatur wajib mengikuti sesi penyegaran standar HACCP dan Good Manufacturing Practices (GMP).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-700">
              <span className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">3</span>
              <span>STRIKE KETIGA</span>
            </div>
            <h4 className="font-headline font-bold text-xs text-foreground">Pembekuan Akun Permanen</h4>
            <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
              Akun dinonaktifkan secara permanen dari ekosistem, deposit saldo dibekukan, dan laporan kepatuhan diteruskan kepada dinas pengawas lingkungan hidup terkait.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2 text-xs text-muted-foreground font-body">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span>
            Keputusan audit mediasi mengacu pada Peraturan BPOM No. 22 Tahun 2018 tentang Pedoman Cara Produksi Pangan Olahan yang Baik (CPPOB).
          </span>
        </div>
      </div>
    </section>
  );
}
