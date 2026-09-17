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
  Clock,
  Scale,
  ShieldAlert,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { scanFoodPhotoAction } from "@/actions/scanner";
import type { FoodScanResult } from "@/lib/harness/ai-guard";

interface FoodVlmScannerProps {
  onScanComplete: (result: FoodScanResult, imageUrl: string) => void;
  onClose?: () => void;
}

export function FoodVlmScanner({
  onScanComplete,
  onClose,
}: FoodVlmScannerProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<FoodScanResult | null>(null);
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
    setScanResult(null);
    setErrorMessage(null);

    try {
      const response = await scanFoodPhotoAction({ imageBase64: base64String });
      if (response.success && response.data) {
        setScanResult(response.data);
        setIsOfflineFallback(!!response.isFallback);
      } else {
        setErrorMessage(response.error || "Gagal menganalisis foto makanan.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Terjadi kesalahan saat memproses gambar.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleApply = () => {
    if (scanResult && imagePreview) {
      onScanComplete(scanResult, imagePreview);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-headline font-bold text-base sm:text-lg text-foreground">
                Pemindai Visual Gemini VLM
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent text-accent-foreground border border-primary/20 font-bold">
                Multimodal AI
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              Identifikasi otomatis menu, porsi, bahan rentan basi & rekomendasi simpan
            </p>
          </div>
        </div>

        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Tutup pemindai foto makanan"
            className="rounded-full w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Upload Box / Image Preview Area */}
      <div className="mt-5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
          id="food-camera-upload"
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
                Ambil Foto Kamera atau Unggah Berkas
              </p>
              <p className="text-xs text-muted-foreground font-body mt-1">
                Mendukung format JPG, PNG, WEBP (Maks. 10MB)
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-1 rounded-xl text-xs font-bold border-border"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Pilih Foto Makanan
            </Button>
          </div>
        ) : (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border bg-black/90">
            <Image
              src={imagePreview}
              alt="Foto Makanan Donasi"
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
              unoptimized
            />

            {/* Scanning Overlay Effect */}
            {isScanning && (
              <div role="status" className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 text-white p-4">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                <div className="text-center bg-black/70 px-4 py-2 rounded-xl backdrop-blur border border-white/10">
                  <p className="text-xs font-headline font-bold text-white">
                    Menganalisis Visual dengan Gemini AI...
                  </p>
                  <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    Memeriksa integritas organoleptik & alergen
                  </p>
                </div>
              </div>
            )}

            {/* Tombol Ambil Ulang di Atas Foto */}
            {!isScanning && (
              <div className="absolute top-3 right-3 flex items-center gap-2">
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

      {/* Error Notice */}
      {errorMessage && (
        <div role="alert" className="mt-4 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Scan Results Card */}
      {scanResult && (
        <div className="mt-5 space-y-4">
          {isOfflineFallback && (
            <div role="status" className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-[11px] flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>
                <strong>Mode Simulasi/Offline:</strong> Analisis menggunakan fixture deterministik standar BPOM.
              </span>
            </div>
          )}

          <div role="status" className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-headline block">
                  Nama Menu Terdeteksi:
                </span>
                <h4 className="text-sm sm:text-base font-bold text-foreground font-headline mt-0.5">
                  {scanResult.detectedMenu}
                </h4>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border shrink-0">
                <Scale className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold font-headline text-foreground">
                  ~{scanResult.estimatedPortions} Porsi
                </span>
              </div>
            </div>

            {/* Risky Ingredients Warning */}
            {scanResult.riskyIngredients.length > 0 && (
              <div className="pt-2 border-t border-border/70">
                <div className="flex items-center gap-1.5 text-xs text-destructive font-bold font-headline mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Bahan Pangan Rentan Basi (Strict Rule Trigger):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {scanResult.riskyIngredients.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-destructive/10 text-destructive text-[11px] font-medium border border-destructive/20"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dietary Tags & Recommendations */}
            <div className="pt-2 border-t border-border/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>Rekomendasi Simpan AI:</span>
                <strong className="text-foreground">{scanResult.suggestedStorageHours} Jam</strong>
              </div>
              <div className="flex gap-1">
                {scanResult.dietaryClassification.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button: Apply to Form */}
          <Button
            type="button"
            onClick={handleApply}
            className="w-full bg-primary hover:bg-tertiary text-primary-foreground font-headline font-bold text-xs sm:text-sm rounded-xl py-3 shadow-md gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Terapkan ke Formulir Donasi (Human-in-the-Loop)</span>
          </Button>
        </div>
      )}
    </div>
  );
}
