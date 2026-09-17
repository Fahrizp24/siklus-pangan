"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  SurplusFoodTag,
  SurplusFoodClaimState,
} from "@/components/ui/surplus-food-card";
import { useRescueFilter } from "@/lib/context/rescue-filter-context";

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
    isDemo: true,
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
    isDemo: true,
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
    isDemo: true,
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
    isDemo: true,
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

interface RescueListing extends SurplusFoodCardData {
  dietaryTags: string[];
}

export function SurplusFeedSection() {
  const {
    searchQuery,
    selectedCategory,
    sortBy,
    setSortBy,
    resetFilters,
  } = useRescueFilter();

  const router = useRouter();
  const [claimStates, setClaimStates] = useState<Record<string, SurplusFoodClaimState>>({});
  const [liveListings, setLiveListings] = useState<RescueListing[]>([]);
  const [feedStatus, setFeedStatus] = useState<"loading" | "success" | "error">("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const pendingClaim = React.useRef<string | null>(null);
  const [claimDestination, setClaimDestination] = useState<string | null>(null);
  const mounted = React.useRef(false);

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
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data, error } = await supabase.from("food_radar").select("*");
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
        }
      }
    }
    void loadLiveRadar();
    return () => { cancelled = true; };
  }, [reloadKey]);

  const handleClaimFood = async (id: string) => {
    const listing = liveListings.find((item) => item.id === id);
    if (pendingClaim.current || claimDestination || feedStatus !== "success" || !listing ||
      listing.isDemo || claimStates[id]?.status === "success" || claimStates[id]?.status === "uncertain" ||
      (listing.portionsCount ?? 0) <= 0) return;
    const deadline = Date.parse(listing.safeUntil || "");
    if (!Number.isFinite(deadline) || deadline <= Date.now()) {
      setNow(Date.now());
      return;
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
          </div>
        </div>
      </div>

      <p id="rescue-sort-help" className="mb-4 text-xs text-slate-600 leading-relaxed">
        Urutan jarak dinonaktifkan karena sumber geolokasi belum tersedia. Batas konsumsi diurutkan paling awal, porsi dari terbanyak; nilai tidak tersedia di akhir dan nilai sama diurutkan berdasarkan ID listing.
      </p>

      {/* SECTION CONTENT: Left 2-Column Food Cards Grid + Right Side Menu Cards */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
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
                  claimState={claimStates[card.id] ?? { status: "idle" }}
                  claimDisabled={claimBusy}
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
                {emptyMessage}
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 text-xs text-primary font-bold hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
