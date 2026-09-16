"use client";

import React from "react";
import { ClipboardCheck } from "lucide-react";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const PICKUP_PROTOCOL_CONTENT = {
  title: "Protokol Penjemputan Aman",
  subtitle:
    "Standar rekayasa mutu PT. Timedoor Indonesia untuk eliminasi insiden kontaminasi:",
  steps: [
    {
      number: 1,
      title: "Klaim & Dapatkan Token QR",
      description:
        "Sistem membangkitkan enkripsi token unik berlaku sekali pakai (One-Time Token).",
    },
    {
      number: 2,
      title: "Tiba Sebelum Jendela Safe Until",
      description:
        "Pangan hanya layak serah terima sebelum batas deterministik tercapai demi kepatuhan BPOM.",
    },
    {
      number: 3,
      title: "Dual Scan QR Handover",
      description:
        "Pihak relawan dan perwakilan donatur memindai kode QR bilateral via mobile web.",
    },
    {
      number: 4,
      title: "Cek Fisik & Log Mutu",
      description:
        "Konfirmasi parameter aroma, suhu, dan wadah segel sebelum distribusi akhir.",
    },
  ],
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function PickupProtocolCard() {
  const { title, subtitle, steps } = PICKUP_PROTOCOL_CONTENT;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs">
      {/* Header Row: Clipboard Icon + Title */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-primary flex items-center justify-center shrink-0">
          <ClipboardCheck className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-headline font-bold text-base text-neutral-900">
          {title}
        </h3>
      </div>

      {/* Subtitle / ISO Standards Context */}
      <p className="mt-3 text-xs text-slate-500 font-body leading-relaxed">
        {subtitle}
      </p>

      {/* 4 Protocol Steps List */}
      <div className="mt-4 space-y-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100/90 transition-colors hover:bg-slate-50"
          >
            {/* Numbered Green Badge */}
            <div className="w-5 h-5 rounded bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs font-headline">
              {step.number}
            </div>

            {/* Title & Description */}
            <div className="flex-1">
              <h4 className="text-xs font-bold text-neutral-900 font-headline">
                {step.title}
              </h4>
              <p className="text-[11px] text-slate-500 font-body leading-normal mt-0.5">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
