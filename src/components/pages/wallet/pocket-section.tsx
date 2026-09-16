"use client";

import React from "react";
import { Landmark, Recycle, Cloud, Hourglass, TrendingUp } from "lucide-react";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const WALLET_POCKET_DATA = [
  {
    id: "active_balance",
    label: "Saldo Aktif Dapat Ditarik",
    currency: "Rp",
    amount: "14.850.000",
    icon: Landmark,
    iconStyle: "text-primary border-primary/30 bg-accent/60",
    footerLeft: {
      type: "badge",
      dot: true,
      text: "Siap Payout Mandiri / BCA",
    },
    footerRight: {
      type: "text",
      text: "Instant 24/7",
    },
  },
  {
    id: "reverse_tipping",
    label: "Akumulasi Reverse Tipping Fee",
    currency: "Rp",
    amount: "42.100.000",
    icon: Recycle,
    iconStyle: "text-muted-foreground border-border bg-muted/60",
    footerLeft: {
      type: "text",
      prefix: "Dari ",
      boldText: "84.200 kg",
      suffix: " limbah organik",
    },
    footerRight: {
      type: "trend",
      text: "+14.2% YoY",
    },
  },
  {
    id: "logistics_carbon_subsidy",
    label: "Subsidi Logistik & Karbon",
    currency: "Rp",
    amount: "8.450.000",
    icon: Cloud,
    iconStyle: "text-muted-foreground border-border bg-muted/60",
    iconCustomLabel: "CO₂",
    footerLeft: {
      type: "text",
      prefix: "Tersertifikasi ",
      boldText: "IDXCarbon",
    },
    footerRight: {
      type: "text",
      boldText: "Scope 3 Offset",
    },
  },
  {
    id: "pending_escrow",
    label: "Pending Settlement (Escrow)",
    currency: "Rp",
    amount: "1.250.000",
    icon: Hourglass,
    iconStyle: "text-amber-600 border-amber-300 bg-amber-50/80",
    footerLeft: {
      type: "warning_text",
      text: "Batch timbangan dock IoT verif",
    },
    footerRight: {
      type: "text",
      text: "3 Batch aktif",
    },
  },
];

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function PocketSection() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {WALLET_POCKET_DATA.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)] flex flex-col justify-between gap-5 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Top Row: Label & Icon */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-foreground font-headline leading-snug">
                  {item.label}
                </span>

                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${item.iconStyle}`}
                >
                  {item.iconCustomLabel ? (
                    <span className="font-mono text-[10px] font-bold tracking-tight">
                      {item.iconCustomLabel}
                    </span>
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
              </div>

              {/* Middle Row: Monetary Amount */}
              <div>
                <span className="text-xs font-extrabold text-foreground font-headline block">
                  {item.currency}
                </span>
                <span className="text-2xl sm:text-[26px] lg:text-[28px] font-extrabold text-foreground font-headline tracking-tight block mt-0.5">
                  {item.amount}
                </span>
              </div>

              {/* Bottom Row: Details & Badges */}
              <div className="pt-3 border-t border-border/70 flex items-center justify-between gap-2 text-[11px] leading-tight font-body">
                {/* Left detail */}
                <div className="min-w-0 truncate">
                  {item.footerLeft.type === "badge" ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-accent/80 border border-primary/25 text-primary text-[10px] font-medium font-mono">
                      {item.footerLeft.dot && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                      <span className="truncate">{item.footerLeft.text}</span>
                    </span>
                  ) : item.footerLeft.type === "warning_text" ? (
                    <span className="text-amber-700 font-medium truncate block">
                      {item.footerLeft.text}
                    </span>
                  ) : (
                    <span className="text-muted-foreground truncate block">
                      {item.footerLeft.prefix}
                      {item.footerLeft.boldText && (
                        <strong className="text-foreground font-bold font-headline">
                          {item.footerLeft.boldText}
                        </strong>
                      )}
                      {item.footerLeft.suffix}
                    </span>
                  )}
                </div>

                {/* Right detail */}
                <div className="shrink-0 text-right">
                  {item.footerRight.type === "trend" ? (
                    <span className="inline-flex items-center gap-1 font-bold text-primary text-[11px] font-mono">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{item.footerRight.text}</span>
                    </span>
                  ) : item.footerRight.boldText ? (
                    <span className="font-bold text-foreground font-headline">
                      {item.footerRight.boldText}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-[10px] sm:text-[11px]">
                      {item.footerRight.text}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
