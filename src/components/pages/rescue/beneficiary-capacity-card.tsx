"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const BENEFICIARY_CAPACITY_DATA = {
  title: "Kapasitas Beneficiary",
  statusBadge: "Tingkat Aman",
  label: "Porsi Terserap Hari Ini:",
  consumedPortions: 45,
  totalCapacityPortions: 150,
  foundationName: "Yayasan Sayap Ibu",
  description:
    "Sisa kuota harian: 105 porsi untuk Yayasan Sayap Ibu. Kuota diperbarui otomatis setiap pukul 00.00 WITA untuk pemerataan distribusi panti & komunitas.",
  historyButtonText: "Histori Klaim",
  reportButtonText: "Lapor Mutu Pangan",
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function BeneficiaryCapacityCard() {
  const {
    title,
    statusBadge,
    label,
    consumedPortions,
    totalCapacityPortions,
    description,
    historyButtonText,
    reportButtonText,
  } = BENEFICIARY_CAPACITY_DATA;

  const percentage = Math.min(
    100,
    Math.round((consumedPortions / totalCapacityPortions) * 100)
  );

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs">
      {/* Header Row: Shield Icon + Title (Left) and Tingkat Aman Badge (Right) */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-headline font-bold text-base text-neutral-900">
            {title}
          </h3>
        </div>

        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-primary border border-emerald-200/80">
          {statusBadge}
        </span>
      </div>

      {/* Consumption Metrics Row */}
      <div className="mt-4 flex items-baseline justify-between text-xs sm:text-sm">
        <span className="text-slate-600 font-medium">{label}</span>
        <div className="flex items-baseline">
          <span className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-headline">
            {consumedPortions}
          </span>
          <span className="text-xs text-slate-400 font-medium ml-1">
            / {totalCapacityPortions} Porsi
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-2.5 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Helper Description */}
      <p className="mt-3 text-xs text-slate-500 font-body leading-relaxed">
        {description}
      </p>

      {/* Actions: Histori Klaim & Lapor Mutu Pangan */}
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs font-semibold rounded-xl border-slate-200 text-neutral-800 hover:bg-slate-50 shadow-2xs"
        >
          {historyButtonText}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs font-semibold rounded-xl border-slate-200 text-neutral-800 hover:bg-slate-50 shadow-2xs"
        >
          {reportButtonText}
        </Button>
      </div>
    </div>
  );
}
