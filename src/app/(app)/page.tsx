import type { Metadata } from "next";
import { HeroSection } from "@/components/pages/home/hero-section";
import { StatSection } from "@/components/pages/home/stat-section";
import { PillarsSection } from "@/components/pages/home/pillars-section";
import { FeaturesSection } from "@/components/pages/home/features-section";
import { WallOfFameSection } from "@/components/pages/home/wall-of-fame-section";

export const metadata: Metadata = {
  title: "Beranda",
  description: "Jelajahi donasi surplus pangan, pengelolaan limbah organik, dan dampak sirkular bersama SiklusPangan.",
};

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
      <HeroSection />
      <StatSection />
      <WallOfFameSection />
      <FeaturesSection />
      <PillarsSection />
    </main>
  );
}
