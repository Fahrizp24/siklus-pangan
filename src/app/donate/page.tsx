import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { HeroSection } from "@/components/pages/donate/hero-section";
import { RegistrationFormSection } from "@/components/pages/donate/registration-form-section";
import { DonateActionsSection } from "@/components/pages/donate/donate-actions-section";

export const metadata: Metadata = {
  title: "Donasi Pangan",
  description: "Daftarkan surplus pangan dan kelola donasi untuk membantu mengurangi pemborosan pangan.",
};

export default function DonatePage() {
  return (
    <AppShell mainId="main-content">
      <main id="main-content" tabIndex={-1} className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <HeroSection />
        <RegistrationFormSection />
        <DonateActionsSection />
      </main>
    </AppShell>
  );
}
