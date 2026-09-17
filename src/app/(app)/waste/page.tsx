import type { Metadata } from "next";
import { HeroSection } from "@/components/pages/waste/hero-section";
import { StatSection } from "@/components/pages/waste/stat-section";
import { WasteOperationsSection } from "@/components/pages/waste/waste-operations-section";
import { HistorySection } from "@/components/pages/waste/history-section";

export const metadata: Metadata = {
  title: "Limbah Organik",
  description: "Pantau pengelolaan limbah organik, aktivitas biokonversi, dan riwayat pengolahan di SiklusPangan.",
};

export default function WastePage() {
  return (
    <main id="main-content" tabIndex={-1} className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
      <HeroSection />
      <StatSection />
      <WasteOperationsSection />
      <HistorySection />
    </main>
  );
}
