"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

type Result<T> = { success: boolean; data?: T; error?: string };
async function mutate<T>(name: string, params: Record<string, unknown>): Promise<Result<T>> {
  try {
    const client = await createClient();
    const { data: { user }, error: authError } = await client.auth.getUser();
    if (authError || !user) return { success: false, error: "Silakan masuk terlebih dahulu." };
    const { data, error } = await client.rpc(name, params);
    if (error || !data) return { success: false, error: "Transaksi ditolak. Periksa peran, kuota, status, atau saldo Anda." };
    return { success: true, data: data as T };
  } catch {
    return { success: false, error: "Koneksi terputus. Periksa riwayat sebelum mencoba lagi." };
  }
}
const claimSchema = z.object({ listing_id: z.string().uuid(), portions: z.number().int().min(1).max(2147483647) }).strict();
export async function claimFoodToken(input: unknown): Promise<Result<{ id: string; qr_token: string; portions_claimed: number }>> {
  const p = claimSchema.safeParse(input);
  if (!p.success) return { success: false, error: "Data klaim tidak valid." };
  return mutate("claim_food_token", { p_listing_id: p.data.listing_id, p_portions: p.data.portions });
}
const wasteSchema = z.object({
  weight_kg: z.number().finite().positive().max(999999.99).multipleOf(0.01),
  target_category: z.enum(["bsf_maggot", "poultry_fish", "compost_biogas"]),
  image_url: z.string().url().max(2048).regex(/^https?:\/\//).optional(),
  billing_mode: z.enum(["prepaid", "monthly_invoice"]),
}).strict();
export async function createWasteBatch(input: unknown): Promise<Result<{ id: string; qr_handover_token: string; rate_per_kg: number }>> {
  const p = wasteSchema.safeParse(input);
  if (!p.success) return { success: false, error: "Data limbah tidak valid." };
  return mutate("create_waste_batch", { p_weight_kg: p.data.weight_kg, p_target_category: p.data.target_category, p_image_url: p.data.image_url ?? null, p_billing_mode: p.data.billing_mode });
}
export async function processWasteHandover(input: unknown): Promise<Result<{ id: string; processor_credit: number; donor_charge: number; subsidy_amount: number; already_processed: boolean }>> {
  const p = z.object({ token: z.string().regex(/^[a-f0-9]{32}$/) }).strict().safeParse(input);
  if (!p.success) return { success: false, error: "Token tidak valid." };
  return mutate("process_waste_handover", { p_token: p.data.token });
}
export async function collectFoodClaim(input: unknown): Promise<Result<{ id: string; collected_at: string; already_collected: boolean }>> {
  const p = z.object({ token: z.string().regex(/^[a-f0-9]{32}$/) }).strict().safeParse(input);
  if (!p.success) return { success: false, error: "Token tidak valid." };
  return mutate("collect_food_claim", { p_token: p.data.token });
}
export async function submitDisputeStrike(input: unknown): Promise<Result<{ id: string; response_deadline: string }>> {
  const p = z.object({ listing_id: z.string().uuid(), reason: z.string().trim().min(1).max(2000) }).strict().safeParse(input);
  if (!p.success) return { success: false, error: "Laporan tidak valid." };
  return mutate("submit_dispute_strike", { p_listing_id: p.data.listing_id, p_reason: p.data.reason });
}
