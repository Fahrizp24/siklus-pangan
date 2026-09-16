"use client";

import React from "react";
import { ShieldCheck, Check } from "lucide-react";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export interface StepperItem {
  stepNumber: string;
  stepTag: string;
  title: string;
  status: "completed" | "active" | "pending";
}

export const DONATE_HERO_CONTENT = {
  anonymityNotice: {
    prefix: "Data hotel/katering dianonimkan otomatis (",
    highlightCode: "#00X",
    suffix: ") untuk menjaga reputasi & ketertiban logistik.",
  },
  title: "Inspeksi AI & Registrasi Surplus Pangan",
  description:
    "Unggah dokumentasi hidangan surplus. Sistem memadukan Gemini AI VLM dengan Deterministic Rules Engine berbasis standar BPOM & ISO 14044.",
  steps: [
    {
      stepNumber: "01",
      stepTag: "STEP 01",
      title: "Unggah & Gemini VLM",
      status: "completed",
    },
    {
      stepNumber: "02",
      stepTag: "STEP 02 · AKTIF",
      title: "Validasi Human-in-the-Loop",
      status: "active",
    },
    {
      stepNumber: "03",
      stepTag: "STEP 03",
      title: "Deterministic Expiry Engine",
      status: "pending",
    },
    {
      stepNumber: "04",
      stepTag: "STEP 04",
      title: "Pratinjau Anonim Radar",
      status: "pending",
    },
  ] as StepperItem[],
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

interface HeroSectionProps {
  currentStep?: number;
}

export function HeroSection({ currentStep = 2 }: HeroSectionProps) {
  const { anonymityNotice, title, description, steps } = DONATE_HERO_CONTENT;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
        {/* Top Anonymity Notice */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
          <span>
            {anonymityNotice.prefix}
            <strong className="font-mono font-bold text-foreground">
              {anonymityNotice.highlightCode}
            </strong>
            {anonymityNotice.suffix}
          </span>
        </div>

        {/* Title Headline */}
        <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-foreground font-headline tracking-tight leading-tight mt-3">
          {title}
        </h1>

        {/* Subtitle Description */}
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-body leading-relaxed max-w-4xl mt-2">
          {description}
        </p>

        {/* 4-Step Stepper Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-7">
          {steps.map((step) => {
            const isCompleted = step.status === "completed";
            const isActive = step.status === "active";
            const isPending = step.status === "pending";

            return (
              <div
                key={step.stepNumber}
                className={`p-4 rounded-2xl flex items-center gap-3.5 transition-all ${
                  isActive
                    ? "border-2 border-primary bg-card shadow-xs"
                    : isCompleted
                    ? "border border-primary bg-card shadow-2xs"
                    : "border border-border/80 bg-muted/40"
                }`}
              >
                {/* Step Indicator Box (Check Icon or Step Number) */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-headline font-bold text-xs ${
                    isCompleted
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : isActive
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "bg-muted text-muted-foreground border border-border/80"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-white stroke-[2.5]" />
                  ) : (
                    <span>{step.stepNumber}</span>
                  )}
                </div>

                {/* Step Text Content */}
                <div className="min-w-0">
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold font-headline uppercase tracking-wider block ${
                      isActive || isCompleted ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {step.stepTag}
                  </span>
                  <h2
                    className={`text-xs sm:text-sm font-headline font-bold truncate mt-0.5 ${
                      isActive
                        ? "text-foreground"
                        : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground font-semibold"
                    }`}
                  >
                    {step.title}
                  </h2>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
