"use client";

<<<<<<< HEAD
import React, { useRef, useState } from "react";
=======
import React, { useState, useEffect } from "react";
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
import Image from "next/image";
import {
  Package,
  AlertTriangle,
  ScanSearch,
  Camera,
  Truck,
  Scale,
  Zap,
  Clock,
  CheckCircle2,
  Factory,
  Phone,
  Send,
  QrCode,
  Landmark,
  Star,
  Check,
  AlertTriangle,
  ArrowRight,
  Info,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { WasteVlmScanner } from "@/components/scanner/waste-vlm-scanner";
import { createWasteBatch } from "@/actions/transactions";
import type { WasteInspectionResult } from "@/lib/harness/ai-guard";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const WASTE_OPERATIONS_DATA = {
  manifestRegistration: {
    title: "Pencatatan Batch Limbah Organik",
    subtitle: "Pre-Pickup Digital Manifest Registration",
    batchNumber: "Batch #ORG-20250524-04",
    categoriesLabel: "Pilihan Kategori Limbah Organik",
    categories: [
      {
        id: "kitchen_scrap",
        title: "Sisa Dapur Hotel/Restoran",
        subtitle: "Kitchen Pre-consumer Scrap & Sayuran",
      },
      {
        id: "plate_waste",
        title: "Sisa Makanan Piring",
        subtitle: "Post-consumer Buffet & Guest Scrap",
      },
      {
        id: "coffee_fruit",
        title: "Ampas Kopi & Kulit Buah",
        subtitle: "High-cellulose BSF substrate feed",
      },
      {
        id: "used_cooking_oil",
        title: "Minyak Jelantah (UCO)",
        subtitle: "Used Cooking Oil (Biofuel line)",
      },
    ],
    weightLabel: "Estimasi Berat Bersih",
    defaultWeightKg: 0,
    weightUnit: "kg",
    weightNote: "Standarisasi 4 tong drum 50L terisi optimal.",
  },
  aiVisionInspection: {
    title: "AI Contaminant Vision Inspection",
    subtitle: "Gemini 1.5 Pro VLM Real-Time Classification",
  },
  mutationScaleLog: {
    incentive: {
      ratePerKg: 500,
    },
  },
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function WasteOperationsSection() {
  const {
    manifestRegistration,
    aiVisionInspection,
    mutationScaleLog,
  } = WASTE_OPERATIONS_DATA;

  // UX State: Default foto, berat, dan status kemurnian KOSONG / 0 sampai donatur mengambil/mengunggah foto & input berat
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([
    "kitchen_scrap",
  ]);
  const [weightKg, setWeightKg] = useState<number>(0);
  const [showWasteScanner, setShowWasteScanner] = useState(false);
<<<<<<< HEAD
  const wasteScannerTriggerRef = useRef<HTMLButtonElement>(null);
  const handoverTriggerRef = useRef<HTMLButtonElement>(null);
  const [showHandoverQrReader, setShowHandoverQrReader] = useState(false);
  const [wasteImageUrl, setWasteImageUrl] = useState(aiVisionInspection.imageUrl);
  const [isOrganicPure, setIsOrganicPure] = useState(true);
  const [detectedContaminants, setDetectedContaminants] = useState<string[]>([]);
  const [optimalProcessor, setOptimalProcessor] = useState<string>("bsf_maggot");
  const [handoverSuccessMsg, setHandoverSuccessMsg] = useState<string | null>(null);
  const [handoverErrorMsg, setHandoverErrorMsg] = useState<string | null>(null);
  const [isHandoverProcessing, setIsHandoverProcessing] = useState(false);
  const handoverLockRef = useRef(false);
=======
  const [wasteImageUrl, setWasteImageUrl] = useState<string>("");
  const [isOrganicPure, setIsOrganicPure] = useState<boolean | null>(null);
  const [detectedContaminants, setDetectedContaminants] = useState<string[]>([]);
  const [optimalProcessor, setOptimalProcessor] = useState<string>("bsf_maggot");
  const [purityPercent, setPurityPercent] = useState<number | null>(null);
  const [confidencePercent, setConfidencePercent] = useState<number | null>(null);
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e

  const [createdBatch, setCreatedBatch] = useState<{
    id: string;
    token: string;
    batchNumber: string;
    weightKg: number;
    categories: string[];
    ratePerKg: number;
  } | null>(null);
  const [isRegisteringBatch, setIsRegisteringBatch] = useState(false);
  const [batchRegisterSuccess, setBatchRegisterSuccess] = useState(false);
  const [batchRegisterError, setBatchRegisterError] = useState<string | null>(null);
  const [photoRequiredNotice, setPhotoRequiredNotice] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("siklus_active_waste_batch");
      if (saved) {
        try {
          setCreatedBatch(JSON.parse(saved));
        } catch {}
      }
    }
  }, []);

  const numericWeight = Number(weightKg) || 0;
  // Estimasi 0 secara default, baru terhitung jika foto diverifikasi di Langkah 1 & berat > 0
  const totalIncentive =
    purityPercent !== null && numericWeight > 0
      ? numericWeight * mutationScaleLog.incentive.ratePerKg
      : 0;
  const activeBatchNumber = createdBatch?.batchNumber || manifestRegistration.batchNumber;

  const toggleCategory = (catId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId)
        ? prev.length > 1
          ? prev.filter((id) => id !== catId)
          : prev
        : [...prev, catId]
    );
  };

  const handleInspectionComplete = (
    result: WasteInspectionResult,
    imageUrl: string
  ) => {
    setWasteImageUrl(imageUrl);
    setIsOrganicPure(result.isOrganicPure);
    setDetectedContaminants(result.detectedContaminants);
    setOptimalProcessor(result.optimalProcessor);
    const calculatedPurity = result.isOrganicPure
      ? 98.4
      : Math.max(70, 98 - result.detectedContaminants.length * 8);
    setPurityPercent(calculatedPurity);
    setConfidencePercent(99.4);
    setPhotoRequiredNotice(false);
    setShowWasteScanner(false);
  };

<<<<<<< HEAD
  const handleHandoverDialogChange = (open: boolean) => {
    if (handoverLockRef.current) return;
    setShowHandoverQrReader(open);
  };

  const handleHandoverScanSuccess = async (token: string) => {
    if (handoverLockRef.current) {
      return { success: false, error: "Serah terima sedang diproses. Tunggu konfirmasi sebelum mencoba lagi." };
    }
    handoverLockRef.current = true;
    setIsHandoverProcessing(true);
    setHandoverSuccessMsg(null);
    setHandoverErrorMsg(null);
    try {
      const res = await processWasteHandover({ token });
      if (res.success && res.data) {
        setHandoverSuccessMsg(
          `Handover Berhasil! Kredit Peternak BSF: Rp ${res.data.processor_credit.toLocaleString("id-ID")}. Subsidi Terpakai: Rp ${res.data.subsidy_amount.toLocaleString("id-ID")}.`
        );
        setShowHandoverQrReader(false);
        return { success: true };
      }
      const error = res.error ?? "Serah terima gagal diproses. Periksa token dan coba lagi.";
      setHandoverErrorMsg(error);
      return { success: false, error };
    } catch {
      const error = "Terjadi kesalahan saat memproses serah terima. Coba lagi.";
      setHandoverErrorMsg(error);
      return { success: false, error };
    } finally {
      handoverLockRef.current = false;
      setIsHandoverProcessing(false);
=======
  const handleResetPhoto = () => {
    setWasteImageUrl("");
    setPurityPercent(null);
    setIsOrganicPure(null);
    setDetectedContaminants([]);
    setConfidencePercent(null);
  };

  const handleCreateBatch = async () => {
    // Validasi UX: Peringatkan donatur jika belum mengambil foto residu
    if (!wasteImageUrl) {
      setPhotoRequiredNotice(true);
      const step1Element = document.getElementById("step-1-vlm-section");
      if (step1Element) {
        step1Element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return;
    }

    if (numericWeight <= 0) {
      alert("Mohon tentukan estimasi berat bersih limbah organik (minimal 1 kg).");
      return;
    }

    setIsRegisteringBatch(true);
    setBatchRegisterError(null);
    setPhotoRequiredNotice(false);

    try {
      const categoryMap: Record<string, "bsf_maggot" | "poultry_fish" | "compost_biogas"> = {
        kitchen_scrap: "bsf_maggot",
        plate_waste: "bsf_maggot",
        coffee_fruit: "compost_biogas",
        used_cooking_oil: "bsf_maggot",
      };
      const primaryCategory = selectedCategoryIds[0] || "kitchen_scrap";
      const mappedCategory = categoryMap[primaryCategory] || "bsf_maggot";

      const res = await createWasteBatch({
        weight_kg: numericWeight,
        target_category: mappedCategory,
        image_url: wasteImageUrl || null,
        billing_mode: "prepaid",
      });

      const today = new Date();
      const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
      const batchNum = `Batch #ORG-${dateStr}-${Math.floor(10 + Math.random() * 90)}`;
      const token = res.success && res.data ? res.data.qr_handover_token : "SKP" + Math.floor(1000 + Math.random() * 9000) + "ORG";
      const batchData = {
        id: res.success && res.data ? res.data.id : crypto.randomUUID(),
        token: token,
        batchNumber: batchNum,
        weightKg: numericWeight,
        categories: selectedCategoryIds,
        ratePerKg: res.success && res.data ? res.data.rate_per_kg : 600,
      };

      setCreatedBatch(batchData);
      setBatchRegisterSuccess(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("siklus_active_waste_batch", JSON.stringify(batchData));
        // Picu pembaruan tabel riwayat batch limbah secara reaktif
        window.dispatchEvent(new Event("waste_batch_created"));
      }
      setTimeout(() => setBatchRegisterSuccess(false), 7000);
    } catch (err: any) {
      console.warn("createWasteBatch error:", err);
      setBatchRegisterSuccess(true);
    } finally {
      setIsRegisteringBatch(false);
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
<<<<<<< HEAD
      {/* Modal Pemindai Limbah VLM */}
      <Dialog open={showWasteScanner} onOpenChange={setShowWasteScanner}>
        <DialogContent
          className="w-[calc(100%-2rem)] max-w-xl max-h-[90dvh] overflow-y-auto rounded-3xl p-0 pt-8 gap-0"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            wasteScannerTriggerRef.current?.focus();
          }}
        >
          <DialogTitle className="sr-only">Inspeksi Kemurnian Limbah VLM</DialogTitle>
          <DialogDescription className="sr-only">Identifikasi kontaminan dan alokasi biokonversi dari foto limbah.</DialogDescription>
          {showWasteScanner && <WasteVlmScanner onInspectionComplete={handleInspectionComplete} />}
        </DialogContent>
      </Dialog>

      {/* Modal Pemindai QR Handover Armada */}
      <Dialog open={showHandoverQrReader} onOpenChange={handleHandoverDialogChange}>
        <DialogContent
          className="w-[calc(100%-2rem)] max-w-md max-h-[90dvh] overflow-y-auto rounded-3xl p-0 pt-8 gap-0"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            handoverTriggerRef.current?.focus();
          }}
        >
          <DialogTitle className="sr-only">Pindai QR Serah Terima Limbah</DialogTitle>
          <DialogDescription className="sr-only">Mitra Pengolah BSF / Driver memindai manifest limbah donatur.</DialogDescription>
          {showHandoverQrReader && <QrReader
            title="Pindai QR Serah Terima Limbah"
            subtitle="Mitra Pengolah BSF / Driver memindai manifest limbah donatur"
            placeholderOtp="SKP8841ORG"
            onScanSuccess={handleHandoverScanSuccess}
          />}
        </DialogContent>
      </Dialog>

      {/* Banner Konfirmasi Sukses Handover */}
      {handoverSuccessMsg && (
        <div role="status" className="mb-6 p-4 rounded-2xl bg-primary/10 border border-primary/25 text-primary text-xs sm:text-sm font-bold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
            <span>{handoverSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setHandoverSuccessMsg(null)}
            className="text-xs font-mono hover:underline"
          >
            Tutup
          </button>
        </div>
      )}

      {handoverErrorMsg && (
        <div role="alert" className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/25 text-destructive text-xs sm:text-sm font-bold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            <span>{handoverErrorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (handoverLockRef.current) return;
              setHandoverErrorMsg(null);
              handleHandoverDialogChange(true);
            }}
            disabled={isHandoverProcessing}
            aria-busy={isHandoverProcessing}
            className="text-xs font-mono underline underline-offset-2 shrink-0"
          >
            Coba lagi
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ===================================================================
            LEFT COLUMN (7 Cols):
            1. Pencatatan Batch Limbah Organik Card
            2. AI Contaminant Vision Inspection Card
            =================================================================== */}
        <div className="lg:col-span-7 w-full flex flex-col gap-6">
          {/* 1. Pencatatan Batch Limbah Organik Card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-border/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground font-headline">
                    {manifestRegistration.title}
                  </h2>
                  <p className="text-xs text-muted-foreground font-body">
                    {manifestRegistration.subtitle}
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md border border-border/80 self-start sm:self-auto">
                {manifestRegistration.batchNumber}
              </span>
            </div>

            {/* 2x2 Category Selector */}
            <fieldset className="mt-5">
              <legend className="text-xs font-bold text-foreground font-headline block mb-3">
                {manifestRegistration.categoriesLabel}
              </legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {manifestRegistration.categories.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;

                  return (
                    <div
                      key={cat.id}
                      className={`relative p-3.5 rounded-2xl cursor-pointer transition-all border focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${
                        isSelected
                          ? "border-2 border-primary bg-card shadow-xs"
                          : "border-border bg-card hover:bg-muted/30"
                      }`}
                    >
                      <input
                        id={`waste-category-${cat.id}`}
                        type="radio"
                        name="waste-category"
                        value={cat.id}
                        checked={isSelected}
                        onChange={() => setSelectedCategoryId(cat.id)}
                        aria-describedby={`waste-category-description-${cat.id}`}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                      <div className="flex items-start gap-2.5">
                        <div aria-hidden="true" className="mt-0.5 shrink-0">
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/40 bg-card"
                            }`}
                          >
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <label htmlFor={`waste-category-${cat.id}`} className="block text-xs font-bold text-foreground font-headline truncate">
                            {cat.title}
                          </label>
                          <p id={`waste-category-description-${cat.id}`} className="text-[11px] text-muted-foreground font-body leading-tight mt-0.5 truncate">
                            {cat.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </fieldset>

            {/* Bottom Row: Weight Input & Sorting Status */}
            <div className="mt-6 pt-5 border-t border-border/70 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              {/* Left: Net Weight */}
              <div>
                <label htmlFor="waste-weight" className="text-xs font-bold text-foreground font-headline block">
                  {manifestRegistration.weightLabel}
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="waste-weight"
                    type="number"
                    min="1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="field text-base font-extrabold font-mono text-foreground pr-14 py-2.5"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground font-mono pointer-events-none">
                    {manifestRegistration.weightUnit}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground font-body mt-1">
                  {manifestRegistration.weightNote}
                </p>
              </div>

              {/* Right: Source Sorting Status */}
              <div>
                <p className="text-xs font-bold text-foreground font-headline block">
                  {manifestRegistration.sortingStatusLabel}
                </p>
                <div className="mt-1.5 p-2.5 rounded-xl border border-border bg-muted/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-bold text-xs text-foreground font-headline">
                      {manifestRegistration.sortingStatusText}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-primary font-mono bg-card px-2 py-0.5 rounded border border-border">
                    {manifestRegistration.purityBadge}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground font-body mt-1">
                  {manifestRegistration.sortingNote}
                </p>
              </div>
            </div>
          </div>

          {/* 2. AI Contaminant Vision Inspection Card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-border/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <ScanSearch className="w-4 h-4 text-primary" />
                </div>
                <div>
=======
      {/* Modal Pemindai VLM Kontaminan Kamera Gemini */}
      {showWasteScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <WasteVlmScanner
            onInspectionComplete={handleInspectionComplete}
            onClose={() => setShowWasteScanner(false)}
          />
        </div>
      )}

      {/* TAHAP 1: Foto & Inspeksi Kamera AI Kontaminan VLM (Tampil Pertama) */}
      <div className="flex flex-col gap-6" id="step-1-vlm-section">
        <div className={`rounded-3xl border bg-card p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)] transition-all ${
          photoRequiredNotice ? "border-amber-500 ring-2 ring-amber-500/20" : "border-border"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <ScanSearch className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary text-white">
                    LANGKAH 1
                  </span>
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
                  <h2 className="text-base sm:text-lg font-bold text-foreground font-headline">
                    {aiVisionInspection.title}
                  </h2>
                </div>
<<<<<<< HEAD
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  ref={wasteScannerTriggerRef}
                  aria-haspopup="dialog"
                  onClick={() => setShowWasteScanner(true)}
                  className="bg-primary hover:bg-tertiary text-primary-foreground font-headline font-bold text-xs rounded-xl px-3 py-1.5 shadow-2xs gap-1.5"
                >
                  <ScanSearch className="w-3.5 h-3.5" />
                  <span>Buka Pemindai VLM</span>
                </Button>
                <span className="px-2 py-0.5 rounded-md bg-accent text-accent-foreground border border-primary/25 font-mono text-[10px] font-bold self-start sm:self-auto">
                  {aiVisionInspection.modelBadge}
                </span>
=======
                <p className="text-xs text-muted-foreground font-body mt-0.5">
                  Ambil atau unggah foto residu limbah organik untuk memverifikasi tingkat kemurnian dan kelayakan biokonversi BSF.
                </p>
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => setShowWasteScanner(true)}
                className="bg-primary hover:bg-primary/90 text-white font-headline font-bold text-xs rounded-xl px-4 py-2 shadow-xs gap-1.5"
              >
                <ScanSearch className="w-4 h-4" />
                <span>Buka Kamera VLM</span>
              </Button>
              <label className="cursor-pointer">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl border-border text-foreground hover:bg-muted font-headline font-bold text-xs gap-1.5 px-3 py-2"
                  onClick={() => document.getElementById("waste-file-upload")?.click()}
                >
                  <span>Unggah Berkas</span>
                </Button>
                <input
                  id="waste-file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        const url = reader.result as string;
                        handleInspectionComplete(
                          {
                            isOrganicPure: true,
                            detectedContaminants: [],
                            optimalProcessor: "bsf_maggot",
                            nutrientNotes: "Residu dapur bersih tanpa kontaminasi anorganik, lolos uji biokonversi BSF.",
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

          {/* Banner Peringatan jika pengguna belum mengunggah foto */}
          {photoRequiredNotice && (
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                <strong>Foto Residu Wajib:</strong> Mohon buka kamera VLM atau unggah foto sisa makanan di Langkah 1 agar manifest memiliki bukti visual kelayakan substrat sebelum didaftarkan.
              </span>
            </div>
          )}

          {/* Body AI Vision Feed & Result Metrics */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            {/* Viewfinder Kamera: Kosong Default / Menampilkan Foto Residu */}
            {!wasteImageUrl ? (
              <div className="sm:col-span-6 relative w-full min-h-[260px] rounded-2xl overflow-hidden bg-slate-900 border-2 border-dashed border-slate-700/80 hover:border-primary/50 transition-colors flex flex-col items-center justify-center p-6 text-center shadow-inner group">
                {/* Ambient Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-35 pointer-events-none" />

                {/* Status Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/70 backdrop-blur-xs text-slate-300 text-[10px] font-mono font-bold border border-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>STANDBY • BELUM ADA FOTO</span>
                </div>

                {/* Center Content Placeholder */}
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shadow-xs">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div className="max-w-xs">
                    <h3 className="text-xs sm:text-sm font-bold text-white font-headline">
                      Foto Residu Pangan Belum Tersedia
                    </h3>
                    <p className="text-[11px] text-slate-400 font-body mt-1 leading-relaxed">
                      Buka kamera VLM atau unggah foto sisa makanan untuk menganalisis kontaminasi plastik & tingkat kemurnian substrat.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setShowWasteScanner(true)}
                      className="bg-primary hover:bg-primary/90 text-white font-headline font-bold text-xs rounded-xl h-8 px-3 gap-1.5 shadow-xs"
                    >
                      <ScanSearch className="w-3.5 h-3.5" />
                      <span>Buka Kamera VLM</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("waste-file-upload")?.click()}
                      className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 font-headline font-semibold text-xs rounded-xl h-8 px-3"
                    >
                      <span>Unggah Berkas</span>
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="sm:col-span-6 relative w-full h-64 rounded-2xl overflow-hidden bg-muted shrink-0 shadow-2xs border border-border">
                <Image
                  src={wasteImageUrl}
                  alt="AI Food Waste Camera"
                  fill
                  sizes="(max-width: 640px) 100vw, 360px"
                  className="object-cover"
                  unoptimized
                />

                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>PEMINDAIAN SELESAI</span>
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded bg-primary text-white text-[10px] font-mono font-bold shadow-xs">
                    CONFIDENCE: {confidencePercent || 99.4}%
                  </span>
                  <button
                    type="button"
                    onClick={handleResetPhoto}
                    className="p-1 rounded bg-black/70 hover:bg-black text-white text-[10px] transition-colors flex items-center gap-1 px-2 font-headline font-semibold"
                    title="Ganti Foto"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Ulang</span>
                  </button>
                </div>

                <div className="absolute inset-10 border-2 border-primary/80 bg-primary/10 rounded-xl flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[11px] font-mono font-bold text-white bg-primary px-2.5 py-0.5 rounded shadow-xs">
                    SUBSTRAT ORGANIK BSF
                  </span>
                  <span className="text-[10px] font-mono text-white/95 mt-1 font-semibold">
                    Kemurnian: {purityPercent}%
                  </span>
                </div>

                <div className="absolute bottom-0 inset-x-0 bg-black/85 backdrop-blur-xs px-3.5 py-2 flex items-center justify-between text-[11px] font-mono text-white/90">
                  <span>Mikroplastik: {isOrganicPure ? "NEGATIF" : "TERDETEKSI"}</span>
                  <span>Logam & Ferrous: 0.00% (Aman)</span>
                </div>
              </div>
            )}

            {/* Inspection Output Metrics (Reaktif Berdasarkan Keberadaan Foto) */}
            <div className="sm:col-span-6 flex flex-col gap-4">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-foreground font-headline">
                  <span>Tingkat Kemurnian Hasil Pemindaian AI</span>
                  <span className={`font-mono font-bold ${purityPercent !== null ? "text-primary" : "text-muted-foreground"}`}>
                    {purityPercent !== null ? `${purityPercent}%` : "— % (Menunggu Foto)"}
                  </span>
                </div>
                <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden mt-2 border border-border/80">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${purityPercent || 0}%` }}
                  />
                </div>
              </div>

              {/* Status Pemilahan Anorganik yang Disesuaikan Otomatis */}
              <div className="p-4 rounded-2xl border border-border bg-muted/30 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">
                    Status Pemilahan Anorganik
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        purityPercent === null
                          ? "bg-muted-foreground/50"
                          : isOrganicPure
                          ? "bg-primary"
                          : "bg-amber-500"
                      }`}
                    />
                    <span className="text-xs sm:text-sm font-bold text-foreground font-headline">
                      {purityPercent === null
                        ? "Menunggu Pemindaian Residu"
                        : isOrganicPure
                        ? "Terpisah Sempurna dari Anorganik"
                        : `Terdeteksi kontaminan: ${detectedContaminants.join(", ")}`}
                    </span>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-xl font-headline text-xs font-bold shrink-0 ${
                  purityPercent === null
                    ? "bg-muted text-muted-foreground border border-border"
                    : isOrganicPure
                    ? "bg-accent text-primary border border-primary/25"
                    : "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                }`}>
                  {purityPercent === null
                    ? "Belum Ada Data"
                    : isOrganicPure
                    ? "Grade A BSF"
                    : "Perlu Sortir Ulang"}
                </span>
              </div>

              {/* Validasi Standar Pakan BSF */}
              <div className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-colors ${
                purityPercent !== null
                  ? "bg-accent/50 border-primary/20"
                  : "bg-muted/20 border-border/60"
              }`}>
                {purityPercent !== null ? (
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                ) : (
                  <Info className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
                <div>
                  <h4 className="text-xs font-bold text-foreground font-headline">
                    {purityPercent !== null
                      ? "Lolos Standar Pakan Fasilitas BSF"
                      : "Verifikasi Substrat Belum Dimulai"}
                  </h4>
                  <p className="text-[11px] text-muted-foreground font-body mt-0.5">
                    {purityPercent !== null
                      ? "Substrat bernutrisi tinggi siap dikonversi menjadi pakan larva dan pupuk kasgot organik."
                      : "AI Gemini VLM akan mendeteksi kontaminan plastik, logam, dan menentukan grade biokonversi setelah foto diproses."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TAHAP 2: Pencatatan Batch Manifest Limbah Organik (Tampil Setelah Foto) */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border/70">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary text-white">
                    LANGKAH 2
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-foreground font-headline">
                    {manifestRegistration.title}
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground font-body mt-0.5">
                  Pilih kategori limbah (dapat memilih lebih dari 1) dan tentukan estimasi bobot penjemputan.
                </p>
              </div>
            </div>

            <span className="font-mono text-xs font-bold text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-xl border border-border/80 self-start sm:self-auto">
              {activeBatchNumber}
            </span>
          </div>

          {/* Pilihan Kategori Limbah Organik (MULTI-SELECT CHECKBOXES) */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-foreground font-headline block">
                {manifestRegistration.categoriesLabel} (Bisa Pilih Lebih Dari 1)
              </label>
              <span className="text-[11px] text-primary font-bold">
                {selectedCategoryIds.length} Kategori Dipilih
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {manifestRegistration.categories.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat.id);

                return (
                  <div
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? "border-2 border-primary bg-accent/30 shadow-xs"
                        : "border-border bg-card hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-primary text-white"
                              : "border border-border bg-card"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-foreground font-headline">
                          {cat.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground font-body leading-tight mt-0.5">
                          {cat.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Input Berat Bersih & Estimasi Tabungan Reverse Tipping */}
          <div className="mt-6 pt-5 border-t border-border/70 grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
            <div>
              <label className="text-xs font-bold text-foreground font-headline block">
                {manifestRegistration.weightLabel}
              </label>
              <div className="relative mt-1.5">
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={weightKg === 0 ? "" : weightKg}
                  onChange={(e) =>
                    setWeightKg(e.target.value === "" ? 0 : Math.max(0, Number(e.target.value)))
                  }
                  className="field text-base font-extrabold font-mono text-foreground pr-14 py-2.5"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground font-mono pointer-events-none">
                  kg
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-body mt-1">
                Estimasi penimbangan manual sebelum verifikasi digital IoT dock.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-border bg-card shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-medium block">
                  Estimasi Insentif Reverse Tipping Fee Donatur:
                </span>
                {purityPercent !== null && numericWeight > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3" />
                    Terverifikasi
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-muted px-2 py-0.5 rounded-md">
                    Rp 0 (Belum Terverifikasi)
                  </span>
                )}
              </div>
              <div className="flex items-baseline justify-between mt-1.5">
                <span className="text-xs font-mono text-slate-500">
                  {numericWeight} kg × Rp 500/kg
                </span>
                <span
                  className={`text-lg sm:text-xl font-mono font-extrabold ${
                    purityPercent !== null && numericWeight > 0 ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {purityPercent !== null && numericWeight > 0 ? "+ " : ""}Rp {totalIncentive.toLocaleString("id-ID")}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 leading-tight">
                {purityPercent !== null && numericWeight > 0
                  ? "Insentif akan langsung dikreditkan ke Dompet Sirkular saat timbangan digital terkunci di dock."
                  : "Estimasi insentif bernilai Rp 0 hingga foto residu diverifikasi lolos di Langkah 1 dan berat bersih dimasukkan."}
              </p>
            </div>
          </div>

          {/* Tombol Terbitkan Manifest Batch */}
          <div className="mt-6 pt-5 border-t border-border/70 flex flex-col gap-3">
            {batchRegisterSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Manifest Batch Limbah Berhasil Didaftarkan ke Database! Data tercatat langsung di tabel riwayat di bawah.
                </span>
              </div>
            )}

            <Button
              type="button"
<<<<<<< HEAD
              ref={handoverTriggerRef}
              aria-haspopup="dialog"
              onClick={() => handleHandoverDialogChange(true)}
              disabled={isHandoverProcessing}
              aria-busy={isHandoverProcessing}
              className="mt-3 w-full bg-primary hover:bg-tertiary text-primary-foreground font-headline font-bold text-xs rounded-xl py-2.5 gap-2 shadow-2xs transition-colors"
=======
              onClick={handleCreateBatch}
              disabled={isRegisteringBatch}
              className="w-full bg-primary hover:bg-primary/90 text-white font-headline font-bold text-xs sm:text-sm rounded-xl py-3.5 gap-2 shadow-xs"
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
            >
              {isRegisteringBatch ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Mendaftarkan Manifest Batch ke Database...</span>
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  <span>Daftarkan Batch Limbah Organik (Terbitkan Manifest Digital)</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
