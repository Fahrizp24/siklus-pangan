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

## 4. Phase3 review — status IN PROGRESS

### Perintah lokal tanpa database
```bash
node scripts/test-create-food-listing.cjs
node scripts/test-phase3-local.cjs
node scripts/test-phase3-edge-cases.cjs
npx --no-install tsc scripts/selfcheck-quota.ts --outDir .next/quota-check --module commonjs --target es2020 --skipLibCheck
node .next/quota-check/scripts/selfcheck-quota.js
npx tsc --noEmit
npm run build
```

Local action tests: real TypeScript actions, transport Supabase mock; bukan bukti RLS/transaksi DB. Quota self-check pure rules lulus. Regression harness pertama gagal `live harness must never delete fixtures`; setelah kode cleanup dihapus lulus. Live harness sekarang memerlukan `PHASE3_ALLOW_FIXTURE_WRITES=1` setelah izin eksplisit, fixture selalu dipertahankan. Jangan menjalankannya pada review read-only ini.

### Verifikasi read-only — riwayat kendala, sudah teratasi

Catatan kegagalan koneksi di bawah adalah hasil review awal, bukan blocker saat ini. TLS kemudian pulih dengan CA resmi Supabase; katalog 0003 dan uji individu in-window dalam transaksi ROLLBACK terverifikasi. Bukti lanjutan: `PHASE3_VERIFICATION.md`; status 0004 dicatat pada bagian NO DEBT di bawah.

`node scripts/verify-phase3-readonly.mjs` memakai `BEGIN READ ONLY`, memeriksa empat RPC/grants, tujuh tabel RLS, fixture IDs dan ledger. Hasil review: exit 1, `No direct/pooler Postgres connection succeeded; set SUPABASE_DB_HOST to project session pooler.` TLS verification tidak boleh dinonaktifkan; gunakan CA proyek via `SUPABASE_DB_SSL_CA` bila diperlukan. Alternatif SELECT melalui service-role PostgREST berhasil tetapi listing/claim/dua batch/ledger semuanya kosong. Keberadaan migrasi secara independen belum terverifikasi penuh. Tidak ada write/delete/cleanup DB atau push.

### Evidence sesi sebelumnya (bukan rerun review ini)
- Laporan live: real actions + Auth/PostgREST, organisasi stock race, dispute, prepaid/invoice/subsidy, handover retry race, RLS, metadata escalation.
- Listing `2a02ea19-32b6-43ac-b4d2-71c2eeead97b`; claim `cdc6fe4c-5c90-4c88-8a20-911c2c54ad8f`; prepaid `c2d5a6e6-f2ad-4866-8541-dcd101a0b797`; invoice `35566cea-4830-4208-9403-1b220d192cb4`. SELECT review tidak menemukannya; jangan menyatakan cleanup verified.
- Pada sesi awal, individu hanya outside-window rejected. Pengujian berikutnya membuktikan klaim pertama dan penolakan klaim kedua in-window melalui SQL JWT-context dalam transaksi ROLLBACK. Ini belum membuktikan race lintas sesi atau Server Action end-to-end. Collection privileged pada tes awal bukan bukti alur aplikasi.

### Hasil gate lokal review
`npx tsc --noEmit && npm run build`: exit 0. Next.js 15.5.25: `Compiled successfully in 2.6s`, `Generating static pages (17/17)`. Kedua action harness dan quota self-check: exit 0.

### Gate tersisa
- Katalog live sudah terverifikasi; seeded functional RLS menyeluruh masih perlu pengujian berotorisasi.
- Individual in-window dan boundary waktu sudah diuji pada level SQL. Masih terbuka: quota race lintas sesi, authenticated Server Action in-window, serta kelengkapan negative paths live.
- Food collection RPC tersedia pada 0004; wiring UI dan adjudication/bukti/three-strike FHR-18 belum selesai.
- Radar bebas donor_id bukan jaminan foto/teks bebas identitas. Tinjau moderasi sebelum klaim anonimitas penuh.
- Build/typecheck membuktikan kompilasi, bukan seluruh Phase3 selesai. Offline fixtures tidak boleh menyamarkan kegagalan mutasi transaksi sebagai sukses.

## Update final NO DEBT / collection (0004)

Migrasi `0004_no_debt_collection.sql` deployed, TLS verified; 0003 unchanged. Semua handover memakai subsidi lalu deposit; saldo kurang ditolak. `paid_at IS NOT NULL` wajib untuk rekap invoice lunas; tanpa backfill historis. Dispute lock profil sebelum listing; `collectFoodClaim` donor-only, idempotent, tersedia. Organisasi tetap self-declared (risiko signup abuse diterima).

Rollback SQL integration dan readback katalog lulus; bukan Auth/PostgREST E2E atau race multi-session. Deposit posting/payment provider/pencairan belum tersedia; saldo tidak client-writable. UI dan FHR-18 belum selesai, Phase3 IN PROGRESS. Tidak ada cleanup/delete/commit/push. Bukti, perintah, batas verifikasi: `docs/PHASE3_VERIFICATION.md`. Catatan review sebelumnya bersifat historis.
