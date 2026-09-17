"use client";

import React, { useState } from "react";
import { Filter, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TablePagination } from "@/components/ui/table-pagination";
import { StatusPill } from "@/components/ui/status-pill";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const WASTE_HISTORY_DATA = {
  header: {
    title: "Riwayat Batch Penjemputan Limbah Organik",
    subtitle:
      "Data demonstrasi — contoh batch dan status pengolahan, bukan penjemputan langsung atau sertifikat terverifikasi.",
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
    },
  ],
  pageSize: 2,
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function HistorySection() {
  const { header, tableHeaders, rows, pageSize } = WASTE_HISTORY_DATA;
  const [category, setCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const categories = Array.from(new Set(rows.map((row) => row.category)));
  const filteredRows = rows.filter(
    (row) => category === "all" || row.category === category,
  );
  const total = filteredRows.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, currentPage), pageCount);
  const start = (page - 1) * pageSize;
  const visibleRows = filteredRows.slice(start, start + pageSize);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <Card className="p-6 sm:p-7">
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

          <div className="flex flex-wrap items-end gap-2.5 self-start md:self-auto">
            <label className="flex flex-col gap-1 text-xs font-headline font-semibold">
              <span className="inline-flex items-center gap-1.5">
                <Filter aria-hidden="true" className="w-3.5 h-3.5 text-muted-foreground" />
                {header.filterButton}
              </span>
              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full max-w-[240px] border border-border bg-background text-foreground rounded-xl h-9 px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">Semua kategori</option>
                {categories.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>
            <Button
              type="button"
              disabled
              aria-describedby="waste-history-unavailable"
              variant="outline"
              size="sm"
              className="border-border text-foreground hover:bg-muted font-headline font-semibold text-xs rounded-xl h-9 px-3.5 gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{header.exportButton}</span>
            </Button>
          </div>
        </div>

        <p id="waste-history-unavailable" className="mt-4 text-xs text-muted-foreground">
          Ekspor CSV dan sertifikat PDF tidak tersedia untuk data demonstrasi.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <caption className="sr-only">Data demonstrasi — riwayat batch sesuai kategori</caption>
            <thead>
              <tr className="border-b border-border/80">
                {tableHeaders.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="py-3 px-3 text-[11px] font-bold font-headline text-muted-foreground uppercase tracking-wider first:pl-0 last:pr-0"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 font-body">
              {visibleRows.length === 0 && (
                <tr>
                  <td colSpan={tableHeaders.length} className="py-8 text-center text-muted-foreground">
                    Tidak ada batch demonstrasi untuk kategori ini.
                  </td>
                </tr>
              )}
              {visibleRows.map((row) => (
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
                      <StatusPill
                        label={row.purityBadge.text}
                        variant="success"
                        hasCheck
                      />
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
                      <StatusPill
                        label={row.statusBadge.text}
                        variant="success"
                        hasDot
                        isPulse
                      />
                    ) : (
                      <StatusPill
                        label={row.statusBadge.text}
                        variant="neutral"
                        hasCheck
                      />
                    )}
                  </td>

                  {/* SERTIFIKAT PDF */}
                  <td className="py-4 px-3 last:pr-0 whitespace-nowrap">
                    <span
                      aria-describedby="waste-history-unavailable"
                      className="inline-flex items-center gap-1 text-muted-foreground font-bold font-headline text-xs"
                    >
                      <FileText aria-hidden="true" className="w-4 h-4 shrink-0" />
                      <span>PDF tidak tersedia</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reusable Table Pagination */}
        <TablePagination
          currentPage={page}
          pages={total ? Array.from({ length: pageCount }, (_, index) => index + 1) : []}
          lastPage={pageCount}
          summaryText={`Menampilkan ${total ? start + 1 : 0}–${start + visibleRows.length} dari ${total} batch demonstrasi sesuai filter.`}
          onPageChange={(nextPage) => setCurrentPage(Math.min(Math.max(1, nextPage), pageCount))}
        />
      </Card>
    </section>
  );
}
