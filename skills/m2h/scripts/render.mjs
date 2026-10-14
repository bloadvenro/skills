#!/usr/bin/env node
import { readFileSync, realpathSync } from 'node:fs';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from './vendor/markdown-it.cjs';
import container from './vendor/markdown-it-container.cjs';

const skillRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const usage = 'Usage: node render.mjs --input <Markdown> --output <HTML> [--lang <language-tag>]';
const languagePattern = /^[a-zA-Z]{2,8}(?:-[a-zA-Z0-9]{1,8})*$/;
const labels = {
  ru: { contents: 'Содержание', skip: 'Перейти к тексту', print: 'Сохранить в PDF через печать браузера', printText: 'PDF / печать',
    note: 'Сначала главное. Подробности можно раскрыть по мере чтения.',
    diagram: 'Схема', source: 'Исходный текст схемы', toggleView: 'Переключить вид схемы между диаграммой и исходным текстом',
    error: 'Не удалось показать схему. Переключитесь в режим исходного текста, чтобы посмотреть её код.',
    nojs: 'Текст, раскрытия и исходный текст схем доступны без JavaScript. Для рисования диаграмм нужен JavaScript.' },
  en: { contents: 'Contents', skip: 'Skip to content', print: 'Save as PDF through browser print', printText: 'PDF / print',
    note: 'The main point first. Open details as you read.',
    diagram: 'Diagram', source: 'Diagram source', toggleView: 'Toggle between diagram and source view',
    error: 'This diagram could not be displayed. Switch to source view to inspect its source.',
    nojs: 'Text, disclosures, and diagram source are available without JavaScript. Drawing diagrams requires JavaScript.' }
};

function imageData(destination, inputPath) {
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(destination)) {
    throw new Error(`Images must be local raster files: ${destination}`);
  }
  const imagePath = resolve(dirname(inputPath), decodeURIComponent(destination));
  const bytes = readFileSync(imagePath);
  const formats = {
    '.png': ['image/png', b => b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))],
    '.jpg': ['image/jpeg', b => b[0] === 255 && b[1] === 216 && b[2] === 255],
    '.jpeg': ['image/jpeg', b => b[0] === 255 && b[1] === 216 && b[2] === 255],
    '.gif': ['image/gif', b => /^GIF8[79]a$/.test(b.subarray(0, 6).toString())],
    '.webp': ['image/webp', b => b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP']
  };
  const format = formats[extname(imagePath).toLowerCase()];
  if (!format || !format[1](bytes)) throw new Error(`Unsupported or invalid raster image: ${imagePath}`);
  return `data:${format[0]};base64,${bytes.toString('base64')}`;
}

function textOf(inline) {
  return (inline.children || []).map(token => {
    if (token.type === 'text' || token.type === 'code_inline' || token.type === 'image') return token.content;
    if (token.type === 'softbreak' || token.type === 'hardbreak') return ' ';
    return '';
  }).join('');
}

function installExplicitDetails(md, codeRanges) {
  // The standard container scanner treats colon lines inside code as closers and permits
  // implicit closing. Keep its renderer, but use native Markdown code maps and explicit fences.
  md.block.ruler.at('container_details', (state, startLine, endLine, silent) => {
    if (state.sCount[startLine] - state.blkIndent >= 4) return false;
    const line = index => state.src.slice(state.bMarks[index] + state.tShift[index], state.eMarks[index]);
    const opening = /^(:{3,})(\s*details(?:\s.*)?)$/.exec(line(startLine));
    if (!opening) return false;
    if (silent) return true;
    const markup = opening[1];
    let nextLine = startLine + 1;
    let closed = false;
    while (nextLine < endLine) {
      const codeEnd = codeRanges.get(nextLine);
      if (codeEnd) { nextLine = codeEnd; continue; }
      const text = line(nextLine);
      if (text && state.sCount[nextLine] < state.blkIndent) break;
      if (state.sCount[nextLine] - state.blkIndent < 4 && /^:+\s*$/.test(text) && text.trim().length >= markup.length) {
        closed = true;
        break;
      }
      nextLine++;
    }
    if (!closed) throw new Error(`Unclosed details disclosure on line ${startLine + 1}`);

    const oldParent = state.parentType;
    const oldLineMax = state.lineMax;
    state.parentType = 'container';
    state.lineMax = nextLine;
    const open = state.push('container_details_open', 'div', 1);
    open.markup = markup;
    open.block = true;
    open.info = opening[2];
    open.map = [startLine, nextLine];
    state.md.block.tokenize(state, startLine + 1, nextLine);
    const close = state.push('container_details_close', 'div', -1);
    close.markup = line(nextLine).trim();
    close.block = true;
    state.parentType = oldParent;
    state.lineMax = oldLineMax;
    state.line = nextLine + 1;
    return true;
  }, { alt: ['paragraph', 'reference', 'blockquote', 'list'] });
}

/** Render trusted local Markdown as an offline HTML explanation; embedded source HTML stays text. */
export function renderMarkdown(source, { inputPath, lang = 'ru' } = {}) {
  if (!inputPath) throw new Error('inputPath is required to resolve local images');
  if (!languagePattern.test(lang)) throw new Error(`Invalid language tag: ${lang}`);
  const ui = labels[lang.toLowerCase().split('-')[0]] || labels.en;
  const md = new MarkdownIt({ html: false, linkify: false, typographer: false });
  const escape = md.utils.escapeHtml;
  const normalized = source.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const codeRanges = new Map(md.parse(normalized, {}).filter(token => token.type === 'fence' || token.type === 'code_block')
    .map(token => [token.map[0], token.map[1]]));
  md.use(container, 'details', {
    validate: info => /^details(?:\s|$)/.test(info.trim()),
    render: (tokens, index) => {
      if (tokens[index].nesting === -1) return '</div></details>\n';
      const summary = tokens[index].info.trim().replace(/^details\s*/, '');
      if (!summary) throw new Error('Every details disclosure needs a nonempty summary');
      return `<details class="disclosure"><summary>${escape(summary)}</summary><div class="disclosure-body">\n`;
    }
  });
  installExplicitDetails(md, codeRanges);

  const anchorTargets = new Map();
  md.renderer.rules.link_open = (tokens, index, options, env, self) => {
    const token = tokens[index];
    const href = token.attrGet('href');
    if (href?.startsWith('#')) {
      let requested;
      try { requested = decodeURIComponent(href.slice(1)); } catch { requested = href.slice(1); }
      if (anchorTargets.has(requested)) token.attrSet('href', `#${anchorTargets.get(requested)}`);
    }
    return self.renderToken(tokens, index, options);
  };

  const originalImage = md.renderer.rules.image;
  md.renderer.rules.image = (tokens, index, options, env, self) => {
    const token = tokens[index];
    token.attrSet('src', imageData(token.attrGet('src'), inputPath));
    return originalImage(tokens, index, options, env, self);
  };
  const originalFence = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens, index, options, env, self) => {
    const token = tokens[index];
    if (token.info.trim() !== 'mermaid') return originalFence(tokens, index, options, env, self);
    return `<figure class="diagram"><div class="diagram-toolbar"><button type="button" class="diagram-toggle" aria-label="${escape(ui.toggleView)}" title="${escape(ui.toggleView)}" aria-pressed="false" hidden><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/></svg></button></div>` +
      `<div class="diagram-display" hidden><div class="diagram-canvas" role="img" aria-label="${escape(ui.diagram)}"></div>` +
      `<p class="diagram-error" role="status" hidden>${escape(ui.error)}</p></div>` +
      `<div class="diagram-source" role="group" aria-label="${escape(ui.source)}"><p class="diagram-source-label">${escape(ui.source)}</p><pre><code>${escape(token.content)}</code></pre></div></figure>\n`;
  };
  md.renderer.rules.table_open = () => '<div class="table-wrap"><table>\n';
  md.renderer.rules.table_close = () => '</table></div>\n';
  md.renderer.rules.blockquote_open = () => '<blockquote class="callout">\n';

  const tokens = md.parse(normalized, {});
  if (tokens[0]?.type !== 'heading_open' || tokens[0].tag !== 'h1' || tokens[0].level !== 0) {
    throw new Error('Start the document with one top-level H1 title');
  }
  const title = textOf(tokens[1]).trim();
  if (!title) throw new Error('The document title must not be empty');
  const headings = [];
  const usedIds = new Set();
  for (let index = 3; index < tokens.length; index++) {
    const token = tokens[index];
    if (token.type !== 'heading_open') continue;
    if (token.tag === 'h1' && token.level === 0) throw new Error('Use only one top-level H1 title');
    const text = textOf(tokens[index + 1]);
    const base = text.toLowerCase().normalize('NFKC').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section';
    let id = base;
    for (let suffix = 2; usedIds.has(id); suffix++) id = `${base}-${suffix}`;
    usedIds.add(id);
    const finalId = `m2h-content-${id}`;
    anchorTargets.set(id, finalId);
    token.attrSet('id', finalId);
    if (token.tag === 'h2' && token.level === 0) headings.push({ index, id: finalId, text });
  }

  const overviewEnd = headings[0]?.index ?? tokens.length;
  const overview = md.renderer.render(tokens.slice(3, overviewEnd), md.options, {});
  const sections = headings.map((heading, index) => {
    const end = headings[index + 1]?.index ?? tokens.length;
    const html = md.renderer.render(tokens.slice(heading.index, end), md.options, {});
    return `<section aria-labelledby="${escape(heading.id)}">${html}</section>`;
  }).join('\n');
  const toc = headings.map(heading => `<li><a href="#${escape(heading.id)}">${escape(heading.text)}</a></li>`).join('\n');
  const slots = {
    LANG: escape(lang), TITLE: escape(title), CONTENT: `<div class="overview">${overview}</div>\n${sections}`,
    TOC: toc, TOC_HIDDEN: headings.length ? '' : ' hidden', CONTENTS: ui.contents, SKIP: ui.skip,
    PRINT: ui.print, PRINT_TEXT: ui.printText, NOTE: ui.note, NOJS: ui.nojs
  };
  const skeleton = readFileSync(resolve(skillRoot, 'assets/skeleton.html'), 'utf8');
  return skeleton.replace(/\{\{M2H_([A-Z_]+)\}\}/g, (_, key) => {
    if (!Object.hasOwn(slots, key)) throw new Error(`Unknown skeleton slot: ${key}`);
    return slots[key];
  });
}

export async function main(args) {
  if (args.length === 1 && args[0] === '--help') { console.log(usage); return; }
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    if (!['--input', '--output', '--lang'].includes(key) || !args[index + 1] || args[index + 1].startsWith('--')) {
      throw new Error(`Invalid argument: ${key ?? '(missing)'}\n${usage}`);
    }
    if (Object.hasOwn(options, key)) throw new Error(`Duplicate argument: ${key}`);
    options[key] = args[index + 1];
  }
  if (!options['--input'] || !options['--output']) throw new Error(usage);
  const inputPath = resolve(options['--input']);
  const outputPath = resolve(options['--output']);
  if (inputPath === outputPath) throw new Error('Input and output must be different files');
  const inputInfo = await stat(inputPath);
  let outputInfo;
  try { outputInfo = await stat(outputPath); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (outputInfo && inputInfo.dev === outputInfo.dev && inputInfo.ino === outputInfo.ino) {
    throw new Error('Input and output must be different files, including symlink and hardlink aliases');
  }
  const source = await readFile(inputPath, 'utf8');
  const html = renderMarkdown(source, { inputPath, lang: options['--lang'] ?? 'ru' });
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html);
  console.log(outputPath);
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch(error => { console.error(`m2h: ${error.message}`); process.exitCode = 1; });
}
