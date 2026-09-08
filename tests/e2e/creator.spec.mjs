import { test, expect } from '@playwright/test';
import { openWith, preview, buildNote, tabs, artwork, failOnPageErrors } from './helpers.mjs';

const MODES = [
  { mode: 'mask', label: 'Therian mask', tabs: ['Shape', 'Paint', 'Eyes', 'Fur', 'Extras'] },
  { mode: 'full', label: 'Full character', tabs: ['Body', 'Hair', 'Gear', 'Face', 'Wear', 'Scene'] }
];

test.describe('the creator draws and responds', () => {
  for (const { mode, label, tabs: expected } of MODES) {
    test(`${mode} mode renders artwork and every tab has controls`, async ({ page }) => {
      const errors = [];
      failOnPageErrors(page, errors);
      await openWith(page, { mode });

      await expect(page.locator('#creatorTitle')).toHaveText(label);

      const markup = await artwork(page);
      expect(markup.match(/<path/g)?.length ?? 0).toBeGreaterThan(15);
      expect(markup).not.toContain('NaN');
      expect(markup).not.toContain('undefined');

      await expect(tabs(page)).toHaveText(expected);

      /* Every tab must actually populate; an empty panel has shipped before. */
      for (const name of expected) {
        await tabs(page).filter({ hasText: name }).click();
        const count = await page.locator('#optionPanel button').count();
        expect(count, `${name} tab is empty`).toBeGreaterThan(3);
      }
      expect(errors).toEqual([]);
    });
  }

  test('choosing an option redraws the piece and rewrites the build line', async ({ page }) => {
    await openWith(page, { mode: 'mask', maskEars: 'fox' });
    const before = await artwork(page);
    await expect(buildNote(page)).toContainText('fox ears');

    await page.locator('.choice-tile', { hasText: 'Lynx tufts' }).click();

    await expect(buildNote(page)).toContainText('lynx tufts ears');
    expect(await artwork(page)).not.toBe(before);
    await expect(page.locator('.choice-tile', { hasText: 'Lynx tufts' })).toHaveAttribute('aria-pressed', 'true');
  });

  test('the preview description always matches the visible build line', async ({ page }) => {
    await openWith(page, { mode: 'full' });
    const sentence = await buildNote(page).textContent();
    await expect(preview(page)).toHaveAttribute('aria-label', new RegExp(sentence.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });

  test('a look survives a reload, and Start over clears it', async ({ page }) => {
    /* No seeding here: addInitScript would re-run on reload and overwrite the
       very thing this test is checking got saved. */
    await page.goto('/index.html');
    await page.waitForFunction(() => document.querySelector('#avatarPreview')?.childElementCount > 0);
    await page.locator('.category-tab', { hasText: 'Paint' }).click();
    await page.locator('.choice-tile', { hasText: 'Tabby stripes' }).click();
    await expect(buildNote(page)).toContainText('tabby stripes');

    await page.reload();
    await expect(buildNote(page)).toContainText('tabby stripes');

    await page.locator('#resetButton').click();
    await expect(buildNote(page)).toContainText('left plain');
  });

  test('switching mode swaps the whole toolset', async ({ page }) => {
    await openWith(page, { mode: 'mask' });
    await page.locator('#modeSwitch').click();
    await page.locator('.mode-choice[data-mode="full"]').click();
    await expect(page.locator('#creatorTitle')).toHaveText('Full character');
    await expect(tabs(page).first()).toHaveText('Body');
  });

  test('the mask you paint is the mask the character wears', async ({ page }) => {
    /* "Your mask" must reflect mask-mode state, not a preset. */
    await openWith(page, {
      mode: 'full', maskDesign: 'mine', maskWear: 'face',
      maskEars: 'long', coat: '#c8622e', paint: 'gradient'
    });
    const mine = await artwork(page);

    await openWith(page, {
      mode: 'full', maskDesign: 'mine', maskWear: 'face',
      maskEars: 'round', coat: '#4b4854', paint: 'plain'
    });
    expect(await artwork(page)).not.toBe(mine);
  });

  test('a worn mask hides the face it covers', async ({ page }) => {
    await openWith(page, { mode: 'full', maskWear: 'none', eyeStyle: 'anime' });
    const bare = await artwork(page);
    await openWith(page, { mode: 'full', maskWear: 'face', eyeStyle: 'anime' });
    const masked = await artwork(page);
    expect(masked).not.toBe(bare);
    expect(masked.length).toBeGreaterThan(0);
  });

  test('downloading gives back a standalone SVG', async ({ page }) => {
    await openWith(page, { mode: 'mask', maskEars: 'wolf' });
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('#downloadButton').click()
    ]);
    expect(download.suggestedFilename()).toBe('kindred-mask-wolf.svg');
    const stream = await download.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const svg = Buffer.concat(chunks).toString('utf8');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('<path');
    expect(svg).not.toContain('NaN');
  });
});

test.describe('keyboard and structure', () => {
  test('arrow keys move between tabs and focus stays visible', async ({ page }) => {
    await openWith(page, { mode: 'mask' });
    await expect(page.locator('#categoryTabs')).toHaveAttribute('role', 'tablist');
    await expect(page.locator('#optionPanel')).toHaveAttribute('role', 'tabpanel');

    await tabs(page).first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs(page).nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(tabs(page).nth(1)).toBeFocused();

    await page.keyboard.press('End');
    await expect(tabs(page).last()).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Home');
    await expect(tabs(page).first()).toHaveAttribute('aria-selected', 'true');

    /* Roving tabindex: exactly one tab is reachable by Tab. */
    expect(await tabs(page).evaluateAll((els) => els.filter((el) => el.tabIndex === 0).length)).toBe(1);
  });

  test('nothing overflows sideways at any width', async ({ page }) => {
    for (const width of [320, 390, 480, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await openWith(page, { mode: 'full' });
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return { scroll: doc.scrollWidth, client: doc.clientWidth };
      });
      expect(overflow.scroll, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(overflow.client + 1);
    }
  });
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('the preview stays in view while the options scroll', async ({ page }) => {
    await openWith(page, { mode: 'mask' });
    await page.evaluate(() => window.scrollTo(0, 700));
    await page.waitForTimeout(120);

    const top = await page.locator('.preview-area').evaluate((el) => el.getBoundingClientRect().top);
    expect(top).toBeLessThanOrEqual(2);

    /* The artwork must still be genuinely on screen, not a 2px sliver. */
    const height = await page.locator('#avatarPreview').evaluate((el) => el.getBoundingClientRect().height);
    expect(height).toBeGreaterThan(180);
  });

  test('a tile is still tappable at 44px and the panel stretches', async ({ page }) => {
    await openWith(page, { mode: 'mask' });
    const tile = page.locator('.choice-tile').first();
    const box = await tile.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(44);

    const widths = await page.evaluate(() => ({
      panel: document.querySelector('.controls').getBoundingClientRect().width,
      shell: document.querySelector('.app-shell').clientWidth
    }));
    expect(widths.panel).toBeGreaterThan(widths.shell * 0.85);
  });
});
