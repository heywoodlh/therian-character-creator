import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = (name) => readFileSync(resolve(root, name), 'utf8');

test('ships both creator modes and friendly customization controls', () => {
  const html = read('index.html');
  const js = read('app.js');
  assert.match(html, /Therian mask/i);
  assert.match(html, /Full character/i);
  assert.match(html, /aria-label="Creator controls"/i);
  assert.match(html, /id="avatarPreview"/i);
  assert.match(html, /Download SVG/i);
  assert.match(html, /id="shareButton"/i);
  assert.match(html, /id="shareDialog"/i);
  assert.match(js, /function shareCharacter/);
  assert.match(js, /navigator\.share/);
  assert.match(js, /localStorage/);
  assert.match(js, /renderAvatar/);
});

test('restores the visible mode UI from saved state', () => {
  const js = read('app.js');
  assert.match(js, /function syncModeUI\(\)/);
  assert.match(js, /function render\(\)\{syncModeUI\(\);/);
  assert.match(js, /function loadState\(\).*return JSON\.parse/s);
});

test('the mask is one moulded shell with swappable parts', () => {
  const js = read('app.js');
  // drawn as a mirrored half, which is why the reference blank has a centre seam
  assert.match(js, /function maskContour\(\)/);
  assert.match(js, /const SEAM_TOP/);
  assert.match(js, /translate\(480 0\) scale\(-1 1\)/, 'the half is mirrored to form the shell');
  for (const ear of ['fox','cat','wolf','lynx','long','round','folded']) {
    assert.match(js, new RegExp(`\\n    ${ear}:\\s*\\{d:`), `missing ${ear} ears`);
  }
  for (const eye of ['sharp','almond','round','narrow','wide','upturn']) {
    assert.match(js, new RegExp(`${eye}:\\s*'M`), `missing ${eye} cut-out`);
  }
  assert.match(js, /const cheekStyles/, 'the jagged cheek ruff is a choice, not fixed');
  assert.match(js, /function maskArt\(\)/);
  assert.match(js, /function renderMask\(\)/);
});

test('mask mode offers the decoration therian kits actually ship with', () => {
  const js = read('app.js');
  assert.match(js, /id="meshWeave"/, 'eye mesh is drawn as woven craft mesh');
  assert.match(js, /function furFringe\(/);
  assert.match(js, /function furPile\(/, 'fur trim is layered pile, not a single sawtooth');
  for (const paint of ['tabby','brows','points','calico','gradient','husky','speckle','moon','scars','theta','bloom']) {
    assert.match(js, new RegExp(`'${paint}'`), `missing ${paint} paint option`);
  }
  for (const key of ['fur:','fangs:','charm:','strap:','mesh:']) {
    assert.match(js, new RegExp(key.replace(':','\\s*:')), `missing ${key} option group`);
  }
});

test('both modes carry therian community signifiers', () => {
  const js = read('app.js');
  assert.match(js, /therianEars/, 'the theriotype is worn as gear, not baked into the body');
  assert.match(js, /Theta-delta/, 'the theta-delta symbol is offered');
  assert.match(js, /Beaded collar/, 'beaded collars are classic therian gear');
  assert.match(js, /quadrobics/i, 'copy references how gear is actually used');
});

test('the character is a person wearing therian gear', () => {
  const js = read('app.js');
  assert.match(js, /function renderCharacter\(\)/);
  assert.match(js, /id="halftone"/, 'halftone-dot backdrop like printed cartoon art');
  assert.match(js, /clip-path="url\(#skinClip\)"/, 'cel shading is clipped to the head');
  for (const fn of ['bodyEyesSvg','bodyMouthSvg','bodyMarkSvg','bodyOutfitSvg','bodyNeckSvg','therianEarsSvg','wornMaskSvg']) {
    assert.match(js, new RegExp(`function ${fn}\\(`), `missing ${fn}`);
  }
  // a blank base: every animal cue is something the person puts on
  assert.match(js, /skin: swatches\('skin'\)/, 'skin tone is a real choice');
  assert.match(js, /const hairStyles/);
  for (const hair of ['bob','shag','curly','afro','twin','pony','wolfcut','buzz','parted','long']) {
    assert.match(js, new RegExp(`\\n    ${hair}:`), `missing ${hair} hair`);
  }
  for (const wear of ['hoodie','jacket','overalls','choker','bandana','beads']) {
    assert.match(js, new RegExp(`'${wear}'`), `missing ${wear} option`);
  }
});

test('the mask you paint can be worn by the character', () => {
  const js = read('app.js');
  assert.match(js, /const maskPresets/, 'ready-painted masks to pick from');
  for (const preset of ['fox','tabby','redfox','blackcat','husky','lynx']) {
    assert.match(js, new RegExp(`\\n    ${preset}:\\s*\\{maskEars:`), `missing ${preset} preset`);
  }
  assert.match(js, /function renderWith\(/, 'a preset renders without disturbing saved state');
  assert.match(js, /state.maskDesign === 'mine'/, "'your mask' reuses the mask-mode design");
  // the mask hides the face it covers
  assert.match(js, /if \(state.maskWear === 'face'\) return '';/);
});

test('the interface keeps its structure accessible', () => {
  const html = read('index.html');
  const css = read('styles.css');
  const js = read('app.js');
  assert.match(html, /role="tablist"/, 'category tabs need a tablist parent');
  assert.match(html, /role="tabpanel"/, 'the option panel is the tabs\' panel');
  assert.match(js, /tabindex="\$\{selected \? 0 : -1\}"/, 'tabs use roving tabindex');
  assert.match(js, /ArrowRight/, 'tabs respond to arrow keys');
  assert.match(css, /:focus-visible\{/, 'keyboard focus must be visible');
  assert.match(css, /prefers-reduced-motion/);
});

test('reads the design back as a sentence instead of a label', () => {
  const html = read('index.html');
  const js = read('app.js');
  assert.match(html, /id="buildNote"/);
  assert.match(js, /function buildSentence\(\)/);
  assert.match(js, /function article\(/, 'articles agree with the following word');
  assert.match(js, /renderBuildNote/);
  // the preview description and the visible line stay in step
  assert.match(js, /aria-label.*buildSentence\(\)/s);
});

test('carries no templated page chrome', () => {
  const html = read('index.html');
  const css = read('styles.css');
  assert.doesNotMatch(html, /class="eyebrow"/, 'no all-caps eyebrow labels');
  assert.doesNotMatch(html, /→/, 'no arrows appended to button text');
  assert.doesNotMatch(html, /class="spark/, 'no ambient decorative motion');
  assert.doesNotMatch(css, /#ea755e|#d97757/i, 'no default terracotta accent');
  // one accent only, and it is the colour of an unpainted blank
  assert.match(css, /--blank:#f5f0e6/);
});

test('the printed frame closes around the whole piece', () => {
  const js = read('app.js');
  assert.match(js, /function frameSvg\(\)/);
  // drawn last in both modes, or a chest-up torso paints over its bottom rule
  assert.match(js, /maskArt\(\) \+ frameSvg\(\)/);
  assert.match(js, /wornMaskSvg\(\) \+\n\s*frameSvg\(\);/);
});

test('installs as an app and runs with no signal', () => {
  const manifest = JSON.parse(read('manifest.webmanifest'));
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.start_url, './');
  assert.equal(manifest.scope, './', 'relative scope so it works under any path');
  assert.equal(manifest.theme_color, '#17141c');
  assert.equal(manifest.background_color, '#17141c');
  assert.ok(manifest.name && manifest.short_name);
  const purposes = manifest.icons.map((icon) => icon.purpose);
  assert.ok(purposes.includes('maskable'), 'needs a maskable icon for Android');
  assert.ok(manifest.icons.some((i) => i.sizes === '512x512'), 'needs a 512px icon');

  const sw = read('sw.js');
  assert.match(sw, /addEventListener\('install'/);
  assert.match(sw, /addEventListener\('activate'/);
  assert.match(sw, /addEventListener\('fetch'/);
  assert.match(sw, /caches\.delete/, 'old caches are cleaned up on activate');
  assert.match(sw, /request\.mode === 'navigate'/, 'navigations are network-first so redeploys land');

  // registration must live in app.js: the CSP forbids inline scripts
  assert.match(read('app.js'), /serviceWorker\.register\('\.\/sw\.js'\)/);
  assert.doesNotMatch(read('index.html'), /<script(?![^>]*\bsrc=)[^>]*>/, 'no inline script survives the CSP');
});

test('every shipped asset is precached, and every precached asset ships', () => {
  const sw = read('sw.js');
  const shell = [...sw.matchAll(/'\.\/([^']*)'/g)]
    .map((m) => m[1])
    .filter((name, i, all) => all.indexOf(name) === i && name !== '');
  for (const asset of shell) {
    assert.ok(existsSync(resolve(root, asset)), `sw.js precaches missing file: ${asset}`);
  }
  // anything the image serves must also be offline-available
  const copied = read('Dockerfile').match(/\\\n([\s\S]*?)\/usr\/share\/nginx\/html/)[1]
    .split(/\s+/).filter((f) => f.includes('.') && !f.startsWith('/'));
  // the browser owns the worker's own lifecycle; caching it would block updates
  const selfManaged = new Set(['nginx.conf', 'sw.js']);
  for (const file of copied) {
    if (selfManaged.has(file)) continue;
    assert.ok(shell.includes(file), `${file} ships but is never precached`);
  }
  assert.ok(!shell.includes('sw.js'), 'the worker must not precache itself');
});

test('the server lets the worker update and the manifest load', () => {
  const conf = read('nginx.conf');
  assert.match(conf, /worker-src 'self'/, 'CSP must allow the service worker');
  assert.match(conf, /manifest-src 'self'/, 'CSP must allow the manifest');
  // an exact-match location outranks the cached-assets regex, or sw.js goes stale for a week
  assert.match(conf, /location = \/sw\.js \{[\s\S]*?Cache-Control "no-cache"/);
  assert.match(conf, /location = \/manifest\.webmanifest \{[\s\S]*?application\/manifest\+json/);
});

test('mobile keeps the preview in view while you choose', () => {
  const css = read('styles.css');
  const mobile = css.slice(css.indexOf('@media (max-width:760px)'));
  assert.match(mobile, /\.preview-area\{[^}]*position:sticky/, 'the preview pins while options scroll');
  assert.match(mobile, /align-items:stretch/, 'the column flex must stretch, not hug content');
  assert.match(mobile, /env\(safe-area-inset-bottom\)/, 'respects notched-phone insets');
  assert.match(css, /touch-action:manipulation/, 'no 300ms tap delay');
  assert.match(css, /-webkit-tap-highlight-color:transparent/);
  assert.match(read('index.html'), /viewport-fit=cover/);
});

test('CI runs on demand, on main, and on pull requests', () => {
  const workflow = read('.github/workflows/ci.yml');
  assert.match(workflow, /^on:/m);
  assert.match(workflow, /^\s{2}workflow_dispatch:/m, 'must be runnable by hand');
  assert.match(workflow, /^\s{2}push:\n\s{4}branches: \[main\]/m, 'must run on merge to main');
  assert.match(workflow, /^\s{2}pull_request:/m, 'must run on pull requests');

  // both suites, not just the fast one
  assert.match(workflow, /npm run test:unit/);
  assert.match(workflow, /npx playwright test/);

  // least privilege at the top, elevated only where it is needed
  assert.match(workflow, /^permissions:\n\s{2}contents: read/m);
  assert.match(workflow, /pull-requests: write/, 'the comment job needs to write comments');
  assert.match(workflow, /cancel-in-progress:/, 'superseded runs should stop');
});

test('pull requests get screenshots posted back to them', () => {
  const workflow = read('.github/workflows/ci.yml');
  const job = workflow.slice(workflow.indexOf('  screenshots:'));
  assert.match(job, /needs: test/);
  assert.match(job, /github.event_name == 'pull_request'/, 'only comments on PRs');
  assert.match(job, /head.repo.full_name == github.repository/, 'forks cannot be commented into');
  assert.match(job, /always\(\)/, 'a failing run should still show what it looks like');
  assert.match(job, /kindred-screenshots/, 'a marker so the comment is edited, not duplicated');
  assert.match(job, /updateComment/);
  assert.match(job, /createComment/);

  // the capture itself has to exist and write where the workflow collects from
  const spec = read('tests/e2e/screenshots.spec.mjs');
  assert.match(spec, /artifacts\/screenshots/);
  assert.match(workflow, /path: artifacts\/screenshots/);
  assert.match(spec, /mobile-/, 'mobile views are part of the review set');
});

test('the browser suite covers what the source contract cannot', () => {
  const creator = read('tests/e2e/creator.spec.mjs');
  const offline = read('tests/e2e/offline.spec.mjs');
  // behaviour, not shape: these only pass if the app actually runs
  assert.match(creator, /toHaveAttribute\('aria-pressed', 'true'\)/);
  assert.match(creator, /waitForEvent\('download'\)/, 'export is exercised end to end');
  assert.match(creator, /ArrowRight/, 'keyboard tab movement is exercised');
  assert.match(creator, /scrollWidth/, 'overflow is measured in a real layout');
  assert.match(creator, /getBoundingClientRect\(\).top/, 'the sticky preview is measured');
  // a real server is stopped rather than emulating offline, and the reload runs
  // from inside the page — a CDP reload can bypass the worker like a hard refresh
  assert.match(offline, /server\.close/, 'offline is proven by stopping the origin');
  assert.match(offline, /location\.reload/);
  assert.doesNotMatch(offline, /await page\.reload\(\)/, 'page.reload can skip the worker');
  assert.match(read('tests/e2e/helpers.mjs'), /serviceWorker\.controller/, 'waits for control, not just registration');

  // the test server must serve the same policy production does
  const server = read('tests/server.mjs');
  assert.match(server, /nginx\.conf/, 'the CSP is read from nginx.conf so it cannot drift');
  assert.match(server, /Content-Security-Policy/);
});

test('nothing shipped assumes it lives at the domain root', () => {
  // therian.heywoodlh.io serves from /, the github.io fallback from /<repo>/.
  // A single leading slash anywhere below breaks the sub-path URL.
  const html = read('index.html');
  for (const [, attr, value] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
    assert.ok(!value.startsWith('/'), `index.html has a root-absolute ${attr}: ${value}`);
  }

  const manifest = JSON.parse(read('manifest.webmanifest'));
  for (const field of ['id', 'start_url', 'scope']) {
    assert.equal(manifest[field], './', `manifest ${field} must be relative`);
  }
  for (const icon of manifest.icons) {
    assert.ok(!icon.src.startsWith('/'), `manifest icon is root-absolute: ${icon.src}`);
  }

  const sw = read('sw.js');
  const shell = sw.slice(sw.indexOf('const SHELL'), sw.indexOf('];'));
  for (const [, entry] of shell.matchAll(/'([^']+)'/g)) {
    assert.ok(entry.startsWith('./'), `precached path is not relative: ${entry}`);
  }
  assert.match(read('app.js'), /register\('\.\/sw\.js'\)/);
});

test('the policy still travels when the server cannot send headers', () => {
  // GitHub Pages sets no response headers, so the CSP has to be in the document.
  const conf = read('nginx.conf');
  const header = conf.match(/set \$csp "([^"]+)"/)[1];
  const meta = read('index.html').match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];

  const directives = (policy) => new Set(policy.split(';').map((d) => d.trim()).filter(Boolean));
  const fromHeader = directives(header);
  const fromMeta = directives(meta);

  // frame-ancestors is ignored in a meta element; everything else must match
  const expected = new Set([...fromHeader].filter((d) => !d.startsWith('frame-ancestors')));
  assert.deepEqual([...fromMeta].sort(), [...expected].sort(), 'meta CSP has drifted from nginx.conf');
  assert.ok(![...fromMeta].some((d) => d.startsWith('frame-ancestors')), 'meta ignores frame-ancestors');
});

test('GitHub Pages deploys the app, and only after the tests pass', () => {
  const workflow = read('.github/workflows/ci.yml');
  const deploy = workflow.slice(workflow.indexOf('  deploy:'));
  assert.match(deploy, /needs: test/, 'never publish a build that failed');
  assert.match(deploy, /github.event_name == 'push' && github.ref == 'refs\/heads\/main'/);
  assert.match(deploy, /pages: write/);
  assert.match(deploy, /id-token: write/);
  assert.match(deploy, /actions\/deploy-pages@v4/);
  // a superseded PR run may be cancelled; a deploy from main may not
  assert.match(workflow, /cancel-in-progress: \$\{\{ github.event_name == 'pull_request' \}\}/);

  assert.equal(read('CNAME').trim(), 'therian.heywoodlh.io');
  assert.ok(existsSync(resolve(root, '.nojekyll')), 'Pages runs Jekyll unless told not to');

  // the staged site and the container image must ship the same files
  const staged = deploy.match(/mkdir -p _site\n([\s\S]*?)_site\//)[0]
    .split(/\s+/).filter((f) => /\.(html|css|js|webmanifest|svg|png)$/.test(f));
  const copied = read('Dockerfile').match(/\\\n([\s\S]*?)\/usr\/share\/nginx\/html/)[1]
    .split(/\s+/).filter((f) => /\.(html|css|js|webmanifest|svg|png)$/.test(f));
  assert.deepEqual(staged.sort(), copied.sort(), 'Pages and Docker ship different files');
});

test('includes mobile styles and deployment files', () => {
  const css = read('styles.css');
  const dockerfile = read('Dockerfile');
  const compose = read('compose.yaml');
  assert.match(css, /@media \(max-width:\s*760px\)/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /\.option-gap\{/, 'option groups are spaced by a class, not inline styles');
  assert.match(css, /repeat\(3,minmax\(0,1fr\)\)/, 'tile tracks cannot be widened by a long label');
  assert.match(dockerfile, /nginx:1\.27-alpine/);
  assert.match(compose, /8080:8080/);
});
