import { AppShell } from "@/components/layout/app-shell";
import { HeroSection } from "@/components/pages/dashboard/hero-section";
import { StatSection } from "@/components/pages/dashboard/stat-section";
import { SdgMatrixSection } from "@/components/pages/dashboard/sdg-matrix-section";
import { AuditLogSection } from "@/components/pages/dashboard/audit-log-section";
import { getEsgDashboardMetrics } from "@/actions/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const metrics = await getEsgDashboardMetrics();

  return (
    <AppShell>
      <main className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <HeroSection />
        <StatSection metrics={metrics} />
        <SdgMatrixSection />
        <AuditLogSection />
      </main>
    </AppShell>
  );
}
