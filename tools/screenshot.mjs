#!/usr/bin/env node
// Full-page screenshots of the built site with animations settled (prefers-reduced-motion).
// Usage: node tools/screenshot.mjs [out-dir] [widths=1440,768,375] [page=index.html] [base=http://localhost:4173/]
import puppeteer from 'puppeteer-core';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [out = 'screenshots', widthsArg = '1440,768,375', pageName = 'index.html', base = 'http://localhost:4173/'] = process.argv.slice(2);
const url = new URL(pageName, base).href;
const name = pageName.replace(/\.html$/, '');

await mkdir(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--hide-scrollbars'] });
try {
  for (const w of widthsArg.split(',').map(Number)) {
    const page = await browser.newPage();
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1, isMobile: w < 768, hasTouch: w < 768 });
    await page.goto(url, { waitUntil: 'networkidle0' });
    // freeze animations in their resting state for stable, comparable captures
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      // load lazy images + trigger reveals
      document.querySelectorAll('img[loading="lazy"]').forEach(i => (i.loading = 'eager'));
      for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
        scrollTo(0, y);
        await new Promise(r => setTimeout(r, 30));
      }
      scrollTo(0, 0);
      document.querySelectorAll('.reveal, .progress').forEach(e => e.classList.add('is-in'));
      await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => (i.onload = i.onerror = r))));
    });
    await new Promise(r => setTimeout(r, 300));
    const file = join(out, `${name}-${w}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    console.log(`${file}  (${w}x${h})`);
    await page.close();
  }
} finally {
  await browser.close();
}
