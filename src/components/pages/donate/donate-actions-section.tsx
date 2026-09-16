"use client";

import React, { useState } from "react";
import { RotateCw, ArrowUpToLine, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/* =========================================================================
   CONFIGURABLE DATA & CONSTANTS (EASY TO EDIT AT TOP OF FILE)
   ========================================================================= */

export const DONATE_ACTIONS_CONTENT = {
  saveDraftButtonText: "Simpan Draf Batch",
  retestAiButtonText: "Uji Ulang AI Vision",
  publishButtonText: "Terbitkan ke Live Radar (/rescue)",
  publishSuccessText: "Listing Berhasil Diterbitkan!",
};

/* =========================================================================
   COMPONENT IMPLEMENTATION
   ========================================================================= */

interface DonateActionsSectionProps {
  onSaveDraft?: () => void;
  onRetestAi?: () => void;
  onPublish?: () => void;
}

export function DonateActionsSection({
  onSaveDraft,
  onRetestAi,
  onPublish,
}: DonateActionsSectionProps) {
  const {
    saveDraftButtonText,
    retestAiButtonText,
    publishButtonText,
    publishSuccessText,
  } = DONATE_ACTIONS_CONTENT;

  const [isPublishing, setIsPublishing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePublishClick = () => {
    if (onPublish) {
      onPublish();
      return;
    }

    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setIsSuccess(true);
      setTimeout(() => {
        window.location.href = "/rescue";
      }, 1200);
    }, 800);
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Left Side: Secondary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 1. Simpan Draf Batch */}
          <Button
            type="button"
            variant="outline"
            onClick={onSaveDraft}
            className="border-border text-foreground hover:bg-muted font-headline font-bold text-xs sm:text-sm rounded-xl px-5 py-3 shadow-2xs transition-colors"
          >
            {saveDraftButtonText}
          </Button>

          {/* 2. Uji Ulang AI Vision */}
          <Button
            type="button"
            variant="outline"
            onClick={onRetestAi}
            className="border-border text-foreground hover:bg-muted font-headline font-bold text-xs sm:text-sm rounded-xl px-5 py-3 shadow-2xs gap-2 transition-colors"
          >
            <RotateCw className="w-4 h-4 text-muted-foreground" />
            <span>{retestAiButtonText}</span>
          </Button>
        </div>

        {/* Right Side: Primary Publish Button */}
        <Button
          type="button"
          onClick={handlePublishClick}
          disabled={isPublishing || isSuccess}
          className="bg-primary hover:bg-tertiary text-primary-foreground font-headline font-bold text-xs sm:text-sm rounded-xl px-6 py-3 shadow-sm gap-2 transition-colors shrink-0 disabled:opacity-75"
        >
          {isSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{publishSuccessText}</span>
            </>
          ) : (
            <>
              <ArrowUpToLine className="w-4 h-4 stroke-[2.5]" />
              <span>{publishButtonText}</span>
            </>
          )}
        </Button>
      </div>
    </section>
  );
}
