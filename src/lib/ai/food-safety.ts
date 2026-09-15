import { analyzeFoodPhoto, type FoodScanResult } from "./food-scan";
import { calculateFoodExpiry, type ExpiryCalculationResult } from "../rules/expiry";

const STORAGE_MAP = {
  suhu_ruang: "room_temperature",
  didinginkan: "refrigerated",
  dibekukan: "sealed_container",
} as const;

type SafetyResult = {
  scan: FoodScanResult;
  expiry: ExpiryCalculationResult;
};

/** AI identifies; deterministic engine decides safe_until. */
export async function analyzeFoodSafety(imageBase64: string, mimeType: string, cookedAt: Date | string): Promise<SafetyResult> {
  const scan = await analyzeFoodPhoto(imageBase64, mimeType);
  const expiry = calculateFoodExpiry({
    cookedAt,
    storageMethod: STORAGE_MAP[scan.storage_method],
    riskyIngredients: scan.risky_ingredients,
  });
  return { scan, expiry };
}

export { STORAGE_MAP };
