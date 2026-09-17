"use client";

import React, { useState } from "react";
import { CheckCircle2, Eye, Download, Lock } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { TablePagination } from "@/components/ui/table-pagination";

export const AUDIT_DEMO_REFERENCE_DATE = "2025-05-25";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const AUDIT_LOG_DATA = {
  header: {
    title: "Log Audit Verifikasi Karbon & Sertifikat Digital",
    subtitle:
      "Data demonstrasi — contoh log audit, bukan sertifikat terverifikasi atau catatan langsung.",
    tabs: [
      { id: "q2_2025", label: "Q2 2025", startDate: "2025-04-01", endDate: "2025-06-30" },
      { id: "q1_2025", label: "Q1 2025", startDate: "2025-01-01", endDate: "2025-03-31" },
      { id: "annual_2024", label: "Audit Tahunan 2024", startDate: "2024-01-01", endDate: "2024-12-31" },
    ],
  },
  tableHeaders: [
    { key: "certificateNumber", label: "NOMOR SERTIFIKAT" },
    { key: "auditPeriod", label: "PERIODE AUDIT" },
    { key: "emissionPrevented", label: "EMISI DICEGAH" },
    { key: "methodology", label: "METODOLOGI" },
    { key: "auditor", label: "AUDITOR INDEPENDEN" },
    { key: "hashLedger", label: "HASH BLOCKCHAIN LEDGER" },
    { key: "actions", label: "AKSI" },
  ],
  auditRows: [
    {
      id: "SKP-CR-2025-0581",
      certificateNumber: "SKP-CR-2025-0581",
      auditPeriod: "01 Mei - 25 Mei 2025",
      auditEndDate: "2025-05-25",
      emissionPrevented: "12,50 tCO2e",
      methodology: "ISO 14044 LCA",
      auditorName: "TÜV Rheinland",
      auditorDetail: "Akreditasi KAN",
      hashLedger: "0x71f8...3e4c",
      periodCategory: "q2_2025",
    },
    {
      id: "SKP-CR-2025-0422",
      certificateNumber: "SKP-CR-2025-0422",
      auditPeriod: "01 Apr - 30 Apr 2025",
      auditEndDate: "2025-04-30",
      emissionPrevented: "11,20 tCO2e",
      methodology: "GHG Scope 3 Cat 5",
      auditorName: "PT Sucofindo",
      auditorDetail: "Audit Lapangan",
      hashLedger: "0x9a2b...c914",
      periodCategory: "q2_2025",
    },
    {
      id: "SKP-CR-2025-0319",
      certificateNumber: "SKP-CR-2025-0319",
      auditPeriod: "01 Mar - 31 Mar 2025",
      auditEndDate: "2025-03-31",
      emissionPrevented: "9,60 tCO2e",
      methodology: "IPCC Waste Tier-2",
      auditorName: "PT Sucofindo",
      auditorDetail: "Audit Telemetri IoT",
      hashLedger: "0x44c1...881f",
      periodCategory: "q1_2025",
    },
    {
      id: "SKP-CR-2025-0210",
      certificateNumber: "SKP-CR-2025-0210",
      auditPeriod: "01 Jan - 28 Feb 2025",
      auditEndDate: "2025-02-28",
      emissionPrevented: "15,53 tCO2e",
      methodology: "ISO 14044 LCA",
      auditorName: "TÜV Rheinland",
      auditorDetail: "Verifikasi Berkala",
      hashLedger: "0x12e0...55ab",
      periodCategory: "q1_2025",
    },
  ],
  footer: {
    securityNotice:
      "Pratinjau dan unduhan sertifikat tidak tersedia untuk data demonstrasi. Hash dan auditor hanya contoh, bukan bukti verifikasi.",
    links: [
      { label: "Spesifikasi API Integrasi Audit" },
      { label: "Buku Pedoman Metodologi LCA" },
    ],
  },
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function filterAuditRows(periodId: string, referenceDate = AUDIT_DEMO_REFERENCE_DATE) {
  const period = AUDIT_LOG_DATA.header.tabs.find((tab) => tab.id === periodId);
  if (!period) return [];
  return AUDIT_LOG_DATA.auditRows
    .filter((row) => row.auditEndDate >= period.startDate
      && row.auditEndDate <= period.endDate
      && row.auditEndDate <= referenceDate)
    .sort((a, b) => b.auditEndDate.localeCompare(a.auditEndDate));
}

export function AuditLogSection() {
  const { header, tableHeaders, footer } = AUDIT_LOG_DATA;
  const [activeTab, setActiveTab] = useState("q2_2025");
  const [currentPage, setCurrentPage] = useState(1);
  const filteredRows = filterAuditRows(activeTab);
  const pageSize = 1;
  const total = filteredRows.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, currentPage), pageCount);
  const start = (page - 1) * pageSize;
  const visibleRows = filteredRows.slice(start, start + pageSize);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <Card className="p-6 sm:p-7">
        {/* Header Row: Title & Segmented Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/70">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground font-headline">
              {header.title}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-body mt-0.5">
              {header.subtitle}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tanggal acuan demo: <time dateTime={AUDIT_DEMO_REFERENCE_DATE}>25 Mei 2025</time>.
              Periode difilter berdasarkan tanggal akhir audit, hingga tanggal acuan.
            </p>
          </div>

          {/* Segmented Period Tabs */}
          <div className="p-1 rounded-2xl border border-border bg-muted/50 flex flex-wrap sm:flex-nowrap items-center gap-1 self-start md:self-auto">
            {header.tabs.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-headline font-semibold transition-all ${
                    isSelected
                      ? "bg-card text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Responsive Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <caption className="sr-only">Data demonstrasi — log audit sesuai periode terpilih</caption>
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
                    Tidak ada log audit demonstrasi untuk periode ini.
                  </td>
                </tr>
              )}
              {visibleRows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  {/* NOMOR SERTIFIKAT */}
                  <td className="py-4 px-3 first:pl-0 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-bold text-foreground font-headline text-xs">
                        {row.certificateNumber}
                      </span>
                    </div>
                  </td>

                  {/* PERIODE AUDIT */}
                  <td className="py-4 px-3 text-muted-foreground whitespace-nowrap">
                    {row.auditPeriod}
                  </td>

                  {/* EMISI DICEGAH */}
                  <td className="py-4 px-3 font-mono font-bold text-foreground whitespace-nowrap text-xs sm:text-sm">
                    {row.emissionPrevented}
                  </td>

                  {/* METODOLOGI BADGE */}
                  <td className="py-4 px-3 whitespace-nowrap">
                    <Badge
                      variant="muted"
                      className="rounded-md font-mono text-[10px] font-bold px-2.5 py-1"
                    >
                      {row.methodology}
                    </Badge>
                  </td>

                  {/* AUDITOR INDEPENDEN */}
                  <td className="py-4 px-3 whitespace-nowrap">
                    <span className="font-bold text-foreground font-headline block">
                      {row.auditorName}
                    </span>
                    <span className="text-[11px] text-muted-foreground block mt-0.5">
                      {row.auditorDetail}
                    </span>
                  </td>

                  {/* HASH BLOCKCHAIN LEDGER */}
                  <td className="py-4 px-3 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                    {row.hashLedger}
                  </td>

                  {/* AKSI BUTTONS */}
                  <td className="py-4 px-3 last:pr-0 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        disabled
                        aria-label={`Pratinjau sertifikat ${row.certificateNumber}`}
                        aria-describedby="audit-log-unavailable"
                        className="text-muted-foreground p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Pratinjau Sertifikat"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled
                        aria-label={`Unduh sertifikat PDF ${row.certificateNumber}`}
                        aria-describedby="audit-log-unavailable"
                        className="text-muted-foreground p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Unduh Sertifikat PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={page}
          pages={total ? Array.from({ length: pageCount }, (_, index) => index + 1) : []}
          lastPage={pageCount}
          summaryText={`Menampilkan ${total ? start + 1 : 0}–${start + visibleRows.length} dari ${total} log audit demonstrasi sesuai periode.`}
          onPageChange={(nextPage) => setCurrentPage(Math.min(Math.max(1, nextPage), pageCount))}
        />
        <div className="mt-6 pt-4 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground font-body">
            <Lock className="w-3.5 h-3.5 text-primary shrink-0" />
            <span id="audit-log-unavailable">{footer.securityNotice}</span>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground font-headline text-xs shrink-0 self-start sm:self-auto">
            {footer.links.map((link) => (
              <span key={link.label}>
                {link.label} — tidak tersedia
              </span>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}
