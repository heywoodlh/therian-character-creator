export const STORAGE_KEY = 'kindred-studio-v3';

/* Seed the saved look before app.js runs, so a test can open straight into the
   design it cares about. */
export async function openWith(page, state = {}, options = {}) {
  await page.addInitScript(([key, value]) => {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  }, [STORAGE_KEY, state]);
  await page.goto(options.path || '/index.html');
  await page.waitForFunction(() => document.querySelector('#avatarPreview')?.childElementCount > 0);
  return page;
}

export const preview = (page) => page.locator('#avatarPreview');
export const buildNote = (page) => page.locator('#buildNote');
export const tabs = (page) => page.locator('.category-tab');

export async function artwork(page) {
  return preview(page).evaluate((svg) => svg.innerHTML);
}

/* Fails the test on any console error or blocked request — this is how a CSP
   violation or a missing asset surfaces rather than silently degrading. */
export function failOnPageErrors(page, errors) {
  page.on('console', (msg) => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('requestfailed', (request) => {
    const failure = request.failure()?.errorText || '';
    if (!failure.includes('ERR_INTERNET_DISCONNECTED')) {
      errors.push(`requestfailed: ${request.url()} ${failure}`);
    }
  });
}

/* An active registration is not enough: until the worker actually *controls* the
   page, a reload still goes to the network — which is exactly what fails once the
   network is gone. Wait for control, and for the shell to be in the cache. */
export async function waitForServiceWorker(page, timeout = 30_000) {
  await page.waitForFunction(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    return Boolean(
      registration?.active &&
      registration.active.state === 'activated' &&
      navigator.serviceWorker.controller
    );
  }, null, { timeout });

  await page.waitForFunction(async () => {
    const keys = await caches.keys();
    if (!keys.length) return false;
    const cache = await caches.open(keys[0]);
    return (await cache.keys()).length >= 4;
  }, null, { timeout });
}
