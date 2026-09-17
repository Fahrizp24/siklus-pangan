import React from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnonDonorBadgeProps {
  donorCode: string;
  location?: string;
  className?: string;
}

export function AnonDonorBadge({
  donorCode,
  location,
  className,
}: AnonDonorBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs select-none",
        className
      )}
    >
      <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
      <span>{donorCode}</span>
      {location && <span className="text-emerald-700/80">• {location}</span>}
    </div>
  );
}
