#!/usr/bin/env node
/**
 * Post-build checks on dist/ (no extra dependencies):
 *  - every internal link and image points to a file that exists
 *  - every <img> has an alt attribute
 *  - every page has <html lang>, a <title>, a meta description and exactly one <h1>
 *  - no page ships more than 30 KB of JavaScript
 * Exits with code 1 and a list of problems if anything fails.
 *
 * Usage: node scripts/check-site.mjs   (after `npm run build`)
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const BASE = (process.env.BASE_PATH || '/').replace(/\/$/, '');
const JS_BUDGET = 30 * 1024;

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else files.push(p);
  }
};
walk(DIST);

const problems = [];
const html = files.filter((f) => f.endsWith('.html'));

function resolveTarget(url) {
  let path = decodeURIComponent(url.split('#')[0].split('?')[0]);
  if (!path) return true;
  if (BASE) {
    if (!path.startsWith(BASE + '/') && path !== BASE) return false;
    path = path.slice(BASE.length) || '/';
  }
  const candidates = [path, join(path, 'index.html'), path + '.html'];
  return candidates.some((c) => existsSync(join(DIST, c)) && statSync(join(DIST, c)).isFile());
}

for (const file of html) {
  const page = '/' + relative(DIST, file);
  const src = readFileSync(file, 'utf8');

  if (!/<html[^>]*\slang="[^"]+"/.test(src)) problems.push(`${page}: <html> has no lang attribute`);
  if (!/<title>[^<]+<\/title>/.test(src)) problems.push(`${page}: missing <title>`);
  if (!/<meta name="description" content="[^"]+"/.test(src)) problems.push(`${page}: missing meta description`);
  const h1s = (src.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) problems.push(`${page}: has ${h1s} <h1> elements (expected 1)`);

  for (const m of src.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt(=|[\s>/])/.test(m[0])) problems.push(`${page}: <img> without alt: ${m[0].slice(0, 80)}`);
  }

  for (const m of src.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (!url.startsWith('/') || url.startsWith('//')) continue;
    if (!resolveTarget(url)) problems.push(`${page}: broken internal link ${url}`);
  }

  let js = 0;
  for (const m of src.matchAll(/<script\b[^>]*src="([^"]+)"/g)) {
    const p = join(DIST, BASE ? m[1].slice(BASE.length) : m[1]);
    if (existsSync(p)) js += statSync(p).size;
  }
  for (const m of src.matchAll(/<script\b(?![^>]*(?:src=|application\/ld\+json))[^>]*>([\s\S]*?)<\/script>/g)) js += m[1].length;
  if (js > JS_BUDGET) problems.push(`${page}: ${(js / 1024).toFixed(1)} KB of JavaScript (budget 30 KB)`);
}

if (problems.length) {
  console.error(`✗ ${problems.length} problem(s) found:\n  - ` + problems.join('\n  - '));
  process.exit(1);
}
console.log(`✓ ${html.length} pages checked: links, alt text, titles, headings and JS budget all OK.`);
