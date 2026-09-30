#!/usr/bin/env node
// Print page-coordinate boxes of elements, to compare with design (artboard) coordinates.
// Usage: node tools/measure.mjs <page.html> [width=1440] <selector> [selector…]
import puppeteer from 'puppeteer-core';

const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [pageName, maybeWidth, ...rest] = process.argv.slice(2);
const width = /^\d+$/.test(maybeWidth) ? Number(maybeWidth) : 1440;
const selectors = /^\d+$/.test(maybeWidth) ? rest : [maybeWidth, ...rest];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });
const page = await browser.newPage();
await page.setViewport({ width, height: 900 });
await page.goto(new URL(pageName, 'http://localhost:4173/').href, { waitUntil: 'networkidle0' });
await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
await page.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('is-in')));
const rows = await page.evaluate(sels => sels.map(s => {
  const el = document.querySelector(s);
  if (!el) return `${s}  — not found`;
  const r = el.getBoundingClientRect();
  const f = n => n.toFixed(1).padStart(7);
  return `${s.padEnd(46)} x${f(r.left)} y${f(r.top + scrollY)} w${f(r.width)} h${f(r.height)}`;
}), selectors);
console.log(rows.join('\n'));
await browser.close();
