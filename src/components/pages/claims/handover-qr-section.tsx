"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Lock,
  Copy,
  Check,
  ShieldCheck,
  Info,
  Snowflake,
  AlertCircle,
  Package,
  Star,
  QrCode,
  Sprout,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const HANDOVER_QR_CONTENT = {
  qrCard: {
    title: "Token QR Handover Sekali Pakai",
    subtitle: "One-Time Cryptographic Handover Pass",
    encryptionBadge: "SHA-256",
    autoRefreshPrefix: "Pembaruan Kriptografi Otomatis dalam",
    initialTimerSeconds: 45,
    manualOtp: {
      label: "Kode Verifikasi Cadangan (OTP Manual)",
      code: "SP - 892 - 104",
      copyButtonText: "Salin",
      copiedButtonText: "Tersalin!",
      helperText:
        "Gunakan jika kamera pemindai pihak donatur mengalami gangguan fokus optik.",
    },
    securityNotice: {
      title: "Valid & Terenkripsi SHA-256",
      desc: "Dilengkapi perlindungan Anti-Screenshot Replay Attack. Hanya berlaku untuk 1x transaksi bilateral serah terima logistik.",
    },
    instructionNotice: {
      title: "Instruksi Serah Terima:",
      desc: "Tunjukkan kode QR ini ke penanggung jawab dapur di titik penjemputan. Donatur akan memindai untuk konfirmasi serah terima bilateral otomatis.",
    },
  },
  dishSummary: {
    badgeTop: "Spesifikasi Makanan Terselamatkan",
    title: "Ringkasan Hidangan yang Diklaim",
    portionBadge: "35 Porsi Standar",
    dishTitle: "Gourmet Bento Box Korporat",
    dishDescription:
      "Ayam Fillet Teriyaki Glazed, Nasi Pulen Beras Organik, Tamagoyaki Dashi, & Tumis Sayur Horenso Segar.",
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80",
    imageBadge: "Segel Primer Utuh",
    specs: [
      {
        icon: "snowflake",
        label: "Suhu Simpan:",
        value: "Cold Chain 4°C",
      },
      {
        icon: "halal",
        label: "Sertifikasi:",
        value: "Halal MUI Terverifikasi",
      },
      {
        icon: "allergen",
        label: "Bebas Alergen:",
        value: "No Seafood & Peanut",
      },
      {
        icon: "package",
        label: "Kemasan:",
        value: "Food-Grade Sealed",
      },
    ],
    provider: {
      label: "Penyedia:",
      name: "Donatur Anonim #084 (Katering Bintang 5)",
    },
  },
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function HandoverQrSection() {
  const { qrCard, dishSummary } = HANDOVER_QR_CONTENT;

  // Real-time OTP countdown timer
  const [secondsLeft, setSecondsLeft] = useState(qrCard.initialTimerSeconds);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : qrCard.initialTimerSeconds));
    }, 1000);
    return () => clearInterval(timer);
  }, [qrCard.initialTimerSeconds]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(qrCard.manualOtp.code.replace(/\s+/g, ""));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ===================================================================
            LEFT COLUMN: Token QR Handover Card (5 Cols)
            =================================================================== */}
        <div className="lg:col-span-5 w-full">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-5 border-b border-slate-100">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-headline">
                  {qrCard.title}
                </h2>
                <p className="text-xs text-slate-500 font-body mt-0.5">
                  {qrCard.subtitle}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold font-mono shrink-0">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>{qrCard.encryptionBadge}</span>
              </span>
            </div>

            {/* QR Code Container with High-Tech Corner Brackets */}
            <div className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 flex flex-col items-center justify-center">
              <div className="relative p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs">
                {/* 4 Corner Targeting Brackets */}
                <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-emerald-500 rounded-tl-sm" />
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-emerald-500 rounded-tr-sm" />
                <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-emerald-500 rounded-bl-sm" />
                <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-emerald-500 rounded-br-sm" />

                {/* SVG QR Code */}
                <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-slate-900"
                    fill="currentColor"
                  >
                    {/* Corner Position Detection Squares (Top-Left, Top-Right, Bottom-Left) */}
                    <rect x="5" y="5" width="26" height="26" rx="4" fill="#0B1B3D" />
                    <rect x="9" y="9" width="18" height="18" rx="2" fill="#FFFFFF" />
                    <rect x="13" y="13" width="10" height="10" rx="1" fill="#0B1B3D" />

                    <rect x="69" y="5" width="26" height="26" rx="4" fill="#0B1B3D" />
                    <rect x="73" y="9" width="18" height="18" rx="2" fill="#FFFFFF" />
                    <rect x="77" y="13" width="10" height="10" rx="1" fill="#0B1B3D" />

                    <rect x="5" y="69" width="26" height="26" rx="4" fill="#0B1B3D" />
                    <rect x="9" y="73" width="18" height="18" rx="2" fill="#FFFFFF" />
                    <rect x="13" y="77" width="10" height="10" rx="1" fill="#0B1B3D" />

                    {/* QR Code Matrix Data Blocks */}
                    <rect x="36" y="8" width="5" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="44" y="8" width="5" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="52" y="8" width="5" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="60" y="8" width="5" height="5" rx="1" fill="#0B1B3D" />

                    <rect x="36" y="16" width="5" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="48" y="16" width="9" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="60" y="16" width="5" height="5" rx="1" fill="#0B1B3D" />

                    <rect x="36" y="24" width="5" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="44" y="24" width="5" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="56" y="24" width="9" height="5" rx="1" fill="#0B1B3D" />

                    <rect x="8" y="36" width="5" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="16" y="36" width="9" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="72" y="36" width="9" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="84" y="36" width="9" height="5" rx="1" fill="#0B1B3D" />

                    <rect x="8" y="44" width="9" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="24" y="44" width="5" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="76" y="44" width="5" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="84" y="44" width="8" height="5" rx="1" fill="#0B1B3D" />

                    <rect x="8" y="52" width="5" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="18" y="52" width="7" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="72" y="52" width="5" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="80" y="52" width="12" height="5" rx="1" fill="#0B1B3D" />

                    <rect x="8" y="60" width="8" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="20" y="60" width="5" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="76" y="60" width="8" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="88" y="60" width="5" height="5" rx="1" fill="#0B1B3D" />

                    <rect x="36" y="72" width="5" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="44" y="72" width="9" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="56" y="72" width="5" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="64" y="72" width="9" height="5" rx="1" fill="#0B1B3D" />

                    <rect x="36" y="80" width="9" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="48" y="80" width="5" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="56" y="80" width="9" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="68" y="80" width="5" height="5" rx="1" fill="#0B1B3D" />

                    <rect x="36" y="88" width="5" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="44" y="88" width="5" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="52" y="88" width="9" height="5" rx="1" fill="#0B1B3D" />
                    <rect x="64" y="88" width="9" height="5" rx="1" fill="#0B1B3D" />
                  </svg>

                  {/* High-Tech Central Sprout/Shield Badge */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-white border-2 border-emerald-500 shadow-sm flex items-center justify-center">
                      <Sprout className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Automatic Cryptographic Refresh Countdown */}
              <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{qrCard.autoRefreshPrefix}</span>
                <span className="font-mono font-bold text-neutral-900">
                  {secondsLeft}s
                </span>
              </div>
            </div>

            {/* Manual OTP Fallback Code Box */}
            <div className="mt-5 p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-headline block">
                {qrCard.manualOtp.label}
              </span>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="font-mono font-extrabold text-xl sm:text-2xl text-neutral-900 tracking-widest">
                  {qrCard.manualOtp.code}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCode}
                  className="rounded-xl border-slate-200 text-xs font-semibold gap-1.5 px-3 py-1.5 text-neutral-800 hover:bg-slate-50 shadow-2xs"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{qrCard.manualOtp.copiedButtonText}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>{qrCard.manualOtp.copyButtonText}</span>
                    </>
                  )}
                </Button>
              </div>
              <p className="mt-2 text-[11px] text-slate-500 font-body leading-relaxed">
                {qrCard.manualOtp.helperText}
              </p>
            </div>

            {/* Security Notice: Valid & Terenkripsi SHA-256 */}
            <div className="mt-4 p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-neutral-900 font-headline">
                  {qrCard.securityNotice.title}
                </h4>
                <p className="text-[11px] text-slate-600 font-body leading-normal mt-0.5">
                  {qrCard.securityNotice.desc}
                </p>
              </div>
            </div>

            {/* Instruction Notice */}
            <div className="mt-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-neutral-900 font-headline">
                  {qrCard.instructionNotice.title}
                </h4>
                <p className="text-[11px] text-slate-600 font-body leading-normal mt-0.5">
                  {qrCard.instructionNotice.desc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================
            RIGHT COLUMN: Claimed Dish Summary Card (7 Cols)
            =================================================================== */}
        <div className="lg:col-span-7 w-full">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-5 border-b border-slate-100">
              <div>
                <span className="text-xs text-slate-500 font-medium font-body block">
                  {dishSummary.badgeTop}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-neutral-900 font-headline mt-0.5">
                  {dishSummary.title}
                </h2>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200/80 shrink-0 font-headline">
                {dishSummary.portionBadge}
              </span>
            </div>

            {/* Content Body: Image (Left) & Food Details (Right) */}
            <div className="mt-6 flex flex-col sm:flex-row items-start gap-5">
              {/* Food Image with Floating Primary Seal Badge */}
              <div className="relative w-full sm:w-56 h-48 sm:h-52 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-2xs">
                <Image
                  src={dishSummary.imageUrl}
                  alt={dishSummary.dishTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, 240px"
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-neutral-900/85 backdrop-blur-xs text-white text-[10px] font-mono font-bold tracking-wider shadow-xs border border-white/10">
                  {dishSummary.imageBadge}
                </div>
              </div>

              {/* Food Info & 2x2 Specs Grid */}
              <div className="flex-1 min-w-0">
                <h3 className="font-headline font-bold text-lg sm:text-xl text-neutral-900">
                  {dishSummary.dishTitle}
                </h3>
                <p className="text-xs text-slate-500 font-body leading-relaxed mt-1.5">
                  {dishSummary.dishDescription}
                </p>

                {/* 2x2 Specs Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {dishSummary.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70"
                    >
                      <div className="flex items-center gap-1.5">
                        {spec.icon === "snowflake" && (
                          <Snowflake className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                        {spec.icon === "halal" && (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                        {spec.icon === "allergen" && (
                          <AlertCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                        {spec.icon === "package" && (
                          <Package className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                        <span className="text-[10px] text-slate-400 font-medium">
                          {spec.label}
                        </span>
                      </div>
                      <span className="font-bold text-xs text-neutral-900 font-headline block mt-1">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Provider Footer Row */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">
                {dishSummary.provider.label}
              </span>
              <div className="flex items-center gap-1.5 font-bold text-neutral-900 font-headline">
                <Star className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 shrink-0" />
                <span>{dishSummary.provider.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
