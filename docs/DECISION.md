# Log Keputusan Arsitektur (Architectural Decision Records - ADR)

**Proyek:** SiklusPangan  
**Kompetisi:** Vibe Code TCC 2026 (Universitas Trunojoyo Madura)  
**Status Dokumen:** Active & Enforced  

---

## Ringkasan Log ADR

| ADR ID | Judul Keputusan | Status | Dampak Utama |
|---|---|---|---|
| **ADR-001** | Adopsi Next.js 15 App Router & Server Actions | Disetujui | Mengeliminasi boilerplate REST API, mempercepat mutasi data |
| **ADR-002** | Metodologi *Harness-Driven Vibe Coding* | Disetujui | Menjamin akuntabilitas AI & validasi kode otomatis |
| **ADR-003** | Hibrida *Deterministic Rules Engine* + Gemini VLM | Disetujui | Mengunci keamanan masa expired makanan bebas halusinasi |
| **ADR-004** | PostgreSQL & Supabase Row Level Security (RLS) | Disetujui | Integritas relasi transaksi & keamanan data multi-peran |
| **ADR-005** | Skema Logistik Terbalik (*Reverse Tipping Fee*) & QR Handover | Disetujui | Model ekonomi sirkular limbah & insentif mitra pengolah |
| **ADR-006** | *Offline Fixture Fallback Harness* untuk Penjurian UTM | Disetujui | Ketahanan sistem $100\%$ dari kendala sinyal internet saat demonstrasi |

---

## ADR-001: Adopsi Next.js 15 App Router & Server Actions

### Konteks & Permasalahan
Pengembangan aplikasi web kompetisi Vibe Code membutuhkan latensi pengematan kode yang tinggi, koordinasi data yang cepat antara antarmuka (*frontend*) dan basis data (*backend*), serta performa peramban seluler yang ringan.

### Keputusan
Menggunakan **Next.js 15 dengan App Router, React 19, dan Server Actions**.

### Konsekuensi & Alasan
* **Keuntungan:**
  * Mengeliminasi kebutuhan membuat *controller*, *route handler*, dan *express server* terpisah.
  * Mutasi data dapat dipanggil secara langsung sebagai fungsi asinkron bertipe ketat (*type-safe functions*) dari komponen UI.
  * *Server Components* mempercepat rendering radar surplus tanpa pengiriman Javascript berat ke peramban.
* **Risiko & Mitigasi:**
  * Kurva pembelajaran *Server Actions*. Dimitigasi dengan penguncian pola input menggunakan pustaka validasi Zod.

---

## ADR-002: Metodologi *Harness-Driven Vibe Coding*

### Konteks & Permasalahan
Penggunaan *Generative AI* untuk menulis kode (*vibe coding*) sering kali memicu regresi fungsi, *broken build*, dan ketidakpatuhan terhadap arsitektur dasar jika tidak diberikan batasan rekayasa.

### Keputusan
Menerapkan **Vibe Coding Harness Architecture** sebagai pengendali penuh seluruh siklus pengembangan.

### Konsekuensi & Alasan
* **Keuntungan:**
  * Pengembang/AI bekerja di dalam koridor aturan yang ditentukan oleh `.cursorrules` dan `HARNESS.md`.
  * Verifikasi tipe data (`tsc --noEmit`) dan tes integrasi build (`npm run build`) dijalankan secara otomatis sebelum fitur dinyatakan selesai.
  * Memenuhi regulasi kompetisi TCC 2026 UTM terkait transparansi rekayasa prompt dan pemahaman arsitektur secara mandiri.

---

## ADR-003: Hibrida *Deterministic Rules Engine* + Gemini VLM

### Konteks & Permasalahan
Model bahasa besar (LLM/VLM) memiliki sifat probabilistik yang berisiko mengalami halusinasi saat menentukan estimasi jam basi makanan, yang dapat membahayakan kesehatan penerima makanan surplus.

### Keputusan
Memisahkan peran AI dan Logika Bisnis:
1. **Gemini 2.0 Flash VLM:** Bertanggung jawab murni pada analisis visual (ekstraksi nama menu, porsi visual, bahan rentan basi, kontaminan limbah).
2. **Deterministic Rules Engine:** Bertanggung jawab mengkalkulasi waktu kedaluwarsa (`safe_until`), pembatasan kuota panti, dan rumus reduksi emisi.

### Konsekuensi & Alasan
* **Keuntungan:** Menjamin $100\%$ kepatuhan keamanan pangan tanpa risiko halusinasi waktu kedaluwarsa.

---

## ADR-004: PostgreSQL & Supabase Row Level Security (RLS)

### Konteks & Permasalahan
Platform SiklusPangan melayani 5 peran pengguna berbeda (`donor`, `beneficiary`, `orphanage`, `processor`, `admin`). Diperlukan mekanisme otorisasi yang aman dan tidak dapat dibobol dari sisi client.

### Keputusan
Menggunakan **Supabase PostgreSQL 15 dengan penegakan Row Level Security (RLS)** langsung di lapisan database engine.

### Konsekuensi & Alasan
* **Keuntungan:**
  * Meskipun token API dipanggil dari client component, basis data menolak transaksi yang tidak sesuai dengan *policy* RLS.
  * *Supabase Realtime* memungkinkan radar makanan terbarui secara instan saat donatur mengunggah makanan baru.

---

## ADR-005: Skema *Reverse Tipping Fee* & QR Handover Ledger

### Konteks & Permasalahan
Limbah organik basi selama ini dibuang ke TPA karena biaya pengolahan yang tinggi dan ketidaktersediaan insentif bagi mitra pengolah (pembudidaya maggot BSF dan peternak).

### Keputusan
Menerapkan skema **Insentif Logistik Terbalik (*Reverse Tipping Fee*)**: Donatur membayar tarif mikro (Rp600/kg) yang diteruskan sebagai insentif operasional mitra penjemput via **Dynamic QR Code Handover**.

### Konsekuensi & Alasan
* **Keuntungan:** Donatur menghemat biaya pembuangan limbah dibanding jasa swasta konvensional, sementara mitra pengolah mendapatkan pakan ternak produktif sekaligus insentif tunai.

---

## ADR-006: *Offline Fixture Fallback Harness* untuk Penjurian TCC 2026

### Konteks & Permasalahan
Lokasi aula pameran dan penjurian final kompetisi (UTM) berpotensi mengalami kelebihan beban jaringan internet (*network congestion*), yang dapat menyebabkan demonstrasi live terhenti (*lag/timeout*).

### Keputusan
Menyediakan **Offline Resilience Harness**: Mekanisme pencegat *timeout* ($> 3000\text{ ms}$) yang secara otomatis mengalihkan antarmuka pemindai dan radar ke *Local Mock Fixtures* di LocalStorage peramban.

### Konsekuensi & Alasan
* **Keuntungan:** Demonstrasi produk di hadapan dewan juri dijamin berjalan $100\%$ mulus tanpa risiko kegagalan sistem akibat masalah konektivitas internet.
