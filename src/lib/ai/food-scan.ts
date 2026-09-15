import { GoogleGenAI, Type } from "@google/genai";
import { z } from "zod";

// ponatail: one-shot validation; add retry with feedback loop when accuracy matters.
export const FoodScanResultSchema = z.object({
  food_name: z.string().min(1),
  food_category: z.enum(["makanan_utama", "snack", "minuman", "bahan_mentah", "lainnya"]),
  estimated_expiry_hours: z.number().int().min(0).max(168),
  storage_method: z.enum(["suhu_ruang", "didinginkan", "dibekukan"]),
  risky_ingredients: z.array(z.string()),
  is_safe_to_donate: z.boolean(),
  safety_notes: z.string().max(500),
});
export type FoodScanResult = z.infer<typeof FoodScanResultSchema>;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    food_name: { type: Type.STRING },
    food_category: { type: Type.STRING, enum: ["makanan_utama", "snack", "minuman", "bahan_mentah", "lainnya"] },
    estimated_expiry_hours: { type: Type.INTEGER },
    storage_method: { type: Type.STRING, enum: ["suhu_ruang", "didinginkan", "dibekukan"] },
    risky_ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
    is_safe_to_donate: { type: Type.BOOLEAN },
    safety_notes: { type: Type.STRING },
  },
  required: ["food_name", "food_category", "estimated_expiry_hours", "storage_method", "risky_ingredients", "is_safe_to_donate", "safety_notes"],
};

export async function analyzeFoodPhoto(imageBase64: string, mimeType: string): Promise<FoodScanResult> {
  if (!imageBase64) throw new Error("Foto makanan wajib diunggah");

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { mimeType, data: imageBase64 } },
          { text: "Identifikasi makanan pada foto untuk keperluan donasi pangan. Perkirakan jam aman konsumsi tersisa berdasarkan kondisi visual dan metode penyimpanan terlihat." },
        ],
      },
    ],
    config: { responseMimeType: "application/json", responseSchema },
  });

  const raw = response.text ?? "";
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    throw new Error("Format AI tidak valid");
  }
  const result = FoodScanResultSchema.safeParse(parsedJson);
  if (!result.success) throw new Error("Data AI tidak lengkap atau tidak valid");
  return result.data;
}
