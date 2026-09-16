# Product Requirement Document (PRD) & Harness Architecture: SiklusPangan

> Status terbaru: bagian NO DEBT / 0004 di bawah menggantikan laporan review lama. TLS/catalog telah terverifikasi; collection RPC tersedia; individual in-window SQL sequential sudah lulus. E2E/race/UI tetap gap.

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
  * Umpan data berbasis kartu tanpa identitas/alamat persis donatur pada radar publik tanpa dependensi SDK peta berat yang membebani memori peramban seluler.
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
* **Tarif Mikro Berkeadilan:** Donatur membayar tarif tetap Rp600/kg, memberikan penghematan $70\%$ dibanding tarif jasa pembuangan limbah swasta konvensional.
* **Insentif Mitra Pengolah:** Biaya pembayaran donatur langsung dialokasikan ke saldo dompet digital mitra pengolah sebagai kompensasi BBM dan biaya operasional penjemputan.
* **Subsidi Awal Pendaftaran:** Subsidi platform Rp12.000 sekali seumur akun donatur, terpisah dari deposit; tidak reset bulanan. Mitra tetap menerima penuh Rp600/kg. Subsidi terpakai dahulu, sisanya wajib dipotong dari deposit untuk SEMUA billing mode; saldo kurang menolak handover.
* **NO DEBT:** Tidak ada utang atau credit limit. `monthly_invoice` hanya rekap bulanan transaksi yang telah dibayar (`paid_at IS NOT NULL`), bukan fasilitas pascabayar. Ledger historis tidak diubah atau dilabel lunas.

#### 4. Handover Kode QR Dinamis Dua Arah
* Donatur memasukkan bobot riil limbah dan billing mode melalui `createWasteBatch`; QR hanya membawa token acak, bukan nominal terpercaya.
* `processWasteHandover` mengunci batch dan akun, menghitung subsidi serta tagihan di database, membayar penuh mitra. Semua billing mode memotong deposit setelah subsidi; invoice hanya rekap lunas. Retry processor yang sama tidak mendebit ulang. UI pemindai belum terintegrasi.

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

Sumber skema executable: `supabase/migrations/0001_initial_schema.sql`, `0002_signup_profile_metadata.sql`, `0003_phase3.sql`, dan `0004_no_debt_collection.sql`; jangan menjalankan DDL konseptual lama.

- Role: donor, beneficiary (individu atau `is_organization`), processor, admin. Admin tidak dapat dipilih lewat signup.
- Tujuh tabel: profiles, food_listings, food_claims, strike_disputes, waste_batches, financial_transactions, donor_subsidies; seluruhnya RLS.
- Mutasi klaim, limbah, handover, laporan melalui RPC atomik; izin tulis langsung dicabut. Update profil hanya display_name, phone_number, address.
- Radar publik memakai `food_radar`, tanpa donor_id/alamat/telepon. Foto dan teks bebas belum disanitasi terhadap identitas visual donatur.
- FHR-14 hanya laporan dari klaim collected sebelum safe_until, recall, deadline 24 jam; verifikasi bukti, penalti dan blokir tiga strike masih FHR-18.
- Status Phase3 IN PROGRESS. Migrasi pernah dilaporkan applied pada sesi sebelumnya; review ini tidak menerapkan perubahan DB. Koneksi katalog PostgreSQL read-only gagal, verifikasi independen penuh belum tersedia. SELECT PostgREST pada empat ID fixture yang diberikan mengembalikan kosong; bukan bukti sukses test atau cleanup oleh review ini.

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
## Keputusan final NO DEBT — 0004 (menggantikan catatan Phase3 sebelumnya)

- Migrasi baru `0004_no_debt_collection.sql` telah diterapkan; 0003 tidak ditulis ulang. Rp600/kg; subsidi Rp12.000 sekali per akun donor; SEMUA mode memakai subsidi lalu deposit. Saldo kurang menolak seluruh transaksi; processor menerima penuh sebagai kredit ledger internal, bukan bukti pencairan bank.
- `monthly_invoice` hanya rekap transaksi lunas. Query rekap wajib `paid_at IS NOT NULL` dan periode `paid_at`; ledger debit baru bertipe `prepaid_deposit`. Kolom baru nullable tanpa backfill: invoice historis tidak boleh dianggap lunas. Tidak ada perubahan ledger historis saat migrasi.
- `collectFoodClaim` / `collect_food_claim(text)`: donor pemilik listing memindai token beneficiary, role/ban/expiry/recall diperiksa, retry mengembalikan timestamp yang sama. Dispute mengunci profil reporter sebelum listing; collection mengunci donor KEY SHARE, listing lalu claim. UI belum wired; race multi-session belum dibuktikan.
- Organisasi/kapasitas tetap self-declared sesuai keputusan pengguna. Risiko manipulasi signup dan akun ganda diterima untuk demo; bukan verifikasi organisasi atau kuota per manusia.
- Deposit hanya trusted/admin: client tidak dapat menulis saldo/ledger. Belum ada endpoint posting top-up, payment provider, verifikasi settlement, referensi pembayaran/idempotency atau rekonsiliasi; E2E pendanaan/pencairan BELUM selesai. Jangan menambahkan gateway palsu. Prosedur posting dipercaya perlu keputusan/provider terpisah.
- Bukti: `scripts/test-phase3-no-debt.mjs` RED pada 0003 (invoice tanpa saldo diterima), GREEN candidate ROLLBACK lalu GREEN deployed. JWT-context SQL role authenticated, BUKAN login/PostgREST/Server Action E2E. Test collection action memakai transport mock.
- TLS authorized=true, TLSv1.3; readback delapan body fungsi cocok sumber migrasi terbaru, lima RPC grants, tujuh RLS tables, sembilan boundary waktu. Fixture baru hanya transaksi ROLLBACK; SELECT memastikan tidak tersimpan. Tidak ada DELETE/cleanup, clock override, commit/push.
- Phase3 tetap IN PROGRESS: concurrent individual quota, authenticated in-window action, seeded RLS replay menyeluruh, UI, adjudikasi FHR-18. Historical fixture IDs masih tidak ditemukan; bukan bukti cleanup.
