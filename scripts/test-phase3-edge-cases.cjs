// Run: node scripts/test-phase3-edge-cases.cjs (offline; real actions + expiry, mocked transport).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const forbiddenImports = [];

function load(relative, mocks = {}) {
  const filename = path.resolve(__dirname, '..', relative);
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  mod.require = id => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    if (id === 'zod') return module.require(id);
    forbiddenImports.push(id);
    throw Error(`Unmocked import: ${id}`);
  };
  mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, filename);
  return mod.exports;
}

const NOW = Date.parse('2026-09-16T04:00:00.000Z');
const ID = '2a02ea19-32b6-43ac-b4d2-71c2eeead97b';
const PRIVATE = 'PRIVATE_DB_SECRET postgres://internal/password SQLSTATE 42501';
let state;
function reset() {
  state = { user: { id: ID }, profile: { role: 'donor', is_banned: false },
    authError: null, profileError: null, insertError: null, rpcError: null,
    throwAt: null, clients: 0, auth: 0, profiles: 0, inserts: [], rpcs: [], tables: [], forbidden: [], insertData: { id: ID } };
}
function response(stage, data, error) {
  if (state.throwAt === stage) throw Error(PRIVATE);
  return { data, error };
}
function forbid(name) {
  state.forbidden.push(name);
  throw Error(`Unexpected transport: ${name}`);
}
const client = new Proxy({
  auth: new Proxy({ getUser: async () => {
    state.auth++;
    return response('auth', Object.hasOwn(state, 'authData') ? state.authData : { user: state.user }, state.authError);
  } }, { get: (target, key) => Object.hasOwn(target, key) ? target[key] : forbid(`auth.${String(key)}`) }),
  from(table) {
    state.tables.push(table);
    if (state.action !== 'createFoodListing' || !['profiles', 'food_listings'].includes(table)) return forbid(table);
    if (table === 'profiles') return { select: columns => {
      assert.equal(columns, 'role, is_banned');
      return { eq: (column, id) => {
        assert.equal(column, 'id'); assert.equal(id, ID);
        return { single: async () => {
          state.profiles++;
          return response('profile', state.profile, state.profileError);
        } };
      } };
    } };
    assert.equal(table, 'food_listings');
    return { insert: row => {
      state.inserts.push(row);
      return { select: columns => {
        assert.equal(columns, 'id');
        return { single: async () => response('insert', state.insertData, state.insertError) };
      } };
    } };
  },
  rpc: async (name, params) => {
    state.rpcs.push({ name, params });
    return response('rpc', Object.hasOwn(state, 'customRpcData') ? state.customRpcData : rpcPayload(name), state.rpcError);
  },
}, { get: (target, key) => key === 'then' ? undefined : Object.hasOwn(target, key) ? target[key] : forbid(String(key)) });
function rpcPayload(name) {
  switch (name) {
    case 'collect_food_claim': return { id: ID, collected_at: '2026-09-16T04:00:00.000Z', already_collected: false };
    case 'claim_food_token': return { id: ID, qr_token: 'b'.repeat(16) + 'c'.repeat(16), portions_claimed: 1 };
    case 'create_waste_batch': return { id: ID, qr_handover_token: '9a'.repeat(16), rate_per_kg: 1250.5 };
    case 'process_waste_handover': return { id: ID, processor_credit: 2500.75, donor_charge: 3000, subsidy_amount: 499.25, already_processed: false };
    case 'submit_dispute_strike': return { id: ID, response_deadline: '2026-09-16T08:00:00.000Z' };
    default: throw Error(`unexpected rpc ${name}`);
  }
}
function rpcContract(name) {
  return Object.keys(rpcPayload(name));
}
function rpcByAction(action) {
  return { claimFoodToken: 'claim_food_token', createWasteBatch: 'create_waste_batch',
    processWasteHandover: 'process_waste_handover', submitDisputeStrike: 'submit_dispute_strike', collectFoodClaim: 'collect_food_claim' }[action];
}
const transport = new Proxy({ createClient: async () => {
  state.clients++;
  if (state.throwAt === 'client') throw Error(PRIVATE);
  return client;
} }, { get: (target, key) => Object.hasOwn(target, key) ? target[key] : forbid(`transport.${String(key)}`) });
const actions = {
  ...load('src/actions/food.ts', {
    '@/lib/supabase/server': transport,
    '@/lib/supabase/admin': { createAdminClient: () => client },
    '@/lib/rules/expiry': load('src/lib/rules/expiry.ts'),
  }),
  ...load('src/actions/transactions.ts', {
    '@/lib/supabase/server': transport,
    '@/lib/supabase/admin': { createAdminClient: () => client },
  }),
};
for (const [name, action] of Object.entries(actions)) {
  actions[name] = async input => {
    state.action = name;
    const result = await action(input);
    assert.deepEqual(state.forbidden, [], 'no direct table/admin fallback attempts');
    assert.deepEqual(forbiddenImports, [], 'all transport imports must be mocked');
    return result;
  };
}
const food = { title: 'Nasi', portions: 1, cooked_at: new Date(NOW).toISOString(),
  storage_method: 'room_temperature', risky_ingredients: [], dietary_tags: [] };
const cases = [
  ['FHR10', 'createFoodListing', food],
  ['FHR11', 'claimFoodToken', { listing_id: ID, portions: 1 }],
  ['FHR12', 'createWasteBatch', { weight_kg: 0.01, target_category: 'bsf_maggot', billing_mode: 'prepaid' }],
  ['FHR13', 'processWasteHandover', { token: 'a'.repeat(32) }],
  ['FHR14', 'submitDisputeStrike', { listing_id: ID, reason: 'Basi' }],
  ['Collect', 'collectFoodClaim', { token: 'a'.repeat(32) }],
];
const tests = [];
const test = (name, run) => tests.push({ name, run });
function rejected(result) {
  assert.equal(result.success, false, `Expected rejection, got ${JSON.stringify(result)}`);
  assert.equal(typeof result.error, 'string');
  assert(result.error.length > 0);
  assert.equal(result.data, undefined);
  assert(!JSON.stringify(result).includes(PRIVATE), 'private database details leaked');
}
function noWrites() {
  assert.equal(state.inserts.length, 0);
  assert.equal(state.rpcs.length, 0);
}
function invalid(name, input) {
  return async () => {
    rejected(await actions[name](input));
    assert.equal(state.clients, 0, 'malformed input must be rejected before transport');
    noWrites();
  };
}

for (const [fhr, name, input] of cases) {
  const rpcName = rpcByAction(name);
  test(`${fhr} valid control reaches transport once`, async () => {
    const result = await actions[name](input);
    assert.equal(result.success, true);
    if (rpcName) {
      assert.deepEqual(result.data, rpcPayload(rpcName), 'success data must equal the genuine RPC response contract');
      for (const key of rpcContract(rpcName)) assert.ok(key in result.data, `contract field ${key} present`);
    }
    assert.equal(state.clients, 1);
    assert.equal(state.auth, 1);
    assert.equal(state.inserts.length + state.rpcs.length, 1);
    if (rpcName) {
      assert.equal(state.inserts.length, 0, 'RPC actions must never fall back to direct table writes');
      assert.deepEqual(state.tables, []);
      const params = name === 'claimFoodToken' ? { p_listing_id: ID, p_portions: 1 }
        : name === 'createWasteBatch' ? { p_weight_kg: 0.01, p_target_category: 'bsf_maggot', p_image_url: null, p_billing_mode: 'prepaid' }
        : name === 'submitDisputeStrike' ? { p_listing_id: ID, p_reason: 'Basi' } : { p_token: input.token };
      assert.deepEqual(state.rpcs, [{ name: rpcName, params }]);
    } else {
      assert.deepEqual(result, { success: true, data: { id: ID } });
      assert.deepEqual(state.tables, ['profiles', 'food_listings']);
      assert.equal(state.profiles, 1);
      assert.deepEqual(state.inserts[0], { ...food, image_url: null, remaining_portions: 1,
        safe_until: '2026-09-16T08:00:00.000Z',
        handling_notes: 'Simpan dalam wadah bersih dan tertutup pada suhu ruang.',
        donor_id: ID, food_condition: 'safe_for_consumption', status: 'active' });
    }
  });
  for (const [label, value] of [['null', null], ['undefined', undefined], ['array', []],
    ['string', 'invalid'], ['number', 123], ['empty object', {}]]) {
    test(`${fhr} rejects malformed ${label}`, invalid(name, value));
  }
  test(`${fhr} rejects unknown field`, invalid(name, { ...input, unknown_field: true }));
  for (const field of Object.keys(input)) {
    if (field === 'billing_mode') continue;
    const missing = { ...input }; delete missing[field];
    test(`${fhr} rejects missing input ${field}`, invalid(name, missing));
  }
  for (const mode of ['anonymous', 'auth error with user', 'null auth data', 'missing user']) {
    test(`${fhr} rejects ${mode} without mutation`, async () => {
      if (mode === 'anonymous') state.user = null;
      else if (mode === 'null auth data') state.authData = null;
      else if (mode === 'missing user') state.authData = {};
      else state.authError = { message: PRIVATE };
      rejected(await actions[name](input));
      assert.equal(state.clients, 1);
      assert.equal(state.auth, 1);
      assert.deepEqual(state.tables, []);
      noWrites();
    });
  }
  for (const stage of ['client', 'auth', name === 'createFoodListing' ? 'insert' : 'rpc']) {
    test(`${fhr} redacts thrown ${stage} error; never retries`, async () => {
      state.throwAt = stage;
      rejected(await actions[name](input));
      assert.equal(state.clients, 1);
      assert.equal(state.auth, stage === 'client' ? 0 : 1);
      assert.equal(state.inserts.length + state.rpcs.length, ['insert', 'rpc'].includes(stage) ? 1 : 0);
    });
  }
  test(`${fhr} redacts returned DB error even with data`, async () => {
    state[name === 'createFoodListing' ? 'insertError' : 'rpcError'] = { message: PRIVATE, details: PRIVATE };
    rejected(await actions[name](input));
    assert.equal(state.inserts.length + state.rpcs.length, 1);
  });
  if (rpcName) {
    const base = rpcPayload(rpcName);
    const payloads = [null, undefined, 42, false, '', [], [base], {}, { id: 'result' }, { ...base, extra: true }];
    for (const key of rpcContract(rpcName)) {
      const missing = { ...base }; delete missing[key];
      payloads.push(missing);
      const values = [null, undefined];
      if (key === 'id') values.push('result', `${ID}\n`, 123);
      else if (key.includes('token')) values.push('A'.repeat(32), `${'a'.repeat(32)}\n`, `${'a'.repeat(31)}\n`, 'g'.repeat(32));
      else if (typeof base[key] === 'number') {
        values.push(-1, NaN, Infinity, -Infinity, '1');
        if (key === 'portions_claimed') values.push(0, 1.5, 2147483648);
      } else if (typeof base[key] === 'boolean') values.push('false', 0);
      else values.push('invalid', '2026-09-16T04:00:00', '2026-13-16T04:00:00Z');
      payloads.push(...values.map(value => ({ ...base, [key]: value })));
    }
    payloads.forEach((payload, index) => test(`${fhr} rejects malformed RPC payload #${index}`, async () => {
      state.customRpcData = payload;
      assert.deepEqual(await actions[name](input), { success: false,
        error: 'Hasil permintaan belum dapat dipastikan. Periksa status sebelum mengirim ulang.' });
      assert.equal(state.clients, 1);
      assert.equal(state.auth, 1);
      assert.equal(state.rpcs.length, 1, 'exactly one RPC, no retry');
      assert.equal(state.rpcs[0].name, rpcName);
      assert.deepEqual(state.tables, []);
      assert.equal(state.inserts.length, 0);
    }));
  }
  if (name !== 'createFoodListing') {
    // DB owns role/ban checks for RPCs. This verifies denial propagation, NOT RLS or SQL policy.
    for (const reason of ['banned profile', 'unauthorized role']) {
      test(`${fhr} propagates DB ${reason} denial without leaking details`, async () => {
        state.rpcError = { code: '42501', message: `${reason}: ${PRIVATE}` };
        rejected(await actions[name](input));
        assert.equal(state.rpcs.length, 1);
      });
    }
  }
}

for (const [storage, normalHours, riskyHours] of [
  ['room_temperature', 4, 2], ['heated_display', 6, 4],
  ['refrigerated', 8, 6], ['sealed_container', 5, 3],
]) {
  for (const risky of [false, true]) {
    for (const remaining of [-1, 0, 1]) {
      test(`FHR10 ${storage} risk=${risky} expiry now${remaining >= 0 ? '+' : ''}${remaining}ms`, async () => {
        const hours = risky ? riskyHours : normalHours;
        const result = await actions.createFoodListing({ ...food, storage_method: storage,
          risky_ingredients: risky ? [' SANTAN '] : [],
          cooked_at: new Date(NOW - hours * 3600000 + remaining).toISOString() });
        if (remaining <= 0) { rejected(result); noWrites(); }
        else {
          assert.equal(result.success, true);
          assert.equal(state.inserts[0].safe_until, new Date(NOW + 1).toISOString());
        }
      });
    }
  }
}
test('FHR10 rejects future cooked_at by 1ms', async () => {
  rejected(await actions.createFoodListing({ ...food, cooked_at: new Date(NOW + 1).toISOString() }));
  noWrites();
});
test('FHR10 timezone offset represents the exact expired boundary', async () => {
  rejected(await actions.createFoodListing({ ...food, cooked_at: '2026-09-16T08:00:00+08:00' }));
  noWrites();
});
for (const [label, profile] of [['missing', null], ['banned', { role: 'donor', is_banned: true }],
  ['wrong role', { role: 'beneficiary', is_banned: false }], ['admin', { role: 'admin', is_banned: false }],
  ['missing ban flag', { role: 'donor' }], ['null ban flag', { role: 'donor', is_banned: null }]]) {
  test(`FHR10 rejects ${label} profile`, async () => {
    state.profile = profile;
    rejected(await actions.createFoodListing(food)); noWrites();
  });
}
for (const thrown of [false, true]) {
  test(`FHR10 redacts ${thrown ? 'thrown' : 'returned'} profile error`, async () => {
    if (thrown) state.throwAt = 'profile'; else state.profileError = { message: PRIVATE };
    rejected(await actions.createFoodListing(food)); noWrites();
  });
}
for (const field of ['donor_id', 'remaining_portions', 'safe_until', 'status', 'food_condition']) {
  test(`FHR10 rejects server-owned ${field}`, invalid('createFoodListing', { ...food, [field]: 'forged' }));
}
for (const [fhr, name, input, field, values] of [
  ['FHR10', 'createFoodListing', food, 'portions', [0, -1, 0.5, 2147483648, NaN, Infinity, '1', null]],
  ['FHR11', 'claimFoodToken', cases[1][2], 'portions', [0, -1, 0.5, 2147483648, NaN, Infinity, '1', null]],
  ['FHR12', 'createWasteBatch', cases[2][2], 'weight_kg', [0, -0.01, 0.001, 999999.991, 1000000, NaN, Infinity, -Infinity, '0.01', null]],
  ['FHR13', 'processWasteHandover', cases[3][2], 'token', ['', 'a'.repeat(31), 'a'.repeat(33), 'A'.repeat(32), 'g'.repeat(32), ` ${'a'.repeat(32)}`, `${'a'.repeat(32)} `, `${'a'.repeat(32)}\n`, `${'a'.repeat(32)}\r\n`, null, 123]],
  ['FHR14', 'submitDisputeStrike', cases[4][2], 'reason', ['', ' \n\t ', 'x'.repeat(2001), null, 123]],
]) {
  values.forEach((value, index) => test(`${fhr} rejects invalid ${field} #${index} (${String(value).replace(/\n/g, '\\n').replace(/\r/g, '\\r')})`,
    invalid(name, { ...input, [field]: value })));
}
for (const name of ['claimFoodToken', 'submitDisputeStrike']) {
  const input = cases.find(entry => entry[1] === name)[2];
  for (const value of ['not-uuid', `${ID}\n`, null]) test(`${name} rejects listing_id ${JSON.stringify(value)}`,
    invalid(name, { ...input, listing_id: value }));
}
for (const [name, input, field, value] of [
  ['createWasteBatch', cases[2][2], 'rate_per_kg', 0],
  ['createWasteBatch', cases[2][2], 'donor_id', ID],
  ['processWasteHandover', cases[3][2], 'processor_credit', -1],
  ['processWasteHandover', cases[3][2], 'donor_charge', 0],
  ['processWasteHandover', cases[3][2], 'subsidy_amount', 999999],
  ['claimFoodToken', cases[1][2], 'claimant_id', ID],
  ['submitDisputeStrike', cases[4][2], 'reported_by', ID],
]) test(`${name} rejects forged ${field}`, invalid(name, { ...input, [field]: value }));
for (const weight of [0.01, 1.23, 999999.99]) {
  test(`FHR12 accepts valid weight boundary ${weight} unchanged`, async () => {
    assert.equal((await actions.createWasteBatch({ ...cases[2][2], weight_kg: weight })).success, true);
    assert.equal(state.rpcs[0].params.p_weight_kg, weight);
  });
}

for (const [field, values] of [
  ['title', ['', ' ', 'x'.repeat(201), null, 123]],
  ['image_url', ['invalid', 'ftp://example.invalid/food', `https://example.invalid/${'x'.repeat(2048)}`, null]],
  ['cooked_at', ['invalid', '2026-09-16T04:00:00', '2026-13-16T04:00:00Z', null]],
  ['storage_method', ['other', null]],
  ['risky_ingredients', [null, [' '], ['x'.repeat(101)], Array(51).fill('rice')]],
  ['dietary_tags', [null, [' '], ['x'.repeat(101)], Array(21).fill('vegan')]],
  ['handling_notes', [null, 'x'.repeat(2001)]],
]) {
  values.forEach((value, index) => test(`FHR10 invalid ${field} #${index}`, invalid('createFoodListing', { ...food, [field]: value })));
}
for (const value of [null, undefined, {}, [], 42, { id: 'result' }, { id: null }, { id: `${ID}\n` }, { id: 123 }]) {
  test(`FHR10 rejects malformed insert result ${JSON.stringify(value)}`, async () => {
    state.insertData = value;
    assert.deepEqual(await actions.createFoodListing(food), { success: false, error: 'Gagal menyimpan listing makanan ke database.' });
    assert.equal(state.clients, 1);
    assert.equal(state.auth, 1);
    assert.equal(state.profiles, 1);
    assert.equal(state.inserts.length, 1);
    assert.equal(state.rpcs.length, 0);
    assert.deepEqual(state.tables, ['profiles', 'food_listings']);
  });
}
test('FHR10 normalizes text and appends notes to deterministic handling guidance', async () => {
  assert.deepEqual(await actions.createFoodListing({ ...food, title: ' Nasi ', portions: 2147483647,
    dietary_tags: [' vegan '], risky_ingredients: [' SANTAN '], handling_notes: ' Keep covered ',
    image_url: 'https://example.invalid/food.jpg' }), { success: true, data: { id: ID } });
  assert.equal(state.inserts.length, 1);
  assert.equal(state.rpcs.length, 0);
  assert.deepEqual(state.inserts[0], { ...food, title: 'Nasi', portions: 2147483647,
    remaining_portions: 2147483647, dietary_tags: ['vegan'], risky_ingredients: ['SANTAN'],
    image_url: 'https://example.invalid/food.jpg', safe_until: '2026-09-16T06:00:00.000Z',
    handling_notes: 'Bahan rentan basi terdeteksi (santan/susu/seafood). Wajib dipanaskan ulang hingga 70°C selama 5 menit sebelum dikonsumsi.\nKeep covered',
    donor_id: ID, food_condition: 'safe_for_consumption', status: 'active' });
});
for (const name of ['collectFoodClaim', 'processWasteHandover']) {
  for (const token of ['A'.repeat(32), `${'a'.repeat(32)}\n`, `${'a'.repeat(31)}\n`, `${'a'.repeat(32)}\r\n`]) {
    test(`${name} rejects token boundary ${JSON.stringify(token)}`, invalid(name, { token }));
  }
}

(async () => {
  let passed = 0;
  const failures = [];
  const originalNow = Date.now;
  // Fixed clock only; calculation/validation/action logic remain production implementations.
  Date.now = () => NOW;
  try {
    for (const { name, run } of tests) {
      reset();
      try { await run(); passed++; }
      catch (error) { failures.push(name); console.error(`FAIL ${name}\n  ${error.message}`); }
    }
  } finally { Date.now = originalNow; }
  console.log(JSON.stringify({ total: tests.length, passed, failed: failures.length, failures }, null, 2));
  console.log('Scope: action validation/expiry/denial propagation only; RPC authorization and financial calculations require real DB tests.');
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
