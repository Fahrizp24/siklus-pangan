# Panduan Vibe Coding & Specification Harness: SiklusPangan (Antigravity Agent Rules)

- **Framework Stack:** Next.js 15 (App Router, React 19, TypeScript), Tailwind CSS v3, shadcn/ui.
- **Data Mutations:** Wajib menggunakan Next.js Server Actions dengan validasi Zod Schema.
- **AI Integration:** Gunakan Google Gen AI SDK resmi (`@google/genai`) dengan penegakan responseSchema (Structured Output).
- **Rules Engine:** Dilarang menggunakan LLM murni untuk kalkulasi expired. Jam aman konsumsi wajib dihitung oleh Deterministic Expiry Rules Engine.
- **Database Safety:** Seluruh tabel Supabase PostgreSQL wajib memiliki kebijakan Row Level Security (RLS) aktif.
- **Runtime Standard:** Semua fungsi async Server Action wajib mengembalikan tipe standar: `{ success: boolean; data?: T; error?: string }`.
- **Anti-Halusinasi:** Dilarang mengimpor pustaka yang tidak terdaftar di `package.json`. Gunakan `html5-qrcode` untuk kamera QR scanning.
- **Wajib Test Tiap Selesai (Harness Verification Protocol):** Setiap kali selesai membuat/mengedit fitur atau komponen, Agent WAJIB mengeksekusi uji Harness (`npx tsc --noEmit` dan `npm run build`) untuk memverifikasi tidak ada error tipe data maupun broken build sebelum menyatakan fitur selesai.

