import { AppShell } from "@/components/layout/app-shell";
import { HeroSection } from "@/components/pages/home/hero-section";
import { StatSection } from "@/components/pages/home/stat-section";
import { PillarsSection } from "@/components/pages/home/pillars-section";
import { FeaturesSection } from "@/components/pages/home/features-section";
import { WallOfFameSection } from "@/components/pages/home/wall-of-fame-section";

export default function Home() {
  return (
    <AppShell>
      <main className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <HeroSection />
        <StatSection />
        <WallOfFameSection />
        <FeaturesSection />
        <PillarsSection />
      </main>
    </AppShell>
  );
}
