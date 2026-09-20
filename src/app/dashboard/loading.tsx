import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <AppShell>
      <main className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero Section Skeleton */}
        <div className="w-full flex flex-col gap-3 p-6 sm:p-8 rounded-3xl bg-slate-900/5 dark:bg-slate-800/20 border border-slate-200/60 dark:border-slate-800">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-3/4 max-w-lg" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>

        {/* 4 Stat Cards Skeleton */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-9 rounded-xl" />
              </div>
              <Skeleton className="h-8 w-28" />
              <Skeleton className="h-3 w-36" />
            </div>
          ))}
        </div>

        {/* 2 Analytical Panels Skeleton */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 flex flex-col gap-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 flex flex-col gap-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>

        {/* Audit Log Table Skeleton */}
        <div className="w-full p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
