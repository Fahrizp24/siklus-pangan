const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const ID = '2a02ea19-32b6-43ac-b4d2-71c2eeead97b';
const TOKEN = '0123456789abcdef0123456789abcdef';
const TIME = '2026-09-17T04:00:00.000Z';
const PRIVATE = 'private transport SQL details';
const AUTH_ERROR = 'Sesi tidak ditemukan atau sudah berakhir. Silakan masuk kembali.';
const DISPATCH_ERROR = 'Hasil permintaan belum dapat dipastikan. Periksa status sebelum mengirim ulang.';
const payloads = {
  claim_food_token: { id: ID, qr_token: TOKEN, portions_claimed: 1 },
  collect_food_claim: { id: ID, collected_at: TIME, already_collected: false },
  create_waste_batch: { id: ID, qr_handover_token: TOKEN, rate_per_kg: 1250.5 },
  process_waste_handover: { id: ID, processor_credit: 2500.75, donor_charge: 3000, subsidy_amount: 499.25, already_processed: false },
  submit_dispute_strike: { id: ID, response_deadline: TIME },
};
let state;
const forbiddenImports = [];
function reset() {
  state = { clients: 0, auth: 0, rpcs: [], forbidden: [], throwAt: null,
    authResponse: { data: { user: { id: ID } }, error: null } };
}
function forbid(name) {
  state.forbidden.push(name);
  throw Error(`Unexpected transport: ${name}`);
}
const client = new Proxy({
  auth: new Proxy({ getUser: async () => {
    state.auth++;
    if (state.throwAt === 'auth') throw Error(PRIVATE);
    return state.authResponse;
  } }, { get: (target, key) => Object.hasOwn(target, key) ? target[key] : forbid(`auth.${String(key)}`) }),
  rpc: async (name, params) => {
    state.rpcs.push({ name, params });
    if (state.throwAt === 'rpc') throw Error(PRIVATE);
    assert(Object.hasOwn(payloads, name), 'unexpected RPC');
    return Object.hasOwn(state, 'rpcResponse') ? state.rpcResponse : { data: { ...payloads[name] }, error: null };
  },
}, { get: (target, key) => key === 'then' ? undefined : Object.hasOwn(target, key) ? target[key] : forbid(String(key)) });
const transport = new Proxy({ createClient: async () => {
  state.clients++;
  if (state.throwAt === 'client') throw Error(PRIVATE);
  return client;
} }, { get: (target, key) => Object.hasOwn(target, key) ? target[key] : forbid(`transport.${String(key)}`) });
const filename = path.resolve(__dirname, '../src/actions/transactions.ts');
const source = fs.readFileSync(filename, 'utf8');
const mod = new Module(filename, module);
mod.filename = filename;
mod.paths = Module._nodeModulePaths(path.dirname(filename));
mod.require = id => {
  if (id === '@/lib/supabase/server') return transport;
  if (id === 'zod') return require(id);
  forbiddenImports.push(id);
  throw Error(`Unmocked import: ${id}`);
};
mod._compile(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const actions = mod.exports;
const cases = [
  ['collectFoodClaim', { token: TOKEN }, 'collect_food_claim', { p_token: TOKEN }, 'Format token tidak valid.', [{ token: 'bad' }, { claimant_id: ID }]],
  ['claimFoodToken', { listing_id: ID, portions: 1 }, 'claim_food_token', { p_listing_id: ID, p_portions: 1 }, 'Data klaim tidak valid.', [{ portions: 0 }, { portions: 1.5 }, { portions: 2147483648 }, { listing_id: 'bad' }, { claimant_id: ID }]],
  ['createWasteBatch', { weight_kg: 0.01, target_category: 'bsf_maggot', billing_mode: 'prepaid' }, 'create_waste_batch', { p_weight_kg: 0.01, p_target_category: 'bsf_maggot', p_image_url: null, p_billing_mode: 'prepaid' }, 'Data limbah tidak valid.', [{ weight_kg: 0 }, { weight_kg: NaN }, { weight_kg: Infinity }, { weight_kg: 1.001 }, { billing_mode: 'other' }, { rate_per_kg: 1 }, { donor_id: ID }, { image_url: 'javascript:alert(1)' }]],
  ['processWasteHandover', { token: TOKEN }, 'process_waste_handover', { p_token: TOKEN }, 'Format token tidak valid.', [{ token: 'bad' }, { processor_credit: 999 }]],
  ['submitDisputeStrike', { listing_id: ID, reason: ' Basi ' }, 'submit_dispute_strike', { p_listing_id: ID, p_reason: 'Basi' }, 'Format laporan sengketa tidak valid.', [{ reason: ' ' }, { reason: 'x'.repeat(2001) }, { reported_by: ID }]],
];
const tests = [];
const test = (name, run) => tests.push({ name, run });
function rejected(result, error) {
  assert.deepEqual(result, { success: false, error });
  assert(!JSON.stringify(result).includes(PRIVATE), 'private details leaked');
}
function counts(clients, auth, rpcs) {
  assert.equal(state.clients, clients);
  assert.equal(state.auth, auth);
  assert.equal(state.rpcs.length, rpcs, 'exact RPC count; no retries');
}
const badTokens = ['', 'a'.repeat(31), 'a'.repeat(33), 'A'.repeat(32), 'g'.repeat(32), ` ${TOKEN}`, `${TOKEN} `, `${TOKEN}\n`, `${TOKEN}\r\n`, `${'a'.repeat(31)}\n`, null, 123];
const malformed = [null, undefined, [], [payloads.claim_food_token], '', 'invalid', 42, false, {}];

for (const [name, input, rpc, params, validationError, priorInvalid] of cases) {
  test(`${name} genuine success and exact RPC parameters`, async () => {
    assert.deepEqual(await actions[name](input), { success: true, data: payloads[rpc] });
    counts(1, 1, 1);
    assert.deepEqual(state.rpcs, [{ name: rpc, params }]);
  });
  const invalidInputs = [...malformed, ...priorInvalid.map(change => ({ ...input, ...change })), { ...input, unknown_field: true }];
  for (const field of Object.keys(input)) {
    if (field === 'billing_mode') continue;
    const missing = { ...input }; delete missing[field];
    invalidInputs.push(missing, { ...input, [field]: undefined });
  }
  if ('token' in input) invalidInputs.push(...badTokens.map(token => ({ ...input, token })));
  if ('listing_id' in input) invalidInputs.push(...['bad', `${ID}\n`, null, 123].map(listing_id => ({ ...input, listing_id })));
  if ('portions' in input) invalidInputs.push(...[-1, NaN, Infinity, -Infinity, '1', null].map(portions => ({ ...input, portions })));
  if ('weight_kg' in input) {
    invalidInputs.push(...[-0.01, -Infinity, 1000000, '0.01', null].map(weight_kg => ({ ...input, weight_kg })));
    invalidInputs.push({ ...input, target_category: 'other' }, { ...input, image_url: null }, { ...input, image_url: `https://example.invalid/${'a'.repeat(2048)}` });
  }
  invalidInputs.forEach((value, index) => test(`${name} invalid input #${index}`, async () => {
    rejected(await actions[name](value), validationError);
    counts(0, 0, 0);
  }));
  const authFailures = [
    { data: { user: null }, error: null }, { data: null, error: null }, {}, null, undefined,
    { data: { user: { id: ID } }, error: { message: PRIVATE } },
  ];
  authFailures.forEach((value, index) => test(`${name} auth failure #${index}`, async () => {
    state.authResponse = value;
    rejected(await actions[name](input), AUTH_ERROR);
    counts(1, 1, 0);
  }));
  for (const stage of ['client', 'auth', 'rpc']) test(`${name} thrown ${stage} redacted without retry`, async () => {
    state.throwAt = stage;
    rejected(await actions[name](input), stage === 'rpc' ? DISPATCH_ERROR : AUTH_ERROR);
    counts(1, stage === 'client' ? 0 : 1, stage === 'rpc' ? 1 : 0);
  });
  for (const data of [null, payloads[rpc]]) test(`${name} returned error wins over ${data ? 'valid data' : 'null'}`, async () => {
    state.rpcResponse = { data, error: { message: PRIVATE, details: PRIVATE, code: '42501' } };
    rejected(await actions[name](input), DISPATCH_ERROR);
    counts(1, 1, 1);
    assert.deepEqual(state.rpcs, [{ name: rpc, params }]);
  });
  const base = payloads[rpc];
  const invalidPayloads = [...malformed, { id: 'result' }, { ...base, extra: PRIVATE }];
  for (const field of Object.keys(base)) {
    const missing = { ...base }; delete missing[field];
    invalidPayloads.push(missing);
    let values = [null, undefined];
    if (field === 'id') values.push('result', `${ID}\n`, 123);
    else if (field.includes('token')) values.push(...badTokens);
    else if (typeof base[field] === 'number') {
      values.push(-1, NaN, Infinity, -Infinity, '1');
      if (field === 'portions_claimed') values.push(0, 1.5, 2147483648);
    } else if (typeof base[field] === 'boolean') values.push(0, 1, 'false');
    else values.push('invalid', '2026-09-17T04:00:00', '2026-13-17T04:00:00Z', `${TIME}\n`, 123);
    invalidPayloads.push(...values.map(value => ({ ...base, [field]: value })));
  }
  invalidPayloads.forEach((data, index) => test(`${name} invalid response payload #${index}`, async () => {
    state.rpcResponse = { data, error: null };
    rejected(await actions[name](input), DISPATCH_ERROR);
    counts(1, 1, 1);
    assert.deepEqual(state.rpcs, [{ name: rpc, params }]);
  }));
  [null, undefined, {}, { error: null }].forEach((value, index) => test(`${name} malformed response envelope #${index}`, async () => {
    state.rpcResponse = value;
    rejected(await actions[name](input), DISPATCH_ERROR);
    counts(1, 1, 1);
  }));
  for (const [field, value] of Object.entries(base)) {
    const validValues = typeof value === 'boolean' ? [true] : typeof value === 'number'
      ? field === 'portions_claimed' ? [2147483647] : [0, 0.01]
      : field === 'collected_at' || field === 'response_deadline' ? ['2026-09-17T12:00:00+08:00'] : [];
    for (const validValue of validValues) test(`${name} valid response boundary ${field}=${validValue}`, async () => {
      const data = { ...base, [field]: validValue };
      state.rpcResponse = { data, error: null };
      assert.deepEqual(await actions[name](input), { success: true, data });
      counts(1, 1, 1);
    });
  }
}
for (const weight of [0.01, 1.23, 999999.99]) test(`waste default billing and weight ${weight}`, async () => {
  assert.deepEqual(await actions.createWasteBatch({ weight_kg: weight, target_category: 'compost_biogas' }), { success: true, data: payloads.create_waste_batch });
  counts(1, 1, 1);
  assert.deepEqual(state.rpcs, [{ name: 'create_waste_batch', params: { p_weight_kg: weight, p_target_category: 'compost_biogas', p_image_url: null, p_billing_mode: 'prepaid' } }]);
});
test('waste explicit monthly billing and image', async () => {
  const image = 'https://example.invalid/food.jpg';
  assert.deepEqual(await actions.createWasteBatch({ weight_kg: 1, target_category: 'poultry_fish', billing_mode: 'monthly_invoice', image_url: image }), { success: true, data: payloads.create_waste_batch });
  counts(1, 1, 1);
  assert.deepEqual(state.rpcs, [{ name: 'create_waste_batch', params: { p_weight_kg: 1, p_target_category: 'poultry_fish', p_image_url: image, p_billing_mode: 'monthly_invoice' } }]);
});
test('transaction source has no direct table/admin fallback', () => {
  assert(!/\.from\s*\(/.test(source));
  assert(!/service_role|supabase-admin|SUPABASE_SERVICE|createAdminClient|process\.env|\bfetch\s*\(/i.test(source));
});
test('live harness never deletes fixtures (static only)', () => {
  const live = fs.readFileSync(path.resolve(__dirname, 'test-phase3-live.mjs'), 'utf8');
  assert(!/delete\s+from|\.deleteUser\(/i.test(live), 'live harness must never delete fixtures');
});
test('live harness requires write opt-in (static only)', () => {
  const live = fs.readFileSync(path.resolve(__dirname, 'test-phase3-live.mjs'), 'utf8');
  assert(live.includes('PHASE3_ALLOW_FIXTURE_WRITES'), 'live writes require explicit opt-in');
});
test('database TLS verifies certificates (static only)', () => {
  const helper = fs.readFileSync(path.resolve(__dirname, 'phase3-db.mjs'), 'utf8');
  assert(!helper.includes('rejectUnauthorized:false'), 'database TLS must verify server certificate');
});

(async () => {
  let passed = 0;
  const failures = [];
  for (const { name, run } of tests) {
    reset();
    try {
      await run();
      assert.deepEqual(state.forbidden, [], 'no direct table/admin/alternate transport attempts');
      assert.deepEqual(forbiddenImports, [], 'all transport imports must be mocked');
      passed++;
    } catch (error) { failures.push(name); console.error(`FAIL ${name}\n  ${error.message}`); }
  }
  console.log(JSON.stringify({ total: tests.length, passed, failed: failures.length, failures }, null, 2));
  console.log('Scope: offline action contracts with mocked transport; live harness and DB helper are read only, never executed.');
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
