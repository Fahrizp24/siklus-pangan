import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClaimsLoading() {
  return (
    <AppShell>
      <main className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header Skeleton */}
        <div className="w-full flex flex-col gap-3 p-6 sm:p-8 rounded-3xl bg-slate-900/5 dark:bg-slate-800/20 border border-slate-200/60 dark:border-slate-800 text-center items-center">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-9 w-3/4 max-w-md" />
          <Skeleton className="h-4 w-full max-w-sm" />
        </div>

        {/* Voucher / Claim Card Skeleton */}
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 flex flex-col items-center gap-6">
          <Skeleton className="h-48 w-48 rounded-2xl" />
          <Skeleton className="h-7 w-40" />
          <div className="w-full space-y-3 pt-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </main>
    </AppShell>
  );
}
