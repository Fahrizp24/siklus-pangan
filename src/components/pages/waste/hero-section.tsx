"use client";

import React from "react";
import Link from "next/link";
import { Scan, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const WASTE_HERO_CONTENT = {
  breadcrumbs: [
    { label: "Beranda", href: "/" },
    { label: "Limbah Organik & Biokonversi (/waste)", href: "/waste" },
  ],
  title: "Pengalihan Limbah Organik & Logistik Biokonversi BSF",
  description:
    "Pencatatan sisa pangan non-konsumsi, pemindaian kontaminan berbasis AI, dan penyaluran ke fasilitas biokonversi larva Black Soldier Fly (BSF) mitra terverifikasi.",
  buttons: {
    scanContaminant: {
      label: "Scan Kontaminan Kamera (/waste/scan)",
      href: "/waste/scan",
    },
    newPickup: {
      label: "Input Penjemputan Limbah Baru",
      href: "/waste/new",
    },
  },
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function HeroSection() {
  const { breadcrumbs, title, description, buttons } = WASTE_HERO_CONTENT;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Side: Breadcrumb, Title, & Description */}
          <div className="flex-1 max-w-3xl">
            {/* Breadcrumb Trail */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-body">
              <Link
                href={breadcrumbs[0].href}
                className="hover:text-primary transition-colors"
              >
                {breadcrumbs[0].label}
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium truncate">
                {breadcrumbs[1].label}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-foreground font-headline tracking-tight leading-tight mt-2.5">
              {title}
            </h1>

            {/* Description Subtext */}
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-body leading-relaxed mt-3">
              {description}
            </p>
          </div>

          {/* Right Side: Dual Action Buttons */}
          <div className="flex flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            {/* Button 1: Scan Kontaminan Kamera (Outline) */}
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto border-border text-foreground hover:bg-muted font-headline font-bold text-xs sm:text-sm rounded-xl px-4 py-2.5 shadow-2xs gap-2 transition-colors justify-center"
            >
              <Link href={buttons.scanContaminant.href}>
                <Scan className="w-4 h-4 text-foreground shrink-0" />
                <span>{buttons.scanContaminant.label}</span>
              </Link>
            </Button>

            {/* Button 2: Input Penjemputan Limbah Baru (Primary Green) */}
            <Button
              asChild
              className="w-full sm:w-auto bg-primary hover:bg-tertiary text-primary-foreground font-headline font-bold text-xs sm:text-sm rounded-xl px-4 py-2.5 shadow-xs gap-2 transition-colors justify-center"
            >
              <Link href={buttons.newPickup.href}>
                <PlusCircle className="w-4 h-4 text-primary-foreground shrink-0" />
                <span>{buttons.newPickup.label}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
