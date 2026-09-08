/* A dependency-free static server for the test suite.
   It reads the Content-Security-Policy straight out of nginx.conf so the tests
   run under the same policy production serves — that is what catches things like
   an inline script or a blocked service worker before they ship. */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');

const csp = (readFileSync(join(root, 'nginx.conf'), 'utf8').match(/set \$csp "([^"]+)"/) || [])[1];
if (!csp) throw new Error('could not read the CSP out of nginx.conf');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json'
};

/* `base` mounts the app under a sub-path, the way GitHub Pages serves a project
   repo at /<repo>/. Everything the app ships must work either way. */
export function createStaticServer({ base = '' } = {}) {
  return createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    let pathname = decodeURIComponent(url.pathname);
    if (base) {
      if (!pathname.startsWith(base)) { res.writeHead(404).end('not found'); return; }
      pathname = pathname.slice(base.length) || '/';
    }
    if (pathname.endsWith('/')) pathname += 'index.html';

    /* Keep the server inside the project directory. */
    const target = join(root, normalize(pathname).replace(/^(\.\.[/\\])+/, ''));
    if (!target.startsWith(root)) { res.writeHead(403).end('forbidden'); return; }

    let body;
    try {
      const info = await stat(target);
      if (!info.isFile()) throw new Error('not a file');
      body = await readFile(target);
    } catch {
      body = await readFile(join(root, 'index.html'));   // SPA fallback, as nginx does
    }

    const headers = {
      'Content-Type': TYPES[extname(target)] || 'application/octet-stream',
      'Content-Security-Policy': csp,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer'
    };
    /* The worker must never be cached, matching the nginx exact-match location. */
    if (pathname === '/sw.js') headers['Cache-Control'] = 'no-cache';
    res.writeHead(200, headers).end(body);
  });
}

/* Run directly (npm run serve, or Playwright's webServer) rather than imported. */
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.argv[2] || process.env.PORT || 4173);
  createStaticServer().listen(port, '127.0.0.1', () =>
    console.log(`serving ${root} on http://localhost:${port}`));
}
