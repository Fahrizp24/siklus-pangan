"use client";

import React from "react";
import { Landmark, Recycle, Cloud, Hourglass } from "lucide-react";
import { MetricStatCard } from "@/components/ui/metric-stat-card";

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
        {WALLET_POCKET_DATA.map((item) => (
          <MetricStatCard
            key={item.id}
            label={item.label}
            currency={item.currency}
            value={item.amount}
            icon={item.icon}
            iconStyle={item.iconStyle}
            iconCustomLabel={item.iconCustomLabel}
            footerLeft={item.footerLeft as any}
            footerRight={item.footerRight as any}
          />
        ))}
      </div>
    </section>
  );
}
