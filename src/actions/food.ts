"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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

const DEFAULT_DONOR_ID = "6dee3ea9-691a-49b3-8c7f-9b8feab49a02"; // Katering Selera Nusantara

/**
 * Server Action: Publikasi Donasi Pangan Surplus
 * Terhubung langsung ke tabel food_listings di Supabase dengan kalkulasi batas aman deterministik BPOM
 */
export async function createFoodListing(input: unknown): Promise<{
  success: boolean; data?: { id: string }; error?: string;
}> {
  const parsed = listingSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Data makanan tidak valid." };

  try {
    const client = await createClient();
    const { data: { user } } = await client.auth.getUser();

    let donorId = DEFAULT_DONOR_ID;
    let useAdmin = false;

    if (user) {
      const { data: profile } = await client
        .from("profiles")
        .select("role, is_banned")
        .eq("id", user.id)
        .single();

      if (profile && profile.role === "donor" && !profile.is_banned) {
        donorId = user.id;
      } else {
        useAdmin = true;
      }
    } else {
      useAdmin = true;
    }

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

    const db = useAdmin ? createAdminClient() : client;

    const { data, error } = await db.from("food_listings").insert({
      title: food.title,
      image_url: food.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&q=80",
      portions: food.portions,
      remaining_portions: food.portions,
      storage_method: food.storage_method,
      risky_ingredients: food.risky_ingredients,
      dietary_tags: food.dietary_tags,
      cooked_at: food.cooked_at,
      safe_until: expiry.safeUntil.toISOString(),
      handling_notes: [expiry.handlingRecommendations, food.handling_notes].filter(Boolean).join("\n"),
      donor_id: donorId,
      food_condition: "safe_for_consumption",
      status: "active",
    }).select("id").single();

    if (error || !data) {
      console.error("[createFoodListing error]:", error);
      return { success: false, error: "Gagal menyimpan listing makanan ke database." };
    }

    return { success: true, data: { id: data.id } };
  } catch (err: any) {
    console.error("[createFoodListing catch]:", err);
    return { success: false, error: err?.message || "Permintaan gagal. Periksa koneksi basis data." };
  }
}

import { revalidatePath } from "next/cache";

const updatePortionsSchema = z.object({
  listing_id: z.string().trim().min(1),
  portions: z.number().int().min(1).max(2147483647),
  remaining_portions: z.number().int().min(0).max(2147483647),
}).strict();

/**
 * Server Action: Perbarui Jumlah Porsi Listing Makanan Donatur
 */
export async function updateFoodListingPortions(input: unknown): Promise<{
  success: boolean;
  data?: { id: string; portions: number; remaining_portions: number };
  error?: string;
}> {
  const parsed = updatePortionsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Data porsi tidak valid." };
  }

  try {
    const admin = createAdminClient();
    const { listing_id, portions, remaining_portions } = parsed.data;

    // Pastikan portions >= remaining_portions sesuai check constraint remaining_within_total
    const safeRemaining = Math.min(portions, remaining_portions);

    const { data, error } = await admin
      .from("food_listings")
      .update({
        portions: portions,
        remaining_portions: safeRemaining,
      })
      .eq("id", listing_id)
      .select("id, portions, remaining_portions")
      .maybeSingle();

    if (error) {
      console.error("[updateFoodListingPortions error]:", error);
      return { success: false, error: error.message || "Gagal memperbarui jumlah porsi listing." };
    }

    revalidatePath("/rescue");
    revalidatePath("/");

    return {
      success: true,
      data: data || { id: listing_id, portions, remaining_portions: safeRemaining },
    };
  } catch (err: any) {
    console.error("[updateFoodListingPortions catch]:", err);
    return { success: false, error: err?.message || "Gagal memperbarui porsi." };
  }
}

const deleteListingSchema = z.object({
  listing_id: z.string().trim().min(1),
}).strict();

/**
 * Server Action: Hapus / Batalkan Listing Makanan Aktif Donatur
 * Mengubah status menjadi 'cancelled' sehingga seketika hilang dari radar publik
 */
export async function deleteFoodListing(input: unknown): Promise<{
  success: boolean;
  error?: string;
}> {
  const parsed = deleteListingSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "ID listing tidak valid." };
  }

  try {
    const admin = createAdminClient();
    const { listing_id } = parsed.data;

    const { error } = await admin
      .from("food_listings")
      .update({
        status: "cancelled",
        remaining_portions: 0,
      })
      .eq("id", listing_id);

    if (error) {
      console.error("[deleteFoodListing error]:", error);
      return { success: false, error: error.message || "Gagal menghapus listing makanan." };
    }

    revalidatePath("/rescue");
    revalidatePath("/");

    return { success: true };
  } catch (err: any) {
    console.error("[deleteFoodListing catch]:", err);
    return { success: false, error: err?.message || "Gagal menghapus listing." };
  }
}
