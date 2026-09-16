"use client";

import React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExpiryTimeBadgeProps {
  remainingTime: string;
  isUrgent?: boolean;
  className?: string;
}

export function ExpiryTimeBadge({
  remainingTime,
  isUrgent = false,
  className,
}: ExpiryTimeBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-2xs select-none",
        isUrgent
          ? "bg-rose-50 text-rose-700 border border-rose-200/80"
          : "bg-amber-50 text-amber-800 border border-amber-200/80",
        className
      )}
    >
      <Clock
        className={cn(
          "w-3 h-3 shrink-0",
          isUrgent ? "text-rose-500" : "text-amber-600"
        )}
      />
      <span>{remainingTime}</span>
    </div>
  );
}
