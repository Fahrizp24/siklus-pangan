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

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO MODIFY)
   ========================================================================= */

export const RADAR_HERO_CONTENT = {
  title: "Radar Penyelamatan Surplus Pangan Aktif",
  description:
    "Memantau surplus pangan segar berstandar BPOM & ISO 14044 di radius 5.0 km Anda. Setiap listing dilindungi Anonimitas Donatur Terenkripsi (#00X) untuk menjaga privasi korporat serta mencegah kerumunan fisik di lokasi penjemputan.",
  telemetry: {
    tag: "FEED TELEMETRI",
    statusText: "LIVE SYNC",
    radarCycle: "Update 12 detik lalu",
    availableListings: "14 Batch / 410 Porsi",
    currentWindow: "Makan Siang (11.00 - 14.00 WIB)",
  },
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

export interface RadarHeroProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  radiusKm: number;
  onRadiusChange: (val: number) => void;
  isBeneficiaryOnly: boolean;
  onBeneficiaryOnlyChange: (val: boolean) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

export function RadarHero({
  searchQuery,
  onSearchChange,
  radiusKm,
  onRadiusChange,
  isBeneficiaryOnly,
  onBeneficiaryOnlyChange,
  selectedCategory,
  onCategoryChange,
}: RadarHeroProps) {
  const { title, description, telemetry, searchPlaceholder, radiusZoneLabel, beneficiaryOnlyLabel } =
    RADAR_HERO_CONTENT;

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
      {/* TOP ROW: Title & Description on Left, Telemetry on Right */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6">
        {/* Left Side: Headline & Description */}
        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 font-headline tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-body leading-relaxed mt-3">
            {description.split("Anonimitas Donatur Terenkripsi (#00X)")[0]}
            <strong className="text-neutral-900 font-semibold">
              Anonimitas Donatur Terenkripsi (#00X)
            </strong>
            {description.split("Anonimitas Donatur Terenkripsi (#00X)")[1]}
          </p>
        </div>

        {/* Right Side: Telemetry Box */}
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/60 p-4 sm:p-5 w-full lg:w-80 shrink-0 font-body shadow-2xs">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-headline">
              {telemetry.tag}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-primary font-headline">
                {telemetry.statusText}
              </span>
            </div>
          </div>

          {/* Rows */}
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Siklus Radar:</span>
              <span className="font-bold text-primary">{telemetry.radarCycle}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Listing Tersedia:</span>
              <span className="font-bold text-neutral-900">{telemetry.availableListings}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-500 font-medium">Jendela Saat Ini:</span>
              <span className="bg-slate-200/70 text-slate-800 text-[10.5px] font-semibold px-2 py-0.5 rounded-md text-right">
                {telemetry.currentWindow}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-slate-100 my-4 sm:my-6" />

      {/* BOTTOM CONTROLS */}
      <div className="space-y-4">
        {/* ROW 1: Search Input, Radius Control, and Beneficiary Quota Checkbox */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-neutral-900 placeholder:text-slate-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Radius Control */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-700 whitespace-nowrap shadow-2xs">
            <Navigation className="w-4 h-4 text-primary shrink-0" />
            <span className="font-medium">
              Radius: <strong className="font-bold text-neutral-900">{radiusKm.toFixed(1)} km</strong>{" "}
              <span className="text-slate-500">({radiusZoneLabel})</span>
            </span>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={radiusKm}
              onChange={(e) => onRadiusChange(parseFloat(e.target.value))}
              className="w-20 sm:w-24 h-1.5 accent-primary bg-slate-200 rounded-lg cursor-pointer ml-1"
            />
          </div>

          {/* Beneficiary Quota Toggle Button */}
          <button
            type="button"
            onClick={() => onBeneficiaryOnlyChange(!isBeneficiaryOnly)}
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

        {/* ROW 2: Filter Category Pills (Reusing FilterPills component!) */}
        <div className="pt-1">
          <FilterPills
            options={RADAR_CATEGORY_OPTIONS}
            selectedId={selectedCategory}
            onSelect={onCategoryChange}
            variant="outline"
          />
        </div>
      </div>
    </div>
  );
}
