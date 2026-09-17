"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Camera,
  Upload,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Recycle,
  Check,
  ShieldCheck,
  ShieldAlert,
  Bug,
  Fish,
  Sprout,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { scanWasteInspectionAction } from "@/actions/scanner";
import type { WasteInspectionResult } from "@/lib/harness/ai-guard";

interface WasteVlmScannerProps {
  onInspectionComplete: (
    result: WasteInspectionResult,
    imageUrl: string
  ) => void;
  onClose?: () => void;
}

const PROCESSOR_LABELS = {
  bsf_maggot: {
    title: "Budidaya Maggot BSF",
    desc: "Optimal untuk pakan larva berprotein & berlemak tinggi",
    icon: Bug,
  },
  poultry_fish: {
    title: "Peternak Unggas & Ikan",
    desc: "Optimal untuk sisa nasi, karbohidrat, dan ampas olahan",
    icon: Fish,
  },
  compost_biogas: {
    title: "Kompos & Biodigester",
    desc: "Optimal untuk sayur, buah berserat, dan ampas organik",
    icon: Sprout,
  },
};

export function WasteVlmScanner({
  onInspectionComplete,
  onClose,
}: WasteVlmScannerProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [inspectionResult, setInspectionResult] =
    useState<WasteInspectionResult | null>(null);
  const [isOfflineFallback, setIsOfflineFallback] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const resizeImageFile = (file: File, maxDim = 1024, quality = 0.82): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimizedBase64 = await resizeImageFile(file);
      if (!optimizedBase64) return;
      setImagePreview(optimizedBase64);
      setErrorMessage(null);
      await triggerScan(optimizedBase64);
    } catch {
      setErrorMessage("Gagal membaca file gambar.");
    }
  };

  const triggerScan = async (base64String: string) => {
    setIsScanning(true);
    setInspectionResult(null);
    setErrorMessage(null);

    try {
      const response = await scanWasteInspectionAction({
        imageBase64: base64String,
      });
      if (response.success && response.data) {
        setInspectionResult(response.data);
        setIsOfflineFallback(!!response.isFallback);
      } else {
        setErrorMessage(
          response.error || "Gagal melakukan inspeksi visual limbah."
        );
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Terjadi kesalahan saat memproses gambar limbah."
      );
    } finally {
      setIsScanning(false);
    }
  };

  const handleApply = () => {
    if (inspectionResult && imagePreview) {
      onInspectionComplete(inspectionResult, imagePreview);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
            <Recycle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-headline font-bold text-base sm:text-lg text-foreground">
                Inspeksi Kemurnian Limbah VLM
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent text-accent-foreground border border-primary/20 font-bold">
                BioRefine AI
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              Deteksi kontaminan anorganik & alokasi biokonversi presisi
            </p>
          </div>
        </div>

        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Tutup pemindai limbah"
            className="rounded-full w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Upload Box / Image Area */}
      <div className="mt-5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
          id="waste-camera-upload"
        />

        {!imagePreview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-video rounded-2xl border-2 border-dashed border-border hover:border-primary/60 bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 p-6 text-center group"
          >
            <div className="w-14 h-14 rounded-2xl bg-card border border-border group-hover:scale-105 group-hover:border-primary/30 transition-all flex items-center justify-center text-primary shadow-xs">
              <Camera className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-headline font-bold text-foreground">
                Ambil Foto Wadah / Tong Limbah Organik
              </p>
              <p className="text-xs text-muted-foreground font-body mt-1">
                AI memeriksa kontaminasi plastik, kawat, & styrofoam
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-1 rounded-xl text-xs font-bold border-border"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Pilih Foto Limbah
            </Button>
          </div>
        ) : (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border bg-black/90">
            <Image
              src={imagePreview}
              alt="Foto Limbah Organik"
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
              unoptimized
            />

            {isScanning && (
              <div role="status" className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 text-white p-4">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                <div className="text-center bg-black/70 px-4 py-2 rounded-xl backdrop-blur border border-white/10">
                  <p className="text-xs font-headline font-bold text-white">
                    Memindai Spektrometri & Kontaminan Visual...
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    Validasi kemurnian substrat biokonversi
                  </p>
                </div>
              </div>
            )}

            {!isScanning && (
              <div className="absolute top-3 right-3">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl text-xs font-bold shadow-md bg-card/90 backdrop-blur text-foreground hover:bg-card"
                >
                  <Camera className="w-3.5 h-3.5 mr-1.5" />
                  Foto Ulang
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div role="alert" className="mt-4 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Results Box */}
      {inspectionResult && (
        <div className="mt-5 space-y-4">
          {isOfflineFallback && (
            <div role="status" className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-[11px] flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>Mode Simulasi/Offline:</strong> Verifikasi kemurnian menggunakan fixture deterministik.
              </span>
            </div>
          )}

          <div role="status" className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-3">
            {/* Purity Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {inspectionResult.isOrganicPure ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold font-headline">
                    <ShieldCheck className="w-4 h-4" />
                    Murni Organik (Lolos Standar Pakan)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/20 text-xs font-bold font-headline">
                    <AlertTriangle className="w-4 h-4" />
                    Terdeteksi Kontaminan Anorganik
                  </span>
                )}
              </div>
            </div>

            {/* Contaminants if any */}
            {inspectionResult.detectedContaminants.length > 0 && (
              <div className="pt-2 border-t border-border/70">
                <span className="text-[11px] font-bold text-destructive block mb-1">
                  Kontaminan yang Ditemukan:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {inspectionResult.detectedContaminants.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-destructive/10 text-destructive text-[10px] font-medium border border-destructive/20"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Processor */}
            <div className="pt-2 border-t border-border/70">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-headline block">
                Rekomendasi Rute Biokonversi Optimal:
              </span>
              <div className="mt-1.5 p-3 rounded-xl bg-card border border-border flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {React.createElement(
                    PROCESSOR_LABELS[inspectionResult.optimalProcessor].icon,
                    { className: "w-5 h-5" }
                  )}
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-foreground font-headline">
                    {PROCESSOR_LABELS[inspectionResult.optimalProcessor].title}
                  </h5>
                  <p className="text-[11px] text-muted-foreground font-body">
                    {PROCESSOR_LABELS[inspectionResult.optimalProcessor].desc}
                  </p>
                </div>
              </div>
            </div>

            {/* Nutrient Notes */}
            <p className="text-[11px] text-muted-foreground italic font-body pt-1">
              &ldquo;{inspectionResult.nutrientNotes}&rdquo;
            </p>
          </div>

          {/* Apply Button */}
          <Button
            type="button"
            onClick={handleApply}
            className="w-full bg-primary hover:bg-tertiary text-primary-foreground font-headline font-bold text-xs sm:text-sm rounded-xl py-3 shadow-md gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Terapkan Hasil Inspeksi ke Manifest Limbah</span>
          </Button>
        </div>
      )}
    </div>
  );
}
