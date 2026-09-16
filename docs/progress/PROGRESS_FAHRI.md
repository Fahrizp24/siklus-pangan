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
Progress Fahri: Phase3 IN PROGRESS (persentase total belum dihitung ulang)
- Foundation & Spec Readiness: 100% [DONE]
- Phase 1 (Database & Auth Setup): 100% [DONE]
- Phase 2 (AI Gemini SDK & Rules): 100% [DONE — integrasi klaim menunggu FHR-11]
- Phase 3 (Server Actions Mutasi): [IN PROGRESS — implementasi + verifikasi parsial]
- Phase 4 (Functional UI Camera/QR): 0% [TODO]
- Phase 5 (Harness Verification): 30% [IN PROGRESS]
```

---

## 📋 Checklist Tugas, Deliverables & Syarat Ketergantungan (Prerequisites)

### 🗄️ Phase 1: Database Setup & Otentikasi Supabase
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** Berkas DDL di [PRD.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/PRD.md#5-skema-basis-data-relasional-postgresql-ddl--rls).  
> - **Status Kerja:** 🟢 **Bisa langsung dikerjakan mandiri** (Paralel dengan Rizal Phase 1).

- [x] **FHR-01 (Spec):** Meninjau skema DDL PostgreSQL & aturan RLS pada [PRD.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/PRD.md#5-skema-basis-data-relasional-postgresql-ddl--rls).
- [x] **FHR-02:** Menjalankan skema DDL di dashboard Supabase (6 tabel aktif).
- [x] **FHR-03:** Mengaktifkan dan menguji Row Level Security policies untuk semua tabel.
- [x] **FHR-04:** Membuat utilitas Supabase Client (`src/lib/supabase/client.ts` & `src/lib/supabase/server.ts`).
- [x] **FHR-05:** Setup Supabase Auth email/password + role dispatcher.

---

### 🤖 Phase 2: Integrasi AI Gemini VLM & Deterministic Rules Engine
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** **Fahri Phase 1** (Supabase Client `FHR-04` selesai).  
> - **Dibutuhkan oleh:** **Rizal Phase 2** (Antarmuka Radar UI membutuhkan Zod Schema & Expiry function Fahri).  
> - **Status Kerja:** 🟡 **Menunggu Fahri Phase 1 selesai**.

- [x] **FHR-06:** Mengonfigurasi `@google/genai` SDK dengan structured output (`src/lib/ai/food-scan.ts`).
- [x] **FHR-07:** Implementasi Zod Schema Guard (`FoodScanResultSchema`).
- [x] **FHR-08:** Mengembangkan *Deterministic Expiry Rules Engine* (`src/lib/rules/expiry.ts`) dan bridge AI (`src/lib/ai/food-safety.ts`):
  - Kategori Kering: max 4 jam suhu ruang.
  - Kategori Wet/Santan/Susu: max 2 jam suhu ruang.
- [x] **FHR-09:** *Orphanage Threshold Quota Guard* (`src/lib/rules/quota.ts`): surplus <50% kapasitas diarahkan ke individu; tepat 50% memenuhi threshold; klaim dibatasi kapasitas. Input harus safe integer, stok nonnegatif, kapasitas/request positif.
  - Self-check: `scripts/selfcheck-quota.ts` (perintah compile/run di header), mencakup kapasitas ganjil, batas 50%, input invalid, dan batas klaim.
  - Ini aturan murni, belum mutasi database/rerouting feed otomatis. FHR-11 wajib memverifikasi stok, otorisasi, dan kuota secara atomik.

---

### ⚡ Phase 3: Server Actions Next.js (Mutasi Data)
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** **Fahri Phase 2** (Rules Engine `FHR-08` & Zod Schema `FHR-07` selesai).  
> - **Dibutuhkan oleh:** **Rizal Phase 3 & 4** (UI Form Biokonversi & ESG Dashboard butuh Server Actions Fahri).  
> - **Status Kerja:** 🟡 **IN PROGRESS — backend tersedia, verifikasi live dan wiring belum lengkap**.

- [ ] **FHR-10 (IN PROGRESS):** `src/actions/food.ts`, strict Zod/session donor/expiry. Test lokal real action + mock transport lulus. Sesi sebelumnya melaporkan live insert; review ini tidak dapat menemukan fixture ID tersebut lewat SELECT. Form belum wired; file implementasi/test FHR-10 dipertahankan.
- [ ] **FHR-11 (IN PROGRESS):** `claimFoodToken` + RPC lock profil/listing, stok atomik, threshold/capacity organisasi, kuota individu Asia/Jakarta. Sesi sebelumnya melaporkan stock race berhasil; individu hanya outside-window rejection. Happy path dan race individu dalam jam makan belum terverifikasi live.
- [ ] **FHR-12 (IN PROGRESS):** `createWasteBatch` + RPC, tarif fixed Rp600/kg, prepaid/monthly_invoice; subsidi lifetime Rp12.000 per donor terpisah deposit.
- [ ] **FHR-13 (IN PROGRESS):** handover atomik, subsidi dahulu, processor dibayar penuh, retry same processor idempotent. Sesi sebelumnya melaporkan prepaid/invoice/subsidy/race; fixture/ledger sekarang tidak ditemukan, verifikasi independen masih gap.
- [ ] **FHR-14 (IN PROGRESS):** report hanya collected sebelum safe_until, recall, deadline 24 jam, repeat reporter/listing tidak menduplikasi. Tidak menambah strike otomatis; adjudikasi FHR-18. RPC food collection belum tersedia (test sebelumnya memakai SQL privileged untuk collected).

Review lokal: `scripts/test-phase3-local.cjs` lulus (transport mock); keamanan harness diperbaiki: hapus kode cleanup fixture, live write opt-in, TLS terverifikasi, helper CLI read-only. Tidak menjalankan ulang live writer, tidak mutasi/delete DB, tidak push. `scripts/verify-phase3-readonly.mjs` gagal koneksi PostgreSQL; SELECT service-role PostgREST untuk listing `2a02ea19-32b6-43ac-b4d2-71c2eeead97b`, claim `cdc6fe4c-5c90-4c88-8a20-911c2c54ad8f`, batches `c2d5a6e6-f2ad-4866-8541-dcd101a0b797` / `35566cea-4830-4208-9403-1b220d192cb4` dan ledger terkait: seluruhnya `[]`. Tidak mengklaim cleanup verified. Gate lokal `npx tsc --noEmit && npm run build`: exit 0, Next.js 15.5.25, 17/17 halaman. Action harness dan quota self-check: exit 0. Detail harness dan gaps: `docs/HARNESS.md`. Scope FHR-10–14 milik Fahri; UI Rizal tidak diubah.

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

## Update final NO DEBT / collection (0004)

Migrasi `0004_no_debt_collection.sql` deployed, TLS verified; 0003 unchanged. Semua handover memakai subsidi lalu deposit; saldo kurang ditolak. `paid_at IS NOT NULL` wajib untuk rekap invoice lunas; tanpa backfill historis. Dispute lock profil sebelum listing; `collectFoodClaim` donor-only, idempotent, tersedia. Organisasi tetap self-declared (risiko signup abuse diterima).

Rollback SQL integration dan readback katalog lulus; bukan Auth/PostgREST E2E atau race multi-session. Deposit posting/payment provider/pencairan belum tersedia; saldo tidak client-writable. UI dan FHR-18 belum selesai, Phase3 IN PROGRESS. Tidak ada cleanup/delete/commit/push. Bukti, perintah, batas verifikasi: `docs/PHASE3_VERIFICATION.md`. Catatan review sebelumnya bersifat historis.
