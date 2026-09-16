"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { calculateFoodExpiry } from "@/lib/rules/expiry";

const listingSchema = z.object({
  title: z.string().trim().min(1).max(200),
  image_url: z.string().url().max(2048).refine(value => /^https?:\/\//i.test(value)).optional(),
  portions: z.number().int().min(1).max(2147483647),
  cooked_at: z.string().datetime({ offset: true }),
  storage_method: z.enum(["room_temperature", "heated_display", "refrigerated", "sealed_container"]),
  risky_ingredients: z.array(z.string().trim().min(1).max(100)).max(50),
  dietary_tags: z.array(z.string().trim().min(1).max(100)).max(20),
  handling_notes: z.string().trim().max(2000).optional(),
}).strict();

/** FHR-10: server-owned donor, stock and deterministic expiry; session client retains RLS. */
export async function createFoodListing(input: unknown): Promise<{
  success: boolean; data?: { id: string }; error?: string;
}> {
  const parsed = listingSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Data makanan tidak valid." };
  try {
    const client = await createClient();
    const { data: { user }, error: authError } = await client.auth.getUser();
    if (authError || !user) return { success: false, error: "Silakan masuk sebagai donatur." };
    const { data: profile, error: profileError } = await client.from("profiles")
      .select("role,is_banned").eq("id", user.id).single();
    if (profileError || !profile || profile.role !== "donor" || profile.is_banned !== false) {
      return { success: false, error: "Hanya donatur aktif yang boleh menambahkan makanan." };
    }
    const food = parsed.data;
    const now = Date.now();
    if (Date.parse(food.cooked_at) > now) {
      return { success: false, error: "Waktu memasak tidak boleh di masa depan." };
    }
    const expiry = calculateFoodExpiry({
      cookedAt: food.cooked_at, storageMethod: food.storage_method,
      riskyIngredients: food.risky_ingredients,
    });
    if (!Number.isFinite(expiry.safeUntil.getTime()) || expiry.safeUntil.getTime() <= now) {
      return { success: false, error: "Makanan sudah melewati batas aman konsumsi." };
    }
    const { data, error } = await client.from("food_listings").insert({
      ...food,
      image_url: food.image_url ?? null,
      handling_notes: [expiry.handlingRecommendations, food.handling_notes].filter(Boolean).join("\n"),
      donor_id: user.id,
      remaining_portions: food.portions,
      safe_until: expiry.safeUntil.toISOString(),
      food_condition: "safe_for_consumption",
      status: "active",
    }).select("id").single();
    if (error || !data) return { success: false, error: "Gagal menyimpan makanan." };
    return { success: true, data: { id: data.id } };
  } catch {
    // No automatic retry: an interrupted response may follow a committed insert.
    return { success: false, error: "Permintaan gagal. Periksa daftar makanan sebelum mencoba lagi." };
  }
}
