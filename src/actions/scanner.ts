"use server";

import { z } from "zod";
import {
  scanFoodVisual,
  scanWasteVisual,
  DEFAULT_FOOD_FALLBACK_FIXTURE,
  DEFAULT_WASTE_FALLBACK_FIXTURE,
  type FoodScanResult,
  type WasteInspectionResult,
} from "@/lib/harness/ai-guard";
import { withFallbackHarness } from "@/lib/harness/resilience";

const scanInputSchema = z.object({
  imageBase64: z.string().min(1, "Data gambar base64 wajib disediakan"),
}).strict();

export type ScannerActionResult<T> = {
  success: boolean;
  data?: T;
  isFallback?: boolean;
  error?: string;
};

/**
 * Server Action: Analisis Visual Makanan Donatur via Gemini VLM
 * Dilengkapi dengan Harness Resilience (timeout 3000ms -> mock fixture)
 */
export async function scanFoodPhotoAction(
  input: unknown
): Promise<ScannerActionResult<FoodScanResult>> {
  const parsed = scanInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Input gambar tidak valid.",
    };
  }

  try {
    const harnessResult = await withFallbackHarness(
      () => scanFoodVisual(parsed.data.imageBase64),
      DEFAULT_FOOD_FALLBACK_FIXTURE,
      25000
    );

    return {
      success: true,
      data: harnessResult.data,
      isFallback: harnessResult.isFallback,
      error: harnessResult.isFallback ? "Mode Offline / Simulasi Aktif" : undefined,
    };
  } catch (error: any) {
    return {
      success: true,
      data: DEFAULT_FOOD_FALLBACK_FIXTURE,
      isFallback: true,
      error: error?.message || "Fallback simulator aktif.",
    };
  }
}

/**
 * Server Action: Inspeksi Visual Limbah Organik via Gemini VLM
 * Memeriksa kontaminan anorganik & merekomendasikan target pengolah optimal
 */
export async function scanWasteInspectionAction(
  input: unknown
): Promise<ScannerActionResult<WasteInspectionResult>> {
  const parsed = scanInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Input gambar tidak valid.",
    };
  }

  try {
    const harnessResult = await withFallbackHarness(
      () => scanWasteVisual(parsed.data.imageBase64),
      DEFAULT_WASTE_FALLBACK_FIXTURE,
      25000
    );

    return {
      success: true,
      data: harnessResult.data,
      isFallback: harnessResult.isFallback,
      error: harnessResult.isFallback ? "Mode Offline / Simulasi Aktif" : undefined,
    };
  } catch (error: any) {
    return {
      success: true,
      data: DEFAULT_WASTE_FALLBACK_FIXTURE,
      isFallback: true,
      error: error?.message || "Fallback simulator aktif.",
    };
  }
}
