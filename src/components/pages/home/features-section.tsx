"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Radio,
  Sparkles,
  Recycle,
  Trophy,
  Clock,
  QrCode,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Leaf,
  LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO MODIFY)
   ========================================================================= */

export interface FeatureTabItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

export const FEATURE_TABS: FeatureTabItem[] = [
  {
    id: "rescue",
    label: "Live Surplus Radar",
    icon: Radio,
    href: "/rescue",
  },
  {
    id: "donate",
    label: "Donasi Pangan & AI Vision",
    icon: Sparkles,
    href: "/donate",
  },
  {
    id: "waste",
    label: "Biokonversi & Dompet",
    icon: Recycle,
    href: "/waste",
  },
  {
    id: "leaderboard",
    label: "Wall of Fame & ESG",
    icon: Trophy,
    href: "/leaderboard",
  },
];

export const RADAR_HEADER_CONTENT = {
  tagline: "REALTIME GEOLOCATION RESCUE FEED",
  title: "Radar Penyelamatan Surplus Pangan Aktif",
  subtitle:
    "Setiap donasi disamarkan identitas fisiknya (Nomor Seri Anonim) untuk melindungi privasi korporat.",
  filters: [
    { id: "all", label: "Semua Kategori" },
    { id: "halal", label: "Halal Terverifikasi" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "gluten_free", label: "Bebas Gluten" },
  ],
};

export interface SurplusCardTag {
  label: string;
  colorScheme: "yellow" | "green" | "blue";
}

export interface SurplusCardItem {
  id: string;
  donorCode: string;
  location: string;
  imageUrl: string;
  remainingTime: string;
  isUrgentBadge: boolean;
  eventOrShiftLabel: string;
  safeUntilText: string;
  title: string;
  description: string;
  tags: SurplusCardTag[];
  portionsCount: number;
  portionUnit: string;
  category: "halal" | "vegetarian" | "gluten_free" | "all";
}

export const SURPLUS_CARDS_DATA: SurplusCardItem[] = [
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
    category: "halal",
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
    category: "vegetarian",
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
    category: "halal",
  },
];

export const DUMMY_DONATE_TAB_DATA = {
  title: "Unggah Donasi Cepat dengan Analisis Gemini AI Vision",
  subtitle:
    "Ambil foto hidangan surplus, AI mendeteksi estimasi porsi, bahan rentan basi, dan menghitung batas konsumsi aman secara deterministik.",
  steps: [
    {
      step: "01",
      title: "Foto Makanan",
      desc: "VLM mendeteksi jenis makanan dan bahan masakan secara otomatis.",
    },
    {
      step: "02",
      title: "Engine Higienitas",
      desc: "Deterministic Rules Engine mengunci jam aman konsumsi (safe_until).",
    },
    {
      step: "03",
      title: "Publikasi Anonim",
      desc: "Nomor seri otomatis diterbitkan tanpa mengekspos brand korporat.",
    },
  ],
  ctaText: "Mulai Donasikan Pangan",
  ctaLink: "/donate",
};

export const DUMMY_WASTE_TAB_DATA = {
  title: "Sirkulasi Limbah Basi ke Biokonversi BSF & Reverse Tipping Fee",
  subtitle:
    "Sisa makanan yang telah melewati batas safe_until otomatis dialihkan ke peternak larva Black Soldier Fly dengan insentif logistik terbalik.",
  metrics: [
    { label: "Tarif Pengolahan Terbuka", value: "Rp 1.000 / kg" },
    { label: "Kredit Insentif Mitra BSF", value: "Rp 600 / kg" },
    { label: "Reduksi Emisi Metana", value: "95.8% Diverted" },
  ],
  ctaText: "Akses Dompet & Batch Limbah",
  ctaLink: "/waste",
};

export const DUMMY_ESG_TAB_DATA = {
  title: "Wall of Fame Donatur & Ledger ESG Tersertifikasi",
  subtitle:
    "Transparansi pelaporan reduksi emisi gas rumah kaca untuk pemenuhan sertifikat CSR & kepatuhan ISO 14064 korporat.",
  topDonors: [
    { rank: "01", name: "Hotel Mulia Senayan", savedKg: "12,450 kg", co2e: "7.2 ton CO2e" },
    { rank: "02", name: "Astra International Hall", savedKg: "9,820 kg", co2e: "5.7 ton CO2e" },
    { rank: "03", name: "Katering Selera Nusantara", savedKg: "8,140 kg", co2e: "4.7 ton CO2e" },
  ],
  ctaText: "Lihat Leaderboard Lengkap",
  ctaLink: "/leaderboard",
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function FeaturesSection() {
  const [activeTab, setActiveTab] = useState<string>("rescue");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [claimedId, setClaimedId] = useState<string | null>(null);

  const filteredCards = SURPLUS_CARDS_DATA.filter((card) => {
    if (selectedFilter === "all") return true;
    return card.category === selectedFilter;
  });

  const getTagClasses = (scheme: "yellow" | "green" | "blue") => {
    switch (scheme) {
      case "yellow":
        return "border-amber-300 bg-amber-50/80 text-amber-800";
      case "green":
        return "border-emerald-300 bg-emerald-50/80 text-emerald-800";
      case "blue":
        return "border-sky-300 bg-sky-50/80 text-sky-800";
      default:
        return "border-slate-200 bg-slate-50 text-slate-700";
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
        {/* TAB NAVIGATION HEADER (ALL 4 IN ONE ROW) */}
        <div className="border-b border-slate-200 pb-px flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar">
          {FEATURE_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 pb-3 px-1 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all relative ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-primary stroke-[2.5]" : "text-slate-400"
                  }`}
                />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        <div className="mt-6 sm:mt-8">
          <AnimatePresence mode="wait">
            {/* TAB 1: MODUL A - LIVE SURPLUS RADAR */}
            {activeTab === "rescue" && (
              <motion.div
                key="tab-rescue"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Header & Filter Controls */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-primary uppercase font-headline">
                      — {RADAR_HEADER_CONTENT.tagline}
                    </p>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-headline mt-1 tracking-tight">
                      {RADAR_HEADER_CONTENT.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-body mt-1 max-w-2xl">
                      {RADAR_HEADER_CONTENT.subtitle}
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
                    {RADAR_HEADER_CONTENT.filters.map((filter) => {
                      const isSelected = selectedFilter === filter.id;
                      return (
                        <button
                          key={filter.id}
                          onClick={() => setSelectedFilter(filter.id)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                            isSelected
                              ? "bg-primary text-white shadow-xs"
                              : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          {filter.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3 Food Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                  {filteredCards.map((card) => {
                    const isClaimed = claimedId === card.id;

                    return (
                      <div
                        key={card.id}
                        className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        {/* Image Container with Badges */}
                        <div>
                          <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                            <img
                              src={card.imageUrl}
                              alt={card.title}
                              className="w-full h-full object-cover"
                            />

                            {/* Top Left Anon Donor Badge */}
                            <div className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 shadow-sm">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                              <span>
                                {card.donorCode} • {card.location}
                              </span>
                            </div>

                            {/* Bottom Right Sisa Waktu Badge */}
                            <div
                              className={`absolute bottom-3 right-3 text-white text-[11px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm backdrop-blur-xs ${
                                card.isUrgentBadge
                                  ? "bg-red-600/90"
                                  : "bg-amber-600/90"
                              }`}
                            >
                              <Clock className="w-3 h-3 shrink-0" />
                              <span>{card.remainingTime}</span>
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-4 sm:p-5">
                            {/* Window & Safe Until Row */}
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <span className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                                {card.eventOrShiftLabel}
                              </span>
                              <span className="text-emerald-700 font-bold text-[11px]">
                                {card.safeUntilText}
                              </span>
                            </div>

                            {/* Title & Description */}
                            <h3 className="font-headline font-bold text-base text-neutral-900 mt-2.5 line-clamp-1">
                              {card.title}
                            </h3>
                            <p className="text-xs text-slate-500 font-body line-clamp-2 mt-1 leading-relaxed">
                              {card.description}
                            </p>

                            {/* Tags */}
                            <div className="mt-3 flex flex-wrap items-center gap-1.5">
                              {card.tags.map((tag) => (
                                <span
                                  key={tag.label}
                                  className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${getTagClasses(
                                    tag.colorScheme
                                  )}`}
                                >
                                  {tag.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Bottom Row: Portions & Claim Button */}
                        <div className="p-4 sm:p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                          <div className="flex items-baseline">
                            <span className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-headline">
                              {card.portionsCount}
                            </span>
                            <span className="text-xs text-slate-500 font-medium ml-1">
                              {card.portionUnit}
                            </span>
                          </div>

                          <Button
                            size="sm"
                            disabled={isClaimed}
                            onClick={() => setClaimedId(card.id)}
                            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-4 py-2 font-semibold text-xs shadow-xs gap-1.5"
                          >
                            <QrCode className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              {isClaimed ? "Terklaim!" : "Klaim Jatah"}
                            </span>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* TAB 2: DUMMY - DONASI PANGAN & AI VISION */}
            {activeTab === "donate" && (
              <motion.div
                key="tab-donate"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="py-6 space-y-6"
              >
                <div>
                  <p className="text-[11px] font-bold tracking-wider text-primary uppercase font-headline">
                    — AI COMPUTER VISION VERIFICATION
                  </p>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-headline mt-1 tracking-tight">
                    {DUMMY_DONATE_TAB_DATA.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-body mt-1 max-w-2xl">
                    {DUMMY_DONATE_TAB_DATA.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {DUMMY_DONATE_TAB_DATA.steps.map((s) => (
                    <div
                      key={s.step}
                      className="rounded-2xl border border-slate-200/90 p-5 bg-slate-50/50 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-2xl font-extrabold text-primary/40 font-headline">
                          {s.step}
                        </span>
                        <h4 className="text-base font-bold text-neutral-900 font-headline mt-1">
                          {s.title}
                        </h4>
                        <p className="text-xs text-slate-600 font-body mt-1 leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-1.5 text-xs text-primary font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Otomatis Terverifikasi</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <Button asChild className="rounded-xl shadow-xs gap-2 text-xs font-semibold">
                    <Link href={DUMMY_DONATE_TAB_DATA.ctaLink}>
                      <span>{DUMMY_DONATE_TAB_DATA.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* TAB 3: DUMMY - BIOKONVERSI & DOMPET */}
            {activeTab === "waste" && (
              <motion.div
                key="tab-waste"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="py-6 space-y-6"
              >
                <div>
                  <p className="text-[11px] font-bold tracking-wider text-primary uppercase font-headline">
                    — CIRCULAR ECONOMY & REVERSE TIPPING FEE
                  </p>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-headline mt-1 tracking-tight">
                    {DUMMY_WASTE_TAB_DATA.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-body mt-1 max-w-2xl">
                    {DUMMY_WASTE_TAB_DATA.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {DUMMY_WASTE_TAB_DATA.metrics.map((m) => (
                    <div
                      key={m.label}
                      className="rounded-2xl border border-slate-200/90 p-5 bg-slate-50/50"
                    >
                      <p className="text-xs font-semibold text-slate-500 uppercase font-headline">
                        {m.label}
                      </p>
                      <p className="text-2xl font-extrabold text-neutral-900 font-headline mt-2">
                        {m.value}
                      </p>
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-primary font-medium">
                        <Leaf className="w-3.5 h-3.5" />
                        <span>Sistem Biokonversi Maggot BSF</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <Button asChild className="rounded-xl shadow-xs gap-2 text-xs font-semibold">
                    <Link href={DUMMY_WASTE_TAB_DATA.ctaLink}>
                      <span>{DUMMY_WASTE_TAB_DATA.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}

            {/* TAB 4: DUMMY - WALL OF FAME & ESG */}
            {activeTab === "leaderboard" && (
              <motion.div
                key="tab-leaderboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="py-6 space-y-6"
              >
                <div>
                  <p className="text-[11px] font-bold tracking-wider text-primary uppercase font-headline">
                    — CERTIFIED CARBON OFFSET & CSR RECOGNITION
                  </p>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-headline mt-1 tracking-tight">
                    {DUMMY_ESG_TAB_DATA.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 font-body mt-1 max-w-2xl">
                    {DUMMY_ESG_TAB_DATA.subtitle}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {DUMMY_ESG_TAB_DATA.topDonors.map((donor) => (
                    <div
                      key={donor.rank}
                      className="rounded-2xl border border-slate-200/90 p-4 sm:p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-extrabold text-sm flex items-center justify-center font-headline">
                          #{donor.rank}
                        </span>
                        <div>
                          <h4 className="font-bold text-neutral-900 font-headline text-sm sm:text-base">
                            {donor.name}
                          </h4>
                          <p className="text-xs text-slate-500">
                            Terverifikasi ISO 14064 GHG Protocol
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <span className="font-bold text-neutral-900">
                          {donor.savedKg}
                        </span>
                        <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded-lg">
                          {donor.co2e} Offset
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <Button asChild className="rounded-xl shadow-xs gap-2 text-xs font-semibold">
                    <Link href={DUMMY_ESG_TAB_DATA.ctaLink}>
                      <span>{DUMMY_ESG_TAB_DATA.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
