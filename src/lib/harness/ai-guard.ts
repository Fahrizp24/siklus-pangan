import { z } from "zod";
import { GoogleGenAI, Type } from "@google/genai";

export const FoodScanResultSchema = z.object({
  detectedMenu: z.string().trim().min(1).max(200),
  estimatedPortions: z.number().int().min(1).max(10000).default(1),
  riskyIngredients: z.array(z.string().trim().min(1)).max(30),
  dietaryClassification: z.array(z.string().trim().min(1)),
  suggestedStorageHours: z.number().finite().min(0.5).max(168),
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

const foodGenaiSchema = {
  type: Type.OBJECT,
  properties: {
    detectedMenu: { type: Type.STRING },
    estimatedPortions: { type: Type.INTEGER },
    riskyIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
    dietaryClassification: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
        enum: ["halal", "vegetarian", "contains_gluten", "contains_nuts", "seafood"],
      },
    },
    suggestedStorageHours: { type: Type.NUMBER },
    handlingRecommendations: { type: Type.STRING },
  },
  required: [
    "detectedMenu",
    "estimatedPortions",
    "riskyIngredients",
    "dietaryClassification",
    "suggestedStorageHours",
    "handlingRecommendations",
  ],
};

const wasteGenaiSchema = {
  type: Type.OBJECT,
  properties: {
    isOrganicPure: { type: Type.BOOLEAN },
    detectedContaminants: { type: Type.ARRAY, items: { type: Type.STRING } },
    optimalProcessor: {
      type: Type.STRING,
      enum: ["bsf_maggot", "poultry_fish", "compost_biogas"],
    },
    nutrientNotes: { type: Type.STRING },
  },
  required: [
    "isOrganicPure",
    "detectedContaminants",
    "optimalProcessor",
    "nutrientNotes",
  ],
};

// Scan makanan via Gemini VLM, dipaksa mengikuti FoodScanResultSchema.
// Server-only: memakai GEMINI_API_KEY, jangan diimpor dari client component.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export const DEFAULT_FOOD_FALLBACK_FIXTURE: FoodScanResult = {
  detectedMenu: "Gourmet Bento Box: Ayam Fillet Teriyaki & Tamagoyaki",
  estimatedPortions: 35,
  riskyIngredients: ["santan", "telur", "kedelai"],
  dietaryClassification: ["halal"],
  suggestedStorageHours: 2,
  handlingRecommendations: "Simpan dalam chiller pendingin food-grade suhu 4°C atau panaskan kembali pada suhu 70°C sebelum disajikan.",
};

export const DEFAULT_WASTE_FALLBACK_FIXTURE: WasteInspectionResult = {
  isOrganicPure: true,
  detectedContaminants: [],
  optimalProcessor: "bsf_maggot",
  nutrientNotes: "Substrat sisa makanan dapur kaya protein dan karbohidrat, optimal untuk pakan larva Black Soldier Fly (BSF Grade A).",
};

export async function scanFoodVisual(imageBase64: string): Promise<FoodScanResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[VLM Gemini] GEMINI_API_KEY not found in environment, using fallback fixture.");
    return DEFAULT_FOOD_FALLBACK_FIXTURE;
  }
  let mimeType = "image/jpeg";
  if (imageBase64.startsWith("data:image/png")) mimeType = "image/png";
  else if (imageBase64.startsWith("data:image/webp")) mimeType = "image/webp";

  const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
  const ai = new GoogleGenAI({ apiKey });
  
  console.log(`[VLM Gemini] Sending image to model ${GEMINI_MODEL}... (payload size: ${cleanBase64.length} chars)`);
  const startTime = Date.now();
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      { inlineData: { mimeType, data: cleanBase64 } },
      { text: "Analisis makanan ini untuk program penyelamatan surplus food. Deteksi nama hidangan, estimasi porsi (minimal 1), bahan rentan basi (seperti santan/susu/telur), dan klasifikasi diet (halal/vegetarian)." },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: foodGenaiSchema as any,
    },
  });

  const duration = Date.now() - startTime;
  console.log(`[VLM Gemini] 200 OK received in ${duration}ms!`);
  
  const parsed = JSON.parse(response.text!);
  if (!parsed.estimatedPortions || parsed.estimatedPortions <= 0) parsed.estimatedPortions = 1;
  if (!parsed.suggestedStorageHours || parsed.suggestedStorageHours < 1) parsed.suggestedStorageHours = 2;
  const validated = FoodScanResultSchema.parse(parsed);
  console.log(`[VLM Gemini] Food detected: "${validated.detectedMenu}" (${validated.estimatedPortions} porsi)`);
  return validated;
}

export async function scanWasteVisual(imageBase64: string): Promise<WasteInspectionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[VLM Gemini] GEMINI_API_KEY not found in environment, using fallback fixture.");
    return DEFAULT_WASTE_FALLBACK_FIXTURE;
  }
  let mimeType = "image/jpeg";
  if (imageBase64.startsWith("data:image/png")) mimeType = "image/png";
  else if (imageBase64.startsWith("data:image/webp")) mimeType = "image/webp";

  const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
  const ai = new GoogleGenAI({ apiKey });
  
  console.log(`[VLM Gemini] Sending waste image to model ${GEMINI_MODEL}...`);
  const startTime = Date.now();
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      { inlineData: { mimeType, data: cleanBase64 } },
      { text: "Analisis wadah limbah organik ini untuk biokonversi non-vendor. Periksa apakah murni organik atau ada kontaminan anorganik seperti plastik/kawat/styrofoam, dan tentukan alokasi biokonversi optimal (bsf_maggot, poultry_fish, compost_biogas)." },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: wasteGenaiSchema as any,
    },
  });
  
  const duration = Date.now() - startTime;
  console.log(`[VLM Gemini] Waste VLM 200 OK received in ${duration}ms!`);
  const validated = WasteInspectionSchema.parse(JSON.parse(response.text!));
  return validated;
}




