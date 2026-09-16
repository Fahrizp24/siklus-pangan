"use client";

import { Terminal, Database, ShieldCheck, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

export interface HeroBadge {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface HeroContent {
  headline: {
    normal: string;
    highlight: string;
  };
  description: string;
  badges: HeroBadge[];
}

export const HERO_CONTENT: HeroContent = {
  headline: {
    normal: "Teknologi Sirkular Pangan Terintegrasi untuk Masa Depan",
    highlight: "Nol Sampah Makanan",
  },
  description:
    "Menghubungkan surplus pangan korporasi komersial ke panti sosial secara terverifikasi, mengalirkan limbah organik ke biokonversi maggot BSF, dan membukukan reduksi gas rumah kaca tersertifikasi pada sistem ledger yang transparan.",
  badges: [
    {
      id: "expiry-engine",
      label: "Deterministic Expiry Engine v4.2",
      icon: Terminal,
    },
    {
      id: "supabase-db",
      label: "Supabase Enterprise Postgres Realtime",
      icon: Database,
    },
    {
      id: "crypto-handover",
      label: "Cryptographic Proof of Handover",
      icon: ShieldCheck,
    },
  ],
};

export function HeroSection() {
  const { headline, description, badges } = HERO_CONTENT;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-10 md:p-12 lg:p-14 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)] text-left relative overflow-hidden"
      >
        {/* Headline */}
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold tracking-tight text-neutral-900 leading-[1.18] sm:leading-[1.15] max-w-4xl whitespace-pre-line">
          {headline.normal}{" "}
          <span className="text-primary">{headline.highlight}</span>
        </h1>

        {/* Subtitle / Description */}
        <p className="font-body text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-4xl mt-5 sm:mt-6">
          {description}
        </p>

        {/* Technology Badges */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 font-label">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white/90 text-xs sm:text-sm font-medium text-slate-700 shadow-2xs hover:border-primary/40 transition-colors"
              >
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span>{badge.label}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}


