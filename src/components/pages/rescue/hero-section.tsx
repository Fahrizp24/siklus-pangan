"use client";

import React from "react";
import { Search, Navigation, Square, LayoutGrid, Leaf, UtensilsCrossed } from "lucide-react";
import { FilterPills, FilterPillOption } from "@/components/ui/filter-pills";
import { useRescueFilter } from "@/lib/context/rescue-filter-context";

export const RADAR_HERO_CONTENT = {
  title: "Radar Penyelamatan Surplus Pangan Aktif",
  description: "Temukan surplus pangan berdasarkan judul, kode donatur pada listing, tag diet, dan alergen yang tercatat. Tag berasal dari informasi donatur, bukan bukti verifikasi halal atau jaminan bebas alergen.",
  searchPlaceholder: "Cari hidangan, tag diet, alergen, atau kode donatur…",
  beneficiaryOnlyLabel: "Khusus Kuota Beneficiary",
};

export const RADAR_CATEGORY_OPTIONS: FilterPillOption[] = [
  { id: "all", label: "Semua Listing", icon: LayoutGrid },
  { id: "halal", label: "Tag Halal (Donatur)", icon: UtensilsCrossed },
  { id: "vegetarian", label: "Tag Vegetarian / Vegan", icon: Leaf },
  { id: "bebas_gluten", label: "Tag Bebas Gluten", icon: UtensilsCrossed },
];

export function HeroSection() {
  const {
    searchQuery,
    setSearchQuery,
    radiusKm,
    selectedCategory,
    setSelectedCategory,
    resetFilters,
  } = useRescueFilter();
  const { title, description, searchPlaceholder, beneficiaryOnlyLabel } = RADAR_HERO_CONTENT;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
        <div className="pb-6 border-b border-slate-100">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 font-headline tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-body leading-relaxed mt-3 max-w-4xl">
            {description}
          </p>
        </div>

        <div className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                aria-label="Cari judul, kode donatur, tag diet, atau alergen"
                aria-describedby="rescue-search-help"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-neutral-900 placeholder:text-slate-400 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs font-body"
              />
            </div>

            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500 font-body shadow-2xs shrink-0">
              <Navigation aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />
              <span className="font-medium whitespace-nowrap">Radius tidak tersedia</span>
              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={radiusKm}
                disabled
                aria-label="Radius pencarian (tidak tersedia)"
                aria-describedby="rescue-location-help"
                aria-valuetext="Tidak tersedia tanpa sumber geolokasi"
                className="w-20 sm:w-24 h-1.5 bg-slate-200 rounded-lg cursor-not-allowed ml-1"
              />
            </div>

            <button
              type="button"
              disabled
              aria-pressed={false}
              aria-describedby="rescue-beneficiary-help"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs sm:text-sm font-semibold whitespace-nowrap shadow-2xs cursor-not-allowed"
            >
              <Square aria-hidden="true" className="w-4 h-4 shrink-0" />
              <span>{beneficiaryOnlyLabel}</span>
            </button>
          </div>

          <div className="space-y-1 text-xs text-slate-600 leading-relaxed">
            <p id="rescue-location-help">Radius dan urutan jarak dinonaktifkan karena sumber geolokasi belum tersedia. Listing tanpa lokasi atau jarak tetap ditampilkan.</p>
            <p id="rescue-beneficiary-help">Filter khusus beneficiary belum tersedia karena data listing belum memiliki penanda kuota beneficiary.</p>
            <p id="rescue-search-help">Pencarian tidak mencakup lokasi karena data lokasi belum tersedia. Pilih Semua Listing untuk menyertakan listing tanpa tag diet.</p>
          </div>

          <div role="group" aria-label="Filter berdasarkan tag diet donatur" className="pt-1">
            <FilterPills
              options={RADAR_CATEGORY_OPTIONS}
              selectedId={selectedCategory}
              onSelect={setSelectedCategory}
              variant="outline"
            />
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs text-primary font-bold hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Reset Filter
          </button>
        </div>
      </div>
    </section>
  );
}
