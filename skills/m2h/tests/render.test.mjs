import test from 'node:test';
import assert from 'node:assert/strict';
import { link, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { Script } from 'node:vm';
import { renderMarkdown } from '../scripts/render.mjs';

const skill = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const example = join(skill, 'assets/example.md');
const render = source => renderMarkdown(source, { inputPath: example });
const mainContent = html => html.match(/<main id="content">([\s\S]*?)<noscript>/)[1];

class RuntimeElement {
  constructor(tagName = 'div', { hidden = false, open = false, textContent = '' } = {}) {
    this.tagName = tagName.toUpperCase();
    this.hidden = hidden;
    this.open = open;
    this.textContent = textContent;
    this.dataset = {};
    this.parentElement = null;
    this.handlers = new Map();
    this.attributes = [];
    this.attributeValues = new Map();
    this.childNodes = [];
    this.parts = new Map();
  }
  addEventListener(type, handler) {
    const handlers = this.handlers.get(type) || [];
    handlers.push(handler);
    this.handlers.set(type, handlers);
  }
  dispatch(type, event = {}) {
    return this.handlers.get(type)?.[0]({ target: this, ...event });
  }
  setAttribute(name, value) { this.attributeValues.set(name, value); }
  getAttribute(name) { return this.attributeValues.get(name) ?? null; }
  querySelector(selector) { return this.parts.get(selector) ?? null; }
  querySelectorAll() { return []; }
  replaceChildren(...children) { this.childNodes = children; }
}

function makeDiagram(source, parentElement = null) {
  const figure = new RuntimeElement('figure');
  const toggle = new RuntimeElement('button', { hidden: true });
  const display = new RuntimeElement('div', { hidden: true });
  const canvas = new RuntimeElement('div');
  const error = new RuntimeElement('p', { hidden: true });
  const sourceView = new RuntimeElement('div');
  const sourceCode = new RuntimeElement('code', { textContent: source });
  canvas.parentElement = display;
  figure.parentElement = parentElement;
  figure.parts.set('.diagram-toggle', toggle);
  figure.parts.set('.diagram-display', display);
  figure.parts.set('.diagram-canvas', canvas);
  figure.parts.set('.diagram-error', error);
  figure.parts.set('.diagram-source', sourceView);
  figure.parts.set('.diagram-source code', sourceCode);
  return { figure, toggle, display, canvas, error, sourceView };
}

async function waitFor(predicate, message) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (predicate()) return;
    await new Promise(resolve => setImmediate(resolve));
  }
  assert.fail(message);
}

function runBehavior(figures, details, mermaid) {
  const printButton = new RuntimeElement('button');
  const document = {
    handlers: new Map(),
    addEventListener(type, handler) { this.handlers.set(type, handler); },
    querySelectorAll(selector) {
      if (selector === 'figure.diagram') return figures.map(({ figure }) => figure);
      if (selector === 'details') return details;
      return [];
    },
    getElementById(id) { return id === 'print-document' ? printButton : null; },
    createElement() { return new RuntimeElement(); }
  };
  const window = {
    handlers: new Map(),
    printSnapshots: [],
    addEventListener(type, handler) { this.handlers.set(type, handler); },
    print() {
      this.handlers.get('beforeprint')?.();
      this.printSnapshots.push({
        modes: figures.map(({ figure }) => figure.dataset.mode),
        details: details.map(detail => detail.open),
        sourceHidden: figures.map(({ sourceView }) => sourceView.hidden),
        displayHidden: figures.map(({ display }) => display.hidden)
      });
    }
  };
  const html = renderMarkdown('# Runtime\n\n```mermaid\ngraph TD\n A-->B\n```', { inputPath: example });
  const runtime = html.match(/<script id="m2h-behavior">([\s\S]*?)<\/script>/)[1];
  const context = { document, window, location: { hash: '' }, requestAnimationFrame() {}, mermaid };
  new Script(runtime).runInNewContext(context);
  return { document, window, printButton };
}

test('three disclosure levels remain closed, evidence stays text, and headings stay navigable', () => {
  const html = render('# Заголовок <script>\n\nГлавное.\n\n## Решение\n\n' +
    '::::: details Как это работает\nСначала вывод.\n\n:::: details Более узкий вопрос\nСначала вывод.\n\n' +
    '::: details <img src=x onerror=alert(1)>\n### Точные детали\n```txt\n</script><script>alert(1)</script>\n```\n' +
    ':::\n::::\n:::::\n\n## Решение\n\nПовторный раздел.\n\n' +
    '[опасно](javascript:alert(1))\n\n<script>alert(2)</script>\n');
  const content = mainContent(html);
  assert.equal((content.match(/<details class="disclosure">/g) || []).length, 3);
  assert.doesNotMatch(content, /<details[^>]*\bopen\b/);
  assert.match(content, /&lt;\/script&gt;&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(content, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(content, /<script|<img|href="javascript:/);
  assert.match(html, /<title>Заголовок &lt;script&gt;<\/title>/);
  assert.match(content, /id="m2h-content-решение"/);
  assert.match(content, /id="m2h-content-решение-2"/);
  const toc = html.match(/<nav class="toc"[\s\S]*?<\/nav>/)[0];
  assert.match(toc, /href="#m2h-content-решение-2"/);
  assert.doesNotMatch(toc, /Точные детали/);
});

test('code colon fences stay source text inside ordinary, quoted, and listed disclosures', () => {
  const cases = [
    '::: details Evidence\n```txt\n:::\n```\n:::\n',
    '::: details Evidence\n~~~txt\n:::\n~~~\n:::\n',
    '::: details Evidence\n\n    :::\n\n:::\n',
    '::: details Evidence\n- ```txt\n  :::\n  ```\n:::\n',
    '> ::: details Evidence\n> ```txt\n> :::\n> ```\n> :::\n'
  ];
  for (const source of cases) {
    const content = mainContent(render(`# Title\n\n${source}`));
    assert.match(content, /<code[^>]*>:::\n<\/code>/, source);
    assert.match(content, /<details[\s\S]*<pre>[\s\S]*<\/pre>[\s\S]*<\/details>/, source);
    assert.equal((content.match(/class="disclosure"/g) || []).length, 1, source);
  }
});

test('native Markdown nesting is accepted while every nested disclosure needs its own closing fence', () => {
  for (const source of [
    '> ::: details Evidence\n> Useful body.\n> :::\n',
    '- ::: details Evidence\n  Useful body.\n  :::\n',
    '> :::: details Outer\n> ::: details Inner\n> Useful body.\n> :::\n> :::: \n'
  ]) assert.match(mainContent(render(`# Title\n\n${source}`)), /Useful body/);
  for (const source of [
    ':::: details Outer\n::: details Inner\nUseful body.\n::::\n',
    '> :::: details Outer\n> ::: details Inner\n> Useful body.\n> :::: \n'
  ]) assert.throws(() => render(`# Title\n\n${source}`), /Unclosed/);
});

test('disclosures interrupt adjacent paragraphs in root, nested, quoted, and listed content', () => {
  const cases = [
    ['Overview.\n::: details Evidence\nTechnical evidence.\n:::\n', 1],
    [':::: details Outer\nText.\n::: details Inner\nTechnical evidence.\n:::\n::::\n', 2],
    ['> Text.\n> ::: details Evidence\n> Technical evidence.\n> :::\n', 1],
    ['- Text.\n  ::: details Evidence\n  Technical evidence.\n  :::\n', 1]
  ];
  for (const [source, expected] of cases) {
    const content = mainContent(render(`# Title\n\n${source}`));
    assert.equal((content.match(/<details class="disclosure">/g) || []).length, expected, source);
    assert.match(content, /<details[\s\S]*Technical evidence\.[\s\S]*<\/details>/, source);
    assert.doesNotMatch(content, /::: details/, source);
    assert.doesNotMatch(content, /<details[^>]*\bopen\b/, source);
  }
});

test('heading anchors cannot collide with runtime IDs and ordinary internal Markdown links still resolve', () => {
  const html = render('# Title\n\n[Evidence](#evidence) · [Repeated](#evidence-2) · [Russian](#%D0%B4%D0%B5%D1%82%D0%B0%D0%BB%D0%B8)\n\n' +
    '## Print document\n\n## Mermaid runtime\n\n## M2h behavior\n\n## M2h diagram 1\n\n' +
    '## Evidence\n\nFirst.\n\n## Evidence\n\nSecond.\n\n### Детали\n');
  const content = mainContent(html);
  for (const slug of ['print-document', 'mermaid-runtime', 'm2h-behavior', 'm2h-diagram-1']) {
    assert.match(content, new RegExp(`id="m2h-content-${slug}"`));
    assert.doesNotMatch(content, new RegExp(`id="${slug}"`));
  }
  for (const slug of ['evidence', 'evidence-2', 'детали']) assert.match(content, new RegExp(`href="#m2h-content-${slug}"`));
  const runtime = html.match(/<script id="m2h-behavior">([\s\S]*?)<\/script>/)[1];
  assert.doesNotThrow(() => new Script(runtime));
});

test('diagram controls and PDF action expose localized names and keep source visible without JavaScript', () => {
  const source = '# Диаграмма\n\n```mermaid\ngraph TD\nA-->B\n```';
  const ru = render(source);
  const content = mainContent(ru);
  assert.match(ru, /id="print-document" class="print-button" aria-label="Сохранить в PDF через печать браузера" title="Сохранить в PDF через печать браузера"[\s\S]*?<span>PDF \/ печать<\/span>/);
  assert.match(content, /class="diagram-toggle" aria-label="Переключить вид схемы между диаграммой и исходным текстом" title="Переключить вид схемы между диаграммой и исходным текстом" aria-pressed="false" hidden/);
  assert.match(content, /class="diagram-display" hidden>/);
  assert.match(content, /class="diagram-source" role="group" aria-label="Исходный текст схемы"><p class="diagram-source-label">Исходный текст схемы<\/p><pre><code>graph TD/);
  assert.doesNotMatch(content, /<details class="diagram-source"/);
  assert.match(ru, /Текст, раскрытия и исходный текст схем доступны без JavaScript/);

  const en = renderMarkdown('# Diagram\n\n```mermaid\ngraph TD\nA-->B\n```', { inputPath: example, lang: 'en' });
  assert.match(en, /aria-label="Save as PDF through browser print" title="Save as PDF through browser print"[\s\S]*?<span>PDF \/ print<\/span>/);
  assert.match(mainContent(en), /aria-label="Toggle between diagram and source view" title="Toggle between diagram and source view"/);
});

test('diagram runtime swaps one view, isolates render errors, and restores print state', async () => {
  const outer = new RuntimeElement('details', { open: false });
  const inner = new RuntimeElement('details', { open: true });
  inner.parentElement = outer;
  const failed = makeDiagram('invalid diagram');
  const rendered = makeDiagram('valid diagram');
  const nested = makeDiagram('nested diagram', inner);
  const calls = [];
  const mermaid = {
    initialize() {},
    async render(id, source, canvas) {
      assert.equal(canvas.parentElement.hidden, false, 'render canvas must be visible while Mermaid measures it');
      calls.push(source);
      await Promise.resolve();
      if (source === 'invalid diagram') throw new Error('diagram parse failure');
      return { svg: '<svg></svg>' };
    }
  };
  const { document, window, printButton } = runBehavior([failed, rendered, nested], [outer, inner], mermaid);
  await waitFor(() => failed.figure.dataset.state === 'error' && rendered.figure.dataset.state === 'rendered', 'initial visible diagrams did not finish rendering');
  assert.equal(nested.figure.dataset.state, undefined, 'a closed outer disclosure must defer its diagrams');
  assert.equal(failed.error.hidden, false);
  assert.equal(rendered.toggle.disabled, false);
  assert.equal(failed.toggle.getAttribute('aria-pressed'), 'false');

  rendered.toggle.dispatch('click');
  assert.equal(rendered.figure.dataset.mode, 'source');
  assert.equal(rendered.sourceView.hidden, false);
  assert.equal(rendered.display.hidden, true);
  assert.equal(rendered.toggle.getAttribute('aria-pressed'), 'true');
  rendered.toggle.dispatch('click');
  assert.equal(rendered.figure.dataset.mode, 'diagram');
  assert.equal(rendered.sourceView.hidden, true);
  assert.equal(rendered.display.hidden, false, 'diagram view must be visible before any render is scheduled');

  outer.open = true;
  document.handlers.get('toggle')({ target: outer });
  await waitFor(() => nested.figure.dataset.state === 'rendered', 'opening the outer disclosure did not render its diagram');
  nested.toggle.dispatch('click');
  assert.equal(nested.figure.dataset.mode, 'source');
  outer.open = false;

  failed.toggle.dispatch('click');
  assert.equal(failed.sourceView.hidden, false, 'the failed diagram source must remain available');
  failed.toggle.dispatch('click');
  await printButton.dispatch('click');
  assert.equal(window.printSnapshots.length, 1);
  assert.deepEqual(window.printSnapshots[0], {
    modes: ['diagram', 'diagram', 'diagram'],
    details: [true, true],
    sourceHidden: [true, true, true],
    displayHidden: [false, false, false]
  });
  assert.deepEqual(calls, ['invalid diagram', 'valid diagram', 'nested diagram']);

  window.handlers.get('afterprint')();
  assert.deepEqual([outer.open, inner.open], [false, true]);
  assert.deepEqual([failed.figure.dataset.mode, rendered.figure.dataset.mode, nested.figure.dataset.mode], ['diagram', 'diagram', 'source']);
  assert.deepEqual([failed.sourceView.hidden, rendered.sourceView.hidden, nested.sourceView.hidden], [true, true, false]);
});

test('example preserves useful tables, long code, and exact embedded image bytes', async () => {
  const html = render(await readFile(example, 'utf8'));
  const content = mainContent(html);
  assert.match(content, /<div class="table-wrap"><table>/);
  assert.match(content, /This is a deliberately long illustrative source line/);
  const embedded = content.match(/src="data:image\/png;base64,([^"]+)"/)[1];
  assert.deepEqual(Buffer.from(embedded, 'base64'), await readFile(join(skill, 'assets/example.png')));
  assert.equal((content.match(/class="diagram"/g) || []).length, 4);
  assert.match(html, /connect-src 'none'/);
  assert.doesNotMatch(content, /<script\b|<iframe\b/);
  assert.doesNotMatch(html, /<(?:script|link)\b[^>]*(?:src|href)=/i);
});

test('single-pass skeleton substitution preserves marker-shaped source text and safe source links', () => {
  const html = render('# Title\n\nLiteral {{M2H_TOC}} stays literal.\n\n[Source](https://example.com/a?q=1&b=2)\n');
  assert.match(mainContent(html), /Literal \{\{M2H_TOC\}\} stays literal/);
  assert.match(mainContent(html), /href="https:\/\/example.com\/a\?q=1&amp;b=2"/);
  assert.match(html, /class="toc"[^>]* hidden/);
});

test('authoring errors fail rather than silently hiding missing content', () => {
  for (const [source, error] of [
    ['Plain text', /top-level H1/],
    ['# Title\n\n# Another title', /one top-level H1/],
    ['# Title\n\n::: details\nText\n:::', /nonempty summary/],
    ['# Title\n\n::: details Why\nText', /Unclosed details/],
    ['# Title\n\n![remote](https://example.com/image.png)', /local raster/],
    ['# Title\n\n![bad](missing.png)', /ENOENT/]
  ]) assert.throws(() => render(source), error);
  assert.throws(() => renderMarkdown('# Title', { inputPath: example, lang: 'ru" onload="bad' }), /language tag/);
});

test('CLI works from another directory offline and reports invalid arguments and input failures', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'm2h-render-test-'));
  assert.equal(dirname(temp), resolve(tmpdir()));
  try {
    await writeFile(join(temp, 'answer.md'), '# A result\n\nA clear answer.\n');
    const cli = args => spawnSync(process.execPath, [join(skill, 'scripts/render.mjs'), ...args], { cwd: temp, encoding: 'utf8' });
    const success = cli(['--input', 'answer.md', '--output', 'answer.html', '--lang', 'en']);
    assert.equal(success.status, 0, success.stderr);
    assert.match(await readFile(join(temp, 'answer.html'), 'utf8'), /<html lang="en">/);
    for (const args of [[], ['--unknown', 'x'], ['--input', 'absent.md', '--output', 'out.html'],
      ['--input', 'answer.md', '--output', 'answer.md'], ['--input', 'answer.md', '--input', 'again.md']]) {
      const failed = cli(args);
      assert.equal(failed.status, 1);
      assert.match(failed.stderr, /m2h:/);
    }
    const spacedImage = join(temp, 'an image.png');
    await writeFile(spacedImage, await readFile(join(skill, 'assets/example.png')));
    const html = renderMarkdown('# Image\n\n![alt <text>](<an image.png>)', { inputPath: join(temp, 'answer.md') });
    assert.match(mainContent(html), /alt="alt &lt;text&gt;"/);
    await writeFile(join(temp, 'bad.svg'), '<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    assert.throws(() => renderMarkdown('# Image\n\n![bad](bad.svg)', { inputPath: join(temp, 'answer.md') }), /Unsupported/);
  } finally { await rm(temp, { recursive: true }); }
});

test('CLI preserves source when output is a same-file alias and executes through a linked skill directory', async () => {
  const temp = await mkdtemp(join(tmpdir(), 'm2h-render-alias-test-'));
  assert.equal(dirname(temp), resolve(tmpdir()));
  try {
    const input = join(temp, 'answer.md');
    const source = '# Preserve source\n\nOriginal meaningful content.\n';
    await writeFile(input, source);
    for (const [kind, makeAlias] of [['symlink', symlink], ['hardlink', link]]) {
      const output = join(temp, `${kind}.html`);
      await makeAlias(input, output);
      const result = spawnSync(process.execPath, [join(skill, 'scripts/render.mjs'), '--input', input, '--output', output], { encoding: 'utf8' });
      assert.equal(result.status, 1, result.stderr);
      assert.match(result.stderr, /different files/);
      assert.equal(await readFile(input, 'utf8'), source);
    }
    const linkedSkill = join(temp, 'installed-m2h');
    await symlink(skill, linkedSkill);
    const output = join(temp, 'linked.html');
    const result = spawnSync(process.execPath, [join(linkedSkill, 'scripts/render.mjs'), '--input', input, '--output', output], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.match(await readFile(output, 'utf8'), /<title>Preserve source<\/title>/);
  } finally { await rm(temp, { recursive: true }); }
});
