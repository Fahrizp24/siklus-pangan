"use client";

import React, { useState } from "react";
import { DisputeRecord, submitDisputeRebuttal } from "@/actions/disputes";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Loader2,
  Check,
  AlertCircle,
  FileText,
  ExternalLink,
} from "lucide-react";

interface DisputesListProps {
  disputes: DisputeRecord[];
}

export function DisputesList({ disputes: initialDisputes }: DisputesListProps) {
  const [disputes, setDisputes] = useState<DisputeRecord[]>(initialDisputes);
  const [activeFormId, setActiveFormId] = useState<string | null>(null);
  const [statement, setStatement] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    disputeId: string;
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleOpenForm = (d: DisputeRecord) => {
    setActiveFormId(d.id);
    setStatement(d.donor_statement || "");
    setEvidenceUrl(d.donor_evidence_url || "");
    setFeedback(null);
  };

  const handleSubmitRebuttal = async (disputeId: string) => {
    if (!statement || statement.trim().length < 10) {
      setFeedback({
        disputeId,
        type: "error",
        message: "Penjelasan sanggahan harus minimal 10 karakter.",
      });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    const res = await submitDisputeRebuttal({
      dispute_id: disputeId,
      donor_statement: statement,
      donor_evidence_url: evidenceUrl,
    });

    setSubmitting(false);

    if (res.success) {
      setFeedback({
        disputeId,
        type: "success",
        message: "Sanggahan dan bukti log suhu berhasil diajukan! Tim pengawas akan meninjau verifikasi HACCP.",
      });
      // Optimistically update local state
      setDisputes((prev) =>
        prev.map((item) =>
          item.id === disputeId
            ? { ...item, donor_statement: statement, donor_evidence_url: evidenceUrl || null }
            : item
        )
      );
      setTimeout(() => {
        setActiveFormId(null);
        setFeedback(null);
      }, 4000);
    } else {
      setFeedback({
        disputeId,
        type: "error",
        message: res.error || "Gagal mengirimkan sanggahan.",
      });
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-2 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground font-headline">
            Daftar Kasus Ketidaksesuaian & Hak Sanggah
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-body">
            Setiap kasus mencakup riwayat penyerahan, laporan pihak penerima, dan hak sanggahan donatur.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {disputes.length === 0 ? (
          <div className="p-8 text-center rounded-3xl border border-border bg-card text-muted-foreground text-sm font-body">
            Tidak ada sengketa aktif saat ini. Seluruh serah terima berjalan sesuai standar.
          </div>
        ) : (
          disputes.map((d, index) => {
            const isResolved = d.is_resolved;
            const isFormOpen = activeFormId === d.id;

            return (
              <div
                key={d.id}
                className={`rounded-3xl border p-5 sm:p-7 transition-all ${
                  isResolved
                    ? "bg-card border-border/80 opacity-95"
                    : "bg-card border-amber-300 shadow-xs ring-1 ring-amber-400/20"
                }`}
              >
                {/* Header Case */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/70">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        isResolved
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-100 text-amber-900 border border-amber-300"
                      }`}
                    >
                      {isResolved ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-foreground">
                          KASUS #DISP-0{index + 1}
                        </span>
                        <span className="text-xs text-muted-foreground font-body">•</span>
                        <span className="text-xs text-muted-foreground font-body">
                          {new Date(d.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })} WITA
                        </span>
                      </div>
                      <h3 className="font-headline font-bold text-sm sm:text-base text-foreground mt-0.5">
                        {d.listing_title}
                      </h3>
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div className="shrink-0">
                    {isResolved ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono font-bold text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Selesai Dimediasi • Bebas Sanksi</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-xs font-mono font-bold text-amber-900">
                        <Clock className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                        <span>Menunggu Sanggahan Donatur (Sisa 21 Jam)</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-xs sm:text-sm">
                  {/* Reporter & Donatur */}
                  <div className="space-y-2 bg-muted/40 p-4 rounded-2xl border border-border/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-body">Pelapor:</span>
                      <span className="font-headline font-bold text-foreground">{d.reporter_name}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-body">Donatur Pangan:</span>
                      <span className="font-headline font-bold text-foreground">{d.donor_name}</span>
                    </div>
                    <div className="pt-2 border-t border-border/60">
                      <span className="text-[11px] font-mono text-muted-foreground font-bold uppercase block mb-1">
                        Deskripsi Laporan Penerima:
                      </span>
                      <p className="font-body text-foreground leading-relaxed italic bg-background/60 p-2.5 rounded-xl border border-border/60">
                        &ldquo;{d.reason}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Donor Statement / Evidence */}
                  <div className="space-y-2 bg-muted/40 p-4 rounded-2xl border border-border/60 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-muted-foreground font-bold uppercase block mb-1">
                        Tanggapan Resmi Donatur:
                      </span>
                      {d.donor_statement ? (
                        <div className="space-y-2">
                          <p className="font-body text-foreground leading-relaxed bg-background/60 p-2.5 rounded-xl border border-border/60">
                            {d.donor_statement}
                          </p>
                          {d.donor_evidence_url && (
                            <a
                              href={d.donor_evidence_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>Lihat Bukti Foto Log Suhu / Kemasan</span>
                            </a>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-amber-700 italic bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                          Belum ada sanggahan resmi yang dikirimkan. Donatur memiliki hak mengajukan klarifikasi sebelum penalti diterapkan.
                        </p>
                      )}
                    </div>

                    {!isResolved && !isFormOpen && (
                      <div className="pt-2">
                        <Button
                          size="sm"
                          onClick={() => handleOpenForm(d)}
                          className="w-full rounded-xl text-xs font-headline font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{d.donor_statement ? "Perbarui Sanggahan" : "Ajukan Sanggahan Resmi 1x24 Jam"}</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline Rebuttal Submission Form */}
                {!isResolved && isFormOpen && (
                  <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-800" />
                        <h4 className="font-headline font-bold text-xs sm:text-sm text-amber-950">
                          Formulir Hak Sanggah Donatur (Klausul Good Samaritan)
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveFormId(null)}
                        className="text-xs font-body text-muted-foreground hover:text-foreground"
                      >
                        Batal
                      </button>
                    </div>

                    {feedback && feedback.disputeId === d.id && (
                      <div
                        className={`p-3 rounded-xl border text-xs font-body flex items-center gap-2 ${
                          feedback.type === "success"
                            ? "bg-emerald-100 border-emerald-300 text-emerald-900"
                            : "bg-rose-100 border-rose-300 text-rose-900"
                        }`}
                      >
                        {feedback.type === "success" ? (
                          <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                        )}
                        <span>{feedback.message}</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-headline font-bold text-amber-950">
                          Penjelasan Kronologis & Penanganan Suhu Dapur
                        </label>
                        <textarea
                          rows={3}
                          value={statement}
                          onChange={(e) => setStatement(e.target.value)}
                          placeholder="misal: Makanan disiapkan pada pukul 10:15 WITA dan disimpan dalam thermal urn tertutup 65°C. Suhu ruang dipertahankan sesuai checklist higienitas."
                          className="w-full p-3 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-headline font-bold text-amber-950">
                          Tautan Foto Bukti Log Thermo-hygrometer / Kemasan (Opsional)
                        </label>
                        <input
                          type="url"
                          value={evidenceUrl}
                          onChange={(e) => setEvidenceUrl(e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveFormId(null)}
                          className="rounded-xl text-xs font-semibold"
                        >
                          Tutup
                        </Button>
                        <Button
                          type="button"
                          disabled={submitting}
                          onClick={() => handleSubmitRebuttal(d.id)}
                          size="sm"
                          className="rounded-xl text-xs font-headline font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5 shadow-xs"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Mengirim Sanggahan...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Kirimkan Sanggahan Resmi</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
