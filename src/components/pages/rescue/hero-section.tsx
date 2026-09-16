"use client";

import React from "react";
import {
  Search,
  Navigation,
  CheckSquare,
  Square,
  LayoutGrid,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  UtensilsCrossed,
  Croissant,
  Package,
} from "lucide-react";
import { FilterPills, FilterPillOption } from "@/components/ui/filter-pills";
import { useRescueFilter } from "@/lib/context/rescue-filter-context";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const RADAR_HERO_CONTENT = {
  title: "Radar Penyelamatan Surplus Pangan Aktif",
  description:
    "Memantau surplus pangan segar berstandar BPOM & ISO 14044 di radius 5.0 km Anda. Setiap listing dilindungi Anonimitas Donatur Terenkripsi (#00X) untuk menjaga privasi korporat serta mencegah kerumunan fisik di lokasi penjemputan.",
  searchPlaceholder:
    "Cari jenis hidangan, kandungan alergen, atau ID anonim (misal: #084)...",
  radiusZoneLabel: "Bangkalan & UTM",
  beneficiaryOnlyLabel: "Khusus Kuota Beneficiary",
};

export const RADAR_CATEGORY_OPTIONS: FilterPillOption[] = [
  {
    id: "all",
    label: "Semua Kategori",
    count: 14,
    icon: LayoutGrid,
  },
  {
    id: "halal",
    label: "Halal Terverifikasi MUI",
    icon: CheckCircle2,
  },
  {
    id: "vegetarian",
    label: "Vegetarian",
    icon: Leaf,
  },
  {
    id: "bebas_gluten",
    label: "Bebas Gluten / Alergen Aman",
    icon: ShieldCheck,
  },
  {
    id: "hotel_catering",
    label: "Hotel & Catering",
    icon: UtensilsCrossed,
  },
  {
    id: "bakery",
    label: "Bakery & Pastry",
    icon: Croissant,
  },
  {
    id: "nasi_kotak",
    label: "Nasi Kotak & Bento",
    icon: Package,
  },
];

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function HeroSection() {
  const {
    searchQuery,
    setSearchQuery,
    radiusKm,
    setRadiusKm,
    isBeneficiaryOnly,
    setIsBeneficiaryOnly,
    selectedCategory,
    setSelectedCategory,
  } = useRescueFilter();

  const {
    title,
    description,
    searchPlaceholder,
    radiusZoneLabel,
    beneficiaryOnlyLabel,
  } = RADAR_HERO_CONTENT;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
        {/* ROW 1: Header */}
        <div className="pb-6 border-b border-slate-100">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 font-headline tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-body leading-relaxed mt-3 max-w-4xl">
            {description.split("Anonimitas Donatur Terenkripsi (#00X)")[0]}
            <strong className="text-neutral-900 font-semibold">
              Anonimitas Donatur Terenkripsi (#00X)
            </strong>
            {description.split("Anonimitas Donatur Terenkripsi (#00X)")[1]}
          </p>
        </div>

        {/* ROW 2: Search Box & Radar Radius Filter */}
        <div className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-neutral-900 placeholder:text-slate-400 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs font-body"
              />
            </div>

            {/* Radius Slider Selector */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-neutral-700 font-body shadow-2xs shrink-0">
              <Navigation className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="font-medium whitespace-nowrap">
                Radius: <strong className="text-neutral-900 font-bold">{radiusKm} km</strong>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 text-[11px] whitespace-nowrap">
                {radiusZoneLabel}
              </span>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={radiusKm}
                onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
                className="w-20 sm:w-24 h-1.5 accent-primary bg-slate-200 rounded-lg cursor-pointer ml-1"
              />
            </div>

            {/* Beneficiary Quota Toggle Button */}
            <button
              type="button"
              onClick={() => setIsBeneficiaryOnly(!isBeneficiaryOnly)}
              className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shadow-2xs select-none ${
                isBeneficiaryOnly
                  ? "border-primary/40 bg-emerald-50/50 text-neutral-900"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {isBeneficiaryOnly ? (
                <CheckSquare className="w-4 h-4 text-primary shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span>{beneficiaryOnlyLabel}</span>
            </button>
          </div>

          {/* Filter Category Pills */}
          <div className="pt-1">
            <FilterPills
              options={RADAR_CATEGORY_OPTIONS}
              selectedId={selectedCategory}
              onSelect={setSelectedCategory}
              variant="outline"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
