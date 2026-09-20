import React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getDisputesData } from "@/actions/disputes";
import { DisputesHero } from "@/components/pages/disputes/disputes-hero";
import { DisputesList } from "@/components/pages/disputes/disputes-list";
import { DisputesPolicyCard } from "@/components/pages/disputes/disputes-policy-card";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DisputesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role = user?.user_metadata?.role;
  if (!role && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role;
  }
  const isDonor = role === "donor";

  // If donor, only fetch donor's own dispute records
  const summary = await getDisputesData(isDonor ? user?.id : undefined);

  return (
    <AppShell role={role}>
      <main className="w-full py-6 sm:py-8 flex flex-col gap-6 sm:gap-8 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <DisputesHero summary={summary} />
        <DisputesList disputes={summary.disputes} />
        <DisputesPolicyCard />
      </main>
    </AppShell>
  );
}
