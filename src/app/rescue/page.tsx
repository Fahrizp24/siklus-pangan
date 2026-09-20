import { AppShell } from "@/components/layout/app-shell";
import { RescueFilterProvider } from "@/lib/context/rescue-filter-context";
import { HeroSection } from "@/components/pages/rescue/hero-section";
import { SurplusFeedSection } from "@/components/pages/rescue/surplus-feed-section";
import { ArchitectureInsightSection } from "@/components/pages/rescue/architecture-insight-section";
import { createClient } from "@/lib/supabase/server";
import { SurplusFoodCardData, SurplusFoodTag } from "@/components/ui/surplus-food-card";

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

  const todayStr = new Date().toISOString().split("T")[0];

  // Parallel prefetch for listings & user metrics on the server
  const [impactResult, listingsResult] = await Promise.all([
    isDonor && user
      ? supabase.from("food_listings").select("portions").eq("donor_id", user.id)
      : user
      ? supabase
          .from("food_claims")
          .select("portions_claimed")
          .eq("claimant_id", user.id)
          .gte("created_at", `${todayStr}T00:00:00Z`)
      : Promise.resolve({ data: null }),

    isDonor
      ? supabase
          .from("food_listings")
          .select("*")
          .eq("status", "active")
          .order("created_at", { ascending: false })
      : supabase.from("food_radar").select("*"),
  ]);

  if (isDonor && user && impactResult.data) {
    const totalP = (impactResult.data as any[]).reduce((acc, l) => acc + (Number(l.portions) || 0), 0);
    donorImpact = {
      totalPortions: totalP,
      co2eReducedKg: Math.round(totalP * 0.45 * 10) / 10,
    };
  } else if (user && impactResult.data) {
    const consumed = (impactResult.data as any[]).reduce((acc, c) => acc + (Number(c.portions_claimed) || 0), 0);
    beneficiaryCapacity = {
      consumedPortions: consumed,
      totalCapacityPortions: profile?.organization_capacity || 150,
      foundationName: profile?.display_name || "Yayasan Mitra Peduli",
    };
  }

  const dbData = (listingsResult.data as any[]) || [];
  const now = Date.now();
  const initialListings: SurplusFoodCardData[] = dbData.map((row: any, idx: number) => {
    const diffMs = new Date(row.safe_until).getTime() - now;
    const hoursLeft = Math.max(0, Math.floor(diffMs / (3600 * 1000)));
    const minsLeft = Math.max(0, Math.floor((diffMs % (3600 * 1000)) / (60 * 1000)));
    const remainingTime = `${String(hoursLeft).padStart(2, "0")}j ${String(minsLeft).padStart(2, "0")}m`;

    const tags: SurplusFoodTag[] = [];
    if (row.dietary_tags?.includes("halal")) tags.push({ label: "Halal Terverifikasi", colorScheme: "green" });
    if (row.dietary_tags?.includes("vegetarian")) tags.push({ label: "Vegetarian", colorScheme: "green" });
    if (row.dietary_tags?.includes("bebas-gluten")) tags.push({ label: "Bebas Gluten", colorScheme: "blue" });
    if (row.risky_ingredients && row.risky_ingredients.length > 0) {
      tags.push({ label: `Alergen: ${row.risky_ingredients.join(", ")}`, colorScheme: "yellow" });
    }

    const currentPortions = row.remaining_portions !== undefined ? row.remaining_portions : row.portions;

    return {
      id: row.id,
      donorCode: `Donatur Terverifikasi #${row.id.slice(0, 4).toUpperCase()}`,
      location: "Renon, Denpasar (1.2 km)",
      distanceKm: 1.2 + idx * 0.4,
      imageUrl: row.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80",
      remainingTime,
      isUrgentBadge: hoursLeft < 2,
      title: row.title,
      portionsCount: currentPortions,
      portionsRemainingText: `${currentPortions} Porsi Tersisa`,
      batchInfo: `Dimasak: ${new Date(row.cooked_at).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WITA`,
      tags,
      category: row.dietary_tags?.[0] || "halal",
      imageBadge: {
        label: row.storage_method === "refrigerated" ? "Cold Chain 4°C" : "Kemasan Higienis",
        iconType: (row.storage_method === "refrigerated" ? "cold_chain" : "default") as any,
      },
    };
  });

  return (
    <AppShell role={role}>
      <main className="w-full py-8 sm:py-10 flex flex-col gap-8 sm:gap-10 items-center justify-start selection:bg-primary/20 selection:text-primary">
        <RescueFilterProvider>
          {!isDonor && <HeroSection />}
          <SurplusFeedSection
            isDonor={isDonor}
            donorId={user?.id}
            beneficiaryCapacity={beneficiaryCapacity}
            donorImpact={donorImpact}
            initialListings={initialListings}
          />
          {!isDonor && <ArchitectureInsightSection />}
        </RescueFilterProvider>
      </main>
    </AppShell>
  );
}
