"use client";

import React, { useState } from "react";
import {
  Filter,
  Download,
  FileText,
  CheckCircle2,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const WASTE_HISTORY_DATA = {
  header: {
    title: "Riwayat Batch Penjemputan Limbah Organik",
    subtitle:
      "Audit trail manifest digital, transparansi GHG Scope 3, dan sertifikat biokonversi terbitan mitra.",
    filterButton: "Filter Kategori",
    exportButton: "Export CSV",
  },
  tableHeaders: [
    { key: "batchId", label: "BATCH ID" },
    { key: "datetime", label: "TANGGAL & WAKTU" },
    { key: "category", label: "KATEGORI LIMBAH" },
    { key: "weight", label: "BERAT BERSIH" },
    { key: "purity", label: "KEMURNIAN BSF" },
    { key: "facility", label: "MITRA PENGOLAH" },
    { key: "status", label: "STATUS BIOKONVERSI" },
    { key: "certificate", label: "SERTIFIKAT" },
  ],
  rows: [
    {
      id: "ORG-20250523-01",
      batchId: "#ORG-20250523-01",
      datetime: "23 Mei 2025, 14:15 WITA",
      category: "Sisa Dapur Restoran Utama",
      weight: "240 kg",
      purityBadge: {
        type: "grade_a",
        text: "99.1% (Grade A)",
        hasCheck: true,
      },
      facility: "PT Bali Biokonversi Sirkular",
      statusBadge: {
        type: "incubating",
        dotColor: "bg-primary",
        text: "Dalam Inkubasi Larva (Hari 4)",
      },
      certificateUrl: "#",
    },
    {
      id: "ORG-20250522-03",
      batchId: "#ORG-20250522-03",
      datetime: "22 Mei 2025, 15:40 WITA",
      category: "Ampas Kopi Bar & Kulit Buah",
      weight: "125 kg",
      purityBadge: {
        type: "grade_a",
        text: "98.4% (Grade A)",
        hasCheck: true,
      },
      facility: "PT Bali Biokonversi Sirkular",
      statusBadge: {
        type: "incubating",
        dotColor: "bg-primary",
        text: "Dalam Inkubasi Larva (Hari 5)",
      },
      certificateUrl: "#",
    },
    {
      id: "ORG-20250520-02",
      batchId: "#ORG-20250520-02",
      datetime: "20 Mei 2025, 11:20 WITA",
      category: "Sisa Prasmanan Buffet Event",
      weight: "310 kg",
      purityBadge: {
        type: "grade_a",
        text: "97.8% (Grade A)",
        hasCheck: true,
      },
      facility: "BSF Ecohub Tabanan Bio-Farm",
      statusBadge: {
        type: "completed",
        hasCheck: true,
        text: "Selesai Panen Kasgot & Larva",
      },
      certificateUrl: "#",
    },
    {
      id: "ORG-20250518-05",
      batchId: "#ORG-20250518-05",
      datetime: "18 Mei 2025, 16:05 WITA",
      category: "Minyak Jelantah Dapur (UCO)",
      weight: "85 kg",
      purityBadge: {
        type: "refinery",
        text: "Refinery Grade 1",
        hasCheck: false,
      },
      facility: "PT Green Biofuel Bali Sentosa",
      statusBadge: {
        type: "completed",
        hasCheck: true,
        text: "Selesai Biofuel Conversion",
      },
      certificateUrl: "#",
    },
  ],
  footer: {
    summaryText: "Menampilkan 4 dari 62 batch limbah terverifikasi Q2 2025",
    pagination: {
      prevText: "Sebelumnya",
      nextText: "Selanjutnya",
      pages: [1, 2, 3],
    },
  },
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function HistorySection() {
  const { header, tableHeaders, rows, footer } = WASTE_HISTORY_DATA;
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/70">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground font-headline">
              {header.title}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-body mt-0.5">
              {header.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted font-headline font-semibold text-xs rounded-xl h-9 px-3.5 gap-1.5"
            >
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{header.filterButton}</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted font-headline font-semibold text-xs rounded-xl h-9 px-3.5 gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{header.exportButton}</span>
            </Button>
          </div>
        </div>

        {/* Table Container */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/80">
                {tableHeaders.map((col) => (
                  <th
                    key={col.key}
                    className="py-3 px-3 text-[11px] font-bold font-headline text-muted-foreground uppercase tracking-wider first:pl-0 last:pr-0"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-body">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  {/* BATCH ID */}
                  <td className="py-4 px-3 font-mono font-bold text-foreground first:pl-0 whitespace-nowrap">
                    {row.batchId}
                  </td>

                  {/* TANGGAL & WAKTU */}
                  <td className="py-4 px-3 text-muted-foreground whitespace-nowrap leading-snug">
                    {row.datetime}
                  </td>

                  {/* KATEGORI LIMBAH */}
                  <td className="py-4 px-3 font-bold text-foreground font-headline whitespace-nowrap">
                    {row.category}
                  </td>

                  {/* BERAT BERSIH */}
                  <td className="py-4 px-3 font-mono font-bold text-foreground whitespace-nowrap">
                    {row.weight}
                  </td>

                  {/* KEMURNIAN BSF */}
                  <td className="py-4 px-3 whitespace-nowrap">
                    {row.purityBadge.type === "grade_a" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent/70 border border-primary/25 text-primary text-[11px] font-bold font-headline">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>{row.purityBadge.text}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-muted border border-border text-muted-foreground text-[11px] font-bold font-headline">
                        {row.purityBadge.text}
                      </span>
                    )}
                  </td>

                  {/* MITRA PENGOLAH */}
                  <td className="py-4 px-3 text-muted-foreground whitespace-nowrap font-medium">
                    {row.facility}
                  </td>

                  {/* STATUS BIOKONVERSI */}
                  <td className="py-4 px-3 whitespace-nowrap">
                    {row.statusBadge.type === "incubating" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/50 border border-primary/25 text-primary text-[11px] font-bold font-headline">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span>{row.statusBadge.text}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 border border-border text-foreground text-[11px] font-bold font-headline">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        <span>{row.statusBadge.text}</span>
                      </span>
                    )}
                  </td>

                  {/* SERTIFIKAT PDF */}
                  <td className="py-4 px-3 last:pr-0 whitespace-nowrap">
                    <a
                      href={row.certificateUrl}
                      className="inline-flex items-center gap-1 text-destructive hover:opacity-80 transition-opacity font-bold font-headline text-xs group"
                    >
                      <FileText className="w-4 h-4 text-destructive shrink-0 transition-transform group-hover:scale-110" />
                      <span>PDF</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section Footer: Summary & Pagination */}
        <div className="mt-6 pt-4 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <p className="text-muted-foreground font-body">
            {footer.summaryText}
          </p>

          <div className="flex items-center gap-1 self-center sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 px-2.5 border-border text-muted-foreground hover:bg-muted font-body text-xs rounded-lg"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:hidden" />
              <span className="hidden sm:inline">{footer.pagination.prevText}</span>
            </Button>

            {footer.pagination.pages.map((pageNum) => {
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold font-mono transition-colors flex items-center justify-center ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted border border-border/60"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage === 3}
              onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
              className="h-8 px-2.5 border-border text-muted-foreground hover:bg-muted font-body text-xs rounded-lg"
            >
              <span className="hidden sm:inline">{footer.pagination.nextText}</span>
              <ChevronRight className="w-3.5 h-3.5 sm:hidden" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
