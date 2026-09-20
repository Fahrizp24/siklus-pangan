"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

type Result<T> = { success: boolean; data?: T; error?: string };

const AUTH_ERROR = "Sesi tidak ditemukan atau sudah berakhir. Silakan masuk kembali.";
const VALIDATION_ERROR_CLAIM = "Data klaim tidak valid.";
const VALIDATION_ERROR_TOKEN = "Format token tidak valid.";
const VALIDATION_ERROR_WASTE = "Data limbah tidak valid.";
const VALIDATION_ERROR_DISPUTE = "Format laporan sengketa tidak valid.";
const DISPATCH_ERROR = "Hasil permintaan belum dapat dipastikan. Periksa status sebelum mengirim ulang.";

const TIMESTAMP_SCHEMA = z.string().datetime({ offset: true })
  .refine((value) => Number.isFinite(Date.parse(value)));

const UUID_SCHEMA = z.string().uuid();

const TOKEN_32_SCHEMA = z.string().length(32).regex(/^[a-f0-9]{32}$/);

const claimSchema = z
  .object({
    listing_id: UUID_SCHEMA,
    portions: z.number().int().min(1).max(2147483647).finite(),
  })
  .strict();

const collectSchema = z
  .object({
    token: TOKEN_32_SCHEMA,
  })
  .strict();

const wasteSchema = z
  .object({
    weight_kg: z
      .number()
      .finite()
      .positive()
      .max(999999.99)
      .refine((v) => v === Number(v.toFixed(2)), { message: "Invalid precision" }),
    target_category: z.enum(["bsf_maggot", "poultry_fish", "compost_biogas"]),
    image_url: z
      .string()
      .url()
      .max(2048)
      .regex(/^https?:\/\//, { message: "Invalid URL" })
      .optional(),
    billing_mode: z.enum(["prepaid", "monthly_invoice"]).default("prepaid"),
  })
  .strict();

const handoverSchema = z
  .object({
    token: TOKEN_32_SCHEMA,
  })
  .strict();

<<<<<<< HEAD
const disputeSchema = z
  .object({
    listing_id: UUID_SCHEMA,
=======
    // Kurangi stok di food_listings
    const { error: uErr } = await admin
      .from("food_listings")
      .update({ remaining_portions: newRemaining, status: newStatus })
      .eq("id", listing.id);

    if (uErr) return { success: false, error: "Gagal memperbarui sisa porsi di database." };

    const claimantId = user?.id || DEFAULT_BENEFICIARY_ID;
    
    // Periksa apakah claimant sudah pernah klaim listing ini (constraint one_claim_per_listing_per_claimant)
    const { data: existingClaim } = await admin
      .from("food_claims")
      .select("id, portions_claimed, qr_token")
      .eq("listing_id", listing.id)
      .eq("claimant_id", claimantId)
      .maybeSingle();

    if (existingClaim) {
      // Tambahkan porsi pada tiket klaim yang sudah ada
      const newClaimPortions = Number(existingClaim.portions_claimed) + p.data.portions;
      const { data: updatedClaim, error: upErr } = await admin
        .from("food_claims")
        .update({ portions_claimed: newClaimPortions })
        .eq("id", existingClaim.id)
        .select("id, qr_token, portions_claimed")
        .single();

      if (!upErr && updatedClaim) {
        return {
          success: true,
          data: {
            id: updatedClaim.id,
            qr_token: updatedClaim.qr_token,
            portions_claimed: updatedClaim.portions_claimed,
          },
        };
      }
    }

    const qrToken = crypto.randomBytes(16).toString("hex");
    const todayStr = new Date().toISOString().split("T")[0];

    const { data: claimRow, error: cErr } = await admin
      .from("food_claims")
      .insert({
        listing_id: listing.id,
        claimant_id: claimantId,
        portions_claimed: p.data.portions,
        qr_token: qrToken,
        is_collected: false,
        collected_at: null,
        meal_date: todayStr,
        meal_window: "lunch",
      })
      .select("id, qr_token, portions_claimed")
      .single();

    if (cErr || !claimRow) {
      console.error("[claimFoodToken cErr]:", cErr);
      return { success: false, error: cErr?.message || "Gagal menyimpan tiket klaim." };
    }

    return {
      success: true,
      data: {
        id: claimRow.id,
        qr_token: claimRow.qr_token,
        portions_claimed: claimRow.portions_claimed,
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Terjadi kesalahan saat memproses klaim." };
  }
}

/**
 * Server Action: Konfirmasi Serah Terima Pangan (Donatur Memindai QR Penerima)
 */
export async function collectFoodClaim(
  input: unknown
): Promise<Result<{ id: string; collected_at: string; already_collected: boolean }>> {
  const p = z.object({ token: z.string().min(1) }).strict().safeParse(input);
  if (!p.success) return { success: false, error: "Format token tidak valid." };

  try {
    const admin = createAdminClient();
    const { data: claim, error: fErr } = await admin
      .from("food_claims")
      .select("id, is_collected, collected_at, listing_id")
      .eq("qr_token", p.data.token)
      .single();

    if (fErr || !claim) {
      return { success: false, error: "Token serah terima tidak ditemukan dalam sistem." };
    }

    if (claim.is_collected) {
      return {
        success: true,
        data: {
          id: claim.id,
          collected_at: claim.collected_at || new Date().toISOString(),
          already_collected: true,
        },
      };
    }

    const nowIso = new Date().toISOString();
    const { data: updated, error: uErr } = await admin
      .from("food_claims")
      .update({ is_collected: true, collected_at: nowIso })
      .eq("id", claim.id)
      .select("id, collected_at")
      .single();

    if (uErr || !updated) {
      return { success: false, error: "Gagal memutakhirkan status serah terima." };
    }

    return {
      success: true,
      data: {
        id: updated.id,
        collected_at: updated.collected_at,
        already_collected: false,
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal memproses verifikasi serah terima." };
  }
}

const wasteSchema = z.object({
  weight_kg: z.number().finite().positive().max(999999.99).multipleOf(0.01),
  target_category: z.enum(["bsf_maggot", "poultry_fish", "compost_biogas"]),
  image_url: z.string().optional().nullable(),
  billing_mode: z.enum(["prepaid", "monthly_invoice"]).default("prepaid"),
}).strict();

/**
 * Server Action: Pendaftaran Batch Limbah Organik Donatur
 */
export async function createWasteBatch(
  input: unknown
): Promise<Result<{ id: string; qr_handover_token: string; rate_per_kg: number }>> {
  const p = wasteSchema.safeParse(input);
  if (!p.success) return { success: false, error: "Data limbah tidak valid." };

  try {
    const admin = createAdminClient();
    const client = await createClient();
    const {
      data: { user },
    } = await client.auth.getUser();

    const donorId = user?.id || "6dee3ea9-691a-49b3-8c7f-9b8feab49a02";
    const qrToken = crypto.randomBytes(16).toString("hex");

    const rawImageUrl = p.data.image_url?.trim();
    const imageUrlToSave = rawImageUrl && rawImageUrl.length > 0 ? rawImageUrl : null;

    const { data, error } = await admin
      .from("waste_batches")
      .insert({
        donor_id: donorId,
        weight_kg: p.data.weight_kg,
        target_category: p.data.target_category,
        image_url: imageUrlToSave,
        billing_mode: p.data.billing_mode,
        rate_per_kg: 600,
        qr_handover_token: qrToken,
        is_collected: false,
      })
      .select("id, qr_handover_token, rate_per_kg")
      .single();

    if (error || !data) {
      return { success: false, error: "Gagal mendaftarkan batch limbah." };
    }

    return {
      success: true,
      data: {
        id: data.id,
        qr_handover_token: data.qr_handover_token,
        rate_per_kg: Number(data.rate_per_kg),
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal menyimpan data limbah." };
  }
}

/**
 * Server Action: Serah Terima Pengangkutan Limbah oleh Armada Pengolah
 */
export async function processWasteHandover(
  input: unknown
): Promise<Result<{ id: string; processor_credit: number; donor_charge: number; subsidy_amount: number; already_processed: boolean }>> {
  const p = z.object({ token: z.string().min(1) }).strict().safeParse(input);
  if (!p.success) return { success: false, error: "Token handover tidak valid." };

  try {
    const admin = createAdminClient();
    const { data: batch, error: fErr } = await admin
      .from("waste_batches")
      .select("*")
      .eq("qr_handover_token", p.data.token)
      .single();

    if (fErr || !batch) {
      return { success: false, error: "Token limbah tidak ditemukan." };
    }

    if (batch.is_collected) {
      return {
        success: true,
        data: {
          id: batch.id,
          processor_credit: Number(batch.processor_credit || 0),
          donor_charge: Number(batch.donor_charge || 0),
          subsidy_amount: Number(batch.subsidy_amount || 0),
          already_processed: true,
        },
      };
    }

    const gross = Math.round(Number(batch.weight_kg) * 600 * 100) / 100;
    const subsidy = Math.min(12000, gross);
    const charge = gross - subsidy;
    const nowIso = new Date().toISOString();

    const { data: updated, error: uErr } = await admin
      .from("waste_batches")
      .update({
        processor_id: DEFAULT_PROCESSOR_ID,
        is_collected: true,
        collected_at: nowIso,
        paid_at: nowIso,
        rate_per_kg: 600,
        subsidy_amount: subsidy,
        donor_charge: charge,
        processor_credit: gross,
      })
      .eq("id", batch.id)
      .select()
      .single();

    if (uErr || !updated) {
      return { success: false, error: "Gagal mencatat penyelesaian handover di ledger." };
    }

    // Catat mutasi finansial
    await admin.from("financial_transactions").insert([
      {
        user_id: batch.donor_id,
        waste_batch_id: batch.id,
        amount: -charge,
        type: "prepaid_deposit",
        purpose: "donor_charge",
        description: `Biaya pengolahan limbah organik ${batch.weight_kg} kg`,
      },
      {
        user_id: DEFAULT_PROCESSOR_ID,
        waste_batch_id: batch.id,
        amount: gross,
        type: "prepaid_deposit",
        purpose: "processor_incentive",
        description: `Insentif biokonversi limbah ${batch.weight_kg} kg @ Rp600/kg`,
      },
    ]);

    return {
      success: true,
      data: {
        id: updated.id,
        processor_credit: gross,
        donor_charge: charge,
        subsidy_amount: subsidy,
        already_processed: false,
      },
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Gagal memproses handover limbah." };
  }
}

/**
 * Server Action: Laporan Sengketa Pangan Basi / Tidak Layak Konsumsi
 */
export async function submitDisputeStrike(
  input: unknown
): Promise<Result<{ id: string; response_deadline: string }>> {
  const p = z.object({
    listing_id: z.string().uuid(),
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
    reason: z.string().trim().min(1).max(2000),
  })
  .strict();

const claimResultSchema = z
  .object({
    id: UUID_SCHEMA,
    qr_token: TOKEN_32_SCHEMA,
    portions_claimed: z.number().int().finite().positive().max(2147483647),
  })
  .strict();

const collectResultSchema = z
  .object({
    id: UUID_SCHEMA,
    collected_at: TIMESTAMP_SCHEMA,
    already_collected: z.boolean(),
  })
  .strict();

const wasteResultSchema = z
  .object({
    id: UUID_SCHEMA,
    qr_handover_token: TOKEN_32_SCHEMA,
    rate_per_kg: z.number().finite().nonnegative(),
  })
  .strict();

const handoverResultSchema = z
  .object({
    id: UUID_SCHEMA,
    processor_credit: z.number().finite().nonnegative(),
    donor_charge: z.number().finite().nonnegative(),
    subsidy_amount: z.number().finite().nonnegative(),
    already_processed: z.boolean(),
  })
  .strict();

const disputeResultSchema = z
  .object({
    id: UUID_SCHEMA,
    response_deadline: TIMESTAMP_SCHEMA,
  })
  .strict();

function validateRpcPayload<T>(
  schema: z.ZodType<T>,
  payload: unknown,
): { ok: true; data: T } | { ok: false } {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) return { ok: false };
  return { ok: true, data: parsed.data };
}

async function getAuthenticatedClient(): Promise<
  { ok: true; client: Awaited<ReturnType<typeof createClient>> } | { ok: false }
> {
  try {
    const client = await createClient();
    const { data, error } = await client.auth.getUser();
    if (error || !data?.user) return { ok: false };
    return { ok: true, client };
  } catch {
    return { ok: false };
  }
}

export async function claimFoodToken(
  input: unknown,
): Promise<Result<{ id: string; qr_token: string; portions_claimed: number }>> {
  const parsedInput = claimSchema.safeParse(input);
  if (!parsedInput.success) {
    return { success: false, error: VALIDATION_ERROR_CLAIM };
  }

  const auth = await getAuthenticatedClient();
  if (!auth.ok) {
    return { success: false, error: AUTH_ERROR };
  }

  let payload: unknown;
  try {
    const { data, error } = await auth.client.rpc("claim_food_token", {
      p_listing_id: parsedInput.data.listing_id,
      p_portions: parsedInput.data.portions,
    });
    if (error || data === null || data === undefined) {
      return { success: false, error: DISPATCH_ERROR };
    }
    payload = data;
  } catch {
    return { success: false, error: DISPATCH_ERROR };
  }

  const validated = validateRpcPayload(claimResultSchema, payload);
  if (!validated.ok) {
    return { success: false, error: DISPATCH_ERROR };
  }

  return { success: true, data: validated.data };
}

export async function collectFoodClaim(
  input: unknown,
): Promise<Result<{ id: string; collected_at: string; already_collected: boolean }>> {
  const parsedInput = collectSchema.safeParse(input);
  if (!parsedInput.success) {
    return { success: false, error: VALIDATION_ERROR_TOKEN };
  }

  const auth = await getAuthenticatedClient();
  if (!auth.ok) {
    return { success: false, error: AUTH_ERROR };
  }

  let payload: unknown;
  try {
    const { data, error } = await auth.client.rpc("collect_food_claim", {
      p_token: parsedInput.data.token,
    });
    if (error || data === null || data === undefined) {
      return { success: false, error: DISPATCH_ERROR };
    }
    payload = data;
  } catch {
    return { success: false, error: DISPATCH_ERROR };
  }

  const validated = validateRpcPayload(collectResultSchema, payload);
  if (!validated.ok) {
    return { success: false, error: DISPATCH_ERROR };
  }

  return { success: true, data: validated.data };
}

export async function createWasteBatch(
  input: unknown,
): Promise<Result<{ id: string; qr_handover_token: string; rate_per_kg: number }>> {
  const parsedInput = wasteSchema.safeParse(input);
  if (!parsedInput.success) {
    return { success: false, error: VALIDATION_ERROR_WASTE };
  }

  const auth = await getAuthenticatedClient();
  if (!auth.ok) {
    return { success: false, error: AUTH_ERROR };
  }

  let payload: unknown;
  try {
    const { data, error } = await auth.client.rpc("create_waste_batch", {
      p_weight_kg: parsedInput.data.weight_kg,
      p_target_category: parsedInput.data.target_category,
      p_image_url: parsedInput.data.image_url ?? null,
      p_billing_mode: parsedInput.data.billing_mode,
    });
    if (error || data === null || data === undefined) {
      return { success: false, error: DISPATCH_ERROR };
    }
    payload = data;
  } catch {
    return { success: false, error: DISPATCH_ERROR };
  }

  const validated = validateRpcPayload(wasteResultSchema, payload);
  if (!validated.ok) {
    return { success: false, error: DISPATCH_ERROR };
  }

  return { success: true, data: validated.data };
}

export async function processWasteHandover(
  input: unknown,
): Promise<
  Result<{
    id: string;
    processor_credit: number;
    donor_charge: number;
    subsidy_amount: number;
    already_processed: boolean;
  }>
> {
  const parsedInput = handoverSchema.safeParse(input);
  if (!parsedInput.success) {
    return { success: false, error: VALIDATION_ERROR_TOKEN };
  }

  const auth = await getAuthenticatedClient();
  if (!auth.ok) {
    return { success: false, error: AUTH_ERROR };
  }

  let payload: unknown;
  try {
    const { data, error } = await auth.client.rpc("process_waste_handover", {
      p_token: parsedInput.data.token,
    });
    if (error || data === null || data === undefined) {
      return { success: false, error: DISPATCH_ERROR };
    }
    payload = data;
  } catch {
    return { success: false, error: DISPATCH_ERROR };
  }

  const validated = validateRpcPayload(handoverResultSchema, payload);
  if (!validated.ok) {
    return { success: false, error: DISPATCH_ERROR };
  }

  return { success: true, data: validated.data };
}

export async function submitDisputeStrike(
  input: unknown,
): Promise<Result<{ id: string; response_deadline: string }>> {
  const parsedInput = disputeSchema.safeParse(input);
  if (!parsedInput.success) {
    return { success: false, error: VALIDATION_ERROR_DISPUTE };
  }

  const auth = await getAuthenticatedClient();
  if (!auth.ok) {
    return { success: false, error: AUTH_ERROR };
  }

  let payload: unknown;
  try {
    const { data, error } = await auth.client.rpc("submit_dispute_strike", {
      p_listing_id: parsedInput.data.listing_id,
      p_reason: parsedInput.data.reason,
    });
    if (error || data === null || data === undefined) {
      return { success: false, error: DISPATCH_ERROR };
    }
    payload = data;
  } catch {
    return { success: false, error: DISPATCH_ERROR };
  }

  const validated = validateRpcPayload(disputeResultSchema, payload);
  if (!validated.ok) {
    return { success: false, error: DISPATCH_ERROR };
  }

  return { success: true, data: validated.data };
}
