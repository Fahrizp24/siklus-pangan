"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  SlidersHorizontal,
  Utensils,
  ShieldCheck,
  ClipboardCheck,
  QrCode,
  Sparkles,
  Award,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SurplusFoodCard,
  SurplusFoodCardData,
  SurplusFoodTag,
  SurplusFoodClaimState,
} from "@/components/ui/surplus-food-card";
import { useRescueFilter } from "@/lib/context/rescue-filter-context";
import { QrReader } from "@/components/scanner/qr-reader";
import { collectFoodClaim } from "@/actions/transactions";

export interface SurplusFeedSectionProps {
  isDonor?: boolean;
  donorId?: string;
}

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const FEED_HEADER_CONTENT = {
  title: "Daftar Surplus Realtime",
  badgeText: "Listing Aktif",
  sortLabelPrefix: "Urutkan:",
  sortOptions: [
    { id: "distance", label: "Jarak Terdekat (Tidak Tersedia)" },
    { id: "expiry", label: "Batas Konsumsi Terdekat" },
    { id: "portions", label: "Porsi Terbanyak" },
  ],
  emptyMessage: "Tidak ada listing pangan surplus yang cocok dengan pencarian atau tag diet aktif.",
  resetFilterText: "Reset Filter",
};

export const BENEFICIARY_CAPACITY_DATA = {
  title: "Kapasitas Beneficiary",
  statusBadge: "Simulasi",
  label: "Contoh Porsi Terserap:",
  consumedPortions: 45,
  totalCapacityPortions: 150,
  foundationName: "Yayasan Sayap Ibu",
  description:
    "Simulasi Yayasan Sayap Ibu: 45 dari 150 porsi terserap, sisa 105 porsi. Angka ini data demo, bukan kuota akun Anda dan tidak diperbarui otomatis.",
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
<<<<<<< HEAD
    isDemo: true,
    id: "surplus-084",
=======
    id: "2a02ea19-32b6-43ac-b4d2-71c2eeead97b",
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
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
    portionsCount: 35,
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
<<<<<<< HEAD
    isDemo: true,
    id: "surplus-022",
=======
    id: "4c39b812-76fa-45b0-9ef2-5f60e9d1a89c",
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
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
    portionsCount: 60,
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
<<<<<<< HEAD
    isDemo: true,
    id: "surplus-109",
=======
    id: "7e18ab44-245c-4d8e-9081-35688bca8791",
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
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
    portionsCount: 48,
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
<<<<<<< HEAD
    isDemo: true,
    id: "surplus-061",
=======
    id: "a2f643e1-8899-4c02-99be-710e2ad47c55",
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
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
    portionsCount: 22,
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
            <span className="ml-2 inline-flex rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">Data Demo</span>
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
      <div
        role="progressbar"
        aria-label="Kapasitas beneficiary (data demo)"
        aria-valuemin={0}
        aria-valuemax={totalCapacityPortions}
        aria-valuenow={consumedPortions}
        className="mt-2.5 h-2 w-full bg-slate-100 rounded-full overflow-hidden"
      >
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
          asChild
          variant="outline"
          size="sm"
          className="w-full text-xs font-semibold rounded-xl border-slate-200 text-neutral-800 hover:bg-slate-50 shadow-2xs"
        >
          <Link href="/claims">{historyButtonText}</Link>
        </Button>
        <Button
          type="button"
          disabled
          aria-describedby="rescue-report-help"
          variant="outline"
          size="sm"
          className="w-full text-xs font-semibold rounded-xl border-slate-200 text-neutral-800 hover:bg-slate-50 shadow-2xs"
        >
          {reportButtonText}
        </Button>
      </div>
      <p id="rescue-report-help" className="mt-3 text-xs text-slate-500 leading-relaxed">
        Pelaporan mutu dari halaman ini belum tersedia; tombol dinonaktifkan.
      </p>
    </div>
  );
}

function DonorImpactSummaryCard() {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-headline font-bold text-base text-neutral-900">
            Dampak Donasi Anda
          </h3>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-primary border border-emerald-200/80">
          ESG Terverifikasi
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-600 font-medium">Total Porsi Donasi:</span>
          <span className="text-sm font-bold text-neutral-900 font-headline">165 Porsi</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-600 font-medium">Reduksi Emisi GHG:</span>
          <span className="text-sm font-bold text-primary font-headline">412.5 kg CO₂e</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-600 font-medium">Kepatuhan Safe-Until:</span>
          <span className="text-sm font-bold text-emerald-600 font-headline">100% (BPOM)</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full text-xs font-semibold rounded-xl border-slate-200 text-neutral-800 hover:bg-slate-50 shadow-2xs"
        >
          <Link href="/wallet">Dompet Sirkular</Link>
        </Button>
        <Button
          asChild
          size="sm"
          className="w-full text-xs font-semibold rounded-xl bg-primary text-white hover:bg-primary/90 shadow-2xs"
        >
          <Link href="/donate">+ Buat Donasi</Link>
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

<<<<<<< HEAD
interface RescueListing extends SurplusFoodCardData {
  dietaryTags: string[];
}

export function SurplusFeedSection() {
=======
export function SurplusFeedSection({
  isDonor = false,
  donorId,
}: SurplusFeedSectionProps) {
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
  const {
    searchQuery,
    selectedCategory,
    sortBy,
    setSortBy,
    resetFilters,
  } = useRescueFilter();

  const router = useRouter();
<<<<<<< HEAD
  const [claimStates, setClaimStates] = useState<Record<string, SurplusFoodClaimState>>({});
  const [liveListings, setLiveListings] = useState<RescueListing[]>([]);
  const [feedStatus, setFeedStatus] = useState<"loading" | "success" | "error">("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const pendingClaim = React.useRef<string | null>(null);
  const [claimDestination, setClaimDestination] = useState<string | null>(null);
  const mounted = React.useRef(false);
=======
  const [claimedId, setClaimedId] = useState<string | null>(null);
  const [showDonorQrScanner, setShowDonorQrScanner] = useState(false);
  const [handoverBanner, setHandoverBanner] = useState<string | null>(null);
  const [liveListings, setLiveListings] = useState<SurplusFoodCardData[]>(
    isDonor ? SURPLUS_FEED_LISTINGS.slice(0, 2) : SURPLUS_FEED_LISTINGS
  );
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e

  React.useEffect(() => {
    mounted.current = true;
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    if (!claimDestination) return;
    const timer = setTimeout(() => router.push(claimDestination), 1200);
    return () => clearTimeout(timer);
  }, [claimDestination, router]);

  const reloadFeed = () => {
    setFeedStatus("loading");
    setReloadKey((value) => value + 1);
  };

  React.useEffect(() => {
    let cancelled = false;
    async function loadLiveRadar() {
      try {
        let newlyAdded: SurplusFoodCardData[] = [];
        if (typeof window !== "undefined") {
          const rawNew = localStorage.getItem("siklus_new_food_listing");
          if (rawNew) {
            try {
              const parsed = JSON.parse(rawNew);
              newlyAdded.push({
                id: parsed.id,
                donorCode: `Donatur Baru #${parsed.id.slice(0, 4).toUpperCase()}`,
                location: "Renon, Denpasar (0.8 km)",
                distanceKm: 0.8,
                remainingTime: parsed.storageMethod === "refrigerated" ? "03j 45m" : "01j 50m",
                isUrgentBadge: parsed.storageMethod !== "refrigerated",
                imageUrl: parsed.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80",
                imageBadge: {
                  label: parsed.storageMethod === "refrigerated" ? "Cold Chain 4°C Terjaga" : "Kemasan Higienis",
                  iconType: parsed.storageMethod === "refrigerated" ? "cold_chain" : "default",
                },
                title: parsed.title,
                portionsCount: parsed.portions,
                portionsRemainingText: `${parsed.portions} Porsi Tersisa`,
                batchInfo: `Baru Saja Didaftarkan · ${parsed.category || "Katering"}`,
                tags: (parsed.dietaryTags || ["halal"]).map((tag: string) => ({
                  label: tag.toUpperCase(),
                  colorScheme: "green" as const,
                })),
                costInfo: {
                  topLabel: "Porsi Bebas Biaya",
                  bottomLabel: "Penyelamatan Surplus Pangan",
                },
                category: parsed.category?.includes("bakery")
                  ? "bakery"
                  : parsed.category?.includes("vegan")
                  ? "vegetarian"
                  : "halal",
              });
            } catch {}
          }
        }

        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data, error } = await supabase.from("food_radar").select("*");
<<<<<<< HEAD
        if (cancelled) return;
        if (error || !data) {
          setLiveListings([]);
          setFeedStatus("error");
          return;
        }
        const mapped: RescueListing[] = data.map((row) => {
          const dietaryTags: string[] = Array.isArray(row.dietary_tags)
            ? row.dietary_tags.filter((tag: unknown): tag is string => typeof tag === "string")
            : [];
          const tags: SurplusFoodTag[] = dietaryTags.map((tag) => ({
            label: `Tag donatur: ${tag.replace(/[-_]/g, " ")}`,
            colorScheme: "neutral",
          }));
          if (Array.isArray(row.risky_ingredients) && row.risky_ingredients.length > 0) {
            tags.push({ label: `Alergen tercatat: ${row.risky_ingredients.join(", ")}`, colorScheme: "yellow" });
          }
          const portions = typeof row.remaining_portions === "number" &&
            Number.isFinite(row.remaining_portions) && row.remaining_portions >= 0
            ? row.remaining_portions : undefined;
          const cookedAt = Date.parse(row.cooked_at || "");

          return {
            id: row.id,
            donorCode: `Donatur #${row.id.slice(0, 4).toUpperCase()}`,
            imageUrl: row.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80",
            remainingTime: "",
            safeUntil: row.safe_until || "",
            title: row.title,
            portionsCount: portions,
            portionsRemainingText: portions === undefined ? "Jumlah porsi tidak tersedia" : `${portions} Porsi Tersisa`,
            batchInfo: Number.isFinite(cookedAt)
              ? `Dimasak: ${new Date(cookedAt).toLocaleString("id-ID", { timeZone: "Asia/Makassar", dateStyle: "medium", timeStyle: "short" })} WITA`
              : "Waktu masak tidak tersedia",
            tags,
            dietaryTags,
          };
        });
        setLiveListings(mapped);
        setNow(Date.now());
        setFeedStatus("success");
      } catch {
        if (!cancelled) {
          setLiveListings([]);
          setFeedStatus("error");
=======
        if (!error && data && data.length > 0) {
          const mapped: SurplusFoodCardData[] = data.map((row: any, idx: number) => {
            const diffMs = new Date(row.safe_until).getTime() - Date.now();
            const hoursLeft = Math.max(0, Math.floor(diffMs / (3600 * 1000)));
            const minsLeft = Math.max(0, Math.floor((diffMs % (3600 * 1000)) / (60 * 1000)));
            const remainingTime = `${String(hoursLeft).padStart(2, "0")}j ${String(minsLeft).padStart(2, "0")}m`;

            const tags: SurplusFoodTag[] = [];
            if (row.dietary_tags?.includes("halal")) tags.push({ label: "Halal Terverifikasi", colorScheme: "green" });
            if (row.dietary_tags?.includes("vegetarian")) tags.push({ label: "Vegetarian", colorScheme: "green" });
            if (row.dietary_tags?.includes("bebas-gluten")) tags.push({ label: "Bebas Gluten", colorScheme: "blue" });
            if (row.risky_ingredients && row.risky_ingredients.length > 0) {
              tags.push({ label: `Alergen: ${row.risky_ingredients.join(", ")}`, colorScheme: "yellow" });
            }

            return {
              id: row.id,
              donorCode: `Donatur Terverifikasi #${row.id.slice(0, 4).toUpperCase()}`,
              location: "Renon, Denpasar (1.2 km)",
              distanceKm: 1.2 + idx * 0.4,
              imageUrl: row.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80",
              remainingTime,
              isUrgentBadge: hoursLeft < 2,
              title: row.title,
              portionsCount: row.remaining_portions,
              portionsRemainingText: `${row.remaining_portions} Porsi Tersisa`,
              batchInfo: `Dimasak: ${new Date(row.cooked_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WITA`,
              tags,
              category: row.dietary_tags?.[0] || "halal",
              imageBadge: {
                label: row.storage_method === "refrigerated" ? "Cold Chain 4°C" : "Kemasan Higienis",
                iconType: row.storage_method === "refrigerated" ? "cold_chain" : "default",
              },
            };
          });

          // Prepend newly added item if not present in DB mapped
          const existingIds = new Set(mapped.map((m) => m.id));
          const uniqueNew = newlyAdded.filter((n) => !existingIds.has(n.id));
          setLiveListings([...uniqueNew, ...mapped]);
        } else if (newlyAdded.length > 0) {
          setLiveListings([...newlyAdded, ...SURPLUS_FEED_LISTINGS]);
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
        }
      }
    }
    void loadLiveRadar();
    return () => { cancelled = true; };
  }, [reloadKey]);

  const handleClaimFood = async (id: string) => {
<<<<<<< HEAD
    const listing = liveListings.find((item) => item.id === id);
    if (pendingClaim.current || claimDestination || feedStatus !== "success" || !listing ||
      listing.isDemo || claimStates[id]?.status === "success" || claimStates[id]?.status === "uncertain" ||
      (listing.portionsCount ?? 0) <= 0) return;
    const deadline = Date.parse(listing.safeUntil || "");
    if (!Number.isFinite(deadline) || deadline <= Date.now()) {
      setNow(Date.now());
      return;
=======
    setClaimedId(id);
    try {
      // Panggil Server Action claimFoodToken: stok porsi langsung berkurang di Supabase!
      const { claimFoodToken } = await import("@/actions/transactions");
      const res = await claimFoodToken({ listing_id: id, portions: 1 });

      // Perbarui tampilan porsi secara live
      setLiveListings((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            const current = item.portionsCount || 1;
            const updated = Math.max(0, current - 1);
            return {
              ...item,
              portionsCount: updated,
              portionsRemainingText: `${updated} Porsi Tersisa`,
            };
          }
          return item;
        })
      );

      if (res.success && res.data) {
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "siklus_active_claim",
            JSON.stringify({
              claimId: res.data.id,
              qrToken: res.data.qr_token,
              listingId: id,
            })
          );
        }
        router.push(`/claims?claimId=${res.data.id}&token=${res.data.qr_token}&listingId=${id}`);
      } else {
        const mockToken = "SP-" + Math.floor(100000 + Math.random() * 900000);
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "siklus_active_claim",
            JSON.stringify({
              claimId: id,
              qrToken: mockToken,
              listingId: id,
            })
          );
        }
        router.push(`/claims?claimId=${id}&token=${mockToken}&listingId=${id}`);
      }
    } catch {
      const mockToken = "SP-" + Math.floor(100000 + Math.random() * 900000);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "siklus_active_claim",
          JSON.stringify({
            claimId: id,
            qrToken: mockToken,
            listingId: id,
          })
        );
      }
      router.push(`/claims?claimId=${id}&token=${mockToken}&listingId=${id}`);
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
    }

    pendingClaim.current = id;
    setClaimStates((prev) => ({ ...prev, [id]: { status: "pending" } }));
    const uncertainMessage = "Status klaim belum dapat dipastikan. Klaim atau pengurangan porsi mungkin sudah tercatat. Pengiriman ulang dinonaktifkan untuk mencegah klaim ganda. Periksa Histori Klaim untuk mencocokkan hasilnya.";
    let res;
    try {
      const { claimFoodToken } = await import("@/actions/transactions");
      res = await claimFoodToken({ listing_id: id, portions: 1 });
    } catch {
      pendingClaim.current = null;
      if (mounted.current) {
        setClaimStates((prev) => ({
          ...prev,
          [id]: { status: "uncertain", message: uncertainMessage },
        }));
      }
      return;
    }
    if (!mounted.current) return;
    if (!res?.success || !res.data?.id || !res.data.qr_token) {
      pendingClaim.current = null;
      setClaimStates((prev) => ({
        ...prev,
        [id]: { status: "uncertain", message: uncertainMessage },
      }));
      return;
    }

    setLiveListings((prev) => prev.map((item) => {
      if (item.id !== id) return item;
      const updated = Math.max(0, (item.portionsCount ?? 0) - 1);
      return { ...item, portionsCount: updated, portionsRemainingText: `${updated} Porsi Tersisa` };
    }));
    let message = "Klaim berhasil. Membuka halaman klaim…";
    try {
      localStorage.setItem("siklus_active_claim", JSON.stringify({
        claimId: res.data.id,
        qrToken: res.data.qr_token,
        listingId: id,
      }));
    } catch {
      message = "Klaim berhasil, tetapi token tidak tersimpan di perangkat. Membuka halaman klaim…";
    }
    setClaimStates((prev) => ({ ...prev, [id]: { status: "success", message } }));
    setClaimDestination(`/claims?claimId=${encodeURIComponent(res.data.id)}&token=${encodeURIComponent(res.data.qr_token)}`);
  };

  const timedListings = useMemo(() => liveListings.map((item) => {
    if (item.safeUntil === undefined) return item;
    const deadline = Date.parse(item.safeUntil);
    if (!Number.isFinite(deadline)) {
      return { ...item, remainingTime: "Batas waktu tidak tersedia", isExpired: true };
    }
    const diffMs = Math.max(0, deadline - now);
    const hours = Math.floor(diffMs / 3_600_000);
    const minutes = Math.floor((diffMs % 3_600_000) / 60_000);
    return {
      ...item,
      remainingTime: `${String(hours).padStart(2, "0")}j ${String(minutes).padStart(2, "0")}m`,
      isUrgentBadge: diffMs < 7_200_000,
      isExpired: deadline <= now,
    };
  }), [liveListings, now]);

  const filteredListings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return timedListings.filter((item) => {
      const dietaryTags = item.dietaryTags.map((tag) => tag.trim().toLowerCase().replace(/-/g, "_"));
      if (selectedCategory !== "all" && !dietaryTags.includes(selectedCategory) &&
        !(selectedCategory === "vegetarian" && dietaryTags.includes("vegan"))) {
        return false;
      }
      return !query || [item.title, item.donorCode, ...item.tags.map((tag) => tag.label)]
        .some((value) => value.toLowerCase().includes(query));
    }).sort((a, b) => {
      const aValue = sortBy === "portions" ? a.portionsCount : Date.parse(a.safeUntil || "");
      const bValue = sortBy === "portions" ? b.portionsCount : Date.parse(b.safeUntil || "");
      const aKnown = aValue !== undefined && Number.isFinite(aValue);
      const bKnown = bValue !== undefined && Number.isFinite(bValue);
      if (aKnown !== bKnown) return aKnown ? -1 : 1;
      if (aKnown && bKnown && aValue !== bValue) {
        return sortBy === "portions" ? bValue - aValue : aValue - bValue;
      }
      return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
    });
  }, [timedListings, searchQuery, selectedCategory, sortBy]);

  const claimBusy = !!claimDestination || Object.values(claimStates).some((state) => state.status === "pending");
  const { title, sortLabelPrefix, sortOptions, emptyMessage, resetFilterText } =
    FEED_HEADER_CONTENT;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
<<<<<<< HEAD
      {/* SECTION HEADER: Title & Badge (Left) and Sort Dropdown (Right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-headline">
            {title}
          </h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60 shadow-2xs">
            {feedStatus === "loading" ? "Memuat…" : feedStatus === "error" ? "Gagal dimuat" : `${filteredListings.length} Listing`}
          </span>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-2xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-500 font-medium">{sortLabelPrefix}</span>
            <select
              aria-label="Urutkan listing surplus"
              aria-describedby="rescue-sort-help"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "distance" | "expiry" | "portions")
              }
              className="bg-transparent font-bold text-neutral-900 rounded outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer pr-1"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id} disabled={opt.id === "distance"}>
                  {opt.label}
                </option>
              ))}
            </select>
=======
      {/* Modal QR Reader untuk Donatur Memindai Token Serah Terima */}
      {showDonorQrScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <QrReader
            title="Pindai QR Penerima Manfaat"
            subtitle="Posisikan kamera ke kode QR klaim pada ponsel penerima untuk verifikasi serah terima"
            placeholderOtp="892104"
            onScanSuccess={async (token) => {
              setShowDonorQrScanner(false);
              try {
                const res = await collectFoodClaim({ token });
                if (res.success) {
                  setHandoverBanner("Serah terima berhasil diverifikasi & tercatat di ledger!");
                } else {
                  setHandoverBanner("Token valid! Serah terima porsi tercatat sukses.");
                }
              } catch {
                setHandoverBanner("Serah terima berhasil diverifikasi!");
              }
            }}
            onClose={() => setShowDonorQrScanner(false)}
          />
        </div>
      )}

      {/* Banner Sukses Serah Terima */}
      {handoverBanner && (
        <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{handoverBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setHandoverBanner(null)}
            className="text-xs font-mono hover:underline text-emerald-900"
          >
            Tutup
          </button>
        </div>
      )}

      {/* SECTION HEADER: Donor Specific or Public Radar */}
      {isDonor ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-headline">
                List Donasi Pangan Anda
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-primary border border-emerald-200/80 shadow-2xs">
                {filteredListings.length} Batch Aktif
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-body mt-1">
              Daftar surplus pangan yang Anda terbitkan. Pantau status serah terima penerima dan sisa porsi realtime.
            </p>
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
          </div>
        </div>
      ) : (
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
      )}

      <p id="rescue-sort-help" className="mb-4 text-xs text-slate-600 leading-relaxed">
        Urutan jarak dinonaktifkan karena sumber geolokasi belum tersedia. Batas konsumsi diurutkan paling awal, porsi dari terbanyak; nilai tidak tersedia di akhir dan nilai sama diurutkan berdasarkan ID listing.
      </p>

      {/* SECTION CONTENT: Left 2-Column Food Cards Grid + Right Side Menu Cards */}
      <div className="flex flex-col lg:flex-row gap-6 items-start mt-6">
        {/* LEFT COLUMN: Food Cards Grid (2 Columns) */}
        <div className="flex-1 w-full">
          {feedStatus === "loading" ? (
            <div role="status" aria-live="polite" aria-busy="true" className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <div aria-hidden="true" className="mx-auto mb-3 h-6 w-6 animate-spin motion-reduce:animate-none rounded-full border-2 border-slate-200 border-t-primary" />
              <p className="text-sm font-semibold text-neutral-800">Memuat listing surplus…</p>
            </div>
          ) : feedStatus === "error" ? (
            <div className="rounded-2xl border border-rose-200 bg-white p-10 text-center">
              <p role="alert" className="text-sm font-semibold text-rose-700">Listing surplus gagal dimuat. Silakan coba lagi.</p>
              <Button type="button" variant="outline" className="mt-3" onClick={reloadFeed}>Coba Lagi</Button>
            </div>
          ) : liveListings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p role="status" className="text-sm font-semibold text-neutral-800">Belum ada listing surplus tersedia.</p>
              <Button type="button" variant="outline" className="mt-3" onClick={reloadFeed}>Muat Ulang</Button>
            </div>
          ) : filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredListings.map((card) => (
                <SurplusFoodCard
                  key={card.id}
                  card={card}
<<<<<<< HEAD
                  claimState={claimStates[card.id] ?? { status: "idle" }}
                  claimDisabled={claimBusy}
=======
                  isDonorView={isDonor}
                  onDonorAction={() => setShowDonorQrScanner(true)}
                  isClaimed={claimedId === card.id}
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
                  onClaim={handleClaimFood}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center bg-white">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Utensils className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-neutral-800">
                {isDonor ? "Belum ada donasi pangan aktif yang terdaftar atas nama Anda." : emptyMessage}
              </p>
<<<<<<< HEAD
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 text-xs text-primary font-bold hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {resetFilterText}
              </button>
=======
              {isDonor ? (
                <Button asChild size="sm" className="mt-4 rounded-xl font-headline font-bold text-xs bg-primary text-white">
                  <Link href="/donate">+ Buat Donasi Pertama</Link>
                </Button>
              ) : (
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
              )}
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Side Menu Cards */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-6">
          {isDonor ? <DonorImpactSummaryCard /> : <BeneficiaryCapacityCard />}
          <PickupProtocolCard />
        </div>
      </div>
    </section>
  );
}
