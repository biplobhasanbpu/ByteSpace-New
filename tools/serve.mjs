#!/usr/bin/env node
// QA-only static file server (the site itself needs no server — open the .html files directly).
// Mirrors a production static host: brotli/gzip for text, long cache for assets.
// Usage: node tools/serve.mjs [port=4173]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, gzipSync, constants as zc } from 'node:zlib';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2] ?? 4173);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.txt': 'text/plain' };
const BLOCKED = /^\/(node_modules|tools|\.git)(\/|$)/;

createServer(async (req, res) => {
  const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (BLOCKED.test(url)) return res.writeHead(404).end();
  let file = join(ROOT, url.endsWith('/') ? url + 'index.html' : url);
  if (!file.startsWith(ROOT)) return res.writeHead(403).end();
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    let body = await readFile(file);
    const ext = extname(file);
    const headers = { 'Content-Type': TYPES[ext] ?? 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000' };
    if (/\.(html|css|js|svg|txt)$/.test(file)) {
      const enc = req.headers['accept-encoding'] ?? '';
      headers.Vary = 'Accept-Encoding';
      if (enc.includes('br')) { body = brotliCompressSync(body, { params: { [zc.BROTLI_PARAM_QUALITY]: 11 } }); headers['Content-Encoding'] = 'br'; }
      else if (enc.includes('gzip')) { body = gzipSync(body, { level: 9 }); headers['Content-Encoding'] = 'gzip'; }
    }
    headers['Content-Length'] = body.length;
    res.writeHead(200, headers).end(body);
  } catch {
    const page404 = await readFile(join(ROOT, '404.html')).catch(() => 'Not found');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(page404);
  }
}).listen(PORT, () => console.log(`QA server: http://localhost:${PORT}/`));
