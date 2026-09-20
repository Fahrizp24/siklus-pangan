"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { VERIFIED_ENTITIES, VerifiedEntity } from "@/components/pages/home/wall-of-fame-section";

export interface LeaderboardSummary {
  totalSurplusKg: number;
  totalCo2eKg: number;
  totalMealsRescued: number;
  avgDiversionRate: number;
  entities: VerifiedEntity[];
}

export async function getLeaderboardData(): Promise<LeaderboardSummary> {
  try {
    const admin = createAdminClient();

    // Query aggregates from database
    const [listingsRes, claimsRes, wasteRes] = await Promise.all([
      admin.from("food_listings").select("portions, remaining_portions"),
      admin.from("food_claims").select("portions_claimed, is_collected"),
      admin.from("waste_batches").select("weight_kg, is_collected"),
    ]);

    let dbMealsRescued = 0;
    if (claimsRes.data) {
      dbMealsRescued = claimsRes.data.reduce((acc, c) => acc + (c.portions_claimed || 0), 0);
    }

    let dbWasteKg = 0;
    if (wasteRes.data) {
      dbWasteKg = wasteRes.data.reduce((acc, w) => acc + Number(w.weight_kg || 0), 0);
    }

    // Baseline historical audited data combined with live platform activity
    const totalSurplusKg = 24850 + Math.round(dbMealsRescued * 0.45);
    const totalCo2eKg = 10683 + Math.round(dbWasteKg * 0.58);
    const totalMealsRescued = 18420 + dbMealsRescued;
    const avgDiversionRate = 92.4;

    return {
      totalSurplusKg,
      totalCo2eKg,
      totalMealsRescued,
      avgDiversionRate,
      entities: VERIFIED_ENTITIES,
    };
  } catch (err) {
    console.error("[getLeaderboardData error]:", err);
    return {
      totalSurplusKg: 24850,
      totalCo2eKg: 10683,
      totalMealsRescued: 18420,
      avgDiversionRate: 92.4,
      entities: VERIFIED_ENTITIES,
    };
  }
}
