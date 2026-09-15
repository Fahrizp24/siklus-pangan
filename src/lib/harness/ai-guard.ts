import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

export const FoodScanResultSchema = z.object({
  detectedMenu: z.string().trim().min(1).max(200),
  estimatedPortions: z.number().int().positive(),
  riskyIngredients: z.array(z.string().trim().min(1)).max(30),
  dietaryClassification: z.array(
    z.enum(["halal", "vegetarian", "contains_gluten", "contains_nuts", "seafood"])
  ),
  suggestedStorageHours: z.number().finite().positive().max(24),
  handlingRecommendations: z.string().trim().min(1).max(1000),
});

export const WasteInspectionSchema = z.object({
  isOrganicPure: z.boolean(),
  detectedContaminants: z.array(z.string().trim().min(1)).max(30),
  optimalProcessor: z.enum(["bsf_maggot", "poultry_fish", "compost_biogas"]),
  nutrientNotes: z.string().trim().min(1).max(1000),
});

export type FoodScanResult = z.infer<typeof FoodScanResultSchema>;
export type WasteInspectionResult = z.infer<typeof WasteInspectionSchema>;

// Scan makanan via Gemini VLM, dipaksa mengikuti FoodScanResultSchema.
// Server-only: memakai GEMINI_API_KEY, jangan diimpor dari client component.
export async function scanFoodVisual(imageBase64: string): Promise<FoodScanResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
      { text: "Analisis makanan ini untuk program penyelamatan surplus food." },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: FoodScanResultSchema as unknown as Record<string, unknown>,
    },
  });
  return FoodScanResultSchema.parse(JSON.parse(response.text!));
}

