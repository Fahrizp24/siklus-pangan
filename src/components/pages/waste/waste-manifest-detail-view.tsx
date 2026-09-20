"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Printer,
  Building2,
  MapPin,
  Phone,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  Recycle,
  Scale,
  Sparkles,
  QrCode,
  Lock,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProcessorWasteItem, claimWasteBatchByProcessor } from "@/actions/waste";

interface WasteManifestDetailViewProps {
  batch: ProcessorWasteItem;
}

export function WasteManifestDetailView({ batch: initialBatch }: WasteManifestDetailViewProps) {
  const [batch, setBatch] = useState<ProcessorWasteItem>(initialBatch);
  const [copied, setCopied] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(batch.batchNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCollectNow = async () => {
    setIsConfirming(true);
    try {
      const res = await claimWasteBatchByProcessor(batch.id);
      if (res.success) {
        setBatch((prev) => ({
          ...prev,
          isCollected: true,
          collectedAt: new Date().toISOString(),
        }));
        setStatusMessage("Penjemputan berhasil dikonfirmasi! Surat jalan telah berstatus Selesai Diangkut.");
      } else {
        alert(res.error || "Gagal mengonfirmasi penjemputan.");
      }
    } catch (err: any) {
      alert(err?.message || "Gagal mengonfirmasi penjemputan.");
    } finally {
      setIsConfirming(false);
    }
  };

  const co2eSaved = (batch.weightKg * 1.8).toFixed(1);

  return (
    <div className="w-full space-y-6">
      {/* Top Action Bar (Print-friendly controls) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl border-border text-foreground hover:bg-muted text-xs font-headline font-semibold gap-1.5 w-fit"
        >
          <Link href="/waste">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Bursa Pasokan</span>
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="rounded-xl border-border text-foreground hover:bg-muted text-xs font-headline font-semibold gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Surat Jalan</span>
          </Button>

          {!batch.isCollected && (
            <Button
              type="button"
              size="sm"
              disabled={isConfirming}
              onClick={handleCollectNow}
              className="bg-primary hover:bg-primary/90 text-white text-xs font-headline font-bold rounded-xl gap-1.5 shadow-xs"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{isConfirming ? "Memproses..." : "Konfirmasi Muat Sekarang"}</span>
            </Button>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Manifest Card (Official Document Style) */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        {/* Document Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary font-mono font-extrabold text-xs">
                {batch.batchNumber}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold font-mono ${
                  batch.isCollected
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    batch.isCollected ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                  }`}
                />
                <span>{batch.isCollected ? "SUDAH DIANGKUT (SELESAI)" : "SIAP JEMPUT (DISPOSISI ARMADA)"}</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground font-headline tracking-tight mt-2">
              Surat Jalan & Manifest Residu Organik
            </h1>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              Dokumen resmi rantai pasok sirkular biokonversi PT Siklus Pangan Bali & jejaring mitra pengolah.
            </p>
          </div>

          <div className="text-left md:text-right text-xs text-muted-foreground font-mono space-y-1">
            <p>Tanggal Registrasi: <span className="font-bold text-foreground">{batch.formattedDate}</span></p>
            {batch.collectedAt && (
              <p>
                Waktu Angkut:{" "}
                <span className="font-bold text-emerald-600">
                  {new Date(batch.collectedAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  WITA
                </span>
              </p>
            )}
          </div>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Substrate & Donor Logistics (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Substrate Details Card */}
            <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold font-headline text-foreground flex items-center gap-2">
                  <Recycle className="w-4 h-4 text-primary" />
                  <span>Spesifikasi Substrat Organik</span>
                </h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-mono">
                  {batch.purity.grade} ({batch.purity.percent}%)
                </span>
              </div>

              {/* Substrate Image + Summary */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-40 h-32 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                  <Image
                    src={batch.imageUrl}
                    alt={batch.categoryLabel}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="space-y-1.5 flex-1 text-xs">
                  <p className="font-bold text-foreground text-sm font-headline">
                    {batch.categoryLabel}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Residu pangan terpilah bebas kontaminan anorganik. Telah melalui inspeksi visual AI Vision untuk keamanan konsumsi biokonversi larva BSF.
                  </p>
                  <div className="pt-1 flex items-center gap-2 text-emerald-600 font-semibold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Lolos Standar Baku Mutu Biokonversi</span>
                  </div>
                </div>
              </div>

              {/* 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                <div className="p-3 rounded-xl bg-card border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase font-headline font-bold block">
                    Berat Timbang
                  </span>
                  <span className="font-mono text-lg font-extrabold text-foreground block mt-0.5">
                    {batch.weightKg} kg
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase font-headline font-bold block">
                    Tarif Tebus / kg
                  </span>
                  <span className="font-mono text-lg font-bold text-foreground block mt-0.5">
                    Rp {batch.ratePerKg}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border">
                  <span className="text-[10px] text-muted-foreground uppercase font-headline font-bold block">
                    Total Reimbursement
                  </span>
                  <span className="font-mono text-lg font-extrabold text-primary block mt-0.5">
                    Rp {batch.totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            {/* Donor & Loading Dock Location Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <h3 className="text-sm font-bold font-headline text-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  <span>Titik Muat & Kontak Donatur</span>
                </h3>
                <span className="text-[11px] text-muted-foreground font-mono">
                  Loading Dock Area
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Instansi / Usaha Donatur
                  </span>
                  <p className="font-headline font-bold text-foreground text-sm mt-0.5">
                    {batch.donorName}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Alamat Penjemputan
                  </span>
                  <p className="text-foreground mt-0.5 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{batch.donorAddress}</span>
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-xl border-border text-foreground hover:bg-muted text-xs font-semibold gap-1.5"
                  >
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${batch.donorName}, ${batch.donorAddress}`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>Buka Google Maps</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </a>
                  </Button>

                  <Button
                    asChild
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold gap-1.5"
                  >
                    <a
                      href={`https://wa.me/62${batch.donorPhone.replace(/^0/, "")}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp PIC ({batch.donorPhone})</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Handover Pass & QR Token (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Handover Pass QR Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col items-center text-center space-y-4">
              <div className="w-full flex items-center justify-between pb-3 border-b border-border/70 text-left">
                <div>
                  <h3 className="text-sm font-bold font-headline text-foreground">
                    Pass Serah Terima Digital
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Tunjukkan ke staf loading dock donatur
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  <Lock className="w-3 h-3" />
                  <span>SHA-256</span>
                </span>
              </div>

              {/* QR Box with targeting brackets */}
              <div className="relative p-6 rounded-2xl border border-border bg-muted/40 my-2">
                <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-sm" />
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-sm" />
                <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-sm" />
                <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-sm" />

                {/* SVG QR Code Simulation */}
                <div className="p-3 bg-white rounded-xl shadow-xs">
                  <svg className="w-40 h-40 text-neutral-900" viewBox="0 0 100 100" fill="currentColor">
                    <rect x="0" y="0" width="30" height="30" rx="3" />
                    <rect x="5" y="5" width="20" height="20" fill="white" rx="2" />
                    <rect x="10" y="10" width="10" height="10" />

                    <rect x="70" y="0" width="30" height="30" rx="3" />
                    <rect x="75" y="5" width="20" height="20" fill="white" rx="2" />
                    <rect x="80" y="10" width="10" height="10" />

                    <rect x="0" y="70" width="30" height="30" rx="3" />
                    <rect x="5" y="75" width="20" height="20" fill="white" rx="2" />
                    <rect x="10" y="80" width="10" height="10" />

                    <rect x="36" y="6" width="6" height="6" />
                    <rect x="46" y="6" width="8" height="6" />
                    <rect x="58" y="6" width="6" height="6" />
                    <rect x="36" y="18" width="8" height="8" />
                    <rect x="48" y="18" width="6" height="6" />
                    <rect x="36" y="34" width="28" height="6" />
                    <rect x="6" y="36" width="6" height="12" />
                    <rect x="18" y="36" width="12" height="6" />
                    <rect x="46" y="44" width="8" height="14" />
                    <rect x="70" y="36" width="6" height="20" />
                    <rect x="82" y="36" width="12" height="6" />
                    <rect x="70" y="62" width="10" height="6" />
                    <rect x="86" y="48" width="8" height="18" />
                    <rect x="36" y="70" width="10" height="6" />
                    <rect x="52" y="70" width="6" height="12" />
                    <rect x="36" y="82" width="10" height="12" />
                    <rect x="52" y="88" width="14" height="6" />
                    <rect x="70" y="76" width="8" height="18" />
                    <rect x="84" y="84" width="10" height="10" />
                  </svg>
                </div>
              </div>

              {/* Token Code & Copy */}
              <div className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Kode Batch Handover
                  </span>
                  <span className="font-mono font-extrabold text-sm text-foreground">
                    {batch.batchNumber}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyToken}
                  className="rounded-lg text-xs font-semibold h-8 px-2.5 gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Environmental Impact Benefit */}
              <div className="w-full p-4 rounded-xl bg-primary/5 border border-primary/20 text-left space-y-1.5">
                <div className="flex items-center gap-1.5 text-primary text-xs font-bold font-headline">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Dampak Sirkular Batch Ini</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Pengalihan <strong className="text-foreground font-mono">{batch.weightKg} kg</strong> residu organik dari TPA Suwung ini mencegah terbentuknya{" "}
                  <strong className="text-primary font-mono">{co2eSaved} kg CO₂e</strong> emisi metana atmosferik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
