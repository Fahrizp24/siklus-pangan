// Run: node scripts/test-phase3-local.cjs (no network or credentials)
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const filename = path.resolve(__dirname, '../src/actions/transactions.ts');
let user = { id: 'session-user' }, authError = null, rpcError = null, throws = false, calls = [];
const client = {
  auth: { getUser: async () => ({ data: { user }, error: authError }) },
  rpc: async (name, params) => { calls.push({ name, params }); if (throws) throw Error('private transport'); return { data: { id: 'result' }, error: rpcError }; },
};
const mod = new Module(filename, module);
mod.filename = filename; mod.paths = Module._nodeModulePaths(path.dirname(filename));
mod.require = id => id === '@/lib/supabase/server' ? { createClient: async () => client } : require(id);
mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename);
const a = mod.exports;
const id = '2a02ea19-32b6-43ac-b4d2-71c2eeead97b';
const cases = [
  ['collectFoodClaim', { token: 'a'.repeat(32) }, 'collect_food_claim', { p_token: 'a'.repeat(32) }, [{ token: 'bad' }, { claimant_id: id }]],
  ['claimFoodToken', { listing_id: id, portions: 1 }, 'claim_food_token', { p_listing_id: id, p_portions: 1 }, [{ portions: 0 }, { portions: 1.5 }, { portions: 2147483648 }, { listing_id: 'bad' }, { claimant_id: id }]],
  ['createWasteBatch', { weight_kg: 0.01, target_category: 'bsf_maggot', billing_mode: 'prepaid' }, 'create_waste_batch', { p_weight_kg: 0.01, p_target_category: 'bsf_maggot', p_image_url: null, p_billing_mode: 'prepaid' }, [{ weight_kg: 0 }, { weight_kg: NaN }, { weight_kg: Infinity }, { weight_kg: 1.001 }, { billing_mode: 'other' }, { rate_per_kg: 1 }, { donor_id: id }, { image_url: 'javascript:alert(1)' }]],
  ['processWasteHandover', { token: 'a'.repeat(32) }, 'process_waste_handover', { p_token: 'a'.repeat(32) }, [{ token: 'bad' }, { processor_credit: 999 }]],
  ['submitDisputeStrike', { listing_id: id, reason: ' Basi ' }, 'submit_dispute_strike', { p_listing_id: id, p_reason: 'Basi' }, [{ reason: ' ' }, { reason: 'x'.repeat(2001) }, { reported_by: id }]],
];
(async () => {
  for (const [name, input, rpc, params, invalid] of cases) {
    assert.equal((await a[name](input)).success, true);
    assert.deepEqual(calls.at(-1), { name: rpc, params });
    const count = calls.length;
    for (const change of invalid) assert.equal((await a[name]({ ...input, ...change })).success, false);
    user = null; assert.equal((await a[name](input)).success, false); user = { id: 'session-user' };
    authError = Error('private auth'); assert.equal((await a[name](input)).success, false); authError = null;
    assert.equal(calls.length, count, 'invalid/unauthenticated calls never invoke RPC');
    rpcError = Error('private SQL'); let result = await a[name](input); assert.equal(result.success, false); assert(!result.error.includes('private')); rpcError = null;
    throws = true; result = await a[name](input); assert.equal(result.success, false); assert(!result.error.includes('private')); throws = false;
  }
  console.log('PASS: five transaction actions validation, session auth, RPC parameters, error redaction (mock transport).');
  const live = fs.readFileSync(path.resolve(__dirname, 'test-phase3-live.mjs'), 'utf8');
  assert(!/delete\s+from|\.deleteUser\(/i.test(live), 'live harness must never delete fixtures');
  assert(live.includes('PHASE3_ALLOW_FIXTURE_WRITES'), 'live writes require explicit opt-in');
  const helper = fs.readFileSync(path.resolve(__dirname, 'phase3-db.mjs'), 'utf8');
  assert(!helper.includes('rejectUnauthorized:false'), 'database TLS must verify server certificate');
  console.log('PASS: harness has no fixture deletion, requires write opt-in, verifies database TLS.');
})().catch(error => { console.error(error); process.exitCode = 1; });
