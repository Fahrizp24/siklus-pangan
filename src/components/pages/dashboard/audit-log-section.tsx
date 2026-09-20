"use client";

import React, { useState } from "react";
import { CheckCircle2, Eye, Download, Lock } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { EsgPdfTemplate, EsgCertificateData } from "@/components/reports/esg-pdf-template";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const AUDIT_LOG_DATA = {
  header: {
    title: "Log Audit Verifikasi Karbon & Sertifikat Digital",
    subtitle:
      "Catatan kriptografis audit pihak ketiga yang terikat pada konsensus sertifikat emisi.",
    tabs: [
      { id: "q2_2025", label: "Q2 2025 (Berjalan)" },
      { id: "q1_2025", label: "Q1 2025" },
      { id: "annual_2024", label: "Audit Tahunan 2024" },
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
      "Setiap sertifikat dienkripsi dengan standar SHA-256 dan divalidasi dengan smart contract GHG Protocol.",
    links: [
      { label: "Spesifikasi API Integrasi Audit", href: "#" },
      { label: "Buku Pedoman Metodologi LCA", href: "#" },
    ],
  },
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

import { AuditRecord } from "@/actions/dashboard";

interface AuditLogSectionProps {
  auditRows?: AuditRecord[];
  entityName?: string;
  metrics?: {
    co2eReducedKg?: number;
    methanePreventedKg?: number;
    mealsRescued?: number;
    wasteDivertedKg?: number;
  };
}

export function AuditLogSection({
  auditRows: propAuditRows,
  entityName,
  metrics,
}: AuditLogSectionProps) {
  const { header, tableHeaders, auditRows: defaultRows, footer } = AUDIT_LOG_DATA;
  const auditRows = propAuditRows && propAuditRows.length > 0 ? propAuditRows : defaultRows;
  const [activeTab, setActiveTab] = useState("q2_2025");
  const [selectedCertificate, setSelectedCertificate] = useState<Partial<EsgCertificateData> | null>(null);

  // Filter dinamis berdasarkan kuartal/periode yang dipilih
  const filteredRows = auditRows.filter((row) => {
    if (!activeTab || activeTab === "all") return true;
    return row.periodCategory === activeTab;
  });
  const displayRows = filteredRows.length > 0 ? filteredRows : auditRows;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      {selectedCertificate && (
        <EsgPdfTemplate
          data={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
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
          </div>

          {/* Segmented Period Tabs */}
          <div className="p-1 rounded-2xl border border-border bg-muted/50 flex flex-wrap sm:flex-nowrap items-center gap-1 self-start md:self-auto">
            {header.tabs.map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
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
              {displayRows.map((row) => (
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
                        onClick={() =>
                          setSelectedCertificate({
                            certificateNumber: row.certificateNumber,
                            validPeriod: row.auditPeriod,
                            auditor: `${row.auditorName} (${row.auditorDetail})`,
                            ledgerHash: row.hashLedger,
                            entityName: entityName || "PT BOGA SEJAHTERA INDONESIA",
                            co2eReducedKg: metrics?.co2eReducedKg || 48836,
                            methanePreventedKg: metrics?.methanePreventedKg || 3368,
                            mealsRescued: metrics?.mealsRescued || 142850,
                            wasteDivertedKg: metrics?.wasteDivertedKg || 84200,
                          })
                        }
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted cursor-pointer"
                        title="Pratinjau Sertifikat"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedCertificate({
                            certificateNumber: row.certificateNumber,
                            validPeriod: row.auditPeriod,
                            auditor: `${row.auditorName} (${row.auditorDetail})`,
                            ledgerHash: row.hashLedger,
                            entityName: entityName || "PT BOGA SEJAHTERA INDONESIA",
                            co2eReducedKg: metrics?.co2eReducedKg || 48836,
                            methanePreventedKg: metrics?.methanePreventedKg || 3368,
                            mealsRescued: metrics?.mealsRescued || 142850,
                            wasteDivertedKg: metrics?.wasteDivertedKg || 84200,
                          })
                        }
                        className="text-muted-foreground hover:text-primary transition-colors p-1 rounded hover:bg-muted cursor-pointer"
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

        {/* Footer: Security Notice & Methodology Links */}
        <div className="mt-6 pt-4 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground font-body">
            <Lock className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{footer.securityNotice}</span>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground font-headline text-xs shrink-0 self-start sm:self-auto">
            {footer.links.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="hover:text-primary transition-colors underline underline-offset-2"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}
