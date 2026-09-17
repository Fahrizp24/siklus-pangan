import React from "react";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const ARCHITECTURE_INSIGHT_CONTENT = {
  title: 'Bagaimana SiklusPangan Menghitung "Safe Until" Tanpa Halusinasi AI',
  descriptionPrefix:
    "Berbeda dari sekadar estimasi probabilistik LLM, mesin perhitungan kami menggunakan ",
  descriptionBold: "Deterministic Food Expiry Engine",
  descriptionMiddle:
    " yang memadukan sensor suhu logistik cold chain, jenis kadar air makanan (aw), waktu paparan suhu ruang sejak ",
  descriptionItalic: "cooking completion",
  descriptionSuffix:
    ", serta pedoman ketat BPOM dan ISO 14044 Life Cycle Assessment.",
  metrics: [
    {
      value: "0.9997",
      title: "Akurasi Kelayakan Higienis",
      description:
        "Zero insiden keracunan pangan di 50.000+ serah terima audit internal.",
    },
    {
      value: "100% Anonim",
      title: "Zero PR & Commercial Risk",
      description:
        "Identitas hotel bintang lima dan katering korporat dienkripsi secara penuh.",
    },
    {
      value: "Scope 3 Ready",
      title: "GHG Protocol Compliance",
      description:
        "Setiap kilogram surplus menghasilkan sertifikat reduksi emisi metana terverifikasi.",
    },
  ],
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function ArchitectureInsightSection() {
  const {
    title,
    descriptionPrefix,
    descriptionBold,
    descriptionMiddle,
    descriptionItalic,
    descriptionSuffix,
    metrics,
  } = ARCHITECTURE_INSIGHT_CONTENT;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
        {/* Section Headline */}
        <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-neutral-900 font-headline tracking-tight leading-tight">
          {title}
        </h2>

        {/* Descriptive Context */}
        <p className="text-xs sm:text-sm text-slate-600 font-body leading-relaxed max-w-4xl mt-3">
          {descriptionPrefix}
          <strong className="text-neutral-900 font-semibold">
            {descriptionBold}
          </strong>
          {descriptionMiddle}
          <span className="italic">{descriptionItalic}</span>
          {descriptionSuffix}
        </p>

        {/* 3 Metric Insight Cards */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {metrics.map((metric) => (
            <div
              key={metric.title}
              className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-5 sm:p-6 shadow-2xs hover:bg-slate-50/80 transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-primary font-headline tracking-tight">
                {metric.value}
              </div>
              <h3 className="font-bold text-xs sm:text-sm text-neutral-900 font-headline mt-2">
                {metric.title}
              </h3>
              <p className="text-xs text-slate-500 font-body leading-relaxed mt-1">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
