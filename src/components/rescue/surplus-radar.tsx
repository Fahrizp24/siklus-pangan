"use client";

import React, { useState } from "react";
import { ShieldCheck, Clock, MapPin, AlertTriangle, Utensils, Filter } from "lucide-react";
import { FoodListing } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

const MOCK_LISTINGS: FoodListing[] = [
  {
    id: "lst-1",
    donor_id: "dnr-1",
    title: "Nasi Kotak Ayam Bakar & Lodeh",
    image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    portions: 15,
    remaining_portions: 8,
    risky_ingredients: ["santan lodeh"],
    dietary_tags: ["halal"],
    storage_method: "suhu_ruang",
    cooked_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    safe_until: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // sisa 45 min
    handling_notes: "Wajib dipanaskan ulang sebelum disajikan.",
    status: "active",
    created_at: new Date().toISOString(),
    donor: {
      id: "dnr-1",
      role: "donor",
      display_name: "Catering Berkah Jaya - Bangkalan",
      address: "Jl. Raya Telang No. 12, Kamal, Bangkalan",
      organization_capacity: 1,
      credit_balance: 50000,
      strikes_count: 0,
      is_banned: false,
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "lst-2",
    donor_id: "dnr-2",
    title: "Roti Manis Assorted & Croissant Surplus",
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    portions: 25,
    remaining_portions: 20,
    risky_ingredients: [],
    dietary_tags: ["halal", "vegetarian"],
    storage_method: "etalase_tertutup",
    cooked_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    safe_until: new Date(Date.now() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(), // sisa 2j 15m
    handling_notes: "Siap dikonsumsi langsung.",
    status: "active",
    created_at: new Date().toISOString(),
    donor: {
      id: "dnr-2",
      role: "donor",
      display_name: "Hotel Grand Trunojoyo",
      address: "Jl. Soekarno Hatta No. 45, Bangkalan",
      organization_capacity: 1,
      credit_balance: 120000,
      strikes_count: 0,
      is_banned: false,
      created_at: new Date().toISOString(),
    },
  },
  {
    id: "lst-3",
    donor_id: "dnr-3",
    title: "Soto Ayam Madura & Pelengkap",
    image_url: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80",
    portions: 10,
    remaining_portions: 4,
    risky_ingredients: ["telur rebus", "kuah hangat"],
    dietary_tags: ["halal", "bebas_gluten"],
    storage_method: "pemanas_etalase",
    cooked_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    safe_until: new Date(Date.now() + 1 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
    handling_notes: "Kuah terpisah dari soun dan koya.",
    status: "active",
    created_at: new Date().toISOString(),
    donor: {
      id: "dnr-3",
      role: "donor",
      display_name: "Resto Warung Amboina",
      address: "Jl. KH. Moh. Cholil No. 8, Bangkalan",
      organization_capacity: 1,
      credit_balance: 75000,
      strikes_count: 0,
      is_banned: false,
      created_at: new Date().toISOString(),
    },
  },
];

export function SurplusRadar() {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [claimedId, setClaimedId] = useState<string | null>(null);

  const tags = [
    { id: "all", label: "Semua Surplus" },
    { id: "halal", label: "Halal" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "bebas_gluten", label: "Bebas Gluten" },
  ];

  const filteredListings = MOCK_LISTINGS.filter((item) => {
    if (selectedTag === "all") return true;
    return item.dietary_tags.includes(selectedTag);
  });

  const getRemainingTimeText = (safeUntilStr: string) => {
    const diffMs = new Date(safeUntilStr).getTime() - Date.now();
    if (diffMs <= 0) return "Kedaluwarsa";
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remMinutes = minutes % 60;

    if (hours > 0) {
      return `Sisa ${hours} jam ${remMinutes} menit lagi`;
    }
    return `Sisa ${minutes} menit lagi (Buru-buru!)`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-slate-50 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <span>Live Surplus Radar</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Umpan real-time makanan berlebih aman konsumsi terdekat di Bangkalan &amp; UTM.
          </p>
        </div>

        {/* Dietary Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 mr-1 hidden sm:block" />
          {tags.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTag(t.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                selectedTag === t.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Radar Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredListings.map((item) => {
          const isClaimed = claimedId === item.id;
          const isUrgent = new Date(item.safe_until).getTime() - Date.now() < 60 * 60 * 1000;

          return (
            <div
              key={item.id}
              className="glass-panel rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all flex flex-col group"
            >
              {/* Image Preview & Badges */}
              <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                {/* Remaining Portions Badge */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-200 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-blue-400" />
                  <span>Sisa {item.remaining_portions} Porsi</span>
                </div>

                {/* Urgent Time Badge */}
                <div
                  className={cn(
                    "absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1.5 border",
                    isUrgent
                      ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                      : "bg-slate-950/80 border-slate-800 text-emerald-400"
                  )}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{getRemainingTimeText(item.safe_until)}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-base text-slate-100 line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{item.donor?.display_name}</span>
                  </p>

                  {/* Risky Ingredients Warning if any */}
                  {item.risky_ingredients.length > 0 && (
                    <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5 flex items-start gap-2 text-amber-300 text-[11px]">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                      <span>
                        Bahan rentan: <strong>{item.risky_ingredients.join(", ")}</strong>. {item.handling_notes}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <button
                  onClick={() => setClaimedId(item.id)}
                  disabled={isClaimed}
                  className={cn(
                    "w-full py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2",
                    isClaimed
                      ? "bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 cursor-default"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  )}
                >
                  {isClaimed ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Klaim Token QR Berhasil!</span>
                    </>
                  ) : (
                    <span>Klaim 1 Porsi (QR Token Instan)</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
