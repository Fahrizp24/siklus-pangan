"use client";

import * as React from "react";
import { type LucideIcon, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetricStatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  currency?: string;
  icon: LucideIcon;
  iconStyle?: string;
  iconCustomLabel?: string;
  footerLeft: {
    type: "trend" | "badge" | "highlight" | "warning_text" | "text";
    text?: string;
    dot?: boolean;
    prefix?: string;
    boldText?: string;
    suffix?: string;
  };
  footerRight?: {
    type?: "text" | "trend";
    text?: string;
    boldText?: string;
  };
  className?: string;
}

export function MetricStatCard({
  label,
  value,
  unit,
  currency,
  icon: Icon,
  iconStyle = "text-primary border-primary/25 bg-accent/70",
  iconCustomLabel,
  footerLeft,
  footerRight,
  className,
}: MetricStatCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-[0_4px_24px_-4px_rgba(11,27,61,0.05)] flex flex-col justify-between gap-5 transition-all hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      {/* Top Row: Label & Icon */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-bold text-muted-foreground font-headline tracking-wider uppercase leading-snug">
          {label}
        </span>

        <div
          className={cn(
            "w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs",
            iconStyle
          )}
        >
          {iconCustomLabel ? (
            <span className="font-mono text-[10px] font-bold tracking-tight">
              {iconCustomLabel}
            </span>
          ) : (
            <Icon className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Middle Row: Value + Currency/Unit */}
      <div>
        {currency && (
          <span className="text-xs font-extrabold text-foreground font-headline block">
            {currency}
          </span>
        )}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-[28px] lg:text-[30px] font-extrabold text-foreground font-headline tracking-tight leading-none">
            {value}
          </span>
          {unit && (
            <span className="text-xs sm:text-sm font-semibold text-muted-foreground font-body">
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Row: Footers */}
      <div className="pt-3 border-t border-border/70 flex items-center justify-between gap-2 text-[11px] leading-tight font-body">
        {/* Left detail */}
        <div className="min-w-0 truncate">
          {footerLeft.type === "badge" ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-accent/80 border border-primary/25 text-primary text-[10px] font-medium font-mono">
              {footerLeft.dot && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              )}
              <span className="truncate">{footerLeft.text}</span>
            </span>
          ) : footerLeft.type === "trend" ? (
            <span className="inline-flex items-center gap-1 font-bold text-primary font-mono text-[11px]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{footerLeft.text}</span>
            </span>
          ) : footerLeft.type === "highlight" ? (
            <span className="font-bold text-primary truncate block font-headline">
              {footerLeft.text}
            </span>
          ) : footerLeft.type === "warning_text" ? (
            <span className="text-amber-700 font-medium truncate block">
              {footerLeft.text}
            </span>
          ) : (
            <span className="text-muted-foreground truncate block">
              {footerLeft.prefix}
              {footerLeft.boldText && (
                <strong className="text-foreground font-bold font-headline">
                  {footerLeft.boldText}
                </strong>
              )}
              {footerLeft.suffix}
            </span>
          )}
        </div>

        {/* Right detail */}
        {footerRight && (
          <div className="shrink-0 text-right">
            {footerRight.type === "trend" ? (
              <span className="inline-flex items-center gap-1 font-bold text-primary text-[11px] font-mono">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{footerRight.text}</span>
              </span>
            ) : footerRight.boldText ? (
              <span className="font-bold text-foreground font-headline">
                {footerRight.boldText}
              </span>
            ) : (
              <span className="text-muted-foreground text-[10px] sm:text-[11px] truncate block">
                {footerRight.text}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MetricStatCard;
