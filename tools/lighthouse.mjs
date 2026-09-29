#!/usr/bin/env node
// Run Lighthouse (mobile + desktop) against pages served by `npm run serve`.
// Usage: node tools/lighthouse.mjs [page.html …]   (default: every *.html in the project root)
// Reports: reports/<page>-<formfactor>.html
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.BASE_URL ?? 'http://localhost:4173/';
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

const pages = process.argv.slice(2).length
  ? process.argv.slice(2)
  : (await readdir(ROOT)).filter(f => f.endsWith('.html')).sort();

await mkdir(join(ROOT, 'reports'), { recursive: true });
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-first-run'] });
const rows = [];
try {
  for (const page of pages) {
    for (const formFactor of ['mobile', 'desktop']) {
      const config = formFactor === 'desktop'
        ? (await import('lighthouse/core/config/desktop-config.js')).default
        : undefined;
      const { lhr, report } = await lighthouse(new URL(page, BASE).href, {
        port: chrome.port, output: 'html', logLevel: 'error', onlyCategories: CATEGORIES,
      }, config);
      await writeFile(join(ROOT, 'reports', `${page.replace('.html', '')}-${formFactor}.html`), report);
      const score = id => Math.round(lhr.categories[id].score * 100);
      const m = id => lhr.audits[id]?.displayValue ?? '-';
      rows.push({ page, formFactor, perf: score('performance'), a11y: score('accessibility'),
        bp: score('best-practices'), seo: score('seo'),
        FCP: m('first-contentful-paint'), LCP: m('largest-contentful-paint'), TBT: m('total-blocking-time'),
        CLS: m('cumulative-layout-shift'), SI: m('speed-index') });
      const failing = Object.values(lhr.audits)
        .filter(a => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'manual' && a.scoreDisplayMode !== 'notApplicable')
        .map(a => `    ✗ ${a.id}: ${a.title}${a.displayValue ? ` (${a.displayValue})` : ''}`);
      if (failing.length) console.log(`${page} [${formFactor}] needs attention:\n${failing.join('\n')}`);
    }
  }
} finally {
  await chrome.kill();
}
console.table(rows);
