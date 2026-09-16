"use client";

import React from "react";
import { motion } from "framer-motion";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO MODIFY)
   ========================================================================= */

export const PILLARS_HEADER_CONTENT = {
  tagline: "ARSITEKTUR REKAYASA SISTEM TERPADU",
  title: "10 Pilar Alur Ekosistem SiklusPangan",
  description:
    "Dirancang dengan standar rekayasa perangkat lunak presisi tinggi untuk menjamin integritas data, kelaikan pangan, dan kepatuhan audit ESG.",
};

export interface EcosystemPillarItem {
  id: string;
  number: string;
  title: string;
  description: string;
}

export const ECOSYSTEM_PILLARS_DATA: EcosystemPillarItem[] = [
  {
    id: "pillar-01",
    number: "01",
    title: "Food Rescue Radar",
    description: "Geolokasi realtime radius 5km dan filter kebutuhan diet.",
  },
  {
    id: "pillar-02",
    number: "02",
    title: "Gemini AI Vision",
    description: "Inspeksi visual menu, porsi, dan deteksi alergen otomatis.",
  },
  {
    id: "pillar-03",
    number: "03",
    title: "Deterministic Expiry",
    description: "Kalkulasi Safe_Until berbasis jenis pangan & suhu simpan.",
  },
  {
    id: "pillar-04",
    number: "04",
    title: "Anonimitas Donor",
    description: "Penyamaran nomor seri dan lokasi terenkripsi privasi tinggi.",
  },
  {
    id: "pillar-05",
    number: "05",
    title: "Serah Terima QR",
    description: "Bukti penjemputan kriptografis terverifikasi kedua belah pihak.",
  },
  {
    id: "pillar-06",
    number: "06",
    title: "Biokonversi BSF",
    description: "Pengalihan residu organik ke larva Black Soldier Fly.",
  },
  {
    id: "pillar-07",
    number: "07",
    title: "Dompet Sirkular",
    description: "Reverse tipping fee & pembayaran instan mitra processor.",
  },
  {
    id: "pillar-08",
    number: "08",
    title: "Kalkulasi ESG",
    description: "Formula GHG Protocol otomatis dari log pengalihan limbah.",
  },
  {
    id: "pillar-09",
    number: "09",
    title: "Wall of Fame",
    description: "Peringkat kontribusi hijau korporat yang dapat diaudit publik.",
  },
  {
    id: "pillar-10",
    number: "10",
    title: "Supabase Realtime",
    description: "Sinkronisasi status kilat dengan Row Level Security ketat.",
  },
];

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function PillarsSection() {
  const { tagline, title, description } = PILLARS_HEADER_CONTENT;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
        {/* Header */}
        <div>
          <p className="text-[11px] font-bold tracking-wider text-primary uppercase font-headline">
            — {tagline}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-headline mt-1 tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-body mt-2 max-w-3xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* 10 Pillars Grid (2 rows of 5 on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 mt-8">
          {ECOSYSTEM_PILLARS_DATA.map((pillar, index) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="rounded-2xl border border-slate-200/90 bg-slate-50/40 hover:bg-white hover:border-slate-300 p-4 sm:p-5 flex flex-col justify-start transition-all shadow-2xs hover:shadow-sm group"
            >
              {/* Badge Number */}
              <div>
                <span className="inline-flex items-center justify-center bg-primary text-white font-extrabold text-xs px-2.5 py-0.5 rounded-md font-headline shadow-2xs">
                  {pillar.number}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-headline font-bold text-sm text-neutral-900 mt-3 group-hover:text-primary transition-colors">
                {pillar.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-slate-500 font-body mt-1.5 leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
