"use client";

import React, { useRef, useState } from "react";
import { AlertCircle, ArrowUpToLine, CheckCircle2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QrReader } from "@/components/scanner/qr-reader";
import { collectFoodClaim } from "@/actions/transactions";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const DONATE_ACTIONS_CONTENT = {
  saveDraftButtonText: "Simpan Draf Batch",
  verifyClaimButtonText: "Pindai QR Penerima (Serah Terima)",
  publishButtonText: "Terbitkan ke Live Radar (/rescue)",
  publishSuccessText: "Listing Berhasil Diterbitkan!",
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

interface DonateActionsSectionProps {
  onSaveDraft?: () => void;
  onPublish?: () => void;
}

export function DonateActionsSection({
  onSaveDraft,
  onPublish,
}: DonateActionsSectionProps) {
  const {
    saveDraftButtonText,
    verifyClaimButtonText,
    publishButtonText,
    publishSuccessText,
  } = DONATE_ACTIONS_CONTENT;

  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDonorQrScanner, setShowDonorQrScanner] = useState(false);
  const [handoverBanner, setHandoverBanner] = useState<{ success: boolean; message: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const handoverLockRef = useRef(false);

  const handleScanClaimSuccess = async (token: string) => {
    if (handoverLockRef.current) {
      return { success: false, error: "Verifikasi sedang diproses. Tunggu konfirmasi sebelum mencoba lagi." };
    }
    handoverLockRef.current = true;
    setIsVerifying(true);
    setHandoverBanner(null);
    try {
      const res = await collectFoodClaim({ token });
      if (res.success) {
        setHandoverBanner({ success: true, message: "Serah terima makanan terkonfirmasi!" });
        setShowDonorQrScanner(false);
      } else {
        setHandoverBanner({ success: false, message: res.error || "Verifikasi serah terima gagal. Silakan coba lagi." });
      }
      return res;
    } catch {
      const error = "Verifikasi serah terima gagal. Silakan coba lagi.";
      setHandoverBanner({ success: false, message: error });
      return { success: false, error };
    } finally {
      handoverLockRef.current = false;
      setIsVerifying(false);
    }
  };

  const handleHandoverDialogChange = (open: boolean) => {
    if (handoverLockRef.current) return;
    setShowDonorQrScanner(open);
  };

  const handlePublishClick = () => {
    if (onPublish) {
      onPublish();
      return;
    }

    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = "/rescue";
      }, 1200);
    }, 800);
  };

  return (
    <Dialog open={showDonorQrScanner} onOpenChange={handleHandoverDialogChange}>
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* Modal QR Reader untuk Donatur memindai token penerima */}
      {showDonorQrScanner && (
        <DialogContent className="w-[calc(100%-2rem)] max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-3xl p-0 pt-10 gap-0">
          <DialogTitle className="sr-only">Pindai QR Penerima Manfaat</DialogTitle>
          <DialogDescription className="sr-only">
            Posisikan kamera ke kode QR klaim pada ponsel penerima untuk konfirmasi serah terima
          </DialogDescription>
          <QrReader
            title="Pindai QR Penerima Manfaat"
            subtitle="Posisikan kamera ke kode QR klaim pada ponsel penerima untuk konfirmasi serah terima"
            placeholderOtp="892104"
            onScanSuccess={handleScanClaimSuccess}
          />
        </DialogContent>
      )}

      {handoverBanner && (
        <div
          role={handoverBanner.success ? "status" : "alert"}
          className={`mb-4 p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-between gap-3 animate-in fade-in ${handoverBanner.success ? "bg-primary/10 border-primary/25 text-primary" : "bg-destructive/10 border-destructive/25 text-destructive"}`}
        >
          <div className="flex items-center gap-2">
            {handoverBanner.success ? <CheckCircle2 className="w-5 h-5" aria-hidden="true" /> : <AlertCircle className="w-5 h-5" aria-hidden="true" />}
            <span>{handoverBanner.message}</span>
          </div>
          {!handoverBanner.success && (
            <Button
              type="button"
              variant="destructive"
              disabled={isVerifying}
              aria-busy={isVerifying}
              onClick={() => {
                if (handoverLockRef.current) return;
                setHandoverBanner(null);
                setShowDonorQrScanner(true);
              }}
            >
              Coba lagi
            </Button>
          )}
          <button
            type="button"
            onClick={() => setHandoverBanner(null)}
            className="text-xs font-mono hover:underline"
          >
            Tutup
          </button>
        </div>
      )}

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Left Side: Secondary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 1. Simpan Draf Batch */}
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            className="border-border text-foreground hover:bg-muted font-headline font-bold text-xs sm:text-sm rounded-xl px-5 py-3 shadow-2xs transition-colors"
          >
            {saveDraftButtonText}
          </Button>

          {/* 2. Pindai QR Penerima Manfaat (Serah Terima Dapur Donatur) */}
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isVerifying}
              aria-busy={isVerifying}
              className="border-primary/40 text-primary hover:bg-primary/10 font-headline font-bold text-xs sm:text-sm rounded-xl px-4 py-3 shadow-2xs gap-2 transition-colors"
            >
              <QrCode className="w-4 h-4" />
              <span>{verifyClaimButtonText}</span>
            </Button>
          </DialogTrigger>
        </div>



        {/* Right Side: Primary Publish Button */}
        <Button
          type="button"
          onClick={handlePublishClick}
          disabled={isPublishing || isSuccess}
          aria-busy={isPublishing}
          className="bg-primary hover:bg-tertiary text-primary-foreground font-headline font-bold text-xs sm:text-sm rounded-xl px-6 py-3 shadow-sm gap-2 transition-colors shrink-0 disabled:opacity-75"
        >
          {isSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{publishSuccessText}</span>
            </>
          ) : (
            <>
              <ArrowUpToLine className="w-4 h-4 stroke-[2.5]" />
              <span>{publishButtonText}</span>
            </>
          )}
        </Button>
      </div>
    </section>
    </Dialog>
  );
}
