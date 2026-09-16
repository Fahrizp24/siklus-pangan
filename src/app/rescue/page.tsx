import { AppShell } from "@/components/layout/app-shell";
import {
  RescueFilterProvider,
  RadarHeroSection,
  SurplusFeedSection,
} from "@/components/pages/rescue";

export default function RescuePage() {
  return (
    <AppShell>
      <main className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <RescueFilterProvider>
          <RadarHeroSection />
          <SurplusFeedSection />
        </RescueFilterProvider>
      </main>
    </AppShell>
  );
}
