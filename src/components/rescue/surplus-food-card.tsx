"use client";

import React from "react";
import Image from "next/image";
import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DietaryTag, DietaryTagColorScheme } from "@/components/ui/dietary-tag";
import { AnonDonorBadge } from "@/components/rescue/anon-donor-badge";
import { ExpiryTimeBadge } from "@/components/rescue/expiry-time-badge";
import { cn } from "@/lib/utils";

export interface SurplusFoodTag {
  label: string;
  colorScheme: DietaryTagColorScheme;
}

export interface SurplusFoodCardData {
  id: string;
  donorCode: string;
  location: string;
  imageUrl: string;
  remainingTime: string;
  isUrgentBadge?: boolean;
  eventOrShiftLabel: string;
  safeUntilText: string;
  title: string;
  description: string;
  tags: SurplusFoodTag[];
  portionsCount: number;
  portionUnit: string;
  category?: string;
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
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between group",
        className
      )}
    >
      {/* Image Container with Floating Badges */}
      <div>
        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
          <Image
            src={card.imageUrl}
            alt={card.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />

          {/* Top Left: Anonymous Donor Badge */}
          <div className="absolute top-3 left-3">
            <AnonDonorBadge
              donorCode={card.donorCode}
              location={card.location}
            />
          </div>

          {/* Bottom Right: Expiry Time Badge */}
          <div className="absolute bottom-3 right-3">
            <ExpiryTimeBadge
              remainingTime={card.remainingTime}
              isUrgent={card.isUrgentBadge}
            />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          {/* Shift / Window & Safe Until Row */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
              {card.eventOrShiftLabel}
            </span>
            <span className="text-emerald-700 font-bold text-[11px]">
              {card.safeUntilText}
            </span>
          </div>

          {/* Title & Description */}
          <h3 className="font-headline font-bold text-base text-neutral-900 mt-2.5 line-clamp-1 group-hover:text-primary transition-colors">
            {card.title}
          </h3>
          <p className="text-xs text-slate-500 font-body line-clamp-2 mt-1 leading-relaxed">
            {card.description}
          </p>

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

      {/* Bottom Row: Portions & Claim Action Button */}
      <div className="p-4 sm:p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
        <div className="flex items-baseline">
          <span className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-headline">
            {card.portionsCount}
          </span>
          <span className="text-xs text-slate-500 font-medium ml-1">
            {card.portionUnit}
          </span>
        </div>

        <Button
          size="sm"
          disabled={isClaimed}
          onClick={() => onClaim?.(card.id)}
          className={cn(
            "rounded-xl px-4 py-2 font-semibold text-xs shadow-xs gap-1.5 transition-all",
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
