import { AppShell } from "@/components/layout/app-shell";
import { SurplusRadar } from "@/components/rescue/surplus-radar";

export default function RescuePage() {
  return (
    <AppShell>
      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <SurplusRadar />
      </main>
    </AppShell>
  );
}
