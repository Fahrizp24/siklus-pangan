"use client";

import React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExpiryTimeBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  remainingTime: string;
  isUrgent?: boolean;
}

export function ExpiryTimeBadge({
  remainingTime,
  isUrgent = false,
  className,
  ...props
}: ExpiryTimeBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 text-white text-[11px] px-2.5 py-1 rounded-full font-bold shadow-sm backdrop-blur-xs font-body",
        isUrgent ? "bg-red-600/90" : "bg-amber-600/90",
        className
      )}
      {...props}
    >
      <Clock className="w-3 h-3 shrink-0" />
      <span>{remainingTime}</span>
    </div>
  );
}
