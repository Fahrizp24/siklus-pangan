# Pitch Deck & Live Demo Script: SiklusPangan

**Event:** Vibe Code Competition — TCC 2026 (Universitas Trunojoyo Madura)  
**Proyek:** SiklusPangan — Sistem Sirkular Penyelamatan Pangan & Biokonversi Terpadu Berbasis AI Deterministic & ESG Scope 3  
**Tim Pengembang:**
- **Fahri (P1):** Lead Backend, Data Infrastructure, API & Logic
- **Rizal (P2):** Lead Frontend, UI/UX Design System, Aesthetics & Impact Dashboards

---

## 📑 Slide Deck Outline (Struktur Presentasi)

### Slide 1: Cover & Identitas
- **Judul:** SiklusPangan — Mengubah Beban Food Waste Menjadi Berkah Sirkular & Kredit Karbon
- **Tagline:** *From Surplus to Sustenance, From Waste to Wealth.*
- **Sub-tagline:** Sistem Sirkular Penyelamatan Pangan Berlebih & Biokonversi Organik BSF Pertama di Indonesia dengan Jaminan Kepatuhan BPOM & Audit ESG Scope 3 ISO 14044.
- **Kategori Lomba:** Vibe Code Competition TCC 2026 UTM

---

### Slide 2: The Burning Problem (Krisis Pangan & Emisi di Indonesia)
- **Fakta 1 (Food Loss & Waste):** Indonesia menghasilkan **23 – 48 juta ton timbulan sampah makanan per tahun** (Bappenas), setara kerugian ekonomi **Rp 213 – 551 Triliun/tahun** (4-5% PDB).
- **Fakta 2 (Ketimpangan Sosial):** Di sisi lain, **21,6 juta orang Indonesia** masih mengalami kerawanan pangan (indeks kelaparan moderat-berat).
- **Fakta 3 (Bom Waktu Metana):** Sampah organik di TPA (seperti Bantar Gebang & Suwung Bali) menghasilkan **Gas Metana ($CH_4$)**, yang memiliki potensi pemanasan global **28x lebih berbahaya daripada $CO_2$**.
- **The Core Bottleneck:** 
  1. Donatur (Hotel/Katering) takut mendonasikan surplus karena **risiko hukum keracunan**.
  2. Lembaga amal kesulitan memvalidasi **kelayakan konsumsi** secara cepat.
  3. Sisa yang sudah tidak layak konsumsi dibuang begitu saja ke TPA tanpa ada insentif ekonomi untuk memilah.

---

### Slide 3: Solusi Kami — "The Two-Stage Cascade Model"
SiklusPangan tidak hanya membagikan makanan, melainkan mengoperasikan **Arsitektur Sirkular Dua Tingkat (Two-Stage Cascade)**:

```
[ Surplus Makanan Hotel / Restoran / Katering ]
                     │
                     ▼
       ┌───────────────────────────┐
       │   STAGE 1: HUMAN RESCUE   │ ──(Layak Konsumsi)──► Panti Asuhan & Dhuafa
       │  (AI VLM + BPOM Rules)   │                       (0% Biaya, Terjamin Aman)
       └─────────────┬─────────────┘
                     │ (Melewati batas safe_until / Tak Layak)
                     ▼
       ┌───────────────────────────┐
       │ STAGE 2: BSF BIOCONVERSION│ ──(Biokonversi 24 Jam)► Maggot BSF & Pupuk Kasgot
       │  (Reverse Tipping Fee)    │                       (Donatur dapat INSENTIF TUNAI)
       └─────────────┬─────────────┘
                     │
                     ▼
       ┌───────────────────────────┐
       │   STAGE 3: ESG AUDIT TRAIL│ ──(Klaim Emisi)──────► Sertifikat Karbon Scope 3
       │  (ISO 14044 & Blockchain) │                       (Laporan CSR & Pajak Karbon)
       └───────────────────────────┘
```

---

### Slide 4: Inovasi Rekayasa — Vibe Coding & Deterministic Safety Engine
Bagaimana SiklusPangan menjamin keandalan tanpa kompromi?
1. **Zero Hallucination Safety Engine:**
   - AI Gemini VLM hanya digunakan untuk *ekstraksi persepsi visual* (jenis makanan, alergen, estimasi volume).
   - Penentuan masa kedaluwarsa (`safe_until`) **100% dieksekusi oleh Deterministic Rules Engine** berbasis SOP BPOM (Maks. 4 jam suhu ruang untuk makanan kering, maks. 2 jam untuk makanan basah/santan/susu).
2. **Dynamic Quota & Fair Distribution Guard:**
   - Mencegah penimbunan donasi dengan ambang batas kuota: surplus < 50% kapasitas dialokasikan untuk pejuang nafkah/individu, sementara porsi massal dialokasikan untuk panti asuhan terverifikasi.
3. **Cryptographic Claim Tokens & Three-Strike Dispute:**
   - Pengambilan surplus menggunakan Token QR OTP acak berbasis hash SHA-256 yang kadaluwarsa otomatis.
   - Sistem sengketa 3-strike otomatis membekukan donatur jika terbukti melanggar sanitasi.
4. **Resilience & Offline First:**
   - Dilengkapi *Fallback Harness* lokal sehingga aplikasi tetap dapat mendemonstrasikan alur kerja secara mulus dalam kondisi jaringan terbatas.

---

### Slide 5: Model Finansial — Reverse Tipping Fee (Limbah Jadi Cuan)
- Di sistem konvensional, restoran membayar **Tipping Fee** ke truk sampah untuk membuang limbah ke TPA.
- Di SiklusPangan, berlaku **Reverse Tipping Fee**:
  - Donatur yang memilah limbah organik mendapatkan **payout langsung** (Rp 500 – Rp 7.500/kg) ke Dompet Sirkular.
  - Fasilitas biokonversi BSF membeli limbah terpilah sebagai pakan larva berprotein tinggi (42% protein kasar) yang bernilai jual tinggi untuk pakan unggas & perikanan.
  - Rasio **Social Return on Investment (S-ROI) 1 : 4.8** — setiap Rp 1.000 operasional menghasilkan nilai manfaat pangan & lingkungan sebesar Rp 4.800.

---

### Slide 6: Dampak ESG & Sertifikat Karbon Terverifikasi
- **Scope 3 Category 5 Accounting:** Menghitung pengurangan emisi GRK secara presisi berdasarkan metodologi IPCC Waste Model & ISO 14044 LCA.
- **Transparansi Kriptografis:** Setiap gram limbah yang dialihkan dari TPA memiliki nomor sertifikat digital dan hash ledger yang tidak dapat dipalsukan.
- **Export Ready:** Satu klik menghasilkan dokumen PDF Sertifikat ESG siap cetak untuk laporan tahunan keberlanjutan korporat.

---

### Slide 7: Roadmap Eksekusi & Skalabilitas Nasional
- **Q2 2026 (Piloting Bangkalan & Surabaya):** Integrasi 30 hotel/katering mitra dan 15 panti asuhan di Jawa Timur.
- **Q4 2026 (Ekspansi Bali & Jabodetabek):** Integrasi industri pariwisata Bali (zona darurat TPA Suwung) dan fasilitator biokonversi lalat tentara hitam komersial.
- **2027 (National Carbon Registry):** Integrasi API ke IDXCarbon & SRN PPI Kementerian LHK untuk monetisasi unit karbon sirkular.

---

## 🎬 Skenario Live Demo 3 Menit (Scripted Demo Flow)

> **Durasi:** 180 Detik (3 Menit)  
> **Presenter:** Fahri (Narasi & Arsitektur) + Rizal (Live Navigation di Laptop)  
> **URL Basis:** `http://localhost:3000` (atau deployment preview)

```
[00:00 - 00:30] DETIK 0 - 30: Registrasi Donasi Pangan Cerdas (/donate)
- Narator: "Bayangkan sebuah hotel bintang 4 di Madura baru saja menyelesaikan sesi prasmanan makan siang dengan 50 porsi surplus Rendang & Nasi Kuning."
- Aksi Rizal:
  1. Masuk ke menu "Donasi Pangan" (`/donate`).
  2. Tunjukkan hasil AI Gemini VLM: mendeteksi jenis makanan, potensi alergen kacang/santan, dan estimasi berat.
  3. Sorot "Deterministic BPOM Expiry Engine": Sistem mengunci batas konsumsi aman tepat pukul 14:00 (2 jam ketat karena mengandung santan).
  4. Klik tombol hijau "Publikasikan ke Live Radar". Muncul toast konfirmasi dengan nomor listing aktif.
```

```
[00:30 - 01:15] DETIK 30 - 75: Live Radar & Klaim Beneficiary (/rescue & /claims)
- Narator: "Secara seketika, donasi tersebut langsung muncul di radar publik tanpa mengungkap identitas hotel (100% anonim untuk menjaga privasi donor)."
- Aksi Rizal:
  1. Klik "Penyelamatan Pangan" (`/rescue`). Listing donasi yang baru saja dibuat langsung berada di posisi paling atas secara real-time!
  2. Filter berdasarkan jarak atau kuota dhuafa.
  3. Klik tombol "Ambil Makanan".
  4. Sistem otomatis mengarahkan ke halaman Klaim (`/claims`).
  5. Tunjukkan Dynamic QR Code Token & OTP SHA-256 untuk serah terima fisik di lokasi donatur.
  6. Klik "Unduh Bukti Klaim (PDF)" untuk menunjukkan kesiapan cetak digital.
```

```
[01:15 - 02:00] DETIK 75 - 120: Cascade ke Limbah Organik & Reverse Tipping Fee (/waste & /wallet)
- Narator: "Bagaimana jika makanan melewati batas safe_until atau merupakan sisa kupasan dapur? Di sinilah Stage 2 kami bekerja: Biokonversi BSF."
- Aksi Rizal:
  1. Buka halaman "Limbah Organik" (`/waste`).
  2. Klik "Daftarkan Batch Limbah Organik (Terbitkan Manifest)".
  3. Tunjukkan manifest digital batch `#SKP-ORG-2026-X` dan pemindai serah terima driver BSF.
  4. Klik menu "Dompet Sirkular" (`/wallet`).
  5. Tunjukkan saldo Rp 14.850.000 dari akumulasi Reverse Tipping Fee, rincian buku besar transaksi blockchain hash, dan opsi pencairan instan BI-FAST.
```

```
[02:00 - 02:45] DETIK 120 - 165: Dasbor ESG Scope 3 & Cetak Sertifikat ISO 14044 (/dashboard)
- Narator: "Bagi donatur korporat, insentif terbesar adalah pelaporan ESG dan kredit pajak karbon."
- Aksi Rizal:
  1. Buka "Dashboard ESG" (`/dashboard`).
  2. Perlihatkan metrik reduksi emisi metana 3.368 kg CH4 dan 48.836 kg CO2e yang dicegah dari TPA.
  3. Scroll ke tabel audit log pihak ketiga (TÜV Rheinland & PT Sucofindo).
  4. Klik ikon Mata "Pratinjau Sertifikat" pada salah satu baris audit.
  5. Muncul modal resmi Sertifikat Digital Emisi Karbon berstandar ISO 14044 & GHG Protocol Scope 3 lengkap dengan stempel verifikasi auditor!
  6. Klik "Cetak Sertifikat" (`window.print()`).
```

```
[02:45 - 03:00] DETIK 165 - 180: Penutup & Call to Action (/leaderboard)
- Narator: "Terakhir, transparansi publik diwujudkan melalui Wall of Fame (`/leaderboard`), mendorong kompetisi hijau antar jaringan bisnis."
- Aksi Rizal:
  1. Klik "Wall of Fame" (`/leaderboard`), tunjukkan podium donatur terbaik.
- Narator: "Dengan SiklusPangan, zero food waste bukan lagi utopia, melainkan model bisnis sirkular yang menguntungkan, aman secara hukum, dan menyelamatkan bumi. Terima kasih!"
```

---

## 🎯 Lembar Bocoran Tanya Jawab Juri (Judge Q&A Cheat Sheet)

| Pertanyaan Kemungkinan dari Juri | Jawaban Taktis & Bukti Kode / Arsitektur |
|---|---|
| **1. "Bagaimana jika penerima manfaat keracunan makanan? Siapa yang bertanggung jawab?"** | **Jawaban:** SiklusPangan menerapkan *Three-Layer Protection*: (1) **Deterministic BPOM Engine** mengunci durasi maksimal 2-4 jam tanpa campur tangan manusia; (2) Penerima menandatangani *Good Samaritan waiver* digital sesuai standar keamanan pangan; (3) Makanan wajib dikonsumsi sebelum jendela `safe_until`. Jika lewat 1 menit saja, listing otomatis ditarik dari radar dan dialihkan ke pakan maggot BSF. |
| **2. "Mengapa tidak membiarkan LLM/AI menentukan sendiri batas aman makanan?"** | **Jawaban:** **LLM memiliki risiko halusinasi (stochastic parrot).** Untuk urusan kesehatan manusia, kami menerapkan *Strict Separation of Concerns*: AI Gemini Multimodal hanya bertugas mengenali entitas visual (OCR & klasifikasi bahan). Logika masa aman dieksekusi oleh modul murni TypeScript deterministik (`src/lib/rules/expiry.ts`) yang diaudit dengan unit test 100% lolos. |
| **3. "Bagaimana platform memperoleh pendapatan (Business Model)?"** | **Jawaban:** Platform beroperasi dengan model B2B sirkular: (1) **Margin Selisih Biaya Biokonversi:** Membeli limbah Rp 500/kg dari restoran dan menyalurkan ke pengolah BSF Rp 800/kg; (2) **SaaS ESG Reporting Subscription:** Biaya langganan API audit dan sertifikat karbon otomatis untuk korporasi hotel/supermarket; (3) **Carbon Offset Commission:** Bagi hasil 10% dari penjualan unit kredit karbon Scope 3 di bursa karbon. |
| **4. "Apakah sistem bisa berjalan jika koneksi internet di lapangan putus?"** | **Jawaban:** **Sangat bisa.** Kami telah mengimplementasikan *Resilience Harness* (`src/lib/harness/resilience.ts`) dengan timeout fallback 3000ms dan state caching lokal di `localStorage`. Driver BSF dan kurir panti tetap dapat memverifikasi token klaim secara offline. |
| **5. "Bagaimana mencegah donasi fiktif untuk mengejar ranking Wall of Fame?"** | **Jawaban:** Setiap donasi memerlukan verifikasi fisik dua arah (Dual-Handshake) melalui pemindaian QR Code antara donor dan penerima manfaat. Volume limbah biokonversi diverifikasi ulang menggunakan data timbangan terkalibrasi di hub BSF sebelum insentif dompet dicairkan. |
