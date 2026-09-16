# Phase3 verification follow-up — IN PROGRESS

> Status terbaru: bagian NO DEBT / 0004 di bawah menggantikan laporan review lama. TLS/catalog telah terverifikasi; collection RPC tersedia; individual in-window SQL sequential sudah lulus. E2E/race/UI tetap gap.

Scope Fahri FHR-10–14. No commit/push, no deletion of existing fixtures, no production clock/policy change.

## PostgreSQL connection

`node scripts/diagnose-phase3-db.mjs`: direct candidate ENOENT; ten pooler candidates SELF_SIGNED_CERT_IN_CHAIN. `node --use-system-ca` gave the same result. Missing CA, not proof migration failed.

Downloaded public Supabase CA over verified HTTPS (no TLS bypass):

```bash
curl --fail --max-time 20 https://supabase-downloads.s3-ap-southeast-1.amazonaws.com/prod/ssl/prod-ca-2021.crt -o .next/supabase-prod-ca-2021.crt
export NODE_EXTRA_CA_CERTS='D:/KULIAH/Lomba/HACKATON UTM/siklus-pangan/.next/supabase-prod-ca-2021.crt'
node scripts/diagnose-phase3-db.mjs
node scripts/verify-phase3-readonly.mjs
PHASE3_ALLOW_ROLLBACK_FIXTURES=1 node scripts/test-phase3-rollback.mjs
```

CA is temporary, ignored, must be downloaded again if `.next` is cleared. Session pooler candidate 5 (`aws-0-ap-south-1.pooler.supabase.com:5432`) connects; other poolers return tenant-not-found after CA trust succeeds. No credential changed. `pg_stat_ssl` describes pooler-to-database hop, not client TLS; diagnostic separately reports TLS socket authorization/protocol.

Helper entrypoint suffix collision reproduced: importing from `diagnose-phase3-db.mjs` erroneously ran CLI. Fixed exact file URL comparison. Diagnostic remains a runnable regression.

## Independent deployed verification

Read-only catalog verifies seven function bodies exactly match local `0003_phase3.sql` (trimmed body hashes emitted), search_path public, four SECURITY DEFINER RPC grants (anon denied; authenticated allowed), seven RLS-enabled tables. Tests nine meal/timezone/day-boundary inputs using actual deployed CASE expression, not duplicated JavaScript rules. This does not prove every migration DDL statement or functional RLS path.

Historical listing/claim/two batch/ledger IDs remain absent. Missing evidence explicitly reported separately from schema PASS. No inference about earlier cleanup.

## Individual quota integration

`test-phase3-rollback.mjs`: deployed claim RPC succeeded at database Jakarta time `2026-09-16 18:57:03.714986`; second listing rejected `Meal quota exhausted`; only first stock decremented; one claim. Fresh auth/profile/listing fixtures in a single transaction; ROLLBACK; follow-up SELECT confirms new users/listings absent. No existing fixture touched.

This uses privileged fixture setup and JWT context with authenticated SQL role. NOT real login/PostgREST/Server Action evidence. NOT concurrent quota race. Cross-session race needs committed shared fixtures (uncommitted fixtures invisible to other sessions); do not silently commit them under rollback-only authorization. Existing live fixture writer was not rerun.

## Audit handoff

Deployed matching bodies confirm monthly_invoice has no credit-approval/limit check, and organization/capacity comes from signup metadata. Latest user override: NO DEBT; all handovers must consume subsidy/deposit and reject insufficient funds, regardless of billing_mode. Monthly invoice means paid recap only; historical ledger must remain unchanged. Organization remains self-declared with accepted risk. This verification task has NOT applied the new billing migration; parent must implement/test it, supersede earlier ADR/PRD, and rerun deployed verification (body comparison currently targets 0003). Deposit posting remains trusted/admin only. Claim locks profile then listing; dispute locks listing then obtains reporter FK lock on insert: potential lock-order deadlock, not reproduced here. Food collection RPC absent from implemented Phase3: prior dispute preparation used privileged SQL. No new migration or business-policy change made in this verification task.

## Final executed gates

`node scripts/test-create-food-listing.cjs`, `node scripts/test-phase3-local.cjs`, `node scripts/test-phase3-edge-cases.cjs` (175/175), `node scripts/test-food-safety.mjs`, compiled quota selfcheck, `npx tsc --noEmit`, `npm run build`: exit 0. Next.js 15.5.25 compiled in 11.5s, 17/17 pages. Food-safety script emitted MODULE_TYPELESS_PACKAGE_JSON warning. External Gemini test not rerun; no live fixture writer/cleanup invoked. Read-only verifier passes; TLS socket authorized=true, TLSv1.3. These gates precede the requested NO DEBT implementation.

## Remaining

Concurrent individual quota; authenticated action in-window; seeded functional RLS replay; invoice/org policy decision; deadlock reproduction/fix via NEW migration; collection RPC scope; UI wiring. Phase3 remains IN PROGRESS. Existing PAGES staging, unrelated assets/package-lock/FHR09 edits preserved.

## Keputusan final NO DEBT — 0004 (menggantikan catatan Phase3 sebelumnya)

- Migrasi baru `0004_no_debt_collection.sql` telah diterapkan; 0003 tidak ditulis ulang. Rp600/kg; subsidi Rp12.000 sekali per akun donor; SEMUA mode memakai subsidi lalu deposit. Saldo kurang menolak seluruh transaksi; processor menerima penuh sebagai kredit ledger internal, bukan bukti pencairan bank.
- `monthly_invoice` hanya rekap transaksi lunas. Query rekap wajib `paid_at IS NOT NULL` dan periode `paid_at`; ledger debit baru bertipe `prepaid_deposit`. Kolom baru nullable tanpa backfill: invoice historis tidak boleh dianggap lunas. Tidak ada perubahan ledger historis saat migrasi.
- `collectFoodClaim` / `collect_food_claim(text)`: donor pemilik listing memindai token beneficiary, role/ban/expiry/recall diperiksa, retry mengembalikan timestamp yang sama. Dispute mengunci profil reporter sebelum listing; collection mengunci donor KEY SHARE, listing lalu claim. UI belum wired; race multi-session belum dibuktikan.
- Organisasi/kapasitas tetap self-declared sesuai keputusan pengguna. Risiko manipulasi signup dan akun ganda diterima untuk demo; bukan verifikasi organisasi atau kuota per manusia.
- Deposit hanya trusted/admin: client tidak dapat menulis saldo/ledger. Belum ada endpoint posting top-up, payment provider, verifikasi settlement, referensi pembayaran/idempotency atau rekonsiliasi; E2E pendanaan/pencairan BELUM selesai. Jangan menambahkan gateway palsu. Prosedur posting dipercaya perlu keputusan/provider terpisah.
- Bukti: `scripts/test-phase3-no-debt.mjs` RED pada 0003 (invoice tanpa saldo diterima), GREEN candidate ROLLBACK lalu GREEN deployed. JWT-context SQL role authenticated, BUKAN login/PostgREST/Server Action E2E. Test collection action memakai transport mock.
- TLS authorized=true, TLSv1.3; readback delapan body fungsi cocok sumber migrasi terbaru, lima RPC grants, tujuh RLS tables, sembilan boundary waktu. Fixture baru hanya transaksi ROLLBACK; SELECT memastikan tidak tersimpan. Tidak ada DELETE/cleanup, clock override, commit/push.
- Phase3 tetap IN PROGRESS: concurrent individual quota, authenticated in-window action, seeded RLS replay menyeluruh, UI, adjudikasi FHR-18. Historical fixture IDs masih tidak ditemukan; bukan bukti cleanup.

### Gate lokal setelah implementasi 0004

Real execution: food action harness PASS; lima transaction actions PASS (mock transport); edge cases 175/175; food-safety PASS (warning MODULE_TYPELESS_PACKAGE_JSON); quota selfcheck ALL PASS; `npx tsc --noEmit` exit 0; `npm run build` exit 0, Next.js 15.5.25, 17/17 pages. Gemini external tidak direrun. Final gates direrun setelah update dokumentasi.

### Perintah verifikasi 0004

```bash
# Download CA seperti di atas; .next dapat dihapus oleh build.
PHASE3_APPLY_NO_DEBT=1 node scripts/apply-phase3-no-debt.mjs # SUDAH APPLIED; jangan ulang
node scripts/verify-phase3-readonly.mjs
PHASE3_ALLOW_ROLLBACK_FIXTURES=1 node scripts/test-phase3-no-debt.mjs
node scripts/test-create-food-listing.cjs
node scripts/test-phase3-local.cjs
node scripts/test-phase3-edge-cases.cjs
node scripts/test-food-safety.mjs
npx --no-install tsc scripts/selfcheck-quota.ts --outDir .next/quota-check --module commonjs --target es2020 --skipLibCheck
node .next/quota-check/scripts/selfcheck-quota.js
npx tsc --noEmit
npm run build
```

`test-phase3-live.mjs` diselaraskan dengan NO DEBT dan collection action, tetapi tidak dijalankan ulang: membuat fixture committed, memerlukan izin terpisah. Jangan salah menganggap penyesuaian harness sebagai E2E pass.
