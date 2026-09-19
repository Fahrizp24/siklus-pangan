"use client";

import React, { useState, useEffect } from "react";
import { Filter, Download, FileText, Eye, Truck, UserCheck, ArrowRight, Scale, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TablePagination } from "@/components/ui/table-pagination";
import { StatusPill } from "@/components/ui/status-pill";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { WasteBatchRecord, getWasteBatchesHistory } from "@/actions/waste";

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
    { key: "action", label: "AKSI" },
  ],
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

interface HistorySectionProps {
  initialBatches?: WasteBatchRecord[];
}

export function HistorySection({ initialBatches }: HistorySectionProps) {
  const { header, tableHeaders } = WASTE_HISTORY_DATA;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBatch, setSelectedBatch] = useState<WasteBatchRecord | null>(null);
  const [batchRows, setBatchRows] = useState<WasteBatchRecord[]>(initialBatches || []);

  // Sinkronisasi data saat initialBatches berubah dari server
  useEffect(() => {
    if (initialBatches) {
      setBatchRows(initialBatches);
    }
  }, [initialBatches]);

  // Reaktif terhadap pembuatan batch baru dari form di atas
  useEffect(() => {
    const handleBatchCreated = () => {
      getWasteBatchesHistory().then((data) => {
        if (data) {
          setBatchRows(data);
          setCurrentPage(1);
        }
      });
    };

    window.addEventListener("waste_batch_created", handleBatchCreated);
    return () => {
      window.removeEventListener("waste_batch_created", handleBatchCreated);
    };
  }, []);

  // Pagination Dinamis Berbasis Data Riil Database
  const pageSize = 5;
  const totalItems = batchRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedRows = batchRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const paginationPages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const summaryText =
    totalItems === 0
      ? "Belum ada manifest batch limbah terdaftar di database"
      : `Menampilkan ${paginatedRows.length} dari ${totalItems} batch limbah terdaftar di database`;

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
              {paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={tableHeaders.length} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center gap-2.5">
                      <div className="w-12 h-12 rounded-2xl bg-muted/70 border border-border/80 flex items-center justify-center text-muted-foreground">
                        <Scale className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-bold font-headline text-foreground text-sm">
                        Belum Ada Riwayat Batch Terdaftar
                      </p>
                      <p className="text-xs text-muted-foreground font-body leading-relaxed">
                        Belum ada manifest batch limbah organik yang diterbitkan untuk akun ini. Unggah foto residu dan daftarkan batch limbah pada formulir di atas untuk memulai penjemputan armada.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => (
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

                    {/* DETAIL AKSI & MODAL */}
                    <td className="py-4 px-3 last:pr-0 whitespace-nowrap">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBatch(row)}
                        className="h-8 px-3 text-xs font-headline font-semibold text-primary border-primary/30 hover:bg-primary/10 rounded-lg gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dialog Detail Batch */}
        <Dialog open={!!selectedBatch} onOpenChange={(open) => !open && setSelectedBatch(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedBatch && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-primary/10 text-primary font-mono font-bold text-xs">
                      {selectedBatch.batchId}
                    </span>
                    <DialogTitle className="text-base sm:text-lg">
                      Detail Manifest & Telemetri Limbah
                    </DialogTitle>
                  </div>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Audit trail manifest digital, status armada penjemput, dan verifikasi timbangan IoT terhubung database.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2 text-xs">
                  {/* Summary Metric Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-muted/30 p-3 rounded-xl border border-border/60">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-headline">Kategori</span>
                      <p className="font-bold text-foreground text-xs mt-0.5 truncate">{selectedBatch.category}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-headline">Berat Bersih</span>
                      <p className="font-mono font-bold text-primary text-xs mt-0.5">{selectedBatch.weight}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-headline">Kemurnian BSF</span>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 text-xs mt-0.5">
                        {selectedBatch.purityBadge?.text || "99.1% (Grade A)"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-headline">Fasilitas</span>
                      <p className="font-bold text-foreground text-xs mt-0.5 truncate">{selectedBatch.facility}</p>
                    </div>
                  </div>

                  {/* Section 1: Telemetri Armada Penjemput */}
                  <div className="p-4 rounded-xl border border-border/80 bg-card space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-primary" />
                        <h4 className="font-bold font-headline text-foreground text-xs uppercase tracking-wide">
                          Telemetri Armada Penjemput
                        </h4>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        {selectedBatch.statusBadge?.type === "completed"
                          ? "Selesai Diproses di Sentral Hub"
                          : "Dalam Perjalanan Penjemputan"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <UserCheck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-foreground text-sm font-headline">Wayan Sukadana</p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <span>Rating: 4.98 ★</span>
                            <span>•</span>
                            <span className="font-medium text-foreground">Driver Tersertifikasi BSF</span>
                          </p>
                        </div>
                      </div>

                      <div className="bg-muted/40 p-2.5 rounded-lg border border-border/60">
                        <p className="text-[10px] text-muted-foreground uppercase font-headline font-semibold">Kendaraan</p>
                        <p className="font-mono font-bold text-foreground text-xs mt-0.5">Truk Coldbox EV #04 • DK 8421 BB</p>
                        <p className="text-[10px] text-muted-foreground">Kapasitas Maks: 1.500 kg • Cold Temp: 4°C</p>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="bg-muted/20 p-3 rounded-lg border border-border/50 text-[11px] space-y-2">
                      <span className="font-bold text-muted-foreground uppercase text-[10px] font-headline">Rute Operasional</span>
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <span className="px-2 py-0.5 rounded bg-background border border-border text-muted-foreground">Depot Sanur</span>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="px-2 py-0.5 rounded bg-primary/10 border border-primary/30 text-primary font-bold">Dock Pemuatan Donatur</span>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="px-2 py-0.5 rounded bg-background border border-border text-muted-foreground">Sentral Hub BSF</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Log Mutasi & Token Timbangan */}
                  <div className="p-4 rounded-xl border border-border/80 bg-card space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-primary" />
                        <h4 className="font-bold font-headline text-foreground text-xs uppercase tracking-wide">
                          Log Mutasi & Token Timbangan (IoT Validated)
                        </h4>
                      </div>
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        IoT Bluetooth Terkalibrasi
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-muted/40 border border-border/70 space-y-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-headline">
                          Token Handover QR
                        </span>
                        <p className="font-mono text-sm sm:text-base font-extrabold text-foreground tracking-wider break-all">
                          {selectedBatch.qrHandoverToken || selectedBatch.batchId}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Tunjukkan kode atau QR ini ke driver saat penimbangan di dock donatur.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider font-headline">
                          Reverse Tipping Fee
                        </span>
                        <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                          Rp {selectedBatch.ratePerKg || 600} <span className="text-xs font-normal text-muted-foreground">/ kg</span>
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Langsung dikreditkan ke Dompet Sirkular saat timbangan digital terkunci.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => typeof window !== "undefined" && window.print()}
                    className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Cetak Manifest PDF</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setSelectedBatch(null)}
                    className="text-xs font-headline font-semibold px-4"
                  >
                    Tutup
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Reusable Table Pagination */}
        <TablePagination
          currentPage={currentPage}
          pages={paginationPages}
          summaryText={summaryText}
          onPageChange={(page) => setCurrentPage(page)}
          prevLabel="Sebelumnya"
          nextLabel="Selanjutnya"
        />
      </Card>
    </section>
  );
}
