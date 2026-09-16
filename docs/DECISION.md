# Log Keputusan Arsitektur (Architectural Decision Records - ADR)

> Status terbaru: bagian NO DEBT / 0004 di bawah menggantikan laporan review lama. TLS/catalog telah terverifikasi; collection RPC tersedia; individual in-window SQL sequential sudah lulus. E2E/race/UI tetap gap.

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
| **ADR-007** | RPC atomik, subsidi lifetime Rp12.000, NO DEBT | Disetujui | Tarif Rp600/kg; pembayaran penuh mitra; Phase3 IN PROGRESS |
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
Platform SiklusPangan memakai 4 role (`donor`, `beneficiary`, `processor`, `admin`); panti adalah beneficiary dengan `is_organization`. Diperlukan mekanisme otorisasi yang aman dan tidak dapat dibobol dari sisi client.

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

## ADR-007: Phase3 — transaksi atomik dan subsidi monetary

- Tarif tetap Rp600/kg. Subsidi platform Rp12.000 sekali seumur akun donor, bukan 100 kg gratis, bukan reset bulanan, bukan deposit tunai.
- Keputusan final menggantikan rancangan pascabayar: subsidi didahulukan; SEMUA sisa tagihan wajib mendebit deposit, termasuk monthly_invoice. Saldo kurang ditolak; tidak ada utang/credit limit. Processor tetap menerima penuh bobot × Rp600.
- Server Actions Zod memakai session client; RPC security-definer memvalidasi auth.uid(), role, banned, stok, kuota Asia/Jakarta dan saldo dengan row lock. Client tidak menentukan harga, saldo, identitas pelaku, atau status collected.
- Handover QR hanya token acak. Retry processor yang sama idempotent, processor lain ditolak. Claim/create belum memiliki idempotency key; setelah timeout periksa riwayat, jangan retry otomatis.
- Laporan collected sebelum safe_until membuat recall dan deadline 24 jam; penalti tidak otomatis. FHR-18 menangani adjudikasi/strike.
- FHR-10–14 milik Fahri; wiring UI bukan klaim penyelesaian Rizal. Phase3 tetap IN PROGRESS: jalur individual dalam jam makan, food collection RPC, hardening/review live dan UI belum lengkap.
- Tidak ada cleanup/delete/migrasi/push pada review ini. Harness live menyimpan fixture, write opt-in wajib. TLS DB wajib verifikasi sertifikat; CA proyek dapat diberikan lewat SUPABASE_DB_SSL_CA.

## Keputusan final NO DEBT — 0004 (menggantikan catatan Phase3 sebelumnya)

- Migrasi baru `0004_no_debt_collection.sql` telah diterapkan; 0003 tidak ditulis ulang. Rp600/kg; subsidi Rp12.000 sekali per akun donor; SEMUA mode memakai subsidi lalu deposit. Saldo kurang menolak seluruh transaksi; processor menerima penuh sebagai kredit ledger internal, bukan bukti pencairan bank.
- `monthly_invoice` hanya rekap transaksi lunas. Query rekap wajib `paid_at IS NOT NULL` dan periode `paid_at`; ledger debit baru bertipe `prepaid_deposit`. Kolom baru nullable tanpa backfill: invoice historis tidak boleh dianggap lunas. Tidak ada perubahan ledger historis saat migrasi.
- `collectFoodClaim` / `collect_food_claim(text)`: donor pemilik listing memindai token beneficiary, role/ban/expiry/recall diperiksa, retry mengembalikan timestamp yang sama. Dispute mengunci profil reporter sebelum listing; collection mengunci donor KEY SHARE, listing lalu claim. UI belum wired; race multi-session belum dibuktikan.
- Organisasi/kapasitas tetap self-declared sesuai keputusan pengguna. Risiko manipulasi signup dan akun ganda diterima untuk demo; bukan verifikasi organisasi atau kuota per manusia.
- Deposit hanya trusted/admin: client tidak dapat menulis saldo/ledger. Belum ada endpoint posting top-up, payment provider, verifikasi settlement, referensi pembayaran/idempotency atau rekonsiliasi; E2E pendanaan/pencairan BELUM selesai. Jangan menambahkan gateway palsu. Prosedur posting dipercaya perlu keputusan/provider terpisah.
- Bukti: `scripts/test-phase3-no-debt.mjs` RED pada 0003 (invoice tanpa saldo diterima), GREEN candidate ROLLBACK lalu GREEN deployed. JWT-context SQL role authenticated, BUKAN login/PostgREST/Server Action E2E. Test collection action memakai transport mock.
- TLS authorized=true, TLSv1.3; readback delapan body fungsi cocok sumber migrasi terbaru, lima RPC grants, tujuh RLS tables, sembilan boundary waktu. Fixture baru hanya transaksi ROLLBACK; SELECT memastikan tidak tersimpan. Tidak ada DELETE/cleanup, clock override, commit/push.
- Phase3 tetap IN PROGRESS: concurrent individual quota, authenticated in-window action, seeded RLS replay menyeluruh, UI, adjudikasi FHR-18. Historical fixture IDs masih tidak ditemukan; bukan bukti cleanup.
