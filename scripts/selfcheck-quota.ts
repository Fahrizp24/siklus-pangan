// Self-check ad-hoc: node --loader untuk ts belum tersedia di project ini,
// jadi assert langsung lewat ts-node tidak dipakai. Cukup jalankan via tsx/node build.
// Dipakai manual: `npx tsx scripts/selfcheck-quota.ts`
import { getMealWindow, canClaimInWindow, shouldRouteToIndividualRadar, capOrganizationClaim } from "../src/lib/rules/quota";

function assert(cond: boolean, msg: string) {
  if (!cond) throw new Error("FAILED: " + msg);
  console.log("OK:", msg);
}

assert(getMealWindow(new Date(2024, 0, 1, 12, 0))?.window === "lunch", "12:00 is lunch window");
assert(getMealWindow(new Date(2024, 0, 1, 18, 0))?.window === "dinner", "18:00 is dinner window");
assert(getMealWindow(new Date(2024, 0, 1, 9, 0)) === null, "09:00 has no window");

assert(canClaimInWindow(null, new Date(2024, 0, 1, 12, 0)) === true, "no prior claim can claim");
assert(
  canClaimInWindow(new Date(2024, 0, 1, 12, 30), new Date(2024, 0, 1, 12, 45)) === false,
  "second claim same lunch window rejected"
);
assert(
  canClaimInWindow(new Date(2024, 0, 1, 12, 30), new Date(2024, 0, 1, 18, 0)) === true,
  "claim allowed in next window"
);

assert(shouldRouteToIndividualRadar(20, 50) === true, "20/50 (<50%) reroutes to individual");
assert(shouldRouteToIndividualRadar(30, 50) === false, "30/50 (>=50%) stays for organization");
assert(capOrganizationClaim(100, 40) === 40, "org claim capped to capacity");
assert(capOrganizationClaim(10, 40) === 10, "org claim under capacity untouched");

console.log("ALL PASS");
