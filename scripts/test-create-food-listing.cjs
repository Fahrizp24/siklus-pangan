const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
function load(relative, mocks = {}) {
  const filename = path.join(root, relative);
  const mod = new Module(filename, module);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  mod.require = (id) => {
    if (Object.hasOwn(mocks, id)) return mocks[id];
    assert.equal(id, 'zod', `Unexpected dependency: ${id}`);
    return module.require(id);
  };
  mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText, filename);
  return mod.exports;
}
const donorId = 'f36e2d71-ec23-43a0-9de6-81af9e3ca752';
const listingId = '550e8400-e29b-41d4-a716-446655440000';
const now = Date.parse('2026-09-17T12:00:00.000Z');
const privateError = { message: 'private database details', details: 'private transport details' };
let authResponse, profileResponse, insertResponse, thrownStage, thrownValue;
let clients, authCalls, profileReads, inserts, payload;
function reset() {
  authResponse = { data: { user: { id: donorId } }, error: null };
  profileResponse = { data: { role: 'donor', is_banned: false }, error: null };
  insertResponse = { data: { id: listingId }, error: null };
  thrownStage = undefined;
  thrownValue = new Error('private transport details');
  clients = authCalls = profileReads = inserts = 0;
  payload = undefined;
}
function maybeThrow(stage) {
  if (thrownStage === stage) throw thrownValue;
}
const client = {
  auth: {
    getUser: async () => {
      authCalls++;
      maybeThrow('auth');
      return authResponse;
    }
  },
  from: (table) => {
    maybeThrow('from');
    if (table === 'profiles') {
      profileReads++;
      return {
        select: (columns) => {
          assert.equal(columns, 'role, is_banned');
          return { eq: (column, id) => {
            assert.equal(column, 'id');
            assert.equal(id, authResponse.data.user.id);
            return { single: async () => {
              maybeThrow('profile');
              return profileResponse;
            } };
          } };
        }
      };
    }
    assert.equal(table, 'food_listings');
    assert.equal(clients, 1);
    assert.equal(authCalls, 1);
    assert.equal(profileReads, 1);
    assert.equal(authResponse.error, null);
    assert.equal(profileResponse.error, null);
    assert.deepEqual(profileResponse.data, { role: 'donor', is_banned: false });
    return {
      insert: (row) => {
        inserts++;
        payload = row;
        maybeThrow('insert');
        return { select: (columns) => {
          assert.equal(columns, 'id');
          return { single: async () => {
            maybeThrow('response');
            return insertResponse;
          } };
        } };
      }
    };
  }
};
const { calculateFoodExpiry } = load('src/lib/rules/expiry.ts');
const { createFoodListing } = load('src/actions/food.ts', {
<<<<<<< HEAD
  '@/lib/supabase/server': { createClient: async () => {
    clients++;
    maybeThrow('client');
    return client;
  } },
  '@/lib/rules/expiry': { calculateFoodExpiry },
=======
  '@/lib/supabase/server': { createClient: async () => client },
  '@/lib/supabase/admin': { createAdminClient: () => client },
  '@/lib/rules/expiry': load('src/lib/rules/expiry.ts'),
>>>>>>> 9aafb0fa78151899b4a3faa2e8f6e8e7ec923a7e
});
const valid = () => ({ title: ' Nasi santan ', portions: 10,
  cooked_at: new Date(now - 3600000).toISOString(),
  storage_method: 'room_temperature', risky_ingredients: ['santan'], dietary_tags: ['halal'],
  image_url: 'https://example.com/food.jpg' });
function rejected(result, label) {
  assert.equal(result.success, false, label);
  assert.equal(typeof result.error, 'string', label);
  assert(result.error.length > 0, label);
  assert.deepEqual(Object.keys(result).sort(), ['error', 'success'], label);
  assert(!JSON.stringify(result).includes('private'), label);
}
(async () => {
  const originalNow = Date.now;
  const originalConsole = { log: console.log, warn: console.warn, error: console.error };
  const logs = [];
  Date.now = () => now;
  for (const method of Object.keys(originalConsole)) console[method] = (...args) => logs.push(args);
  try {
    reset();
    const food = { ...valid(), handling_notes: ' Ambil segera ' };
    assert.deepEqual(await createFoodListing(food), { success: true, data: { id: listingId } });
    const expiry = calculateFoodExpiry({ cookedAt: food.cooked_at,
      storageMethod: food.storage_method, riskyIngredients: food.risky_ingredients });
    assert.deepEqual(payload, {
      title: 'Nasi santan', image_url: food.image_url, portions: 10, remaining_portions: 10,
      storage_method: food.storage_method, risky_ingredients: ['santan'], dietary_tags: ['halal'],
      cooked_at: food.cooked_at, safe_until: expiry.safeUntil.toISOString(),
      handling_notes: `${expiry.handlingRecommendations}\nAmbil segera`, donor_id: donorId,
      food_condition: 'safe_for_consumption', status: 'active'
    });
    assert.equal(Date.parse(payload.safe_until) - Date.parse(payload.cooked_at), 7200000);
    assert.equal(clients, 1);
    assert.equal(inserts, 1);

    for (const omitImage of [true, false]) {
      reset();
      const input = { ...valid(), image_url: undefined };
      if (omitImage) delete input.image_url;
      assert.equal((await createFoodListing(input)).success, true);
      assert.equal(payload.image_url, null);
      assert.equal(payload.handling_notes, expiry.handlingRecommendations);
    }
    reset();
    authResponse.data.user.id = 'e42ea017-f32c-4d45-a2fb-ebc912903850';
    assert.equal((await createFoodListing(valid())).success, true);
    assert.equal(payload.donor_id, authResponse.data.user.id);

    const invalidChanges = [{ portions: 0 }, { portions: -1 }, { portions: 1.5 },
      { portions: 2147483648 }, { portions: '10' }, { portions: NaN }, { portions: Infinity },
      { cooked_at: 'invalid' }, { cooked_at: '2026-09-17T11:00:00' },
      { cooked_at: '2026-02-30T11:00:00Z' },
      { cooked_at: new Date(now + 1).toISOString() },
      { cooked_at: new Date(now - 7200000).toISOString() },
      { cooked_at: new Date(now - 14400000).toISOString() },
      { storage_method: 'unknown' }, { title: ' ' }, { title: 'x'.repeat(201) },
      { image_url: 'javascript:alert(1)' }, { image_url: 'ftp://example.com/food.jpg' },
      { image_url: '' }, { image_url: null }, { image_url: `https://example.com/${'x'.repeat(2048)}` },
      { donor_id: donorId }, { safe_until: '2099-01-01T00:00:00Z' }, { status: 'active' },
      { remaining_portions: 10 }, { risky_ingredients: null }, { risky_ingredients: [' '] },
      { risky_ingredients: ['x'.repeat(101)] }, { risky_ingredients: Array(51).fill('santan') },
      { dietary_tags: null }, { dietary_tags: [' '] }, { dietary_tags: ['x'.repeat(101)] },
      { dietary_tags: Array(21).fill('halal') }, { handling_notes: 'x'.repeat(2001) }];
    for (const input of [null, undefined, [], 'food', 10, {}, ...invalidChanges.map(change => ({ ...valid(), ...change }))]) {
      reset();
      rejected(await createFoodListing(input), JSON.stringify(input));
      assert.equal(clients, 0, 'invalid input must not create a client');
      assert.equal(inserts, 0);
    }
    for (const field of ['title', 'portions', 'cooked_at', 'storage_method', 'risky_ingredients', 'dietary_tags']) {
      reset();
      const input = valid();
      delete input[field];
      rejected(await createFoodListing(input), `missing ${field}`);
      assert.equal(clients, 0);
      assert.equal(inserts, 0);
    }

    for (const response of [
      { data: { user: null }, error: null }, { data: {}, error: null },
      { data: null, error: null }, { error: null }, null, undefined,
      { data: { user: { id: donorId } }, error: privateError },
      { data: { user: null }, error: privateError }
    ]) {
      reset();
      authResponse = response;
      rejected(await createFoodListing(valid()), 'invalid auth response');
      assert.equal(clients, 1);
      assert.equal(authCalls, 1);
      assert.equal(profileReads, 0);
      assert.equal(inserts, 0);
    }
    for (const profile of [null, undefined, {}, 'donor', false, [],
      { role: 'beneficiary', is_banned: false }, { role: 'admin', is_banned: false },
      { role: null, is_banned: false }, { role: ['donor'], is_banned: false },
      { role: 'donor' }, ...[true, null, undefined, 0, 1, '', 'false', 'true', [], {}]
        .map(is_banned => ({ role: 'donor', is_banned }))]) {
      reset();
      profileResponse.data = profile;
      rejected(await createFoodListing(valid()), 'invalid profile');
      assert.equal(profileReads, 1);
      assert.equal(inserts, 0);
    }
    for (const response of [null, undefined, {},
      { data: { role: 'donor', is_banned: false }, error: privateError },
      { data: null, error: privateError }]) {
      reset();
      profileResponse = response;
      rejected(await createFoodListing(valid()), 'failed profile lookup');
      assert.equal(inserts, 0);
    }

    for (const response of [null, undefined, {}, { data: null, error: null },
      { error: null }, { data: {}, error: null }, { data: [], error: null },
      { data: listingId, error: null }, { data: null, error: privateError },
      { data: { id: listingId }, error: privateError },
      ...[undefined, null, '', 'listing-id', 42, {}, [listingId], `${listingId}\n`, ` ${listingId}`,
        'zzzzzzzz-e29b-41d4-a716-446655440000', listingId.replaceAll('-', '')]
        .map(id => ({ data: { id }, error: null }))]) {
      reset();
      insertResponse = response;
      rejected(await createFoodListing(valid()), 'malformed or failed insert response');
      assert.equal(clients, 1);
      assert.equal(inserts, 1, 'failed insert response must not trigger a retry');
    }

    for (const stage of ['client', 'auth', 'from', 'profile', 'insert', 'response']) {
      for (const value of [new Error('private transport details'), privateError, 'private failure', null]) {
        reset();
        thrownStage = stage;
        thrownValue = value;
        assert.deepEqual(await createFoodListing(valid()), {
          success: false, error: 'Permintaan gagal. Periksa koneksi basis data.'
        });
        assert.equal(clients, 1);
        assert.equal(inserts, ['insert', 'response'].includes(stage) ? 1 : 0);
      }
    }
    reset();
    const throwingInput = { ...valid(), get title() { throw new Error('private input details'); } };
    rejected(await createFoodListing(throwingInput), 'throwing input');
    assert.equal(clients, 0);
    assert.equal(inserts, 0);

    for (const [storage, riskyHours, normalHours] of [
      ['room_temperature', 2, 4], ['heated_display', 4, 6],
      ['refrigerated', 6, 8], ['sealed_container', 3, 5]
    ]) {
      for (const [ingredients, hours] of [[['santan'], riskyHours], [[], normalHours]]) {
        reset();
        assert.equal((await createFoodListing({ ...valid(), storage_method: storage,
          risky_ingredients: ingredients })).success, true);
        assert.equal(Date.parse(payload.safe_until) - Date.parse(payload.cooked_at), hours * 3600000);
      }
    }
    for (const [utc, offsets, expectedSuccess] of [
      ['2026-09-17T11:00:00.000Z', ['2026-09-17T18:00:00.000+07:00', '2026-09-17T06:00:00.000-05:00'], true],
      ['2026-09-17T12:00:00.001Z', ['2026-09-17T19:00:00.001+07:00'], false],
      ['2026-09-17T10:00:00.000Z', ['2026-09-17T17:00:00.000+07:00'], false]
    ]) {
      reset();
      const utcResult = await createFoodListing({ ...valid(), cooked_at: utc });
      assert.equal(utcResult.success, expectedSuccess);
      const utcPayload = payload;
      for (const offset of offsets) {
        reset();
        assert.equal(Date.parse(offset), Date.parse(utc));
        assert.deepEqual(await createFoodListing({ ...valid(), cooked_at: offset }), utcResult);
        if (expectedSuccess) {
          assert.equal(payload.cooked_at, offset);
          assert.deepEqual({ ...payload, cooked_at: utc }, utcPayload);
        } else {
          assert.equal(clients, 0);
          assert.equal(inserts, 0);
        }
      }
    }
    assert.deepEqual(logs, [], 'action must not log errors or private details');
  } finally {
    Date.now = originalNow;
    Object.assign(console, originalConsole);
  }
  console.log('PASS: createFoodListing strict validation, session authorization, real expiry, UUID responses, redaction and timestamp equivalence (offline mock transport).');
})().catch(error => { console.error(error); process.exitCode = 1; });
