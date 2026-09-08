import { test } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { openWith } from './helpers.mjs';

/* CI collects from artifacts/; SHOT_DIR=screenshots writes the committed set. */
const OUT = process.env.SHOT_DIR
  ? resolve(process.cwd(), process.env.SHOT_DIR)
  : resolve(import.meta.dirname, '../../artifacts/screenshots');

/* One representative capture per thing a reviewer would want to eyeball. */
const SHOTS = [
  { name: 'mask-blank', title: 'Mask — unpainted blank', width: 1280, height: 860, state: { mode: 'mask' } },
  { name: 'mask-painted', title: 'Mask — painted, ruff, charms', width: 1280, height: 860,
    state: { mode: 'mask', maskEars: 'lynx', maskEyes: 'upturn', cheek: 'shaggy', coat: '#c8622e',
             paint: 'gradient', mesh: '#57b58b', fur: 'ruff', furColor: '#efe9e3', fangs: 'teeth',
             charm: 'leaves', backdrop: '#f7ded0' } },
  { name: 'character-default', title: 'Character — mask over the face', width: 1280, height: 860,
    state: { mode: 'full' } },
  { name: 'character-mask-up', title: 'Character — mask pushed up', width: 1280, height: 860,
    state: { mode: 'full', hair: 'curly', hairColor: '#8a5bc4', maskDesign: 'redfox', maskWear: 'up',
             therianEars: 'fox', earColor: '#c8622e', outfit: 'jacket', neck: 'chain',
             skin: '#ddaa80', marking: 'blush', backdrop: '#e2dcf2' } },
  { name: 'character-antlers', title: 'Character — antlers, no mask', width: 1280, height: 860,
    state: { mode: 'full', hair: 'parted', hairColor: '#7c5a48', maskWear: 'none', therianEars: 'deer',
             outfit: 'sweater', accent: '#bfe0cd', neck: 'beads', skin: '#9b6242', marking: 'theta',
             backdrop: '#d8ebe1' } },
  { name: 'mobile-mask', title: 'Mobile — mask', width: 390, height: 844, state: { mode: 'mask' } },
  { name: 'mobile-character', title: 'Mobile — character', width: 390, height: 844, state: { mode: 'full' } },
  { name: 'mobile-scrolled', title: 'Mobile — preview pinned while scrolling', width: 390, height: 844,
    state: { mode: 'mask' }, scroll: 700 }
];

test('capture the review screenshots', async ({ page }) => {
  test.slow();
  await mkdir(OUT, { recursive: true });
  const index = [];

  for (const shot of SHOTS) {
    await page.setViewportSize({ width: shot.width, height: shot.height });
    await openWith(page, shot.state);
    if (shot.scroll) {
      await page.evaluate((y) => window.scrollTo(0, y), shot.scroll);
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(120);
    await page.screenshot({ path: resolve(OUT, `${shot.name}.png`) });
    index.push({ name: shot.name, title: shot.title, file: `${shot.name}.png`, width: shot.width, height: shot.height });
  }

  await writeFile(resolve(OUT, 'index.json'), JSON.stringify(index, null, 2));
});
