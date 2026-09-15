import { AppShell } from "@/components/layout/app-shell";
import { HeroSection } from "@/components/pages/home/hero-section";
import { FeaturesSection } from "@/components/pages/home/features-section";

export default function Home() {
  return (
    <AppShell>
      <main className="min-h-[calc(100vh-4rem)] bg-background text-foreground flex flex-col items-center justify-center relative selection:bg-primary/20 selection:text-primary">
        <HeroSection />
        <FeaturesSection />
      </main>
    </AppShell>
  );
}
