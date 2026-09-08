(() => {
  'use strict';
  const STORAGE_KEY = 'kindred-studio-v3';

  /* Palettes lead with the natural theriotype coats the community paints most
     (grey tabby, timber wolf, red fox, black cat) and finish with the brighter
     "fantasy pelt" colors that show up all over therian mask builds. */
  const palettes = {
    coat: [
      {name:'Grey tabby', value:'#9aa1a8'}, {name:'Timber', value:'#7f776b'},
      {name:'Orange tabby', value:'#d98a45'}, {name:'Red fox', value:'#c8622e'},
      {name:'Ink black', value:'#4b4854'}, {name:'Snow', value:'#ece5df'},
      {name:'Cocoa', value:'#8a5c40'}, {name:'Moss', value:'#8ba078'},
      {name:'Blossom', value:'#e79fb3'}, {name:'Nebula', value:'#8b7ac2'},
      {name:'Seafoam', value:'#79c2b5'}, {name:'Honey', value:'#e6c266'}
    ],
    accent: [
      {name:'Cream', value:'#fbf1e2'}, {name:'Blush', value:'#f5c3b4'},
      {name:'Ash', value:'#ced3d7'}, {name:'Charcoal', value:'#5b5763'},
      {name:'Mint', value:'#bfe0cd'}, {name:'Lilac', value:'#d3c2e8'},
      {name:'Sand', value:'#e8d5ac'}, {name:'Rose', value:'#e79aa8'}
    ],
    fur: [
      {name:'Snow', value:'#efe9e3'}, {name:'Cream', value:'#e4d2b4'},
      {name:'Grey', value:'#b4b8be'}, {name:'Charcoal', value:'#4f4c55'},
      {name:'Brown', value:'#8a6045'}, {name:'Ginger', value:'#d98a4e'}
    ],
    mesh: [
      {name:'Amber', value:'#e8a33d'}, {name:'Jade', value:'#57b58b'},
      {name:'Sky', value:'#62a7d8'}, {name:'Violet', value:'#9b7bd4'},
      {name:'Ember', value:'#d95c58'}, {name:'Void', value:'#332e3a'}
    ],
    hair: [
      {name:'Crimson', value:'#d5333b'}, {name:'Raven', value:'#2f2b38'},
      {name:'Platinum', value:'#e6dfd2'}, {name:'Teal', value:'#2fa6a0'},
      {name:'Violet', value:'#8a5bc4'}, {name:'Bubblegum', value:'#e878ac'},
      {name:'Ash brown', value:'#7c5a48'}, {name:'Sunburst', value:'#e8a33d'}
    ],
    eye: [
      {name:'Ember', value:'#d94048'}, {name:'Amber', value:'#e39a30'},
      {name:'Jade', value:'#3fa878'}, {name:'Sky', value:'#4a92d4'},
      {name:'Violet', value:'#8d63cc'}, {name:'Rose', value:'#dd6f9b'}
    ],
    skin: [
      {name:'Porcelain', value:'#f7e2d4'}, {name:'Ivory', value:'#f0cdb0'},
      {name:'Honey', value:'#ddaa80'}, {name:'Almond', value:'#c2875c'},
      {name:'Chestnut', value:'#9b6242'}, {name:'Espresso', value:'#6d4128'},
      {name:'Ash violet', value:'#d9c6d2'}, {name:'Moss', value:'#c3cdae'}
    ],
    backdrop: [
      {name:'Mint', value:'#d8ebe1'}, {name:'Peach', value:'#f7ded0'},
      {name:'Lilac', value:'#e2dcf2'}, {name:'Sky', value:'#d5e5f2'},
      {name:'Dusk', value:'#3c3648'}, {name:'Butter', value:'#f6e7c4'}
    ]
  };

  const options = {
    paint: [
      ['plain','Unpainted','○'], ['tabby','Tabby stripes','≡'], ['brows','Brow marks','⌃'],
      ['points','Siamese points','◗'], ['calico','Calico patches','◍'], ['gradient','Fox fade','◐'],
      ['husky','Husky mask','◑'], ['speckle','Speckles','⁙'], ['moon','Moon sigil','☾'],
      ['scars','Scars','✕'], ['theta','Theta-delta','Θ'], ['bloom','Petal marks','✿']
    ],
    maskEars: [
      ['fox','Fox','▲'], ['cat','Cat','◭'], ['wolf','Wolf','⏶'],
      ['lynx','Lynx tufts','✶'], ['long','Long','∧'], ['round','Round','◠'], ['folded','Folded','⌒']
    ],
    maskEyes: [
      ['sharp','Sharp','◣'], ['almond','Almond','◗'], ['round','Round','●'],
      ['narrow','Narrow','▬'], ['wide','Wide','◍'], ['upturn','Upturned','◤']
    ],
    cheek: [
      ['spiky','Spiky ruff','⌇'], ['shaggy','Shaggy','⩘'], ['soft','Soft points','⌒'], ['smooth','Smooth','—']
    ],
    fur: [
      ['none','Bare edge','—'], ['cheeks','Cheek tufts','✧'], ['ruff','Full ruff','❉'],
      ['ears','Ear fluff','▲'], ['full','Ruff + ears','✺']
    ],
    fangs: [
      ['none','No teeth','—'], ['fangs','Two fangs','ᐁ'], ['teeth','Full teeth','⋁'],
      ['tongue','Cheeky','ᵕ']
    ],
    charm: [
      ['none','None','—'], ['flowers','Flower crown','❀'], ['leaves','Leaf sprig','❧'],
      ['moonc','Moon charm','☾'], ['bell','Bell','◍'], ['cuff','Ear cuff','◠'],
      ['feather','Feather','⌇']
    ],
    strap: [
      ['elastic','Elastic','—'], ['ribbon','Ribbon','⁁'], ['cord','Braided cord','≈'],
      ['none','Hidden','·']
    ],
    therianEars: [
      ['none','None','—'], ['cat','Cat','▲'], ['fox','Fox','⏶'],
      ['wolf','Wolf','◭'], ['bunny','Rabbit','∧'], ['deer','Antlers','⑂']
    ],
    maskDesign: [
      ['mine','Your mask','✦'], ['fox','Fox blank','◒'], ['tabby','Grey tabby','≡'],
      ['redfox','Red fox','◐'], ['blackcat','Black cat','●'], ['husky','Husky','◑'], ['lynx','Lynx','✶']
    ],
    maskWear: [
      ['face','Over the face','◒'], ['up','Pushed up','◠'], ['none','Not today','—']
    ],
    eyeStyle: [
      ['anime','Anime','◉'], ['sharp','Sharp','◢'], ['soft','Soft','◡'],
      ['wide','Wide','◍'], ['closed','Closed','⌣']
    ],
    hair: [
      ['none','Shaved','—'], ['buzz','Buzzed','◠'], ['bob','Bob','◡'], ['shag','Shag','⌇'],
      ['long','Long','⌇'], ['parted','Curtains','⑂'], ['curly','Curly','❉'], ['afro','Afro','◍'],
      ['twin','Twin tails','⑂'], ['pony','Ponytail','⌒'], ['wolfcut','Wolf cut','⩘']
    ],
    expression: [
      ['smile','Soft smile','‿'], ['grin','Toothy grin','።'], ['fang','Snaggletooth','ᐁ'],
      ['open','Excited','◖'], ['smug','Smug','⌒'], ['neutral','Calm','—']
    ],
    marking: [
      ['none','None','—'], ['blush','Blush','◌'], ['tearline','Tear lines','▾'],
      ['freckles','Freckles','⁙'], ['stripes','Cheek stripes','≡'], ['paw','Paw print','❉'],
      ['theta','Theta-delta','Θ']
    ],
    outfit: [
      ['hoodie','Hoodie','◒'], ['tee','Band tee','▤'], ['jacket','Studded jacket','▨'],
      ['sweater','Cozy sweater','▩'], ['overalls','Overalls','▥'], ['bare','Bare shoulders','◡']
    ],
    neck: [
      ['none','Bare','—'], ['choker','Spiked choker','✦'], ['bell','Bell collar','◍'],
      ['theta','Theta pendant','Θ'], ['chain','Chain','⚙'], ['bandana','Bandana','▽'],
      ['beads','Beaded collar','●']
    ]
  };

  /* The mask opens as an unpainted bone blank with fox ears — the thing you
     actually take out of the kit — so the first choice is what to paint on it.
     The portrait opens as the red-haired hooded wolf from the style reference. */
  const defaults = {
    mode:'mask',
    maskEars:'fox', maskEyes:'sharp', cheek:'spiky',
    coat:'#ece5df', accent:'#fbf1e2', paint:'plain', mesh:'#332e3a',
    fur:'none', furColor:'#efe9e3', fangs:'fangs', charm:'none', strap:'none',
    skin:'#f0cdb0', hair:'long', hairColor:'#d5333b',
    maskDesign:'mine', maskWear:'face', therianEars:'fox', earColor:'#c8622e',
    eyeStyle:'anime', eyeColor:'#d94048', expression:'grin', marking:'blush',
    outfit:'hoodie', neck:'choker', backdrop:'#d8ebe1'
  };

  const categories = {
    mask: [
      ['shape','Shape','Ears and the cut of the cheek ruff.'],
      ['paint','Paint','Base coat, contrast, and the markings you paint on.'],
      ['eyes','Eyes','Cut-out shape and the mesh behind it.'],
      ['fur','Fur','Glue a ruff or ear fluff around the edge.'],
      ['extras','Extras','Teeth, charms, strap, and backdrop.']
    ],
    full: [
      ['body','Body','Skin tone and face markings.'],
      ['hair','Hair','Style and colour.'],
      ['gear','Gear','Mask, how you wear it, and ears.'],
      ['face','Face','Eyes and expression.'],
      ['wear','Wear','Outfit and neckwear.'],
      ['scene','Scene','Backdrop colour.']
    ]
  };

  let state = {...defaults};
  let activeCategory = 'base';

  const $ = (selector) => document.querySelector(selector);
  const avatar = $('#avatarPreview');
  const categoryTabs = $('#categoryTabs');
  const optionPanel = $('#optionPanel');
  const buildNote = $('#buildNote');

  function loadState(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; } }
  function saveState(){ try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* private mode */ } }
  function safe(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function values(list){ return list.map(([value]) => value); }
  function swatches(key){ return palettes[key].map(item => item.value); }

  function normalizeState(saved){
    const savedState = saved && typeof saved === 'object' ? saved : {};
    const allowed = {
      mode: ['mask','full'],
      skin: swatches('skin'), earColor: swatches('coat'),
      maskEars: values(options.maskEars), maskEyes: values(options.maskEyes), cheek: values(options.cheek),
      coat: swatches('coat'), accent: swatches('accent'), furColor: swatches('fur'),
      mesh: swatches('mesh'), hairColor: swatches('hair'), eyeColor: swatches('eye'),
      backdrop: swatches('backdrop'),
      therianEars: values(options.therianEars), maskDesign: values(options.maskDesign),
      maskWear: values(options.maskWear),
      paint: values(options.paint), fur: values(options.fur), fangs: values(options.fangs),
      charm: values(options.charm), strap: values(options.strap),
      eyeStyle: values(options.eyeStyle), hair: values(options.hair),
      expression: values(options.expression),
      marking: values(options.marking), outfit: values(options.outfit),
      neck: values(options.neck)
    };
    return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) =>
      [key, allowed[key].includes(savedState[key]) ? savedState[key] : fallback]));
  }
  state = normalizeState(loadState());
  activeCategory = categories[state.mode][0][0];

  /* ---------- shared drawing helpers ---------- */
  const INK = '#2c2632';
  const mirror = (markup) => `<g transform="translate(480 0) scale(-1 1)">${markup}</g>`;
  const pair = (markup) => markup + mirror(markup);

  function shade(hex, amount){
    const n = parseInt(String(hex).replace('#',''), 16);
    const mix = (channel) => Math.max(0, Math.min(255, Math.round(channel + (amount > 0 ? (255 - channel) * amount : channel * amount))));
    const r = mix((n >> 16) & 255), g = mix((n >> 8) & 255), b = mix(n & 255);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
  function lum(hex){
    const n = parseInt(String(hex).replace('#',''), 16);
    return ((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114;
  }
  function isDark(hex){ return lum(hex) < 140; }
  /* A near-black pelt swallows a near-black outline, so those shapes get a lifted
     rim line instead — still one consistent weight, just readable. */
  function lineFor(fill){ return lum(fill) < 95 ? shade(fill, 0.45) : INK; }

  /* A sawtooth fringe along an elliptical arc — this is how the glued-on faux fur
     ruff and ear fluff read on a real painted mask. */
  function furFringe(cx, cy, rx, ry, from, to, spikes, length, color, stroke){
    const inner = [], outer = [];
    for (let i = 0; i <= spikes; i++){
      const t = from + (to - from) * (i / spikes);
      const wobble = 0.62 + 0.38 * Math.abs(Math.sin(i * 2.4));
      inner.push([cx + Math.cos(t) * rx, cy + Math.sin(t) * ry]);
      const reach = length * wobble;
      const tipAngle = t + (i % 2 ? 0.03 : -0.03);
      outer.push([cx + Math.cos(tipAngle) * (rx + reach), cy + Math.sin(tipAngle) * (ry + reach)]);
    }
    let d = `M${inner[0][0].toFixed(1)} ${inner[0][1].toFixed(1)}`;
    for (let i = 0; i < spikes; i++){
      d += `L${outer[i][0].toFixed(1)} ${outer[i][1].toFixed(1)}L${inner[i + 1][0].toFixed(1)} ${inner[i + 1][1].toFixed(1)}`;
    }
    for (let i = inner.length - 1; i >= 0; i--) d += `L${inner[i][0].toFixed(1)} ${inner[i][1].toFixed(1)}`;
    return `<path d="${d}Z" fill="${color}" stroke="${shade(color, -0.32)}" stroke-width="${stroke === undefined ? 1.6 : stroke}" stroke-linejoin="round"/>`;
  }

  /* Two passes read as pile depth rather than a sunburst: a longer, darker layer
     behind a shorter, lighter one. */
  function furPile(cx, cy, rx, ry, from, to, count, length, color){
    return furFringe(cx, cy, rx + length * 0.18, ry + length * 0.18, from, to, Math.round(count * 0.7), length, shade(color, -0.24), 0) +
      furFringe(cx, cy, rx, ry, from, to, count, length * 0.72, color, 0) +
      furFringe(cx, cy, rx - length * 0.22, ry - length * 0.22, from, to, Math.round(count * 1.15), length * 0.5, shade(color, 0.16), 0);
  }

  function backdropSvg(){
    const bg = safe(state.backdrop);
    const dark = isDark(bg);
    const dots = dark ? shade(bg, 0.28) : shade(bg, -0.16);
    const frame = dark ? shade(bg, 0.45) : '#ffffff';
    return `<rect width="480" height="480" fill="${bg}"/>` +
      `<rect width="480" height="480" fill="url(#halftone)" opacity="${dark ? '.5' : '.55'}"/>` +
      `<defs><pattern id="halftone" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">` +
      `<circle cx="4" cy="4" r="2.6" fill="${dots}"/></pattern></defs>`;
  }
  function frameSvg(){
    const bg = safe(state.backdrop);
    const frame = isDark(bg) ? shade(bg, 0.45) : '#ffffff';
    return `<rect x="14" y="14" width="452" height="452" rx="26" fill="none" stroke="${frame}" stroke-width="7" opacity=".85"/>` +
      `<rect x="14" y="14" width="452" height="452" rx="26" fill="none" stroke="${INK}" stroke-width="3" opacity=".35"/>`;
  }
  /* ---------- the mask blank ---------- */
  /* One moulded kitsune shell, drawn as a left half that is mirrored — which is
     how these masks are painted, and why the reference has a faint centre seam.
     Ears, eye cut-outs and the cheek ruff swap inside that one silhouette. */
  const SEAM_TOP = 166, SEAM_CHIN = 414;
  const EAR_BASE = [203, 168];   // where the ear's inner edge leaves the brow
  const EAR_MERGE = [51, 238];   // where its outer edge becomes the cheek

  /* Every ear runs from EAR_BASE to EAR_MERGE so the silhouette stays closed. */
  const maskEars = {
    fox:   {d:'C174 144 116 98 90 74 Q64 46 65 66 C57 120 53 188 51 238',
            inner:'M180 174 C160 156 122 118 102 100 C95 138 91 184 95 210 Q136 194 180 174Z', tick:[112,158]},
    cat:   {d:'C176 152 124 116 98 96 Q74 78 76 96 C64 142 55 194 51 238',
            inner:'M182 178 C164 164 128 134 110 118 C101 152 94 190 97 212 Q138 198 182 178Z', tick:[116,170]},
    wolf:  {d:'C178 148 128 108 100 82 Q68 58 62 92 C54 142 52 196 51 238',
            inner:'M182 176 C166 160 132 126 110 106 Q96 142 94 188 Q94 206 97 212 Q138 196 182 176Z', tick:[118,164]},
    lynx:  {d:'C174 144 116 98 90 74 Q64 46 65 66 C57 120 53 188 51 238',
            inner:'M180 174 C160 156 122 118 102 100 C95 138 91 184 95 210 Q136 194 180 174Z', tick:[112,158],
            tuft:'<g fill="none" stroke-linecap="round"><path d="M72 58 L54 16"/><path d="M82 60 L78 12"/><path d="M92 66 L104 22"/></g>'},
    long:  {d:'C176 138 112 76 88 44 Q66 12 70 40 C56 108 53 186 51 238',
            inner:'M182 170 C162 146 116 92 100 68 C93 120 89 182 95 210 Q138 192 182 170Z', tick:[110,146]},
    round: {d:'C182 122 104 100 70 148 Q44 190 51 238',
            inner:'M176 162 C142 142 106 138 89 170 Q80 196 95 210 Q136 190 176 162Z', tick:[122,178]},
    folded:{d:'C176 116 92 104 64 148 Q48 180 78 196 Q54 212 51 238',
            inner:'M172 156 C140 138 102 138 87 164 Q80 180 100 186 Q134 172 172 156Z', tick:[118,164]}
  };

  /* The jagged cheek is the mask's signature; depth and count carry the style. */
  const cheekStyles = {spiky:[5, 17], shaggy:[7, 23], soft:[4, 8], smooth:[0, 0]};
  function cheekEdge(){
    const [teeth, depth] = cheekStyles[state.cheek] || cheekStyles.spiky;
    if (!teeth) return `Q56 296 92 352`;
    const a = EAR_MERGE, c = [56, 298], b = [92, 352];
    let d = '';
    for (let i = 1; i <= teeth * 2; i++){
      const t = i / (teeth * 2), u = 1 - t;
      const x = u * u * a[0] + 2 * u * t * c[0] + t * t * b[0];
      const y = u * u * a[1] + 2 * u * t * c[1] + t * t * b[1];
      const out = i % 2 ? -depth * (1 - t * 0.4) : depth * 0.5;
      d += `L${(x + out).toFixed(1)} ${y.toFixed(1)}`;
    }
    return d;
  }

  /* Open contour for the left half: top of the brow, up and over the ear, down
     the cheek ruff, along the jaw to the chin. Stroked as-is, closed for fill. */
  function maskContour(){
    const ear = maskEars[state.maskEars] || maskEars.fox;
    return `M240 ${SEAM_TOP} C229 163 214 164 ${EAR_BASE[0]} ${EAR_BASE[1]} ${ear.d}` +
      `${cheekEdge()} C104 380 168 406 240 ${SEAM_CHIN}`;
  }

  const maskEyeShapes = {
    sharp:  'M116 266 C152 248 200 256 224 284 C204 320 164 340 136 330 C118 322 110 288 116 266Z',
    almond: 'M118 282 C150 258 198 262 222 288 C202 322 162 336 138 326 C122 318 114 298 118 282Z',
    round:  'M124 298 C124 268 152 250 176 250 C204 250 224 274 224 300 C224 328 200 344 174 344 C146 344 124 326 124 298Z',
    narrow: 'M116 290 C154 272 200 276 224 294 C204 320 162 328 136 320 C122 314 112 300 116 290Z',
    wide:   'M112 288 C118 252 156 236 184 240 C216 244 232 270 228 302 C224 334 192 350 162 346 C130 342 108 320 112 288Z',
    upturn: 'M118 308 C128 272 178 246 214 264 C228 272 230 288 222 302 C202 330 156 344 134 334 C122 328 115 320 118 308Z'
  };

  /* The reference line is oxblood, not black — a coat-tinted ink reads hand-drawn
     and keeps working when the blank is primed a dark colour. */
  function maskInk(coat){
    const base = lum(coat) < 95 ? shade(coat, 0.5) : shade(coat, -0.7);
    const n = parseInt(base.replace('#',''), 16);
    const mix = (c, t) => Math.round(c * 0.55 + t * 0.45);
    const r = mix((n >> 16) & 255, 74), g = mix((n >> 8) & 255, 29), b = mix(n & 255, 34);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  function maskPaintSvg(coat, accent, ink){
    const dark = shade(coat, -0.45), soft = shade(coat, -0.26), light = shade(accent, 0.2);
    switch (state.paint){
      case 'tabby': {
        const half = `<path d="M206 172 Q190 214 204 258 Q220 214 206 172Z"/>` +
          `<path d="M166 190 Q144 230 160 272 Q182 232 166 190Z"/>` +
          `<path d="M92 268 Q126 288 162 282 Q130 306 86 296Z"/>` +
          `<path d="M96 316 Q130 332 164 326 Q134 350 92 342Z"/>`;
        return `<g fill="${dark}" opacity=".72">${pair(half)}<path d="M240 170 Q228 216 240 264 Q252 216 240 170Z"/></g>`;
      }
      case 'brows':
        return `<g fill="${dark}" opacity=".82">${pair('<path d="M196 226 Q208 250 202 272 Q188 252 186 228Z"/><path d="M160 236 Q174 258 172 280 Q156 262 150 240Z"/>')}</g>`;
      case 'points':
        return `<ellipse cx="240" cy="396" rx="104" ry="66" fill="${dark}" opacity=".6"/>` +
          `<g fill="${dark}" opacity=".55">${pair('<path d="M96 60 Q70 34 68 66 C60 118 56 160 58 186 Q84 140 110 108Z"/>')}</g>`;
      case 'calico':
        return `<path d="M84 196 Q166 168 190 250 Q160 316 96 292Z" fill="${dark}" opacity=".72"/>` +
          `<path d="M296 306 Q384 300 372 372 Q322 404 288 356Z" fill="${soft}" opacity=".85"/>` +
          `<path d="M256 174 Q334 172 344 224 Q296 244 252 214Z" fill="${light}" opacity=".9"/>`;
      case 'gradient':
        return `<rect x="30" y="30" width="420" height="410" fill="url(#foxFade)"/>` +
          `<g fill="${dark}" opacity=".5">${pair('<path d="M98 62 Q70 34 70 68 C62 118 57 158 58 184 Q84 138 112 106Z"/>')}</g>`;
      case 'husky':
        return `<path d="M56 226 Q60 92 240 158 Q420 92 424 226 Q368 208 330 250 Q288 216 240 246 Q192 216 150 250 Q112 208 56 226Z" fill="${dark}" opacity=".72"/>` +
          `<g fill="${light}" opacity=".95">${pair('<ellipse cx="178" cy="248" rx="20" ry="12" transform="rotate(-14 178 248)"/>')}</g>`;
      case 'speckle': {
        let dots = '';
        for (let i = 0; i < 38; i++){
          const a = i * 2.399, r = 30 + (i % 8) * 20;
          dots += `<circle cx="${(240 + Math.cos(a) * r * 1.5).toFixed(1)}" cy="${(300 + Math.sin(a) * r * 1.05).toFixed(1)}" r="${(2.6 + (i % 3)).toFixed(1)}"/>`;
        }
        return `<g fill="${dark}" opacity=".55">${dots}</g>`;
      }
      case 'moon':
        return `<path d="M256 182 A34 34 0 1 0 258 242 A26 26 0 1 1 256 182Z" fill="${light}" stroke="${ink}" stroke-width="4" opacity=".95"/>` +
          `<g fill="${light}" opacity=".9"><circle cx="188" cy="204" r="4.5"/><circle cx="300" cy="192" r="3.4"/><circle cx="296" cy="252" r="3.8"/></g>`;
      case 'scars':
        return `<g stroke="${shade(accent, 0.32)}" stroke-width="8" stroke-linecap="round" fill="none" opacity=".95">` +
          `<path d="M330 196 L286 296"/><path d="M362 210 L322 306"/><path d="M388 234 L358 300"/></g>`;
      case 'theta':
        return `<g fill="none" stroke="${ink}" stroke-width="7" stroke-linejoin="round" opacity=".9">` +
          `<path d="M240 178 L268 232 H212Z"/><ellipse cx="240" cy="212" rx="27" ry="31"/><path d="M214 212 H266"/></g>`;
      case 'bloom':
        return `<g opacity=".92">${pair(`<g transform="translate(146 330)"><g fill="${light}" stroke="${ink}" stroke-width="2.5">` +
          `<ellipse cx="0" cy="-14" rx="8.5" ry="12"/><ellipse cx="13" cy="-4" rx="8.5" ry="12" transform="rotate(72 13 -4)"/>` +
          `<ellipse cx="8" cy="12" rx="8.5" ry="12" transform="rotate(144 8 12)"/><ellipse cx="-8" cy="12" rx="8.5" ry="12" transform="rotate(216 -8 12)"/>` +
          `<ellipse cx="-13" cy="-4" rx="8.5" ry="12" transform="rotate(288 -13 -4)"/></g><circle r="6" fill="${shade(coat,-0.4)}"/></g>`)}</g>`;
      default:
        return '';
    }
  }

  function maskCharmSvg(ink){
    const gold = '#e2a83f', goldDark = '#a9762a';
    switch (state.charm){
      case 'flowers':
        return `<g>${[[120,150,'#f0879f'],[168,110,'#f6d05f'],[240,150,'#f0879f'],[312,110,'#a5cf86'],[360,150,'#f6d05f'],[204,128,'#c6a0e0'],[276,128,'#f6d05f']]
          .map(([x,y,c]) => `<g transform="translate(${x} ${y})"><g fill="${c}" stroke="${ink}" stroke-width="2.5">` +
            `<circle cx="0" cy="-11" r="7.5"/><circle cx="10" cy="-3" r="7.5"/><circle cx="6" cy="9" r="7.5"/><circle cx="-6" cy="9" r="7.5"/><circle cx="-10" cy="-3" r="7.5"/></g>` +
            `<circle r="5" fill="#f8ecc8" stroke="${ink}" stroke-width="2"/></g>`).join('')}</g>`;
      case 'leaves':
        return `<g transform="translate(352 168) rotate(26)"><path d="M0 0 Q38 -12 58 20 Q22 38 0 0Z" fill="#7fae6d" stroke="#4c6b41" stroke-width="4"/>` +
          `<path d="M0 0 Q30 6 58 20" stroke="#4c6b41" stroke-width="3" fill="none"/>` +
          `<path d="M-7 14 Q24 26 38 56 Q4 60 -7 14Z" fill="#94c07d" stroke="#4c6b41" stroke-width="4"/></g>`;
      case 'moonc':
        return `<g>${pair(`<path d="M84 282 Q66 302 62 326" stroke="${goldDark}" stroke-width="3.5" fill="none"/>` +
          `<path d="M68 330 A16 16 0 1 0 69 358 A12 12 0 1 1 68 330Z" fill="${gold}" stroke="${goldDark}" stroke-width="3"/>`)}</g>`;
      case 'bell':
        return `<path d="M240 ${SEAM_CHIN - 4} v20" stroke="${goldDark}" stroke-width="4" fill="none"/>` +
          `<path d="M220 ${SEAM_CHIN + 62} q0-24 20-24 q20 0 20 24Z" fill="${gold}" stroke="${goldDark}" stroke-width="4" stroke-linejoin="round"/>` +
          `<circle cx="240" cy="${SEAM_CHIN + 68}" r="5" fill="${goldDark}"/>`;
      case 'cuff': {
        const ear = maskEars[state.maskEars] || maskEars.fox;
        return `<g>${pair(`<path d="M${ear.tick[0] - 16} ${ear.tick[1] - 20} q-16 20 -6 40" stroke="${gold}" stroke-width="9" fill="none" stroke-linecap="round"/>` +
          `<circle cx="${ear.tick[0] - 20}" cy="${ear.tick[1] + 24}" r="7" fill="${gold}" stroke="${goldDark}" stroke-width="2.5"/>`)}</g>`;
      }
      case 'feather':
        return `<g transform="translate(410 250) rotate(16)"><path d="M0 0 v84" stroke="#8a6a4c" stroke-width="4"/>` +
          `<path d="M0 6 Q24 24 18 56 Q5 68 0 74Z" fill="#c9a2d4" stroke="#6d4f7c" stroke-width="3"/>` +
          `<path d="M0 6 Q-24 24 -18 56 Q-5 68 0 74Z" fill="#dcbde4" stroke="#6d4f7c" stroke-width="3"/></g>`;
      default: return '';
    }
  }

  function maskStrapSvg(){
    if (state.strap === 'none') return '';
    const run = 'M78 268 L18 292';
    if (state.strap === 'ribbon')
      return `<g>${pair(`<path d="${run}" stroke="#c96a88" stroke-width="15" fill="none" stroke-linecap="round"/>` +
        `<path d="${run}" stroke="#f0a8bd" stroke-width="7" fill="none" stroke-linecap="round"/>`)}</g>`;
    if (state.strap === 'cord')
      return `<g>${pair(`<path d="${run}" stroke="#8a6a4c" stroke-width="12" fill="none" stroke-linecap="round"/>` +
        `<path d="${run}" stroke="#c49a72" stroke-width="12" stroke-dasharray="8 10" fill="none" stroke-linecap="round"/>`)}</g>`;
    return `<g opacity=".9">${pair(`<path d="${run}" stroke="#494252" stroke-width="11" fill="none" stroke-linecap="round"/>`)}</g>`;
  }

  /* The reference finishes with a small open jaw and two fangs. */
  function maskTeethSvg(ink){
    const jaw = `<path d="M198 388 Q240 379 282 388 Q262 415 240 416 Q218 415 198 388Z" fill="#f4efe8" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>` +
      `<path d="M198 388 Q240 379 282 388" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>`;
    const fang = (x, dir) => `<path d="M${x} 386 L${x + dir * 5} 407 L${x + dir * 12} 388Z" fill="#fbf7f2" stroke="${ink}" stroke-width="3.5" stroke-linejoin="round"/>`;
    if (state.fangs === 'fangs') return jaw + fang(210, 1) + fang(270, -1);
    if (state.fangs === 'teeth')
      return jaw + fang(206, 1) + fang(226, 1) + fang(274, -1) + fang(254, -1);
    if (state.fangs === 'tongue')
      return jaw + `<path d="M212 394 Q240 440 268 394 Q240 410 212 394Z" fill="#e58aa0" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>`;
    return '';
  }

  function maskArt(){
    const coat = safe(state.coat), accent = safe(state.accent);
    const mesh = safe(state.mesh), furColor = safe(state.furColor);
    const ink = maskInk(coat);
    const ear = maskEars[state.maskEars] || maskEars.fox;
    const eye = maskEyeShapes[state.maskEyes] || maskEyeShapes.sharp;
    const contour = maskContour();
    const shell = `${contour}Z`;

    const wantsRuff = state.fur === 'ruff' || state.fur === 'full';
    const wantsEarFur = state.fur === 'ears' || state.fur === 'full';
    const ruff = wantsRuff
      ? furPile(240, 300, 176, 140, 0.3, Math.PI * 2 - 0.3, 66, 32, furColor)
      : state.fur === 'cheeks'
        ? pair(furPile(120, 310, 62, 62, 1.7, 3.9, 22, 26, furColor))
        : '';
    const earFur = wantsEarFur
      ? pair(furPile(ear.tick[0] + 4, ear.tick[1] - 16, 26, 52, 1.85, 4.45, 20, 22, shade(furColor, 0.14)))
      : '';

    /* Soft airbrushed depth just inside the contour, as on the painted reference. */
    const modelling = `<g clip-path="url(#maskClip)">` +
      `<path d="${contour}" fill="none" stroke="${ink}" stroke-width="24" opacity=".22" filter="url(#soften)"/>` +
      `${mirror(`<path d="${contour}" fill="none" stroke="${ink}" stroke-width="24" opacity=".22" filter="url(#soften)"/>`)}` +
      `</g>`;

    const snout = `<g clip-path="url(#maskClip)"><ellipse cx="240" cy="360" rx="66" ry="46" fill="${accent}" opacity=".3"/></g>`;
    const paint = `<g clip-path="url(#maskClip)">${maskPaintSvg(coat, accent, ink)}</g>`;

    const eyes = pair(
      `<path d="${eye}" fill="${mesh}"/>` +
      `<path d="${eye}" fill="url(#meshWeave)"/>` +
      `<path d="${eye}" fill="#100d14" opacity=".55"/>` +
      `<path d="${eye}" fill="none" stroke="${ink}" stroke-width="10" stroke-linejoin="round"/>`
    );

    const nose = `<path d="M224 366 Q240 358 256 366 Q251 384 240 389 Q229 384 224 366Z" fill="${shade(ink, 0.18)}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>`;
    const innerEars = pair(`<path d="${ear.inner}" fill="${accent}" opacity=".55"/>` +
      `<path d="${ear.inner}" fill="none" stroke="${ink}" stroke-width="5" stroke-linejoin="round" opacity=".9"/>` +
      `<g stroke="${ink}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".8">` +
      `<path d="M${ear.tick[0]} ${ear.tick[1]} l18 -6 l-8 15"/>` +
      `<path d="M${ear.tick[0] + 4} ${ear.tick[1] + 20} l18 -6 l-8 15"/>` +
      `<path d="M${ear.tick[0] + 8} ${ear.tick[1] + 40} l18 -6 l-8 15"/></g>`);
    const tufts = ear.tuft ? pair(`<g stroke="${ink}" stroke-width="5">${ear.tuft}</g>`) : '';
    const seam = `<path d="M240 ${SEAM_TOP + 6} V352" stroke="${ink}" stroke-width="2" opacity=".12"/>`;

    return `<clipPath id="maskClip"><path d="${shell}"/><path d="${shell}" transform="translate(480 0) scale(-1 1)"/></clipPath>` +
      `<pattern id="meshWeave" width="8" height="8" patternUnits="userSpaceOnUse">` +
      `<path d="M0 0H8M0 0V8" stroke="#17141a" stroke-width="3.2" opacity=".9" fill="none"/></pattern>` +
      `<linearGradient id="foxFade" x1="0" y1="1" x2="0" y2="0">` +
      `<stop offset="0" stop-color="${accent}" stop-opacity=".95"/><stop offset=".55" stop-color="${accent}" stop-opacity=".35"/>` +
      `<stop offset="1" stop-color="${accent}" stop-opacity="0"/></linearGradient>` +
      `<filter id="soften" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>` +
      ruff + earFur +
      `<path d="${shell}" fill="${coat}"/>${mirror(`<path d="${shell}" fill="${coat}"/>`)}` +
      modelling + snout + paint + tufts +
      `<path d="${contour}" fill="none" stroke="${ink}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>` +
      mirror(`<path d="${contour}" fill="none" stroke="${ink}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>`) +
      innerEars + seam + eyes + nose + maskTeethSvg(ink) + maskCharmSvg(ink);
  }

  /* Swap in a preset (or the look saved in mask mode) for one render pass. */
  function renderWith(overrides, draw){
    const saved = state;
    state = {...state, ...overrides};
    try { return draw(); } finally { state = saved; }
  }

  /* clipPath, pattern, gradient and filter never render on their own, so they
     travel with the artwork instead of needing a separate <defs> block. */
  function renderMask(){
    return backdropSvg() + maskStrapSvg() + maskArt() + frameSvg();
  }
  /* ---------- full character: a blank humanoid wearing therian gear ---------- */
  /* Therians are people, so the base is a person. Everything that reads as the
     theriotype — mask, ears, markings — is gear layered onto that base. */
  const SKIN_LINE = '#31292f';
  const OUTFIT_INK = '#2b2733';
  const BODY = {
    head:'M240 76 C296 76 328 116 328 168 C328 226 292 270 240 270 C188 270 152 226 152 168 C152 116 184 76 240 76Z',
    neck:'M216 252 L216 300 Q240 316 264 300 L264 252Z',
    torso:'M240 296 Q278 300 302 313 Q332 328 345 354 Q367 398 373 480 L107 480 Q113 398 135 354 Q148 328 178 313 Q202 300 240 296Z'
  };

  /* Six masks already painted, plus whatever is on the bench in mask mode. */
  const maskPresets = {
    fox:      {maskEars:'fox',  maskEyes:'sharp',  cheek:'spiky',  coat:'#ece5df', accent:'#fbf1e2', paint:'plain',    mesh:'#332e3a'},
    tabby:    {maskEars:'cat',  maskEyes:'almond', cheek:'spiky',  coat:'#9aa1a8', accent:'#fbf1e2', paint:'tabby',    mesh:'#e8a33d'},
    redfox:   {maskEars:'fox',  maskEyes:'sharp',  cheek:'shaggy', coat:'#c8622e', accent:'#fbf1e2', paint:'gradient', mesh:'#57b58b'},
    blackcat: {maskEars:'cat',  maskEyes:'narrow', cheek:'soft',   coat:'#4b4854', accent:'#5b5763', paint:'plain',    mesh:'#d95c58'},
    husky:    {maskEars:'wolf', maskEyes:'sharp',  cheek:'spiky',  coat:'#7f776b', accent:'#ced3d7', paint:'husky',    mesh:'#62a7d8'},
    lynx:     {maskEars:'lynx', maskEyes:'upturn', cheek:'shaggy', coat:'#e6c266', accent:'#fbf1e2', paint:'speckle',  mesh:'#9b7bd4'}
  };
  function maskConfig(){
    if (state.maskDesign === 'mine') return {};   // whatever mask mode is holding
    return {...(maskPresets[state.maskDesign] || maskPresets.fox), fur:'none', charm:'none', strap:'none'};
  }
  /* Worn over the face, or pushed up onto the forehead the way people rest them
     between shifts. The mask art is drawn in its own 480 space, so it is scaled
     about the point where the face sits. */
  function wornMaskSvg(){
    if (state.maskWear === 'none') return '';
    const onFace = state.maskWear === 'face';
    const place = onFace
      ? 'translate(240 205) scale(.46) translate(-240 -296)'
      : 'translate(240 146) rotate(-7) scale(.38) translate(-240 -296)';
    return `<g transform="${place}">${renderWith({...maskConfig(), fur:'none', charm:'none', strap:'none'}, maskArt)}</g>`;
  }

  const therianEars = {
    none:'',
    cat:  'M150 92 L128 20 Q127 8 141 18 L206 66Z|M160 84 L148 40 L192 68Z',
    fox:  'M148 96 L118 14 Q116 0 132 12 L206 68Z|M158 88 L140 34 L192 70Z',
    wolf: 'M150 92 Q130 38 142 12 Q152 -4 172 20 L208 70Z|M160 84 Q148 44 154 28 L194 72Z',
    bunny:'M172 96 Q142 8 152 -22 Q166 -44 188 -18 Q208 44 204 100Z|M178 90 Q156 18 162 -6 Q172 -22 184 -2 Q198 44 194 92Z',
    deer: 'M180 82 Q166 26 178 -8|M172 20 Q152 8 138 16|M176 48 Q156 40 144 50'
  };
  function therianEarsSvg(){
    const spec = therianEars[state.therianEars];
    if (!spec) return '';
    const fur = safe(state.earColor), inner = shade(fur, 0.34), line = lineFor(fur);
    if (state.therianEars === 'deer'){
      return pair(`<g transform="translate(26 14)" fill="none" stroke="#7a6047" stroke-width="12" stroke-linecap="round" stroke-linejoin="round">` +
        spec.split('|').map((d) => `<path d="${d}"/>`).join('') + `</g>`);
    }
    const [outer, innerPath] = spec.split('|');
    return pair(`<g transform="translate(26 14)"><path d="${outer}" fill="${fur}" stroke="${line}" stroke-width="7" stroke-linejoin="round"/>` +
      `<path d="${innerPath}" fill="${inner}"/></g>`);
  }

  const hairStyles = {
    none:   {back:'', front:''},
    long:   {back:'M240 44 Q128 48 118 156 Q108 268 122 420 L176 420 Q150 276 158 172 Q166 92 240 88 Q314 92 322 172 Q330 276 304 420 L358 420 Q372 268 362 156 Q352 48 240 44Z',
             front:'M140 148 Q152 56 240 52 Q328 56 340 148 Q322 100 292 122 Q278 76 246 104 Q240 62 214 106 Q186 78 176 128 Q156 112 140 148Z'},
    parted: {back:'M240 44 Q126 48 116 160 Q106 280 120 430 L172 430 Q146 288 154 176 Q162 96 240 92 Q318 96 326 176 Q334 288 308 430 L360 430 Q374 280 364 160 Q354 48 240 44Z',
             front:'M240 50 Q150 54 140 152 Q158 96 216 88 L232 60Z M240 50 Q330 54 340 152 Q322 96 264 88 L248 60Z'},
    bob:    {back:'M240 46 Q136 50 126 156 Q118 232 134 288 L182 276 Q158 214 164 168 Q172 96 240 92 Q308 96 316 168 Q322 214 298 276 L346 288 Q362 232 354 156 Q344 50 240 46Z',
             front:'M138 150 Q150 58 240 54 Q330 58 342 150 Q326 104 288 118 Q262 82 226 104 Q184 88 168 132 Q152 122 138 150Z'},
    shag:   {back:'M240 48 Q140 52 130 152 Q124 214 140 262 L184 250 Q164 202 170 166 Q178 98 240 94 Q302 98 310 166 Q316 202 296 250 L340 262 Q356 214 350 152 Q340 52 240 48Z',
             front:'M132 170 Q142 54 240 50 Q338 54 348 170 L322 118 L300 164 L278 108 L252 158 L240 100 L228 158 L202 108 L180 164 L158 118Z'},
    curly:  {back:'M240 40 Q132 44 118 150 Q106 244 138 296 L182 274 Q156 216 164 166 Q174 94 240 90 Q306 94 316 166 Q324 216 298 274 L342 296 Q374 244 362 150 Q348 44 240 40Z',
             front:'M132 168 Q126 128 148 118 Q150 78 186 76 Q204 48 240 54 Q276 48 294 76 Q330 78 332 118 Q354 128 348 168 Q330 138 306 150 Q296 116 268 124 Q252 98 226 122 Q198 108 178 140 Q152 138 132 168Z'},
    afro:   {back:'M240 26 Q128 26 112 132 Q100 226 152 268 L200 246 Q166 208 172 162 Q180 96 240 94 Q300 96 308 162 Q314 208 280 246 L328 268 Q380 226 368 132 Q352 26 240 26Z', front:''},
    twin:   {back:'M240 44 Q140 48 132 152 Q126 210 142 252 L182 244 Q166 200 172 168 Q180 96 240 92 Q300 96 308 168 Q314 200 298 244 L338 252 Q354 210 348 152 Q340 48 240 44Z' +
             'M120 172 Q78 196 76 268 Q76 336 116 348 Q152 340 146 292 Q142 232 152 190Z M360 172 Q402 196 404 268 Q404 336 364 348 Q328 340 334 292 Q338 232 328 190Z',
             front:'M138 152 Q150 56 240 52 Q330 56 342 152 Q322 104 286 120 Q258 84 224 106 Q186 90 170 134 Q152 124 138 152Z'},
    pony:   {back:'M240 44 Q142 48 134 154 Q130 200 142 236 L180 230 Q168 196 174 168 Q182 96 240 92 Q298 96 306 168 Q312 196 300 230 L338 236 Q350 200 346 154 Q338 48 240 44Z' +
             'M330 150 Q396 190 392 292 Q388 372 348 396 Q322 372 340 316 Q360 244 322 196Z',
             front:'M140 150 Q152 56 240 52 Q328 56 340 150 Q316 98 268 116 Q222 86 186 122 Q158 118 140 150Z'},
    wolfcut:{back:'M240 44 Q134 48 124 156 Q116 244 136 320 L182 306 Q160 236 166 170 Q176 96 240 92 Q304 96 314 170 Q320 236 298 306 L344 320 Q364 244 356 156 Q346 48 240 44Z',
             front:'M128 172 Q138 52 240 48 Q342 52 352 172 L330 126 L308 168 L286 114 L262 162 L240 106 L218 162 L194 114 L172 168 L150 126Z'},
    buzz:   {back:'', front:'M146 158 Q152 74 240 70 Q328 74 334 158 Q318 116 240 112 Q162 116 146 158Z'}
  };

  function bodyEyesSvg(){
    if (state.maskWear === 'face') return '';   // the mask is doing the looking
    const iris = safe(state.eyeColor);
    if (state.eyeStyle === 'closed')
      return pair(`<path d="M184 202 Q201 216 219 200" fill="none" stroke="${SKIN_LINE}" stroke-width="5.5" stroke-linecap="round"/>`);
    const shapes = {
      anime:'M182 200 C184 186 213 184 220 198 C222 212 211 222 201 222 C189 222 181 212 182 200Z',
      sharp:'M179 199 C186 184 216 182 222 196 C222 210 210 221 199 221 C185 221 178 210 179 199Z',
      soft: 'M184 203 C188 190 213 189 219 201 C221 213 211 221 202 221 C191 221 183 213 184 203Z',
      wide: 'M178 201 C179 184 209 179 221 194 C226 210 213 226 200 226 C185 226 177 214 178 201Z'
    };
    const shape = shapes[state.eyeStyle] || shapes.anime;
    return pair(`<path d="${shape}" fill="#fdfbf8" stroke="${SKIN_LINE}" stroke-width="4.5" stroke-linejoin="round"/>` +
      `<ellipse cx="201" cy="204" rx="11" ry="12.5" fill="${iris}"/>` +
      `<ellipse cx="201" cy="207" rx="5" ry="7" fill="#191621"/>` +
      `<circle cx="196" cy="198" r="4" fill="#fff"/><circle cx="207" cy="213" r="2.2" fill="#fff" opacity=".85"/>` +
      `<path d="${shape}" fill="none" stroke="${SKIN_LINE}" stroke-width="4.5" stroke-linejoin="round"/>` +
      `<path d="M180 196 C186 182 214 180 222 194" fill="none" stroke="${SKIN_LINE}" stroke-width="5.5" stroke-linecap="round"/>`);
  }
  function bodyMouthSvg(){
    if (state.maskWear === 'face') return '';
    const line = `fill="none" stroke="${SKIN_LINE}" stroke-width="5" stroke-linecap="round"`;
    const maps = {
      smile:`<path d="M228 240 Q240 250 252 240" ${line}/>`,
      grin:`<path d="M224 238 Q240 258 256 238 Q240 246 224 238Z" fill="#fdfbf8" stroke="${SKIN_LINE}" stroke-width="4.5" stroke-linejoin="round"/>`,
      fang:`<path d="M226 240 Q240 250 254 240" ${line}/><path d="M234 243 L237 253 L241 244Z" fill="#fdfbf8" stroke="${SKIN_LINE}" stroke-width="3"/>`,
      neutral:`<path d="M232 243 H248" ${line}/>`,
      open:`<path d="M230 236 Q240 238 250 236 Q247 256 240 257 Q233 256 230 236Z" fill="#4a2f3a" stroke="${SKIN_LINE}" stroke-width="4.5" stroke-linejoin="round"/>`,
      smug:`<path d="M228 244 Q244 248 255 238" ${line}/>`
    };
    return maps[state.expression] || maps.smile;
  }
  /* The reference marks blush as little hatched strokes, not soft airbrush. */
  function bodyMarkSvg(){
    const hatch = (x, y, c, n) => `<g stroke="${c}" stroke-width="6" stroke-linecap="round" opacity=".75">` +
      Array.from({length:n}, (_, i) => `<path d="M${x + i * 11} ${y} l-7 15"/>`).join('') + `</g>`;
    switch (state.marking){
      case 'blush': return pair(hatch(172, 218, '#e8879a', 3));
      case 'tearline': return pair(`<g stroke="#d94048" stroke-width="7" stroke-linecap="round"><path d="M190 224 l5 18"/><path d="M206 228 l5 18"/></g>`);
      case 'freckles': return pair(`<g fill="#c0806a" opacity=".75"><circle cx="180" cy="224" r="3.2"/><circle cx="194" cy="231" r="3.2"/><circle cx="207" cy="224" r="2.8"/><circle cx="199" cy="218" r="2.6"/></g>`);
      case 'stripes': return pair(`<g fill="${shade(safe(state.skin), -0.3)}" opacity=".6"><path d="M166 202 q16 6 26 2 q-14 12 -28 8Z"/><path d="M168 224 q16 6 26 2 q-14 12 -28 8Z"/></g>`);
      case 'theta': return `<g fill="none" stroke="${SKIN_LINE}" stroke-width="5" stroke-linejoin="round" opacity=".8">` +
        `<path d="M240 122 L255 150 H225Z"/><ellipse cx="240" cy="140" rx="14" ry="16"/><path d="M227 140 H253"/></g>`;
      case 'paw': return `<g fill="#d0798d" opacity=".8"><ellipse cx="296" cy="222" rx="8" ry="10"/>` +
        `<circle cx="285" cy="208" r="4"/><circle cx="296" cy="203" r="4"/><circle cx="307" cy="208" r="4"/></g>`;
      default: return '';
    }
  }

  function bodyOutfitSvg(){
    const line = `stroke="${SKIN_LINE}" stroke-width="7" stroke-linejoin="round"`;
    const accent = safe(state.accent);
    switch (state.outfit){
      case 'bare':
        return `<path d="${BODY.torso}" fill="${safe(state.skin)}" ${line}/>` +
          `<g fill="none" stroke="${SKIN_LINE}" stroke-width="5" stroke-linecap="round" opacity=".75">` +
          `<path d="M204 340 Q226 356 240 352"/><path d="M276 340 Q254 356 240 352"/></g>`;
      case 'tee':
        return `<path d="${BODY.torso}" fill="#3b3646" ${line}/>` +
          `<path d="M204 300 Q240 340 276 300 L288 314 Q240 362 192 314Z" fill="${accent}" opacity=".9" stroke="${SKIN_LINE}" stroke-width="5"/>` +
          `<g transform="translate(240 412)" fill="none" stroke="#e8e2d8" stroke-width="6" stroke-linejoin="round">` +
          `<circle r="32"/><path d="M0 -28 L24 15 H-24Z"/><path d="M-20 -2 H20"/></g>`;
      case 'jacket':
        return `<path d="${BODY.torso}" fill="#332f3c" ${line}/>` +
          `<path d="M240 302 L208 480 H272Z" fill="${accent}" opacity=".85" stroke="${SKIN_LINE}" stroke-width="5"/>` +
          `<path d="M198 308 L166 480 M282 308 L314 480" fill="none" stroke="${SKIN_LINE}" stroke-width="6"/>` +
          `<g fill="#cfd3d8" stroke="${SKIN_LINE}" stroke-width="2.5">` +
          [352,388,424,460].map((y) => `<circle cx="${(198 - (y - 352) * 0.2).toFixed(0)}" cy="${y}" r="6"/><circle cx="${(282 + (y - 352) * 0.2).toFixed(0)}" cy="${y}" r="6"/>`).join('') + `</g>`;
      case 'sweater':
        return `<path d="${BODY.torso}" fill="${shade(accent, -0.42)}" ${line}/>` +
          `<g stroke="${shade(accent, -0.22)}" stroke-width="5" fill="none" opacity=".8">` +
          `<path d="M112 386 Q240 410 368 386"/><path d="M106 420 Q240 444 374 420"/><path d="M102 452 Q240 472 378 452"/></g>` +
          `<path d="M206 296 Q240 330 274 296 L282 312 Q240 350 198 312Z" fill="${shade(accent, -0.55)}" stroke="${SKIN_LINE}" stroke-width="5"/>`;
      case 'overalls':
        return `<path d="${BODY.torso}" fill="#4a4657" ${line}/>` +
          `<path d="M188 340 Q240 372 292 340 L292 480 H188Z" fill="${accent}" opacity=".9" stroke="${SKIN_LINE}" stroke-width="6"/>` +
          `<path d="M196 300 L188 350 M284 300 L292 350" fill="none" stroke="${accent}" stroke-width="16" stroke-linecap="round"/>` +
          `<g fill="#cfd3d8" stroke="${SKIN_LINE}" stroke-width="2.5"><circle cx="196" cy="352" r="6"/><circle cx="284" cy="352" r="6"/></g>`;
      default:   /* hoodie */
        return `<path d="${BODY.torso}" fill="${OUTFIT_INK}" ${line}/>` +
          `<path d="M162 312 Q240 366 318 312 L332 338 Q240 400 148 338Z" fill="${shade(OUTFIT_INK, 0.18)}" stroke="${SKIN_LINE}" stroke-width="6" stroke-linejoin="round"/>` +
          `<g stroke="#ded6c9" stroke-width="7" stroke-linecap="round" fill="none"><path d="M214 356 Q206 398 214 434"/><path d="M266 356 Q274 398 266 434"/></g>` +
          `<circle cx="214" cy="438" r="7" fill="#ded6c9"/><circle cx="266" cy="438" r="7" fill="#ded6c9"/>`;
    }
  }

  function bodyNeckSvg(){
    const gold = '#e2a83f', goldDark = '#a9762a', band = '#26232e';
    switch (state.neck){
      case 'choker':
        return `<path d="M208 286 Q240 306 272 286 L272 302 Q240 324 208 302Z" fill="${band}" stroke="${SKIN_LINE}" stroke-width="5"/>` +
          `<g fill="#d9dde2" stroke="${SKIN_LINE}" stroke-width="2.5">` +
          [0,1,2,3].map((i) => { const x = 216 + i * 16, y = 310 + Math.sin((i - 1.5) * 0.7) * -5;
            return `<path d="M${x} ${y + 12} l7 -12 l-14 0Z"/>`; }).join('') + `</g>`;
      case 'bell':
        return `<path d="M208 286 Q240 306 272 286 L272 300 Q240 322 208 300Z" fill="#c8555f" stroke="${SKIN_LINE}" stroke-width="5"/>` +
          `<circle cx="240" cy="326" r="15" fill="${gold}" stroke="${SKIN_LINE}" stroke-width="4"/>` +
          `<path d="M228 324 H252" stroke="${goldDark}" stroke-width="4"/><circle cx="240" cy="331" r="3.6" fill="${goldDark}"/>`;
      case 'theta':
        return `<path d="M210 292 Q240 316 270 292" fill="none" stroke="${gold}" stroke-width="5"/>` +
          `<g fill="none" stroke="${gold}" stroke-width="5" stroke-linejoin="round" transform="translate(0 8)">` +
          `<path d="M240 320 L256 352 H224Z"/><ellipse cx="240" cy="340" rx="16" ry="18"/><path d="M225 340 H255"/></g>`;
      case 'chain':
        return `<g fill="none" stroke="#c9cdd4" stroke-width="5.5" stroke-linecap="round">` +
          `<path d="M210 290 Q240 316 270 290"/><path d="M202 296 Q240 340 278 296" stroke-width="4.5" stroke-dasharray="3 9"/></g>`;
      case 'bandana':
        return `<path d="M204 284 Q240 310 276 284 L282 300 Q240 334 198 300Z" fill="#c8555f" stroke="${SKIN_LINE}" stroke-width="5"/>` +
          `<path d="M222 312 Q240 326 258 312 L240 356Z" fill="#d9666f" stroke="${SKIN_LINE}" stroke-width="5" stroke-linejoin="round"/>`;
      case 'beads':
        return `<g>${[0,1,2,3,4,5].map((i) => { const t = i / 5, x = 210 + t * 60, y = 292 + Math.sin(t * Math.PI) * 22;
          const colors = ['#d97a6a','#e2a83f','#7fae6d','#6a9fd4','#a883cc','#d97a6a'];
          return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="8" fill="${colors[i]}" stroke="${SKIN_LINE}" stroke-width="3"/>`; }).join('')}</g>`;
      default: return '';
    }
  }

  function renderCharacter(){
    const skin = safe(state.skin);
    const hair = hairStyles[state.hair] || hairStyles.none;
    const hairColor = safe(state.hairColor), hairLift = shade(hairColor, 0.3);
    const hairLine = `stroke="${lineFor(hairColor)}" stroke-width="7" stroke-linejoin="round"`;
    const body = `stroke="${SKIN_LINE}" stroke-width="7" stroke-linejoin="round"`;

    const shading = `<g clip-path="url(#skinClip)">` +
      `<path d="M302 60 Q332 140 316 220 Q300 268 260 288 L420 292 L420 40Z" fill="${shade(skin, -0.3)}" opacity=".26"/></g>`;

    return `<clipPath id="skinClip"><path d="${BODY.head}"/></clipPath>` +
      backdropSvg() +
      (hair.back ? `<g transform="translate(0 18)"><path d="${hair.back}" fill="${hairColor}" ${hairLine}/></g>` : '') +
      bodyOutfitSvg() +
      `<path d="${BODY.neck}" fill="${shade(skin, -0.1)}" ${body}/>` +
      bodyNeckSvg() +
      `<path d="${BODY.head}" fill="${skin}" ${body}/>` + shading +
      bodyEyesSvg() + bodyMouthSvg() + bodyMarkSvg() +
      (hair.front ? `<g transform="translate(0 18)"><path d="${hair.front}" fill="${hairColor}" ${hairLine}/>` +
        `<path d="M168 128 Q240 100 312 128" fill="none" stroke="${hairLift}" stroke-width="9" stroke-linecap="round" opacity=".55"/></g>` : '') +
      therianEarsSvg() + wornMaskSvg() +
      frameSvg();
  }

  /* ---------- render ---------- */
  function labelOf(group, value){ return (options[group].find(([key]) => key === value) || [])[1] || ''; }
  function colorName(paletteKey, value){ return (palettes[paletteKey].find((item) => item.value === value) || {}).name || ''; }
  function lower(text){ return String(text).toLowerCase(); }

  /* Reads the state back as a plain sentence — the recipe you would carry to
     the craft table, rather than a label announcing that a recipe exists.
     A few tile labels are terse for a 12px tile and clumsy in a sentence, so
     those get a prose form. */
  const prose = {
    outfit:{hoodie:'a hood pulled up', hoodiedown:'a hoodie', tee:'a band tee', jacket:'a studded jacket', sweater:'a cozy sweater', harness:'a harness'},
    neck:{choker:'a spiked choker', bell:'a bell collar', theta:'a theta-delta pendant', chain:'layered chains', bandana:'a bandana', beads:'a beaded collar'},
    fur:{cheeks:'cheek tufts', ruff:'a full ruff', ears:'ear fluff', full:'a ruff with ear fluff'},
    fangs:{fangs:'two fangs', teeth:'a full row of teeth', tongue:'a cheeky tongue'},
    charm:{flowers:'a flower crown', leaves:'a leaf sprig', moonc:'a moon charm', bell:'a bell', cuff:'an ear cuff', feather:'a feather'},
    hair:{none:'', buzz:'buzzed', bob:'a bob of', shag:'shaggy', long:'long', parted:'curtained',
          curly:'curly', afro:'an afro of', twin:'twin-tailed', pony:'a ponytail of', wolfcut:'wolf-cut'},
    outfit:{hoodie:'a hoodie', tee:'a band tee', jacket:'a studded jacket', sweater:'a cozy sweater',
            overalls:'overalls', bare:'bare shoulders'}
  };
  function say(group, value){ return prose[group]?.[value] ?? lower(labelOf(group, value)); }
  function article(word){ return /^[aeiou]/i.test(String(word)) ? 'an' : 'a'; }

  function joinParts(parts){
    const kept = parts.filter(Boolean);
    if (kept.length < 2) return kept[0] || '';
    return `${kept.slice(0, -1).join(', ')} and ${kept[kept.length - 1]}`;
  }
  function buildSentence(){
    if (state.mode === 'full'){
      const traits = joinParts([
        state.hair === 'none' ? 'a shaved head' : `${say('hair', state.hair)} ${lower(colorName('hair', state.hairColor))} hair`,
        state.marking === 'none' ? '' : lower(labelOf('marking', state.marking))
      ]);
      const gear = joinParts([
        state.maskWear === 'none' ? '' : `${lower(labelOf('maskDesign', state.maskDesign))} mask ${state.maskWear === 'up' ? 'pushed up' : 'over the face'}`,
        state.therianEars === 'none' ? '' : `${lower(labelOf('therianEars', state.therianEars))} ears`,
        say('outfit', state.outfit),
        state.neck === 'none' ? '' : say('neck', state.neck)
      ]);
      return `Someone with ${traits}, wearing ${gear}.`;
    }
    const coat = lower(colorName('coat', state.coat));
    const paint = lower(labelOf('paint', state.paint));
    const parts = `${lower(labelOf('maskEars', state.maskEars))} ears and ${lower(labelOf('maskEyes', state.maskEyes))} eye cut-outs`;
    const lead = state.paint === 'plain'
      ? `A blank with ${parts}, left plain ${coat}`
      : `A blank with ${parts}, painted ${coat} with ${paint.endsWith('s') ? '' : article(paint) + ' '}${paint}`;
    const rest = joinParts([
      `${lower(colorName('mesh', state.mesh))} mesh behind them`,
      state.fur === 'none' ? '' : say('fur', state.fur) + ` in ${lower(colorName('fur', state.furColor))}`,
      state.fangs === 'none' ? '' : say('fangs', state.fangs),
      state.charm === 'none' ? '' : say('charm', state.charm)
    ]);
    return `${lead}, ${rest}.`;
  }
  function renderBuildNote(){ buildNote.textContent = buildSentence(); }

  function renderAvatar(){
    avatar.innerHTML = state.mode === 'full' ? renderCharacter() : renderMask();
    avatar.setAttribute('aria-label', `${state.mode === 'full' ? 'Cartoon therian portrait' : 'Therian mask design'}. ${buildSentence()}`);
  }

  function renderTabs(){
    const list = categories[state.mode];
    if (!list.some(([key]) => key === activeCategory)) activeCategory = list[0][0];
    categoryTabs.innerHTML = list.map(([key, label]) => {
      const selected = activeCategory === key;
      return `<button class="category-tab" data-category="${key}" role="tab" type="button"` +
        ` aria-selected="${selected}" tabindex="${selected ? 0 : -1}">${label}</button>`;
    }).join('');
    const active = list.find(([key]) => key === activeCategory);
    optionPanel.setAttribute('aria-label', active ? active[1] : 'Options');
  }

  function tileGroup(title, intro, key, items){
    return `<h3 class="option-title">${title}</h3><p class="option-intro">${intro}</p><div class="option-grid">` +
      items.map(([value, label, icon]) =>
        `<button type="button" class="choice-tile" data-key="${key}" data-value="${value}" aria-pressed="${state[key] === value}">` +
        `<span class="tile-icon">${icon}</span><span>${label}</span></button>`).join('') + '</div>';
  }
  function colorGroup(title, intro, paletteKey, stateKey){
    return `<h3 class="option-title">${title}</h3><p class="option-intro">${intro}</p><div class="color-row">` +
      palettes[paletteKey].map(({name, value}) =>
        `<button type="button" class="color-choice" data-key="${stateKey}" data-value="${value}" aria-label="${name}" title="${name}" aria-pressed="${state[stateKey] === value}">` +
        `<span style="background:${value}"></span></button>`).join('') + '</div>';
  }
  const gap = '<div class="option-gap"></div>';

  function renderPanel(){
    const groups = {
      shape: () => tileGroup('Ears', 'The shell is one blank; the ears are what make it yours.', 'maskEars', options.maskEars) + gap +
        tileGroup('Cheek ruff', 'How jagged the fur edge is cut along the sides.', 'cheek', options.cheek),
      paint: () => colorGroup('Base coat', 'The colour you prime the whole blank with.', 'coat', 'coat') + gap +
        colorGroup('Inner ears & snout', 'Contrast paint for the ear insides and the muzzle.', 'accent', 'accent') + gap +
        tileGroup('Painted markings', 'Tabby stripes, husky masks, scars, sigils — the classics.', 'paint', options.paint),
      eyes: () => tileGroup('Cut-out shape', 'The holes you actually see through.', 'maskEyes', options.maskEyes) + gap +
        colorGroup('Eye mesh', 'Craft mesh glued behind the cut-outs — you see out, nobody sees in.', 'mesh', 'mesh'),
      fur: () => tileGroup('Fur trim', 'Short-pile faux fur glued around the edge is the classic finish.', 'fur', options.fur) + gap +
        colorGroup('Fur colour', 'Match your coat or contrast it.', 'fur', 'furColor'),
      extras: () => tileGroup('Teeth', 'Painted or sculpted along the bottom edge.', 'fangs', options.fangs) + gap +
        tileGroup('Charms', 'Flowers, leaves, moons, bells — gear people actually add.', 'charm', options.charm) + gap +
        tileGroup('Strap', 'How it stays on during quadrobics.', 'strap', options.strap) + gap +
        colorGroup('Backdrop', 'The colour behind your mask.', 'backdrop', 'backdrop'),
      body: () => colorGroup('Skin tone', 'Pick the one that looks like you, or does not.', 'skin', 'skin') + gap +
        tileGroup('Face markings', 'Blush, tear lines, freckles, a paw print, a theta-delta.', 'marking', options.marking),
      gear: () => tileGroup('Mask', 'Wear one already painted, or the one on your bench.', 'maskDesign', options.maskDesign) + gap +
        tileGroup('How you wear it', 'Over the face, or pushed up between shifts.', 'maskWear', options.maskWear) + gap +
        tileGroup('Therian ears', 'Clip-on ears and antlers.', 'therianEars', options.therianEars) + gap +
        colorGroup('Ear colour', 'Match the mask or contrast it.', 'coat', 'earColor'),
      hair: () => tileGroup('Hairstyle', 'Eleven cuts, from shaved to a wolf cut.', 'hair', options.hair) + gap +
        colorGroup('Hair colour', 'Go loud.', 'hair', 'hairColor'),
      face: () => tileGroup('Eyes', 'Hidden when the mask is down.', 'eyeStyle', options.eyeStyle) + gap +
        colorGroup('Eye colour', 'Pick an iris.', 'eye', 'eyeColor') + gap +
        tileGroup('Expression', 'How they are feeling today.', 'expression', options.expression),
      wear: () => tileGroup('Outfit', 'Hoodies, studs, knits, and overalls.', 'outfit', options.outfit) + gap +
        tileGroup('Neckwear', 'Chokers, bells, beads, theta-delta pendants.', 'neck', options.neck),
      scene: () => colorGroup('Backdrop', 'A flat panel with halftone dots, like a sticker print.', 'backdrop', 'backdrop')
    };
    optionPanel.innerHTML = (groups[activeCategory] || groups.shape)();
  }

  function syncModeUI(){
    const isFull = state.mode === 'full';
    $('#modeText').textContent = isFull ? 'Full character' : 'Therian mask';
    $('#modeIcon').textContent = isFull ? '☺' : '◒';
    $('#creatorTitle').textContent = isFull ? 'Full character' : 'Therian mask';
    $('#creatorLead').textContent = isFull
      ? 'Draw a chest-up portrait of your theriotype.'
      : 'Start from a moulded blank, then paint it.';
  }

  function render(){syncModeUI();renderTabs();renderPanel();renderAvatar();renderBuildNote();}

  function setMode(mode){
    state.mode = mode;
    activeCategory = categories[mode][0][0];
    saveState();
    render();
  }

  function characterSummary(){
    return state.mode === 'full'
      ? `My therian character from Kindred Studio`
      : `My therian mask design from Kindred Studio`;
  }
  function avatarSvg(){ return avatar.outerHTML.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"'); }
  function fileName(){
    return state.mode === 'full'
      ? `kindred-character-${state.therianEars}.svg`
      : `kindred-mask-${state.maskEars}.svg`;
  }
  function downloadAvatar(){
    const blob = new Blob([avatarSvg()], {type:'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName();
    link.click();
    URL.revokeObjectURL(url);
  }
  async function shareCharacter(){
    const file = new File([avatarSvg()], fileName(), {type:'image/svg+xml'});
    const shareData = {title:'My Kindred Studio therian design', text:characterSummary(), files:[file]};
    try {
      if (navigator.canShare?.(shareData)) { await navigator.share(shareData); return; }
      if (!navigator.canShare && navigator.share) { await navigator.share(shareData); return; }
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
    $('#shareDialog').showModal();
  }

  /* The one piece of motion: the preview acknowledges the tap that changed it. */
  function settlePreview(){
    avatar.classList.remove('settle');
    void avatar.offsetWidth;
    avatar.classList.add('settle');
    setTimeout(() => avatar.classList.remove('settle'), 220);
  }

  function selectCategory(key, focusTab){
    activeCategory = key;
    render();
    if (focusTab) categoryTabs.querySelector('[aria-selected="true"]')?.focus();
  }
  categoryTabs.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (button) selectCategory(button.dataset.category, false);
  });
  categoryTabs.addEventListener('keydown', (event) => {
    const step = {ArrowRight:1, ArrowLeft:-1, Home:'first', End:'last'}[event.key];
    if (!step) return;
    event.preventDefault();
    const keys = categories[state.mode].map(([key]) => key);
    const at = keys.indexOf(activeCategory);
    const next = step === 'first' ? 0 : step === 'last' ? keys.length - 1 : (at + step + keys.length) % keys.length;
    selectCategory(keys[next], true);
  });
  optionPanel.addEventListener('click', (event) => {
    const button = event.target.closest('[data-key]');
    if (!button) return;
    state[button.dataset.key] = button.dataset.value;
    saveState();
    render();
    settlePreview();
  });
  $('#modeSwitch').addEventListener('click', () => $('#modeDialog').showModal());
  document.querySelectorAll('.mode-choice').forEach((button) =>
    button.addEventListener('click', () => { setMode(button.dataset.mode); $('#modeDialog').close(); }));
  $('#helpButton').addEventListener('click', () => $('#infoDialog').showModal());
  $('#resetButton').addEventListener('click', () => { state = {...defaults, mode:state.mode}; saveState(); render(); });
  $('#shareButton').addEventListener('click', shareCharacter);
  $('#shareDownloadButton').addEventListener('click', downloadAvatar);
  $('#downloadButton').addEventListener('click', downloadAvatar);
  render();

  /* Offline support. Service workers need a secure context, so this quietly does
     nothing over plain http on a LAN address — the app still works, just online. */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
})();
