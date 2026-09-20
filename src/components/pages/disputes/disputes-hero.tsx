"use client";

import React from "react";
import { Scale, ShieldAlert, CheckCircle2, Clock, Users } from "lucide-react";
import { DisputeSummary } from "@/actions/disputes";

interface DisputesHeroProps {
  summary: DisputeSummary;
}

export function DisputesHero({ summary }: DisputesHeroProps) {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/80">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-mono font-bold text-primary">
            <Scale className="w-3.5 h-3.5" />
            <span>Hak Sanggah 1x24 Jam</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground font-headline tracking-tight">
            Pusat Mediasi Mutu & Komplain
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-body leading-relaxed">
            Mekanisme audit berimbang untuk melindungi integritas donatur dan keamanan penerima pangan. Setiap laporan ketidaksesuaian diberikan tenggat pembuktian rantai dingin sebelum penjatuhan sanksi.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-muted/60 px-3.5 py-2 rounded-xl border border-border shrink-0">
          <ShieldAlert className="w-4 h-4 text-primary shrink-0" />
          <span>SOP Investigasi Berstandar HACCP</span>
        </div>
      </div>

      {/* 4 Telemetry KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 pt-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs hover:border-amber-400/50 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-xs font-headline font-semibold">Sengketa Menunggu Sanggah</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-extrabold text-amber-600">
            {summary.activeDisputesCount} <span className="text-xs font-normal text-muted-foreground">kasus</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-body">Tenggat waktu berjalan</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-xs font-headline font-semibold">Kasus Terselesaikan</span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-extrabold text-foreground">
            {summary.resolvedDisputesCount} <span className="text-xs font-normal text-muted-foreground">kasus</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-body">Klarifikasi suhu valid</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-xs font-headline font-semibold">Tingkat Kepatuhan</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">Audit</span>
          </div>
          <div className="font-mono text-xl sm:text-2xl font-extrabold text-primary">
            {summary.complianceRate}%
          </div>
          <span className="text-[11px] text-emerald-600 font-medium font-body">Standar keamanan terjaga</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-xs font-headline font-semibold">Akun Terkena 3-Strike</span>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-extrabold text-foreground">
            {summary.accountsBlockedCount} <span className="text-xs font-normal text-muted-foreground">akun</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-body">Nol toleransi kontaminasi</span>
        </div>
      </div>
    </section>
  );
}
