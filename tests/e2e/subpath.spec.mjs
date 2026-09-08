import { test, expect } from '@playwright/test';
import { openWith, buildNote, waitForServiceWorker, failOnPageErrors } from './helpers.mjs';
import { createStaticServer } from '../server.mjs';

/* therian.heywoodlh.io serves from the root; the github.io fallback serves from
   /<repo>/. Nothing the app ships may assume either. */
const BASE = '/therian-character-creator';

test('works unchanged when served from a sub-path', async ({ page }) => {
  const errors = [];
  failOnPageErrors(page, errors);

  const server = createStaticServer({ base: BASE });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://localhost:${server.address().port}`;

  try {
    await openWith(page, { mode: 'mask' }, { path: `${origin}${BASE}/` });

    expect(await page.locator('#avatarPreview path').count()).toBeGreaterThan(15);
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor))
      .toBe('rgb(23, 20, 28)');

    await waitForServiceWorker(page);

    /* Scope must follow the sub-path, not claim the whole origin. */
    const scope = await page.evaluate(async () =>
      (await navigator.serviceWorker.getRegistration()).scope);
    expect(new URL(scope).pathname).toBe(`${BASE}/`);

    /* Manifest start_url and every icon must resolve under the sub-path too. */
    const manifest = await page.evaluate(async () => {
      const href = document.querySelector('link[rel=manifest]').href;
      const parsed = await (await fetch(href)).json();
      return {
        start: new URL(parsed.start_url, href).pathname,
        icons: parsed.icons.map((icon) => new URL(icon.src, href).pathname)
      };
    });
    expect(manifest.start).toBe(`${BASE}/`);
    for (const icon of manifest.icons) expect(icon.startsWith(`${BASE}/`)).toBe(true);

    const cached = await page.evaluate(async () => {
      const keys = await caches.keys();
      const cache = await caches.open(keys[0]);
      return (await cache.keys()).map((request) => new URL(request.url).pathname);
    });
    expect(cached.length).toBeGreaterThanOrEqual(8);
    for (const entry of cached) expect(entry.startsWith(`${BASE}/`)).toBe(true);
  } finally {
    await new Promise((resolve) => { server.closeAllConnections(); server.close(resolve); });
  }

  /* And it still works offline from that sub-path. */
  await page.evaluate(() => { window.__preReload = true; setTimeout(() => location.reload(), 0); });
  await page.waitForFunction(
    () => !window.__preReload && document.querySelector('#avatarPreview')?.childElementCount > 0,
    null, { timeout: 20_000 });

  await expect(page.locator('.category-tab')).toHaveCount(5);
  await expect(buildNote(page)).toContainText('fox ears');
  expect(errors).toEqual([]);
});
