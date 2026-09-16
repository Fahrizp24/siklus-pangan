"use client";

import React, { useState, useMemo } from "react";
import {
  SlidersHorizontal,
  Utensils,
  ShieldCheck,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SurplusFoodCard,
  SurplusFoodCardData,
} from "@/components/ui/surplus-food-card";
import { useRescueFilter } from "@/lib/context/rescue-filter-context";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const FEED_HEADER_CONTENT = {
  title: "Daftar Surplus Realtime",
  badgeText: "4 Listing Utama",
  sortLabelPrefix: "Urutkan:",
  sortOptions: [
    { id: "distance", label: "Jarak Terdekat" },
    { id: "expiry", label: "Paling Cepat Basi" },
    { id: "portions", label: "Porsi Terbanyak" },
  ],
  emptyMessage: "Tidak ada listing pangan surplus yang cocok dengan filter atau radius aktif.",
  resetFilterText: "Reset Filter",
};

export const BENEFICIARY_CAPACITY_DATA = {
  title: "Kapasitas Beneficiary",
  statusBadge: "Tingkat Aman",
  label: "Porsi Terserap Hari Ini:",
  consumedPortions: 45,
  totalCapacityPortions: 150,
  foundationName: "Yayasan Sayap Ibu",
  description:
    "Sisa kuota harian: 105 porsi untuk Yayasan Sayap Ibu. Kuota diperbarui otomatis setiap pukul 00.00 WITA untuk pemerataan distribusi panti & komunitas.",
  historyButtonText: "Histori Klaim",
  reportButtonText: "Lapor Mutu Pangan",
};

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

export const SURPLUS_FEED_LISTINGS: SurplusFoodCardData[] = [
  {
    id: "surplus-084",
    donorCode: "Donatur Anonim #084",
    location: "Renon, Denpasar (1.2 km)",
    distanceKm: 1.2,
    remainingTime: "01j 42m",
    isUrgentBadge: true,
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80",
    imageBadge: {
      label: "Cold Chain 4°C Terjaga",
      iconType: "cold_chain",
    },
    title: "Premium Chicken Teriyaki Bento & Na...",
    portionsRemainingText: "35 Porsi Tersisa",
    batchInfo: "Batch Produksi: 10:15 WITA",
    tags: [
      { label: "Alergen: Kedelai & Wijen", colorScheme: "yellow" },
      { label: "Higienis Cold Chain", colorScheme: "green" },
    ],
    costInfo: {
      topLabel: "Porsi Bebas Biaya",
      bottomLabel: "Subsidi Korporat CSR",
    },
    category: "hotel_catering",
  },
  {
    id: "surplus-022",
    donorCode: "Donatur Anonim #022",
    location: "Sanur, Denpasar (2.4 km)",
    distanceKm: 2.4,
    remainingTime: "02j 15m",
    isUrgentBadge: false,
    imageUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&q=80",
    imageBadge: {
      label: "Shift Pagi Hotel Bintang 5",
      iconType: "hotel",
    },
    title: "Artisan Croissant, Danishes &...",
    portionsRemainingText: "60 Paket Tersisa",
    batchInfo: "Batch: Bake 06:30 WITA",
    tags: [
      { label: "Vegetarian Friendly", colorScheme: "green" },
      { label: "Mengandung Gluten & Butter", colorScheme: "neutral" },
    ],
    costInfo: {
      topLabel: "Porsi Bebas Biaya",
      bottomLabel: "Food Waste Divert #022",
    },
    category: "bakery",
  },
  {
    id: "surplus-109",
    donorCode: "Donatur Anonim #109",
    location: "Panjer / Renon (3.1 km)",
    distanceKm: 3.1,
    remainingTime: "03j 10m",
    isUrgentBadge: false,
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=80",
    imageBadge: {
      label: "Halal Terverifikasi LPOM MUI",
      iconType: "halal",
    },
    title: "Nasi Kotak Semur Daging & Tumis...",
    portionsRemainingText: "48 Box Tersisa",
    batchInfo: "Corporate Summit Untouched Surplus",
    tags: [
      { label: "100% Halal MUI", colorScheme: "green" },
      { label: "Kering / Non-Kuah Tumpah", colorScheme: "blue" },
    ],
    costInfo: {
      topLabel: "Porsi Bebas Biaya",
      bottomLabel: "Event Catering Surplus",
    },
    category: "nasi_kotak",
  },
  {
    id: "surplus-061",
    donorCode: "Donatur Anonim #061",
    location: "Seminyak / Kuta (4.5 km)",
    distanceKm: 4.5,
    remainingTime: "00j 55m",
    isUrgentBadge: true,
    imageUrl:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=700&q=80",
    imageBadge: {
      label: "100% Organik & Vegan",
      iconType: "vegan",
    },
    title: "Fresh Seasonal Fruit Platter & Salad...",
    portionsRemainingText: "22 Porsi Tersisa",
    batchInfo: "Chilled Sealed 2°C",
    tags: [
      { label: "Vegan & 100% Organik", colorScheme: "green" },
      { label: "High Fiber & Nutrisi Tinggi", colorScheme: "blue" },
    ],
    costInfo: {
      topLabel: "Porsi Bebas Biaya",
      bottomLabel: "Resort Breakfast Surplus",
    },
    category: "vegetarian",
  },
];

/* =========================================================================
   INTERNAL SIDE MENU SUB-COMPONENTS
   ========================================================================= */

function BeneficiaryCapacityCard() {
  const {
    title,
    statusBadge,
    label,
    consumedPortions,
    totalCapacityPortions,
    description,
    historyButtonText,
    reportButtonText,
  } = BENEFICIARY_CAPACITY_DATA;

  const percentage = Math.min(
    100,
    Math.round((consumedPortions / totalCapacityPortions) * 100)
  );

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-headline font-bold text-base text-neutral-900">
            {title}
          </h3>
        </div>

        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-primary border border-emerald-200/80">
          {statusBadge}
        </span>
      </div>

      {/* Metrics Row */}
      <div className="mt-4 flex items-baseline justify-between text-xs sm:text-sm">
        <span className="text-slate-600 font-medium">{label}</span>
        <div className="flex items-baseline">
          <span className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-headline">
            {consumedPortions}
          </span>
          <span className="text-xs text-slate-400 font-medium ml-1">
            / {totalCapacityPortions} Porsi
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-2.5 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Helper Description */}
      <p className="mt-3 text-xs text-slate-500 font-body leading-relaxed">
        {description}
      </p>

      {/* Action Buttons */}
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs font-semibold rounded-xl border-slate-200 text-neutral-800 hover:bg-slate-50 shadow-2xs"
        >
          {historyButtonText}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs font-semibold rounded-xl border-slate-200 text-neutral-800 hover:bg-slate-50 shadow-2xs"
        >
          {reportButtonText}
        </Button>
      </div>
    </div>
  );
}

function PickupProtocolCard() {
  const { title, subtitle, steps } = PICKUP_PROTOCOL_CONTENT;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs">
      {/* Header Row */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-primary flex items-center justify-center shrink-0">
          <ClipboardCheck className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-headline font-bold text-base text-neutral-900">
          {title}
        </h3>
      </div>

      <p className="mt-3 text-xs text-slate-500 font-body leading-relaxed">
        {subtitle}
      </p>

      {/* Protocol Steps */}
      <div className="mt-4 space-y-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100/90 transition-colors hover:bg-slate-50"
          >
            <div className="w-5 h-5 rounded bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs font-headline">
              {step.number}
            </div>
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

/* =========================================================================
   MAIN SECTION COMPONENT IMPLEMENTATION
   ========================================================================= */

export function SurplusFeedSection() {
  const {
    searchQuery,
    radiusKm,
    selectedCategory,
    sortBy,
    setSortBy,
    setSearchQuery,
    setSelectedCategory,
  } = useRescueFilter();

  const [claimedId, setClaimedId] = useState<string | null>(null);

  // Filter listings reactively based on context state
  const filteredListings = useMemo(() => {
    return SURPLUS_FEED_LISTINGS.filter((item) => {
      // 1. Radius distance filter
      if (item.distanceKm !== undefined && item.distanceKm > radiusKm) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory !== "all") {
        if (selectedCategory === "halal") {
          const hasHalal = item.tags.some((t) =>
            t.label.toLowerCase().includes("halal")
          );
          if (!hasHalal && item.category !== "halal") return false;
        } else if (selectedCategory === "vegetarian") {
          const hasVeg = item.tags.some((t) =>
            t.label.toLowerCase().includes("vegan") ||
            t.label.toLowerCase().includes("vegetarian")
          );
          if (!hasVeg && item.category !== "vegetarian") return false;
        } else if (selectedCategory === "bebas_gluten") {
          const hasGlutenFree = item.tags.some((t) =>
            t.label.toLowerCase().includes("bebas gluten") ||
            t.label.toLowerCase().includes("aman")
          );
          if (!hasGlutenFree) return false;
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }

      // 3. Search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDonor = item.donorCode.toLowerCase().includes(query);
        const matchesLocation = item.location.toLowerCase().includes(query);
        const matchesTag = item.tags.some((t) =>
          t.label.toLowerCase().includes(query)
        );
        if (!matchesTitle && !matchesDonor && !matchesLocation && !matchesTag) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "distance") {
        return (a.distanceKm || 0) - (b.distanceKm || 0);
      }
      return 0;
    });
  }, [searchQuery, radiusKm, selectedCategory, sortBy]);

  const { title, badgeText, sortLabelPrefix, sortOptions, emptyMessage, resetFilterText } =
    FEED_HEADER_CONTENT;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* SECTION HEADER: Title & Badge (Left) and Sort Dropdown (Right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-headline">
            {title}
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60 shadow-2xs">
            {badgeText}
          </span>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-2xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500 font-medium">{sortLabelPrefix}</span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "distance" | "expiry" | "portions")
              }
              className="bg-transparent font-bold text-neutral-900 outline-none cursor-pointer pr-1"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION CONTENT: Left 2-Column Food Cards Grid + Right Side Menu Cards */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* LEFT COLUMN: Food Cards Grid (2 Columns) */}
        <div className="flex-1 w-full">
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredListings.map((card) => (
                <SurplusFoodCard
                  key={card.id}
                  card={card}
                  isClaimed={claimedId === card.id}
                  onClaim={(id) => setClaimedId(id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center bg-white">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Utensils className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-neutral-800">
                {emptyMessage}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-3 text-xs text-primary font-bold hover:underline"
              >
                {resetFilterText}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Side Menu Cards (Beneficiary Capacity & Safe Pickup Protocol) */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-6">
          <BeneficiaryCapacityCard />
          <PickupProtocolCard />
        </div>
      </div>
    </section>
  );
}
