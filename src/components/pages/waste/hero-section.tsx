"use client";

import React from "react";
import Link from "next/link";
import { Scan, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const WASTE_HERO_CONTENT = {
  title: "Pengalihan Limbah Organik & Logistik Biokonversi BSF",
  description:
    "Pencatatan sisa pangan non-konsumsi khusus donatur, pemindaian kontaminan berbasis AI VLM, dan penyaluran ke fasilitas biokonversi larva Black Soldier Fly (BSF) mitra terverifikasi.",
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function HeroSection() {
  const { title, description } = WASTE_HERO_CONTENT;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
        <div className="max-w-4xl">
          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-foreground font-headline tracking-tight leading-tight">
            {title}
          </h1>

          {/* Description Subtext */}
          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-body leading-relaxed mt-3">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
