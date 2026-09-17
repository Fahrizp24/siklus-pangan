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

const listingIdSchema = z.string().uuid().length(36);

export async function createFoodListing(input: unknown): Promise<{
  success: boolean; data?: { id: string }; error?: string;
}> {
  try {
    const parsed = listingSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: "Data makanan tidak valid." };

    const food = parsed.data;
    const now = Date.now();
    if (Date.parse(food.cooked_at) > now) {
      return { success: false, error: "Waktu memasak tidak boleh di masa depan." };
    }

    const expiry = calculateFoodExpiry({
      cookedAt: food.cooked_at,
      storageMethod: food.storage_method,
      riskyIngredients: food.risky_ingredients,
    });

    if (!Number.isFinite(expiry.safeUntil.getTime()) || expiry.safeUntil.getTime() <= now) {
      return { success: false, error: "Makanan sudah melewati batas aman konsumsi." };
    }

    const client = await createClient();
    const { data: authData, error: authError } = await client.auth.getUser();
    const user = authData?.user;
    if (authError || !user) {
      return { success: false, error: "Anda harus masuk sebagai donatur untuk membuat listing." };
    }

    const { data: profile, error: profileError } = await client
      .from("profiles")
      .select("role, is_banned")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return { success: false, error: "Profil donatur tidak ditemukan." };
    }

    if (profile.role !== "donor" || profile.is_banned !== false) {
      return { success: false, error: "Hanya donatur aktif yang dapat mempublikasi donasi." };
    }

    const { data, error } = await client
      .from("food_listings")
      .insert({
        title: food.title,
        image_url: food.image_url ?? null,
        portions: food.portions,
        remaining_portions: food.portions,
        storage_method: food.storage_method,
        risky_ingredients: food.risky_ingredients,
        dietary_tags: food.dietary_tags,
        cooked_at: food.cooked_at,
        safe_until: expiry.safeUntil.toISOString(),
        handling_notes: [expiry.handlingRecommendations, food.handling_notes].filter(Boolean).join("\n"),
        donor_id: user.id,
        food_condition: "safe_for_consumption",
        status: "active",
      })
      .select("id")
      .single();

    const id = listingIdSchema.safeParse(data?.id);
    if (error || !id.success) {
      return { success: false, error: "Gagal menyimpan listing makanan ke database." };
    }

    return { success: true, data: { id: id.data } };
  } catch {
    return { success: false, error: "Permintaan gagal. Periksa koneksi basis data." };
  }
}
