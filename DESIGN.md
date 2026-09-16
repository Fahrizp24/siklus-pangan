---
name: SiklusPangan
description: Ekosistem sirkularitas pangan terintegrasi, audit emisi Scope 3, dan penyelamatan surplus pangan.
colors:
  primary: "#00AA13"
  primary-deep: "#005A10"
  secondary: "#0B1B3D"
  neutral-ink: "#151C24"
  neutral-bg: "#FFFFFF"
  neutral-muted: "#F1F5F9"
  muted-foreground: "#64748B"
  accent-soft: "#E8F8EA"
  border: "#E2E8F0"
  warning: "#F59E0B"
  destructive: "#EF4444"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "normal"
  body:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.02em"
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "16px"
  2xl: "24px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.lg}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.lg}"
    padding: "10px 18px"
  card-container:
    backgroundColor: "{colors.neutral-bg}"
    rounded: "{rounded.xl}"
    padding: "24px"
---

# Design System: SiklusPangan

## 1. Overview

**Creative North Star: "The Circular Ledger"**

SiklusPangan dibangun di atas metafora buku besar sirkular digital yang mencatat setiap gram pangan berharga dan setiap kilogram reduksi gas rumah kaca secara transparan. Antarmuka mengutamakan kejelasan data operasional, presisi sensorik (waktu kedaluwarsa BPOM & timbangan digital IoT), dan keandalan korporat kelas enterprise.

Desain menolak segala bentuk dekorasi artifisial, scaffold AI usang, dan kebisingan visual yang tidak berdasar. Setiap angka, status pill, dan kartu hidangan didesain untuk dapat diverifikasi seketika oleh mata manusia dalam alur kerja yang sibuk (dapur hotel, relawan panti asuhan, atau operator armada biokonversi BSF).

**Key Characteristics:**
- **Crisp & Tactile Utility**: Kontur batas tegas, kontras tinggi, dan umpan balik interaksi yang responsif.
- **Light Theme Enterprise**: Latar putih jernih (#FFFFFF) dipadukan dengan tinta gelap kontras (#151C24) dan aksen hijau sirkular (#00AA13).
- **Zero Fluff Affordance**: Setiap badge dan label merepresentasikan status data nyata, tanpa teks eyebrow atau dummy status berulang.

## 2. Colors

Karakter palet menggabungkan kesegaran ekologis bio-sirkular dengan ketegasan warna korporat audit finansial.

### Primary
- **Emerald Circular Green** (#00AA13 / hsl(127, 100%, 33.3%)): Identitas inti sirkularitas, tombol aksi utama (Primary CTA), dan penanda status sukses verifikasi.
- **Deep Bio Forest** (#005A10 / hsl(131, 100%, 17.6%)): Varian gelap untuk state hover tombol primer dan teks kontras pada latar terang.

### Secondary
- **Enterprise Deep Navy** (#0B1B3D / hsl(221, 69%, 14.1%)): Penanda otoritas hukum, badge verifikasi audit ISO/LCA, dan header navigasi sekunder.

### Neutral
- **Pure Canvas Background** (#FFFFFF): Latar utama kanvas aplikasi yang bersih dan profesional.
- **Ink Primary** (#151C24 / hsl(212, 26%, 11.2%)): Teks utama berkontras tinggi (≥12:1 terhadap kanvas putih) untuk keterbacaan sempurna.
- **Muted Slate Surface** (#F1F5F9 / hsl(210, 20%, 96%)): Latar belakang container netral, sel tabel sekunder, dan area filter.
- **Muted Foreground** (#64748B / hsl(215, 16%, 45%)): Teks pendukung, deskripsi kartu, dan label metadata (memenuhi kontras ≥4.5:1).
- **Subtle Border Line** (#E2E8F0 / hsl(214, 20%, 90%)): Garis pemisah tegas dan presisi tipis (1px) tanpa efek berbayang berlebih.
- **Eco Accent Soft** (#E8F8EA / hsl(127, 60%, 95%)): Latar badge aktif dan highlight metrik positif.

### Named Rules
**The Single-Voice Accent Rule.** Aksen hijau primer (#00AA13) dibatasi maksimal 10–15% dari total luas permukaan layar. Nilai aksen terletak pada kelangkaannya yang memandu mata ke tindakan utama.
**The High-Contrast Integrity Rule.** Tidak ada teks abu-abu terang yang sulit dibaca; seluruh teks bodi dan deskripsi wajib mempertahankan kontras rasio minimal 4.5:1.

## 3. Typography

**Display & Headline Font:** Plus Jakarta Sans (dengan fallback `system-ui, -apple-system, sans-serif`)
**Body Font:** Plus Jakarta Sans
**Label & Numeric Font:** Inter & JetBrains Mono

**Character:** Tipografi modern berkontur tegas dengan geometri humanist yang ramah namun tetap formal untuk pelaporan korporat.

### Hierarchy
- **Display** (Bold 800, clamp(2rem, 4vw, 3.25rem), line-height: 1.15, tracking: -0.03em): Headline halaman utama pada kartu hero.
- **Headline** (Bold 700, 1.5rem–1.75rem, line-height: 1.25, tracking: -0.02em): Judul section operasional dan kartu utama.
- **Title** (Semi-bold 600, 1.0rem–1.125rem, line-height: 1.35): Judul kartu makanan surplus, nama metrik, dan sub-header modal.
- **Body** (Regular 400 & Medium 500, 0.875rem / 14px, line-height: 1.5, max-width: 65–75ch): Deskripsi alur, petunjuk verifikasi, dan paragraf audit.
- **Label** (Semi-bold 600, 0.75rem / 12px, tracking: 0.02em): Pill status, filter pill, dan tombol aksi.
- **Monospace Data** (Bold 700, font-mono): Kode batch anonim (#00X), token timbangan IoT, dan nilai numerik fiskal dompet.

### Named Rules
**The No-Eyebrow Rule.** Dilarang meletakkan teks huruf kapital kecil dengan tracking renggang (eyebrow/kicker) di atas judul section. Judul harus berdiri sendiri dengan kekuatan hierarki tipografi.
**The Balance Line Rule.** Seluruh elemen H1–H3 wajib menerapkan `text-wrap: balance` untuk mencegah baris menggantung (orphans).

## 4. Elevation

SiklusPangan menggunakan filosofi **Tonal Boundary & Ambient Depth**. Kedalaman antarmuka dicapai melalui batas garis tepi halus (1px border #E2E8F0) yang didukung bayangan mikroskopis lembut, bukan bayangan gelap yang dramatis.

### Shadow Vocabulary
- **Card Rest** (`box-shadow: 0 4px 24px -4px rgba(11, 27, 61, 0.05)`): Bayangan difus lembut pada kartu hero dan kontainer utama.
- **Interactive Lift** (`box-shadow: 0 6px 20px -2px rgba(11, 27, 61, 0.08)`): Peningkatan elevasi saat kartu atau tombol di-hover pengguna.
- **Control Crisp** (`box-shadow: 0 1px 2px 0 rgba(11, 27, 61, 0.05)`): Bayangan mikro pada tombol dan input field untuk sensasi taktil.

### Named Rules
**The Single-Surface Rule.** Permukaan kartu bersifat datar pada posisi diam (flat at rest). Elevasi hanya muncul sebagai respons langsung terhadap interaksi kursor atau fokus keyboard.

## 5. Components

Setiap komponen dibangun dengan prinsip taktil terukur, radius presisi, dan affordance yang intuitif.

### Buttons
- **Shape**: Sudut melengkung halus (10px–12px radius, `rounded-xl`).
- **Primary**: Latar `#00AA13`, teks putih `#FFFFFF`, padding vertikal 10px horizontal 18px. Hover: menggelap ke `#005A10` dengan transisi 150ms.
- **Secondary**: Latar `#0B1B3D`, teks putih `#FFFFFF`.
- **Outline**: Border 1px `#E2E8F0`, latar transparan, hover ke `#F1F5F9`.

### Surplus Food Card
- **Corner Style**: 16px radius (`rounded-2xl`), border 1px `#E2E8F0`.
- **Top Header**: Kode donatur anonim (#00X) di kiri, badge sisa waktu kedaluwarsa di kanan. Bersih dari alamat panjang.
- **Image Container**: Foto hidangan penuh tanpa tertutup overlay badge teks hitam.
- **Body**: Judul menu, kuota porsi tersisa (`35 Porsi Tersisa`), dan tag diet/halal terverifikasi.
- **Footer**: Label subsidi korporat di kiri, tombol "Klaim Jatah" (QR) di kanan.

### Status Pills
- **Active / Success**: Latar `#E8F8EA`, border `#00AA13/20`, teks `#00AA13`, dot hijau solid.
- **Pending / Warning**: Latar `#FEF3C7`, border `#F59E0B/20`, teks `#B45309`.
- **Neutral / Muted**: Latar `#F1F5F9`, border `#E2E8F0`, teks `#64748B`.

### Inputs / Form Fields
- **Stroke**: 1px border `#E2E8F0`, latar `#FFFFFF`, radius 8px (`rounded-lg`).
- **Focus**: Border transisi ke `#00AA13` dengan ring tipis `focus:ring-1 focus:ring-primary`.

## 6. Do's and Don'ts

### Do:
- **Do** gunakan rasio kontras teks minimal 4.5:1 pada setiap teks bodi dan deskripsi.
- **Do** tampilkan kode batch donatur anonim (#00X) untuk menjaga martabat donatur dan penerima.
- **Do** gunakan satuan porsi yang tegas ("35 Porsi Tersisa") dengan warna aksen primer.
- **Do** terapkan `text-wrap: balance` pada judul utama.
- **Do** batasi durasi animasi status dan hover pada rentang 150ms–250ms.

### Don't:
- **Don't** tambahkan teks eyebrow/kicker uppercase berulang di atas setiap judul section.
- **Don't** gunakan badge telemetri tiruan atau dummy pulse indicator yang tidak terhubung ke data fungsional.
- **Don't** tampilkan overlay kotak hitam di atas foto makanan yang menutupi gambar hidangan.
- **Don't** buat kartu di dalam kartu bertingkat (nested cards) tanpa hierarki yang jelas.
- **Don't** gunakan gradasi teks warna-warni (`background-clip: text`) yang mengurangi keterbacaan enterprise.
- **Don't** gunakan radius lengkung ekstrem (>24px) pada tombol atau input field.
