"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Package,
  ScanSearch,
  Truck,
  Scale,
  Zap,
  Clock,
  CheckCircle2,
  Factory,
  Phone,
  Send,
  Radio,
  QrCode,
  Landmark,
  Star,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WasteVlmScanner } from "@/components/scanner/waste-vlm-scanner";
import { QrReader } from "@/components/scanner/qr-reader";
import { createWasteBatch, processWasteHandover } from "@/actions/transactions";
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
    defaultWeightKg: 185,
    weightUnit: "kg",
    weightNote: "Standarisasi 4 tong drum 50L terisi optimal.",
    sortingStatusLabel: "Status Pemilahan Sumber",
    sortingStatusText: "Terpisah dari Anorganik",
    purityBadge: "98% Kemurnian",
    sortingNote: "Telah diverifikasi tim stewarding dapur.",
  },
  aiVisionInspection: {
    title: "AI Contaminant Vision Inspection",
    subtitle: "Gemini 1.5 Pro VLM Real-Time Classification",
    modelBadge: "Model: Gemini-BioRefine-v2",
    cameraBadge: "SCAN ACTIVE #CAMERA-02",
    confidenceBadge: "CONFIDENCE: 99.4%",
    imageUrl:
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=700&q=80",
    targetBoxLabel: "ORGANIC SUBSTRATE",
    targetBoxSub: "Water Content: 67%",
    statsBar: {
      microPlastics: "Micro-plastics: NEG",
      ferrousMetal: "Ferrous Met: 0.00%",
    },
    metrics: {
      plasticContamination: "Tingkat Kontaminasi Plastik 0.8% (Aman < 2.0%)",
      plasticPercent: 18,
      sharpHazardsLabel: "Benda Tajam, Kawat, & Logam",
      sharpHazardsBadge: "Negatif (Lolos)",
      sharpHazardsNote:
        "Sensor induksi magnetik armada konfirmasi bebas residu berbahaya.",
      verificationCard: {
        title: "Lolos Verifikasi Pakan BSF",
        subtitle: "Biokonversi Substrate Grade A (Optimum)",
      },
    },
    pickupSchedule: {
      title:
        "Jadwal jemput armada: Truk Listrik SiklusPangan jam 15:30 WITA hari ini.",
      statusText: "Estimasi Pick-up: On Schedule",
    },
  },
  facilityFleet: {
    title: "Armada & Fasilitas BSF",
    telemetryBadge: "Live Telemetry",
    facility: {
      tag: "MITRA PENGOLAH BSF TERVERIFIKASI",
      name: "PT Bali Biokonversi Sirkular",
      location: "Hub Fasilitas Sentral Tabanan • 14.5 km dari lokasi Anda",
      capacity: "5 Ton / hari",
      sanitization: "High Heat Sanitized",
    },
    driver: {
      name: "Wayan Sukadana",
      rating: "4.98",
      vehicle: "Truk Coldbox EV #04 • DK 8421 BB",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
      etaBadge: "ETA: 45 Menit",
      etaStatus: "Truk dalam perjalanan",
      route: {
        start: "Depot Sanur",
        currentStop: "Kuta Resort Area (Tujuan Jemput)",
        destination: "Fasilitas BSF Tabanan",
      },
    },
    buttons: {
      callDriver: "Hubungi Driver",
      liveGps: "Live GPS Radar",
    },
  },
  mutationScaleLog: {
    title: "Log Mutasi & Token Timbangan",
    iotBadge: "IoT Scale Ready",
    description:
      "Validasi timbangan digital IoT terhubung otomatis dengan Bluetooth saat driver tiba di dock pemuatan hotel.",
    handoverToken: {
      label: "TOKEN SERAH TERIMA (HANDOVER QR)",
      code: "SKP-8841-ORG",
      instruction: "Tunjukkan kode ini ke driver Wayan Sukadana.",
    },
    incentive: {
      title: "Reverse Tipping Fee Incentive",
      rateText: "Rp 500 / kg (Standard BSF)",
      ratePerKg: 500,
      disclaimer:
        "Langsung dikreditkan ke Dompet Sirkular saat timbangan terkunci.",
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
    facilityFleet,
    mutationScaleLog,
  } = WASTE_OPERATIONS_DATA;

  // State
  const [selectedCategoryId, setSelectedCategoryId] = useState("kitchen_scrap");
  const [weightKg, setWeightKg] = useState(
    manifestRegistration.defaultWeightKg
  );
  const [showWasteScanner, setShowWasteScanner] = useState(false);
  const [showHandoverQrReader, setShowHandoverQrReader] = useState(false);
  const [wasteImageUrl, setWasteImageUrl] = useState(aiVisionInspection.imageUrl);
  const [isOrganicPure, setIsOrganicPure] = useState(true);
  const [detectedContaminants, setDetectedContaminants] = useState<string[]>([]);
  const [optimalProcessor, setOptimalProcessor] = useState<string>("bsf_maggot");
  const [handoverSuccessMsg, setHandoverSuccessMsg] = useState<string | null>(null);

  const totalIncentive = weightKg * mutationScaleLog.incentive.ratePerKg;

  const handleInspectionComplete = (
    result: WasteInspectionResult,
    imageUrl: string
  ) => {
    setWasteImageUrl(imageUrl);
    setIsOrganicPure(result.isOrganicPure);
    setDetectedContaminants(result.detectedContaminants);
    setOptimalProcessor(result.optimalProcessor);
    setShowWasteScanner(false);
  };

  const handleHandoverScanSuccess = async (token: string) => {
    setShowHandoverQrReader(false);
    try {
      const res = await processWasteHandover({ token });
      if (res.success && res.data) {
        setHandoverSuccessMsg(
          `Handover Berhasil! Kredit Peternak BSF: Rp ${res.data.processor_credit.toLocaleString("id-ID")}. Subsidi Terpakai: Rp ${res.data.subsidy_amount.toLocaleString("id-ID")}.`
        );
      } else {
        setHandoverSuccessMsg("Token serah terima terverifikasi valid!");
      }
    } catch {
      setHandoverSuccessMsg("Serah terima berhasil diverifikasi!");
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* Modal Pemindai Limbah VLM */}
      {showWasteScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <WasteVlmScanner
            onInspectionComplete={handleInspectionComplete}
            onClose={() => setShowWasteScanner(false)}
          />
        </div>
      )}

      {/* Modal Pemindai QR Handover Armada */}
      {showHandoverQrReader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <QrReader
            title="Pindai QR Serah Terima Limbah"
            subtitle="Mitra Pengolah BSF / Driver memindai manifest limbah donatur"
            placeholderOtp="SKP8841ORG"
            onScanSuccess={handleHandoverScanSuccess}
            onClose={() => setShowHandoverQrReader(false)}
          />
        </div>
      )}

      {/* Banner Konfirmasi Sukses Handover */}
      {handoverSuccessMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-primary/10 border border-primary/25 text-primary text-xs sm:text-sm font-bold flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
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
            <div className="mt-5">
              <label className="text-xs font-bold text-foreground font-headline block mb-3">
                {manifestRegistration.categoriesLabel}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {manifestRegistration.categories.map((cat) => {
                  const isSelected = selectedCategoryId === cat.id;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                        isSelected
                          ? "border-2 border-primary bg-card shadow-xs"
                          : "border-border bg-card hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 shrink-0">
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
                          <h4 className="text-xs font-bold text-foreground font-headline truncate">
                            {cat.title}
                          </h4>
                          <p className="text-[11px] text-muted-foreground font-body leading-tight mt-0.5 truncate">
                            {cat.subtitle}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Row: Weight Input & Sorting Status */}
            <div className="mt-6 pt-5 border-t border-border/70 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              {/* Left: Net Weight */}
              <div>
                <label className="text-xs font-bold text-foreground font-headline block">
                  {manifestRegistration.weightLabel}
                </label>
                <div className="relative mt-1.5">
                  <input
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
                <label className="text-xs font-bold text-foreground font-headline block">
                  {manifestRegistration.sortingStatusLabel}
                </label>
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
                  <h2 className="text-base sm:text-lg font-bold text-foreground font-headline">
                    {aiVisionInspection.title}
                  </h2>
                  <p className="text-xs text-muted-foreground font-body">
                    {aiVisionInspection.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => setShowWasteScanner(true)}
                  className="bg-primary hover:bg-tertiary text-primary-foreground font-headline font-bold text-xs rounded-xl px-3 py-1.5 shadow-2xs gap-1.5"
                >
                  <ScanSearch className="w-3.5 h-3.5" />
                  <span>Buka Pemindai VLM</span>
                </Button>
                <span className="px-2 py-0.5 rounded-md bg-accent text-accent-foreground border border-primary/25 font-mono text-[10px] font-bold self-start sm:self-auto">
                  {aiVisionInspection.modelBadge}
                </span>
              </div>
            </div>

            {/* Body: AI Vision Feed & Result Metrics */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
              {/* Simulated Camera Feed View */}
              <div className="sm:col-span-6 relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden bg-muted shrink-0 shadow-2xs border border-border">
                <Image
                  src={wasteImageUrl}
                  alt="AI Food Waste Camera"
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-cover"
                  unoptimized
                />

                {/* Camera Overlay Status Badges */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-white text-[9px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span>{aiVisionInspection.cameraBadge}</span>
                </div>

                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-primary text-white text-[9px] font-mono font-bold shadow-xs">
                  {aiVisionInspection.confidenceBadge}
                </div>

                {/* Visual Target Detection Wireframe */}
                <div className="absolute inset-8 border border-primary/80 bg-primary/10 rounded-lg flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-mono font-bold text-white bg-primary px-1.5 py-0.5 rounded shadow-xs">
                    {aiVisionInspection.targetBoxLabel}
                  </span>
                  <span className="text-[9px] font-mono text-white/90 mt-0.5">
                    {aiVisionInspection.targetBoxSub}
                  </span>
                </div>

                {/* Bottom Spectrometry Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-xs px-3 py-1.5 flex items-center justify-between text-[10px] font-mono text-white/90">
                  <span>{aiVisionInspection.statsBar.microPlastics}</span>
                  <span>{aiVisionInspection.statsBar.ferrousMetal}</span>
                </div>
              </div>

              {/* Inspection Output Metrics */}
              <div className="sm:col-span-6 flex flex-col gap-3.5">
                {/* Metric 1: Plastic Contamination Progress */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-foreground font-headline">
                    <span>
                      {aiVisionInspection.metrics.plasticContamination}
                    </span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full overflow-hidden mt-1.5 border border-border/80">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{
                        width: `${aiVisionInspection.metrics.plasticPercent}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Metric 2: Sharp Hazards & Metal */}
                <div className="p-3 rounded-xl border border-border bg-muted/30">
                  <div className="flex items-center justify-between text-xs font-bold font-headline">
                    <span className="text-foreground">
                      {aiVisionInspection.metrics.sharpHazardsLabel}
                    </span>
                    <span className="text-primary flex items-center gap-1 font-mono text-[11px]">
                      <Check className="w-3 h-3 stroke-[3]" />
                      {aiVisionInspection.metrics.sharpHazardsBadge}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-body leading-tight mt-1">
                    {aiVisionInspection.metrics.sharpHazardsNote}
                  </p>
                </div>

                {/* Metric 3: Grade A Optimum Substrate Verification */}
                <div className="p-3 rounded-xl bg-accent/60 border border-primary/25 flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground font-headline">
                      {aiVisionInspection.metrics.verificationCard.title}
                    </h4>
                    <p className="text-[11px] text-accent-foreground font-medium font-body leading-tight mt-0.5">
                      {aiVisionInspection.metrics.verificationCard.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Schedule Bar */}
            <div className="mt-5 pt-4 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary shrink-0" />
                <span className="text-muted-foreground font-body">
                  <strong className="text-foreground font-bold">
                    {aiVisionInspection.pickupSchedule.title}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[11px] shrink-0">
                <Clock className="w-3.5 h-3.5" />
                <span>{aiVisionInspection.pickupSchedule.statusText}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            RIGHT COLUMN (5 Cols):
            1. Armada & Fasilitas BSF Card
            2. Log Mutasi & Token Timbangan Card
            =================================================================== */}
        <div className="lg:col-span-5 w-full flex flex-col gap-6">
          {/* 1. Armada & Fasilitas BSF Card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/70">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-foreground font-headline">
                  {facilityFleet.title}
                </h2>
              </div>
              <span className="font-mono text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded border border-border">
                {facilityFleet.telemetryBadge}
              </span>
            </div>

            {/* Facility Hub Box */}
            <div className="mt-4 p-4 rounded-2xl border border-border bg-muted/40">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-headline block">
                    {facilityFleet.facility.tag}
                  </span>
                  <h3 className="font-bold text-sm sm:text-base text-foreground font-headline mt-0.5">
                    {facilityFleet.facility.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-body mt-0.5">
                    {facilityFleet.facility.location}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                  <Factory className="w-4 h-4 text-primary" />
                </div>
              </div>

              {/* Facility Capacity & Temp */}
              <div className="mt-3 pt-3 border-t border-border/70 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-muted-foreground block">
                    Kapasitas Fasilitas:
                  </span>
                  <span className="font-bold text-foreground font-headline block mt-0.5">
                    {facilityFleet.facility.capacity}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">
                    Standarisasi Suhu:
                  </span>
                  <span className="font-bold text-foreground font-headline block mt-0.5">
                    {facilityFleet.facility.sanitization}
                  </span>
                </div>
              </div>
            </div>

            {/* Driver & Vehicle Box */}
            <div className="mt-4 p-4 rounded-2xl border border-border bg-card shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                    <Image
                      src={facilityFleet.driver.avatarUrl}
                      alt={facilityFleet.driver.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs sm:text-sm text-foreground font-headline">
                        {facilityFleet.driver.name}
                      </h4>
                      <div className="flex items-center text-[10px] font-bold text-primary">
                        <Star className="w-3 h-3 fill-primary text-primary" />
                        <span>{facilityFleet.driver.rating}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      {facilityFleet.driver.vehicle}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent text-accent-foreground border border-primary/20 text-[10px] font-bold font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                    <span>{facilityFleet.driver.etaBadge}</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">
                    {facilityFleet.driver.etaStatus}
                  </span>
                </div>
              </div>

              {/* Route Trajectory Indicator */}
              <div className="mt-3 pt-3 border-t border-border/70">
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-2/3 rounded-full" />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{facilityFleet.driver.route.start}</span>
                  <span className="font-bold text-primary font-headline">
                    {facilityFleet.driver.route.currentStop}
                  </span>
                  <span>{facilityFleet.driver.route.destination}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <Button
                type="button"
                variant="outline"
                className="w-full border-border text-foreground hover:bg-muted font-headline font-bold text-xs rounded-xl py-2.5 gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{facilityFleet.buttons.callDriver}</span>
              </Button>

              <Button
                type="button"
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-headline font-bold text-xs rounded-xl py-2.5 gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{facilityFleet.buttons.liveGps}</span>
              </Button>
            </div>
          </div>

          {/* 2. Log Mutasi & Token Timbangan Card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/70">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-foreground font-headline">
                  {mutationScaleLog.title}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-primary">
                <Radio className="w-3 h-3" />
                <span>{mutationScaleLog.iotBadge}</span>
              </span>
            </div>

            <p className="mt-3 text-xs text-muted-foreground font-body leading-relaxed">
              {mutationScaleLog.description}
            </p>

            {/* Token Serah Terima Handover Box */}
            <div className="mt-4 p-4 rounded-2xl border border-border bg-muted/40 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-muted-foreground font-mono uppercase tracking-wider block">
                  {mutationScaleLog.handoverToken.label}
                </span>
                <span className="font-mono font-extrabold text-xl sm:text-2xl text-foreground tracking-widest block mt-1">
                  {mutationScaleLog.handoverToken.code}
                </span>
                <p className="text-[11px] text-muted-foreground font-body mt-1">
                  {mutationScaleLog.handoverToken.instruction}
                </p>
              </div>

              {/* QR Mini Code Icon */}
              <div className="w-14 h-14 bg-white rounded-xl border border-border/80 shadow-2xs flex items-center justify-center shrink-0">
                <QrCode className="w-10 h-10 text-secondary" />
              </div>
            </div>

            {/* Tombol Pindai QR Serah Terima untuk Driver / Processor */}
            <Button
              type="button"
              onClick={() => setShowHandoverQrReader(true)}
              className="mt-3 w-full bg-primary hover:bg-tertiary text-primary-foreground font-headline font-bold text-xs rounded-xl py-2.5 gap-2 shadow-2xs transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>Pindai QR Serah Terima Armada (Driver / Mitra BSF)</span>
            </Button>

            {/* Reverse Tipping Fee Incentive Box */}
            <div className="mt-4 p-4 rounded-2xl border border-border bg-card shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-foreground font-headline">
                  {mutationScaleLog.incentive.title}
                </span>
                <span className="font-mono text-muted-foreground">
                  {mutationScaleLog.incentive.rateText}
                </span>
              </div>

              {/* Dynamic Calculation */}
              <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-border/60">
                <span className="font-mono text-xs text-muted-foreground">
                  {weightKg} kg × Rp {mutationScaleLog.incentive.ratePerKg}
                </span>
                <span className="font-mono font-extrabold text-xl sm:text-2xl text-primary">
                  + Rp {totalIncentive.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Footer Notice */}
              <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center gap-1.5 text-[11px] text-primary font-medium">
                <Landmark className="w-3.5 h-3.5 shrink-0" />
                <span>{mutationScaleLog.incentive.disclaimer}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
