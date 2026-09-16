import { AppShell } from "@/components/layout/app-shell";
import { HeroSection } from "@/components/pages/claims/hero-section";

export default function ClaimsPage() {
  return (
    <AppShell>
      <main className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <HeroSection />
      </main>
    </AppShell>
  );
}
