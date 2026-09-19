"use client";

import React from "react";
import { Crown, Medal, CheckCircle2, Leaf } from "lucide-react";
import { VerifiedEntity } from "@/components/pages/home/wall-of-fame-section";

interface LeaderboardPodiumProps {
  entities: VerifiedEntity[];
}

export function LeaderboardPodium({ entities }: LeaderboardPodiumProps) {
  const top3 = entities.slice(0, 3);
  if (top3.length < 3) return null;

  const [first, second, third] = top3;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4">
      <div className="text-center space-y-1 mb-8">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary">
          Podium Kehormatan Lingkungan
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground font-headline">
          Top 3 Pemimpin Dekarbonisasi Pangan Bali
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {/* RANK 2 - SILVER */}
        <div className="order-2 md:order-1 rounded-3xl border border-border bg-card p-6 shadow-xs flex flex-col items-center text-center relative hover:border-slate-400/50 transition-all md:translate-y-3">
          <div className="absolute -top-3.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs">
            <Medal className="w-3.5 h-3.5 text-slate-500" />
            <span>PERINGKAT #2</span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-slate-200 text-slate-700 font-headline font-extrabold text-xl flex items-center justify-center my-3 shadow-inner">
            {second.initials}
          </div>

          <h3 className="font-headline font-bold text-base text-foreground leading-snug">
            {second.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 font-body">
            {second.segment} • {second.location}
          </p>

          <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/80">
            <div className="bg-muted/50 p-2.5 rounded-xl text-center">
              <span className="text-[10px] text-muted-foreground font-body block">Surplus Terkelola</span>
              <span className="font-mono text-sm font-bold text-foreground">{second.surplusKg.toLocaleString("id-ID")} kg</span>
            </div>
            <div className="bg-muted/50 p-2.5 rounded-xl text-center">
              <span className="text-[10px] text-muted-foreground font-body block">CO₂e Tercegah</span>
              <span className="font-mono text-sm font-bold text-primary">{second.co2eKg.toLocaleString("id-ID")} kg</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            <span>{second.standard}</span>
          </div>
        </div>

        {/* RANK 1 - GOLD */}
        <div className="order-1 md:order-2 rounded-3xl border-2 border-amber-400/60 bg-linear-to-b from-amber-50/40 via-card to-card p-6 sm:p-7 shadow-[0_8px_30px_rgb(251,191,36,0.12)] flex flex-col items-center text-center relative hover:border-amber-400 transition-all md:-translate-y-3">
          <div className="absolute -top-4 px-4 py-1.5 rounded-full bg-amber-400 text-amber-950 text-xs font-mono font-extrabold flex items-center gap-1.5 shadow-md">
            <Crown className="w-4 h-4 text-amber-950 fill-amber-950" />
            <span>JUARA 1 • GOLD EMISSION SHIELD</span>
          </div>

          <div className="w-20 h-20 rounded-2xl bg-amber-100/80 border-2 border-amber-300 text-amber-900 font-headline font-extrabold text-2xl flex items-center justify-center my-3 shadow-inner ring-4 ring-amber-400/20">
            {first.initials}
          </div>

          <h3 className="font-headline font-extrabold text-lg sm:text-xl text-foreground leading-snug">
            {first.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 font-body">
            {first.segment} • {first.location}
          </p>

          <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-amber-200/50">
            <div className="bg-amber-50/70 p-3 rounded-xl text-center border border-amber-200/40">
              <span className="text-[10px] text-amber-800 font-body block font-medium">Total Surplus Diselamatkan</span>
              <span className="font-mono text-base font-extrabold text-foreground">{first.surplusKg.toLocaleString("id-ID")} kg</span>
            </div>
            <div className="bg-primary/10 p-3 rounded-xl text-center border border-primary/20">
              <span className="text-[10px] text-primary font-body block font-medium">Reduksi Emisi Bersih</span>
              <span className="font-mono text-base font-extrabold text-primary">{first.co2eKg.toLocaleString("id-ID")} kg CO₂e</span>
            </div>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 font-semibold">
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tingkat Diversi {first.diversionRate}% • {first.standard}</span>
          </div>
        </div>

        {/* RANK 3 - BRONZE */}
        <div className="order-3 rounded-3xl border border-border bg-card p-6 shadow-xs flex flex-col items-center text-center relative hover:border-amber-600/40 transition-all md:translate-y-3">
          <div className="absolute -top-3.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200 text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs">
            <Medal className="w-3.5 h-3.5 text-orange-600" />
            <span>PERINGKAT #3</span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-orange-50 border-2 border-orange-200 text-orange-800 font-headline font-extrabold text-xl flex items-center justify-center my-3 shadow-inner">
            {third.initials}
          </div>

          <h3 className="font-headline font-bold text-base text-foreground leading-snug">
            {third.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 font-body">
            {third.segment} • {third.location}
          </p>

          <div className="w-full grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/80">
            <div className="bg-muted/50 p-2.5 rounded-xl text-center">
              <span className="text-[10px] text-muted-foreground font-body block">Surplus Terkelola</span>
              <span className="font-mono text-sm font-bold text-foreground">{third.surplusKg.toLocaleString("id-ID")} kg</span>
            </div>
            <div className="bg-muted/50 p-2.5 rounded-xl text-center">
              <span className="text-[10px] text-muted-foreground font-body block">CO₂e Tercegah</span>
              <span className="font-mono text-sm font-bold text-primary">{third.co2eKg.toLocaleString("id-ID")} kg</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            <span>{third.standard}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
