const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const root = path.resolve(__dirname, '../src');
const cache = new Map();
const originalLoad = Module._load;
const originalExtensions = { ...Module._extensions };
let checks = 0;
let failures = 0;
const tests = [];
const offlineActions = new Proxy({}, {
  get: (_, name) => () => { throw new Error(`Unexpected SSR action: ${String(name)}`); },
});

function load(request, parent = module) {
  if (request === '@/actions/transactions') return offlineActions;
  const base = request.startsWith('@/')
    ? path.resolve(root, request.slice(2))
    : path.resolve(path.dirname(parent.filename), request);
  assert(base.startsWith(root + path.sep), `Local import outside src: ${request}`);
  const filename = [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')]
    .find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  assert(filename, `Cannot resolve ${request} from ${parent.filename}`);
  assert(/\.tsx?$/.test(filename), `Unexpected local module: ${filename}`);
  if (cache.has(filename)) return cache.get(filename).exports;
  const mod = new Module(filename, parent);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  mod.require = id => id.startsWith('@/') || id.startsWith('.')
    ? load(id, mod)
    : Module.prototype.require.call(mod, id);
  cache.set(filename, mod);
  try {
    const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      fileName: filename,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
      reportDiagnostics: true,
    });
    const errors = (result.diagnostics || []).filter(item => item.category === ts.DiagnosticCategory.Error);
    assert.equal(errors.length, 0, errors.map(item => ts.flattenDiagnosticMessageText(item.messageText, '\n')).join('\n'));
    mod._compile(result.outputText, filename);
    mod.loaded = true;
    return mod.exports;
  } catch (error) {
    cache.delete(filename);
    throw error;
  }
}

function check(name, run) {
  tests.push({ name, run });
}

function render(Component, props = {}) {
  return renderToStaticMarkup(React.createElement(Component, props));
}

function buttons(html) {
  return [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)].map(([, attributes, content]) => ({ attributes, content }));
}

function attribute(element, name) {
  return element.attributes.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1];
}

function text(html) {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function readSource(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

const files = {
  rescue: 'components/pages/rescue/surplus-feed-section.tsx',
  card: 'components/ui/surplus-food-card.tsx',
  donor: 'components/pages/donate/donate-actions-section.tsx',
  waste: 'components/pages/waste/waste-operations-section.tsx',
  qr: 'components/scanner/qr-reader.tsx',
};

function componentSource(rel, name) {
  const source = ts.createSourceFile(rel, readSource(rel), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  assert.equal(source.parseDiagnostics.length, 0, `Invalid source: ${rel}`);
  const component = source.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === name);
  assert.ok(component?.body, `Missing component ${name}`);
  const find = predicate => {
    const matches = [];
    const visit = node => {
      if (predicate(node)) matches.push(node);
      ts.forEachChild(node, visit);
    };
    visit(component.body);
    assert.equal(matches.length, 1, `${rel}: expected one matching AST node, got ${matches.length}`);
    return matches[0];
  };
  const variable = name => find(node => ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === name).initializer;
  const handler = name => {
    let node = variable(name);
    if (ts.isCallExpression(node) && node.expression.getText(source) === 'useCallback') node = node.arguments[0];
    assert.ok(ts.isArrowFunction(node) || ts.isFunctionExpression(node), `Not a handler: ${name}`);
    return node.getText(source);
  };
  const prop = (tag, name, match) => {
    const node = find(node => (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
      node.tagName.getText(source) === tag && node.attributes.properties.some(attr =>
        ts.isJsxAttribute(attr) && attr.name.text === name && ts.isJsxExpression(attr.initializer) &&
        (!match || attr.initializer.expression?.getText(source) === match)));
    return node.attributes.properties.find(attr => ts.isJsxAttribute(attr) && attr.name.text === name).initializer.expression.getText(source);
  };
  return { source, find, variable, handler, prop };
}

function isolated(expression, scope) {
  const result = ts.transpileModule(`const extracted = (${expression});`, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: false },
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics || []).filter(item => item.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, errors.map(item => ts.flattenDiagnosticMessageText(item.messageText, '\n')).join('\n'));
  return new Function(...Object.keys(scope), `"use strict"; ${result.outputText}\nreturn extracted;`)(...Object.values(scope));
}

function stateHarness(initial) {
  const state = { ...initial };
  const writes = [];
  const setters = Object.fromEntries(Object.keys(initial).map(key => [
    `set${key[0].toUpperCase()}${key.slice(1)}`,
    value => {
      state[key] = typeof value === 'function' ? value(state[key]) : value;
      writes.push({ key, value: structuredClone(state[key]) });
    },
  ]));
  return { state, writes, scope: () => ({ ...state, ...setters }) };
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

async function microtasks() {
  for (let i = 0; i < 8; i += 1) await Promise.resolve();
}

const confirmedClaim = { success: true, data: { id: 'claim /1', qr_token: 'token+/&1' } };
const confirmedWaste = { success: true, data: { processor_credit: 1500, subsidy_amount: 500 } };
const liveCard = {
  id: 'listing-1', donorCode: 'Offline donor', title: 'Offline food', imageUrl: '/offline-food.png',
  tags: [], remainingTime: '01j 00m', safeUntil: '2099-01-01T00:00:00.000Z',
  portionsCount: 3, portionsRemainingText: '3 Porsi Tersisa',
};

function rescueHarness(model, action, storageThrows = false) {
  const h = stateHarness({
    claimStates: {}, liveListings: [{ ...liveCard }, { ...liveCard, id: 'listing-2' }],
    feedStatus: 'success', claimDestination: null, now: 0,
  });
  const pendingClaim = { current: null };
  const mounted = { current: true };
  const calls = [];
  const storage = [];
  const navigation = [];
  const timers = new Map();
  const scope = () => ({
    ...h.scope(), pendingClaim, mounted,
    require: id => {
      assert.equal(id, '@/actions/transactions', 'Only mocked action imports allowed');
      return { claimFoodToken: input => { calls.push(input); return action(input); } };
    },
    localStorage: { setItem: (...args) => { storage.push(args); if (storageThrows) throw new Error('Storage unavailable'); } },
    router: { push: destination => navigation.push(destination) },
    setTimeout: (callback, delay) => { assert.equal(delay, 1200); const id = timers.size + 1; timers.set(id, callback); return id; },
    clearTimeout: id => timers.delete(id),
  });
  const effect = model.find(node => ts.isCallExpression(node) && node.expression.getText(model.source) === 'React.useEffect' &&
    node.arguments[1] && ts.isArrayLiteralExpression(node.arguments[1]) &&
    node.arguments[1].elements.some(item => ts.isIdentifier(item) && item.text === 'claimDestination')).arguments[0].getText(model.source);
  return {
    ...h, pendingClaim, mounted, calls, storage, navigation, timers,
    renderHandler: () => isolated(model.handler('handleClaimFood'), scope()),
    navigate: () => isolated(effect, scope())(),
    flushTimers: () => { for (const callback of timers.values()) callback(); timers.clear(); },
  };
}

function handoverHarness(model, kind, action) {
  const donor = kind === 'donor';
  const h = stateHarness(donor ? {
    isVerifying: false, handoverBanner: { success: true, message: 'Old confirmed success' }, showDonorQrScanner: true,
  } : {
    isHandoverProcessing: false, handoverSuccessMsg: 'Old confirmed success', handoverErrorMsg: 'Old error', showHandoverQrReader: true,
  });
  const handoverLockRef = { current: false };
  const calls = [];
  const scope = {
    ...h.scope(), handoverLockRef,
    [donor ? 'collectFoodClaim' : 'processWasteHandover']: input => { calls.push(input); return action(input); },
  };
  const handlerName = donor ? 'handleScanClaimSuccess' : 'handleHandoverScanSuccess';
  assert.equal(model.prop('QrReader', 'onScanSuccess'), handlerName);
  assert.equal(model.prop('Dialog', 'onOpenChange', 'handleHandoverDialogChange'), 'handleHandoverDialogChange');
  return {
    ...h, handoverLockRef, calls,
    handle: isolated(model.handler(handlerName), scope),
    dialog: isolated(model.handler('handleHandoverDialogChange'), scope),
    processing: () => h.state[donor ? 'isVerifying' : 'isHandoverProcessing'],
    open: () => h.state[donor ? 'showDonorQrScanner' : 'showHandoverQrReader'],
    success: () => donor ? h.state.handoverBanner?.success === true : h.state.handoverSuccessMsg !== null,
    error: () => donor ? h.state.handoverBanner?.message : h.state.handoverErrorMsg,
    cleared: () => donor ? h.state.handoverBanner === null : h.state.handoverSuccessMsg === null && h.state.handoverErrorMsg === null,
  };
}

function qrHarness(model, action) {
  const h = stateHarness({
    scannedResult: null, verificationState: 'idle', verificationError: 'Old error',
    isProcessing: false, isScanning: true,
  });
  const calls = [];
  const pauses = [];
  const scanLockedRef = { current: false };
  const mountedRef = { current: true };
  const pausedRef = { current: false };
  const scope = {
    ...h.scope(), scanLockedRef, mountedRef, pausedRef,
    scannerRef: { current: { isScanning: true, pause: value => pauses.push(value) } },
    onScanSuccessRef: { current: code => { calls.push(code); return action(code); } },
  };
  return { ...h, calls, pauses, scanLockedRef, mountedRef, pausedRef, verify: isolated(model.handler('verifyCode'), scope) };
}

function behaviorTests() {
  const rescue = componentSource(files.rescue, 'SurplusFeedSection');
  const card = componentSource(files.card, 'SurplusFoodCard');
  const donor = componentSource(files.donor, 'DonateActionsSection');
  const waste = componentSource(files.waste, 'WasteOperationsSection');
  const qr = componentSource(files.qr, 'QrReader');
  assert.equal(rescue.prop('SurplusFoodCard', 'onClaim'), 'handleClaimFood');

  for (const storageThrows of [false, true]) {
    check(`Handler/offline: rescue confirmed success${storageThrows ? ', storage throws' : ''}, deferred stock/navigation and double-click lock`, async () => {
      const d = deferred();
      const h = rescueHarness(rescue, () => d.promise, storageThrows);
      const handle = h.renderHandler();
      const pending = handle(liveCard.id);
      assert.equal(h.pendingClaim.current, liveCard.id);
      assert.equal(h.state.claimStates[liveCard.id].status, 'pending');
      await handle(liveCard.id);
      await handle('listing-2');
      await microtasks();
      assert.deepEqual(h.calls, [{ listing_id: liveCard.id, portions: 1 }]);
      assert.equal(h.state.liveListings[0].portionsCount, 3);
      assert.equal(h.state.claimDestination, null);
      h.navigate();
      assert.equal(h.timers.size, 0);
      assert.deepEqual(h.storage, []);
      d.resolve(confirmedClaim);
      await pending;
      assert.equal(h.state.claimStates[liveCard.id].status, 'success');
      assert.equal(h.state.liveListings[0].portionsCount, 2);
      assert.equal(h.state.liveListings[0].portionsRemainingText, '2 Porsi Tersisa');
      assert.equal(h.state.liveListings[1].portionsCount, 3);
      assert.equal(h.writes.filter(item => item.key === 'liveListings').length, 1);
      assert.equal(h.storage.length, 1);
      assert.equal(h.storage[0][0], 'siklus_active_claim');
      assert.deepEqual(JSON.parse(h.storage[0][1]), { claimId: confirmedClaim.data.id, qrToken: confirmedClaim.data.qr_token, listingId: liveCard.id });
      if (storageThrows) assert.match(h.state.claimStates[liveCard.id].message, /token tidak tersimpan/);
      const destination = '/claims?claimId=claim%20%2F1&token=token%2B%2F%261';
      assert.equal(h.state.claimDestination, destination);
      assert.deepEqual(h.navigation, []);
      const cleanup = h.navigate();
      assert.equal(h.timers.size, 1);
      cleanup();
      assert.equal(h.timers.size, 0);
      h.navigate();
      h.flushTimers();
      assert.deepEqual(h.navigation, [destination]);
      await h.renderHandler()(liveCard.id);
      assert.equal(h.calls.length, 1);
    });
  }

  const uncertainCases = [
    ['action false', { success: false, error: 'Rejected' }],
    ['promise rejection', null, 'reject'],
    ['synchronous throw', null, 'throw'],
    ['missing token', { success: true, data: { id: 'claim-1' } }],
    ['empty token', { success: true, data: { id: 'claim-1', qr_token: '' } }],
    ['missing claim ID', { success: true, data: { qr_token: 'token-1' } }],
    ['missing data', { success: true }],
    ['void response', undefined],
  ];
  for (const [name, response, mode] of uncertainCases) {
    check(`Handler/offline: rescue ${name} stays uncertain, no retry/stock/storage/navigation`, async () => {
      const d = deferred();
      const h = rescueHarness(rescue, () => { if (mode === 'throw') throw new Error('Offline throw'); return d.promise; });
      const handle = h.renderHandler();
      const pending = handle(liveCard.id);
      await handle(liveCard.id);
      await microtasks();
      assert.equal(h.calls.length, 1);
      if (mode !== 'throw') {
        assert.equal(h.state.claimStates[liveCard.id].status, 'pending');
        if (mode === 'reject') d.reject(new Error('Offline rejection'));
        else d.resolve(response);
      }
      await pending;
      const claimState = h.state.claimStates[liveCard.id];
      assert.equal(claimState.status, 'uncertain');
      assert.match(claimState.message, /Pengiriman ulang dinonaktifkan/);
      assert.equal(h.pendingClaim.current, null);
      assert.equal(h.state.liveListings[0].portionsCount, 3);
      assert.equal(h.state.claimDestination, null);
      assert.deepEqual(h.storage, []);
      assert.ok(!h.writes.some(item => item.key === 'liveListings' || item.key === 'claimDestination'));
      assert.ok(!h.writes.some(item => item.key === 'claimStates' && item.value[liveCard.id]?.status === 'success'));
      h.navigate();
      h.flushTimers();
      assert.deepEqual(h.navigation, []);
      await h.renderHandler()(liveCard.id);
      assert.equal(h.calls.length, 1, 'Re-rendered handler must deny resubmission after uncertain result');
      const html = render(load('@/components/ui/surplus-food-card').SurplusFoodCard, { card: h.state.liveListings[0], claimState });
      const [button] = buttons(html);
      assert.match(button.attributes, /\bdisabled=""/);
      assert.match(text(button.content), /Status Belum Pasti/);
      assert.doesNotMatch(text(html), /Coba Lagi|Terklaim!|Klaim berhasil/);
      assert.match(html, /href="\/claims"/);
      assert.equal(attribute(button, 'aria-busy'), 'false');
    });
  }

  for (const status of ['idle', 'pending', 'uncertain', 'success']) {
    check(`Handler/offline: actual card click ${status} ${status === 'idle' ? 'forwards ID' : 'denies claim'}`, () => {
      const calls = [];
      const scope = { card: liveCard, claimState: { status }, isClaimed: false, claimDisabled: false, onClaim: id => calls.push(id) };
      for (const name of ['pending', 'uncertain', 'claimed', 'expired', 'unavailable', 'disabled']) {
        scope[name] = isolated(card.variable(name).getText(card.source), scope);
      }
      isolated(card.prop('Button', 'onClick'), scope)();
      assert.deepEqual(calls, status === 'idle' ? [liveCard.id] : []);
    });
  }

  for (const [kind, model] of [['donor', donor], ['waste', waste]]) {
    for (const mode of ['success', 'false', 'reject', 'throw', ...(kind === 'waste' ? ['missing data'] : [])]) {
      check(`Handler/offline: ${kind} handover ${mode}, banner reset and finally unlock${mode === 'throw' ? '' : ', deferred duplicate/dialog guards'}`, async () => {
        const d = deferred();
        const h = handoverHarness(model, kind, () => { if (mode === 'throw') throw new Error('Offline throw'); return d.promise; });
        assert.equal(h.success(), true);
        const pending = h.handle('offline-token');
        if (mode !== 'throw') {
          assert.equal(h.handoverLockRef.current, true);
          assert.equal(h.processing(), true);
          assert.equal(h.cleared(), true, 'Old success and error banners cleared before awaiting');
          const writes = h.writes.length;
          const duplicate = h.handle('duplicate-token');
          assert.equal(h.calls.length, 1, 'Duplicate denied synchronously');
          assert.equal((await duplicate).success, false);
          h.dialog(false);
          h.dialog(true);
          assert.equal(h.open(), true);
          assert.equal(h.writes.length, writes, 'Pending duplicate/dialog change must not call setters');
          await microtasks();
          assert.equal(h.processing(), true);
          assert.equal(h.success(), false);
          if (mode === 'reject') d.reject(new Error('Offline rejection'));
          else d.resolve(mode === 'success' ? (kind === 'donor' ? { success: true } : confirmedWaste) :
            mode === 'missing data' ? { success: true } : { success: false, error: 'Offline denied' });
        }
        const result = await pending;
        if (kind === 'donor') {
          assert.deepEqual(h.writes.filter(item => item.key === 'handoverBanner')[0], { key: 'handoverBanner', value: null });
        } else {
          assert.deepEqual(h.writes.filter(item => item.key === 'handoverSuccessMsg')[0], { key: 'handoverSuccessMsg', value: null });
          assert.deepEqual(h.writes.filter(item => item.key === 'handoverErrorMsg')[0], { key: 'handoverErrorMsg', value: null });
        }
        assert.equal(result.success, mode === 'success');
        assert.equal(h.handoverLockRef.current, false);
        assert.equal(h.processing(), false);
        assert.deepEqual(h.calls, [{ token: 'offline-token' }]);
        assert.equal(h.success(), mode === 'success');
        assert.equal(h.open(), mode !== 'success');
        if (mode !== 'success') {
          assert.equal(typeof result.error, 'string');
          assert.ok(result.error.length > 0);
          assert.equal(h.error(), result.error);
          if (mode === 'false') assert.equal(result.error, 'Offline denied');
        }
        h.dialog(false);
        assert.equal(h.open(), false);
        h.dialog(true);
        assert.equal(h.open(), true, 'Dialog unlocked after finally');
        await h.handle('retry-token');
        assert.equal(h.calls.length, 2, 'Action callable again after finally');
        assert.equal(h.handoverLockRef.current, false);
        assert.equal(h.processing(), false);
      });
    }
  }

  const qrCases = [
    ['true', true, 'verified'], ['false', false, 'invalid'], ['void', undefined, 'invalid'],
    ['object success', { success: true }, 'verified'],
    ['object failure', { success: false, error: 'Offline invalid token' }, 'invalid'],
    ['rejection', undefined, 'invalid', 'reject'],
  ];
  for (const [name, value, expected, mode] of qrCases) {
    check(`Handler/offline: QR ${name} awaits parent, synchronous duplicate lock, then ${expected}`, async () => {
      const d = deferred();
      const h = qrHarness(qr, () => d.promise);
      const pending = h.verify('raw-code', 'display-code');
      assert.equal(h.scanLockedRef.current, true);
      assert.equal(h.state.scannedResult, 'display-code');
      assert.equal(h.state.verificationState, 'read');
      assert.equal(h.state.verificationError, null);
      assert.equal(h.state.isProcessing, true);
      assert.equal(h.state.isScanning, false);
      assert.deepEqual(h.pauses, [true]);
      assert.equal(h.pausedRef.current, true);
      const writes = h.writes.length;
      const duplicate = h.verify('duplicate-code');
      assert.deepEqual(h.calls, ['raw-code']);
      assert.equal(h.writes.length, writes);
      await duplicate;
      await microtasks();
      assert.equal(h.state.verificationState, 'read');
      assert.equal(h.state.isProcessing, true);
      assert.ok(!h.writes.some(item => item.key === 'verificationState' && item.value === 'verified'));
      if (mode === 'reject') d.reject(new Error('Offline rejection'));
      else d.resolve(value);
      await pending;
      assert.equal(h.state.verificationState, expected);
      assert.equal(h.state.isProcessing, false);
      if (expected === 'invalid') {
        assert.ok(h.state.verificationError);
        assert.ok(!h.writes.some(item => item.key === 'verificationState' && item.value === 'verified'));
        if (value?.error) assert.equal(h.state.verificationError, value.error);
      } else assert.equal(h.state.verificationError, null);
      assert.equal(h.scanLockedRef.current, true, 'Scans remain locked until explicit retry');
      await h.verify('third-code');
      assert.equal(h.calls.length, 1);
    });
  }

  check('Handler/offline: QR synchronous parent throw is invalid and ends processing', async () => {
    const h = qrHarness(qr, () => { throw new Error('Offline throw'); });
    await h.verify('code');
    assert.equal(h.state.verificationState, 'invalid');
    assert.equal(h.state.isProcessing, false);
    assert.ok(h.state.verificationError);
    assert.equal(h.scanLockedRef.current, true);
  });

  for (const [name, value, , mode] of qrCases) {
    check(`Handler/offline: QR unmounted while ${name} pending has no subsequent setter calls`, async () => {
      const d = deferred();
      const h = qrHarness(qr, () => d.promise);
      const pending = h.verify('code');
      assert.equal(h.state.verificationState, 'read');
      h.mountedRef.current = false;
      const writes = structuredClone(h.writes);
      const state = structuredClone(h.state);
      if (mode === 'reject') d.reject(new Error('Offline rejection'));
      else d.resolve(value);
      await pending;
      assert.deepEqual(h.writes, writes);
      assert.deepEqual(h.state, state);
    });
  }
}

async function main() {
  console.log('Offline AST-extracted production handlers with mocked closures + SSR; NOT browser/DOM/camera tests.');
  const qr = load('@/components/scanner/qr-reader');
  const donate = load('@/components/pages/donate/donate-actions-section');

  check('QrReader idle SSR contains no verified text and no premature status banner', () => {
    const { QrReader } = qr;
    const html = render(QrReader, { onScanSuccess: () => {} });
    assert.ok(!text(html).includes('QR Code Terverifikasi!'), 'Idle scanner must not claim verified');
    assert.doesNotMatch(html, /QR Code Terverifikasi!/);
  });

  check('DonateActionsSection SSR renders actions without handover banner', () => {
    const { DonateActionsSection } = donate;
    const html = render(DonateActionsSection, { onSaveDraft: () => {}, onPublish: () => {} });
    assert.match(html, /<section\b/);
    assert.ok(!text(html).includes('Serah terima'), 'No premature handover banner on idle SSR');
  });

  behaviorTests();

  check('Loader caches modules without global require hooks', () => {
    assert.strictEqual(load('@/components/scanner/qr-reader').QrReader, qr.QrReader);
    assert.strictEqual(Module._load, originalLoad);
    assert.deepEqual({ ...Module._extensions }, originalExtensions);
  });

  for (const { name, run } of tests) {
    try {
      await run();
      checks += 1;
      console.log(`PASS: ${name}`);
    } catch (error) {
      failures += 1;
      console.error(`FAIL: ${name}\n${error.stack || error}`);
    }
  }
  console.log(`\n${checks} passed, ${failures} failed, ${tests.length} registered (offline handlers + SSR, not browser tests)`);
  if (failures) process.exitCode = 1;
}

main().catch(error => {
  console.error('FAIL: test setup', error.stack || error);
  process.exitCode = 1;
}).finally(() => {
  Module._load = originalLoad;
  Module._extensions = originalExtensions;
});
