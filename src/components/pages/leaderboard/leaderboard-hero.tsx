"use client";

import React from "react";
import { TrendingUp, Sparkles } from "lucide-react";

interface LeaderboardHeroProps {
  totalSurplusKg: number;
  totalCo2eKg: number;
  totalMealsRescued: number;
  avgDiversionRate: number;
}

export function LeaderboardHero({
  totalSurplusKg,
  totalCo2eKg,
  totalMealsRescued,
  avgDiversionRate,
}: LeaderboardHeroProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/80">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground font-headline tracking-tight">
            Peringkat Dekarbonisasi Pangan & Sirkularitas
          </h1>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Transparansi kontribusi industri perhotelan, katering korporat, restoran, dan fasilitas biokonversi dalam mencegah emisi gas metana dari timbunan pangan di TPA.
          </p>
        </div>
      </div>

      {/* 4 Telemetry Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 pt-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-xs font-headline font-semibold">Surplus Pangan Terselamatkan</span>
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-extrabold text-foreground">
            {totalSurplusKg.toLocaleString("id-ID")} <span className="text-xs font-normal text-muted-foreground">kg</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-body">Katering & Hotel B2B</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-xs font-headline font-semibold">Porsi Pangan Tersalurkan</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-extrabold text-foreground">
            {totalMealsRescued.toLocaleString("id-ID")} <span className="text-xs font-normal text-muted-foreground">porsi</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-body">Komunitas & Panti Asuhan</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-xs font-headline font-semibold">Reduksi Emisi Scope 3</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">CO₂e</span>
          </div>
          <div className="font-mono text-xl sm:text-2xl font-extrabold text-primary">
            {totalCo2eKg.toLocaleString("id-ID")} <span className="text-xs font-normal text-muted-foreground">kg</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-body">Metana Dicegah dari TPA</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-xs font-headline font-semibold">Rata-rata Diversi TPA</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-foreground font-bold">Sirkular</span>
          </div>
          <div className="font-mono text-xl sm:text-2xl font-extrabold text-foreground">
            {avgDiversionRate}%
          </div>
          <span className="text-[11px] text-emerald-600 font-medium font-body">+4.2% dari target DLHK</span>
        </div>
      </div>
    </section>
  );
}
