"use client";

import React from "react";
import Image from "next/image";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DietaryTag, DietaryTagColorScheme } from "@/components/ui/dietary-tag";
import { AnonDonorBadge } from "@/components/ui/anon-donor-badge";
import { ExpiryTimeBadge } from "@/components/ui/expiry-time-badge";
import { cn } from "@/lib/utils";

export interface SurplusFoodTag {
  label: string;
  colorScheme: DietaryTagColorScheme;
}

export interface SurplusFoodImageBadge {
  label: string;
  iconType?: "cold_chain" | "hotel" | "halal" | "vegan" | "default";
}

export interface SurplusFoodCostInfo {
  topLabel: string;
  bottomLabel: string;
}

export interface SurplusFoodCardData {
  id: string;
  donorCode: string;
  location?: string;
  imageUrl: string;
  remainingTime: string;
  isUrgentBadge?: boolean;
  eventOrShiftLabel?: string;
  safeUntilText?: string;
  title: string;
  description?: string;
  tags: SurplusFoodTag[];
  portionsCount?: number;
  portionUnit?: string;
  portionsRemainingText?: string; // e.g., "35 Porsi Tersisa"
  batchInfo?: string;
  imageBadge?: SurplusFoodImageBadge;
  costInfo?: SurplusFoodCostInfo;
  category?: string;
  distanceKm?: number;
}

export interface SurplusFoodCardProps {
  card: SurplusFoodCardData;
  isClaimed?: boolean;
  onClaim?: (cardId: string) => void;
  className?: string;
}

export function SurplusFoodCard({
  card,
  isClaimed = false,
  onClaim,
  className,
}: SurplusFoodCardProps) {
  // Format portions string
  const portionsLabel =
    card.portionsRemainingText ||
    (card.portionsCount !== undefined
      ? `${card.portionsCount} ${card.portionUnit || "Porsi"} Tersisa`
      : "Tersedia");

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group",
        className
      )}
    >
      <div>
        {/* Top Header Row: Donor Anonymous Badge (Left) + Expiry Time Badge (Right) */}
        <div className="p-4 sm:p-5 pb-3 flex items-center justify-between gap-3">
          <AnonDonorBadge donorCode={card.donorCode} />

          <div className="shrink-0">
            <ExpiryTimeBadge
              remainingTime={card.remainingTime}
              isUrgent={card.isUrgentBadge}
            />
          </div>
        </div>

        {/* Image Container with Inner Rounded Corners */}
        <div className="px-4 sm:px-5">
          <div className="relative h-44 sm:h-48 w-full rounded-xl overflow-hidden bg-slate-100 shadow-2xs">
            <Image
              src={card.imageUrl}
              alt={card.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
          </div>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 pt-3.5">
          {/* Title */}
          <h3 className="font-headline font-bold text-base text-neutral-900 line-clamp-1 group-hover:text-primary transition-colors">
            {card.title}
          </h3>

          {/* Portions Remaining */}
          <div className="mt-1.5 flex items-center gap-2 text-xs">
            <span className="font-bold text-primary font-headline">
              {portionsLabel}
            </span>
          </div>

          {/* Description if present */}
          {card.description && (
            <p className="text-xs text-slate-500 font-body line-clamp-2 mt-1 leading-relaxed">
              {card.description}
            </p>
          )}

          {/* Dietary & Allergen Tags */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {card.tags.map((tag) => (
              <DietaryTag
                key={tag.label}
                label={tag.label}
                colorScheme={tag.colorScheme}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Row: Free / Subsidy Info (Left) + Claim Action Button (Right) */}
      <div className="p-4 sm:p-5 pt-3 flex items-center justify-between border-t border-slate-100 mt-2">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium">
            {card.costInfo?.topLabel || "Porsi Bebas Biaya"}
          </span>
          <span className="text-xs font-bold text-neutral-800 font-headline">
            {card.costInfo?.bottomLabel || "Subsidi Korporat CSR"}
          </span>
        </div>

        <Button
          size="sm"
          disabled={isClaimed}
          onClick={() => onClaim?.(card.id)}
          className={cn(
            "rounded-xl px-3.5 sm:px-4 py-2 font-semibold text-xs shadow-xs gap-1.5 transition-all",
            isClaimed
              ? "bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed"
              : "bg-primary hover:bg-primary/90 text-white"
          )}
        >
          <QrCode className="w-3.5 h-3.5 shrink-0" />
          <span>{isClaimed ? "Terklaim!" : "Klaim Jatah"}</span>
        </Button>
      </div>
    </div>
  );
}
