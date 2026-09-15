// RLS functional test: seed 1 row via service_role, prove anon CANNOT see it.
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  fs
    .readFileSync(path.join(process.cwd(), ".env.local"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const anon = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// 1. Create a fake auth user to own the profile row (service_role bypasses RLS)
const email = `rls-test-${Date.now()}@example.com`;
const { data: userData, error: userErr } = await admin.auth.admin.createUser({
  email,
  password: crypto.randomUUID(),
  email_confirm: true,
});
if (userErr) {
  console.log("createUser failed:", userErr.message);
  process.exit(1);
}
const uid = userData.user.id;
console.log("auth user created:", uid);

// 2. Seed profile via service_role
const { error: profErr } = await admin
  .from("profiles")
  .insert({ id: uid, role: "donor", display_name: "RLS Test Donor" });
console.log("profile insert (service_role):", profErr ? `FAIL - ${profErr.message}` : "OK");

// 3. Seed a food listing
const { data: listing, error: listErr } = await admin
  .from("food_listings")
  .insert({
    donor_id: uid,
    title: "RLS Test Nasi",
    portions: 5,
    remaining_portions: 5,
    storage_method: "room_temperature",
    cooked_at: new Date().toISOString(),
    safe_until: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
  })
  .select()
  .single();
console.log("listing insert (service_role):", listErr ? `FAIL - ${listErr.message}` : `OK id=${listing.id}`);

// 4. Anon should see ZERO rows (RLS blocks - no policy grants anon)
const { data: anonProfiles } = await anon.from("profiles").select("*");
const { data: anonListings } = await anon.from("food_listings").select("*");
console.log("anon sees profiles:", anonProfiles?.length ?? "?", "(expect 0)");
console.log("anon sees food_listings:", anonListings?.length ?? "?", "(expect 0)");

// 5. Unauthenticated (anon) INSERT should be rejected entirely
const { error: insErr } = await anon.from("food_listings").insert({
  donor_id: uid,
  title: "Should Fail",
  portions: 1,
  remaining_portions: 1,
  storage_method: "room_temperature",
  cooked_at: new Date().toISOString(),
  safe_until: new Date(Date.now() + 1000).toISOString(),
});
console.log("anon insert food_listings:", insErr ? `blocked as expected (${insErr.message})` : "WARNING - LEAK!");

// 6. Cleanup
await admin.from("food_listings").delete().eq("donor_id", uid);
await admin.from("profiles").delete().eq("id", uid);
await admin.auth.admin.deleteUser(uid);
console.log("cleanup done");

const pass = (anonProfiles?.length ?? 1) === 0 && (anonListings?.length ?? 1) === 0 && !!insErr;
console.log(pass ? "RLS FUNCTIONAL TEST: PASS" : "RLS FUNCTIONAL TEST: FAIL");
process.exit(pass ? 0 : 1);
