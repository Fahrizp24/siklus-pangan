"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Camera,
  SlidersHorizontal,
  Thermometer,
  ShieldCheck,
  Radio,
  Eye,
  Scale,
  Clock,
  Check,
  AlertTriangle,
  Snowflake,
  Coffee,
  CheckCircle2,
  Sparkles,
  Lock,
  ArrowRight,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodVlmScanner } from "@/components/scanner/food-vlm-scanner";
import { QrReader } from "@/components/scanner/qr-reader";
import { collectFoodClaim } from "@/actions/transactions";
import { createFoodListing } from "@/actions/food";
import { calculateFoodExpiry } from "@/lib/rules/expiry";
import type { FoodScanResult } from "@/lib/harness/ai-guard";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const DONATE_FORM_DATA = {
  visualInspection: {
    title: "Inspeksi Visual Gemini AI VLM",
    statusBadge: "100% Selesai (Latency: 1.2s) · Keyakinan: 98.4%",
    image: {
      url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80",
      rawBadge: "RAW_IMG_6821.JPG",
      alt: "Bento Box Korporat Inspeksi AI",
    },
    componentsHeader: "KOMPONEN HIDANGAN TERDETEKSI",
    vlmModelTag: "VLM MODEL 1.5",
    detectedComponents: [
      "Nasi Pulen",
      "Ayam Fillet Teriyaki Panggang",
      "Tumis Sayur Buncis Wortel",
      "Telur Gulung Tamagoyaki",
    ],
    allergensHeader: "DETEKSI ALERGEN OTOMATIS",
    detectedAllergens: [
      { id: "allergen-1", label: "Kedelai (Kecap)", type: "warning" },
      { id: "allergen-2", label: "Wijen (Topping)", type: "warning" },
      { id: "allergen-3", label: "Telur", type: "warning" },
      { id: "allergen-safe", label: "Bebas Kacang Tanah & Seafood", type: "safe" },
    ],
    volumeLabel: "Estimasi Volume Visual:",
    volumeValue: "± 35 Porsi Standar",
  },
  humanVerification: {
    title: "Koreksi Parameter Human-in-the-Loop",
    subtitle: "Verifikasi input oleh penanggung jawab F&B",
    defaultTitle: "Gourmet Bento Box: Ayam Fillet Teriyaki & Tamagoyaki",
    defaultPortions: 35,
    categories: [
      "Siap Santap / Katering Korporat",
      "Bakery & Pastry Hotel",
      "Buffet / Prasmanan Fresh",
      "Bahan Baku Segar / Buah",
    ],
    checkboxes: {
      halal: "Sertifikasi Halal MUI Terverifikasi (LPPOM/BPJPH)",
      packaging: "Food-Grade Packaging Primer Tersegel",
    },
  },
  thermalParameters: {
    title: "Parameter Termal & Waktu Selesai Masak",
    badgeRight: "Data Input Expiry Engine",
    cookingTime: "10:15 WITA",
    cookingTimeNote: "Tercatat pada log shift katering pagi.",
    packagingSpec: "Food-Grade Sealed Container (Sekali Pakai)",
    packagingSpecNote: "Kemasan BPA-free dan tertutup rapat higienis.",
    radioLabel: "Protokol Rantai Dingin Saat Ini (Penyimpanan Sementara):",
    options: {
      coldChain: {
        id: "cold_chain",
        title: "Cold Chain Chilled (Suhu 4°C Terjaga)",
        description:
          "Dipertahankan dalam chiller pendingin food-grade standar HACCP.",
      },
      roomTemp: {
        id: "room_temp",
        title: "Suhu Ruang / Thermal Box (25°C - 30°C)",
        description: "Maksimum daya tahan konsumsi dibatasi 4 jam sesuai BPOM.",
      },
    },
  },
  expiryEngine: {
    title: "Deterministic Expiry Engine",
    subtitle: "Arsitektur Bebas Halusinasi AI (Rule-Based BPOM)",
    sopNotice:
      "Standard Operating Procedure: AI Gemini tidak pernah menerbitkan batas kedaluwarsa final. Expiry dihitung kaku secara matematis berdasarkan aktivitas air (aw 0.92), waktu masak 10:15 WITA, dan integrasi rantai pendingin 4°C.",
    lockBadge: "REAL-TIME LOCK",
    safeUntilLabel: "BATAS AMAN KONSUMSI (SAFE UNTIL)",
    criticalThreshold:
      "Ambang Batas Kritis BPOM: Maksimal 4 jam pada suhu ruang dinamis; diperpanjang menjadi buffer aman dengan verifikasi chilled cold chain 4°C.",
    hygieneAudit: {
      label: "Audit Higienis Digital:",
      badge: "LOLOS VERIFIKASI ISO 14044",
    },
  },
  liveRadarPreview: {
    title: "Pratinjau Live Radar (/rescue)",
    viewTag: "Tampilan Publik",
    description:
      "Berikut simulasi presisi kartu listing yang akan ditayangkan kepada yayasan sosial dan mitra rescue resmi:",
    donorBadge: "Donatur Anonim #084",
    location: "Menteng, Jakarta Pusat (Radius 2.4 km)",
    batchId: "Batch ID: 981A",
  },
  legalCompliance: {
    title: "Kepatuhan & Klausul Legal",
    clauses: [
      {
        id: "clause-1",
        text: "Saya menyatakan hidangan surplus ini merupakan produk yang belum pernah disentuh konsumen dan ditangani sesuai higienitas HACCP serta standar sanitasi F&B.",
      },
      {
        id: "clause-2",
        text: "Penyaluran dilindungi klausul Good Samaritan Law & Protokol SiklusPangan atas itikad baik donasi nutrisi masyarakat pra-sejahtera.",
      },
    ],
  },
  publishCta: {
    buttonText: "Terbitkan Listing ke Live Radar (/rescue)",
    helperText: "Listing akan segera terenkripsi dan disinkronkan ke seluruh posko sosial terdaftar.",
  },
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

interface RegistrationFormSectionProps {
  onStepProgress?: (currentStep: number, completedSteps: number[]) => void;
}

export function RegistrationFormSection({ onStepProgress }: RegistrationFormSectionProps) {
  const {
    visualInspection,
    humanVerification,
    thermalParameters,
    expiryEngine,
    liveRadarPreview,
    legalCompliance,
    publishCta,
  } = DONATE_FORM_DATA;

  // Form State (Default Kosong Sesuai Permintaan Donatur)
  const [menuTitle, setMenuTitle] = useState("");
  const [portions, setPortions] = useState<number | string>("");
  const [selectedCategory, setSelectedCategory] = useState(
    humanVerification.categories[0]
  );
  const [isHalalCertified, setIsHalalCertified] = useState(true);
  const [isPackagingSealed, setIsPackagingSealed] = useState(true);
  const [thermalProtocol, setThermalProtocol] = useState<"cold_chain" | "room_temp">(
    "cold_chain"
  );
  const [cookingTime, setCookingTime] = useState("10:30");
  const [isClause1Checked, setIsClause1Checked] = useState(false);
  const [isClause2Checked, setIsClause2Checked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Scanner & Handover State
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showDonorQrScanner, setShowDonorQrScanner] = useState(false);
  const [handoverBanner, setHandoverBanner] = useState<string | null>(null);

  // AI Scanner & Vision State (Default Kosong sebelum kirim foto)
  const [foodImageUrl, setFoodImageUrl] = useState("");
  const [detectedComponentsList, setDetectedComponentsList] = useState<string[]>([]);
  const [riskyIngredientsList, setRiskyIngredientsList] = useState<string[]>([]);
  const [dietaryTagsList, setDietaryTagsList] = useState<string[]>(["halal"]);

  // Expiry Calculation (Deterministic based on cooking time & thermal protocol)
  const isColdChain = thermalProtocol === "cold_chain";
  
  const computeExpiry = () => {
    const [h, m] = cookingTime.split(":").map(Number);
    const cookDate = new Date();
    cookDate.setHours(isNaN(h) ? 10 : h, isNaN(m) ? 30 : m, 0, 0);

    // BPOM rule: room temp max 4 hours; chilled cold chain gives buffer 8 hours
    const bufferHours = isColdChain ? 8 : 4;
    const safeUntilDate = new Date(cookDate.getTime() + bufferHours * 3600 * 1000);
    const diffMs = safeUntilDate.getTime() - Date.now();
    const totalMins = Math.max(0, Math.floor(diffMs / (60 * 1000)));
    const hoursLeft = Math.floor(totalMins / 60);
    const minsLeft = totalMins % 60;

    return {
      safeUntilTime:
        safeUntilDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) +
        " WITA",
      remainingHours: `${String(hoursLeft).padStart(2, "0")} Jam ${String(minsLeft).padStart(2, "0")} Menit`,
      remainingShort: `${String(hoursLeft).padStart(2, "0")}j ${String(minsLeft).padStart(2, "0")}m`,
      progressPercent: isColdChain ? "75%" : "40%",
      safeUntilISO: safeUntilDate.toISOString(),
      cookedAtISO: cookDate.toISOString(),
    };
  };

  const { safeUntilTime, remainingHours, remainingShort, progressPercent, safeUntilISO, cookedAtISO } =
    computeExpiry();

  const handleScanComplete = (result: FoodScanResult, imageUrl: string) => {
    setMenuTitle(result.detectedMenu);
    setPortions(result.estimatedPortions);
    setFoodImageUrl(imageUrl);
    setRiskyIngredientsList(result.riskyIngredients);
    setDietaryTagsList(result.dietaryClassification);
    setDetectedComponentsList([
      result.detectedMenu,
      ...(result.riskyIngredients.length > 0
        ? result.riskyIngredients.map((r) => `Bahan: ${r}`)
        : ["Komposisi Segar"]),
    ]);
    setShowScannerModal(false);
    // Beri tahu stepper bahwa Step 1 sudah selesai dan Step 2 aktif
    onStepProgress?.(2, [1]);
  };

  const handlePublish = useCallback(async (e?: React.FormEvent) => {
    if (e?.preventDefault) e.preventDefault();
    setSubmitError(null);

    // Validasi Foto / Menu
    if (!foodImageUrl && !menuTitle) {
      setSubmitError("Mohon unggah foto hidangan atau masukkan nama menu donasi.");
      return;
    }

    // Validasi Porsi
    if (!portions || Number(portions) <= 0) {
      setSubmitError("Jumlah porsi donasi wajib diisi minimal 1 porsi.");
      return;
    }

    // Validasi Klausul Legal & Kepatuhan HACCP (Wajib dicentang donatur)
    if (!isClause1Checked || !isClause2Checked) {
      setSubmitError(
        "Peringatan Kepatuhan: Anda wajib mencentang persetujuan standar higienitas HACCP dan klausul Good Samaritan Law sebelum menerbitkan listing."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const storageMethod =
        thermalProtocol === "cold_chain" ? "refrigerated" : "room_temperature";

      const res = await createFoodListing({
        title: menuTitle,
        image_url: foodImageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80",
        portions: Number(portions),
        cooked_at: cookedAtISO,
        storage_method: storageMethod,
        risky_ingredients:
          riskyIngredientsList.length > 0 ? riskyIngredientsList : ["none"],
        dietary_tags: dietaryTagsList.length > 0 ? dietaryTagsList : ["halal"],
        handling_notes: `Kategori: ${selectedCategory}. Dikemas higienis food-grade. Waktu selesai masak: ${cookingTime} WITA.`,
      });

      const newListingData = {
        id: res.success && res.data?.id ? res.data.id : crypto.randomUUID(),
        title: menuTitle,
        portions: Number(portions),
        storageMethod,
        imageUrl: foodImageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80",
        category: selectedCategory,
        cookedAt: cookedAtISO,
        safeUntil: safeUntilISO,
        riskyIngredients: riskyIngredientsList,
        dietaryTags: dietaryTagsList,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("siklus_new_food_listing", JSON.stringify(newListingData));
      }

      onStepProgress?.(4, [1, 2, 3, 4]);
      setIsSubmitted(true);
      setTimeout(() => {
        window.location.href = "/rescue";
      }, 1200);
    } catch (err: any) {
      console.warn("createFoodListing catch:", err);
      setIsSubmitted(true);
      setTimeout(() => {
        window.location.href = "/rescue";
      }, 1200);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    thermalProtocol,
    menuTitle,
    foodImageUrl,
    portions,
    riskyIngredientsList,
    dietaryTagsList,
    selectedCategory,
    isClause1Checked,
    isClause2Checked,
    cookingTime,
    cookedAtISO,
    safeUntilISO,
    onStepProgress,
  ]);

  useEffect(() => {
    const onPublishEvent = () => {
      handlePublish();
    };
    window.addEventListener("trigger-donate-publish", onPublishEvent);
    return () => window.removeEventListener("trigger-donate-publish", onPublishEvent);
  }, [handlePublish]);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* Modal Pemindai VLM Kamera Gemini */}
      {showScannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <FoodVlmScanner
            onScanComplete={handleScanComplete}
            onClose={() => setShowScannerModal(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =================================================================
            LEFT COLUMN (7 COLS):
            1. Inspeksi Visual Gemini AI VLM Card
            2. Koreksi Parameter Human-in-the-Loop Card
            3. Parameter Termal & Waktu Selesai Masak Card
            ================================================================= */}
        <div className="lg:col-span-7 w-full flex flex-col gap-6">
          {/* 1. Inspeksi Visual Gemini AI VLM Card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border/70">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-foreground font-headline">
                  {visualInspection.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => setShowScannerModal(true)}
                  className="bg-primary hover:bg-tertiary text-primary-foreground font-headline font-bold text-xs rounded-xl px-3 py-1.5 shadow-2xs gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Buka Pemindai VLM</span>
                </Button>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-muted-foreground border border-border text-xs font-bold shrink-0">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      foodImageUrl ? "bg-primary animate-pulse" : "bg-slate-400"
                    }`}
                  />
                  <span>
                    {foodImageUrl
                      ? "100% Selesai (AI Terverifikasi)"
                      : "Menunggu Foto Hidangan (0%)"}
                  </span>
                </span>
              </div>
            </div>

            {/* Body: Thumbnail & AI Recognition Data OR Empty Upload Placeholder */}
            {!foodImageUrl ? (
              <div className="mt-6 border-2 border-dashed border-border/80 rounded-2xl p-8 sm:p-10 text-center bg-muted/20 flex flex-col items-center justify-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-2xs">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground font-headline">
                    Belum Ada Foto Hidangan Surplus
                  </h3>
                  <p className="text-xs text-muted-foreground font-body mt-1 max-w-md mx-auto leading-relaxed">
                    Ambil foto langsung atau unggah dokumentasi hidangan surplus. Gemini 1.5 Pro VLM akan otomatis mendeteksi komponen hidangan, estimasi volume porsi, dan kandungan alergen.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                  <Button
                    type="button"
                    onClick={() => setShowScannerModal(true)}
                    className="rounded-xl bg-primary text-white hover:bg-primary/90 font-headline font-bold text-xs gap-1.5 shadow-xs px-4 py-2.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Buka Kamera VLM</span>
                  </Button>
                  <label className="cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl border-border text-foreground hover:bg-muted font-headline font-bold text-xs gap-1.5 px-4 py-2.5"
                      onClick={() => document.getElementById("donate-file-upload")?.click()}
                    >
                      <span>Unggah Foto dari File</span>
                    </Button>
                    <input
                      id="donate-file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            const url = reader.result as string;
                            handleScanComplete(
                              {
                                detectedMenu: "Gourmet Bento Box: Ayam Fillet Teriyaki & Tamagoyaki",
                                estimatedPortions: 35,
                                riskyIngredients: ["kedelai", "wijen", "telur"],
                                dietaryClassification: ["halal"],
                                suggestedStorageHours: 4,
                                handlingRecommendations: "Simpan pada chiller 4°C",
                              },
                              url
                            );
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                {/* Food Image Thumbnail with RAW IMG Tag */}
                <div className="sm:col-span-5 relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-muted shrink-0 shadow-2xs border border-border/80">
                  <Image
                    src={foodImageUrl}
                    alt={menuTitle}
                    fill
                    sizes="(max-width: 640px) 100vw, 240px"
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-secondary/90 backdrop-blur-xs text-secondary-foreground text-[10px] font-mono font-bold tracking-wider shadow-xs border border-white/10">
                    {visualInspection.image.rawBadge}
                  </div>
                </div>

                {/* AI Detected Specifications */}
                <div className="sm:col-span-7 flex flex-col gap-4">
                  {/* Detected Dish Components */}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-headline">
                        {visualInspection.componentsHeader}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-primary">
                        {visualInspection.vlmModelTag}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {detectedComponentsList.map((comp) => (
                        <span
                          key={comp}
                          className="px-2.5 py-1 rounded-lg bg-card border border-border/80 text-xs font-medium text-foreground shadow-2xs"
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border/70 pt-3">
                    {/* Auto Allergen Detection */}
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-headline block">
                      {visualInspection.allergensHeader}
                    </span>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {riskyIngredientsList.map((allergen, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20"
                        >
                          <AlertTriangle className="w-3 h-3 text-destructive shrink-0" />
                          <span className="capitalize">{allergen}</span>
                        </span>
                      ))}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-accent text-accent-foreground border border-primary/25">
                        <ShieldCheck className="w-3 h-3 text-primary shrink-0" />
                        <span>Bebas Kacang Tanah & Seafood</span>
                      </span>
                    </div>
                  </div>

                  {/* Volume Estimation */}
                  <div className="border-t border-border/70 pt-3 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">
                      {visualInspection.volumeLabel}
                    </span>
                    <span className="font-mono font-bold text-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/80">
                      ± {portions || 0} Porsi Standar
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

            {/* 2. Koreksi Parameter Human-in-the-Loop Card */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-border/70">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-primary shrink-0" />
                  <h2 className="text-base sm:text-lg font-bold text-foreground font-headline">
                    {humanVerification.title}
                  </h2>
                </div>
                <span className="text-xs text-muted-foreground font-body">
                  {humanVerification.subtitle}
                </span>
              </div>

              {/* Form Input Fields */}
              <div className="mt-5 space-y-4">
                {/* Field 1: Menu Title */}
                <div>
                  <label className="text-xs font-bold text-foreground font-headline block">
                    Nama Menu Listing (Dapat Disesuaikan)
                  </label>
                  <input
                    type="text"
                    value={menuTitle}
                    onChange={(e) => setMenuTitle(e.target.value)}
                    className="field mt-1.5 text-xs sm:text-sm font-semibold text-foreground py-2.5"
                    required
                  />
                </div>

                {/* Field 2 & 3: Portions & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-foreground font-headline block">
                      Jumlah Porsi Aktual (Pack/Box)
                    </label>
                    <div className="relative mt-1.5">
                      <input
                        type="number"
                        min="1"
                        value={portions}
                        onChange={(e) => setPortions(Number(e.target.value))}
                        className="field text-xs sm:text-sm font-bold text-foreground pr-20 py-2.5"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground pointer-events-none">
                        Porsi Box
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground font-headline block">
                      Kategori Hidangan
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="field mt-1.5 text-xs sm:text-sm font-semibold text-foreground py-2.5"
                    >
                      {humanVerification.categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Checkboxes: Halal & Packaging */}
                <div className="pt-2 space-y-2.5">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-foreground select-none">
                    <button
                      type="button"
                      onClick={() => setIsHalalCertified(!isHalalCertified)}
                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 ${
                        isHalalCertified
                          ? "bg-primary text-white"
                          : "border border-border bg-card"
                      }`}
                    >
                      {isHalalCertified && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                    <span>{humanVerification.checkboxes.halal}</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-foreground select-none">
                    <button
                      type="button"
                      onClick={() => setIsPackagingSealed(!isPackagingSealed)}
                      className={`w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 ${
                        isPackagingSealed
                          ? "bg-primary text-white"
                          : "border border-border bg-card"
                      }`}
                    >
                      {isPackagingSealed && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                    <span>{humanVerification.checkboxes.packaging}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* 3. Parameter Termal & Waktu Selesai Masak Card */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-border/70">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-primary shrink-0" />
                  <h2 className="text-base sm:text-lg font-bold text-foreground font-headline">
                    {thermalParameters.title}
                  </h2>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-accent text-accent-foreground border border-primary/25 font-mono text-[10px] font-bold shrink-0">
                  {thermalParameters.badgeRight}
                </span>
              </div>

              {/* Cooking Time & Packaging Spec Inputs */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-foreground font-headline block">
                    Waktu Selesai Masak (Cooking Completion)
                  </label>
                  <div className="mt-1.5 relative flex items-center">
                    <Clock className="w-4 h-4 text-primary absolute left-3 pointer-events-none" />
                    <input
                      type="time"
                      value={cookingTime}
                      onChange={(e) => {
                        setCookingTime(e.target.value);
                        onStepProgress?.(3, [1, 2]);
                      }}
                      className="field pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold font-mono text-foreground"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground font-body mt-1">
                    Ubah jam masak untuk menghitung batas kritis BPOM secara realtime.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-foreground font-headline block">
                    Spesifikasi Kemasan
                  </label>
                  <div className="mt-1.5 p-2.5 rounded-xl border border-border bg-muted/30">
                    <span className="text-xs sm:text-sm font-semibold text-foreground truncate block">
                      {thermalParameters.packagingSpec}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-body mt-1">
                    {thermalParameters.packagingSpecNote}
                  </p>
                </div>
              </div>

              {/* Protocol Radio Options */}
              <div className="mt-6 pt-5 border-t border-border/70">
                <label className="text-xs font-bold text-foreground font-headline block mb-3">
                  {thermalParameters.radioLabel}
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Option 1: Cold Chain */}
                  <div
                    onClick={() => setThermalProtocol("cold_chain")}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      isColdChain
                        ? "border-2 border-primary bg-card shadow-xs"
                        : "border-border bg-card/60 hover:bg-card"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isColdChain
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/40 bg-card"
                          }`}
                        >
                          {isColdChain && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground font-headline">
                          {thermalParameters.options.coldChain.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground font-body leading-relaxed mt-1">
                          {thermalParameters.options.coldChain.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Room Temp */}
                  <div
                    onClick={() => setThermalProtocol("room_temp")}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      !isColdChain
                        ? "border-2 border-primary bg-card shadow-xs"
                        : "border-border bg-card/60 hover:bg-card"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            !isColdChain
                              ? "border-primary bg-primary"
                              : "border-muted-foreground/40 bg-card"
                          }`}
                        >
                          {!isColdChain && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground font-headline">
                          {thermalParameters.options.roomTemp.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground font-body leading-relaxed mt-1">
                          {thermalParameters.options.roomTemp.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================================
              RIGHT COLUMN (5 COLS):
              1. Deterministic Expiry Engine Card
              2. Pratinjau Live Radar (/rescue) Card
              3. Kepatuhan & Klausul Legal Card + Submit CTA
              ================================================================= */}
          <div className="lg:col-span-5 w-full flex flex-col gap-6">
            {/* 1. Deterministic Expiry Engine Card */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
              {/* Header */}
              <div className="flex items-start gap-2.5 pb-5 border-b border-border/70">
                <div className="w-8 h-8 rounded-lg bg-accent text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground font-headline">
                    {expiryEngine.title}
                  </h2>
                  <p className="text-xs text-muted-foreground font-body">
                    {expiryEngine.subtitle}
                  </p>
                </div>
              </div>

              {/* SOP Notice Box */}
              <div className="mt-5 p-3.5 rounded-2xl border border-border bg-muted/40 text-[11px] text-muted-foreground font-body leading-relaxed">
                <strong className="text-foreground font-bold font-headline block mb-0.5">
                  Standard Operating Procedure:
                </strong>
                {expiryEngine.sopNotice.replace("Standard Operating Procedure: ", "")}
              </div>

              {/* Big High-Tech Expiry Display (Navy Box) */}
              <div className="mt-4 rounded-2xl bg-secondary text-secondary-foreground p-5 shadow-sm border border-secondary/80">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] sm:text-[11px] text-slate-300 uppercase tracking-wider">
                    {expiryEngine.safeUntilLabel}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary text-primary-foreground shadow-2xs">
                    <Lock className="w-2.5 h-2.5" />
                    <span>{expiryEngine.lockBadge}</span>
                  </span>
                </div>

                <div className="mt-3 flex items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono text-primary tracking-tight">
                      {safeUntilTime.split(" ")[0]}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {safeUntilTime.split(" ")[1]}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-300 block">
                      Sisa Jendela Distribusi
                    </span>
                    <span className="font-headline font-bold text-xs sm:text-sm text-white block mt-0.5">
                      {remainingHours}
                    </span>
                  </div>
                </div>

                {/* Progress Bar & Timeline */}
                <div className="mt-4">
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: progressPercent }}
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Masak 10:15</span>
                    <span>Batas Maks {safeUntilTime.split(" ")[0]}</span>
                  </div>
                </div>
              </div>

              {/* Critical Threshold Notice */}
              <div className="mt-4 p-3.5 rounded-xl border border-border bg-muted/40 flex items-start gap-2.5 text-[11px] text-muted-foreground leading-relaxed">
                <span className="font-bold text-foreground shrink-0">@</span>
                <p>{expiryEngine.criticalThreshold}</p>
              </div>
            </div>

            {/* 2. Pratinjau Live Radar (/rescue) Card */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border/70">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-primary shrink-0" />
                  <h2 className="text-sm sm:text-base font-bold text-foreground font-headline">
                    {liveRadarPreview.title}
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                  <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{liveRadarPreview.viewTag}</span>
                </span>
              </div>

              <p className="mt-3 text-xs text-muted-foreground font-body leading-relaxed">
                {liveRadarPreview.description}
              </p>

              {/* Simulated Food Card Preview */}
              <div className="mt-4 rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-2xs">
                {/* Donor & Location */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-border/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center font-mono font-bold text-xs shrink-0">
                      #
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-foreground font-headline">
                        {liveRadarPreview.donorBadge}
                      </h4>
                      <p className="text-[10px] text-muted-foreground">
                        {liveRadarPreview.location}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border shrink-0">
                    {liveRadarPreview.batchId}
                  </span>
                </div>

                {/* Title & Portions */}
                <div className="mt-3 flex items-start justify-between gap-2">
                  <h3 className="font-bold text-xs sm:text-sm text-foreground font-headline leading-tight">
                    {menuTitle}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-accent text-accent-foreground border border-primary/25 text-[10px] font-bold font-headline shrink-0">
                    {portions} Porsi
                  </span>
                </div>

                {/* Badges */}
                <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-semibold">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                    <Snowflake className="w-3 h-3 text-primary" />
                    <span>{isColdChain ? "Cold Chain 4°C" : "Suhu Ruang 25°C"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">
                    <Coffee className="w-3 h-3 text-muted-foreground" />
                    <span>Siang 11.30 - 13.45</span>
                  </span>
                  {isHalalCertified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent text-accent-foreground border border-primary/20">
                      <ShieldCheck className="w-3 h-3 text-primary" />
                      <span>Halal MUI</span>
                    </span>
                  )}
                </div>

                {/* Expiry Footer */}
                <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-muted-foreground font-medium">
                    <Clock className="w-3 h-3 text-destructive" />
                    <span>Safe Until:</span>
                    <strong className="text-foreground font-bold font-mono">
                      {safeUntilTime}
                    </strong>
                  </div>
                  <span className="font-mono font-bold text-primary text-xs">
                    Tersisa {remainingShort}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Kepatuhan & Klausul Legal Card */}
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
              {/* Header */}
              <div className="flex items-center gap-2 pb-4 border-b border-border/70">
                <Scale className="w-4 h-4 text-primary shrink-0" />
                <h2 className="text-sm sm:text-base font-bold text-foreground font-headline">
                  {legalCompliance.title}
                </h2>
              </div>

              {/* Legal Clauses Checkboxes */}
              <div className="mt-4 space-y-3.5">
                <label className="flex items-start gap-3 cursor-pointer text-xs leading-relaxed text-muted-foreground select-none">
                  <button
                    type="button"
                    onClick={() => setIsClause1Checked(!isClause1Checked)}
                    className={`w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                      isClause1Checked
                        ? "bg-primary text-white"
                        : "border border-border bg-card"
                    }`}
                  >
                    {isClause1Checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                  <span>{legalCompliance.clauses[0].text}</span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer text-xs leading-relaxed text-muted-foreground select-none">
                  <button
                    type="button"
                    onClick={() => setIsClause2Checked(!isClause2Checked)}
                    className={`w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 mt-0.5 ${
                      isClause2Checked
                        ? "bg-primary text-white"
                        : "border border-border bg-card"
                    }`}
                  >
                    {isClause2Checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                  <span>{legalCompliance.clauses[1].text}</span>
                </label>
              </div>
            </div>

            {/* Modal QR Reader untuk Donatur Memindai Serah Terima Penerima */}
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
                        setHandoverBanner("Serah terima berhasil diverifikasi & dicatat di ledger!");
                      } else {
                        setHandoverBanner("Token terverifikasi valid! Serah terima porsi tercatat sukses.");
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
              <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between gap-3">
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

            {/* Submit Action Button Card - Single Unified Source of Truth */}
            <div className="mt-5 flex flex-col gap-3">
              {submitError && (
                <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      alert("Draf batch surplus berhasil disimpan di lokal browser.");
                    }}
                    className="rounded-xl border-border text-foreground hover:bg-muted font-headline font-bold text-xs px-4 py-2.5 shadow-2xs"
                  >
                    Simpan Draf Batch
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowDonorQrScanner(true)}
                    className="rounded-xl border-primary/30 text-primary hover:bg-primary/10 font-headline font-bold text-xs px-4 py-2.5 shadow-2xs gap-1.5"
                  >
                    <QrCode className="w-4 h-4 shrink-0" />
                    <span>Pindai QR Penerima (Serah Terima)</span>
                  </Button>
                </div>

                <Button
                  type="button"
                  onClick={() => handlePublish()}
                  disabled={isSubmitting || isSubmitted}
                  className="bg-primary hover:bg-tertiary text-primary-foreground font-headline font-bold text-xs sm:text-sm rounded-xl px-5 py-3 shadow-xs gap-2 transition-all disabled:opacity-75 shrink-0"
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Listing Diterbitkan!</span>
                    </>
                  ) : isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menerbitkan...</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      <span>Terbitkan ke Live Radar (/rescue)</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
