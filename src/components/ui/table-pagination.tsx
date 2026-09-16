"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TablePaginationProps {
  currentPage: number;
  pages: number[];
  lastPage?: number;
  summaryText?: string;
  onPageChange: (page: number) => void;
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
}

export function TablePagination({
  currentPage,
  pages,
  lastPage,
  summaryText,
  onPageChange,
  prevLabel = "Sebelumnya",
  nextLabel = "Selanjutnya",
  className,
}: TablePaginationProps) {
  const maxPage = lastPage ?? pages[pages.length - 1];

  return (
    <div
      className={cn(
        "mt-6 pt-4 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs",
        className
      )}
    >
      {summaryText && (
        <p className="text-muted-foreground font-body">{summaryText}</p>
      )}

      <div className="flex items-center gap-1 self-center sm:self-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="h-8 px-2.5 border-border text-muted-foreground hover:bg-muted font-body text-xs rounded-lg"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:hidden" />
          <span className="hidden sm:inline">{prevLabel}</span>
        </Button>

        {pages.map((pageNum) => {
          const isActive = currentPage === pageNum;
          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={cn(
                "w-8 h-8 rounded-lg text-xs font-bold font-mono transition-colors flex items-center justify-center",
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted border border-border/60"
              )}
            >
              {pageNum}
            </button>
          );
        })}

        {lastPage && lastPage > pages[pages.length - 1] && (
          <>
            <span className="px-1 text-muted-foreground font-mono">...</span>
            <button
              type="button"
              onClick={() => onPageChange(lastPage)}
              className={cn(
                "w-8 h-8 rounded-lg text-xs font-bold font-mono transition-colors flex items-center justify-center",
                currentPage === lastPage
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted border border-border/60"
              )}
            >
              {lastPage}
            </button>
          </>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage >= maxPage}
          onClick={() => onPageChange(Math.min(maxPage, currentPage + 1))}
          className="h-8 px-2.5 border-border text-muted-foreground hover:bg-muted font-body text-xs rounded-lg"
        >
          <span className="hidden sm:inline">{nextLabel}</span>
          <ChevronRight className="w-3.5 h-3.5 sm:hidden" />
        </Button>
      </div>
    </div>
  );
}

export default TablePagination;
