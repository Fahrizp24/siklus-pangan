import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { HeroSection } from "@/components/pages/dashboard/hero-section";
import { StatSection } from "@/components/pages/dashboard/stat-section";
import { SdgMatrixSection } from "@/components/pages/dashboard/sdg-matrix-section";
import { AuditLogSection } from "@/components/pages/dashboard/audit-log-section";

export const metadata: Metadata = {
  title: "Dashboard Dampak",
  description: "Tinjau ringkasan dampak pangan, metrik keberlanjutan, dan catatan aktivitas SiklusPangan.",
};

export default function DashboardPage() {
  return (
    <AppShell mainId="main-content">
      <main id="main-content" tabIndex={-1} className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <HeroSection />
        <StatSection />
        <SdgMatrixSection />
        <AuditLogSection />
      </main>
    </AppShell>
  );
}
