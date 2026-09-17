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

const disputeSchema = z
  .object({
    listing_id: UUID_SCHEMA,
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
