import { HeroSection } from "@/components/pages/home/hero-section";
import { FeaturesSection } from "@/components/pages/home/features-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center relative selection:bg-primary/20 selection:text-primary">
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}
