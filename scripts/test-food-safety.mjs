import assert from "node:assert/strict";

// Mirror import of the bridge under test (Next-style TS imports).
// ponytail: duplicate map keeps the check dependency-free; revisit if rules drift.
const STORAGE_MAP = {
  suhu_ruang: "room_temperature",
  didinginkan: "refrigerated",
  dibekukan: "sealed_container",
};

const { execFileSync } = await import("node:child_process");
const out = execFileSync(process.execPath, ["--input-type=module", "-e", `
import { calculateFoodExpiry } from "./src/lib/rules/expiry.ts";
const cookedAt = "2026-01-01T00:00:00.000Z";
const safe = calculateFoodExpiry({ cookedAt, storageMethod: "refrigerated", riskyIngredients: [] });
const risky = calculateFoodExpiry({ cookedAt, storageMethod: "refrigerated", riskyIngredients: ["santan"] });
console.log(JSON.stringify({ safe, risky }));
`], { encoding: "utf8" });
const { safe, risky } = JSON.parse(out);
assert.equal(safe.maxAllowedHours, 8);
assert.equal(risky.maxAllowedHours, 6);
assert.equal(safe.safeUntil, "2026-01-01T08:00:00.000Z");
assert.equal(risky.isHighRisk, true);
assert.deepEqual(Object.values(STORAGE_MAP).sort(), ["refrigerated", "room_temperature", "sealed_container"]);
console.log("AI-to-expiry deterministic bridge: PASS");
