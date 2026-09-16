"use client";

import React from "react";
import { Recycle, Bug, Sprout, Leaf, Wallet, TrendingUp } from "lucide-react";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export interface WasteStatItem {
  id: string;
  title: string;
  value: string;
  unit?: string;
  icon: React.ComponentType<{ className?: string }>;
  footer: {
    type: "trend" | "text" | "formula_badge" | "highlight";
    text: string;
    badgePrefix?: string;
  };
}

export const WASTE_STATS_DATA: WasteStatItem[] = [
  {
    id: "waste-diverted",
    title: "Total Limbah Dialihkan",
    value: "84,200",
    unit: "kg",
    icon: Recycle,
    footer: {
      type: "trend",
      text: "Bulan ini: +14.2%",
    },
  },
  {
    id: "bsf-larvae",
    title: "Larva BSF Dihasilkan",
    value: "16,840",
    unit: "kg",
    icon: Bug,
    footer: {
      type: "text",
      text: "Protein pakan ternak bernilai tinggi",
    },
  },
  {
    id: "kasgot-fertilizer",
    title: "Pupuk Organik Kasgot",
    value: "25,260",
    unit: "kg",
    icon: Sprout,
    footer: {
      type: "text",
      text: "Kompos terdistribusi ke petani lokal",
    },
  },
  {
    id: "methane-prevented",
    title: "Metana (CH4) Dicegah",
    value: "3,368",
    unit: "kg",
    icon: Leaf,
    footer: {
      type: "formula_badge",
      badgePrefix: "Limbah × 0.04",
      text: "GHG Protocol",
    },
  },
  {
    id: "tipping-fee-saved",
    title: "Tipping Fee Dihemat",
    value: "Rp 42.1M",
    icon: Wallet,
    footer: {
      type: "highlight",
      text: "Subsidi sirkular otomatis",
    },
  },
];

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function StatSection() {
  const stats = WASTE_STATS_DATA;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.id}
              className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)] flex flex-col justify-between gap-4 transition-all hover:shadow-md"
            >
              {/* Top Header: Title & Green Icon */}
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-medium text-muted-foreground font-body leading-tight">
                  {stat.title}
                </h3>
                <Icon className="w-4 h-4 text-primary shrink-0 stroke-[2.2]" />
              </div>

              {/* Middle: Big Metric Value & Unit */}
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-2xl sm:text-[28px] font-extrabold text-foreground font-headline tracking-tight leading-none">
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-xs sm:text-sm font-semibold text-muted-foreground font-body">
                    {stat.unit}
                  </span>
                )}
              </div>

              {/* Bottom Footer: Trend / Formula / Context */}
              <div className="pt-2 border-t border-border/60">
                {stat.footer.type === "trend" && (
                  <div className="inline-flex items-center gap-1 text-xs font-bold text-primary font-headline">
                    <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                    <span>{stat.footer.text}</span>
                  </div>
                )}

                {stat.footer.type === "text" && (
                  <p className="text-xs text-muted-foreground font-body truncate leading-normal">
                    {stat.footer.text}
                  </p>
                )}

                {stat.footer.type === "formula_badge" && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body">
                    <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border shrink-0">
                      {stat.footer.badgePrefix}
                    </span>
                    <span className="text-[11px] font-medium truncate">
                      {stat.footer.text}
                    </span>
                  </div>
                )}

                {stat.footer.type === "highlight" && (
                  <span className="text-xs font-bold text-primary font-headline block truncate">
                    {stat.footer.text}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
