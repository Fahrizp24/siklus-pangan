"use client";

import React from "react";
import { Users, Utensils, Recycle, Coins } from "lucide-react";
import { AdminTelemetry } from "@/actions/admin";

interface AdminHeroProps {
  telemetry: AdminTelemetry;
}

export function AdminHero({ telemetry }: AdminHeroProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/80">
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground font-headline tracking-tight">
            Dasbor Moderasi Sistem & Audit Ekosistem
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-body leading-relaxed">
            Pusat pengawasan kepatuhan higienitas pangan olahan, moderasi komplain, penegakan sanksi, dan rekonsiliasi reverse tipping fee limbah organik Bali.
          </p>
        </div>
      </div>

      {/* 4 Telemetry KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 pt-6">
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-xs font-headline font-semibold">Pengguna Terdaftar</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-extrabold text-foreground">
            {telemetry.totalUsers} <span className="text-xs font-normal text-muted-foreground">entitas</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-body">Donatur, Penerima, Pengolah</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-xs font-headline font-semibold">Listing Pangan Aktif</span>
            <Utensils className="w-4 h-4 text-primary" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-extrabold text-foreground">
            {telemetry.activeListings} <span className="text-xs font-normal text-muted-foreground">paket</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-body">Tervalidasi batas aman BPOM</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-xs font-headline font-semibold">Batch Residu Terkelola</span>
            <Recycle className="w-4 h-4 text-primary" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-extrabold text-foreground">
            {telemetry.totalWasteBatches} <span className="text-xs font-normal text-muted-foreground">batch</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-body">Biokonversi BSF & Kompos</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/40 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground mb-1.5">
            <span className="text-xs font-headline font-semibold">Reverse Tipping Fee</span>
            <Coins className="w-4 h-4 text-primary" />
          </div>
          <div className="font-mono text-xl sm:text-2xl font-extrabold text-primary">
            Rp{telemetry.totalTippingFeeDisbursed.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] text-muted-foreground font-body">Insentif armada sirkular</span>
        </div>
      </div>
    </section>
  );
}
