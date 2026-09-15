import { AppShell } from "@/components/layout/app-shell";
import { SurplusRadar } from "@/components/rescue/surplus-radar";

export default function RescuePage() {
  return (
    <AppShell>
      <div className="max-w-6xl mx-auto p-4 sm:p-8">
        <SurplusRadar />
      </div>
    </AppShell>
  );
}
