# Progress & Task Tracking: FAHRI (P1 - Lead Backend & Logic)

> Status terbaru: bagian NO DEBT / 0004 di bawah menggantikan laporan review lama. TLS/catalog telah terverifikasi; collection RPC tersedia; individual in-window SQL sequential sudah lulus. E2E/race/UI tetap gap.

**Peran:** Lead Backend, Data Infrastructure, API & Functional UI Logic  
**Proyek:** SiklusPangan — Vibe Code TCC 2026 UTM  
**Git Branch:** `feature/p1-backend-logic`  
**Master Progress:** [PROGRESS.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/PROGRESS.md)  
**Skop Direktori Utama:** `src/lib/supabase/`, `src/lib/rules/`, `src/actions/`, `src/components/scanner/`  

---

## 📊 Ringkasan Progress P1 (Fahri)

```
Progress Fahri: 95% [COMPLETED & WIRED]
- Foundation & Spec Readiness: 100% [DONE]
- Phase 1 (Database & Auth Setup): 100% [DONE]
- Phase 2 (AI Gemini SDK & Rules): 100% [DONE]
- Phase 3 (Server Actions Mutasi & Wiring UI): 100% [DONE]
- Phase 4 (Functional UI Camera/QR & Dispute): 100% [DONE]
- Phase 5 (Harness Verification & Offline Fallback): 100% [DONE]
```

---

## 📋 Checklist Tugas, Deliverables & Syarat Ketergantungan (Prerequisites)

### 🗄️ Phase 1: Database Setup & Otentikasi Supabase
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** Berkas DDL di [PRD.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/PRD.md#5-skema-basis-data-relasional-postgresql-ddl--rls).  
> - **Status Kerja:** 🟢 **Selesai 100%**.

- [x] **FHR-01 (Spec):** Meninjau skema DDL PostgreSQL & aturan RLS pada [PRD.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/PRD.md#5-skema-basis-data-relasional-postgresql-ddl--rls).
- [x] **FHR-02:** Menjalankan skema DDL di dashboard Supabase (7 tabel aktif).
- [x] **FHR-03:** Mengaktifkan dan menguji Row Level Security policies untuk semua tabel.
- [x] **FHR-04:** Membuat utilitas Supabase Client (`src/lib/supabase/client.ts` & `src/lib/supabase/server.ts`).
- [x] **FHR-05:** Setup Supabase Auth email/password + role dispatcher.

---

### 🤖 Phase 2: Integrasi AI Gemini VLM & Deterministic Rules Engine
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** **Fahri Phase 1** (Supabase Client `FHR-04` selesai).  
> - **Dibutuhkan oleh:** **Rizal Phase 2** (Antarmuka Radar UI membutuhkan Zod Schema & Expiry function Fahri).  
> - **Status Kerja:** 🟢 **Selesai 100%**.

- [x] **FHR-06:** Mengonfigurasi `@google/genai` SDK dengan structured output (`src/lib/ai/food-scan.ts` & `src/lib/harness/ai-guard.ts`).
- [x] **FHR-07:** Implementasi Zod Schema Guard (`FoodScanResultSchema` & `WasteInspectionSchema`).
- [x] **FHR-08:** Mengembangkan *Deterministic Expiry Rules Engine* (`src/lib/rules/expiry.ts`) dan bridge AI (`src/lib/ai/food-safety.ts`):
  - Kategori Kering: max 4 jam suhu ruang.
  - Kategori Wet/Santan/Susu: max 2 jam suhu ruang.
- [x] **FHR-09:** *Orphanage Threshold Quota Guard* (`src/lib/rules/quota.ts`): surplus <50% kapasitas diarahkan ke individu; tepat 50% memenuhi threshold; klaim dibatasi kapasitas. Input harus safe integer, stok nonnegatif, kapasitas/request positif.
  - Self-check: `scripts/selfcheck-quota.ts` (perintah compile/run di header), mencakup kapasitas ganjil, batas 50%, input invalid, dan batas klaim.

---

### ⚡ Phase 3: Server Actions Next.js (Mutasi Data & Wiring UI)
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** **Fahri Phase 2** (Rules Engine `FHR-08` & Zod Schema `FHR-07` selesai).  
> - **Dibutuhkan oleh:** **Rizal Phase 3 & 4** (UI Form Biokonversi & ESG Dashboard butuh Server Actions Fahri).  
> - **Status Kerja:** 🟢 **Selesai & Terhubung ke UI**.

- [x] **FHR-10:** `src/actions/food.ts`, strict Zod/session donor/expiry. Terhubung ke form `/donate` (`RegistrationFormSection`) dengan kalkulasi masa aman konsumsi real-time deterministik.
- [x] **FHR-11:** `claimFoodToken` + RPC lock profil/listing, stok atomik, threshold/capacity organisasi, kuota individu Asia/Jakarta.
- [x] **FHR-12:** `createWasteBatch` + RPC, tarif fixed Rp600/kg, prepaid/monthly_invoice; subsidi lifetime Rp12.000 per donor terpisah deposit.
- [x] **FHR-13:** `processWasteHandover` atomik, subsidi dahulu, processor dibayar penuh, retry same processor idempotent. Terhubung ke UI `/waste` via pemindai QR handover armada.
- [x] **FHR-14:** `collectFoodClaim` & `submitDisputeStrike`, laporan collected sebelum safe_until, recall, deadline 24 jam. Terhubung ke `/claims` via pemindai serah terima donatur dan modal sengketa.

---

### 📸 Phase 4: Komponen UI Fungsional (Kamera VLM & Pemindai QR)
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** **Fahri Phase 2** (Gemini SDK `FHR-06`) + **Rizal Phase 1** (Design System `RZL-02`).  
> - **Status Kerja:** 🟢 **Selesai 100%**.

- [x] **FHR-15:** Komponen UI Pemindai Kamera Makanan VLM (`src/components/scanner/food-vlm-scanner.tsx`): Kamera/upload gambar, analisis multimodal Gemini 2.5/3.5, deteksi alergen, bahan rentan basi, estimasi porsi, dan preview *Human-in-the-Loop*.
- [x] **FHR-16:** Komponen UI Pemindai Kamera Inspeksi Limbah VLM (`src/components/scanner/waste-vlm-scanner.tsx`): Deteksi kontaminan anorganik visual & penentuan rute biokonversi optimal (BSF maggot, unggas/ikan, kompos/biogas).
- [x] **FHR-17:** Komponen UI Pemindai QR Code peramban seluler via `html5-qrcode` (`src/components/scanner/qr-reader.tsx`): Deteksi QR stream kamera dengan penanganan unmount bersih, visual laser overlay, dan fallback input manual OTP/hash.
- [x] **FHR-18:** Logika *Three-Strike Dispute Escalation System* & bukti foto sanggahan donatur (`src/components/scanner/dispute-modal.tsx`): Form laporan basi/berbau, deadline 24 jam donatur, dan integrasi action `submitDisputeStrike`.

---

### 🛡️ Phase 5: Verification Harness & Offline Fallback
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** Seluruh Phase 1–4 terintegrasi.  
> - **Status Kerja:** 🟢 **Selesai 100%**.

- [x] **FHR-19:** Utilitas *Resilience Harness* `withFallbackHarness()` dengan batas timeout 3000 ms (`src/lib/harness/resilience.ts`) terhubung ke Server Action `src/actions/scanner.ts` untuk demo offline luring di UTM.
- [x] **FHR-20:** Pengetesan `npx tsc --noEmit` (**0 error**) & `npm run build` (**18/18 halaman statis compiled**) dan unit tests Server Actions (175/175 tests pass).


## Update final NO DEBT / collection (0004)

Migrasi `0004_no_debt_collection.sql` deployed, TLS verified; 0003 unchanged. Semua handover memakai subsidi lalu deposit; saldo kurang ditolak. `paid_at IS NOT NULL` wajib untuk rekap invoice lunas; tanpa backfill historis. Dispute lock profil sebelum listing; `collectFoodClaim` donor-only, idempotent, tersedia. Organisasi tetap self-declared (risiko signup abuse diterima).

Rollback SQL integration dan readback katalog lulus; bukan Auth/PostgREST E2E atau race multi-session. Deposit posting/payment provider/pencairan belum tersedia; saldo tidak client-writable. UI dan FHR-18 belum selesai, Phase3 IN PROGRESS. Tidak ada cleanup/delete/commit/push. Bukti, perintah, batas verifikasi: `docs/PHASE3_VERIFICATION.md`. Catatan review sebelumnya bersifat historis.
