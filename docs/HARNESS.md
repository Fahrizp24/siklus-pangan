# Harness Operational Architecture & Governance Guide: SiklusPangan

**Versi Dokumen:** 1.0.0  
**Tujuan:** Panduan Operasional Vibe Coding Harness, Guardrails, & Verifikasi Penjurian TCC 2026 UTM  

---

## 1. Definisi & Komponen Harness Architecture

Sistem **Harness** pada proyek SiklusPangan adalah perancah rekayasa (*engineering scaffolding*) yang membungkus dan mengontrol setiap proses pengembangan perangkat lunak berbasis AI (*vibe coding*). Harness ini menjamin bahwa seluruh kode yang dihasilkan memenuhi standar kualitas tinggi, bebas regresi, dan aman digunakan.

```
+-----------------------------------------------------------------------+
|                       HARNESS SCAFFOLD SYSTEM                         |
+-----------------------------------------------------------------------+
|  Tier 1: Specification Harness    -> Rules Engine & Architecture Scopes|
|  Tier 2: AI Safety Harness        -> Zod Schemas & Response Guards    |
|  Tier 3: Automated Verification   -> Type Checks & Build Pipelines    |
|  Tier 4: Offline Resilience       -> Mock Storage & Timeout Fixtures  |
+-----------------------------------------------------------------------+
```

---

## 2. Rincian 4 Tier Harness System

### Tier 1: Specification & Rules Harness (`AGENTS.md`)
Menjadi panduan absolut bagi pengembang AI maupun manusia. Diletakkan pada direktori utama proyek (`AGENTS.md`). Setiap perubahan kode wajib mematuhi aturan berikut:
* **Framework:** Next.js 15 (App Router, TypeScript).
* **Data Mutations:** Seluruh mutasi data wajib menggunakan Next.js *Server Actions* yang divalidasi oleh Zod Schema.
* **Database Access:** Menggunakan Supabase Client dengan penegakan Row Level Security (RLS) di tingkat database.
* **Deterministic Rules:** Dilarang mengandalkan LLM murni untuk keputusan berisiko keselamatan (seperti jam basi makanan). Kalkulasi jam basi **wajib** diproses oleh *Deterministic Expiry Rules Engine*.

---

### Tier 2: AI Output Safety Harness (Structured Zod Output)
Setiap interaksi dengan Google Gemini 2.0 Flash VLM dipasang pengawal skema terstruktur (*Structured Output Guard*). 

#### Implementasi Kode (`src/lib/harness/ai-guard.ts`):
```typescript
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

// Initialization SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Schema Guard untuk Pemindai Makanan
export const FoodScanResultSchema = z.object({
  detectedMenu: z.string(),
  estimatedPortions: z.number().int().positive(),
  riskyIngredients: z.array(z.string()),
  dietaryClassification: z.array(z.enum(["halal", "vegetarian", "contains_gluten", "contains_nuts", "seafood"])),
  suggestedStorageHours: z.number(),
  handlingRecommendations: z.string(),
});

export async function scanFoodVisual(imageBase64: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
      { text: "Analisis makanan ini untuk program penyelamatan surplus food." }
    ],
    config: {
      responseMimeType: "application/json",
      // Enforce JSON Schema Guard
      responseSchema: FoodScanResultSchema as any,
    }
  });

  // Strict Runtime Parsing via Zod Harness
  const parsed = FoodScanResultSchema.parse(JSON.parse(response.text!));
  return parsed;
}
```

---

### Tier 3: Automated Verification & Build Harness
> [!IMPORTANT]
> **Prosedur Otomatis Mandatory:** Agent WAJIB mengeksekusi perintah verifikasi `npx tsc --noEmit` dan `npm run build` secara otomatis **SETIAP KALI SELESAI** mengedit atau menambahkan fitur/komponen baru, sebelum mengklaim pekerjaan selesai.

Setiap setelah sesi pembuatan atau pengeditan kode oleh AI, Harness mengeksekusi dua perintah verifikasi wajib:

1. **Strict Type Checking:**
   ```bash
   npx tsc --noEmit
   ```
   *Tujuan:* Memastikan tidak ada *type mismatch*, *missing props*, atau variabel undefined.

2. **Production Bundling Test:**
   ```bash
   npm run build
   ```
   *Tujuan:* Memastikan aplikasi dapat dikompilasi ke dalam paket produksi tanpa galat *import* atau *server-client boundary violation*.

---

### Tier 4: Resilience & Offline Demo Fallback Harness
Untuk menjamin keamanan saat presentasi penjurian luring di Universitas Trunojoyo Madura (UTM), Harness menyediakan pengalih otomatis (*automatic failover*) jika koneksi internet terputus.

#### Implementasi Wrapper (`src/lib/harness/resilience.ts`):
```typescript
export async function withFallbackHarness<T>(
  primaryFn: () => Promise<T>,
  fallbackFixture: T,
  timeoutMs = 3000
): Promise<{ data: T; isFallback: boolean }> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Harness Network Timeout")), timeoutMs)
    );

    // Race antara Panggilan API dan Timeout 3000ms
    const result = await Promise.race([primaryFn(), timeoutPromise]);
    return { data: result, isFallback: false };
  } catch (error) {
    console.warn("Harness Resilience Triggered: Switching to Offline Fixture", error);
    return { data: fallbackFixture, isFallback: true };
  }
}
```

---

## 3. Log Prompt Engineering & Transparansi Vibe Coding (Persiapan Tanya Jawab Juri)

Untuk memenuhi regulasi transparansi penggunaan AI pada buku panduan TCC 2026 (poin 12-15):

* **System Prompt Log:** Seluruh instruksi prompt sistem dicatat di `docs/ai-prompts.md`.
* **Manual vs AI Matrix:**
  * *Dihasilkan via AI + Harness:* Layout antarmuka Tailwind CSS, skema validasi Zod dasar, boilerplate server actions.
  * *Ditulis Manual oleh Tim:* Algoritma alokasi massal panti asuhan, rumus deterministik kalkulasi jam basi, rumus kalkulasi reduksi emisi metana/carbon, skema DDL PostgreSQL & aturan RLS Supabase.
