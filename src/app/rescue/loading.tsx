import { AppShell } from "@/components/layout/app-shell";
import { Skeleton } from "@/components/ui/skeleton";

export default function RescueLoading() {
  return (
    <AppShell>
      <main className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start max-w-7xl mx-auto px-4 sm:px-6">
        {/* Rescue Hero Skeleton */}
        <div className="w-full flex flex-col gap-4 p-6 sm:p-8 rounded-3xl bg-slate-900/5 dark:bg-slate-800/20 border border-slate-200/60 dark:border-slate-800">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-3/4 max-w-md" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <div className="flex gap-2 pt-2 flex-wrap">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </div>

        {/* Filter bar Skeleton */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4">
          <Skeleton className="h-11 w-full sm:w-80 rounded-xl" />
          <div className="flex gap-2 w-full sm:w-auto">
            <Skeleton className="h-11 w-32 rounded-xl" />
            <Skeleton className="h-11 w-36 rounded-xl" />
          </div>
        </div>

        {/* Food cards grid Skeleton */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 overflow-hidden flex flex-col"
            >
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-4/5" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-md" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex justify-between items-center">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-9 w-28 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </AppShell>
  );
}
