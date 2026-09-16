# Master Progress & Milestone Roadmap: SiklusPangan

**Versi Dokumen:** 3.1.0 (Master Project Tracking & Dependencies)  
**Status Proyek:** Dokumentasi & Harness Siap $\rightarrow$ **Eksekusi Koding Dimulai**  
**Target Event:** Vibe Code Competition - TCC 2026 (Universitas Trunojoyo Madura)  
**Referensi Utama:** [PRD.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/PRD.md), [ARCHITECTURE.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/ARCHITECTURE.md), & [HARNESS.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/HARNESS.md)  

> 📌 **Catatan Pembagian Tim & Berkas Terpisah:**
> - **Fahri (P1 - Backend & Logic Lead):** [PROGRESS_FAHRI.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/docs/progress/PROGRESS_FAHRI.md)
> - **Rizal (P2 - Frontend & UI/UX Lead):** [PROGRESS_RIZAL.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/docs/progress/PROGRESS_RIZAL.md)

---

## 1. Summary Status Total Proyek

```
Progress Master Proyek: [===================> ] 88%
- Milestone 1 (Dokumentasi, Arsitektur, & Harness): 100% [DONE]
- Milestone 2 (Database, BaaS & Security Setup):   100% [DONE]
- Milestone 3 (Modul A - Surplus Food Rescue):     95% [COMPLETED & WIRED]
- Milestone 4 (Modul B - Biokonversi Limbah):      95% [COMPLETED & WIRED]
- Milestone 5 (Modul C - Dashboard, ESG & PDF):    85% [COMPLETED]
- Milestone 6 (Harness Verification & Resilience): 90% [TESTED & VERIFIED]
```


---

## 2. Rincian Milestone Lengkap Proyek & Matriks Syarat Ketergantungan (Prerequisites)

```
+-----------------------------------------------------------------------------------+
|                     MATRIKS KETERGANTUNGAN ALUR KERJA (DEPENDENCY GRAPH)          |
+-----------------------------------------------------------------------------------+
| [Fahri Phase 1: DB DDL & Auth]  <--- PARALEL --->  [Rizal Phase 1: App Shell UI]   |
|               |                                              |                    |
|               v                                              v                    |
| [Fahri Phase 2: Gemini VLM SDK] -----------------> [Rizal Phase 2: Radar Feed UI] |
|               |                                              |                    |
|               v                                              v                    |
| [Fahri Phase 3: Server Actions] -----------------> [Rizal Phase 3: Waste Form UI]  |
|               |                                              |                    |
|               +---------------------------------> [Rizal Phase 4: ESG Dashboard UI]|
|                                                              |                    |
| [Fahri Phase 4: Camera & QR UI] <----------------------------+                    |
|               |                                              |                    |
|               +----------------------+-----------------------+                    |
|                                      |                                            |
|                                      v                                            |
|                  [Milestone 6: Merged Harness Test & Pitch]                       |
+-----------------------------------------------------------------------------------+
```

---

### 📄 Milestone 1: Dokumentasi Spesifikasi & Scaffolding Harness (100% Selesai)
* **Prasyarat:** Tidak ada. (Selesai 100%).
* Output: `PRD.md`, `ARCHITECTURE.md`, `DECISION.md`, `HARNESS.md`, `AGENTS.md`, & `PRD.pdf`.

### 🗄️ Milestone 2: Database Schema, BaaS Setup & Foundation (Ready to Start)
* **Prasyarat:**
  * **Fahri (P1-Phase 1):** Membutuhkan DDL `PRD.md`. 🟢 *Dapat dikerjakan langsung mandiri*.
  * **Rizal (P2-Phase 1):** Membutuhkan `AGENTS.md`. 🟢 *Dapat dikerjakan langsung mandiri*.

### 🍱 Milestone 3: Modul A — Penyelamatan Pangan Berlebih (Surplus Food Rescue)
* **Prasyarat:**
  * **Fahri (P1-Phase 2):** Membutuhkan **Fahri Phase 1** (Supabase Client `FHR-04`).
  * **Rizal (P2-Phase 2):** Membutuhkan **Rizal Phase 1** (App Shell Layout) + **Fahri Phase 2** (Zod Schemas & Expiry function Fahri). 🟡 *Dapat buat UI Mockup dulu lalu connect ke Server Actions Fahri*.

### 🔄 Milestone 4: Modul B — Biokonversi Limbah Organik & Reverse Tipping Fee
* **Prasyarat:**
  * **Fahri (P1-Phase 3):** Membutuhkan **Fahri Phase 2** (Rules Engine & Zod Schemas).
  * **Rizal (P2-Phase 3):** Membutuhkan **Rizal Phase 1** (App Shell) + **Fahri Phase 3** (Server Actions `FHR-12` & `FHR-13`). 🟠 *Rizal harus menunggu Server Actions Fahri untuk integrasi data*.

### 📊 Milestone 5: Modul C — Dashboard Publik, ESG Analytics & Laporan PDF
* **Prasyarat:**
  * **Fahri (P1-Phase 4):** Membutuhkan **Fahri Phase 2** + **Rizal Phase 1** (Design System agar UI kamera Fahri sesuai tema).
  * **Rizal (P2-Phase 4):** Membutuhkan **Fahri Phase 3** (Tabel & Transaction Ledger `financial_transactions` agar data metana $CH_4$ & $CO_2e$ ditarik dari database). 🔴 *Rizal TIDAK BISA membuat ESG Dashboard sebelum data ledger Fahri selesai!*

### 🛡️ Milestone 6: Verification Harness, Offline Resilience & Pitch Demo Prep
* **Prasyarat:** Membutuhkan **Seluruh Phase 1–5 Fahri & Rizal Selesai & Di-merge**.
* Output: Strict Type Checking `npx tsc --noEmit`, Bundling `npm run build`, *Offline LocalStorage Fallback*, & Slide Pitch Deck.

---

## 3. Matriks Audit Verification Harness

| Komponen Harness | Target Pengujian | Command / Tool | Status | Catatan Audit |
|---|---|---|---|---|
| **Specification Harness** | `AGENTS.md` compliance | Manual Check | ✅ PASSED | Terkonfigurasi di root project |
| **Type Verification** | Strict TypeScript compliance | `npx tsc --noEmit` | ✅ PASSED | **0 Error** tipe data |
| **Build Verification** | Zero error production build | `npm run build` | ✅ PASSED | **Compiled (5/5 static pages)** |
| **AI Schema Guard** | Structured JSON Output validation | Zod `FoodScanResultSchema` | ⏳ PENDING | Siap dieksekusi Fahri (`FHR-07`) |
| **RLS Database Audit** | Penegakan hak akses data | Supabase Client Audit | ⏳ PENDING | Test via Client RLS |
| **Resilience Harness** | Offline Fallback Test | LocalStorage Mock Switch | ✅ PASSED | Terintegrasi di `resilience.ts` |
