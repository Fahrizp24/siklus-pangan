import * as React from "react";
import { Check, CheckCircle2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatusPillProps {
  label: string;
  variant?: "success" | "pending" | "info" | "neutral";
  hasDot?: boolean;
  isPulse?: boolean;
  hasCheck?: boolean;
  icon?: LucideIcon;
  className?: string;
}

export function StatusPill({
  label,
  variant = "success",
  hasDot = false,
  isPulse = false,
  hasCheck = false,
  icon: Icon,
  className,
}: StatusPillProps) {
  const variantStyles = {
    success: {
      container: "bg-accent/60 border-primary/25 text-primary",
      dot: "bg-primary",
    },
    pending: {
      container: "bg-amber-50/80 border-amber-300/80 text-amber-700",
      dot: "bg-amber-500",
    },
    info: {
      container: "bg-blue-50/80 border-blue-200 text-blue-700",
      dot: "bg-blue-500",
    },
    neutral: {
      container: "bg-muted/70 border-border text-foreground",
      dot: "bg-muted-foreground",
    },
  }[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold font-headline transition-colors",
        variantStyles.container,
        className
      )}
    >
      {hasDot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            variantStyles.dot,
            isPulse && "animate-pulse"
          )}
        />
      )}
      {hasCheck && (
        <Check className="w-3 h-3 stroke-[3] shrink-0" />
      )}
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{label}</span>
    </span>
  );
}

export default StatusPill;
