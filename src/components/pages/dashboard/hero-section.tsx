import React from "react";
import { Download, Award, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const ESG_HERO_CONTENT = {
  badges: {
    certification: "Tersertifikasi ISO 14044 LCA & GHG Protocol Scope 3",
    nodeId: "Node ID: SP-ID-JKT-8829",
  },
  title: "Dashboard ESG & Pengurangan Emisi Karbon",
  description:
    "Audit trail digital kalkulasi pencegahan gas rumah kaca (GHG), pengalihan limbah organik dari TPA, dan pelaporan kepatuhan ESG korporat berbasis sains data terverifikasi.",
  buttons: {
    exportAudit: {
      label: "Ekspor Laporan Audit ESG (PDF/XBRL)",
    },
    downloadCertificate: {
      label: "Unduh Sertifikat Karbon",
    },
  },
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

export function HeroSection() {
  const { badges, title, description, buttons } = ESG_HERO_CONTENT;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Side: Badges, Title & Subtitle */}
          <div className="flex-1 max-w-3xl">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-accent/80 border border-primary/25 text-primary text-[10px] sm:text-xs font-headline font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>{badges.certification}</span>
              </div>

              <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted/70 border border-border text-muted-foreground font-mono text-[10px] sm:text-[11px] font-medium">
                <span>{badges.nodeId}</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-foreground font-headline tracking-tight leading-tight">
              {title}
            </h1>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-sm text-muted-foreground font-body mt-2 sm:mt-2.5 leading-relaxed max-w-2xl">
              {description}
            </p>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 self-start lg:self-center w-full sm:w-auto lg:w-72">
            <Button
              type="button"
              disabled
              aria-describedby="dashboard-reports-unavailable"
              variant="outline"
              className="w-full border-border text-foreground hover:bg-muted font-headline font-semibold text-xs sm:text-sm rounded-xl py-2.5 px-4 h-11 gap-2 shadow-2xs justify-center"
            >
              <Download className="w-4 h-4 text-muted-foreground" />
              <span>{buttons.exportAudit.label}</span>
            </Button>

            <Button
              type="button"
              disabled
              aria-describedby="dashboard-reports-unavailable"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-headline font-bold text-xs sm:text-sm rounded-xl py-2.5 px-4 h-11 gap-2 shadow-xs justify-center"
            >
              <Award className="w-4 h-4" />
              <span>{buttons.downloadCertificate.label}</span>
            </Button>
          </div>
        </div>
        <p id="dashboard-reports-unavailable" className="mt-3 text-xs text-muted-foreground">
          Ekspor laporan audit ESG dan unduh sertifikat karbon belum tersedia.
        </p>
      </div>
    </section>
  );
}
