import { AppShell } from "@/components/layout/app-shell";
import { HeroSection } from "@/components/pages/waste/hero-section";
import { StatSection } from "@/components/pages/waste/stat-section";
import { WasteOperationsSection } from "@/components/pages/waste/waste-operations-section";
import { HistorySection } from "@/components/pages/waste/history-section";
import { getWasteBatchesHistory } from "@/actions/waste";

export const dynamic = "force-dynamic";

export default async function WastePage() {
  const batches = await getWasteBatchesHistory();

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
