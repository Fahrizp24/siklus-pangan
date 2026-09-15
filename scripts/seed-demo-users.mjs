// Seed one account per role. Run: SEED_PASSWORD='...' node scripts/seed-demo-users.mjs
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8")
    .split(/\r?\n/)
    .filter((line) => line.includes("=") && !line.trim().startsWith("#"))
    .map((line) => { const i = line.indexOf("="); return [line.slice(0, i).trim(), line.slice(i + 1).trim()]; })
);
const password = process.env.SEED_PASSWORD;
if (!password || password.length < 8) throw new Error("Set SEED_PASSWORD (minimum 8 characters)");

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const users = [
  ["donor", "seed-donor@siklus-pangan.local", "Donatur Demo", false, null],
  ["beneficiary", "seed-beneficiary@siklus-pangan.local", "Penerima Demo", false, null],
  ["beneficiary", "seed-organization@siklus-pangan.local", "Organisasi Demo", true, 25],
  ["processor", "seed-processor@siklus-pangan.local", "Pengolah Demo", false, null],
  ["admin", "seed-admin@siklus-pangan.local", "Admin Demo", false, null],
];

for (const [role, email, display_name, is_organization, organization_capacity] of users) {
  const { data, error } = await admin.auth.admin.createUser({
    email, password, email_confirm: true,
    user_metadata: {
      display_name, role, phone_number: "080000000000", address: "Alamat demo",
      is_organization, organization_capacity,
    },
  });
  if (error?.status === 422 && error.message.toLowerCase().includes("already")) {
    console.log(`${role}: exists (${email})`);
  } else if (error) {
    throw new Error(`${role}: ${error.message}`);
  } else {
    console.log(`${role}: created (${data.user.id})`);
  }
}
console.log("Seed selesai. Hapus akun demo sebelum production.");
