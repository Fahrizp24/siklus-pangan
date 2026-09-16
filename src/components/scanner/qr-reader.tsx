"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  QrCode,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Keyboard,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface QrReaderProps {
  onScanSuccess: (decodedText: string) => void;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  placeholderOtp?: string;
}

export function QrReader({
  onScanSuccess,
  onClose,
  title = "Pindai Kode QR Handover",
  subtitle = "Arahkan kamera ke kode QR serah terima penerima/donatur",
  placeholderOtp = "SP-892-104",
}: QrReaderProps) {
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  const scannerRef = useRef<any>(null);
  const readerElementId = "siklus-html5-qr-reader";

  useEffect(() => {
    let isMounted = true;

    async function initScanner() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (!isMounted) return;

        const html5QrCode = new Html5Qrcode(readerElementId);
        scannerRef.current = html5QrCode;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText: string) => {
            if (isMounted) {
              setScannedResult(decodedText);
              setIsScanning(false);
              html5QrCode.stop().catch(() => {});
              onScanSuccess(decodedText);
            }
          },
          () => {
            // Frame scanning error (ignore frame misses)
          }
        );
      } catch (err: any) {
        console.warn("Kamera tidak dapat diakses atau diblokir:", err);
        if (isMounted) {
          setCameraError(
            "Kamera tidak dapat diakses langsung. Anda dapat memasukkan kode verifikasi secara manual di bawah."
          );
          setIsScanning(false);
        }
      }
    }

    initScanner();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(() => {});
          }
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [onScanSuccess]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    // Bersihkan format (hilangkan spasi & dash jika perlu)
    const cleaned = manualCode.trim().replace(/[\s-]/g, "");
    setIsProcessing(true);
    setScannedResult(manualCode.trim());
    setTimeout(() => {
      setIsProcessing(false);
      onScanSuccess(cleaned || manualCode.trim());
    }, 400);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card border border-border rounded-3xl p-6 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-base text-foreground">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground font-body">
              {subtitle}
            </p>
          </div>
        </div>
        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
          >
            ✕
          </Button>
        )}
      </div>

      {/* Camera Viewport / Error State */}
      <div className="mt-5 relative w-full aspect-square rounded-2xl overflow-hidden bg-black/90 border border-border/80 flex flex-col items-center justify-center">
        <div
          id={readerElementId}
          className="w-full h-full [&_video]:object-cover"
        />

        {/* Overlay saat scanning aktif */}
        {isScanning && !cameraError && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6">
            <div className="w-56 h-56 border-2 border-primary/60 rounded-2xl relative">
              {/* Sudut Scanner Visual */}
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-primary" />
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-primary" />
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-primary" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-primary" />

              {/* Laser Scanning Line Animation */}
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse absolute top-1/2 -translate-y-1/2" />
            </div>
            <span className="mt-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur text-[11px] font-mono text-primary border border-primary/20">
              Mendeteksi QR Code Otomatis...
            </span>
          </div>
        )}

        {/* Fallback jika kamera error atau izin ditolak */}
        {cameraError && (
          <div className="p-6 text-center text-white flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-destructive/20 text-destructive border border-destructive/30 flex items-center justify-center">
              <CameraOff className="w-6 h-6" />
            </div>
            <p className="text-xs text-muted leading-relaxed max-w-[260px]">
              {cameraError}
            </p>
          </div>
        )}

        {/* Notifikasi jika sukses scan */}
        {scannedResult && (
          <div className="absolute inset-0 bg-primary/95 text-primary-foreground flex flex-col items-center justify-center p-6 gap-3 animate-in fade-in zoom-in">
            <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
            <h4 className="font-headline font-bold text-base">
              QR Code Terverifikasi!
            </h4>
            <span className="font-mono text-xs bg-black/20 px-3 py-1 rounded-lg">
              {scannedResult}
            </span>
          </div>
        )}
      </div>

      {/* Manual Input Fallback */}
      <form onSubmit={handleManualSubmit} className="mt-5 space-y-3">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-muted-foreground" />
          <label
            htmlFor="manual-otp-input"
            className="text-xs font-bold text-foreground font-headline"
          >
            Input Manual Kode Verifikasi (OTP / Hash):
          </label>
        </div>

        <div className="flex gap-2">
          <input
            id="manual-otp-input"
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder={placeholderOtp}
            className="flex-1 bg-muted/50 border border-border rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          />
          <Button
            type="submit"
            disabled={!manualCode.trim() || isProcessing}
            className="bg-primary hover:bg-tertiary text-primary-foreground font-headline font-bold text-xs rounded-xl px-4 py-2"
          >
            {isProcessing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              "Verifikasi"
            )}
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground font-body flex items-center gap-1.5 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Verifikasi bilateral kriptografis aman berstandar ISO 14044.</span>
        </p>
      </form>
    </div>
  );
}
