"use client";

import React from "react";
import { CloudOff, Wind, Utensils, Wallet, TrendingUp } from "lucide-react";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const ESG_STAT_DATA = [
  {
    id: "co2_reduction",
    label: "REDUKSI EMISI GRK",
    value: "48.836",
    unit: "kg CO2e",
    icon: CloudOff,
    footerLeft: {
      type: "trend",
      text: "+18.4% YoY",
    },
    footerRight: {
      type: "text",
      text: "Rumus: Waste × 0.58 C...",
    },
  },
  {
    id: "methane_prevented",
    label: "METANA (CH4) DICEGAH",
    value: "3.368",
    unit: "kg CH4",
    icon: Wind,
    footerLeft: {
      type: "highlight",
      text: "Suwung & Bantar Gebang",
    },
    footerRight: {
      type: "text",
      text: "Rumus: Waste ×...",
    },
  },
  {
    id: "food_rescued",
    label: "PANGAN DISELAMATKAN",
    value: "142.850",
    unit: "Porsi",
    icon: Utensils,
    footerLeft: {
      type: "highlight",
      text: "28 Mitra Panti",
    },
    footerRight: {
      type: "text",
      text: "Kualitas Grade-A QA",
    },
  },
  {
    id: "sroi_impact",
    label: "NILAI DAMPAK S-ROI",
    value: "Rp 1,42",
    unit: "Miliar",
    icon: Wallet,
    footerLeft: {
      type: "highlight",
      text: "Logistik Terpadu",
    },
    footerRight: {
      type: "text",
      text: "Rasio 1 : 4.8 Investasi",
    },
  },
];

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function StatSection() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {ESG_STAT_DATA.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)] flex flex-col justify-between gap-5 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Top Row: Label & Icon */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-bold text-muted-foreground font-headline tracking-wider uppercase">
                  {item.label}
                </span>

                <div className="w-9 h-9 rounded-xl border border-primary/25 bg-accent/70 text-primary flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Middle Row: Large Value + Unit */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-[28px] lg:text-[32px] font-extrabold text-foreground font-headline tracking-tight leading-none">
                  {item.value}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-muted-foreground font-body">
                  {item.unit}
                </span>
              </div>

              {/* Bottom Row: Footers & Formula */}
              <div className="pt-3 border-t border-border/70 flex items-center justify-between gap-2 text-[11px] leading-tight font-body">
                {/* Left detail */}
                <div className="min-w-0 truncate">
                  {item.footerLeft.type === "trend" ? (
                    <span className="inline-flex items-center gap-1 font-bold text-primary font-mono text-[11px]">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{item.footerLeft.text}</span>
                    </span>
                  ) : (
                    <span className="font-bold text-primary truncate block font-headline">
                      {item.footerLeft.text}
                    </span>
                  )}
                </div>

                {/* Right detail */}
                <div className="shrink-0 text-right">
                  <span className="text-muted-foreground text-[10px] sm:text-[11px] truncate block">
                    {item.footerRight.text}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
