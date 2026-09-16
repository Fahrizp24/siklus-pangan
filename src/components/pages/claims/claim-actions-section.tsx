"use client";

import React from "react";
import { GitFork, Navigation, Download, HelpCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const CLAIM_ACTIONS_CONTENT = {
  logisticsInfo: {
    title: "Perjalanan Logistik Cepat:",
    description: "Estimasi waktu tempuh roda dua/empat: ~7 menit via Jl. Tantular.",
  },
  buttons: {
    navigate: {
      label: "Buka Navigasi Rute",
      googleMapsUrl: "https://maps.google.com/?q=Jl.+Tantular+Renon+Denpasar",
    },
    downloadPdf: {
      label: "Unduh Bukti Klaim (PDF)",
      fileName: "Bukti-Klaim-CLM-89210-BTO.pdf",
    },
    help: {
      label: "Bantuan / Sengketa",
    },
    cancel: {
      label: "Batalkan Klaim",
    },
  },
  footerPolicy: {
    prefix: "Kebijakan Batalkan Klaim: Pengalihan gratis sebelum pukul ",
    highlightTime: "12:30 WITA",
    suffix: " demi mencegah pembusukan makanan.",
    timestampHash: "Timestamp Hash: 892-104-E29B",
  },
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function ClaimActionsSection() {
  const { logisticsInfo, buttons, footerPolicy } = CLAIM_ACTIONS_CONTENT;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
        {/* Top Content Row: Logistics Notice (Left) & Action Buttons (Right) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Side: Route Fork Icon & Logistics Duration */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-muted/70 text-secondary flex items-center justify-center shrink-0 border border-border/80 shadow-2xs">
              <GitFork className="w-5 h-5 text-secondary" />
            </div>

            <p className="text-xs sm:text-sm font-body leading-relaxed text-muted-foreground">
              <strong className="text-foreground font-bold font-headline mr-1.5">
                {logisticsInfo.title}
              </strong>
              {logisticsInfo.description}
            </p>
          </div>

          {/* Right Side: Action Buttons Grid */}
          <div className="flex flex-col items-stretch lg:items-end gap-2.5 shrink-0">
            {/* Top Row of Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* 1. Buka Navigasi Rute (Green Primary) */}
              <Button
                asChild
                className="bg-primary hover:bg-tertiary text-primary-foreground font-headline font-bold text-xs sm:text-sm rounded-xl px-4 py-2.5 shadow-2xs gap-2 transition-colors"
              >
                <a
                  href={buttons.navigate.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="w-4 h-4 fill-current" />
                  <span>{buttons.navigate.label}</span>
                </a>
              </Button>

              {/* 2. Unduh Bukti Klaim PDF (Navy Secondary) */}
              <Button
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-headline font-bold text-xs sm:text-sm rounded-xl px-4 py-2.5 shadow-2xs gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{buttons.downloadPdf.label}</span>
              </Button>

              {/* 3. Bantuan / Sengketa (Outline) */}
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-muted font-headline font-bold text-xs sm:text-sm rounded-xl px-4 py-2.5 shadow-2xs gap-2 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-muted-foreground" />
                <span>{buttons.help.label}</span>
              </Button>
            </div>

            {/* Bottom Row: Batalkan Klaim (Destructive Outline, Aligned Right) */}
            <Button
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive font-headline font-bold text-xs sm:text-sm rounded-xl px-4 py-2.5 shadow-2xs gap-2 transition-colors self-end"
            >
              <XCircle className="w-4 h-4 text-destructive" />
              <span>{buttons.cancel.label}</span>
            </Button>
          </div>
        </div>

        {/* Bottom Policy & Timestamp Footer Row */}
        <div className="border-t border-border/70 pt-4 mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
            <span className="text-muted-foreground">
              {footerPolicy.prefix}
              <strong className="text-foreground font-bold">
                {footerPolicy.highlightTime}
              </strong>
              {footerPolicy.suffix}
            </span>
          </div>

          <span className="font-mono text-[11px] sm:text-xs text-muted-foreground shrink-0">
            {footerPolicy.timestampHash}
          </span>
        </div>
      </div>
    </section>
  );
}
