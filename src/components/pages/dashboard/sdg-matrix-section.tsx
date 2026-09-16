"use client";

import React from "react";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const SDG_MATRIX_DATA = {
  header: {
    title: "Matriks Dampak UN Sustainable Development Goals (SDGs)",
    subtitle: "Integrasi indeks keberlanjutan global terkalibrasi secara matematis.",
    methodology: "Metodologi: UN SDG Impact Standards",
  },
  cards: [
    {
      id: "sdg2",
      number: "2",
      numberBg: "bg-[#DDA63A]", // UN SDG 2 Official Gold/Yellow
      tag: "Zero Hunger",
      title: "SDG 2: Tanpa Kelaparan",
      description:
        "Pencegahan kemubaziran makanan berkualitas konsumsi manusia.",
      statValue: "142.850 Porsi",
      statHighlight: "Tersalurkan Aman",
    },
    {
      id: "sdg12",
      number: "12",
      numberBg: "bg-[#BF8B2E]", // UN SDG 12 Responsible Consumption Mustard
      tag: "Responsible",
      title: "SDG 12: Konsumsi & Produksi",
      description:
        "Divergensi limbah dapur katering dari pembuangan akhir terbuka.",
      statValue: "84.200 kg",
      statHighlight: "Dialihkan dari TPA",
    },
    {
      id: "sdg13",
      number: "13",
      numberBg: "bg-[#3F7E44]", // UN SDG 13 Climate Action Green
      tag: "Climate",
      title: "SDG 13: Perubahan Iklim",
      description:
        "Mitigasi gas metana beracun lewat kalkulasi koefisien karbon.",
      statValue: "48.836 kg CO2e",
      statHighlight: "Pencegahan Efektif",
    },
    {
      id: "sdg17",
      number: "17",
      numberBg: "bg-[#19486A]", // UN SDG 17 Partnerships Navy
      tag: "Partnerships",
      title: "SDG 17: Kemitraan Tujuan",
      description:
        "Kolaborasi ekosistem logistik makanan & pengolah limbah BSF.",
      statValue: "34 F&B",
      statHighlight: "& 12 Fasilitas BSF",
      isMutedHighlight: true,
    },
  ],
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function SdgMatrixSection() {
  const { header, cards } = SDG_MATRIX_DATA;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 sm:mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground font-headline">
            {header.title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-body mt-0.5">
            {header.subtitle}
          </p>
        </div>

        <span className="text-[11px] text-muted-foreground font-body shrink-0 self-start md:self-auto">
          {header.methodology}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((card) => (
          <div
            key={card.id}
            className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)] flex flex-col justify-between gap-5 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Top Row: Number Square & SDG Tag Badge */}
            <div className="flex items-center justify-between gap-2">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold font-headline text-base shadow-2xs ${card.numberBg}`}
              >
                {card.number}
              </div>

              <span className="font-mono text-[10px] font-bold text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border">
                {card.tag}
              </span>
            </div>

            {/* Middle Content: Title & Description */}
            <div>
              <h3 className="text-sm font-bold text-foreground font-headline">
                {card.title}
              </h3>
              <p className="text-xs text-muted-foreground font-body leading-relaxed mt-1.5">
                {card.description}
              </p>
            </div>

            {/* Bottom Row: Stat Value & Highlight Label */}
            <div className="pt-3 border-t border-border/70 flex items-baseline gap-1.5 text-xs">
              <span className="font-bold text-foreground font-headline">
                {card.statValue}
              </span>
              <span
                className={`font-semibold text-[11px] ${
                  card.isMutedHighlight
                    ? "text-muted-foreground"
                    : "text-primary"
                }`}
              >
                {card.statHighlight}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
