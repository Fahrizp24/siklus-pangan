"use client";

import React from "react";
import { cn } from "@/lib/utils";

import { LucideIcon } from "lucide-react";

export interface FilterPillOption {
  id: string;
  label: string;
  count?: number;
  icon?: LucideIcon;
}

export interface FilterPillsProps {
  options: FilterPillOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  variant?: "solid" | "outline";
  className?: string;
}

export function FilterPills({
  options,
  selectedId,
  onSelect,
  variant = "solid",
  className,
}: FilterPillsProps) {
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0) {
      e.currentTarget.scrollLeft += e.deltaY;
    }
  };

  return (
    <div
      onWheel={handleWheel}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      className={cn(
        "flex items-center gap-2 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1 sm:pb-0 scroll-smooth",
        className
      )}
    >
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        const Icon = option.icon;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isSelected
                ? variant === "outline"
                  ? "border border-primary bg-emerald-50/70 text-primary font-bold shadow-xs"
                  : "bg-primary text-white shadow-xs"
                : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50/60"
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  "w-3.5 h-3.5 shrink-0",
                  isSelected
                    ? variant === "outline"
                      ? "text-primary"
                      : "text-white"
                    : "text-slate-500"
                )}
              />
            )}
            <span>{option.label}</span>
            {option.count !== undefined && (
              <span
                className={cn(
                  "ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                  isSelected
                    ? variant === "outline"
                      ? "bg-primary/10 text-primary"
                      : "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                )}
              >
                ({option.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
