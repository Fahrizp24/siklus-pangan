# Progress & Task Tracking: RIZAL (P2 - Lead Frontend & UI/UX Design)

**Peran:** Lead Frontend, UI/UX Design System, Aesthetics & Impact Dashboards  
**Proyek:** SiklusPangan — Vibe Code TCC 2026 UTM  
**Git Branch:** `feature/p2-frontend-design`  
**Master Progress:** [PROGRESS.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/PROGRESS.md)  
**Skop Direktori Utama:** `src/app/`, `src/components/ui/`, `src/components/layout/`, `src/styles/`  

---

## 📊 Ringkasan Progress P2 (Rizal)

```
Progress Rizal: [=========>            ] 38%
- Foundation & Design Rules: 100% [DONE]
- Phase 1 (Design System & App Shell): 100% [DONE]
- Phase 2 (Live Surplus Radar UI):    0% [READY TO START]
- Phase 3 (Biokonversi & QR UI):       0% [TODO]
- Phase 4 (Dashboard ESG & PDF):       0% [TODO]
- Phase 5 (Polishing & Pitch Deck):    0% [TODO]
```

---

## 📋 Checklist Tugas, Deliverables & Syarat Ketergantungan (Prerequisites)

### 🎨 Phase 1: Design System, Theme & App Shell Layout
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** Berkas spesifikasi di [AGENTS.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/AGENTS.md).  
> - **Dibutuhkan oleh:** **Fahri Phase 4** (Pemindai Kamera VLM Fahri butuh tema & komponen UI Rizal).  
> - **Status Kerja:** 🟢 **SELESAI (Phase 1 Closed)**.

- [x] **RZL-00 (Spec):** Meninjau aturan visual, token warna, dan standar UI di [AGENTS.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/AGENTS.md).
- [x] **RZL-01:** Konfigurasi Tailwind CSS v3 dengan palet warna HSL khusus (Primary `#00AA13`, Secondary `#0B1B3D`, Tertiary `#005A10`, Neutral `#151C24`), Light Mode Only, efek Glassmorphism, & font Google Plus Jakarta Sans & Inter (`src/app/globals.css`, `tailwind.config.ts`).
- [x] **RZL-02:** Setup fondasi `shadcn/ui` (Button, Card, Badge, Dialog, Tabs, Toast/Toaster) + hook `use-toast`.
- [x] **RZL-03:** Membangun *App Shell* responsif (`src/components/layout/app-shell.tsx`):
  - Header Navbar dengan identitas sirkular, menu terpusat `nav.ts`, status aktif dot/underline, dan profil entitas (`src/components/layout/navbar.tsx`).
  - Footer enterprise berstandar ISO & GHG Protocol dengan status sistem (`src/components/layout/footer.tsx`).
  - Mobile Bottom Navigation Bar untuk layar ponsel.

---

### 🍱 Phase 2: Landing Page & Antarmuka Live Surplus Radar (Modul A)
> 📌 **Prasyarat (Dependencies):**  
> - **Membutuhkan:** **Rizal Phase 1** (App Shell `RZL-03` selesai) + **Fahri Phase 2** (Zod Schemas & Expiry function Fahri untuk dummy/live data).  
> - **Status Kerja:** 🟡 **Dapat membuat UI Mockup dulu, lalu hubungkan dengan Server Action Fahri (`FHR-10`)**.

- [ ] **RZL-04:** Antarmuka *Hero Section* & *Landing Page* interaktif (`src/app/page.tsx`).
- [ ] **RZL-05:** Komponen *Live Surplus Radar Feed* (`src/components/rescue/surplus-radar.tsx`):
  - Kartu lokasi makanan tanpa SDK peta berat.
  - Badge indikator waktu alami (contoh: "Sisa 45 menit lagi").
- [ ] **RZL-06:** Filter cepat Alergen & Preferensi Diet (Halal, Vegetarian, Gluten-Free).
- [ ] **RZL-07:** Antarmuka Modal Klaim Token QR untuk penerima manfaat (`src/components/rescue/claim-qr-modal.tsx`).
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
