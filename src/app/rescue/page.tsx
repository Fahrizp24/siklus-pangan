import { AppShell } from "@/components/layout/app-shell";
import { RescueFilterProvider } from "@/lib/context/rescue-filter-context";
import { HeroSection } from "@/components/pages/rescue/hero-section";
import { SurplusFeedSection } from "@/components/pages/rescue/surplus-feed-section";
import { ArchitectureInsightSection } from "@/components/pages/rescue/architecture-insight-section";

export default function RescuePage() {
  return (
    <AppShell>
      <main className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <RescueFilterProvider>
          <HeroSection />
          <SurplusFeedSection />
          <ArchitectureInsightSection />
        </RescueFilterProvider>
      </main>
    </AppShell>
  );
}
