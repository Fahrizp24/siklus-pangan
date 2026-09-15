// Verify schema landed: all 6 tables exist, RLS blocks anon reads.
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

const tables = ["profiles", "food_listings", "food_claims", "strike_disputes", "waste_batches", "financial_transactions"];
let fail = false;

for (const t of tables) {
  const { error, count } = await admin.from(t).select("*", { count: "exact", head: true });
  if (error) {
    console.log(`${t}: FAIL - ${error.message}`);
    fail = true;
  } else {
    console.log(`${t}: OK (rows=${count})`);
  }
}

const { error: anonErr } = await anon.from("profiles").select("*").limit(1);
console.log(
  "anon read profiles:",
  anonErr ? `blocked as expected (${anonErr.message})` : "WARNING - readable by anon, RLS policy missing?"
);

const { error: anonListingErr } = await anon.from("food_listings").select("*").limit(1);
console.log(
  "anon read food_listings:",
  anonListingErr ? `blocked as expected (${anonListingErr.message})` : "WARNING - readable by anon"
);

process.exit(fail ? 1 : 0);
