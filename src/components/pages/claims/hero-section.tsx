"use client";

import React from "react";
import { Timer, ShieldCheck } from "lucide-react";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const CLAIM_HERO_CONTENT = {
  claimId: "#CLM-89210-BTO",
  statusBadge: "MENUNGGU PENJEMPUTAN (Siap Diambil)",
  protocolBadge: "Protokol Otomatis Serah Terima B2B",
  title: "Penjemputan Pangan Terjadwal: Gourmet Bento Box (35 Porsi)",
  descriptionPrefix: "Alokasi disahkan untuk ",
  beneficiaryName: "Yayasan Sayap Ibu (Posko Cabang Denpasar Selatan)",
  descriptionSuffix: ". Harap tiba di titik koordinat sebelum batas aman.",
  timer: {
    pickupWindowLabel: "Batas Jendela Penjemputan:",
    pickupWindowTime: "13:45 WITA",
    remainingHoursMinutes: "01 Jam 18 Menit",
    remainingLabel: "(Tersisa)",
    deterministicBpomLabel: "Batas Konsumsi Deterministic BPOM:",
    deterministicBpomTime: "14:00 WITA",
  },
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function HeroSection() {
  const {
    claimId,
    statusBadge,
    protocolBadge,
    title,
    descriptionPrefix,
    beneficiaryName,
    descriptionSuffix,
    timer,
  } = CLAIM_HERO_CONTENT;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Side: Badges, Headline, Description */}
          <div className="flex-1">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Claim ID Badge */}
              <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white font-mono text-xs font-bold tracking-wide">
                {claimId}
              </span>

              {/* Status Badge with Live Green Indicator */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{statusBadge}</span>
              </span>

              {/* Protocol Badge */}
              <span className="px-2.5 py-1 rounded-md bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium">
                {protocolBadge}
              </span>
            </div>

            {/* Headline Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-neutral-900 font-headline tracking-tight leading-tight mt-4">
              {title}
            </h1>

            {/* Subtext Description */}
            <p className="text-xs sm:text-sm text-slate-600 font-body leading-relaxed max-w-2xl mt-3">
              {descriptionPrefix}
              <strong className="text-neutral-900 font-semibold">
                {beneficiaryName}
              </strong>
              {descriptionSuffix}
            </p>
          </div>

          {/* Right Side: Pickup Window Countdown Card */}
          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 sm:p-5 flex items-start gap-4 shrink-0 w-full lg:w-96 shadow-2xs">
            {/* Timer Icon Box */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60">
              <Timer className="w-6 h-6 text-emerald-700" />
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0">
              {/* Top Row: Label and Specific WITA Hour */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  {timer.pickupWindowLabel}
                </span>
                <span className="font-mono font-bold text-neutral-900">
                  {timer.pickupWindowTime}
                </span>
              </div>

              {/* Middle Row: Countdown Display */}
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-extrabold font-headline text-lg sm:text-xl text-neutral-900 tracking-tight">
                  {timer.remainingHoursMinutes}
                </span>
                <span className="text-xs text-emerald-600 font-bold">
                  {timer.remainingLabel}
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200/80 pt-2.5 mt-2.5">
                {/* Bottom Row: Deterministic BPOM Expiry Limit */}
                <div className="flex items-start gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-tight">
                    <span className="text-slate-500 block">
                      {timer.deterministicBpomLabel}
                    </span>
                    <span className="font-mono font-bold text-neutral-900 block mt-0.5">
                      {timer.deterministicBpomTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
