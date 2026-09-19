"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, CheckCircle2, ArrowUpRight, ShieldCheck, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerifiedEntity, VERIFIED_ENTITIES } from "@/components/pages/home/wall-of-fame-section";

const EXTENDED_ENTITIES: VerifiedEntity[] = [
  ...VERIFIED_ENTITIES,
  {
    rank: "06",
    name: "Katering Selera Nusantara (Renon)",
    initials: "SN",
    segment: "Katering Korporat & Resepsi",
    location: "Denpasar, Bali",
    surplusKg: 980,
    co2eKg: 568,
    diversionRate: 81,
    standard: "BPOM Green Kitchen",
  },
  {
    rank: "07",
    name: "Hotel Santika Siligita Nusa Dua",
    initials: "SS",
    segment: "Banqueting & Resort Bintang 4",
    location: "Kuta Selatan, Bali",
    surplusKg: 890,
    co2eKg: 516,
    diversionRate: 80,
    standard: "ISO 14001 EMS",
  },
  {
    rank: "08",
    name: "CV Bali Biokonversi Maggot",
    initials: "BM",
    segment: "Fasilitas Pengolah BSF",
    location: "Sanur, Bali",
    surplusKg: 750,
    co2eKg: 435,
    diversionRate: 98,
    standard: "Circular Feed Tech",
  },
  {
    rank: "09",
    name: "Spesial Sambal & Ayam Bu Kris",
    initials: "BK",
    segment: "Restoran Tradisional Komersial",
    location: "Denpasar Barat, Bali",
    surplusKg: 620,
    co2eKg: 360,
    diversionRate: 77,
    standard: "HACCP Verified",
  },
  {
    rank: "10",
    name: "Sentra Kompos & Biogas Tirta Amerta",
    initials: "TA",
    segment: "Fasilitas Pengolah Residu",
    location: "Sanur Kaja, Bali",
    surplusKg: 540,
    co2eKg: 313,
    diversionRate: 95,
    standard: "SNI Pupuk Organik",
  },
];

const SEGMENTS = [
  "Semua Segmen",
  "Resort & Hotel",
  "Katering Korporat",
  "Restoran & Bakery",
  "Pengolah Residu",
];

export function LeaderboardTable() {
  const [selectedSegment, setSelectedSegment] = useState("Semua Segmen");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEntities = useMemo(() => {
    return EXTENDED_ENTITIES.filter((e) => {
      const matchSearch =
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.segment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.location.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;
      if (selectedSegment === "Semua Segmen") return true;
      if (selectedSegment === "Resort & Hotel")
        return e.segment.includes("Resort") || e.segment.includes("Hotel");
      if (selectedSegment === "Katering Korporat")
        return e.segment.includes("Katering") || e.segment.includes("Catering");
      if (selectedSegment === "Restoran & Bakery")
        return e.segment.includes("Bakery") || e.segment.includes("Restoran");
      if (selectedSegment === "Pengolah Residu")
        return e.segment.includes("Pengolah") || e.segment.includes("BSF");
      return true;
    });
  }, [selectedSegment, searchQuery]);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-7 lg:p-8 shadow-xs space-y-6">
        {/* Controls: Search & Segment Filter */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Segment Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {SEGMENTS.map((seg) => {
              const active = selectedSegment === seg;
              return (
                <button
                  key={seg}
                  onClick={() => setSelectedSegment(seg)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-headline font-semibold transition-all shrink-0 cursor-pointer ${
                    active
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  {seg}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari entitas, fasilitas, kota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-body"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-border/80 text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                <th scope="col" className="py-3 px-3 w-12 text-center">
                  Rank
                </th>
                <th scope="col" className="py-3 px-4">
                  Entitas Bisnis & Segmen
                </th>
                <th scope="col" className="py-3 px-4 text-right">
                  Surplus Pangan
                </th>
                <th scope="col" className="py-3 px-4 text-right">
                  Reduksi CO₂e
                </th>
                <th scope="col" className="py-3 px-4 text-center">
                  Diversi TPA
                </th>
                <th scope="col" className="py-3 px-4 text-right">
                  Akreditasi Audit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredEntities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground font-body">
                    Tidak ada entitas yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredEntities.map((entity) => (
                  <tr
                    key={entity.rank}
                    className="group hover:bg-muted/40 transition-colors"
                  >
                    <td className="py-4 px-3 text-center align-middle">
                      <span className="font-mono text-xs sm:text-sm font-bold text-muted-foreground group-hover:text-foreground">
                        {entity.rank}
                      </span>
                    </td>

                    <td className="py-4 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center font-mono font-bold text-xs text-foreground shrink-0">
                          {entity.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="font-headline font-bold text-sm text-foreground leading-snug truncate">
                            {entity.name}
                          </div>
                          <div className="text-xs text-muted-foreground font-body mt-0.5">
                            {entity.segment} • <span className="opacity-80">{entity.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right align-middle">
                      <div className="font-mono text-sm font-bold text-foreground">
                        {entity.surplusKg.toLocaleString("id-ID")} kg
                      </div>
                      <div className="text-[11px] text-muted-foreground font-body">
                        pangan surplus
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right align-middle">
                      <div className="font-mono text-sm font-extrabold text-primary">
                        {entity.co2eKg.toLocaleString("id-ID")} kg
                      </div>
                      <div className="text-[11px] text-muted-foreground font-body">
                        emisi metana dicegah
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center align-middle">
                      <div className="inline-flex flex-col items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-foreground">
                          {entity.diversionRate}%
                        </span>
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${entity.diversionRate}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right align-middle">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium text-foreground bg-muted/70 border border-border shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{entity.standard}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info & CTA */}
        <div className="pt-4 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted-foreground font-body">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span>
              Metrik divalidasi oleh Dinas Lingkungan Hidup & Kehutanan dan terhubung ke audit Scope 3 GHG Protocol.
            </span>
          </div>

          <Button asChild size="sm" className="rounded-xl gap-1.5 font-headline text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shrink-0">
            <Link href="/donate">
              <span>Daftarkan Dapur Anda</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
