"use client";

import React from "react";
import { Download, History } from "lucide-react";
import { Button } from "@/components/ui/button";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const WALLET_HERO_CONTENT = {
  title: "Dompet Sirkular & Rekonsiliasi Finansial",
  description:
    "Pusat insentif reverse tipping fee limbah organik, penyaluran subsidi logistik pangan, dan rekonsiliasi pembayaran mitra pengolah biokonversi BSF secara transparan.",
  buttons: {
    exportFiscal: {
      label: "Ekspor Laporan Fiskal",
    },
    auditLog: {
      label: "Audit Log GHG Scope 3",
    },
  },
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function HeroSection() {
  const { title, description, buttons } = WALLET_HERO_CONTENT;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Side: Title & Description */}
          <div className="flex-1 max-w-3xl">
            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-foreground font-headline tracking-tight leading-tight">
              {title}
            </h1>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-sm text-muted-foreground font-body mt-2 sm:mt-2.5 leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              className="border-border text-foreground hover:bg-muted font-headline font-semibold text-xs sm:text-sm rounded-xl py-2.5 px-4 h-11 gap-2 shadow-2xs"
            >
              <Download className="w-4 h-4 text-muted-foreground" />
              <span>{buttons.exportFiscal.label}</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="border-border text-foreground hover:bg-muted font-headline font-semibold text-xs sm:text-sm rounded-xl py-2.5 px-4 h-11 gap-2 shadow-2xs"
            >
              <History className="w-4 h-4 text-muted-foreground" />
              <span>{buttons.auditLog.label}</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
