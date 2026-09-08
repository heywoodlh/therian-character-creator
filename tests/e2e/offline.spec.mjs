import { test, expect } from '@playwright/test';
import { openWith, buildNote, failOnPageErrors, waitForServiceWorker } from './helpers.mjs';
import { createStaticServer } from '../server.mjs';

test.describe('installs and runs with no signal', () => {
  test('the manifest is linked, valid, and installable', async ({ page, request }) => {
    await page.goto('/index.html');
    const href = await page.locator('link[rel="manifest"]').getAttribute('href');
    expect(href).toBe('manifest.webmanifest');

    const response = await request.get('/manifest.webmanifest');
    expect(response.headers()['content-type']).toContain('application/manifest+json');
    const manifest = await response.json();
    expect(manifest.display).toBe('standalone');
    expect(manifest.start_url).toBe('./');
    expect(manifest.icons.some((icon) => icon.purpose === 'maskable')).toBe(true);

    /* Every icon the manifest promises must actually be served. */
    for (const icon of manifest.icons) {
      const iconResponse = await request.get(`/${icon.src}`);
      expect(iconResponse.status(), `${icon.src} is missing`).toBe(200);
    }
  });

  test('the worker registers under the real CSP and takes control', async ({ page }) => {
    const errors = [];
    failOnPageErrors(page, errors);
    await page.goto('/index.html');

    await waitForServiceWorker(page);

    /* A CSP that forbade worker-src would fail registration, not just warn. */
    expect(errors.filter((e) => /Content Security Policy/i.test(e))).toEqual([]);

    const scope = await page.evaluate(async () => (await navigator.serviceWorker.getRegistration()).scope);
    expect(scope).toMatch(/\/$/);
  });

  test('the whole app still works after the origin goes away', async ({ page }) => {
    /* CDP offline emulation does not reliably route navigations through the
       worker, so this stops a real server instead — which is the actual scenario
       anyway: the origin is simply not there any more. */
    const server = createStaticServer();
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const origin = `http://localhost:${server.address().port}`;

    try {
      await openWith(page, { mode: 'mask', maskEars: 'lynx', paint: 'tabby' },
        { path: `${origin}/index.html` });
      await waitForServiceWorker(page);
    } finally {
      await new Promise((resolve) => { server.closeAllConnections(); server.close(resolve); });
    }

    /* Nothing is listening on that port now. Everything below comes from cache.
       This reloads from inside the page rather than via page.reload(), which maps
       to a CDP reload and can bypass the service worker the way a hard refresh
       does. The flag proves we are looking at a genuinely new document. */
    await page.evaluate(() => {
      window.__preReload = true;
      setTimeout(() => location.reload(), 0);
    });
    await page.waitForFunction(
      () => !window.__preReload && document.querySelector('#avatarPreview')?.childElementCount > 0,
      null, { timeout: 20_000 }
    );

    await expect(buildNote(page)).toContainText('lynx tufts ears');
    await expect(page.locator('.category-tab')).toHaveCount(5);
    expect(await page.locator('#avatarPreview path').count()).toBeGreaterThan(15);

    const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(background, 'the stylesheet came back too').toBe('rgb(23, 20, 28)');

    /* Interaction still works with the origin gone. */
    await page.locator('.category-tab', { hasText: 'Paint' }).click();
    await expect(page.locator('#optionPanel button').first()).toBeVisible();
    await page.locator('.choice-tile', { hasText: 'Husky mask' }).click();
    await expect(buildNote(page)).toContainText('husky mask');
  });

  test('the worker is never served from cache, so redeploys land', async ({ request }) => {
    const response = await request.get('/sw.js');
    expect(response.status()).toBe(200);
    expect(response.headers()['cache-control']).toContain('no-cache');
  });
});
