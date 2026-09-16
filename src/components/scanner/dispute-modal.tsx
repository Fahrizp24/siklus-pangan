"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  HelpCircle,
  RefreshCw,
  ShieldAlert,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitDisputeStrike } from "@/actions/transactions";

interface DisputeModalProps {
  listingId: string;
  foodTitle?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DisputeModal({
  listingId,
  foodTitle = "Makanan Surplus Terklaim",
  onClose,
  onSuccess,
}: DisputeModalProps) {
  const [reason, setReason] = useState<string>("");
  const [photoProof, setPhotoProof] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    id: string;
    responseDeadline: string;
  } | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoProof(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg("Alasan laporan wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await submitDisputeStrike({
        listing_id: listingId,
        reason: reason.trim(),
      });

      if (res.success && res.data) {
        setSuccessResult({
          id: res.data.id,
          responseDeadline: res.data.response_deadline,
        });
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(
          res.error ||
            "Gagal mengirim laporan sengketa. Pastikan klaim telah terverifikasi dan status makanan valid."
        );
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-base sm:text-lg text-foreground">
              Laporan Kualitas Pangan & Sengketa
            </h3>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              Three-Strike Dispute Escalation System (HACCP & Good Samaritan)
            </p>
          </div>
        </div>

        {/* Success View */}
        {successResult ? (
          <div className="mt-6 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 text-primary mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-headline font-bold text-base text-foreground">
                Laporan Sengketa Berhasil Diajukan
              </h4>
              <p className="text-xs text-muted-foreground font-body mt-1 max-w-sm mx-auto">
                Status listing makanan telah dibekukan sementara dari radar publik untuk investigasi mutu.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ID Sengketa:</span>
                <span className="font-mono font-bold text-foreground">
                  #{successResult.id.slice(0, 8)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Batas Sanggah Donatur:</span>
                <span className="font-mono font-bold text-primary">
                  1x24 Jam ({new Date(successResult.responseDeadline).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WITA)
                </span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground">
              Donatur berhak mengunggah foto serah terima berstempel waktu. Jika terbukti lalai, sistem akan menerbitkan strike penalti.
            </p>

            <Button
              type="button"
              onClick={onClose}
              className="w-full bg-primary text-primary-foreground font-headline font-bold text-xs rounded-xl py-2.5"
            >
              Tutup
            </Button>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div className="p-3 rounded-xl bg-muted/30 border border-border/70 text-xs text-muted-foreground">
              <span className="font-headline font-bold text-foreground block">
                Target Hidangan: {foodTitle}
              </span>
              <span className="font-mono text-[11px]">ID: {listingId}</span>
            </div>

            {/* Reason input */}
            <div>
              <label
                htmlFor="dispute-reason"
                className="text-xs font-bold text-foreground font-headline block mb-1.5"
              >
                Uraian Kendala / Kondisi Makanan:
              </label>
              <textarea
                id="dispute-reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Jelaskan kondisi makanan (misal: bau asam sebelum batas aman, tekstur berubah, atau kemasan rusak saat diambil)..."
                className="w-full bg-muted/50 border border-border rounded-xl p-3 text-xs font-body focus:outline-none focus:ring-2 focus:ring-primary text-foreground resize-none"
              />
            </div>

            {/* Photo Proof Upload */}
            <div>
              <label className="text-xs font-bold text-foreground font-headline block mb-1.5">
                Bukti Foto Organoleptik (Opsional):
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-muted border border-border text-foreground hover:bg-muted/80 text-xs font-bold font-headline transition-colors">
                  <Camera className="w-4 h-4 text-primary" />
                  <span>Unggah Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                {photoProof && (
                  <span className="text-[11px] text-primary font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Foto terlampir
                  </span>
                )}
              </div>
            </div>

            {/* Policy Notice */}
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[11px] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Laporan palsu yang disengaja melanggar Good Samaritan clause dan dapat menyebabkan penangguhan akun penerima.
              </span>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                {errorMsg}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/70">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-xl text-xs font-bold border-border"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !reason.trim()}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-headline font-bold text-xs rounded-xl px-4 py-2 gap-1.5 shadow-sm"
              >
                {isSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  "Kirim Laporan Sengketa"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
