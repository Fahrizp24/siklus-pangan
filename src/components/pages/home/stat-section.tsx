"use client";

import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  subtext: string;
  isGreenValue?: boolean;
  isGreenSubtext?: boolean;
  hasTrendingIcon?: boolean;
}

export const STATS_DATA: StatCardProps[] = [
  {
    title: "PANGAN TERSELAMATKAN",
    value: "142,850",
    subtext: "+12.4% minggu ini",
    isGreenValue: true,
    isGreenSubtext: true,
    hasTrendingIcon: true,
  },
  {
    title: "LIMBAH DIALIHKAN",
    value: "84,200",
    unit: "kg",
    subtext: "Biokonversi BSF & Kompos",
    isGreenValue: false,
  },
  {
    title: "CH4 (METANA) DICEGAH",
    value: "3,368",
    unit: "kg",
    subtext: "Formula: Waste × 0.04",
    isGreenValue: false,
  },
  {
    title: "REDUKSI EMISI CO2E",
    value: "48,836",
    unit: "kg",
    subtext: "Formula: Waste × 0.58",
    isGreenValue: false,
  },
  {
    title: "NILAI SIRKULAR",
    value: "Rp 1.42 M",
    subtext: "Terdistribusi ke Mitra",
    isGreenValue: true,
    isGreenSubtext: true,
  },
];

export function StatSection() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {STATS_DATA.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.07 }}
            className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_4px_20px_-2px_rgba(11,27,61,0.04)] flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            {/* Header / Title */}
            <div>
              <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase font-headline">
                {stat.title}
              </p>

              {/* Stat Value */}
              <div className="mt-3 flex items-baseline">
                <span
                  className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-headline ${
                    stat.isGreenValue ? "text-primary" : "text-neutral-900"
                  }`}
                >
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="ml-1 text-sm sm:text-base font-normal text-slate-500 font-headline">
                    {stat.unit}
                  </span>
                )}
              </div>
            </div>

            {/* Subtext / Formula / Trend */}
            <div className="mt-4 pt-1 flex items-center gap-1.5 text-xs">
              {stat.hasTrendingIcon && (
                <TrendingUp className="w-3.5 h-3.5 text-primary shrink-0 stroke-[2.5]" />
              )}
              <span
                className={`font-medium leading-none ${
                  stat.isGreenSubtext
                    ? "text-primary font-semibold"
                    : "text-slate-500"
                }`}
              >
                {stat.subtext}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
