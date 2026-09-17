import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface VerifiedEntity {
  rank: string;
  name: string;
  initials: string;
  segment: string;
  location: string;
  surplusKg: number;
  co2eKg: number;
  diversionRate: number;
  standard: string;
}

export const VERIFIED_ENTITIES: VerifiedEntity[] = [
  {
    rank: "01",
    name: "The Mulia Resort & Villas",
    initials: "MR",
    segment: "Banqueting & Resort Bintang 5",
    location: "Nusa Dua, Bali",
    surplusKg: 3420,
    co2eKg: 1983,
    diversionRate: 94,
    standard: "ISO 14064-1",
  },
  {
    rank: "02",
    name: "PT Aerofood ACS Denpasar",
    initials: "AC",
    segment: "In-Flight Catering & Dining",
    location: "Tuban, Bali",
    surplusKg: 2850,
    co2eKg: 1653,
    diversionRate: 91,
    standard: "BPOM Green Kitchen",
  },
  {
    rank: "03",
    name: "W Bali - Seminyak",
    initials: "WB",
    segment: "Luxury Resort & Restaurant",
    location: "Seminyak, Bali",
    surplusKg: 2190,
    co2eKg: 1270,
    diversionRate: 88,
    standard: "ISO 14044 LCA",
  },
  {
    rank: "04",
    name: "Monsieur Spoon Group",
    initials: "MS",
    segment: "Artisan Bakery & Pastry",
    location: "Canggu, Bali",
    surplusKg: 1420,
    co2eKg: 823,
    diversionRate: 85,
    standard: "Zero Waste Pilot",
  },
  {
    rank: "05",
    name: "Grand Hyatt Bali",
    initials: "GH",
    segment: "Convention & Resort",
    location: "Nusa Dua, Bali",
    surplusKg: 1150,
    co2eKg: 667,
    diversionRate: 82,
    standard: "HACCP Verified",
  },
];

export function WallOfFameSection() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)] space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/80">
          <div className="space-y-1 max-w-2xl">
            <span className="text-[11px] font-mono font-bold tracking-wider text-primary uppercase">
              Direktori Audit Keberlanjutan
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground font-headline tracking-tight">
              Mitra Pelopor Dekarbonisasi Pangan
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-body leading-relaxed">
              Pencatatan publik kontribusi hotel, katering, dan produsen pangan dalam menekan emisi metana melalui penyelamatan surplus makanan dan biokonversi residu dapur.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button asChild variant="outline" className="rounded-xl gap-2 text-xs font-semibold border-border">
              <Link href="/leaderboard">
                <span>Lihat Seluruh 48 Entitas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Responsive Mobile Scroll Hint */}
        <div className="flex sm:hidden items-center justify-between text-[11px] text-muted-foreground font-mono pb-1">
          <span>Geser tabel untuk detail audit</span>
          <span>→</span>
        </div>

        {/* Structured Data Table */}
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full text-left border-collapse min-w-[740px]">
            <thead>
              <tr className="border-b border-border/80 text-[11px] font-mono font-bold text-muted-foreground uppercase tracking-wider">
                <th scope="col" className="py-3 px-3 w-12 text-center">
                  No
                </th>
                <th scope="col" className="py-3 px-4">
                  Entitas & Fasilitas
                </th>
                <th scope="col" className="py-3 px-4 text-right">
                  Surplus Selamat
                </th>
                <th scope="col" className="py-3 px-4 text-right">
                  Reduksi Emisi
                </th>
                <th scope="col" className="py-3 px-4 text-center">
                  Sirkularitas
                </th>
                <th scope="col" className="py-3 px-4 text-right">
                  Standar Sertifikasi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {VERIFIED_ENTITIES.map((entity) => (
                <tr
                  key={entity.rank}
                  className="group hover:bg-muted/40 transition-colors"
                >
                  {/* Column 1: Rank */}
                  <td className="py-4 px-3 text-center align-middle">
                    <span className="font-mono text-xs sm:text-sm font-bold text-muted-foreground group-hover:text-foreground">
                      {entity.rank}
                    </span>
                  </td>

                  {/* Column 2: Entity & Facility */}
                  <td className="py-4 px-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-muted border border-border flex items-center justify-center font-mono font-bold text-xs text-foreground shrink-0">
                        {entity.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-headline font-bold text-sm sm:text-base text-foreground leading-snug truncate">
                          {entity.name}
                        </div>
                        <div className="text-xs text-muted-foreground font-body mt-0.5">
                          {entity.segment} • <span className="opacity-80">{entity.location}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Column 3: Surplus Saved */}
                  <td className="py-4 px-4 text-right align-middle">
                    <div className="font-mono text-sm sm:text-base font-bold text-foreground">
                      {entity.surplusKg.toLocaleString("id-ID")} kg
                    </div>
                    <div className="text-[11px] text-muted-foreground font-body">
                      pangan layak
                    </div>
                  </td>

                  {/* Column 4: Emission Reduction */}
                  <td className="py-4 px-4 text-right align-middle">
                    <div className="font-mono text-sm sm:text-base font-extrabold text-primary">
                      {entity.co2eKg.toLocaleString("id-ID")} kg
                    </div>
                    <div className="text-[11px] text-muted-foreground font-body">
                      CO₂e dicegah
                    </div>
                  </td>

                  {/* Column 5: Diversion Rate Progress */}
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
                      <span className="text-[10px] text-muted-foreground font-body">
                        teralihkan
                      </span>
                    </div>
                  </td>

                  {/* Column 6: Simplified Clean Certification Badge */}
                  <td className="py-4 px-4 text-right align-middle">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium text-foreground bg-muted/70 border border-border shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{entity.standard}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ledger Verification Footnote & Action */}
        <div className="pt-4 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground font-body">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
            <span>
              Seluruh metrik diverifikasi melalui data timbangan IoT loading dock dan log rantai pendingin 4°C.
            </span>
          </div>

          <Link
            href="/donate"
            className="inline-flex items-center gap-1 text-primary font-semibold hover:underline shrink-0"
          >
            <span>Daftarkan Dapur Bisnis Anda</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
