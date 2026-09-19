import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getDisputesData } from "@/actions/disputes";
import { DisputesHero } from "@/components/pages/disputes/disputes-hero";
import { DisputesList } from "@/components/pages/disputes/disputes-list";
import { DisputesPolicyCard } from "@/components/pages/disputes/disputes-policy-card";

export const dynamic = "force-dynamic";

export default async function DisputesPage() {
  const summary = await getDisputesData();

  return (
    <AppShell>
      <main className="w-full py-6 sm:py-8 flex flex-col gap-6 sm:gap-8 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <DisputesHero summary={summary} />
        <DisputesList disputes={summary.disputes} />
        <DisputesPolicyCard />
      </main>
    </AppShell>
  );
}
