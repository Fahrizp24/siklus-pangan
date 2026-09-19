import { AppShell } from "@/components/layout/app-shell";
import { HeroSection } from "@/components/pages/waste/hero-section";
import { StatSection } from "@/components/pages/waste/stat-section";
import { WasteOperationsSection } from "@/components/pages/waste/waste-operations-section";
import { HistorySection } from "@/components/pages/waste/history-section";
import { ProcessorWasteFeed } from "@/components/pages/waste/processor-waste-feed";
import { getWasteBatchesHistory, getAvailableWasteForProcessors } from "@/actions/waste";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function WastePage() {
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

  const isProcessor = role === "processor";

  if (isProcessor) {
    const processorBatches = await getAvailableWasteForProcessors();
    return (
      <AppShell>
        <main className="w-full py-8 sm:py-10 flex flex-col gap-8 items-center justify-start selection:bg-primary/20 selection:text-primary">
          <ProcessorWasteFeed initialBatches={processorBatches} />
        </main>
      </AppShell>
    );
  }

  const batches = await getWasteBatchesHistory(user?.id);

  return (
    <AppShell>
      <main className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <HeroSection />
        <StatSection />
        <WasteOperationsSection />
        <HistorySection initialBatches={batches} />
      </main>
    </AppShell>
  );
}
