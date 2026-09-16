"use client";

import React from "react";
import { TrendingUp, Utensils, Recycle, ShieldCheck, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export interface StatItem {
  id: string;
  label: string;
  value: string;
  unit?: string;
  context: string;
  icon: React.ElementType;
  isAccent?: boolean;
}

export const HOME_STATS_DATA: StatItem[] = [
  {
    id: "rescued-food",
    label: "PANGAN TERSELAMATKAN",
    value: "142,850",
    unit: "porsi",
    context: "+12.4% peningkatan minggu ini",
    icon: Utensils,
    isAccent: true,
  },
  {
    id: "diverted-waste",
    label: "RESIDU MAKANAN DIALIHKAN",
    value: "84,200",
    unit: "kg",
    context: "Diolah biokonversi BSF dari TPA",
    icon: Recycle,
  },
  {
    id: "co2-reduced",
    label: "REDUKSI EMISI GAS RUMAH KACA",
    value: "48,836",
    unit: "kg CO₂e",
    context: "Audit kepatuhan GHG Scope 3",
    icon: ShieldCheck,
  },
  {
    id: "economic-value",
    label: "NILAI EKONOMI SIRKULAR",
    value: "Rp 1.42 M",
    context: "Insentif reverse tipping fee mitra",
    icon: Wallet,
    isAccent: true,
  },
];

export function StatSection() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {HOME_STATS_DATA.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-[0_4px_20px_-2px_rgba(11,27,61,0.04)] flex flex-col justify-between hover:border-primary/30 transition-colors"
            >
              {/* Header: Label & Icon */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase font-headline">
                    {stat.label}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-muted/80 flex items-center justify-center shrink-0 border border-border/80">
                    <Icon className="w-3.5 h-3.5 text-foreground/80" />
                  </div>
                </div>

                {/* Stat Big Value */}
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span
                    className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-headline ${
                      stat.isAccent ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {stat.value}
                  </span>
                  {stat.unit && (
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground font-headline">
                      {stat.unit}
                    </span>
                  )}
                </div>
              </div>

              {/* Context / Methodology Subtext */}
              <div className="mt-4 pt-3 border-t border-border/70 flex items-center gap-1.5 text-xs">
                {stat.isAccent && (
                  <TrendingUp className="w-3.5 h-3.5 text-tertiary shrink-0 stroke-[2.5]" />
                )}
                <span className="font-medium text-muted-foreground text-[11px] sm:text-xs">
                  {stat.context}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
