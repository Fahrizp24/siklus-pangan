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
const tests = [];
let checks = 0;
let failures = 0;
let forbiddenCalls = 0;
const forbidden = () => {
  forbiddenCalls += 1;
  assert.fail('Offline harness must not invoke actions, navigation, or clients');
};
const mocks = new Map([
  ['@/actions/transactions', { collectFoodClaim: forbidden, claimFoodToken: forbidden }],
  ['@/lib/supabase/client', { createClient: forbidden }],
  ['next/navigation', { useRouter: () => ({ push: forbidden, replace: forbidden, refresh: forbidden }), usePathname: () => '/rescue' }],
  ['@/assets/logo-text.webp', { src: '/offline-logo.webp', width: 200, height: 40 }],
]);

function transpile(source, filename) {
  const result = ts.transpileModule(source, {
    fileName: filename,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      removeComments: true,
    },
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics || []).filter(item => item.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, errors.map(item => ts.flattenDiagnosticMessageText(item.messageText, '\n')).join('\n'));
  return result.outputText;
}

function load(request, parent = module) {
  if (mocks.has(request)) return mocks.get(request);
  assert.ok(!/^@\/(actions\/|lib\/supabase\/)/.test(request), `Unmocked environment import: ${request}`);
  const base = request.startsWith('@/')
    ? path.resolve(root, request.slice(2))
    : path.resolve(path.dirname(parent.filename), request);
  assert.ok(base.startsWith(root + path.sep), `Local import outside src: ${request}`);
  const filename = [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')]
    .find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
  assert.ok(filename && /\.tsx?$/.test(filename), `Cannot resolve TypeScript module: ${request}`);
  if (cache.has(filename)) return cache.get(filename).exports;
  const mod = new Module(filename, parent);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(path.dirname(filename));
  mod.require = id => mocks.has(id) ? mocks.get(id)
    : id.startsWith('@/') || id.startsWith('.') ? load(id, mod)
      : Module.prototype.require.call(mod, id);
  cache.set(filename, mod);
  try {
    mod._compile(transpile(fs.readFileSync(filename, 'utf8'), filename), filename);
    mod.loaded = true;
    return mod.exports;
  } catch (error) {
    cache.delete(filename);
    throw error;
  }
}

function model(request, componentName) {
  const filename = path.join(root, `${request.slice(2)}.tsx`);
  const source = ts.createSourceFile(filename, fs.readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  assert.equal(source.parseDiagnostics.length, 0);
  const component = source.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === componentName);
  assert.ok(component?.body, `Missing production component: ${componentName}`);
  const find = predicate => {
    const matches = [];
    const visit = node => {
      if (predicate(node)) matches.push(node);
      ts.forEachChild(node, visit);
    };
    visit(component.body);
    assert.equal(matches.length, 1, `${componentName}: expected one AST match, got ${matches.length}`);
    return matches[0];
  };
  const variable = name => find(node => ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === name).initializer;
  const prop = (tag, name, match) => {
    const element = find(node => (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
      node.tagName.getText(source) === tag && (!match || match(node, source)) &&
      node.attributes.properties.some(attr => ts.isJsxAttribute(attr) && attr.name.text === name));
    const attr = element.attributes.properties.find(attr => ts.isJsxAttribute(attr) && attr.name.text === name);
    assert.ok(attr.initializer && ts.isJsxExpression(attr.initializer) && attr.initializer.expression);
    return attr.initializer.expression;
  };
  return { source, find, variable, prop };
}

function evaluate(node, source, scope = {}) {
  const code = transpile(`const extracted = (${node.getText(source)});`, 'offline-extracted.tsx');
  return new Function(...Object.keys(scope), `"use strict"; ${code}\nreturn extracted;`)(...Object.values(scope));
}

function check(name, run) {
  tests.push({ name, run });
}

function render(Component, props = {}) {
  return renderToStaticMarkup(React.createElement(Component, props));
}

function elements(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}>`, 'g'))]
    .map(([, attributes, content]) => ({ attributes, content }));
}

function attribute(element, name) {
  return element.attributes.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1];
}

function text(html) {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function unavailable(html, id, expectedCount, explanation) {
  const controls = [...html.matchAll(/<(button|input|fieldset)\b([^>]*)>/g)]
    .map(([, tag, attributes]) => ({ tag, attributes }))
    .filter(element => (attribute(element, 'aria-describedby') || '').split(/\s+/).includes(id));
  assert.equal(controls.length, expectedCount, `${id}: control count`);
  for (const control of controls) assert.notEqual(attribute(control, 'disabled'), undefined, `${id}: enabled ${control.tag}`);
  const descriptions = [...html.matchAll(/<(p|span)\b([^>]*)>([\s\S]*?)<\/\1>/g)]
    .map(([, tag, attributes, content]) => ({ tag, attributes, content }))
    .filter(element => attribute(element, 'id') === id);
  assert.equal(descriptions.length, 1, `${id}: missing/duplicate explanation`);
  assert.match(text(descriptions[0].content), explanation);
  assert.doesNotMatch(descriptions[0].attributes, /\bhidden(?:\s|=)|sr-only|display:\s*none|visibility:\s*hidden/);
}

function withRows(data, key, rows, run) {
  const original = data[key];
  data[key] = rows;
  try { run(); } finally { data[key] = original; }
}

const files = {
  audit: '@/components/pages/dashboard/audit-log-section',
  ledger: '@/components/pages/wallet/ledger-section',
  waste: '@/components/pages/waste/history-section',
  rescue: '@/components/pages/rescue/surplus-feed-section',
};

function paginationTests() {
  const { TablePagination } = load('@/components/ui/table-pagination');
  const pager = model('@/components/ui/table-pagination', 'TablePagination');
  const cases = [
    ['audit', 'AuditLogSection', 'filteredRows', 'visibleRows', 'activeTab', 'q2_2025', 'annual_2024'],
    ['ledger', 'LedgerSection', 'filteredTransactions', 'visibleTransactions', 'activeTab', 'all', 'payout'],
    ['waste', 'HistorySection', 'filteredRows', 'visibleRows', 'category', 'all', 'Minyak Jelantah Dapur (UCO)'],
  ];
  for (const [kind, component, filtered, visible, filterKey, all, narrowed] of cases) {
    const production = load(files[kind]);
    const m = model(files[kind], component);
    const scopeFor = (filter, currentPage, empty = false) => {
      const scope = { ...production, [filterKey]: filter, currentPage };
      if (kind === 'ledger') Object.assign(scope, { transactions: empty ? [] : production.WALLET_LEDGER_DATA.transactions, pageSize: production.WALLET_LEDGER_DATA.pageSize });
      if (kind === 'waste') Object.assign(scope, { rows: empty ? [] : production.WASTE_HISTORY_DATA.rows, pageSize: production.WASTE_HISTORY_DATA.pageSize });
      if (kind === 'audit') scope.pageSize = evaluate(m.variable('pageSize'), m.source, scope);
      scope[filtered] = evaluate(m.variable(filtered), m.source, scope);
      for (const name of ['total', 'pageCount', 'page', 'start', visible]) scope[name] = evaluate(m.variable(name), m.source, scope);
      return scope;
    };
    const propsFor = scope => Object.fromEntries(['currentPage', 'pages', 'lastPage', 'summaryText', 'onPageChange']
      .map(name => [name, evaluate(m.prop('TablePagination', name), m.source, { ...scope, setCurrentPage: forbidden })]));
    for (const [label, filter, requested, expectedTotal, expectedPage, expectedLength] of [
      ['first', all, 1, kind === 'audit' ? 2 : kind === 'ledger' ? 5 : 4, 1, kind === 'audit' ? 1 : 2],
      ['last clamp', all, 99, kind === 'audit' ? 2 : kind === 'ledger' ? 5 : 4, kind === 'ledger' ? 3 : 2, kind === 'waste' ? 2 : 1],
      ['lower clamp', all, -4, kind === 'audit' ? 2 : kind === 'ledger' ? 5 : 4, 1, kind === 'audit' ? 1 : 2],
      ['filtered stale page', narrowed, 99, kind === 'audit' ? 0 : 1, 1, kind === 'audit' ? 0 : 1],
      ['unmatched filter', 'missing-filter', 3, 0, 1, 0],
    ]) {
      check(`${kind}: production filter/pagination ${label}`, () => {
        const scope = scopeFor(filter, requested);
        assert.equal(scope.total, expectedTotal);
        assert.equal(scope.page, expectedPage);
        assert.equal(scope[visible].length, expectedLength);
        assert.deepEqual(scope[visible].map(row => row.id), scope[filtered].slice(scope.start, scope.start + scope.pageSize).map(row => row.id));
        const props = propsFor(scope);
        assert.equal(props.currentPage, expectedPage);
        assert.equal(props.lastPage, scope.pageCount);
        assert.deepEqual(props.pages, expectedTotal ? Array.from({ length: scope.pageCount }, (_, index) => index + 1) : []);
        assert.ok(props.summaryText.startsWith(`Menampilkan ${expectedTotal ? scope.start + 1 : 0}–${scope.start + expectedLength} dari ${expectedTotal} `));
        const html = render(TablePagination, props);
        const buttons = elements(html, 'button');
        const prev = buttons.find(button => attribute(button, 'aria-label') === 'Sebelumnya');
        const next = buttons.find(button => attribute(button, 'aria-label') === 'Selanjutnya');
        assert.equal(attribute(prev, 'disabled') !== undefined, expectedPage === 1);
        assert.equal(attribute(next, 'disabled') !== undefined, expectedPage === scope.pageCount);
        assert.equal(buttons.length, props.pages.length + 2);
        for (const [label, expected] of [['prevLabel', Math.max(1, expectedPage - 1)], ['nextLabel', Math.min(scope.pageCount, expectedPage + 1)]]) {
          const writes = [];
          const onPageChange = evaluate(m.prop('TablePagination', 'onPageChange'), m.source, { ...scope, setCurrentPage: value => writes.push(value) });
          const click = pager.prop('Button', 'onClick', (node, source) => node.attributes.properties.some(attr =>
            ts.isJsxAttribute(attr) && attr.name.text === 'aria-label' && attr.initializer?.getText(source) === `{${label}}`));
          evaluate(click, pager.source, { currentPage: props.currentPage, maxPage: props.lastPage, onPageChange })();
          assert.deepEqual(writes, [expected]);
          onPageChange(-99);
          onPageChange(999);
          assert.deepEqual(writes.slice(1), [1, scope.pageCount]);
        }
      });
    }
    check(`${kind}: genuinely empty source and zero summary`, () => {
      const verify = () => {
        const scope = scopeFor(all, 42, true);
        assert.equal(scope.total, 0);
        assert.equal(scope.pageCount, 1);
        assert.equal(scope.page, 1);
        assert.deepEqual(scope[visible], []);
        assert.match(propsFor(scope).summaryText, /^Menampilkan 0–0 dari 0 /);
      };
      if (kind === 'audit') withRows(production.AUDIT_LOG_DATA, 'auditRows', [], verify);
      else verify();
    });
    check(`${kind}: production filter-change callback resets page`, () => {
      const writes = [];
      const scope = { tab: { id: narrowed }, setActiveTab: value => writes.push(['filter', value]), setCategory: value => writes.push(['filter', value]), setCurrentPage: value => writes.push(['page', value]) };
      const handler = kind === 'waste' ? m.prop('select', 'onChange') : m.prop('button', 'onClick');
      evaluate(handler, m.source, scope)({ target: { value: narrowed } });
      assert.deepEqual(writes, [['filter', narrowed], ['page', 1]]);
    });
    check(`${kind}: empty source SSR renders empty state, zero range and disabled arrows`, () => {
      const [data, key, message] = kind === 'audit' ? [production.AUDIT_LOG_DATA, 'auditRows', /Tidak ada log audit demonstrasi/]
        : kind === 'ledger' ? [production.WALLET_LEDGER_DATA, 'transactions', /Tidak ada transaksi demonstrasi/]
          : [production.WASTE_HISTORY_DATA, 'rows', /Tidak ada batch demonstrasi/];
      withRows(data, key, [], () => {
        const html = render(production[component]);
        assert.match(text(html), message);
        assert.match(text(html), /Menampilkan 0–0 dari 0 /);
        const arrows = elements(html, 'button').filter(button => ['Sebelumnya', 'Selanjutnya'].includes(attribute(button, 'aria-label')));
        assert.equal(arrows.length, 2);
        arrows.forEach(button => assert.notEqual(attribute(button, 'disabled'), undefined));
        assert.doesNotMatch(html, /aria-label="Halaman /);
      });
    });
  }
  const audit = load(files.audit);
  for (const [period, reference, expected] of [
    ['q2_2025', undefined, ['SKP-CR-2025-0581', 'SKP-CR-2025-0422']],
    ['q1_2025', undefined, ['SKP-CR-2025-0319', 'SKP-CR-2025-0210']],
    ['q2_2025', '2025-04-29', []],
    ['q2_2025', '2025-04-30', ['SKP-CR-2025-0422']],
    ['q2_2025', '2025-05-24', ['SKP-CR-2025-0422']],
    ['q1_2025', '2025-02-28', ['SKP-CR-2025-0210']],
    ['annual_2024', undefined, []], ['unknown', undefined, []],
  ]) {
    check(`exported filterAuditRows: ${period}/${reference || 'fixed demo date'}`, () => {
      const before = structuredClone(audit.AUDIT_LOG_DATA.auditRows);
      assert.equal(audit.AUDIT_DEMO_REFERENCE_DATE, '2025-05-25');
      assert.deepEqual(audit.filterAuditRows(period, reference).map(row => row.id), expected);
      assert.deepEqual(audit.AUDIT_LOG_DATA.auditRows, before);
    });
  }
  check('audit: date boundaries override misleading period labels and exclude future rows', () => {
    const rows = ['2025-03-31', '2025-04-01', '2025-05-25', '2025-05-26', '2025-06-30', '2025-07-01']
      .map(date => ({ id: date, auditEndDate: date, periodCategory: 'q1_2025' }));
    withRows(audit.AUDIT_LOG_DATA, 'auditRows', rows, () => {
      assert.deepEqual(audit.filterAuditRows('q2_2025').map(row => row.id), ['2025-05-25', '2025-04-01']);
      assert.deepEqual(audit.filterAuditRows('q2_2025', '2025-12-31').map(row => row.id), ['2025-06-30', '2025-05-26', '2025-05-25', '2025-04-01']);
    });
  });
}

function rescueTests() {
  const m = model(files.rescue, 'SurplusFeedSection');
  const mapCall = m.variable('mapped');
  assert.ok(ts.isCallExpression(mapCall) && mapCall.expression.getText(m.source) === 'data.map');
  const mapRow = evaluate(mapCall.arguments[0], m.source);
  const memo = m.variable('filteredListings');
  assert.ok(ts.isCallExpression(memo) && memo.expression.getText(m.source) === 'useMemo');
  const filter = (timedListings, options = {}) => evaluate(memo.arguments[0], m.source, {
    timedListings, searchQuery: '', selectedCategory: 'all', sortBy: 'expiry', ...options,
  })();
  const row = (id, extra = {}) => mapRow({ id, title: `Food ${id}`, ...extra });
  check('rescue: zero listings for every supported filter and sort', () => {
    for (const selectedCategory of ['all', 'halal', 'vegetarian', 'bebas_gluten']) {
      for (const sortBy of ['expiry', 'portions']) assert.deepEqual(filter([], { selectedCategory, sortBy }), []);
    }
  });
  for (const [name, dietary_tags] of [['missing', undefined], ['null', null], ['empty', []], ['non-array', 'halal'], ['non-string tags', [null, 7, {}]]]) {
    check(`rescue: ${name} diet tags never imply halal`, () => {
      const listing = row('untagged', { dietary_tags, title: 'Halal title only', risky_ingredients: ['kedelai'] });
      assert.deepEqual(listing.dietaryTags, []);
      assert.deepEqual(listing.tags.map(tag => tag.label), ['Alergen tercatat: kedelai']);
      assert.equal(filter([listing]).length, 1);
      assert.deepEqual(filter([listing], { selectedCategory: 'halal' }), []);
      assert.deepEqual(filter([listing], { selectedCategory: 'vegetarian' }), []);
      assert.deepEqual(filter([listing], { selectedCategory: 'bebas_gluten' }), []);
    });
  }
  check('rescue: donor tags normalize case/whitespace/hyphens; vegan includes vegetarian, not halal', () => {
    const listings = [row('h', { dietary_tags: [' HALAL ', null] }), row('v', { dietary_tags: [' Vegan '] }), row('g', { dietary_tags: ['BEBAS-GLUTEN'] }), row('n', { dietary_tags: ['non_halal'] })];
    assert.deepEqual(filter(listings, { selectedCategory: 'halal' }).map(item => item.id), ['h']);
    assert.deepEqual(filter(listings, { selectedCategory: 'vegetarian' }).map(item => item.id), ['v']);
    assert.deepEqual(filter(listings, { selectedCategory: 'bebas_gluten' }).map(item => item.id), ['g']);
    assert.doesNotMatch(listings[0].tags[0].label, /Terverifikasi|MUI/);
  });
  check('rescue: trimmed case-insensitive title/donor/tag/allergen search, not location', () => {
    const listing = { ...row('abcd-1', { title: 'Bento Jamur', dietary_tags: ['vegan'], risky_ingredients: ['Kedelai'] }), location: 'SecretPlace' };
    for (const searchQuery of ['  BENTO ', '#ABCD', ' VEGAN ', 'kedelai']) assert.equal(filter([listing], { searchQuery }).length, 1);
    assert.deepEqual(filter([listing], { searchQuery: 'secretplace' }), []);
    assert.deepEqual(filter([listing], { searchQuery: 'bento', selectedCategory: 'halal' }), []);
  });
  for (const sortBy of ['expiry', 'portions']) {
    check(`rescue: ${sortBy} direction, ID ties and unknown values last without mutation`, () => {
      const listings = [
        row('b', { safe_until: '2025-05-25T02:00:00Z', remaining_portions: 5 }),
        row('z', { safe_until: '2025-05-25T01:00:00Z', remaining_portions: 0 }),
        row('a', { safe_until: '2025-05-25T02:00:00Z', remaining_portions: 5 }),
        row('c', { safe_until: '2025-05-25T03:00:00Z', remaining_portions: 9 }),
        row('u4', { safe_until: 'invalid', remaining_portions: NaN }),
        row('u2', { safe_until: '', remaining_portions: Infinity }),
        row('u1'), row('u3', { safe_until: null, remaining_portions: '40' }),
      ];
      const before = structuredClone(listings);
      for (const input of [listings, [...listings].reverse()]) {
        assert.deepEqual(filter(input, { sortBy }).map(item => item.id), sortBy === 'expiry'
          ? ['z', 'a', 'b', 'c', 'u1', 'u2', 'u3', 'u4']
          : ['c', 'a', 'b', 'z', 'u1', 'u2', 'u3', 'u4']);
      }
      assert.deepEqual(listings, before);
      const duplicate = { ...listings[0], title: 'Equal ID/value duplicate' };
      assert.deepEqual(filter([listings[0], duplicate], { sortBy }).map(item => item.title), [listings[0].title, duplicate.title]);
    });
  }
  check('rescue: invalid/negative portions stay unknown; zero stays known', () => {
    for (const remaining_portions of [undefined, null, -1, '9', NaN, Infinity, -Infinity]) {
      const listing = row('unknown', { remaining_portions });
      assert.equal(listing.portionsCount, undefined);
      assert.equal(listing.portionsRemainingText, 'Jumlah porsi tidak tersedia');
    }
    assert.equal(row('zero', { remaining_portions: 0 }).portionsCount, 0);
  });
  check('rescue: real provider defaults, distance fallback and reset callbacks', () => {
    const request = '@/lib/context/rescue-filter-context';
    const { RescueFilterProvider, useRescueFilter } = load(request);
    function Probe() {
      const state = useRescueFilter();
      assert.equal(state.sortBy, 'expiry');
      assert.equal(state.selectedCategory, 'all');
      assert.equal(state.searchQuery, '');
      return null;
    }
    render(RescueFilterProvider, { children: React.createElement(Probe) });
    const provider = model(request, 'RescueFilterProvider');
    const writes = [];
    const value = evaluate(provider.prop('RescueFilterContext.Provider', 'value'), provider.source, {
      searchQuery: 'old', radiusKm: 3, isBeneficiaryOnly: true, selectedCategory: 'halal', sortBy: 'portions',
      ...Object.fromEntries(['SearchQuery', 'RadiusKm', 'IsBeneficiaryOnly', 'SelectedCategory', 'SortBy'].map(name => [`set${name}`, value => writes.push([name, value])])),
    });
    value.setSortBy('distance');
    value.setSortBy('portions');
    value.resetFilters();
    assert.deepEqual(writes, [['SortBy', 'expiry'], ['SortBy', 'portions'], ['SearchQuery', ''], ['RadiusKm', 10], ['IsBeneficiaryOnly', false], ['SelectedCategory', 'all'], ['SortBy', 'expiry']]);
  });
}

function ssrTests() {
  for (const [request, component, id, count, explanation] of [
    ['@/components/pages/dashboard/hero-section', 'HeroSection', 'dashboard-reports-unavailable', 2, /Ekspor laporan audit ESG dan unduh sertifikat karbon belum tersedia/],
    ['@/components/pages/wallet/hero-section', 'HeroSection', 'wallet-reports-unavailable', 2, /Ekspor laporan fiskal dan audit log GHG belum tersedia/],
    ['@/components/pages/waste/hero-section', 'HeroSection', 'waste-pickup-unavailable', 1, /Pendaftaran penjemputan limbah baru belum tersedia/],
    ['@/components/pages/claims/claim-actions-section', 'ClaimActionsSection', 'claims-actions-unavailable', 2, /Unduh bukti klaim dan pembatalan klaim belum tersedia/],
    ['@/components/pages/claims/claim-actions-section', 'ClaimActionsSection', 'claims-dispute-unavailable', 1, /target listing klaim Anda belum terhubung/],
    [files.audit, 'AuditLogSection', 'audit-log-unavailable', 2, /Pratinjau dan unduhan sertifikat tidak tersedia/],
    [files.ledger, 'LedgerSection', 'wallet-ledger-unavailable', 2, /Kuitansi PDF dan verifikasi tidak tersedia/],
    [files.waste, 'HistorySection', 'waste-history-unavailable', 1, /Ekspor CSV dan sertifikat PDF tidak tersedia/],
    ['@/components/pages/wallet/payout-section', 'PayoutSection', 'wallet-sla-unavailable', 1, /Dokumen ketentuan SLA mutu belum tersedia/],
  ]) {
    check(`SSR: ${component}/${id} disabled with visible linked explanation`, () => {
      const html = render(load(request)[component]);
      unavailable(html, id, count, explanation);
      assert.doesNotMatch(html, /href="#"|href="\/waste\/new"/);
    });
  }
  check('SSR: audit fixed reference date and actual first-page row only', () => {
    const html = render(load(files.audit).AuditLogSection);
    assert.match(html, /<time dateTime="2025-05-25">25 Mei 2025<\/time>/i);
    assert.match(text(html), /SKP-CR-2025-0581/);
    assert.doesNotMatch(text(html), /SKP-CR-2025-0422/);
    assert.match(text(html), /Menampilkan 1–1 dari 2 log audit demonstrasi/);
  });
  check('SSR: ledger verification receipt disabled, not just PDFs', () => {
    const production = load(files.ledger);
    const row = production.WALLET_LEDGER_DATA.transactions.find(tx => tx.receipt.type === 'verification');
    assert.ok(row);
    withRows(production.WALLET_LEDGER_DATA, 'transactions', [row], () => {
      const html = render(production.LedgerSection);
      unavailable(html, 'wallet-ledger-unavailable', 1, /verifikasi tidak tersedia/);
      assert.match(text(html), /Verifikasi/);
    });
  });
  check('SSR: waste certificate is explanatory text, not a fake download', () => {
    const html = render(load(files.waste).HistorySection);
    assert.equal(elements(html, 'td').filter(cell => text(cell.content) === 'PDF tidak tersedia').length, 2);
    assert.ok(!elements(html, 'a').some(anchor => /PDF/.test(text(anchor.content))));
  });
  check('SSR: payout controls and bank fieldset disabled, no fake success', () => {
    const html = render(load('@/components/pages/wallet/payout-section').PayoutSection);
    const fieldsets = elements(html, 'fieldset');
    assert.equal(fieldsets.length, 1);
    assert.notEqual(attribute(fieldsets[0], 'disabled'), undefined);
    assert.equal((fieldsets[0].content.match(/type="radio"/g) || []).length, 3);
    const withoutRadios = html.replace(/<input\b[^>]*type="radio"[^>]*>/g, '');
    unavailable(withoutRadios, 'payout-unavailable', 5, /hanya contoh demo, bukan saldo atau rekening terverifikasi/);
    assert.match(text(html), /Tidak ada transfer atau verifikasi rekening yang dilakukan/);
    assert.doesNotMatch(text(html), /Payout Berhasil|BI-FAST 24\/7 Enabled|< 60 detik/);
  });
  check('SSR: navbar unavailable controls for signed-in user', () => {
    const { Navbar } = load('@/components/layout/navbar');
    const html = render(Navbar, { user: { name: 'Offline User', roleDescription: 'Offline role' } });
    unavailable(html, 'navbar-actions-unavailable', 2, /Notifikasi, filter, dan pengaturan belum tersedia/);
    const controls = elements(html, 'button').filter(button => attribute(button, 'aria-describedby') === 'navbar-actions-unavailable');
    assert.deepEqual(controls.map(button => attribute(button, 'aria-label')), ['Notifikasi', 'Filter dan Pengaturan']);
    assert.doesNotMatch(render(Navbar, { user: null }), /id="navbar-actions-unavailable"/);
  });
  check('SSR: rescue radius/beneficiary/distance/report unavailable; genuine controls enabled', () => {
    const { RescueFilterProvider } = load('@/lib/context/rescue-filter-context');
    const html = render(RescueFilterProvider, { children: React.createElement(React.Fragment, null,
      React.createElement(load('@/components/pages/rescue/hero-section').HeroSection),
      React.createElement(load(files.rescue).SurplusFeedSection)) });
    unavailable(html, 'rescue-location-help', 1, /sumber geolokasi belum tersedia/);
    unavailable(html, 'rescue-beneficiary-help', 1, /belum memiliki penanda kuota beneficiary/);
    unavailable(html, 'rescue-report-help', 1, /Pelaporan mutu.*belum tersedia/);
    const options = elements(html, 'option');
    assert.equal(options.length, 3);
    for (const option of options) assert.equal(attribute(option, 'disabled') !== undefined, attribute(option, 'value') === 'distance');
    const buttons = elements(html, 'button');
    assert.equal(buttons.filter(button => attribute(button, 'aria-pressed') !== undefined && attribute(button, 'disabled') === undefined).length, 4);
    const reset = buttons.find(button => text(button.content) === 'Reset Filter');
    assert.ok(reset);
    assert.equal(attribute(reset, 'disabled'), undefined);
    assert.match(text(html), /bukan kuota akun Anda/);
    assert.match(text(html), /Memuat listing surplus/);
    assert.match(html, /href="\/claims"/);
  });
  for (const draft of [false, true]) {
    for (const publish of [false, true]) {
      check(`SSR: donate draft=${draft}/publish=${publish} independently enabled only with callback`, () => {
        const { DonateActionsSection, DONATE_ACTIONS_CONTENT } = load('@/components/pages/donate/donate-actions-section');
        const html = render(DonateActionsSection, { onSaveDraft: draft ? forbidden : undefined, onPublish: publish ? forbidden : undefined });
        const buttons = elements(html, 'button');
        for (const [enabled, label, id, explanation] of [
          [draft, DONATE_ACTIONS_CONTENT.saveDraftButtonText, 'donate-draft-unavailable', /penyimpanan belum terhubung/],
          [publish, DONATE_ACTIONS_CONTENT.publishButtonText, 'donate-publish-unavailable', /formulir belum terhubung ke penerbitan/],
        ]) {
          const button = buttons.find(button => text(button.content) === label);
          assert.ok(button, `Missing ${label}`);
          assert.equal(attribute(button, 'disabled') !== undefined, !enabled);
          if (enabled) {
            assert.equal(attribute(button, 'aria-describedby'), undefined);
            assert.ok(!html.includes(`id="${id}"`));
          } else unavailable(html, id, 1, explanation);
        }
        const scan = buttons.find(button => text(button.content) === DONATE_ACTIONS_CONTENT.verifyClaimButtonText);
        assert.ok(scan);
        assert.equal(attribute(scan, 'disabled'), undefined);
      });
    }
  }
  check('SSR: home impact dashboard uses existing route', () => {
    const html = render(load('@/components/pages/home/pillars-section').PillarsSection);
    const link = elements(html, 'a').find(anchor => text(anchor.content) === 'Lihat Dashboard Dampak');
    assert.ok(link);
    assert.equal(attribute(link, 'href'), '/dashboard');
    assert.doesNotMatch(html, /href="\/dashboard\/esg"/);
  });
}

async function main() {
  paginationTests();
  rescueTests();
  ssrTests();
  check('Loader remains scoped/cached; no actions, clients or navigation invoked', () => {
    assert.strictEqual(load(files.audit).filterAuditRows, load(files.audit).filterAuditRows);
    assert.strictEqual(Module._load, originalLoad);
    assert.deepEqual({ ...Module._extensions }, originalExtensions);
    assert.equal(forbiddenCalls, 0);
    assert.ok(![...cache.keys()].some(filename => /[\\/]actions[\\/]|[\\/]supabase[\\/]/.test(filename)));
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
  console.log(`\n${checks} passed, ${failures} failed, ${tests.length} registered (offline production exports/AST + real ReactDOMServer SSR).`);
  console.log('Limitations: AST closures use fixtures; SSR does not run effects, browser clicks, hydration, Next RSC, camera, network, or backend actions. Empty/verification SSR temporarily swaps exported demo arrays and restores them. Navigation, Supabase/action imports and static logo metadata are mocked; components are not.');
  if (failures) process.exitCode = 1;
}

main().catch(error => {
  console.error('FAIL: test setup', error.stack || error);
  process.exitCode = 1;
});
