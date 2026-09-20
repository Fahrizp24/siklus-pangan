import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getLeaderboardData } from "@/actions/leaderboard";
import { LeaderboardHero } from "@/components/pages/leaderboard/leaderboard-hero";
import { LeaderboardPodium } from "@/components/pages/leaderboard/leaderboard-podium";
import { LeaderboardTable } from "@/components/pages/leaderboard/leaderboard-table";

export default async function LeaderboardPage() {
  const data = await getLeaderboardData();

  return (
    <AppShell>
      <main className="w-full py-6 sm:py-8 flex flex-col gap-6 sm:gap-8 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <LeaderboardHero
          totalSurplusKg={data.totalSurplusKg}
          totalCo2eKg={data.totalCo2eKg}
          totalMealsRescued={data.totalMealsRescued}
          avgDiversionRate={data.avgDiversionRate}
        />
        <LeaderboardPodium entities={data.entities} />
        <LeaderboardTable entities={data.entities} />
      </main>
    </AppShell>
  );
}
