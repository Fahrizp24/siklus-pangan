# Product Requirement Document (PRD) & Harness Architecture: SiklusPangan

**Versi Dokumen:** 2.0.0  
**Status:** Approved for Harness Execution  
**Target Event:** Vibe Code Competition - TCC 2026 (Universitas Trunojoyo Madura)  
**Pendekatan Rekayasa:** Harness-Driven Vibe Coding & Deterministic AI Guardrails  

---

## 1. Ringkasan Eksekutif, Visi Produk & Filosofi Harness

### 1.1 Visi Produk
**SiklusPangan** adalah platform pengelolaan rantai pasok sirkular pangan dari hulu ke hilir berbasis sistem kaskade dua tahap (*Two-Stage Food Rescue & Bioconversion Cascade*):

1. **Jalur Pangan (Layak Konsumsi):** Penyelamatan *surplus food* dari donatur (hotel, restoran, katering, acara) untuk disalurkan ke penerima manfaat (masyarakat, mahasiswa, panti asuhan) tanpa stigma sosial melalui klaim instan QR Code.
2. **Jalur Biokonversi (Basi / Tak Layak Konsumsi):** Penyaluran limbah organik secara presisi ke pengolah non-vendor (pembudidaya maggot BSF, peternak lokal, unit komposting/biodigester) berbasis skema **Insentif Logistik Terbalik (*Reverse Tipping Fee*)**. Restoran membayar biaya penjemputan limbah mikro yang jauh lebih efisien dibanding retribusi sampah konvensional, sementara mitra pengolah menerima kompensasi insentif operasional dan bahan baku produktif.

Pendekatan ini menjamin target **Nihil Sampah Organik ke TPA (*Zero Organic Waste to Landfill*)**.

### 1.2 Filosofi *Harness-Driven Execution*
Dalam pengerjaan proyek ini, seluruh siklus pengembangan software tidak diserahkan pada *prompting* AI bebas secara mentah. Sebaliknya, pengerjaan dikendalikan secara mutlak oleh **Vibe Coding Harness Architecture**. Harness ini berfungsi sebagai penopang rekayasa (*engineering scaffold*) yang menjamin:
* **Deterministic Guardrails:** Hasil pemrosesan AI (Vision-Language Model) dibatasi secara ketat oleh skema Zod dan *Rules Engine* deterministik.
* **Verification & Type Safety:** Seluruh *codebase* tervalidasi secara otomatis melalui *type checking* TypeScript (`tsc --noEmit`), *Server Actions* Next.js, dan kebijakan RLS PostgreSQL.
* **Fail-Safe Offline Resilience:** Menyediakan *Offline Fixture Harness* agar antarmuka pemindai dan radar tetap dapat beroperasi 100% pada kondisi koneksi buruk di lokasi penjurian TCC 2026 UTM.

---

## 2. Rincian Fitur Utama & Modul Sistem

### Modul A: Penyelamatan Pangan Berlebih (*Surplus Food Rescue*)

#### 1. Sisi Donatur (Restoran, Hotel, Katering, dan Acara)
* **Multimodal Food Scanner (Gemini VLM):**
  * Donatur mengunggah foto makanan via peramban, menginput estimasi porsi visual, jam selesai masak, serta metode penyimpanan (suhu ruang, etalase pemanas, wadah kedap).
  * Gemini 2.0 Flash VLM mendeteksi nama menu dan secara otomatis menandai bahan pangan berisiko tinggi basi (*risky ingredients*: santan, telur setengah matang, susu, mayones, boga bahari).
  * *Human-in-the-Loop Review:* Donatur berhak melakukan penyesuaian (*override*) terhadap nama menu, porsi, dan komposisi sebelum dipublikasikan.
* **Deterministic Expiry Rules Engine:**
  * Penentuan *Safe Until Timestamp* (waktu batas konsumsi) **wajib dikalkulasi oleh deterministik rules engine**, bukan diestimasi secara bebas oleh LLM demi menghindari halusinasi waktu.
  * Menghasilkan instruksi penanganan higienis (*handling recommendations*) otomatis (misal: rekomendasi pemanasan ulang $70^\circ\text{C}$ selama 5 menit).
* **Penjadwalan Pengambilan Fleksibel:**
  * Penetapan lokasi serah terima: *Direct Pickup* (lokasi donatur) atau *Drop-Hub Transit* terdekat.

#### 2. Sisi Penerima Manfaat (Masyarakat, Mahasiswa, dan Panti Asuhan)
* **Live Surplus Radar (Text-Based Efficient Feed):**
  * Umpan data berbasis kartu lokasi dengan alamat jelas tanpa dependensi SDK peta berat yang membebani memori peramban seluler.
  * Indikator batas waktu dengan ekspresi waktu alami (*natural time expression*), contoh: "Sisa 45 menit sebelum batas aman berakhir".
* **Filter Diet & Alergen Terstruktur:**
  * Filter preferensi cepat: Halal, Vegetarian, Bebas Gluten, Bebas Kacang, Bebas Boga Bahari.
* **Klaim Token QR Sekali Pakai (Individu):**
  * Akses klaim cepat via Supabase Auth Magic Link tanpa persyaratan verifikasi berkas pribadi.
  * *Quota Enforcement:* Maksimal 1 porsi per akun untuk setiap jendela waktu makan (siang: 11.00-14.00, malam: 17.00-20.00).
* **Alokasi Massal Lembaga Sosial & Panti Asuhan:**
  * Panti asuhan mendaftarkan kapasitas kuota penghuni (misal: 35 anak).
  * *Threshold Guard:* Jika surplus yang tersedia di donatur $< 50\%$ kapasitas panti (misal hanya 8 porsi), sistem secara otomatis mengalihkan *listing* tersebut ke radar individu warga untuk mencegah ketidakrataan distribusi internal panti.
  * *Waste Prevention Limit:* Pengambilan makanan dibatasi maksimal sebesar kapasitas terdaftar.

#### 3. Penegakan Mutu & Keamanan Pangan
* **Three-Strike & Dispute Escalation System:**
  * Penerima dapat melaporkan makanan basi/berbau sebelum *safe_until* dengan 1-klik.
  * Laporan otomatis memicu pembekuan sementara status *listing* dari radar publik.
  * Donatur mendapatkan hak sanggah (*dispute*) $1 \times 24$ jam dengan mengunggah foto serah terima berstempel waktu.
  * Pelanggaran terverifikasi mencatat *strike*; pada *strike* ke-3, akun donatur diblokir secara permanen oleh sistem.

---

### Modul B: Biokonversi Limbah Pangan (*Reverse Tipping Fee*)

#### 1. Ekosistem Mitra Pengolah Organic Waste (Non-Vendor Sampah)
Penyaluran limbah basi diarahkan secara eksplisit kepada mitra pengolah produktif:
* **Pembudidaya Maggot BSF (*Black Soldier Fly*):** Pengolah utama limbah basah berlemak dan tinggi protein.
* **Peternak Unggas & Ikan Lele Lokal:** Pengolah sisa nasi, karbohidrat, dan olahan roti/tepung.
* **Unit Kompos & Biodigester Komunal:** Pengolah sisa sayur layu, ampas buah, dan limbah berserat tinggi.

#### 2. Inspeksi Kontaminasi AI & Routing Nutrisi
* **Vision AI Contamination Inspection:** Gemini VLM menganalisis foto wadah limbah untuk mendeteksi bahan anorganik pengotor (plastik, styrofoam, tusuk sate, kawat) sebelum transaksi penjemputan disetujui.
* **Nutrient Routing System:** Sistem merekomendasikan kategori pengolah yang paling optimal untuk menjaga efisiensi biokonversi.

#### 3. Mekanisme Finansial Insentif Terbalik (*Reverse Tipping Fee*)
* **Tarif Mikro Berkeadilan:** Donatur membayar biaya pengolahan limbah (misal: Rp600 / kg), memberikan penghematan $70\%$ dibanding tarif jasa pembuangan limbah swasta konvensional.
* **Insentif Mitra Pengolah:** Biaya pembayaran donatur langsung dialokasikan ke saldo dompet digital mitra pengolah sebagai kompensasi BBM dan biaya operasional penjemputan.
* **Kredit Awal Pendaftaran:** Donatur baru mendapatkan *Welcome Credit* penjemputan 100 kg limbah pertama gratis.
* **Dual Billing Ledger:** Usaha skala kecil (UMKM) menggunakan sistem saldo deposit prabayar (*prepaid deposit*); hotel/restoran besar menggunakan faktur konsolidasi pascabayar bulanan (*monthly invoice*).

#### 4. Handover Kode QR Dinamis Dua Arah
* Staf donatur memasukkan bobot riil limbah (kg) pada antarmuka web, memicu pembuatan **Dynamic QR Code** yang memuat `waste_batch_id`, bobot, dan nominal insentif.
* Mitra pengolah memindai QR Code dari layar donatur menggunakan peramban seluler. Transaksi tervalidasi seketika, saldo donatur terpotong, dan kredit insentif masuk ke saldo mitra.

---

### Modul C: Dasbor Pengelola, Transparansi & Sustainability Analytics

* **Wall of Fame Donatur:** Halaman publik yang menampilkan peringkat donatur terbaik berdasarkan total kilogram makanan diselamatkan dan total limbah dibiokonversi.
* **Kalkulator Reduksi Metana & Emisi Carbon:**
  * Menghitung dampak lingkungan terukur secara *real-time*:
    $$\text{Waste Diverted (kg)} = \sum \text{Portions} \times 0.35\text{ kg} + \sum \text{Waste Batches (kg)}$$
    $$\text{Emisi Metana Tercegah (kg } CH_4) = \text{Waste Diverted (kg)} \times 0.04$$
    $$\text{Reduksi Carbon (kg } CO_2e) = \text{Waste Diverted (kg)} \times 0.58$$
* **Automated ESG Sustainability Report Generator:** Generator dokumen PDF sertifikat ESG untuk klaim laporan keberlanjutan korporasi donatur.

---

## 3. Mitigasi Risiko & Edge Cases

| No | Skenario Edge Case | Risiko Teknis | Solusi Architecture & Harness |
|---|---|---|---|
| 1 | Halusinasi Waktu Kedaluwarsa AI | AI memberikan estimasi jam basi yang salah sehingga makanan membahayakan konsumen. | **Deterministic Rules Engine Guard:** AI hanya mengekstrak bahan & kondisi. Kalkulasi waktu dikunci oleh aturan deterministik (Kering: max 4 jam, Wet/Santan: max 2 jam pada suhu ruang). |
| 2 | Laporan Basi Palsu (*Fraud Report*) | Penerima melaporkan makanan basi padahal layak, merusak reputasi donatur. | **Dispute Verification System:** Pembekuan sementara radar visual, status penalti ditahan (*pending verification*). Donatur diberi jendela $24\text{ jam}$ unggah foto bukti serah terima. |
| 3 | Sisa Surplus Panti Asuhan Unfilled | Makanan surplus jumlah sedikit ($< 50\%$ kuota panti) ditolak panti dan basi. | **Threshold Rerouting Fallback:** Otomatis *fallback* ke radar klaim individu warga begitu batas threshold panti tidak terpenuhi. |
| 4 | Kegagalan Internet di Aula UTM | Aplikasi tidak bisa mendemonstrasikan fitur scanning VLM saat penjurian luring. | **Offline Fixture Harness:** Mode *fallback* otomatis ke data *mock json* di LocalStorage jika API call Gemini / Supabase *timeout* $> 3.0\text{ detik}$. |

---

## 4. Architectural Tech Stack & Justifikasi

| Layer | Pilihan Teknologi | Justifikasi Teknis |
|---|---|---|
| **Frontend Framework** | **Next.js 15 (App Router, React 19, TypeScript)** | Memungkinkan penggunaan *Server Actions* untuk mutasi data berlatensi rendah tanpa perlu membuat REST API endpoint terpisah. *Type safety* penuh dari UI ke Database. |
| **Styling & UI Components** | **Tailwind CSS v3 + shadcn/ui** | Komponen UI modular berbasis Radix UI, sangat ringan, responsive, dan mudah dipoles dengan estetika *modern dark/glassmorphic*. |
| **Backend & Database** | **Supabase (PostgreSQL 15, Realtime, Auth)** | PostgreSQL menjamin integritas relasi data transaksi. *Supabase Realtime* mengalirkan pembaruan radar surplus secara instan. *Supabase Auth (Magic Link)* mempermudah login penerima. |
| **AI Infrastructure** | **Google Gemini 2.0 Flash via SDK (`@google/genai`)** | Pemrosesan multimodal visual *native* dengan latensi $< 1.5\text{ detik}$, biaya efisien, serta fitur *Structured Output* dengan *JSON Schema enforcement*. |
| **QR Code Engine** | **`html5-qrcode`** | Ringan, kompatibel dengan kanvas peramban seluler (iOS/Android), tanpa dependensi berat. |
| **Schema Validation** | **Zod v3** | Mengunci tipe data pada input *Server Actions*, API responses, dan luaran terstruktur model AI. |

---

## 5. Skema Basis Data Relasional (PostgreSQL DDL) & RLS

Berikut adalah struktur DDL relasional PostgreSQL yang siap diinisialisasi pada Supabase:

```sql
-- ==========================================
-- 1. ENUM DEFINITIONS
-- ==========================================
CREATE TYPE user_role AS ENUM ('donor', 'beneficiary', 'orphanage', 'processor', 'admin');
CREATE TYPE listing_status AS ENUM ('active', 'claimed', 'expired', 'recalled');
CREATE TYPE waste_category AS ENUM ('bsf_maggot', 'poultry_fish', 'compost_biogas');
CREATE TYPE transaction_type AS ENUM ('prepaid_deposit', 'monthly_invoice', 'processor_incentive');

-- ==========================================
-- 2. USER PROFILES TABLE
-- ==========================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'beneficiary',
    display_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT NOT NULL,
    organization_capacity INT DEFAULT 1,
    credit_balance DECIMAL(12, 2) DEFAULT 0.00,
    strikes_count INT DEFAULT 0,
    is_banned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. FOOD SURPLUS LISTINGS TABLE
-- ==========================================
CREATE TABLE food_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    image_url TEXT NOT NULL,
    portions INT NOT NULL CHECK (portions > 0),
    remaining_portions INT NOT NULL CHECK (remaining_portions >= 0),
    risky_ingredients TEXT[] DEFAULT '{}',
    dietary_tags TEXT[] DEFAULT '{}',
    storage_method VARCHAR(100) NOT NULL,
    cooked_at TIMESTAMPTZ NOT NULL,
    safe_until TIMESTAMPTZ NOT NULL,
    handling_notes TEXT,
    status listing_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. FOOD CLAIMS TABLE
-- ==========================================
CREATE TABLE food_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES food_listings(id) ON DELETE CASCADE,
    claimant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    portions_claimed INT NOT NULL DEFAULT 1,
    qr_token VARCHAR(64) UNIQUE NOT NULL,
    is_collected BOOLEAN DEFAULT FALSE,
    collected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. STRIKE DISPUTES TABLE
-- ==========================================
CREATE TABLE strike_disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES food_listings(id) ON DELETE CASCADE,
    reported_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    donor_evidence_url TEXT,
    donor_statement TEXT,
    is_resolved BOOLEAN DEFAULT FALSE,
    penalty_applied BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 6. WASTE BATCHES (BIOCONVERSION) TABLE
-- ==========================================
CREATE TABLE waste_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    processor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    target_category waste_category NOT NULL,
    weight_kg DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
    rate_per_kg DECIMAL(8, 2) NOT NULL DEFAULT 600.00,
    is_collected BOOLEAN DEFAULT FALSE,
    qr_handover_token VARCHAR(64) UNIQUE NOT NULL,
    collected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 7. FINANCIAL TRANSACTIONS LEDGER TABLE
-- ==========================================
CREATE TABLE financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    waste_batch_id UUID REFERENCES waste_batches(id) ON DELETE SET NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type transaction_type NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE waste_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: pengguna dapat membaca semua profil, hanya dapat mengedit profil milik sendiri
CREATE POLICY "Profiles are viewable by authenticated users" 
ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Food Listings: listing aktif terbuka untuk publik, donatur mengelola listing milik sendiri
CREATE POLICY "Active food listings are viewable by everyone" 
ON food_listings FOR SELECT USING (status = 'active');

CREATE POLICY "Donors can insert and manage their own listings" 
ON food_listings FOR ALL TO authenticated USING (auth.uid() = donor_id);

-- Food Claims: pengguna dapat melihat klaim miliknya
CREATE POLICY "Users can view their own claims" 
ON food_claims FOR SELECT TO authenticated USING (auth.uid() = claimant_id OR auth.uid() IN (
    SELECT donor_id FROM food_listings WHERE id = food_claims.listing_id
));

CREATE POLICY "Users can insert claims" 
ON food_claims FOR INSERT TO authenticated WITH CHECK (auth.uid() = claimant_id);

-- Waste Batches: donatur dan processor dapat mengelola batch limbah terkait
CREATE POLICY "Waste batches viewable by donor or processor" 
ON waste_batches FOR SELECT TO authenticated USING (
    auth.uid() = donor_id OR auth.uid() = processor_id OR processor_id IS NULL
);

CREATE POLICY "Donors can create waste batches" 
ON waste_batches FOR INSERT TO authenticated WITH CHECK (auth.uid() = donor_id);
```

---

## 6. Arsitektur Harness & Standar Vibe Coding

Untuk memenuhi regulasi transparansi AI, akuntabilitas rekayasa, dan skalabilitas sistem pada TCC 2026 UTM, proyek ini menggunakan **4-Tier Harness Infrastructure**:

```
+-------------------------------------------------------------------+
|                     HARNESS SCAFFOLD SYSTEM                       |
+-------------------------------------------------------------------+
|  1. SPECIFICATION HARNESS   | Rules, prompt constraints, stack    |
|  2. AI OUTPUT HARNESS       | Zod structured JSON schemas         |
|  3. VERIFICATION HARNESS    | TypeScript & Next.js build checks   |
|  4. RESILIENCE HARNESS      | LocalStorage offline fixtures       |
+-------------------------------------------------------------------+
```

### 6.1 Specification Harness (`AGENTS.md`)
Semua *agentic AI coding session* wajib tunduk pada aturan spesifikasi dasar pada direktori utama (`AGENTS.md`):

```markdown
# Panduan Vibe Coding SiklusPangan
- Tumpukan: Next.js App Router (TypeScript), Tailwind CSS, shadcn/ui.
- Mutasi Data: Wajib menggunakan Next.js Server Actions dengan Zod parsing.
- Integrasi AI: Gunakan Google Gen AI SDK resmi (@google/genai) dengan penegakan skema terstruktur (Structured Output).
- Penanganan Kesalahan: Kembalikan pola tipe hasil standar: { success: boolean; data?: T; error?: string }.
- Anti-Halusinasi: Dilarang mengimpor pustaka yang tidak ada di package.json. Gunakan html5-qrcode untuk pemindaian kamera.
```

### 6.2 AI Output Deterministic Guard Harness (Zod Validation)

```typescript
import { z } from "zod";

// Skema Validasi Output VLM Pemindai Makanan
export const FoodScanResultSchema = z.object({
  detectedMenu: z.string().describe("Nama menu makanan hasil analisa visual VLM"),
  estimatedPortions: z.number().int().positive().describe("Perkiraan jumlah porsi visual"),
  riskyIngredients: z.array(z.string()).describe("Bahan rentan basi: santan, susu, mayones, boga bahari"),
  dietaryClassification: z.array(z.enum(["halal", "vegetarian", "contains_gluten", "contains_nuts", "seafood"])),
  suggestedStorageHours: z.number().describe("Rekomendasi jam simpan suhu ruang dari AI"),
  handlingRecommendations: z.string().describe("Instruksi penanganan higienis dan penyajian"),
});

// Skema Validasi Output VLM Inspeksi Limbah Organic
export const WasteInspectionSchema = z.object({
  isOrganicPure: z.boolean().describe("False jika terdeteksi bahan anorganik/pengotor"),
  detectedContaminants: z.array(z.string()).describe("Daftar kontaminan: plastik, kawat, styrofoam"),
  optimalProcessor: z.enum(["bsf_maggot", "poultry_fish", "compost_biogas"]).describe("Rekomendasi alokasi biokonversi"),
  nutrientNotes: z.string().describe("Alasan penentuan kategori nutrisi limbah"),
});

export type FoodScanResult = z.infer<typeof FoodScanResultSchema>;
export type WasteInspectionResult = z.infer<typeof WasteInspectionSchema>;
```

### 6.3 Verification Harness (Automated Type & Build Checks)
Sistem Harness mengeksekusi pengujian berkala pada setiap penyelesaian modul:
* `npm run build` — Memastikan tidak ada *syntax error*, *broken import*, atau *unhandled promise*.
* `tsc --noEmit` — Memastikan *strict type compliance* pada seluruh komponen dan *Server Actions*.

### 6.4 Resilience & Offline Fixture Harness
Untuk mengantisipasi kendala koneksi seluler saat demonstrasi live di hadapan juri TCC 2026 UTM:
* Jika panggilan API Gemini 2.0 Flash atau Supabase mengalami *timeout* $> 3.0\text{ detik}$, **Resilience Harness** mengalihkan antarmuka ke *Offline Mock Fixtures* yang tersimpan di peramban tanpa menghentikan pengalaman pengguna (*zero crash UI*).