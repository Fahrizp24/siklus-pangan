"use client";

import React from "react";
import {
  ShieldCheck,
  Award,
  Download,
  X,
  Printer,
  CheckCircle2,
  Lock,
  QrCode,
  Building2,
  Leaf,
  Wind,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface EsgCertificateData {
  certificateNumber: string;
  entityName: string;
  issueDate: string;
  validPeriod: string;
  co2eReducedKg: number;
  methanePreventedKg: number;
  mealsRescued: number;
  wasteDivertedKg: number;
  auditor: string;
  ledgerHash: string;
  nodeId: string;
}

interface EsgPdfTemplateProps {
  data?: Partial<EsgCertificateData>;
  onClose: () => void;
}

const DEFAULT_CERTIFICATE: EsgCertificateData = {
  certificateNumber: "SKP-CR-2025-0581",
  entityName: "PT BOGA SEJAHTERA INDONESIA",
  issueDate: "25 Mei 2025",
  validPeriod: "01 Mei 2025 – 25 Mei 2025",
  co2eReducedKg: 12500,
  methanePreventedKg: 862,
  mealsRescued: 4280,
  wasteDivertedKg: 18400,
  auditor: "TÜV Rheinland (Akreditasi KAN LP-012-IDN)",
  ledgerHash: "0x71f8e91d0442bc89a7140f2b3e4c8910d51a66b2",
  nodeId: "SP-ID-JKT-8829",
};

export function EsgPdfTemplate({ data, onClose }: EsgPdfTemplateProps) {
  const cert = { ...DEFAULT_CERTIFICATE, ...data };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      {/* Container Sertifikat Modal */}
      <div className="relative w-full max-w-4xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-border/80 bg-muted/40">
          <div className="flex items-center gap-2 text-xs font-headline font-bold text-foreground">
            <Award className="w-4 h-4 text-primary" />
            <span>Pratinjau Sertifikat Emisi & Kepatuhan ESG Korporat</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={handlePrint}
              className="bg-primary hover:bg-tertiary text-primary-foreground text-xs font-bold font-headline rounded-xl px-4 py-2 gap-1.5 shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF (A4)</span>
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ===================================================================
            PRINTABLE CERTIFICATE BODY (A4 FRIENDLY)
            =================================================================== */}
        <div
          id="printable-esg-certificate"
          className="p-8 sm:p-12 bg-white text-slate-900 border-8 border-double border-primary/20 m-3 sm:m-6 rounded-2xl relative select-none"
        >
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Leaf className="w-96 h-96 text-primary" />
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-headline font-extrabold text-2xl tracking-tight text-primary">
                  SiklusPangan
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                  OFFICIAL ESG AUDIT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                Node ID: {cert.nodeId} · Standard ISO 14044 LCA & GHG Protocol Scope 3
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Nomor Sertifikat
              </span>
              <span className="font-mono font-extrabold text-sm sm:text-base text-slate-800">
                {cert.certificateNumber}
              </span>
            </div>
          </div>

          {/* Title Banner */}
          <div className="text-center py-6">
            <h1 className="text-xl sm:text-3xl font-extrabold font-headline tracking-tight text-slate-900 uppercase">
              Sertifikat Kepatuhan Sirkular & Emisi Karbon
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-body mt-1">
              Diberikan secara resmi kepada entitas donatur rantai pasok pangan:
            </p>
            <div className="inline-block mt-3 px-6 py-2 rounded-xl bg-slate-100 border border-slate-300">
              <h2 className="text-base sm:text-xl font-black font-headline tracking-wide text-primary">
                {cert.entityName}
              </h2>
            </div>
          </div>

          {/* Statement */}
          <p className="text-xs text-slate-600 text-center max-w-2xl mx-auto leading-relaxed">
            Telah berhasil melakukan pengalihan residu organik dari tempat pembuangan akhir (TPA),
            menyelamatkan surplus pangan siap santap, serta mematuhi protokol biokonversi maggot BSF
            selama periode audit: <strong className="text-slate-800 font-mono">{cert.validPeriod}</strong>.
          </p>

          {/* 4 Verified Metric Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <Leaf className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                Reduksi GRK (CO₂e)
              </span>
              <span className="font-mono font-black text-base sm:text-lg text-emerald-700">
                {(cert.co2eReducedKg / 1000).toFixed(2)} tCO₂e
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                {cert.co2eReducedKg.toLocaleString("id-ID")} kg CO₂e
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <Wind className="w-5 h-5 text-sky-600 mx-auto mb-1" />
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                Metana (CH₄) Dicegah
              </span>
              <span className="font-mono font-black text-base sm:text-lg text-sky-700">
                {cert.methanePreventedKg.toLocaleString("id-ID")} kg
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                Suwung & Bantar Gebang
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <Utensils className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                Pangan Diselamatkan
              </span>
              <span className="font-mono font-black text-base sm:text-lg text-amber-700">
                {cert.mealsRescued.toLocaleString("id-ID")}
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                Porsi Siap Konsumsi
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <Building2 className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                Biokonversi BSF
              </span>
              <span className="font-mono font-black text-base sm:text-lg text-purple-700">
                {(cert.wasteDivertedKg / 1000).toFixed(1)} Ton
              </span>
              <span className="text-[9px] text-slate-400 block mt-0.5">
                Zero Waste to Landfill
              </span>
            </div>
          </div>

          {/* Verification Audit Trail Box */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-600 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Auditor Independen:</span>
              <span className="font-bold text-slate-800">{cert.auditor}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Ledger Immutability Hash:</span>
              <span className="font-bold text-primary truncate max-w-xs">{cert.ledgerHash}</span>
            </div>
          </div>

          {/* Signatures & Stamps Footer */}
          <div className="mt-8 pt-6 border-t-2 border-slate-200 grid grid-cols-3 items-end text-center text-xs">
            {/* QR Consensus */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <span className="text-[9px] font-mono text-slate-400 mt-1">
                Scan Verifikasi Konsensus
              </span>
            </div>

            {/* Official Stamp */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-18 h-18 rounded-full border-2 border-primary/40 text-primary flex flex-col items-center justify-center p-1 rotate-[-8deg] bg-primary/5">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span className="text-[7px] font-mono font-bold tracking-widest uppercase">
                  VERIFIED EMISSION
                </span>
                <span className="text-[6px] text-slate-500">TCC 2026 UTM</span>
              </div>
            </div>

            {/* Signature */}
            <div className="flex flex-col items-center">
              <div className="border-b border-slate-400 w-36 pb-1 font-serif italic text-slate-800 text-sm">
                Dr. Ir. Arya Wirawan, M.Env
              </div>
              <span className="text-[10px] font-bold text-slate-700 font-headline mt-1">
                Lead Sustainability Auditor
              </span>
              <span className="text-[9px] text-slate-400 font-mono">
                Konsorsium Sirkular Pangan
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
