import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { HeroSection } from "@/components/pages/claims/hero-section";
import { ClaimDetailsSection } from "@/components/pages/claims/claim-details-section";
import { ClaimActionsSection } from "@/components/pages/claims/claim-actions-section";

export const metadata: Metadata = {
  title: "Klaim Pangan",
  description: "Tinjau detail klaim pangan dan langkah pengambilan donasi di SiklusPangan.",
};

export default function ClaimsPage() {
  return (
    <AppShell mainId="main-content">
      <main id="main-content" tabIndex={-1} className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <HeroSection />
        <ClaimDetailsSection />
        <ClaimActionsSection />
      </main>
    </AppShell>
  );
}
