"use client";

import React, { useState } from "react";
import {
  PlusCircle,
  ArrowUpRight,
  Droplet,
  Truck,
  Hourglass,
  Download,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TablePagination } from "@/components/ui/table-pagination";
import { StatusPill } from "@/components/ui/status-pill";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const WALLET_LEDGER_DATA = {
  header: {
    title: "Buku Besar Transaksi & Rekonsiliasi",
    subtitle:
      "Semua mutasi kredit reverse tipping fee dan debit logistik tercatat pada immutable cryptographic hash audit trail.",
    tabs: [
      { id: "all", label: "Semua Transaksi" },
      { id: "waste_incentive", label: "Insentif Limbah (BSF)" },
      { id: "logistics_subsidy", label: "Subsidi Logistik Pangan" },
      { id: "payout", label: "Penarikan Dana" },
    ],
  },
  tableHeaders: [
    { key: "txId", label: "ID TRANSAKSI & HASH" },
    { key: "datetime", label: "TANGGAL & WAKTU" },
    { key: "type", label: "TIPE MUTASI" },
    { key: "description", label: "KETERANGAN BATCH / PARTNER" },
    { key: "weight", label: "BOBOT / UNIT" },
    { key: "nominal", label: "NOMINAL (IDR)" },
    { key: "status", label: "STATUS" },
    { key: "receipt", label: "BUKTI KUITANSI" },
  ],
  transactions: [
    {
      id: "TX-20250523-8910",
      hash: "hash: 8f9b...a12c",
      date: "23 Mei 2025",
      time: "08:42 WITA",
      type: "waste_incentive",
      typeBadge: {
        label: "Reverse Tipping",
        icon: PlusCircle,
        style: "text-primary bg-accent/70 border-primary/25",
      },
      batchTitle: "Batch #ORG-20250523-01",
      partnerSubtitle: "Mitra: PT Bali Biokonversi Sirkular (Jimbaran Dock)",
      weight: "1.420 kg",
      nominal: "+ Rp 710.000",
      nominalStyle: "text-primary font-bold",
      status: "Berhasil",
      statusStyle: "text-primary bg-accent/60 border-primary/20",
      statusDot: "bg-primary",
      receipt: {
        type: "pdf",
        label: "PDF",
        href: "#",
      },
    },
    {
      id: "TX-20250522-3104",
      hash: "hash: c44d...881f",
      date: "22 Mei 2025",
      time: "16:15 WITA",
      type: "payout",
      typeBadge: {
        label: "Penarikan Dana",
        icon: ArrowUpRight,
        style: "text-foreground bg-muted border-border",
      },
      batchTitle: "Payout BI-FAST Mandiri Corp",
      partnerSubtitle: "Rek: 137-00-189283-9 (PT Boga Sejahtera)",
      weight: "-",
      nominal: "- Rp 12.000.000",
      nominalStyle: "text-foreground font-bold",
      status: "Selesai",
      statusStyle: "text-primary bg-accent/60 border-primary/20",
      statusDot: "bg-primary",
      receipt: {
        type: "pdf",
        label: "PDF",
        href: "#",
      },
    },
    {
      id: "TX-20250521-9942",
      hash: "hash: 31e8...d99b",
      date: "21 Mei 2025",
      time: "11:30 WITA",
      type: "waste_incentive",
      typeBadge: {
        label: "Biofuel UCO",
        icon: Droplet,
        style: "text-amber-700 bg-amber-50/80 border-amber-300/80",
      },
      batchTitle: "Batch #UCO-20250521-12",
      partnerSubtitle: "Mitra: PT Green Biofuel Bali Sentosa (SAF Offtaker)",
      weight: "380 kg",
      nominal: "+ Rp 2.850.000",
      nominalStyle: "text-primary font-bold",
      status: "Berhasil",
      statusStyle: "text-primary bg-accent/60 border-primary/20",
      statusDot: "bg-primary",
      receipt: {
        type: "pdf",
        label: "PDF",
        href: "#",
      },
    },
    {
      id: "TX-20250520-4411",
      hash: "hash: 104a...66e2",
      date: "20 Mei 2025",
      time: "19:20 WITA",
      type: "logistics_subsidy",
      typeBadge: {
        label: "Subsidi EV Pangan",
        icon: Truck,
        style: "text-blue-700 bg-blue-50/80 border-blue-200",
      },
      batchTitle: "Surplus Bakery to Food Bank Hub",
      partnerSubtitle: "Armada Cold-chain EV SiklusLog 04 (Denpasar)",
      weight: "120 porsi",
      nominal: "- Rp 180.000",
      nominalStyle: "text-foreground font-bold",
      status: "Selesai",
      statusStyle: "text-primary bg-accent/60 border-primary/20",
      statusDot: "bg-primary",
      receipt: {
        type: "pdf",
        label: "PDF",
        href: "#",
      },
    },
    {
      id: "TX-20250523-9003",
      hash: "hash: pending_escrow",
      date: "23 Mei 2025",
      time: "10:05 WITA",
      type: "waste_incentive",
      typeBadge: {
        label: "Kliring Escrow",
        icon: Hourglass,
        style: "text-amber-700 bg-amber-50/80 border-amber-300/80",
      },
      batchTitle: "Batch #ORG-20250523-04",
      partnerSubtitle: "Tahap Kalibrasi Sensor Timbang Dock 02 BSF",
      weight: "2.500 kg (est)",
      nominal: "Rp 1.250.000",
      nominalStyle: "text-amber-700 font-bold",
      status: "Escrow Pending",
      statusStyle: "text-amber-700 bg-amber-50/80 border-amber-300/80",
      statusDot: "bg-amber-500",
      receipt: {
        type: "verification",
        label: "Verifikasi",
        icon: Lock,
      },
    },
  ],
  footer: {
    summaryText: "Menampilkan 5 dari 128 total transaksi rekonsiliasi tahun berjalan.",
    pagination: {
      prevText: "Sebelumnya",
      nextText: "Selanjutnya",
      pages: [1, 2, 3],
      lastPage: 13,
    },
  },
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function LedgerSection() {
  const { header, tableHeaders, transactions, footer } = WALLET_LEDGER_DATA;
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter transactions according to selected tab
  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === "all") return true;
    return tx.type === activeTab;
  });

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <Card className="p-6 sm:p-7">
        {/* Header Row: Title & Segmented Filter Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-border/70">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-foreground font-headline">
              {header.title}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-body mt-0.5 max-w-xl">
              {header.subtitle}
            </p>
          </div>

          {/* Segmented Filter Tab Controls */}
          <div className="p-1 rounded-2xl border border-border bg-muted/50 flex flex-wrap sm:flex-nowrap items-center gap-1 self-start lg:self-auto">
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
              {filteredTransactions.map((tx) => {
                const TypeIcon = tx.typeBadge.icon;

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-muted/20 transition-colors"
                  >
                    {/* ID TRANSAKSI & HASH */}
                    <td className="py-4 px-3 first:pl-0 whitespace-nowrap">
                      <span className="font-mono font-bold text-foreground block">
                        {tx.id}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground block mt-0.5">
                        {tx.hash}
                      </span>
                    </td>

                    {/* TANGGAL & WAKTU */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <span className="font-bold text-foreground block">
                        {tx.date}
                      </span>
                      <span className="text-muted-foreground text-[11px] block mt-0.5">
                        {tx.time}
                      </span>
                    </td>

                    {/* TIPE MUTASI */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold font-headline ${tx.typeBadge.style}`}
                      >
                        <TypeIcon className="w-3.5 h-3.5" />
                        <span>{tx.typeBadge.label}</span>
                      </span>
                    </td>

                    {/* KETERANGAN BATCH / PARTNER */}
                    <td className="py-4 px-3 min-w-[200px]">
                      <h4 className="font-bold text-foreground font-headline">
                        {tx.batchTitle}
                      </h4>
                      <p className="text-[11px] text-muted-foreground font-body mt-0.5 leading-snug">
                        {tx.partnerSubtitle}
                      </p>
                    </td>

                    {/* BOBOT / UNIT */}
                    <td className="py-4 px-3 font-mono font-bold text-foreground whitespace-nowrap">
                      {tx.weight}
                    </td>

                    {/* NOMINAL (IDR) */}
                    <td
                      className={`py-4 px-3 font-mono whitespace-nowrap text-xs sm:text-sm ${tx.nominalStyle}`}
                    >
                      {tx.nominal}
                    </td>

                    {/* STATUS */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <StatusPill
                        label={tx.status}
                        variant={tx.status === "Escrow Pending" ? "pending" : "success"}
                        hasDot
                      />
                    </td>

                    {/* BUKTI KUITANSI */}
                    <td className="py-4 px-3 last:pr-0 whitespace-nowrap">
                      {tx.receipt.type === "pdf" ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 px-2.5 rounded-lg border-border text-foreground hover:bg-muted font-bold font-headline text-xs gap-1"
                        >
                          <Download className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>PDF</span>
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 px-2.5 rounded-lg border-border text-muted-foreground hover:bg-muted font-medium font-headline text-xs gap-1"
                        >
                          <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{tx.receipt.label}</span>
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Reusable Table Pagination */}
        <TablePagination
          currentPage={currentPage}
          pages={footer.pagination.pages}
          lastPage={footer.pagination.lastPage}
          summaryText={footer.summaryText}
          onPageChange={(page) => setCurrentPage(page)}
          prevLabel={footer.pagination.prevText}
          nextLabel={footer.pagination.nextText}
        />
      </Card>
    </section>
  );
}
