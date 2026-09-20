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
  Sprout,
  Activity,
  CheckCircle2,
  MapPin,
  ExternalLink,
  MessageSquare,
  ClipboardCheck,
  CheckSquare,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const CLAIM_DETAILS_CONTENT = {
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
  auditLog: {
    title: "Log Audit Serah Terima",
    nodeId: "Node: ID-DPS-RN01",
    steps: [
      {
        id: "step-1",
        title: "Listing Dipublikasikan",
        timeOrStatus: "10:45 WITA",
        description:
          "Donatur Terverifikasi Anonim #084 meluncurkan surplus bento box layak konsumsi.",
        status: "completed",
      },
      {
        id: "step-2",
        title: "Jatah 35 Porsi Diklaim",
        timeOrStatus: "11:15 WITA",
        description:
          "Yayasan Sayap Ibu mengunci alokasi melalui kuota harian B2B (Status Lock Terkonfirmasi).",
        status: "completed",
      },
      {
        id: "step-3",
        title: "Menuju Lokasi Penjemputan",
        timeOrStatus: "Saat Ini",
        description:
          "Menunggu tim logistik tiba di Loading Dock Barat Renon. Radius 1.2 km tersisa.",
        status: "active",
      },
      {
        id: "step-4",
        title: "Scan QR Bilateral & Tanda Terima",
        timeOrStatus: "Pending",
        description:
          "Penyelesaian sertifikat serah terima digital dan update ledger emisi CO2e.",
        status: "pending",
      },
    ],
  },
  pickupGuide: {
    badgeTop: "Koordinat & Akses Fasilitas",
    title: "Panduan Titik Penjemputan (Pickup Protocol)",
    distanceBadge: "1.2 km dari Posko",
    map: {
      zoneName: "Kawasan Renon, Denpasar Selatan",
      gpsStatus: "LIVE GPS",
      destinationTitle: "Loading Dock Barat F&B Service",
      address: "Jl. Raya Puputan No. 88, Renon",
      googleMapsUrl: "https://maps.google.com/?q=Renon+Denpasar",
    },
    facilityAccess: {
      title: "Protokol Masuk Fasilitas:",
      description:
        "Gunakan Pintu Belakang Loading Dock Barat. Jangan melalui lobby utama tamu hotel/katering. Lapor ke Pos Sekuriti F&B dengan menunjukkan ID Klaim.",
    },
    contact: {
      label: "Narahubung Operasional:",
      name: "Koordinator Dapur (Pak Wayan)",
      whatsappUrl: "https://wa.me/6281234567890",
      whatsappLabel: "WhatsApp Enkripsi",
    },
    checklist: {
      title: "Checklist SOP Higienitas & Pengambilan (Mandatori ISO 22000):",
      items: [
        {
          id: "item-1",
          boldPrefix: "Membawa Coolbox Insulasi",
          suffix: " tertutup bersih",
        },
        {
          id: "item-2",
          boldPrefix: "Mengenakan Masker &",
          suffix: " Sanitasi tangan di lokasi",
        },
        {
          id: "item-3",
          boldPrefix: "Periksa Kondisi Segel",
          suffix: " sebelum scan QR serah terima",
        },
      ],
    },
  },
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export interface ClaimDetailsSectionProps {
  initialClaim?: any;
}

export function ClaimDetailsSection({ initialClaim }: ClaimDetailsSectionProps = {}) {
  const { qrCard, dishSummary, auditLog, pickupGuide } = CLAIM_DETAILS_CONTENT;

  const [activeClaim, setActiveClaim] = useState<{
    id: string;
    token: string;
    title: string;
    portions: number;
    isCollected: boolean;
    collectedAt?: string | null;
    imageUrl?: string | null;
    storageMethod?: string;
    dietaryTags?: string[];
    riskyIngredients?: string[];
    safeUntil?: string;
  } | null>(() => {
    if (!initialClaim) return null;
    return {
      id: initialClaim.id,
      token: initialClaim.qr_token,
      title: initialClaim.food_listings?.title || dishSummary.dishTitle,
      portions: initialClaim.portions_claimed || 1,
      isCollected: initialClaim.is_collected,
      collectedAt: initialClaim.collected_at,
      imageUrl: initialClaim.food_listings?.image_url,
      storageMethod: initialClaim.food_listings?.storage_method,
      dietaryTags: initialClaim.food_listings?.dietary_tags,
      riskyIngredients: initialClaim.food_listings?.risky_ingredients,
      safeUntil: initialClaim.food_listings?.safe_until,
    };
  });

  // Real-time OTP countdown timer
  const [secondsLeft, setSecondsLeft] = useState(qrCard.initialTimerSeconds);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    async function loadClaimData() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();

        let tokenToFind: string | null = null;
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          tokenToFind = params.get("token");
          if (!tokenToFind) {
            const saved = localStorage.getItem("siklus_active_claim");
            if (saved) {
              try {
                tokenToFind = JSON.parse(saved)?.qrToken;
              } catch {}
            }
          }
        }

        let query = supabase
          .from("food_claims")
          .select("id, qr_token, portions_claimed, is_collected, collected_at, listing_id, food_listings(title, image_url, safe_until)")
          .order("created_at", { ascending: false });

        if (tokenToFind) {
          query = query.eq("qr_token", tokenToFind);
        }

        const { data, error } = await query.limit(1).single();
        if (!error && data) {
          const foodTitle = (data.food_listings as any)?.title || dishSummary.dishTitle;
          setActiveClaim({
            id: data.id,
            token: data.qr_token,
            title: foodTitle,
            portions: data.portions_claimed || 1,
            isCollected: data.is_collected,
            collectedAt: data.collected_at,
          });

          if (typeof window !== "undefined") {
            localStorage.setItem(
              "siklus_active_claim",
              JSON.stringify({
                claimId: data.id,
                qrToken: data.qr_token,
                listingId: data.listing_id || "2a02ea19-32b6-43ac-b4d2-71c2eeead97b",
                foodTitle: foodTitle,
              })
            );
          }
        }
      } catch (err) {
        console.warn("Using default claim fixture:", err);
      }
    }
    loadClaimData();
  }, [dishSummary.dishTitle]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : qrCard.initialTimerSeconds));
    }, 1000);
    return () => clearInterval(timer);
  }, [qrCard.initialTimerSeconds]);

  const displayOtpCode = activeClaim?.token
    ? activeClaim.token.length >= 8
      ? `SP-${activeClaim.token.slice(0, 4).toUpperCase()}-${activeClaim.token.slice(4, 8).toUpperCase()}`
      : activeClaim.token
    : qrCard.manualOtp.code;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeClaim?.token || qrCard.manualOtp.code.replace(/\s+/g, ""));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const dynamicSpecs = [
    {
      icon: "snowflake",
      label: "Suhu Simpan:",
      value: activeClaim?.storageMethod === "refrigerated" ? "Cold Chain 4°C" : "Suhu Ruang Higienis",
    },
    {
      icon: "halal",
      label: "Sertifikasi:",
      value: (activeClaim?.dietaryTags || []).includes("halal") ? "Halal MUI Terverifikasi" : "Standar Pangan BPOM",
    },
    {
      icon: "allergen",
      label: "Bebas Alergen:",
      value:
        activeClaim?.riskyIngredients && activeClaim.riskyIngredients.length > 0
          ? `Alergen: ${activeClaim.riskyIngredients.join(", ")}`
          : "Bebas Kontaminan Alergen",
    },
    {
      icon: "package",
      label: "Kemasan:",
      value: "Food-Grade Sealed",
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ===================================================================
            LEFT COLUMN (5 Cols):
            1. Token QR Handover Card
            2. Log Audit Serah Terima Card
            =================================================================== */}
        <div className="lg:col-span-5 w-full flex flex-col gap-6">
          {/* 1. Token QR Handover Card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-5 border-b border-border/70">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground font-headline">
                  {qrCard.title}
                </h2>
                <p className="text-xs text-muted-foreground font-body mt-0.5">
                  {qrCard.subtitle}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent text-accent-foreground border border-primary/25 text-xs font-bold font-mono shrink-0">
                <Lock className="w-3 h-3 text-primary" />
                <span>{qrCard.encryptionBadge}</span>
              </span>
            </div>

            {/* QR Code Container with High-Tech Corner Brackets */}
            <div className="mt-5 rounded-2xl border border-border bg-muted/40 p-6 flex flex-col items-center justify-center">
              <div className="relative p-5 rounded-2xl border border-border bg-card shadow-2xs">
                {/* 4 Corner Targeting Brackets */}
                <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-sm" />
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-sm" />
                <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-sm" />
                <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-sm" />

                {/* SVG QR Code */}
                <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-secondary"
                    fill="currentColor"
                  >
                    {/* Corner Position Detection Squares */}
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

                  {/* High-Tech Central Sprout Badge */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-card border-2 border-primary shadow-xs flex items-center justify-center">
                      <Sprout className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Automatic Cryptographic Refresh Countdown */}
              <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>{qrCard.autoRefreshPrefix}</span>
                <span className="font-mono font-bold text-foreground">
                  {secondsLeft}s
                </span>
              </div>
            </div>

            {/* Status Penjemputan / Serah Terima Realtime */}
            {activeClaim?.isCollected ? (
              <div className="mt-4 p-3.5 rounded-xl border border-primary/30 bg-primary/10 flex items-center gap-2.5 text-primary text-xs font-bold font-headline animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span>Status: Pangan Telah Selesai Diserahterimakan & Tercatat di Ledger</span>
              </div>
            ) : (
              <div className="mt-4 p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center gap-2.5 text-amber-700 dark:text-amber-300 text-xs font-bold font-headline">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <span>Status: Siap Dijemput (Tunjukkan Token QR ke Donatur)</span>
              </div>
            )}

            {/* Manual OTP Fallback Code Box */}
            <div className="mt-5 p-4 rounded-2xl border border-border bg-card shadow-2xs">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-headline block">
                {qrCard.manualOtp.label}
              </span>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="font-mono font-extrabold text-lg sm:text-xl text-foreground tracking-wider select-all">
                  {displayOtpCode}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyCode}
                  className="rounded-xl border-border text-xs font-semibold gap-1.5 px-3 py-1.5 text-foreground hover:bg-muted shadow-2xs"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-primary" />
                      <span className="text-primary font-bold">{qrCard.manualOtp.copiedButtonText}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>{qrCard.manualOtp.copyButtonText}</span>
                    </>
                  )}
                </Button>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground font-body leading-relaxed">
                {qrCard.manualOtp.helperText}
              </p>
            </div>

            {/* Security Notice: Valid & Terenkripsi SHA-256 */}
            <div className="mt-4 p-3.5 rounded-xl border border-primary/20 bg-accent/60 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-foreground font-headline">
                  {qrCard.securityNotice.title}
                </h4>
                <p className="text-[11px] text-muted-foreground font-body leading-normal mt-0.5">
                  {qrCard.securityNotice.desc}
                </p>
              </div>
            </div>

            {/* Instruction Notice */}
            <div className="mt-3 p-3.5 rounded-xl border border-border bg-muted/50 flex items-start gap-3">
              <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-foreground font-headline">
                  {qrCard.instructionNotice.title}
                </h4>
                <p className="text-[11px] text-muted-foreground font-body leading-normal mt-0.5">
                  {qrCard.instructionNotice.desc}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Log Audit Serah Terima Card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
            {/* Header */}
            <div className="flex items-center justify-between pb-5 border-b border-border/70">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-accent text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-foreground font-headline">
                  {auditLog.title}
                </h2>
              </div>
              <span className="font-mono text-xs text-muted-foreground font-medium">
                {auditLog.nodeId}
              </span>
            </div>

            {/* Vertical Audit Timeline */}
            <div className="mt-6 relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-3 before:w-0.5 before:bg-border">
              {auditLog.steps.map((step) => {
                const isCompleted = step.status === "completed";
                const isActive = step.status === "active";
                const isPending = step.status === "pending";

                return (
                  <div key={step.id} className="relative">
                    {/* Timeline Node Indicator Icon */}
                    <div className="absolute -left-7 top-0.5 z-10 flex items-center justify-center">
                      {isCompleted && (
                        <div className="w-6 h-6 rounded-full bg-card flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-primary fill-accent" />
                        </div>
                      )}
                      {isActive && (
                        <div className="w-6 h-6 rounded-full bg-card flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full bg-accent border-2 border-primary flex items-center justify-center">
                            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                          </div>
                        </div>
                      )}
                      {isPending && (
                        <div className="w-6 h-6 rounded-full bg-card flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full border-2 border-border bg-card" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`text-xs sm:text-sm font-bold font-headline ${
                          isPending ? "text-muted-foreground/60" : "text-foreground"
                        }`}
                      >
                        {step.title}
                      </h3>

                      {isActive ? (
                        <span className="px-2 py-0.5 rounded-md bg-accent text-accent-foreground border border-primary/25 text-[10px] font-bold shrink-0">
                          {step.timeOrStatus}
                        </span>
                      ) : (
                        <span className="font-mono text-[11px] text-muted-foreground shrink-0">
                          {step.timeOrStatus}
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-xs font-body mt-1 leading-relaxed ${
                        isPending ? "text-muted-foreground/60" : "text-muted-foreground"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===================================================================
            RIGHT COLUMN (7 Cols):
            1. Claimed Dish Summary Card (Spesifikasi Makanan Terselamatkan)
            2. Panduan Titik Penjemputan (Koordinat & Akses Fasilitas)
            (Immediately follows Dish Summary with ZERO vertical empty space!)
            =================================================================== */}
        <div className="lg:col-span-7 w-full flex flex-col gap-6">
          {/* 1. Claimed Dish Summary Card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-5 border-b border-border/70">
              <div>
                <span className="text-xs text-muted-foreground font-medium font-body block">
                  {dishSummary.badgeTop}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-foreground font-headline mt-0.5">
                  {dishSummary.title}
                </h2>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-muted text-muted-foreground font-semibold text-xs border border-border shrink-0 font-headline">
                {activeClaim ? `${activeClaim.portions} Porsi Diklaim` : dishSummary.portionBadge}
              </span>
            </div>

            {/* Content Body: Image (Left) & Food Details (Right) */}
            <div className="mt-6 flex flex-col sm:flex-row items-start gap-5">
              {/* Food Image with Floating Primary Seal Badge */}
              <div className="relative w-full sm:w-56 h-48 sm:h-52 rounded-2xl overflow-hidden bg-muted shrink-0 shadow-2xs">
                <Image
                  src={activeClaim?.imageUrl || dishSummary.imageUrl}
                  alt={activeClaim?.title || dishSummary.dishTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, 240px"
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-secondary/90 backdrop-blur-xs text-secondary-foreground text-[10px] font-mono font-bold tracking-wider shadow-xs border border-white/10">
                  {dishSummary.imageBadge}
                </div>
              </div>

              {/* Food Info & 2x2 Specs Grid */}
              <div className="flex-1 min-w-0">
                <h3 className="font-headline font-bold text-lg sm:text-xl text-foreground">
                  {activeClaim?.title || dishSummary.dishTitle}
                </h3>
                <p className="text-xs text-muted-foreground font-body leading-relaxed mt-1.5">
                  {dishSummary.dishDescription}
                </p>

                {/* 2x2 Specs Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {dynamicSpecs.map((spec) => (
                    <div
                      key={spec.label}
                      className="p-2.5 rounded-xl border border-border/70 bg-muted/40"
                    >
                      <div className="flex items-center gap-1.5">
                        {spec.icon === "snowflake" && (
                          <Snowflake className="w-3.5 h-3.5 text-primary shrink-0" />
                        )}
                        {spec.icon === "halal" && (
                          <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                        )}
                        {spec.icon === "allergen" && (
                          <AlertCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                        )}
                        {spec.icon === "package" && (
                          <Package className="w-3.5 h-3.5 text-primary shrink-0" />
                        )}
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {spec.label}
                        </span>
                      </div>
                      <span className="font-bold text-xs text-foreground font-headline block mt-1">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Provider Footer Row */}
            <div className="mt-6 pt-4 border-t border-border/70 flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">
                {dishSummary.provider.label}
              </span>
              <div className="flex items-center gap-1.5 font-bold text-foreground font-headline">
                <Star className="w-3.5 h-3.5 text-primary fill-primary shrink-0" />
                <span>{dishSummary.provider.name}</span>
              </div>
            </div>
          </div>

          {/* 2. Panduan Titik Penjemputan Card (Directly Below Dish Summary) */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-5 border-b border-border/70">
              <div>
                <span className="text-xs text-muted-foreground font-medium font-body block">
                  {pickupGuide.badgeTop}
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-foreground font-headline mt-0.5">
                  {pickupGuide.title}
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-accent text-accent-foreground border border-primary/25 text-xs font-bold shrink-0 font-headline">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{pickupGuide.distanceBadge}</span>
              </span>
            </div>

            {/* Middle Row: Live GPS Map (Left) & Access Protocols / Contact (Right) */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              {/* Minimalist Live GPS Map Graphic Card */}
              <div className="relative rounded-2xl border border-border bg-muted/40 p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-2xs min-h-[190px]">
                {/* Subtle Grid Map Graphic Background */}
                <div
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(hsl(var(--primary)) 0.75px, transparent 0.75px), radial-gradient(hsl(var(--primary)) 0.75px, hsl(var(--muted)) 0.75px)",
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 10px 10px",
                  }}
                />

                {/* SVG Route Trajectory Graphic */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 200 150"
                  fill="none"
                >
                  <path
                    d="M 20 130 Q 80 110 130 60 T 170 30"
                    stroke="#00AA13"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                  />
                  <circle cx="20" cy="130" r="4" fill="#00AA13" />
                  <circle cx="170" cy="30" r="5" fill="#0B1B3D" />
                  <circle cx="170" cy="30" r="8" stroke="#00AA13" strokeWidth="2" opacity="0.6" />
                </svg>

                {/* Top Location Tag */}
                <div className="relative z-10 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-foreground bg-card/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-border shadow-2xs">
                    {pickupGuide.map.zoneName}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-primary text-primary-foreground shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    {pickupGuide.map.gpsStatus}
                  </span>
                </div>

                {/* Bottom Address Card with Open Map Button */}
                <div className="relative z-10 mt-12 p-3 rounded-xl bg-card border border-border shadow-xs flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-foreground font-headline truncate">
                      {pickupGuide.map.destinationTitle}
                    </h4>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                      {pickupGuide.map.address}
                    </p>
                  </div>
                  <a
                    href={pickupGuide.map.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-primary hover:bg-tertiary text-primary-foreground flex items-center justify-center shrink-0 transition-colors shadow-2xs"
                    title="Buka Peta"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Access Protocol & WhatsApp Contact Box */}
              <div className="flex flex-col justify-between gap-4">
                {/* Facility Protocol Notice Box */}
                <div className="p-4 rounded-2xl border border-border bg-muted/40 shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-primary shrink-0" />
                    <h4 className="font-bold text-xs text-foreground font-headline">
                      {pickupGuide.facilityAccess.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-body leading-relaxed mt-1.5">
                    {pickupGuide.facilityAccess.description}
                  </p>
                </div>

                {/* Narahubung & WhatsApp Enkripsi Button */}
                <div className="p-4 rounded-2xl border border-border bg-card shadow-2xs flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-muted-foreground font-medium block">
                      {pickupGuide.contact.label}
                    </span>
                    <span className="font-bold text-xs text-foreground font-headline block mt-0.5">
                      {pickupGuide.contact.name}
                    </span>
                  </div>

                  <a
                    href={pickupGuide.contact.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-tertiary text-primary-foreground text-xs font-bold transition-colors shadow-xs font-headline shrink-0"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{pickupGuide.contact.whatsappLabel}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Checklist: SOP Higienitas ISO 22000 */}
            <div className="mt-6 pt-5 border-t border-border/70">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground font-headline">
                <ClipboardCheck className="w-4 h-4 text-primary shrink-0" />
                <span>{pickupGuide.checklist.title}</span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {pickupGuide.checklist.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-border bg-muted/30 flex items-start gap-2 text-[11px] leading-relaxed shadow-2xs"
                  >
                    <CheckSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground font-bold">
                        {item.boldPrefix}
                      </strong>
                      {item.suffix}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
