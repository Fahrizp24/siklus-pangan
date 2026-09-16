// Run: node scripts/test-create-food-listing.cjs
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
  mod.require = (id) => Object.hasOwn(mocks, id) ? mocks[id] : module.require(id);
  mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
  }).outputText, filename);
  return mod.exports;
}
let user, profile, dbError, inserts, payload;
const client = {
  auth: { getUser: async () => ({ data: { user }, error: null }) },
  from: (table) => table === 'profiles' ? {
    select: () => ({ eq: () => ({ single: async () => ({ data: profile, error: null }) }) })
  } : {
    insert: (row) => {
      inserts++; payload = row;
      return { select: () => ({ single: async () => ({ data: dbError ? null : { id: 'listing-id' }, error: dbError }) }) };
    }
  }
};
const { createFoodListing } = load('src/actions/food.ts', {
  '@/lib/supabase/server': { createClient: async () => client },
  '@/lib/rules/expiry': load('src/lib/rules/expiry.ts'),
});
const valid = () => ({ title: ' Nasi santan ', portions: 10,
  cooked_at: new Date(Date.now() - 3600000).toISOString(),
  storage_method: 'room_temperature', risky_ingredients: ['santan'], dietary_tags: ['halal'],
  image_url: 'https://example.com/food.jpg' });
(async () => {
  user = { id: 'donor-id' }; profile = { role: 'donor', is_banned: false }; inserts = 0;
  let result = await createFoodListing(valid());
  assert.equal(result.success, true);
  assert.equal(payload.donor_id, user.id);
  assert.equal(payload.title, 'Nasi santan');
  assert.equal(payload.remaining_portions, 10);
  assert.equal(payload.status, 'active');
  assert.equal(Date.parse(payload.safe_until) - Date.parse(payload.cooked_at), 7200000);
  for (const change of [{ portions: 0 }, { portions: 1.5 }, { portions: 2147483648 },
    { cooked_at: 'invalid' }, { cooked_at: new Date(Date.now() + 60000).toISOString() },
    { cooked_at: new Date(Date.now() - 14400000).toISOString() },
    { storage_method: 'unknown' }, { title: ' ' }, { image_url: 'javascript:alert(1)' },
    { donor_id: 'attacker' }, { safe_until: '2099-01-01T00:00:00Z' }, { risky_ingredients: null }]) {
    result = await createFoodListing({ ...valid(), ...change });
    assert.equal(result.success, false, JSON.stringify(change));
  }
  user = null;
  assert.equal((await createFoodListing(valid())).success, false);
  user = { id: 'donor-id' };
  for (const p of [null, { role: 'beneficiary', is_banned: false }, { role: 'donor', is_banned: true }]) {
    profile = p;
    assert.equal((await createFoodListing(valid())).success, false);
  }
  assert.equal(inserts, 1, 'invalid/unauthorized calls never insert');
  profile = { role: 'donor', is_banned: false }; dbError = { message: 'private database details' };
  result = await createFoodListing(valid());
  assert.equal(result.success, false);
  assert(!result.error.includes('private'));
  client.auth.getUser = async () => { throw new Error('private transport details'); };
  assert.equal((await createFoodListing(valid())).success, false);
  console.log('PASS: createFoodListing validation, expiry, authorization, insertion and errors (mock DB; real rules).');
})().catch(error => { console.error(error); process.exitCode = 1; });
