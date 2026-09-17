import React from "react";
import {
  CloudOff,
  Wind,
  Utensils,
  Wallet,
  Bug,
  Sprout,
} from "lucide-react";
import { Card, MetricStatCard } from "@/components/ui";

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
      type: "trend" as const,
      text: "+18.4% YoY",
    },
    footerRight: {
      type: "text" as const,
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
      type: "highlight" as const,
      text: "Suwung & Bantar Gebang",
    },
    footerRight: {
      type: "text" as const,
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
      type: "highlight" as const,
      text: "28 Mitra Panti",
    },
    footerRight: {
      type: "text" as const,
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
      type: "highlight" as const,
      text: "Logistik Terpadu",
    },
    footerRight: {
      type: "text" as const,
      text: "Rasio 1 : 4.8 Investasi",
    },
  },
];

export const ESG_SCOPE_DATA = {
  title: "Breakdown Emisi per Scope",
  badge: "GHG Protocol",
  subtitle:
    "Alokasi metrik dekarbonisasi rantai pasok PT Boga Sejahtera menurut inventarisasi Scope 1, 2, dan 3.",
  scopes: [
    {
      id: "scope1",
      name: "Scope 1: Armada Distribusi EV",
      value: "3.420 kg (7%)",
      percentage: 7,
      colorBox: "bg-[#3B4B66]",
      barColor: "bg-[#3B4B66]",
    },
    {
      id: "scope2",
      name: "Scope 2: Cold Storage Fasilitas",
      value: "8.210 kg (17%)",
      percentage: 17,
      colorBox: "bg-secondary",
      barColor: "bg-secondary",
    },
    {
      id: "scope3",
      name: "Scope 3: Limbah & Pangan Selamat",
      value: "37.206 kg (76%)",
      percentage: 76,
      colorBox: "bg-primary",
      barColor: "bg-primary",
    },
  ],
  targetNetZero: {
    title: "Target Intermediat Net-Zero 2030",
    subtitle: "Progres Kepatuhan Trajektori SBTi",
    progressPercent: 68,
    milestones: [
      { label: "Baseline 2023: 0%" },
      { label: "Target Q4 2025: 75%" },
      { label: "Net-Zero 2030: 100%" },
    ],
  },
};

export const ESG_CHART_DATA = {
  title: "Tren Reduksi Bulanan & Rasio Biokonversi",
  subtitle: "Komparasi Baseline Emisi vs Aktual Terverifikasi (Jan - Mei 2025)",
  legend: {
    baseline: "Baseline TPA",
    actual: "Aktual Tereduksi",
  },
  monthlyData: [
    { month: "Jan", baselineHeight: 52, actualHeight: 58, isCurrent: false },
    { month: "Feb", baselineHeight: 54, actualHeight: 65, isCurrent: false },
    { month: "Mar", baselineHeight: 56, actualHeight: 76, isCurrent: false },
    { month: "Apr", baselineHeight: 58, actualHeight: 84, isCurrent: false },
    { month: "Mei", baselineHeight: 55, actualHeight: 95, isCurrent: true },
  ],
  bottomCards: [
    {
      id: "bsf_feed",
      label: "Biokonversi BSF (Pakan)",
      value: "54.300 kg (64.5%)",
      icon: Bug,
      iconStyle: "text-primary bg-accent/70 border-primary/25",
    },
    {
      id: "kasgot_fertilizer",
      label: "Pupuk Organik Kasgot",
      value: "29.900 kg (35.5%)",
      icon: Sprout,
      iconStyle: "text-secondary bg-muted border-border",
    },
  ],
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function StatSection() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* 1. 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {ESG_STAT_DATA.map((item) => (
          <MetricStatCard
            key={item.id}
            label={item.label}
            value={item.value}
            unit={item.unit}
            icon={item.icon}
            footerLeft={item.footerLeft}
            footerRight={item.footerRight}
          />
        ))}
      </div>

      {/* 2. Charts & Analytics Grid (2 Columns) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ===================================================================
            LEFT COLUMN (5 Cols): Breakdown Emisi per Scope
            =================================================================== */}
        <div className="lg:col-span-5 w-full">
          <Card className="h-full p-6 sm:p-7 flex flex-col justify-between gap-6">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-border/70">
                <h3 className="text-base sm:text-lg font-bold text-foreground font-headline">
                  {ESG_SCOPE_DATA.title}
                </h3>
                <span className="font-mono text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                  {ESG_SCOPE_DATA.badge}
                </span>
              </div>

              <p className="text-xs text-muted-foreground font-body leading-relaxed mt-2.5">
                {ESG_SCOPE_DATA.subtitle}
              </p>

              {/* 3 Scope Breakdown Progress Bars */}
              <div className="mt-5 flex flex-col gap-4">
                {ESG_SCOPE_DATA.scopes.map((scope) => (
                  <div key={scope.id} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-xs shrink-0 ${scope.colorBox}`}
                        />
                        <span className="font-headline font-semibold text-foreground text-xs">
                          {scope.name}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-foreground text-xs">
                        {scope.value}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${scope.barColor}`}
                        style={{ width: `${scope.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Intermediat Net-Zero 2030 Box */}
            <div className="p-4 rounded-2xl border border-border bg-muted/40 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-foreground font-headline">
                    {ESG_SCOPE_DATA.targetNetZero.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground font-body mt-0.5">
                    {ESG_SCOPE_DATA.targetNetZero.subtitle}
                  </p>
                </div>
                <span className="text-lg font-extrabold text-primary font-headline">
                  {ESG_SCOPE_DATA.targetNetZero.progressPercent}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden border border-border/60">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{
                    width: `${ESG_SCOPE_DATA.targetNetZero.progressPercent}%`,
                  }}
                />
              </div>

              {/* Milestones Footers */}
              <div className="flex items-center justify-between text-[10px] text-muted-foreground font-body pt-1">
                {ESG_SCOPE_DATA.targetNetZero.milestones.map((ms, idx) => (
                  <span key={idx}>{ms.label}</span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* ===================================================================
            RIGHT COLUMN (7 Cols): Tren Reduksi Bulanan & Rasio Biokonversi
            =================================================================== */}
        <div className="lg:col-span-7 w-full">
          <Card className="h-full p-6 sm:p-7 flex flex-col justify-between gap-6">
            <div>
              {/* Header & Legends */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3.5 border-b border-border/70">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground font-headline">
                    {ESG_CHART_DATA.title}
                  </h3>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">
                    {ESG_CHART_DATA.subtitle}
                  </p>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-body shrink-0 self-start sm:self-auto">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 border-t-2 border-dashed border-muted-foreground/60 block" />
                    <span className="text-muted-foreground text-[11px]">
                      {ESG_CHART_DATA.legend.baseline}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-primary block" />
                    <span className="font-bold text-foreground text-[11px]">
                      {ESG_CHART_DATA.legend.actual}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dual Bar Chart (Pure CSS/Tailwind & SVG Coordinates) */}
              <div className="mt-6 pt-4 px-2 sm:px-6">
                <div className="h-44 flex items-end justify-between gap-3 sm:gap-6 border-b border-border/80 pb-2">
                  {ESG_CHART_DATA.monthlyData.map((d) => (
                    <div
                      key={d.month}
                      className="flex-1 flex flex-col items-center h-full justify-end group"
                    >
                      {/* Bars cluster */}
                      <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                        {/* Baseline Bar */}
                        <div
                          className="w-4 sm:w-6 rounded-t-md bg-muted border border-border transition-all duration-300 group-hover:opacity-80"
                          style={{ height: `${d.baselineHeight}%` }}
                          title={`Baseline TPA (${d.month}): ${d.baselineHeight}%`}
                        />

                        {/* Actual Reduced Bar */}
                        <div
                          className="w-4 sm:w-6 rounded-t-md bg-primary transition-all duration-300 group-hover:brightness-110 shadow-xs"
                          style={{ height: `${d.actualHeight}%` }}
                          title={`Aktual Tereduksi (${d.month}): ${d.actualHeight}%`}
                        />
                      </div>

                      {/* Month Label */}
                      <span
                        className={`text-xs mt-2 transition-colors ${
                          d.isCurrent
                            ? "font-bold text-primary font-headline"
                            : "text-muted-foreground font-body"
                        }`}
                      >
                        {d.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom 2 Summary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {ESG_CHART_DATA.bottomCards.map((c) => {
                const CIcon = c.icon;
                return (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-2xl border border-border bg-card shadow-2xs flex items-center gap-3"
                  >
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${c.iconStyle}`}
                    >
                      <CIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] text-muted-foreground font-body block truncate">
                        {c.label}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-foreground font-headline block truncate mt-0.5">
                        {c.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
