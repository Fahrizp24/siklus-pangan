import { AppShell } from "@/components/layout/app-shell";
import { RescueFilterProvider } from "@/lib/context/rescue-filter-context";
import { HeroSection } from "@/components/pages/rescue/hero-section";
import { SurplusFeedSection } from "@/components/pages/rescue/surplus-feed-section";
import { ArchitectureInsightSection } from "@/components/pages/rescue/architecture-insight-section";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function RescuePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role = user?.user_metadata?.role;
  let profile: any = null;
  if (user) {
    const { data: p } = await supabase
      .from("profiles")
      .select("role, display_name, is_organization, organization_capacity")
      .eq("id", user.id)
      .single();
    profile = p;
    if (p?.role) role = p.role;
  }

  const isDonor = role === "donor";

  let beneficiaryCapacity = undefined;
  let donorImpact = undefined;

  if (isDonor && user) {
    const { data: listings } = await supabase
      .from("food_listings")
      .select("portions")
      .eq("donor_id", user.id);
    const totalP = (listings || []).reduce((acc, l) => acc + (Number(l.portions) || 0), 0);
    donorImpact = {
      totalPortions: totalP,
      co2eReducedKg: Math.round(totalP * 0.45 * 10) / 10,
    };
  } else if (user) {
    const todayStr = new Date().toISOString().split("T")[0];
    const { data: todayClaims } = await supabase
      .from("food_claims")
      .select("portions_claimed")
      .eq("claimant_id", user.id)
      .gte("created_at", `${todayStr}T00:00:00Z`);

    const consumed = (todayClaims || []).reduce((acc, c) => acc + (Number(c.portions_claimed) || 0), 0);
    beneficiaryCapacity = {
      consumedPortions: consumed,
      totalCapacityPortions: profile?.organization_capacity || 150,
      foundationName: profile?.display_name || "Yayasan Mitra Peduli",
    };
  }

  return (
    <AppShell>
      <main className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <RescueFilterProvider>
          {!isDonor && <HeroSection />}
          <SurplusFeedSection
            isDonor={isDonor}
            donorId={user?.id}
            beneficiaryCapacity={beneficiaryCapacity}
            donorImpact={donorImpact}
          />
          {!isDonor && <ArchitectureInsightSection />}
        </RescueFilterProvider>
      </main>
    </AppShell>
  );
}
