"use client";

import React from "react";
import { cn } from "@/lib/utils";

export type DietaryTagColorScheme = "yellow" | "green" | "blue" | "neutral" | "red";

export interface DietaryTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
  colorScheme?: DietaryTagColorScheme;
  children?: React.ReactNode;
}

const COLOR_SCHEME_STYLES: Record<DietaryTagColorScheme, string> = {
  yellow: "border-amber-300 bg-amber-50/80 text-amber-800",
  green: "border-emerald-300 bg-emerald-50/80 text-emerald-800",
  blue: "border-sky-300 bg-sky-50/80 text-sky-800",
  red: "border-rose-300 bg-rose-50/80 text-rose-800",
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
};

export function DietaryTag({
  label,
  colorScheme = "neutral",
  children,
  className,
  ...props
}: DietaryTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md border font-body transition-colors",
        COLOR_SCHEME_STYLES[colorScheme],
        className
      )}
      {...props}
    >
      {label || children}
    </span>
  );
}
