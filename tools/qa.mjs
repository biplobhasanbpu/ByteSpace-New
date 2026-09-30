#!/usr/bin/env node
// Site-wide smoke test: horizontal overflow per breakpoint, console errors,
// broken images and dead internal links. Usage: node tools/qa.mjs
import puppeteer from 'puppeteer-core';
import { readdir, access } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'http://localhost:4173/';
const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const WIDTHS = [1440, 1280, 1100, 1024, 768, 375, 320];
const pages = (await readdir(ROOT)).filter(f => f.endsWith('.html')).sort();

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
let problems = 0;
const report = (p, msg) => { problems++; console.log(`✗ ${p}: ${msg}`); };
try {
  for (const p of pages) {
    const page = await browser.newPage();
    const errors = [];
    page.on('console', m => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', r => errors.push(`request failed ${r.url()}`));
    page.on('response', r => r.status() >= 400 && errors.push(`${r.status()} ${r.url()}`));
    for (const w of WIDTHS) {
      await page.setViewport({ width: w, height: 900, isMobile: w < 768, hasTouch: w < 768 });
      await page.goto(BASE + p, { waitUntil: 'networkidle0' });
      const over = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        const offenders = [];
        for (const el of document.querySelectorAll('body *')) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.right <= vw + 1) continue;
          let clipped = false;
          for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
            const s = getComputedStyle(a);
            if (s.overflowX !== 'visible' || s.position === 'fixed') { clipped = true; break; }
          }
          if (!clipped && !el.closest('[aria-hidden="true"]')) offenders.push(`${el.tagName.toLowerCase()}.${String(el.className.baseVal ?? el.className).split(' ')[0]}(+${Math.round(r.right - vw)}px)`);
        }
        return offenders.slice(0, 4);
      });
      if (over.length) report(p, `overflow at ${w}px: ${over.join(', ')}`);
    }
    const { broken, links } = await page.evaluate(() => ({
      broken: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.loading !== 'lazy').map(i => i.src),
      links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')),
    }));
    broken.forEach(b => report(p, `broken image ${b}`));
    for (const href of new Set(links)) {
      if (/^(https?:|mailto:|tel:|#)/.test(href)) continue;
      const file = href.split('#')[0];
      try { await access(join(ROOT, file)); } catch { report(p, `dead link ${href}`); }
    }
    [...new Set(errors)].forEach(e => report(p, `console/network: ${e}`));
    await page.close();
  }
} finally {
  await browser.close();
}
console.log(problems ? `\n${problems} problem(s)` : `\nAll ${pages.length} pages clean at ${WIDTHS.join(', ')}px`);
