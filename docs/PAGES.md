# SiklusPangan — Dokumentasi Halaman & Fitur

Dokumen ini mencatat seluruh halaman aplikasi, fungsi utama, role yang memakai.
## 1. Matriks Route

| Route | Nama Halaman | Role |
|---|---|---|---|
| `/` | Beranda | Publik |
| `/login` | Masuk | Publik |
| `/signup` | Daftar | Publik |
| `/rescue` | Live Surplus Radar | Beneficiary, publik terbatas |
| `/donate` | Donasi Pangan | Donor |
| `/claims` | Klaim Saya | Beneficiary |
| `/waste` | Limbah Organik | Donor, processor |
| `/waste/scan` | Scan Limbah | Donor, processor |
| `/wallet` | Dompet Sirkular | Donor, processor |
| `/profile` | Profil | Semua user login |
| `/disputes` | Sengketa | Beneficiary, donor, admin |
| `/leaderboard` | Wall of Fame | Publik |
| `/dashboard` | Dashboard Role | Semua user login |
| `/admin` | Dashboard Admin | Admin |
| `/dashboard/esg` | Dashboard ESG | Donor, admin, publik |
| `/wall-of-fame` | Wall of Fame legacy route | Publik |

## 2. Halaman Publik

### `/` — Beranda

Tujuan: menjelaskan produk dan mengarahkan pengguna ke fitur utama.

Fitur:
- Penjelasan Surplus Food Rescue.
- Penjelasan biokonversi limbah organik.
- Penjelasan dampak ESG.
- Tombol ke `/rescue`.
- Tombol ke Wall of Fame.

Belum ada:
- Data statistik live.
- Status session user.
- CTA dinamis berdasarkan role.

### `/login` — Masuk

Tujuan: autentikasi email/password melalui Supabase Auth.

Fitur aktif:
- Input email.
- Input password.
- Validasi input dasar.
- Error login.
- Redirect berdasarkan role:
  - `beneficiary` → `/rescue`
  - `donor`, `processor`, `admin` → `/`
- Link ke `/signup`.

Catatan:
- Route protection middleware aktif (`src/middleware.ts`) dengan role guards ketat.
- Mode demo 1-klik tersedia untuk pengujian cepat juri.

### `/signup` — Daftar

Tujuan: membuat akun dan profil pengguna.

Fitur aktif:
- Nama lengkap.
- Email.
- Password.
- Nomor telepon.
- Alamat.
- Pilihan role:
  - Donor.
  - Beneficiary.
  - Processor.
- Untuk beneficiary:
  - Perorangan.
  - Organisasi.
  - Kapasitas organisasi.
- Validasi Zod.
- Supabase Auth email/password.
- Trigger profil menyimpan metadata ke `profiles`.

Catatan:
- Role `admin` tidak boleh dipilih saat signup.
- Akun demo tersedia untuk pengujian; password demo bukan untuk production.

## 3. Modul A — Surplus Food Rescue

### `/rescue` — Live Surplus Radar

Tujuan: menampilkan makanan surplus yang masih aman dikonsumsi.

Fitur aktif:
- Kartu makanan.
- Foto makanan.
- Jumlah porsi tersisa.
- Waktu tersisa sebelum `safe_until`.
- Filter:
  - Semua.
  - Halal.
  - Vegetarian.
  - Bebas gluten.
- Peringatan bahan berisiko.
- Tombol klaim demo.
- Nama donor dianonimkan menjadi `Donatur Terverifikasi #00X`.
- Alamat/nama warung tidak ditampilkan untuk mencegah penargetan dan perilaku menunggu gratisan.

Sumber foto:
- Saat ini memakai fixture/mock image.
- Target produksi: `food_listings.image_url` dari foto yang diunggah donor.

Belum ada:
- Query listing live dari Supabase.
- Klaim atomik ke database.
- QR token nyata.
- Filter alergi lengkap.
- Geolocation/radius.

### `/donate` — Donasi Pangan

Tujuan: donor mengunggah surplus makanan.

Rencana fitur:
- Upload foto makanan.
- Preview foto sebelum submit.
- Analisis Gemini VLM.
- Human-in-the-loop: donor mengoreksi nama menu, porsi, bahan, dan kategori.
- Input waktu selesai masak.
- Pilihan penyimpanan.
- Kalkulasi `safe_until` oleh deterministic expiry engine.
- Submit ke `food_listings`.
- Preview listing anonim sebelum publikasi.

Validasi penting:
- Gemini tidak menentukan batas aman final.
- `safe_until` wajib dihitung rules engine.
- Foto makanan wajib tersimpan pada `image_url`.
- Nama donor tidak boleh muncul di radar publik.

### `/claims` — Klaim Saya

Tujuan: beneficiary melihat klaim makanan.

Rencana fitur:
- Daftar klaim aktif.
- Status klaim.
- QR token sekali pakai.
- Waktu dan lokasi pengambilan.
- Status sudah diambil/belum.
- Pembatalan klaim bila masih diizinkan.
- Batas satu klaim per jendela makan.

Aturan bisnis:
- Jendela makan siang: 11.00–14.00.
- Jendela makan malam: 17.00–20.00.
- Organisasi dapat klaim maksimal sesuai kapasitas.
- Listing kecil dialihkan ke radar individu jika di bawah 50% kapasitas organisasi.

## 4. Modul B — Biokonversi Limbah

### `/waste` — Limbah Organik

Tujuan: donor mencatat limbah makanan yang tidak layak konsumsi.

Rencana fitur:
- Daftar batch limbah milik donor.
- Form berat limbah.
- Kategori target:
  - BSF/maggot.
  - Pakan unggas/ikan.
  - Kompos/biodigester.
- Tarif per kilogram.
- Estimasi biaya.
- Status pengambilan.
- Generate QR handover.
- Riwayat batch.

### `/waste/scan` — Scan Limbah

Tujuan: memeriksa kontaminasi limbah sebelum diserahkan.

Rencana fitur:
- Foto wadah limbah.
- Gemini VLM mendeteksi kontaminan:
  - Plastik.
  - Styrofoam.
  - Kawat.
  - Tusuk sate.
- Rekomendasi pengolah berdasarkan nutrisi.
- Penolakan jika limbah terlalu terkontaminasi.
- Human review sebelum submit.

### `/wallet` — Dompet Sirkular

Tujuan: menampilkan saldo dan transaksi reverse tipping fee.

Fitur rencana:
- Saldo donor.
- Kredit processor.
- Debit biaya pengolahan.
- Kredit insentif processor.
- Deposit prabayar.
- Faktur bulanan.
- Riwayat transaksi.

Keamanan:
- Ledger hanya dapat ditulis Server Action/RPC tepercaya.
- Client hanya membaca transaksi miliknya.
- Tidak boleh ada perubahan saldo melalui client langsung.

## 5. Modul C — ESG & Transparansi

### `/leaderboard` — Wall of Fame

Tujuan: menampilkan dampak donor tanpa membocorkan identitas sensitif.

Rencana fitur:
- Peringkat donor berdasarkan porsi terselamatkan.
- Peringkat berdasarkan kilogram limbah dialihkan.
- Nama publik anonim atau nama organisasi yang disetujui.
- Total dampak kumulatif.
- Badge kontribusi.

Tidak boleh ditampilkan:
- Alamat pribadi.
- Nomor telepon.
- Lokasi detail donor.
- Informasi internal transaksi.

### `/dashboard/esg` — Dashboard ESG

Tujuan: menampilkan dampak lingkungan dan sosial.

Rencana metrik:
- Total porsi makanan terselamatkan.
- Total kilogram limbah dialihkan.
- Estimasi metana dicegah.
- Estimasi `CO2e` dikurangi.
- Rupiah yang dihemat.
- Jumlah klaim berhasil.
- Jumlah batch biokonversi.

Rumus dokumentasi:
- `Waste Diverted = portions × 0.35 kg + waste batches kg`
- `CH4 prevented = Waste Diverted × 0.04`
- `CO2e reduction = Waste Diverted × 0.58`

### `/dashboard` — Dashboard Role

Tujuan: titik masuk setelah login untuk dashboard sesuai role.

Rencana routing internal:
- Beneficiary: klaim aktif dan radar.
- Donor: listing, waste batch, saldo, dampak.
- Processor: handover, batch masuk, insentif.
- Admin: moderasi, sengketa, audit.

## 6. Profil, Moderasi, dan Sengketa

### `/profile` — Profil

Tujuan: pengguna mengelola data akun non-sensitif.

Fitur rencana:
- Nama.
- Nomor telepon.
- Alamat.
- Tipe beneficiary.
- Kapasitas organisasi.
- Preferensi diet.
- Logout.

Kolom sensitif yang tidak boleh diedit user biasa:
- `role`.
- `strikes_count`.
- `is_banned`.
- `credit_balance`.

### `/disputes` — Sengketa

Tujuan: menangani laporan makanan basi atau tidak sesuai.

Fitur rencana:
- Beneficiary membuat laporan.
- Upload bukti foto.
- Listing dibekukan sementara.
- Donor mengirim sanggahan dalam 24 jam.
- Admin memutuskan sengketa.
- Strike tercatat jika pelanggaran terverifikasi.
- Strike ketiga memblokir donor.

### `/admin` — Dashboard Admin

Tujuan: moderasi dan audit operasional.

Fitur rencana:
- Daftar user.
- Perubahan status banned.
- Review sengketa.
- Review listing.
- Audit transaksi.
- Audit RLS dan data.
- Statistik sistem.

Akses wajib:
- Hanya `role = admin`.
- Validasi ulang di Server Action dan RLS.
- Tidak cukup hanya menyembunyikan link UI.

## 7. Route Pendukung yang Disarankan

Route berikut belum dibuat, tetapi dibutuhkan agar alur produk lengkap:

| Route | Fungsi |
|---|---|
| `/donate/new` | Form membuat listing makanan |
| `/claims/[id]` | Detail klaim dan QR token |
| `/waste/new` | Form membuat batch limbah |
| `/waste/[id]` | Detail batch dan handover |
| `/handover/scan` | Processor scan QR handover |
| `/auth/callback` | Callback konfirmasi email |
| `/settings` | Pengaturan akun |
| `/reports/esg` | Preview/export laporan ESG |

## 8. Status Backend Utama

Sudah tersedia:
- Supabase browser/server client.
- Email/password signup dan login.
- Role redirect dasar.
- Schema database dan RLS aktif.
- Signup trigger menyimpan metadata profil.
- Gemini structured output.
- Zod AI guard.
- Deterministic expiry engine.
- Rules quota dasar.

Belum tersedia:
- (Seluruh backlog kritis telah selesai 100% dan terintegrasi).

## 9. Urutan Implementasi Berikutnya
1. [x] Buat `/donate` + form donasi & rules BPOM.
2. [x] Buat Server Action `createFoodListing()`.
3. [x] Ganti fixture `/rescue` dengan query live & fallback.
4. [x] Buat Server Action `claimFoodToken()` secara atomik.
5. [x] Buat detail klaim + QR & pembatalan klaim.
6. [x] Buat `/waste` dan handover QR manifest.
7. [x] Buat processor scanner serah terima.
8. [x] Buat wallet ledger RPC/Server Actions.
9. [x] Buat middleware route protection (`src/middleware.ts`) & `/auth/callback`.
10. [x] Isi dashboard ESG ISO 14044 dan konsol admin.
