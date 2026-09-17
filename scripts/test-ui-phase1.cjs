const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { Leaf } = require('lucide-react');

const root = path.resolve(__dirname, '../src');
const cache = new Map();
const originalLoad = Module._load;
const originalExtensions = { ...Module._extensions };
let checks = 0;

function load(request, parent = module) {
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
  run();
  checks += 1;
  console.log(`PASS: ${name}`);
}

function render(Component, props = {}) {
  return renderToStaticMarkup(React.createElement(Component, props));
}

function buttons(html) {
  return [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)].map(([, attributes, content]) => ({ attributes, content }));
}

function attribute(button, name) {
  return button.attributes.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1];
}

function text(html) {
  return html.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

try {
  const { TablePagination } = load('@/components/ui/table-pagination');
  const { FilterPills } = load('@/components/ui/filter-pills');
  const { MetricStatCard } = load('@/components/ui/metric-stat-card');
  const noInteraction = () => assert.fail('Static rendering must not invoke callbacks');
  const paginationCases = [
    ['first page', 1, [1, 2, 3], undefined, true, false],
    ['middle page', 2, [1, 2, 3], undefined, false, false],
    ['last visible page', 3, [1, 2, 3], undefined, false, true],
    ['single page', 1, [1], undefined, true, true],
    ['first page with lastPage', 1, [1, 2, 3], 10, true, false],
    ['visible edge before lastPage', 3, [1, 2, 3], 10, false, false],
    ['lastPage current', 10, [1, 2, 3], 10, false, true],
    ['lastPage already visible', 3, [1, 2, 3], 3, false, true],
  ];
  for (const [name, currentPage, pages, lastPage, prevDisabled, nextDisabled] of paginationCases) {
    check(`TablePagination ${name}: labels, current page, disabled boundaries`, () => {
      const html = render(TablePagination, { currentPage, pages, lastPage, onPageChange: noInteraction });
      assert.match(html, /<nav\b[^>]*aria-label="Navigasi halaman"/);
      const rendered = buttons(html);
      const expectedPages = lastPage && lastPage > pages.at(-1) ? [...pages, lastPage] : pages;
      assert.equal(rendered.length, expectedPages.length + 2);
      assert.deepEqual(rendered.map(button => attribute(button, 'aria-label')), ['Sebelumnya', ...expectedPages.map(page => `Halaman ${page}`), 'Selanjutnya']);
      assert.equal(text(rendered[0].content), 'Sebelumnya');
      assert.equal(text(rendered.at(-1).content), 'Selanjutnya');
      assert.equal(attribute(rendered[0], 'disabled') !== undefined, prevDisabled);
      assert.equal(attribute(rendered.at(-1), 'disabled') !== undefined, nextDisabled);
      assert.deepEqual(rendered.filter(button => attribute(button, 'aria-current') !== undefined).map(button => attribute(button, 'aria-label')), [`Halaman ${currentPage}`]);
      for (const [index, page] of expectedPages.entries()) {
        assert.equal(text(rendered[index + 1].content), String(page));
        assert.equal(attribute(rendered[index + 1], 'aria-current'), page === currentPage ? 'page' : undefined);
        assert.equal(attribute(rendered[index + 1], 'disabled'), undefined);
      }
      for (const button of rendered) assert.equal(attribute(button, 'type'), 'button');
      assert.equal(text(html).includes('...'), expectedPages.length > pages.length);
    });
  }
  check('TablePagination custom labels and escaped summary', () => {
    const html = render(TablePagination, { currentPage: 2, pages: [1, 2, 3], prevLabel: 'Previous', nextLabel: 'Next', summaryText: 'Rows 11–20 of 30 & <filtered>', onPageChange: noInteraction });
    const rendered = buttons(html);
    assert.equal(attribute(rendered[0], 'aria-label'), 'Previous');
    assert.equal(text(rendered[0].content), 'Previous');
    assert.equal(attribute(rendered.at(-1), 'aria-label'), 'Next');
    assert.equal(text(rendered.at(-1).content), 'Next');
    assert.match(html, /<p\b[^>]*>Rows 11–20 of 30 &amp; &lt;filtered&gt;<\/p>/);
  });

  const options = [{ id: 'all', label: 'Semua', count: 12, icon: Leaf }, { id: 'empty', label: 'Kosong', count: 0 }, { id: 'ready', label: 'Siap & Aman' }];
  for (const variant of ['solid', 'outline']) {
    for (const selectedId of ['all', 'empty', 'missing']) {
      check(`FilterPills ${variant}/${selectedId}: explicit aria-pressed and counts`, () => {
        const rendered = buttons(render(FilterPills, { options, selectedId, variant, onSelect: noInteraction }));
        assert.equal(rendered.length, options.length);
        for (const [index, option] of options.entries()) {
          assert.equal(attribute(rendered[index], 'aria-pressed'), String(option.id === selectedId));
          assert.equal(attribute(rendered[index], 'type'), 'button');
          assert.equal(text(rendered[index].content), option.label + (option.count === undefined ? '' : `(${option.count})`));
        }
        assert.match(rendered[0].content, /<svg\b/);
      });
    }
  }
  check('FilterPills empty options render no buttons', () => {
    assert.deepEqual(buttons(render(FilterPills, { options: [], selectedId: 'all', onSelect: noInteraction })), []);
  });

  for (const type of ['text', 'trend', 'badge', 'highlight', 'warning_text']) {
    check(`MetricStatCard footerLeft ${type} text renders`, () => {
      const html = render(MetricStatCard, { label: 'Regression metric', value: 0, unit: 'kg', currency: 'Rp', icon: Leaf, footerLeft: { type, text: 'Footer & <visible>', dot: true }, footerRight: { text: 'Right detail' } });
      assert.match(html, /Footer &amp; &lt;visible&gt;/);
      assert.equal((html.match(/Footer &amp; &lt;visible&gt;/g) || []).length, 1);
      assert.match(text(html), /Regression metricRp0kg/);
      assert.match(text(html), /Right detail/);
      assert.match(html, /<svg\b/);
    });
  }
  check('MetricStatCard compound text footer preserves prefix, bold text and suffix', () => {
    const html = render(MetricStatCard, { label: 'Compound metric', value: '42', icon: Leaf, iconCustomLabel: 'CO₂', footerLeft: { type: 'text', text: 'Verified: ', prefix: 'Dari ', boldText: '84.200 kg', suffix: ' limbah organik' }, footerRight: { boldText: 'Scope 3 Offset' } });
    assert.match(text(html), /Verified: Dari 84\.200 kg limbah organik/);
    assert.match(html, /<strong\b[^>]*>84\.200 kg<\/strong>/);
    assert.match(text(html), /CO₂/);
    assert.match(text(html), /Scope 3 Offset/);
  });

  const sections = [
    ['home/stat-section', 'StatSection', ['PANGAN TERSELAMATKAN', '142,850', 'Insentif reverse tipping fee mitra']],
    ['dashboard/stat-section', 'StatSection', ['REDUKSI EMISI GRK', '+18.4% YoY', 'Breakdown Emisi per Scope']],
    ['waste/stat-section', 'StatSection', ['Total Limbah Dialihkan', 'Protein pakan ternak bernilai tinggi', 'Subsidi sirkular otomatis']],
    ['wallet/pocket-section', 'PocketSection', ['Saldo Aktif Dapat Ditarik', 'Dari 84.200 kg limbah organik', 'Tersertifikasi IDXCarbon']],
    ['dashboard/audit-log-section', 'AuditLogSection', ['Log Audit Verifikasi Karbon & Sertifikat Digital', 'SKP-CR-2025-0581', 'SKP-CR-2025-0422']],
  ];
  for (const [file, exported, expected] of sections) {
    check(`Static SSR ${file}: real imports and rendered content`, () => {
      const html = render(load(`@/components/pages/${file}`)[exported]);
      assert.match(html, /<section\b/);
      for (const value of expected) assert(text(html).includes(value), `${file} missing rendered text: ${value}`);
      assert.match(html, /<svg\b/);
    });
  }
  check('Loader caches modules without global require hooks', () => {
    assert.strictEqual(load('@/components/ui/table-pagination').TablePagination, TablePagination);
    assert.strictEqual(Module._load, originalLoad);
    assert.deepEqual({ ...Module._extensions }, originalExtensions);
  });
  console.log(`PASS: ${checks} offline UI phase1 checks; real ReactDOMServer markup, no component mocks. Static SSR does not verify Next RSC serialization or browser interactions.`);
} catch (error) {
  console.error(`FAIL after ${checks} passing checks:`, error);
  process.exitCode = 1;
}
