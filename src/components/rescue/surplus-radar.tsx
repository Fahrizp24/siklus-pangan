"use client";

import React, { useState, useMemo } from "react";
import { RadarHero } from "@/components/rescue/radar-hero";
import { SurplusFoodCard, SurplusFoodCardData } from "@/components/rescue/surplus-food-card";
import { Utensils, AlertCircle } from "lucide-react";

/* =========================================================================
   MOCK RADAR LISTINGS DATA (CONFIGURABLE AT TOP OF FILE)
   ========================================================================= */

export const RADAR_SURPLUS_DATA: SurplusFoodCardData[] = [
  {
    id: "card-1",
    donorCode: "Donatur Anonim #084",
    location: "Menteng",
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    remainingTime: "Sisa: 01j 42m",
    isUrgentBadge: true,
    eventOrShiftLabel: "Jendela 11.30 – 13.45",
    safeUntilText: "Safe Until: 14:00 WIB",
    title: "Premium Chicken Teriyaki Bento",
    description:
      "Surplus jamuan buffet eksekutif hotel bintang 5. Suhu penyimpanan cold chain 4°C terjaga.",
    tags: [
      { label: "Alergen: Kedelai & Wijen", colorScheme: "yellow" },
      { label: "Porsi Higienis", colorScheme: "blue" },
    ],
    portionsCount: 35,
    portionUnit: "porsi",
    category: "hotel_catering",
  },
  {
    id: "card-2",
    donorCode: "Donatur Anonim #022",
    location: "Senopati",
    imageUrl:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    remainingTime: "Sisa: 02j 15m",
    isUrgentBadge: true,
    eventOrShiftLabel: "Bake Shift Pagi",
    safeUntilText: "Safe Until: 15:30 WIB",
    title: "Artisan Croissant & Pastry",
    description:
      "Kelebihan produksi bakery harian dengan kemasan food grade standar industri Jepang.",
    tags: [
      { label: "Gluten & Butter", colorScheme: "yellow" },
      { label: "Vegetarian", colorScheme: "green" },
    ],
    portionsCount: 60,
    portionUnit: "paket",
    category: "bakery",
  },
  {
    id: "card-3",
    donorCode: "Donatur Anonim #109",
    location: "Kuningan",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
    remainingTime: "Sisa: 03j 10m",
    isUrgentBadge: false,
    eventOrShiftLabel: "Acara Menara Astra",
    safeUntilText: "Safe Until: 16:00 WIB",
    title: "Nasi Kotak Daging & Buncis",
    description:
      "Paket seminar belum tersentuh, tersimpan dalam box penghangat termal insulasi.",
    tags: [
      { label: "100% Halal MUI", colorScheme: "green" },
      { label: "Higienis", colorScheme: "blue" },
    ],
    portionsCount: 48,
    portionUnit: "box porsi",
    category: "nasi_kotak",
  },
  {
    id: "card-4",
    donorCode: "Donatur Anonim #047",
    location: "Sudirman",
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
    remainingTime: "Sisa: 00j 48m",
    isUrgentBadge: true,
    eventOrShiftLabel: "Shift Siang",
    safeUntilText: "Safe Until: 13:30 WIB",
    title: "Soto Ayam Madura & Pelengkap",
    description:
      "Kuah soto dan kondimen dipisah higienis. Hangat dan siap santap untuk konsumsi panti asuhan.",
    tags: [
      { label: "Halal MUI", colorScheme: "green" },
      { label: "Alergen: Telur", colorScheme: "yellow" },
      { label: "Bebas Gluten", colorScheme: "green" },
    ],
    portionsCount: 22,
    portionUnit: "porsi",
    category: "halal",
  },
  {
    id: "card-5",
    donorCode: "Donatur Anonim #112",
    location: "Thamrin",
    imageUrl:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
    remainingTime: "Sisa: 02j 40m",
    isUrgentBadge: false,
    eventOrShiftLabel: "Lunch Banquet",
    safeUntilText: "Safe Until: 16:00 WIB",
    title: "Fresh Caesar Salad Bowl",
    description:
      "Salad sayuran organik segar dengan dressing terpisah. Pendingin rantai dingin 4°C terjaga.",
    tags: [
      { label: "Vegetarian", colorScheme: "green" },
      { label: "Rendah Kalori", colorScheme: "blue" },
    ],
    portionsCount: 40,
    portionUnit: "bowl",
    category: "vegetarian",
  },
  {
    id: "card-6",
    donorCode: "Donatur Anonim #089",
    location: "Kemang",
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    remainingTime: "Sisa: 01j 15m",
    isUrgentBadge: true,
    eventOrShiftLabel: "Sesi Seminar Pagi",
    safeUntilText: "Safe Until: 14:15 WIB",
    title: "Quinoa Veggie Harvest Bowl",
    description:
      "Menu sehat bebas gluten kaya serat dan protein nabati, steril terbungkus wadah food grade.",
    tags: [
      { label: "Bebas Gluten", colorScheme: "green" },
      { label: "Plant-Based", colorScheme: "green" },
    ],
    portionsCount: 28,
    portionUnit: "porsi",
    category: "bebas_gluten",
  },
];

/* =========================================================================
   SURPLUS RADAR CONTAINER COMPONENT
   ========================================================================= */

export function SurplusRadar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [radiusKm, setRadiusKm] = useState(5.0);
  const [isBeneficiaryOnly, setIsBeneficiaryOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [claimedIds, setClaimedIds] = useState<Record<string, boolean>>({});

  // Filter listings reaktif
  const filteredListings = useMemo(() => {
    return RADAR_SURPLUS_DATA.filter((item) => {
      // 1. Filter Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesLocation = item.location.toLowerCase().includes(query);
        const matchesDonor = item.donorCode.toLowerCase().includes(query);
        const matchesTags = item.tags.some((t) =>
          t.label.toLowerCase().includes(query)
        );

        if (!matchesTitle && !matchesLocation && !matchesDonor && !matchesTags) {
          return false;
        }
      }

      // 2. Filter Category
      if (selectedCategory !== "all") {
        if (selectedCategory === "halal") {
          const isHalal = item.tags.some((t) =>
            t.label.toLowerCase().includes("halal")
          );
          if (!isHalal && item.category !== "halal") return false;
        } else if (selectedCategory === "vegetarian") {
          const isVeg = item.tags.some((t) =>
            t.label.toLowerCase().includes("vegetarian")
          );
          if (!isVeg && item.category !== "vegetarian") return false;
        } else if (selectedCategory === "bebas_gluten") {
          const isGlutenFree = item.tags.some((t) =>
            t.label.toLowerCase().includes("gluten")
          );
          if (!isGlutenFree && item.category !== "bebas_gluten") return false;
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }

      // 3. Filter Beneficiary Only
      if (isBeneficiaryOnly && item.portionsCount < 30) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, isBeneficiaryOnly]);

  const handleClaim = (cardId: string) => {
    setClaimedIds((prev) => ({ ...prev, [cardId]: true }));
  };

  return (
    <div className="space-y-8">
      {/* 1. Radar Hero Section (Header, Telemetri, Search, Radius, FilterPills) */}
      <RadarHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        radiusKm={radiusKm}
        onRadiusChange={setRadiusKm}
        isBeneficiaryOnly={isBeneficiaryOnly}
        onBeneficiaryOnlyChange={setIsBeneficiaryOnly}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {/* 2. Listings Grid or Empty State */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((card) => (
            <SurplusFoodCard
              key={card.id}
              card={card}
              isClaimed={!!claimedIds[card.id]}
              onClaim={handleClaim}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-headline font-bold text-base text-neutral-900">
            Tidak ada surplus pangan yang cocok
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md font-body leading-relaxed">
            Coba sesuaikan kata kunci pencarian, perluas radius pemantauan radar,
            atau pilih kategori makanan lain.
          </p>
        </div>
      )}
    </div>
  );
}
