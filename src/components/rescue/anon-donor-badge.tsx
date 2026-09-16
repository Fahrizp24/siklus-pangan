"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AnonDonorBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  donorCode: string;
  location?: string;
}

export function AnonDonorBadge({
  donorCode,
  location,
  className,
  ...props
}: AnonDonorBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 bg-neutral-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-full font-medium shadow-sm font-body",
        className
      )}
      {...props}
    >
      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
      <span>
        {donorCode}
        {location ? ` • ${location}` : ""}
      </span>
    </div>
  );
}
