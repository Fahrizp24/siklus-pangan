# Implement Plan: Rizal Phase 1 — Design System, Theme & App Shell (RZL-01 → RZL-03)

**Pemilik:** Rizal (P2 - Lead Frontend & UI/UX) | **Branch:** `feature/p2-frontend-design`
**Referensi:** [PROGRESS_RIZAL.md](../progress/PROGRESS_RIZAL.md) · [AGENTS.md](../../AGENTS.md) · [PAGES.md](../PAGES.md)
**Status:** 🟢 READY TO START — tidak ada dependensi eksternal.

---

## 1. Mengapa Milestone Ini Prioritas

1. **Satu-satunya workstream Rizal yang tidak terblokir** (Phase 3 menunggu FHR-12/13, Phase 4 menunggu ledger Fahri, Phase 5 terkunci).
2. **Membuka blokir Fahri Phase 4** — FHR-15/16/17 (kamera VLM & QR scanner) menunggu design system `RZL-02` selesai. Ini milestone dengan leverage tim tertinggi.
3. **Fahri Phase 2 sudah 75%** (Zod schema + expiry engine live di `src/lib/rules/expiry.ts`) → begitu Phase 1 selesai, Rizal bisa langsung mulai Phase 2 (RZL-04…08) tanpa menunggu.

## 2. Hasil Audit Kode Saat Ini (Verified Gap Analysis)

| Item Checklist | Status Nyata di Kode | Gap yang Harus Ditutup |
|---|---|---|
| **RZL-01** Tailwind + palet HSL + glassmorphism + Inter | 🟡 Sebagian | `tailwind.config.ts` sudah memetakan token HSL; `globals.css` punya tema gelap + `.glass-panel`; Inter sudah via `next/font` di `layout.tsx`. **TAPI:** semua komponen memakai warna hardcode `slate-*`/`blue-*` (bukan token semantik `bg-background`/`text-primary`); tidak ada blok `.dark`; tidak ada keyframes animasi. |
| **RZL-02** shadcn/ui (Button, Card, Badge, Dialog, Tabs, Toast) | 🔴 Belum | Folder `src/components/ui/` **tidak ada**; `components.json` tidak ada. Deps pendukung (`cva`, `clsx`, `tailwind-merge`, `lucide-react`) sudah ada. **Radix & `tailwindcss-animate` BELUM ada di `package.json`** — wajib di-install dulu (aturan anti-halusinasi AGENTS.md). |
| **RZL-03** App Shell (header + sidebar desktop + bottom nav mobile) | 🟡 Sebagian | `app-shell.tsx` ada (header, dropdown mobile, bottom nav). **TAPI:** tidak ada sidebar desktop; tidak ada indikator profil/role (link "Masuk" statis); nav menunjuk route yang **tidak ada** (`/wall-of-fame`, `/dashboard/esg` — sedangkan yang ada `/leaderboard`, `/dashboard`); AppShell tidak terpasang di root layout (dipasang manual per halaman, tidak konsisten). |

---

## 3. Rencana Eksekusi (4 Task Berurutan)

### 🎨 Task 1 — RZL-01: Konsolidasi Design Token & Tema

**File:** `src/app/globals.css`, `tailwind.config.ts`

1. Perbaiki `globals.css`:
   - Definisikan token lengkap di `:root` (tambah `--success`, `--warning`, `--chart-1..5`, `--sidebar*`) dan duplikasi ke blok `.dark` (struktur standar shadcn).
   - Refactor `.glass-panel` jadi utility berbasis token (`@apply border bg-card/70 backdrop-blur-xl`), pertahankan `.field`.
   - Tambah utility `.text-gradient` (gradient brand biru→emerald→teal yang dipakai landing page).
2. Perbaiki `tailwind.config.ts`: tambah plugin `tailwindcss-animate`, keyframes (`accordion-down/up`, `pulse-soft` untuk indikator Live Radar), warna `success`/`warning`/`chart`, `sidebar`.
3. **Migrasi warna hardcode → token semantik** di 4 file yang sudah ada: `app-shell.tsx`, `page.tsx`, `surplus-radar.tsx`, `route-placeholder.tsx` (contoh: `bg-slate-950` → `bg-background`, `text-blue-400` → `text-primary`).
4. Font Inter via `next/font` **dipertahankan** (lebih baik dari `@import` CSS; deviasi dari redaksi checklist dicatat di PROGRESS).

✅ **Acceptance:** tidak ada lagi kelas `slate-*`/`blue-*` hardcode di 4 file tsb; visual tetap identik.

### 🧩 Task 2 — RZL-02: Fondasi shadcn/ui (UNBLOCKS FAHRI PHASE 4)

1. Install dependensi (wajib sebelum menulis kode — aturan anti-halusinasi):
   ```powershell
   npm i @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-tabs @radix-ui/react-toast && npm i -D tailwindcss-animate
   ```
2. Buat `components.json` (style: "default", RSC: true, alias `@/components`, Tailwind v3 config `tailwind.config.ts` + `src/app/globals.css`).
   ⚠️ **JANGAN pakai `npx shadcn@latest init` tanpa pin versi** — CLI terbaru menarget Tailwind v4; project ini **wajib Tetap v3**. Tulis `components.json` manual.
3. Author manual 6 komponen di `src/components/ui/` (resep shadcn v3, tanpa CLI):
   - `button.tsx` (varian: default/secondary/destructive/outline/ghost/link; size: sm/default/lg/icon)
   - `card.tsx` (+ CardHeader/Title/Description/Content/Footer)
   - `badge.tsx` (varian: default/secondary/destructive/outline/success/warning)
   - `dialog.tsx` (+ Overlay/Content/Header/Footer/Title/Description)
   - `tabs.tsx` (List/Trigger/Content)
   - `toast.tsx` + `toaster.tsx` + hook `use-toast` di `src/hooks/use-toast.ts`
4. Tambahkan `<Toaster />` di root layout agar toast global.

✅ **Acceptance:** komponen bisa diimpor & dirender tanpa error TS; animasi dialog/tabs berfungsi.

### 🏗️ Task 3 — RZL-03: Penuntasan App Shell

**File:** `src/components/layout/app-shell.tsx`, `src/app/layout.tsx`, baru: `src/components/layout/sidebar.tsx`

1. **Sidebar desktop** (`hidden md:flex`, glassmorphism): logo di atas, nav item dengan ikon + active state, footer kartu user. Konten nav sama dengan header.
2. **Header Navbar**: tetap sticky glass; tambah **indikator profil/role** — ubah `app-shell.tsx` menerima props `user?: { display_name: string; role: string } | null` dari Server Component wrapper (`app-shell-server.tsx`) yang membaca session via `src/lib/supabase/server.ts` (FHR-04). Render Badge role (`Donor`/`Beneficiary`/`Processor`/`Admin`) + inisial avatar; fallback tombol "Masuk" jika anonim.
3. **Perbaiki nav links ke route yang ADA** (jangan broken link): `/rescue`, `/waste`, `/leaderboard` (Wall of Fame), `/dashboard`. Tandai `/dashboard/esg` sebagai disabled tooltip "Segera".
4. **Bottom nav mobile**: pertahankan, maksimal 5 item, label 10px, active state pakai token.
5. **Integrasi layout**: pindahkan pemakaian AppShell dari per-halaman ke **route group** `src/app/(app)/layout.tsx` — pindahkan halaman aplikasi (`rescue`, `waste`, `dashboard`, `leaderboard`, `wallet`, `claims`, `donate`, `profile`, `disputes`, `admin`) ke group `(app)`; `login`/`signup`/`/` tetap di luar (tanpa shell). Hapus wrapper AppShell manual dari `route-placeholder.tsx` & `rescue/page.tsx`.
6. Nav menyesuaikan role (beneficiary tidak lihat "Biokonversi", donor tidak lihat "Klaim Saya", dll.) — sederhana: filter array `navItems` by `user?.role`.

✅ **Acceptance:** sidebar tampil ≥md; badge role muncul saat login; semua link nav resolve 200; mobile bottom nav utuh; halaman login/landing bebas shell.

### 🚀 Task 4 (Stretch) — Preview Design System: Claim QR Modal (RZL-07)

Jika waktu sisa: bangun `src/components/rescue/claim-qr-modal.tsx` memakai komponen baru (Dialog + Badge + Button + Toast) sebagai bukti design system & sekaligus memajukan Phase 2. QR statis (SVG placeholder / `qrcode` hanya jika sudah ditambahkan ke `package.json` — jangan impor pustaka tak terdaftar).

✅ **Acceptance:** klik "Klaim" di radar membuka modal glassmorphism → toast sukses.

---

## 4. Protokol Verifikasi Harness (WAJIB per AGENTS.md)

Setelah **setiap task** selesai, jalankan dan pastikan lolos sebelum lanjut:

```powershell
npx tsc --noEmit ; npm run build
```

Sebelum menyatakan milestone selesai: `git status` bersih dari file liar, build 5/5+ halaman statis sukses.

## 5. Definition of Done Milestone

- [ ] Task 1–3 selesai & harness hijau (Task 4 opsional).
- [ ] Centang RZL-01, RZL-02, RZL-03 di `PROGRESS_RIZAL.md` + update ringkasan progress (15% → ~40%).
- [ ] Update status route di `PAGES.md` bila ada perubahan (route group `(app)`).
- [ ] Kabari Fahri bahwa `RZL-02` selesai → **Fahri Phase 4 (FHR-15/16/17) terbuka blokirnya**.

## 6. Risiko & Catatan

| Risiko | Mitigasi |
|---|---|
| CLI shadcn terbaru menarget Tailwind v4 | Author komponen manual dengan resep v3; jangan jalankan init tanpa pin. |
| Pustaka tak terdaftar (radix, dsb.) | Selalu `npm i` dulu; cek `package.json` sebelum impor. |
| Refactor route group memindah banyak file | Kerjakan Task 3 dalam 2 commit: (a) sidebar+role, (b) route group. Jalankan harness di antaranya. |
| Session server membuat halaman jadi dinamis | Boleh untuk halaman ber-shell; landing `/` tetap statis (di luar group). |

**Estimasi total:** 1–1.5 hari kerja fokus (Task 1: ±3j, Task 2: ±3j, Task 3: ±4j, Task 4: ±2j).
