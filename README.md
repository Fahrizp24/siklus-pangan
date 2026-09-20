# 🍃 SiklusPangan — Zero Organic Waste Platform

**Target Event:** Vibe Code Competition — TCC 2026 (Universitas Trunojoyo Madura)  
**Tech Stack:** Next.js 15 (App Router, React 19, TypeScript), Tailwind CSS v3, Supabase (PostgreSQL + RLS), Google Gemini 2.0 Flash VLM (`@google/genai`), Zod, & `html5-qrcode`.  
**Rekayasa Sistem:** Harness-Driven Vibe Coding & Deterministic Safety Rules Engine  

---

## 🎯 Visi & Arsitektur Produk

**SiklusPangan** mengintegrasikan rantai pasok sirkular pangan dari hulu ke hilir melalui sistem kaskade dua tahap:

1. **Jalur Pangan (Layak Konsumsi):** Penyelamatan makanan berlebih (*Surplus Food Rescue*) dari restoran, hotel, dan katering untuk disalurkan ke masyarakat & panti asuhan tanpa stigma sosial melalui klaim instan QR Code.
2. **Jalur Biokonversi (Basi / Tak Layak Konsumsi):** Penyaluran limbah organik secara presisi ke pengolah non-vendor (pembudidaya maggot BSF, peternak lokal, unit komposting) berbasis skema **Insentif Logistik Terbalik (*Reverse Tipping Fee*)**.

---

## 📑 Navigasi Dokumentasi Resmi

Seluruh cetak biru teknis dan tata kelola proyek tersimpan secara terstruktur di folder `docs/`:

* **[PITCH_DECK.md](docs/PITCH_DECK.md)** — Slide Presentasi Pitch Deck, Skenario Live Demo 3 Menit, & Bocoran Tanya Jawab Juri *(Wajib Baca)*.
* **[PAGES.md](docs/PAGES.md)** — Matriks route, fitur setiap halaman, role, status, serta roadmap implementasi.
* **[AGENTS.md](AGENTS.md)** — Berkas Aturan Resmi Antigravity Agent & Protocol Verifikasi Harness *(Root File)*.
* **[PRD.md](docs/PRD.md)** / **[PRD.pdf](docs/PRD.pdf)** — Product Requirement Document & PostgreSQL DDL.
* **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** — Arsitektur Sistem 5-Layer & Diagram Alur Sequence Mermaid.
* **[DECISION.md](docs/DECISION.md)** — Log Keputusan Arsitektur (*Architectural Decision Records / ADR-001 s.d. ADR-006*).
* **[HARNESS.md](docs/HARNESS.md)** — Spesifikasi 4-Tier Harness System & Transparansi Rekayasa AI.

---

## 👥 Pelacak Progress & Pembagian Tim

| Anggota Tim | Peran Utama | Berkas Progress Individual | Branch Git |
|---|---|---|---|
| **Fahri (P1)** | Lead Backend, Data Infrastructure, API & Functional UI Logic | **[PROGRESS_FAHRI.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/docs/progress/PROGRESS_FAHRI.md)** | `feature/p1-backend-logic` |
| **Rizal (P2)** | Lead Frontend, UI/UX Design System, Aesthetics & Dashboards | **[PROGRESS_RIZAL.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/docs/progress/PROGRESS_RIZAL.md)** | `feature/p2-frontend-design` |

📌 **Master Roadmap Proyek:** **[PROGRESS.md](file:///d:/KULIAH/Lomba/HACKATON%20UTM/PROGRESS.md)**

---

## 💻 Panduan Pengoperasian (Getting Started)

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Konfigurasi Environment Variables
Salin berkas `.env.local.example` menjadi `.env.local`:
```bash
cp .env.local.example .env.local
```
Isi kredensial `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan `GEMINI_API_KEY`.

### 3. Menjalankan Server Development
```bash
npm run dev
```
Aplikasi dapat diakses di `http://localhost:3000`.

### 4. Akun Demo Cepat (1-Click Login untuk Dewan Juri)
Pada halaman `/login`, tersedia tombol **"Mode Demo Juri"** yang langsung mengisi kredensial dengan 1 klik:

| Persona / Role | Email Demo | Password Demo | Halaman Arahan Otomatis |
|---|---|---|---|
| **Donatur (Hotel/Katering)** | `donor@gmail.com` | `password123` | Beranda (`/`) & Registrasi Donasi (`/donate`) |
| **Penerima (Panti Asuhan/Organisasi)** | `organisasi@gmail.com` | `password123` | Live Radar (`/rescue`) & Tiket Klaim (`/claims`) |
| **Penerima (Individu Dhuafa)** | `penerima@gmail.com` | `password123` | Live Radar (`/rescue`) & Tiket Klaim (`/claims`) |
| **Pengolah Limbah (BSF Driver)** | `pengolah@gmail.com` | `password123` | Manifest Limbah (`/waste`) & Dompet (`/wallet`) |
| **Admin Pengawas (ESG Auditor)** | `admin@gmail.com` | `password123` | Konsol Admin (`/admin`) & Dashboard (`/dashboard`) |

---

### 5. Eksekusi Uji Harness Protocol & Pre-Demo Check
```bash
# 1. Uji Kesiapan Sistem Pre-Demo (1-Command Health Check)
node scripts/demo-healthcheck.mjs

# 2. Uji Strict Type Compliance
npx tsc --noEmit

# 3. Uji Production Bundling
npm run build
```

