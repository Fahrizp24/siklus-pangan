# Progress & Task Tracking: FAHRI (P1 - Lead Backend & Logic)

**Peran:** Lead Backend, Data Infrastructure, API & Functional UI Logic  
**Proyek:** SiklusPangan — Vibe Code TCC 2026 UTM  
**Git Branch:** `feature/p1-backend-logic`  
**Master Progress:** [PROGRESS.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/PROGRESS.md)  
**Skop Direktori Utama:** `src/lib/supabase/`, `src/lib/rules/`, `src/actions/`, `src/components/scanner/`  

---

## 📊 Ringkasan Progress P1 (Fahri)

```
Progress Fahri: [===>                      ] 15%
- Foundation & Spec Readiness: 100% [DONE]
- Phase 1 (Database & Auth Setup): 0% [READY TO START]
- Phase 2 (AI Gemini SDK & Rules): 0% [TODO]
- Phase 3 (Server Actions Mutasi): 0% [TODO]
- Phase 4 (Functional UI Camera/QR):0% [TODO]
- Phase 5 (Harness Verification): 0% [TODO]
```

---

## 📋 Checklist Tugas, Deliverables & Syarat Ketergantungan (Prerequisites)

### 🗄️ Phase 1: Database Setup & Otentikasi Supabase
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** Berkas DDL di [PRD.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/PRD.md#5-skema-basis-data-relasional-postgresql-ddl--rls).  
> - **Status Kerja:** 🟢 **Bisa langsung dikerjakan mandiri** (Paralel dengan Rizal Phase 1).

- [x] **FHR-01 (Spec):** Meninjau skema DDL PostgreSQL & aturan RLS pada [PRD.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/PRD.md#5-skema-basis-data-relasional-postgresql-ddl--rls).
- [ ] **FHR-02:** Menjalankan skema DDL di dashboard Supabase (Tabel: `profiles`, `food_listings`, `food_claims`, `strike_disputes`, `waste_batches`, `financial_transactions`).
- [ ] **FHR-03:** Mengaktifkan dan menguji Row Level Security (RLS) policies untuk semua tabel.
- [ ] **FHR-04:** Membuat utilitas Supabase Client (`src/lib/supabase/client.ts` & `src/lib/supabase/server.ts`).
- [ ] **FHR-05:** Setup Supabase Auth Magic Link (Passwordless login & role dispatcher).

---

### 🤖 Phase 2: Integrasi AI Gemini VLM & Deterministic Rules Engine
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** **Fahri Phase 1** (Supabase Client `FHR-04` selesai).  
> - **Dibutuhkan oleh:** **Rizal Phase 2** (Antarmuka Radar UI membutuhkan Zod Schema & Expiry function Fahri).  
> - **Status Kerja:** 🟡 **Menunggu Fahri Phase 1 selesai**.

- [ ] **FHR-06:** Mengonfigurasi `@google/genai` SDK dengan API Key Gemini 2.0 Flash (`src/lib/ai/gemini.ts`).
- [ ] **FHR-07:** Implementasi Zod Schema Guard (`FoodScanResultSchema` & `WasteInspectionSchema`).
- [ ] **FHR-08:** Mengembangkan *Deterministic Expiry Rules Engine* (`src/lib/rules/expiry.ts`):
  - Kategori Kering: max 4 jam suhu ruang.
  - Kategori Wet/Santan/Susu: max 2 jam suhu ruang.
- [ ] **FHR-09:** Mengembangkan *Orphanage Threshold Quota Guard* (`src/lib/rules/quota.ts`).

---

### ⚡ Phase 3: Server Actions Next.js (Mutasi Data)
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** **Fahri Phase 2** (Rules Engine `FHR-08` & Zod Schema `FHR-07` selesai).  
> - **Dibutuhkan oleh:** **Rizal Phase 3 & 4** (UI Form Biokonversi & ESG Dashboard butuh Server Actions Fahri).  
> - **Status Kerja:** 🟡 **Menunggu Fahri Phase 2 selesai**.

- [ ] **FHR-10:** Server Action `createFoodListing()` — penambahan surplus food + kalkulasi expiry.
- [ ] **FHR-11:** Server Action `claimFoodToken()` — pembuatan klaim token QR + verifikasi kuota per akun.
- [ ] **FHR-12:** Server Action `createWasteBatch()` — pendaftaran limbah basi & *reverse tipping fee*.
- [ ] **FHR-13:** Server Action `processWasteHandover()` — pemotongan saldo donor & penambahan kredit insentif mitra.
- [ ] **FHR-14:** Server Action `submitDisputeStrike()` — penanganan sengketa makanan basi $1 \times 24\text{ jam}$.

---

### 📸 Phase 4: Komponen UI Fungsional (Kamera VLM & Pemindai QR)
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** **Fahri Phase 2** (Gemini SDK `FHR-06`) + **Rizal Phase 1** (Design System `RZL-02` selesai agar style kamera cocok dengan tema UI).  
> - **Status Kerja:** 🟠 **Menunggu Rizal Phase 1 (Design System) selesai**.

- [ ] **FHR-15:** Komponen UI Pemindai Kamera Makanan VLM (`src/components/scanner/food-vlm-scanner.tsx`).
- [ ] **FHR-16:** Komponen UI Pemindai Kamera Inspeksi Limbah VLM (`src/components/scanner/waste-vlm-scanner.tsx`).
- [ ] **FHR-17:** Komponen UI Pemindai QR Code peramban seluler via `html5-qrcode` (`src/components/scanner/qr-reader.tsx`).
- [ ] **FHR-18:** Logika *Three-Strike Dispute Escalation System* & bukti foto sanggahan donatur.

---

### 🛡️ Phase 5: Verification Harness & Offline Fallback
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** **Seluruh Phase 1–4 Fahri & Rizal selesai di-merge**.  
> - **Status Kerja:** 🔴 **Dikunci sampai seluruh fitur selesai**.

- [ ] **FHR-19:** Membuat utilitas *Resilience Harness* `withFallbackHarness()` dengan batas timeout $3000\text{ ms}$ (`src/lib/harness/resilience.ts`).
- [ ] **FHR-20:** Pengetesan `npx tsc --noEmit` & `npm run build` untuk memastikan 0 error tipe data pada seluruh *actions*.
