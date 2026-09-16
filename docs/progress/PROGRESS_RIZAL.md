# Progress & Task Tracking: RIZAL (P2 - Lead Frontend & UI/UX Design)

**Peran:** Lead Frontend, UI/UX Design System, Aesthetics & Impact Dashboards  
**Proyek:** SiklusPangan — Vibe Code TCC 2026 UTM  
**Git Branch:** `feature/p2-frontend-design`  
**Master Progress:** [PROGRESS.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/PROGRESS.md)  
**Skop Direktori Utama:** `src/app/`, `src/components/ui/`, `src/components/layout/`, `src/styles/`  

---

## 📊 Ringkasan Progress P2 (Rizal)

```
Progress Rizal: [==============>     ] 58%
- Foundation & Design Rules: 100% [DONE]
- Phase 1 (Design System & App Shell): 100% [DONE]
- Phase 2 (Live Surplus Radar UI):    60% [IN PROGRESS - RZL-04, 05, 06 DONE]
- Phase 3 (Biokonversi & QR UI):       0% [TODO]
- Phase 4 (Dashboard ESG & PDF):       0% [TODO]
- Phase 5 (Polishing & Pitch Deck):    0% [TODO]
```

---

## 📋 Checklist Tugas, Deliverables & Syarat Ketergantungan (Prerequisites)

### 🎨 Phase 1: Design System, Tokens, & Layout Shell
> 📌 **Prasyarat (Dependencies):**  
> - **Mandiri (Bisa Langsung Dikerjakan)** tanpa menunggu backend.  
> - **Status Kerja:** 🟢 **COMPLETED (Semua tugas Phase 1 selesai)**.

- [x] **RZL-01:** Definisi token warna CSS & Tipografi di `tailwind.config.ts` dan `src/app/globals.css`.
- [x] **RZL-02:** Setup fondasi `shadcn/ui` (Button, Card, Badge, Dialog, Tabs, Toast/Toaster) + hook `use-toast`.
- [x] **RZL-03:** Membangun *App Shell* responsif (`src/components/layout/app-shell.tsx`):
  - Header Navbar dengan identitas sirkular, menu terpusat `nav.ts`, status aktif dot/underline, dan profil entitas (`src/components/layout/navbar.tsx`).
  - Footer enterprise berstandar ISO & GHG Protocol dengan status sistem (`src/components/layout/footer.tsx`).
  - Mobile Bottom Navigation Bar untuk layar ponsel.

---

### 🍱 Phase 2: Landing Page & Antarmuka Live Surplus Radar (Modul A)
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** **Rizal Phase 1** (App Shell `RZL-03` selesai) + **Fahri Phase 2** (Zod Schemas & Expiry function Fahri untuk dummy/live data).  
> - **Status Kerja:** 🟡 **IN PROGRESS (RZL-04, RZL-05, RZL-06 Selesai)**.

- [x] **RZL-04:** Antarmuka *Hero Section*, *Stat Section*, *Feature Tabs Section*, & *10 Pilar Ekosistem* pada Landing Page (`src/app/page.tsx`, `src/components/pages/home/`):
  - **Hero Section Card:** Desain kartu enterprise, headline normal vs highlight, dan 3 badge teknologi (`hero-section.tsx`).
  - **Stat Section:** 5 metrik dampak sirkular real-time pangan & limbah (`stat-section.tsx`).
  - **Feature Tabs Highlight:** 4 tab menu (Live Surplus Radar, Donasi Pangan, Biokonversi, Wall of Fame) dalam 1 baris horizontal dengan filter kategori dan 3 kartu surplus bento, croissant, dan nasi kotak (`features-section.tsx`).
  - **10 Pilar Ekosistem:** Arsitektur rekayasa sistem terpadu SiklusPangan (`pillars-section.tsx`).
  - **Harmonisasi Layout Spacing:** Ritme jarak antar-section dan padding simetris ke navbar/footer (`page.tsx`, `app-shell.tsx`).
- [x] **RZL-05:** Komponen *Live Surplus Radar Feed & Hero* (`src/app/rescue/page.tsx`, `src/components/pages/rescue/`):
  - **Modular Page Sections:** Penataan modular selaras murni 1:1 dengan `src/components/pages/home/` (`hero-section.tsx`, `surplus-feed-section.tsx`, `architecture-insight-section.tsx`).
  - **Radar Hero:** Telemetry status live, cycle tracker, headline, search box, filter radius km slider, kuota dhuafa toggle, dan filter category pills (`hero-section.tsx`).
  - **Surplus Food List Grid (2-Kolom):** Grid 4 kartu makanan surplus real-time berstandar rekayasa mutu dengan donor anonim, lokasi, estimasi waktu expired, badge mutu (Cold Chain, Shift Pagi Hotel, Halal LPOM MUI, 100% Organik & Vegan), porsi tersisa, dan tombol klaim (`surplus-feed-section.tsx`, `src/components/ui/surplus-food-card.tsx`).
  - **Side Menu Cards:** Terenkapsulasi rapi di dalam `surplus-feed-section.tsx` (*Kapasitas Beneficiary* & *Protokol Penjemputan Aman*).
  - **Architecture Insight Section:** Penjelasan rekayasa sistem *Deterministic Food Expiry Engine* tanpa halusinasi AI dengan 3 metrik (Akurasi Kelayakan 0.9997, 100% Anonim, Scope 3 Ready) (`architecture-insight-section.tsx`).
  - **Atomic UI Badges:** `AnonDonorBadge` & `ExpiryTimeBadge` terpusat di `src/components/ui/`.
  - **State Coordination:** `RescueFilterContext` terpusat di `src/lib/context/rescue-filter-context.tsx`.
- [x] **RZL-06:** Filter cepat Alergen & Preferensi Diet (`src/components/ui/dietary-tag.tsx`, `src/components/ui/filter-pills.tsx`):
  - Komponen `DietaryTag` semantic color schemes (yellow, green, blue, red, neutral) untuk Halal, Vegetarian, Gluten-Free, Bebas Kacang, Dairy-Free.
  - Komponen `FilterPills` reusable dengan icon & count badge, hidden scrollbar UI (`display: none; scrollbar-width: none`), touch scroll native, dan desktop mouse wheel horizontal scroll support.
- [ ] **RZL-07:** Antarmuka Modal Klaim Token QR untuk penerima manfaat (`src/components/ui/claim-qr-modal.tsx`).
- [ ] **RZL-08:** Antarmuka Form Donatur Penyelamatan Makanan (`src/app/rescue/new/page.tsx`).

---

### 🔄 Phase 3: Antarmuka Biokonversi Limbah & QR Handover (Modul B)
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** **Rizal Phase 1** (App Shell) + **Fahri Phase 3** (Server Actions `createWasteBatch` & `processWasteHandover` `FHR-12` & `FHR-13` selesai).  
> - **Status Kerja:** 🟠 **Menunggu Fahri Phase 3 (Server Actions) selesai untuk integrasi mutasi data**.

- [ ] **RZL-09:** Halaman Form Pendaftaran Limbah Basi (`src/app/waste/new/page.tsx`).
- [ ] **RZL-10:** Tampilan *Dynamic QR Code Generator* untuk serah terima lapangan (`src/components/waste/qr-handover-card.tsx`).
- [ ] **RZL-11:** Tampilan status transaksi dompet insentif mitra biokonversi (`src/components/waste/incentive-wallet-card.tsx`).

---

### 📊 Phase 4: Wall of Fame, Dasbor ESG & Laporan PDF (Modul C)
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** **Fahri Phase 3** (Tabel & Transaction Ledger `financial_transactions` `FHR-13` selesai agar data metana $CH_4$, $CO_2e$, & Rupiah saved bisa ditarik dari database).  
> - **Status Kerja:** 🔴 **TIDAK BISA DIKERJAKAN sebelum Fahri Phase 3 selesai!** (Tergantung penuh data ledger Fahri).

- [ ] **RZL-12:** Halaman Publik *Wall of Fame Donatur* (`src/app/wall-of-fame/page.tsx`):
  - Leaderboard donatur unggulan (Hotel, Restoran, Katering).
- [ ] **RZL-13:** Dasbor Analitik ESG & Reduksi Emisi (`src/app/dashboard/esg/page.tsx`):
  - Card metrik: Kg Waste Diverted, $CH_4$ metana, $CO_2e$ carbon offset, & Rupiah saved.
- [ ] **RZL-14:** Desain Layout Cetak PDF Sertifikat ESG Digital untuk laporan CSR donatur (`src/components/reports/esg-pdf-template.tsx`).

---

### 🎭 Phase 5: Polishing Visual & Materi Slide Pitching
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** **Seluruh Phase 1–4 Rizal & Fahri selesai di-merge**.  
> - **Status Kerja:** 🔴 **Dikunci sampai seluruh fitur selesai**.

- [ ] **RZL-15:** Penambahan micro-animations, hover effects, dan transisi smooth untuk *WOW effect* juri.
- [ ] **RZL-16:** Penyusunan slide presentasi (*pitch deck*) TCC 2026 UTM & penyelarasan skenario live demo.
