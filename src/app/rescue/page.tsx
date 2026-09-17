import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { RescueFilterProvider } from "@/lib/context/rescue-filter-context";
import { HeroSection } from "@/components/pages/rescue/hero-section";
import { SurplusFeedSection } from "@/components/pages/rescue/surplus-feed-section";
import { ArchitectureInsightSection } from "@/components/pages/rescue/architecture-insight-section";

export const metadata: Metadata = {
  title: "Live Radar",
  description: "Temukan surplus pangan yang tersedia dan telusuri pilihan donasi melalui Live Radar SiklusPangan.",
};

export default function RescuePage() {
  return (
    <AppShell mainId="main-content">
      <main id="main-content" tabIndex={-1} className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <RescueFilterProvider>
          <HeroSection />
          <SurplusFeedSection />
          <ArchitectureInsightSection />
        </RescueFilterProvider>
      </main>
    </AppShell>
  );
}
