import { AppShell } from "@/components/layout/app-shell";
import { HeroSection } from "@/components/pages/dashboard/hero-section";
import { StatSection } from "@/components/pages/dashboard/stat-section";
import { SdgMatrixSection } from "@/components/pages/dashboard/sdg-matrix-section";
import { AuditLogSection } from "@/components/pages/dashboard/audit-log-section";
import { getEsgDashboardMetrics } from "@/actions/dashboard";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role = user?.user_metadata?.role;
  if (!role && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role;
  }

  const metrics = await getEsgDashboardMetrics(user?.id);

  return (
    <AppShell role={role}>
      <main className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <HeroSection />
        <StatSection metrics={metrics} />
        <SdgMatrixSection metrics={metrics} />
        <AuditLogSection
          auditRows={metrics.auditRows}
          entityName={metrics.entityName}
          metrics={metrics}
        />
      </main>
    </AppShell>
  );
}
