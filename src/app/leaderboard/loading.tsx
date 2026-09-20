import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function LeaderboardLoading() {
  return (
    <AppShell>
      <main className="w-full py-6 sm:py-8 flex flex-col gap-6 sm:gap-8 items-center justify-start max-w-5xl mx-auto px-4 sm:px-6">
        {/* Leaderboard Hero Skeleton */}
        <div className="w-full flex flex-col gap-3 p-6 sm:p-8 rounded-3xl bg-slate-900/5 dark:bg-slate-800/20 border border-slate-200/60 dark:border-slate-800 text-center items-center">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-3/4 max-w-md" />
          <Skeleton className="h-4 w-full max-w-md" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center gap-1">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Podium Skeleton (Top 3) */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 items-end pt-4">
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 flex flex-col items-center gap-3 h-64 justify-center order-2 sm:order-1">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="p-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 flex flex-col items-center gap-3 h-72 justify-center order-1 sm:order-2">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 flex flex-col items-center gap-3 h-56 justify-center order-3">
            <Skeleton className="h-14 w-14 rounded-full" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* Leaderboard Table Skeleton */}
        <div className="w-full p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 flex flex-col gap-4">
          <Skeleton className="h-6 w-44" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
