"use client";

<<<<<<< HEAD
import React from "react";
=======
import React, { useState, useEffect } from "react";
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
import {
  GitFork,
  Navigation,
  Download,
  HelpCircle,
  XCircle,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const CLAIM_ACTIONS_CONTENT = {
  logisticsInfo: {
    title: "Perjalanan Logistik Cepat:",
    description: "Estimasi waktu tempuh roda dua/empat: ~7 menit via Jl. Tantular.",
  },
  buttons: {
    navigate: {
      label: "Buka Navigasi Rute",
      googleMapsUrl: "https://maps.google.com/?q=Jl.+Tantular+Renon+Denpasar",
    },
    downloadPdf: {
      label: "Unduh Bukti Klaim (PDF)",
      fileName: "Bukti-Klaim-CLM-89210-BTO.pdf",
    },
    help: {
      label: "Bantuan / Sengketa",
    },
    cancel: {
      label: "Batalkan Klaim",
    },
  },
  footerPolicy: {
    prefix: "Kebijakan Batalkan Klaim: Pengalihan gratis sebelum pukul ",
    highlightTime: "12:30 WITA",
    suffix: " demi mencegah pembusukan makanan.",
    timestampHash: "Timestamp Hash: 892-104-E29B",
  },
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function ClaimActionsSection() {
  const { logisticsInfo, buttons, footerPolicy } = CLAIM_ACTIONS_CONTENT;
<<<<<<< HEAD

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
=======
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);
  const [activeListingId, setActiveListingId] = useState("2a02ea19-32b6-43ac-b4d2-71c2eeead97b");
  const [activeFoodTitle, setActiveFoodTitle] = useState("Gourmet Bento Box Korporat (#CLM-89210-BTO)");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlListingId = params.get("listingId");
      if (urlListingId) {
        setActiveListingId(urlListingId);
      }

      const saved = localStorage.getItem("siklus_active_claim");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.listingId) setActiveListingId(parsed.listingId);
          if (parsed.foodTitle) setActiveFoodTitle(parsed.foodTitle);
        } catch {}
      }
    }
  }, []);

  const handlePrintPdf = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleCancelClaim = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("siklus_active_claim");
    }
    setShowCancelModal(false);
    setCancelSuccessMsg("Klaim berhasil dibatalkan. Kuota harian Anda telah dikembalikan.");
    setTimeout(() => {
      window.location.href = "/rescue";
    }, 1200);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* Modal Dispute Escalation */}
      {showDisputeModal && (
        <DisputeModal
          listingId={activeListingId}
          foodTitle={activeFoodTitle}
          onClose={() => setShowDisputeModal(false)}
        />
      )}

      {/* Modal Konfirmasi Pembatalan Klaim */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <XCircle className="w-6 h-6" />
              <h3 className="font-bold text-base font-headline">Batalkan Tiket Klaim?</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin membatalkan klaim makanan ini? Porsi akan dikembalikan ke Live Radar untuk penerima lain dan kuota harian akun Anda dipulihkan.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCancelModal(false)}
                className="rounded-xl text-xs"
              >
                Kembali
              </Button>
              <Button
                type="button"
                onClick={handleCancelClaim}
                className="bg-destructive hover:bg-destructive/90 text-white rounded-xl text-xs font-bold"
              >
                Ya, Batalkan Klaim
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Feedback Pembatalan */}
      {cancelSuccessMsg && (
        <div className="mb-4 p-4 rounded-2xl bg-primary/10 border border-primary/25 text-primary text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{cancelSuccessMsg}</span>
        </div>
      )}

>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
        {/* Top Content Row: Logistics Notice (Left) & Action Buttons (Right) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Side: Route Fork Icon & Logistics Duration */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-muted/70 text-secondary flex items-center justify-center shrink-0 border border-border/80 shadow-2xs">
              <GitFork className="w-5 h-5 text-secondary" />
            </div>

            <p className="text-xs sm:text-sm font-body leading-relaxed text-muted-foreground">
              <strong className="text-foreground font-bold font-headline mr-1.5">
                {logisticsInfo.title}
              </strong>
              {logisticsInfo.description}
            </p>
          </div>

          {/* Right Side: Action Buttons Grid */}
          <div className="flex flex-col items-stretch lg:items-end gap-2.5 shrink-0">
            {/* Top Row of Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* 1. Buka Navigasi Rute */}
              <Button
                asChild
                className="bg-primary hover:bg-tertiary text-primary-foreground font-headline font-bold text-xs sm:text-sm rounded-xl px-4 py-2.5 shadow-2xs gap-2 transition-colors"
              >
                <a
                  href={buttons.navigate.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="w-4 h-4 text-primary-foreground" />
                  <span>{buttons.navigate.label}</span>
                </a>
              </Button>

              {/* 2. Unduh Bukti Klaim PDF (Navy Secondary) */}
              <Button
                type="button"
<<<<<<< HEAD
                disabled
                aria-describedby="claims-actions-unavailable"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-headline font-bold text-xs sm:text-sm rounded-xl px-4 py-2.5 shadow-2xs gap-2 transition-colors"
=======
                onClick={handlePrintPdf}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-headline font-bold text-xs sm:text-sm rounded-xl px-4 py-2.5 shadow-2xs gap-2 transition-colors cursor-pointer"
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
              >
                <Download className="w-4 h-4" />
                <span>{buttons.downloadPdf.label}</span>
              </Button>

              {/* 3. Bantuan / Sengketa (Dispute Trigger) */}
              <Button
                type="button"
                variant="outline"
                disabled
                aria-describedby="claims-dispute-unavailable"
                className="border-border text-foreground hover:bg-muted font-headline font-bold text-xs sm:text-sm rounded-xl px-4 py-2.5 shadow-2xs gap-2 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-destructive" />
                <span>{buttons.help.label}</span>
              </Button>
            </div>

            {/* Bottom Row: Batalkan Klaim (Destructive Outline, Aligned Right) */}
            <Button
              type="button"
<<<<<<< HEAD
              disabled
              aria-describedby="claims-actions-unavailable"
=======
              onClick={() => setShowCancelModal(true)}
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive font-headline font-bold text-xs sm:text-sm rounded-xl px-4 py-2.5 shadow-2xs gap-2 transition-colors self-end cursor-pointer"
            >
              <XCircle className="w-4 h-4 text-destructive" />
              <span>{buttons.cancel.label}</span>
            </Button>
          </div>
        </div>

        <p id="claims-actions-unavailable" className="mt-3 text-xs text-muted-foreground">
          Unduh bukti klaim dan pembatalan klaim belum tersedia.
        </p>
        <p id="claims-dispute-unavailable" className="mt-2 text-xs text-muted-foreground">
          Bantuan / sengketa belum tersedia: target listing klaim Anda belum terhubung. Tidak ada laporan yang dikirim.
        </p>

        {/* Bottom Policy & Timestamp Footer Row */}
        <div className="border-t border-border/70 pt-4 mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
            <span className="text-muted-foreground">
              {footerPolicy.prefix}
              <strong className="text-foreground font-bold">
                {footerPolicy.highlightTime}
              </strong>
              {footerPolicy.suffix}
            </span>
          </div>

          <span className="font-mono text-[11px] sm:text-xs text-muted-foreground shrink-0">
            {footerPolicy.timestampHash}
          </span>
        </div>
      </div>
    </section>
  );
}
