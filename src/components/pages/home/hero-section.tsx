"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Compass, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export const HERO_CONTENT = {
  headline: {
    normal: "Setiap Butir Makanan Berharga.",
    highlight: "Setiap Kilogram Residu Berdaya.",
  },
  description:
    "Ekosistem digital terpadu untuk menyelamatkan surplus pangan hotel & katering ke panti sosial secara terverifikasi, mengalirkan residu makanan ke biokonversi maggot BSF, dan membukukan reduksi gas rumah kaca Scope 3 tersertifikasi.",
  actions: {
    primary: {
      label: "Jelajahi Radar Pangan",
      href: "/rescue",
    },
    secondary: {
      label: "Donasikan Surplus Makanan",
      href: "/donate",
    },
  },
  trustBadges: [
    {
      id: "bpom",
      label: "Standar Keamanan Pangan BPOM",
      icon: ShieldCheck,
    },
    {
      id: "halal",
      label: "Verifikasi Halal MUI",
      icon: CheckCircle2,
    },
  ],
};

export function HeroSection() {
  const { headline, description, actions, trustBadges } = HERO_CONTENT;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-3xl border border-border bg-card p-7 sm:p-10 md:p-12 lg:p-14 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)] text-left relative overflow-hidden"
      >
        {/* Headline */}
        <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-extrabold tracking-tight text-foreground leading-[1.18] sm:leading-[1.15] max-w-4xl">
          {headline.normal}{" "}
          <span className="text-primary block sm:inline">{headline.highlight}</span>
        </h1>

        {/* Subtitle / Description */}
        <p className="font-body text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mt-4 sm:mt-5">
          {description}
        </p>

        {/* Dual Call-to-Actions */}
        <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-xl px-6 py-3 font-headline font-semibold text-sm sm:text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs gap-2 h-12"
          >
            <Link href={actions.primary.href}>
              <Compass className="w-4 h-4 shrink-0" />
              <span>{actions.primary.label}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-xl px-6 py-3 font-headline font-semibold text-sm sm:text-base border-border text-foreground hover:bg-muted shadow-2xs gap-2 h-12"
          >
            <Link href={actions.secondary.href}>
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <span>{actions.secondary.label}</span>
            </Link>
          </Button>
        </div>

        {/* Trust & Certification Strip */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-border/70 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-muted-foreground font-body">
          <span className="font-semibold text-foreground font-headline">
            Standar Verifikasi & Kepatuhan:
          </span>
          <div className="flex flex-wrap items-center gap-3">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 border border-border/80 text-foreground font-medium text-[11px] sm:text-xs"
                >
                  <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{badge.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
