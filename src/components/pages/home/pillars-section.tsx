"use client";

import React from "react";
import Link from "next/link";
import { Utensils, Recycle, BarChart3, ArrowRight, ShieldCheck, Scale, Award } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const CIRCULAR_FLOW_CONTENT = {
  title: "Tiga Pilar Alur Sirkularitas Pangan",
  description:
    "Dari dapur komersial hingga ekosistem pangan sirkular: bagaimana SiklusPangan menyatukan penyelamatan makanan, biokonversi residu, dan pelaporan kepatuhan ESG dalam satu alur terpadu.",
  steps: [
    {
      id: "step-rescue",
      stepBadge: "PILAR 01",
      title: "Penyelamatan Surplus Pangan Segar",
      subtitle: "Makanan layak konsumsi ke panti & dhuafa",
      description:
        "Surplus hidangan hotel & katering divalidasi keamanannya dengan Deterministic Expiry Engine. Identitas donatur dienkripsi (#00X) dan diklaim dengan verifikasi 2FA Dynamic QR.",
      highlights: [
        "Enkripsi Anonimitas Donatur (#00X)",
        "Standar Kelayakan Higienis BPOM",
        "Penjemputan Terjadwal & Kuota Dhuafa",
      ],
      icon: Utensils,
      action: {
        label: "Buka Live Radar",
        href: "/rescue",
      },
    },
    {
      id: "step-waste",
      stepBadge: "PILAR 02",
      title: "Biokonversi Residu Pangan BSF",
      subtitle: "Sisa makanan non-layak jadi pakan protein",
      description:
        "Sisa makanan dapur yang tidak memenuhi syarat konsumsi dialihkan dari TPA menuju fasilitas pengolahan larva Black Soldier Fly (BSF) untuk menghasilkan pakan ternak berkelanjutan.",
      highlights: [
        "Timbangan Digital IoT di Loading Dock",
        "Armada Truk Coldbox Berpendingin",
        "Zero Organic Waste to Landfill",
      ],
      icon: Recycle,
      action: {
        label: "Kelola Limbah Organik",
        href: "/waste",
      },
    },
    {
      id: "step-ledger",
      stepBadge: "PILAR 03",
      title: "Dompet Sirkular & Audit Emisi ESG",
      subtitle: "Insentif finansial & kepatuhan Scope 3",
      description:
        "Setiap kilogram limbah yang dialihkan menerima insentif reverse tipping fee otomatis ke Dompet Sirkular, lengkap dengan sertifikat kalkulasi reduksi emisi metana yang siap diaudit.",
      highlights: [
        "Insentif Reverse Tipping Fee Rp 500 / kg",
        "Sertifikat Audit ISO 14044 LCA",
        "Rekonsiliasi Payout BI-FAST Terverifikasi",
      ],
      icon: BarChart3,
      action: {
        label: "Lihat Dashboard ESG",
        href: "/dashboard/esg",
      },
    },
  ],
};

export function PillarsSection() {
  const { title, description, steps } = CIRCULAR_FLOW_CONTENT;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
        {/* Section Header */}
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground font-headline tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-body mt-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* 3 Circular Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="rounded-2xl border border-border bg-muted/30 p-6 flex flex-col justify-between hover:bg-card hover:border-primary/30 transition-all shadow-2xs hover:shadow-sm"
              >
                <div>
                  {/* Top Step Header */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-primary bg-accent px-2.5 py-1 rounded-md border border-primary/20">
                      {step.stepBadge}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center shrink-0 shadow-2xs">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-headline font-bold text-lg text-foreground mt-4 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs font-semibold text-primary mt-1 font-body">
                    {step.subtitle}
                  </p>

                  {/* Body Description */}
                  <p className="text-xs text-muted-foreground font-body mt-2.5 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Key Highlights List */}
                  <div className="mt-4 pt-4 border-t border-border/70 space-y-2">
                    {step.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-foreground/90 font-body">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="mt-6 pt-4 border-t border-border/70">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-between rounded-xl border-border text-foreground hover:bg-card font-headline font-semibold text-xs h-10 shadow-2xs group"
                  >
                    <Link href={step.action.href}>
                      <span>{step.action.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
