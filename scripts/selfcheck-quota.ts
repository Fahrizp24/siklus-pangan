// Run: npx --no-install tsc scripts/selfcheck-quota.ts --outDir .next/quota-check --module commonjs --target es2020 --skipLibCheck
// Then: node .next/quota-check/scripts/selfcheck-quota.js
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

assert(shouldRouteToIndividualRadar(17, 35), "17/35 reroutes");
assert(!shouldRouteToIndividualRadar(18, 35), "18/35 permits organization");
assert(!shouldRouteToIndividualRadar(20, 40), "exactly 50% permits organization");
assert(shouldRouteToIndividualRadar(0, 40), "empty stock cannot serve organization");
for (const invalid of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
  assert(shouldRouteToIndividualRadar(invalid, 40), "invalid stock fails closed");
  assert(shouldRouteToIndividualRadar(40, invalid), "invalid capacity fails closed");
  assert(capOrganizationClaim(invalid, 40) === 0, "invalid request rejected");
  assert(capOrganizationClaim(40, invalid) === 0, "invalid capacity rejected");
}
assert(capOrganizationClaim(0, 40) === 0, "zero request rejected");
assert(capOrganizationClaim(40, 0) === 0, "zero capacity rejected");
console.log("ALL PASS");
