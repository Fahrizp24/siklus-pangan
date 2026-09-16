"use client";

import React, { useState, useMemo } from "react";
import { SlidersHorizontal, ArrowUpDown, Utensils } from "lucide-react";
import { SurplusFoodCard, SurplusFoodCardData } from "@/components/rescue/surplus-food-card";
import { BeneficiaryCapacityCard } from "./beneficiary-capacity-card";
import { PickupProtocolCard } from "./pickup-protocol-card";
import { useRescueFilter } from "./rescue-filter-context";

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

export const SURPLUS_FEED_LISTINGS: SurplusFoodCardData[] = [
  {
    id: "surplus-084",
    donorCode: "Donatur Anonim #084",
    location: "Renon, Denpasar (1.2 km)",
    distanceKm: 1.2,
    remainingTime: "01j 42m (14:00 WITA)",
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
    remainingTime: "02j 15m (15:30 WITA)",
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
    remainingTime: "03j 10m (16:00 WITA)",
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
    remainingTime: "00j 55m (13:30 WITA)",
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
   COMPONENT IMPLEMENTATION
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
