/* ---------- SPRITE: render pixel character from a string grid ---------- */
const PALETTE = {
  '.': null,                  // transparent
  'O': '#000000',             // outline
  'H': '#5a3818',             // hair main brown
  'h': '#3a2410',             // hair shadow
  'B': '#4d2f1a',             // beard main
  'b': '#3a2410',             // beard shadow
  's': '#f0c89e',             // skin light
  'S': '#d4a373',             // skin shadow
  'e': '#ffffff',             // eye white
  'E': '#1a1408',             // eye pupil
  'G': '#5a7041',             // shirt military green
  'g': '#3d4d2c',             // shirt shadow
  'V': '#48623a',             // shirt mid (vertical seam)
  'D': '#3a2410',             // belt
  'd': '#2a1808',             // belt buckle
  'Y': '#f8d030',             // buckle highlight
  'J': '#3d5c80',             // jeans main
  'j': '#243c5a',             // jeans shadow
  'p': '#1a2638',             // jeans deep shadow
  'K': '#2a1a0c',             // boot main
  'k': '#1a0f08',             // boot shadow
  'T': '#e0b88e',             // hand skin
};

/* IDLE pose — 14 wide x 26 tall */
const IDLE = `
..............
.....OOOO.....
....OHHHHHO...
...OHhHhHHHO..
...OHsSsSSHO..
...OseEeEsSO..
...OSssSSsSO..
...OBSbBbSBO..
...OBBBBBBBO..
....OBBBBBO...
.....OBBBO....
.....OGGGO....
....OGGgGGO...
...OTGGgGGTO..
...OTGgVgGTO..
...OTGgVgGTO..
....OGGgGGO...
....OGGGGGO...
....ODYDYDO...
....OJJjJJO...
....OJjpjJO...
....OJj.jJO...
....OJj.jJO...
....OK..KO....
....OkOOkO....
.....OOOO.....
`;

/* WALK_A — left leg forward, right leg back, slight bob up */
const WALK_A = `
..............
.....OOOO.....
....OHHHHHO...
...OHhHhHHHO..
...OHsSsSSHO..
...OseEeEsSO..
...OSssSSsSO..
...OBSbBbSBO..
...OBBBBBBBO..
....OBBBBBO...
.....OBBBO....
.....OGGGO....
....OGGgGGO...
....OGGgGGO...  (arms shifted)
...OTGgVgGTO..
....OGgVgGO...
....OGGgGGO...
....OGGGGGO...
....ODYDYDO...
...OJJjJJ.O...
..OJj.jJ..O...   (left leg forward)
..OJ.....O....
..OK.....O....
..OkOO..O.....
...OOO..OOO...
.........OO...
`;

/* WALK_B — right leg forward */
const WALK_B = `
..............
.....OOOO.....
....OHHHHHO...
...OHhHhHHHO..
...OHsSsSSHO..
...OseEeEsSO..
...OSssSSsSO..
...OBSbBbSBO..
...OBBBBBBBO..
....OBBBBBO...
.....OBBBO....
.....OGGGO....
....OGGgGGO...
....OGGgGGO...
...OTGgVgGTO..
....OGgVgGO...
....OGGgGGO...
....OGGGGGO...
....ODYDYDO...
...OJJjJJ.O...
....OJj.JJjO..    (right leg forward)
.....O.....JO.
.....O.....KO.
.....O....OkO.
......OOO.OO..
......OO......
`;

function renderSprite(gridStr, pixel = 4) {
  const rows = gridStr.trim().split('\n');
  const w = Math.max(...rows.map(r => r.length));
  const h = rows.length;
  const rects = [];
  for (let y = 0; y < h; y++) {
    const row = rows[y].padEnd(w, '.');
    for (let x = 0; x < w; x++) {
      const c = row[x];
      const color = PALETTE[c];
      if (color) rects.push(`<rect x="${x*pixel}" y="${y*pixel}" width="${pixel}" height="${pixel}" fill="${color}"/>`);
    }
  }
  return `<svg viewBox="0 0 ${w*pixel} ${h*pixel}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" width="${w*pixel}" height="${h*pixel}">${rects.join('')}</svg>`;
}

const SPRITES = {
  idle: renderSprite(IDLE),
  walkA: renderSprite(WALK_A),
  walkB: renderSprite(WALK_B),
};

const heroEl = document.getElementById('hero');
heroEl.innerHTML = SPRITES.idle;

/* ---------- WORLD: parallax content (clouds, trees, buildings, etc) ---------- */
/* We render each parallax layer as a wide horizontally-tiled SVG. */

function svgCanvas(viewW, viewH, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewW} ${viewH}" preserveAspectRatio="xMinYEnd meet" width="${viewW}px" height="100%" shape-rendering="crispEdges">${body}</svg>`;
}

/* ---------- CLOUDS (far layer) ---------- */
function makeClouds() {
  const w = 4800, h = 240;
  const cloudShape = (cx, cy, scale = 1, color = '#ffffff') => {
    const s = scale;
    return `
      <g fill="${color}" opacity=".88">
        <rect x="${cx}"     y="${cy+10*s}" width="${48*s}" height="${10*s}"/>
        <rect x="${cx+8*s}" y="${cy}" width="${36*s}" height="${20*s}"/>
        <rect x="${cx+16*s}" y="${cy-6*s}" width="${20*s}" height="${10*s}"/>
        <rect x="${cx+4*s}"  y="${cy+4*s}" width="${44*s}" height="${4*s}" fill="#e8e8f0"/>
      </g>`;
  };
  let body = '';
  for (let i = 0; i < 12; i++) {
    const x = (i * 420) + (i % 3) * 60;
    const y = 30 + (i % 4) * 35;
    const s = 1 + (i % 3) * 0.4;
    body += cloudShape(x, y, s);
  }
  return svgCanvas(w, h, body);
}

/* ---------- FAR MOUNTAINS ---------- */
function makeMountains() {
  const w = 4800, h = 300;
  let body = '';
  /* layered pixel mountains */
  for (let i = 0; i < 10; i++) {
    const baseX = i * 480;
    const peakH = 120 + (i % 4) * 40;
    const c1 = '#5a78a0';
    const c2 = '#4060a0';
    const c3 = '#2a4080';
    body += `
      <polygon points="${baseX},${h} ${baseX+120},${h-peakH} ${baseX+240},${h-peakH+40} ${baseX+360},${h-peakH+10} ${baseX+480},${h}" fill="${c2}"/>
      <polygon points="${baseX+120},${h-peakH} ${baseX+150},${h-peakH+40} ${baseX+90},${h-peakH+50}" fill="${c3}"/>
      <polygon points="${baseX+240},${h-peakH+40} ${baseX+260},${h-peakH+70} ${baseX+220},${h-peakH+70}" fill="#ffffff" opacity=".7"/>
    `;
  }
  return svgCanvas(w, h, body);
}

/* ---------- MID: Trees / Buildings (zoned along the path) ---------- */
function makeMid() {
  const w = 4800, h = 280;
  let body = '';
  /* Zone 0-1000: dense forest (trees) */
  for (let i = 0; i < 6; i++) {
    const x = 60 + i * 160;
    body += tree(x, h, 1.2 + (i%2)*0.3);
  }
  /* Zone 1000-2000: village houses */
  for (let i = 0; i < 4; i++) {
    body += house(1080 + i * 220, h, 1 + (i%2)*0.15);
  }
  /* Zone 2000-3000: workshop area (forge + tool sheds) */
  body += workshop(2120, h);
  body += workshop(2520, h, 'forge2');
  /* Zone 3000-4000: library (tall building w/ books) */
  body += library(3100, h);
  body += library(3520, h);
  /* Zone 4000-4800: crossroads + signpost + sunset trees */
  for (let i = 0; i < 4; i++) {
    body += tree(4080 + i * 160, h, 1 + (i%2)*0.2, '#3a4020', '#243010');
  }
  body += signpost(4380, h);
  return svgCanvas(w, h, body);
}

function tree(x, baseY, scale = 1, leafC = '#3a6020', leafC2 = '#2a4818', trunkC = '#3a2410') {
  const s = scale, w = 80*s, top = baseY - 200*s;
  return `
    <g>
      <rect x="${x + 30*s}" y="${baseY - 80*s}" width="${20*s}" height="${80*s}" fill="${trunkC}"/>
      <rect x="${x + 32*s}" y="${baseY - 80*s}" width="${4*s}" height="${80*s}" fill="#1a1006"/>
      <!-- leaves -->
      <rect x="${x + 16*s}" y="${baseY - 160*s}" width="${48*s}" height="${20*s}" fill="${leafC}"/>
      <rect x="${x + 8*s}"  y="${baseY - 140*s}" width="${64*s}" height="${20*s}" fill="${leafC}"/>
      <rect x="${x + 4*s}"  y="${baseY - 120*s}" width="${72*s}" height="${20*s}" fill="${leafC}"/>
      <rect x="${x + 12*s}" y="${baseY - 100*s}" width="${56*s}" height="${20*s}" fill="${leafC}"/>
      <!-- shading -->
      <rect x="${x + 50*s}" y="${baseY - 140*s}" width="${14*s}" height="${44*s}" fill="${leafC2}"/>
      <rect x="${x + 56*s}" y="${baseY - 110*s}" width="${10*s}" height="${10*s}" fill="${leafC2}"/>
      <rect x="${x + 16*s}" y="${baseY - 152*s}" width="${10*s}" height="${10*s}" fill="${leafC2}" opacity=".4"/>
    </g>
  `;
}

function house(x, baseY, scale = 1) {
  const s = scale;
  return `
    <g>
      <!-- walls -->
      <rect x="${x}" y="${baseY - 140*s}" width="${160*s}" height="${110*s}" fill="#d8b070"/>
      <rect x="${x}" y="${baseY - 140*s}" width="${160*s}" height="${6*s}" fill="#a87830"/>
      <rect x="${x}" y="${baseY - 36*s}" width="${160*s}" height="${6*s}" fill="#8a5818"/>
      <!-- roof -->
      <polygon points="${x - 10},${baseY - 140*s} ${x + 80*s},${baseY - 200*s} ${x + 170*s},${baseY - 140*s}" fill="#7a2818"/>
      <polygon points="${x - 10},${baseY - 140*s} ${x + 80*s},${baseY - 200*s} ${x + 80*s},${baseY - 190*s} ${x},${baseY - 140*s}" fill="#5a1808"/>
      <!-- door -->
      <rect x="${x + 60*s}" y="${baseY - 100*s}" width="${36*s}" height="${70*s}" fill="#5a3818"/>
      <rect x="${x + 90*s}" y="${baseY - 70*s}" width="${4*s}" height="${4*s}" fill="#f8d030"/>
      <!-- window -->
      <rect x="${x + 16*s}" y="${baseY - 110*s}" width="${30*s}" height="${24*s}" fill="#3a5070"/>
      <rect x="${x + 30*s}" y="${baseY - 110*s}" width="${2*s}" height="${24*s}" fill="#8a5818"/>
      <rect x="${x + 16*s}" y="${baseY - 98*s}" width="${30*s}" height="${2*s}" fill="#8a5818"/>
      <rect x="${x + 116*s}" y="${baseY - 110*s}" width="${30*s}" height="${24*s}" fill="#3a5070"/>
      <rect x="${x + 130*s}" y="${baseY - 110*s}" width="${2*s}" height="${24*s}" fill="#8a5818"/>
      <rect x="${x + 116*s}" y="${baseY - 98*s}" width="${30*s}" height="${2*s}" fill="#8a5818"/>
      <!-- chimney + smoke -->
      <rect x="${x + 116*s}" y="${baseY - 190*s}" width="${20*s}" height="${30*s}" fill="#6a4828"/>
      <circle cx="${x + 126*s}" cy="${baseY - 200*s}" r="${6*s}" fill="#ffffff" opacity=".7"/>
      <circle cx="${x + 134*s}" cy="${baseY - 214*s}" r="${8*s}" fill="#ffffff" opacity=".6"/>
      <circle cx="${x + 140*s}" cy="${baseY - 230*s}" r="${10*s}" fill="#ffffff" opacity=".5"/>
    </g>
  `;
}

function workshop(x, baseY) {
  return `
    <g>
      <!-- main building dark wood -->
      <rect x="${x}" y="${baseY - 140}" width="${200}" height="${110}" fill="#4a3018"/>
      <rect x="${x}" y="${baseY - 140}" width="${200}" height="${8}" fill="#2a1808"/>
      <!-- big workshop window (orange glow) -->
      <rect x="${x + 30}" y="${baseY - 110}" width="${60}" height="${50}" fill="#f08020"/>
      <rect x="${x + 30}" y="${baseY - 110}" width="${60}" height="${50}" fill="url(#noFill)" stroke="#000" stroke-width="3"/>
      <rect x="${x + 58}" y="${baseY - 110}" width="${4}" height="${50}" fill="#2a1808"/>
      <rect x="${x + 30}" y="${baseY - 88}" width="${60}" height="${4}" fill="#2a1808"/>
      <!-- door -->
      <rect x="${x + 120}" y="${baseY - 110}" width="${50}" height="${80}" fill="#2a1808"/>
      <rect x="${x + 160}" y="${baseY - 78}" width="${4}" height="${4}" fill="#f8d030"/>
      <!-- roof: pitched dark gray slate -->
      <polygon points="${x - 14},${baseY - 140} ${x + 100},${baseY - 200} ${x + 214},${baseY - 140}" fill="#3a3a40"/>
      <polygon points="${x - 14},${baseY - 140} ${x + 100},${baseY - 200} ${x + 100},${baseY - 190} ${x - 4},${baseY - 140}" fill="#1a1a20"/>
      <!-- big anvil chimney -->
      <rect x="${x + 30}" y="${baseY - 200}" width="${24}" height="${40}" fill="#1a1a20"/>
      <!-- smoke -->
      <circle cx="${x + 42}" cy="${baseY - 210}" r="6" fill="#888" opacity=".7"/>
      <circle cx="${x + 50}" cy="${baseY - 226}" r="10" fill="#888" opacity=".55"/>
      <circle cx="${x + 60}" cy="${baseY - 250}" r="14" fill="#aaa" opacity=".4"/>
    </g>
  `;
}

function library(x, baseY) {
  return `
    <g>
      <!-- tall stone building -->
      <rect x="${x}" y="${baseY - 220}" width="${180}" height="${190}" fill="#9a9094"/>
      <rect x="${x}" y="${baseY - 220}" width="${180}" height="${8}" fill="#6a6064"/>
      <!-- stripe of stone joints -->
      <rect x="${x}" y="${baseY - 140}" width="${180}" height="${3}" fill="#6a6064"/>
      <rect x="${x}" y="${baseY - 80}" width="${180}" height="${3}" fill="#6a6064"/>
      <!-- arched door -->
      <rect x="${x + 70}" y="${baseY - 90}" width="${44}" height="${60}" fill="#2a1808"/>
      <rect x="${x + 70}" y="${baseY - 100}" width="${44}" height="${10}" fill="#2a1808"/>
      <rect x="${x + 92}" y="${baseY - 60}" width="${4}" height="${4}" fill="#f8d030"/>
      <!-- two tall windows -->
      <rect x="${x + 20}" y="${baseY - 200}" width="${30}" height="${80}" fill="#1a2638"/>
      <rect x="${x + 130}" y="${baseY - 200}" width="${30}" height="${80}" fill="#1a2638"/>
      <rect x="${x + 33}" y="${baseY - 200}" width="${4}" height="${80}" fill="#6a6064"/>
      <rect x="${x + 143}" y="${baseY - 200}" width="${4}" height="${80}" fill="#6a6064"/>
      <rect x="${x + 20}" y="${baseY - 162}" width="${30}" height="${4}" fill="#6a6064"/>
      <rect x="${x + 130}" y="${baseY - 162}" width="${30}" height="${4}" fill="#6a6064"/>
      <!-- roof: peaked -->
      <polygon points="${x - 14},${baseY - 220} ${x + 90},${baseY - 290} ${x + 194},${baseY - 220}" fill="#5a2818"/>
      <polygon points="${x - 14},${baseY - 220} ${x + 90},${baseY - 290} ${x + 90},${baseY - 280} ${x - 4},${baseY - 220}" fill="#3a1808"/>
      <!-- small book stack on a shelf in window -->
      <rect x="${x + 22}" y="${baseY - 130}" width="${8}" height="${10}" fill="#f04040"/>
      <rect x="${x + 32}" y="${baseY - 132}" width="${8}" height="${12}" fill="#4080f0"/>
      <rect x="${x + 42}" y="${baseY - 128}" width="${6}" height="${8}" fill="#f8d030"/>
      <rect x="${x + 132}" y="${baseY - 130}" width="${8}" height="${10}" fill="#58c850"/>
      <rect x="${x + 142}" y="${baseY - 132}" width="${8}" height="${12}" fill="#f08020"/>
      <rect x="${x + 152}" y="${baseY - 128}" width="${6}" height="${8}" fill="#aa40c8"/>
    </g>
  `;
}

function signpost(x, baseY) {
  return `
    <g>
      <!-- post -->
      <rect x="${x}" y="${baseY - 180}" width="${14}" height="${150}" fill="#5a3a1f"/>
      <rect x="${x + 2}" y="${baseY - 180}" width="${4}" height="${150}" fill="#3a2410"/>
      <!-- left arrow plank -->
      <polygon points="${x - 80},${baseY - 170} ${x},${baseY - 170} ${x},${baseY - 140} ${x - 80},${baseY - 140} ${x - 100},${baseY - 155}" fill="#7a5028"/>
      <polygon points="${x - 80},${baseY - 170} ${x},${baseY - 170} ${x},${baseY - 165} ${x - 80},${baseY - 165}" fill="#a87838"/>
      <!-- right arrow plank -->
      <polygon points="${x + 14},${baseY - 130} ${x + 94},${baseY - 130} ${x + 114},${baseY - 115} ${x + 94},${baseY - 100} ${x + 14},${baseY - 100}" fill="#7a5028"/>
      <polygon points="${x + 14},${baseY - 130} ${x + 94},${baseY - 130} ${x + 94},${baseY - 125} ${x + 14},${baseY - 125}" fill="#a87838"/>
      <!-- text marks -->
      <rect x="${x - 70}" y="${baseY - 160}" width="${4}" height="${4}" fill="#1a1000"/>
      <rect x="${x - 60}" y="${baseY - 160}" width="${4}" height="${4}" fill="#1a1000"/>
      <rect x="${x - 50}" y="${baseY - 160}" width="${4}" height="${4}" fill="#1a1000"/>
      <rect x="${x - 40}" y="${baseY - 160}" width="${4}" height="${4}" fill="#1a1000"/>
      <rect x="${x + 24}" y="${baseY - 118}" width="${4}" height="${4}" fill="#1a1000"/>
      <rect x="${x + 34}" y="${baseY - 118}" width="${4}" height="${4}" fill="#1a1000"/>
      <rect x="${x + 44}" y="${baseY - 118}" width="${4}" height="${4}" fill="#1a1000"/>
      <rect x="${x + 54}" y="${baseY - 118}" width="${4}" height="${4}" fill="#1a1000"/>
    </g>
  `;
}

/* ---------- NEAR LAYER: grass blades, bushes, small props on the foreground ---------- */
function makeNear() {
  const w = 4800, h = 200;
  let body = '';
  for (let i = 0; i < 60; i++) {
    const x = i * 80 + (i % 3) * 12;
    const yBase = h - 16;
    const tall = 6 + (i % 4) * 4;
    /* grass blade */
    body += `<rect x="${x}" y="${yBase - tall}" width="3" height="${tall}" fill="#3a6020"/>`;
    body += `<rect x="${x + 4}" y="${yBase - tall - 4}" width="3" height="${tall + 4}" fill="#5a8030"/>`;
  }
  /* a few rocks, bushes, beehives */
  for (let i = 0; i < 8; i++) {
    const x = 200 + i * 560;
    body += `<rect x="${x}" y="${h - 30}" width="32" height="16" fill="#5a4a3a"/>`;
    body += `<rect x="${x + 4}" y="${h - 34}" width="24" height="6" fill="#7a6a5a"/>`;
    body += `<rect x="${x + 10}" y="${h - 38}" width="12" height="4" fill="#9a8a7a"/>`;
  }
  /* beehives near the village area */
  for (let i = 0; i < 2; i++) {
    const x = 1300 + i * 240;
    body += beehive(x, h);
  }
  return svgCanvas(w, h, body);
}

function beehive(x, h) {
  return `
    <g>
      <!-- stand -->
      <rect x="${x}" y="${h - 30}" width="60" height="6" fill="#5a3818"/>
      <!-- hive (layered) -->
      <rect x="${x + 6}" y="${h - 50}" width="48" height="14" fill="#c4a050"/>
      <rect x="${x + 10}" y="${h - 64}" width="40" height="14" fill="#d8b860"/>
      <rect x="${x + 14}" y="${h - 78}" width="32" height="14" fill="#c4a050"/>
      <rect x="${x + 20}" y="${h - 88}" width="20" height="10" fill="#d8b860"/>
      <rect x="${x + 26}" y="${h - 94}" width="8" height="6" fill="#a87830"/>
      <!-- entry hole -->
      <rect x="${x + 26}" y="${h - 44}" width="8" height="6" fill="#1a1000"/>
      <!-- bees -->
      <g>
        <rect x="${x + 70}" y="${h - 80}" width="4" height="3" fill="#f8d030"/>
        <rect x="${x + 71}" y="${h - 80}" width="1" height="3" fill="#000"/>
        <rect x="${x + 73}" y="${h - 80}" width="1" height="3" fill="#000"/>
        <rect x="${x + 68}" y="${h - 82}" width="2" height="1" fill="#fff" opacity=".8"/>
      </g>
      <g>
        <rect x="${x - 14}" y="${h - 70}" width="4" height="3" fill="#f8d030"/>
        <rect x="${x - 13}" y="${h - 70}" width="1" height="3" fill="#000"/>
        <rect x="${x - 11}" y="${h - 70}" width="1" height="3" fill="#000"/>
      </g>
    </g>
  `;
}

/* attach layers */
function inject(id, svgStr) {
  const el = document.getElementById(id);
  el.innerHTML = svgStr;
}
inject('layer-clouds', makeClouds());
inject('layer-far',    makeMountains());
inject('layer-mid',    makeMid());
inject('layer-near',   makeNear());

/* ---------- SCROLL: parallax + walk animation ---------- */
const root = document.documentElement;
let lastY = 0;
let walkFrame = 0;
let walkTick = 0;
let frameSwap = 0;

function onScroll() {
  const max = root.scrollHeight - innerHeight;
  const y = scrollY;
  const p = Math.min(1, Math.max(0, y / Math.max(1, max)));
  root.style.setProperty('--p', p.toFixed(4));
  root.style.setProperty('--scroll-px', String(y));

  /* If moving, toggle walk frames; otherwise idle */
  const dy = Math.abs(y - lastY);
  if (dy > 1.5) {
    walkTick += dy;
    if (walkTick > 18) {        // every ~18px swap a frame
      walkTick = 0;
      frameSwap = (frameSwap + 1) % 2;
      heroEl.innerHTML = frameSwap === 0 ? SPRITES.walkA : SPRITES.walkB;
      /* bob up 4px on every step */
      root.style.setProperty('--bob', frameSwap === 0 ? '-4px' : '0px');
    }
    clearTimeout(onScroll._idleT);
    onScroll._idleT = setTimeout(() => {
      heroEl.innerHTML = SPRITES.idle;
      root.style.setProperty('--bob', '0px');
    }, 180);
  }
  lastY = y;

  /* page counter / xp ramp — start/max come from config via #xp-num data attrs */
  const xpNumEl = document.getElementById('xp-num');
  const xpStart = parseInt(xpNumEl.dataset.start || '220', 10);
  const xpMax = parseInt(xpNumEl.dataset.max || '1200', 10);
  const xp = xpStart + Math.round(p * (xpMax - xpStart));
  xpNumEl.textContent = `${xp}/${xpMax}`;
  const startPct = Math.round(xpStart / xpMax * 100);
  document.getElementById('xp-fill').style.setProperty('--w', `${startPct + p * (100 - startPct)}%`);
}
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll);
onScroll();

/* ---------- UI CHROME: back-to-top button + scroll-hint at bottom ---------- */
const toTopEl = document.getElementById('to-top');
const scrollHintEl = document.querySelector('.scroll-hint');
function onScrollUI() {
  const max = root.scrollHeight - innerHeight;
  const y = scrollY;
  const atBottom = y >= max - 4 || max < 40;   // little/no scroll counts as "bottom"
  if (toTopEl) toTopEl.classList.toggle('show', y > 400);
  if (scrollHintEl) scrollHintEl.classList.toggle('is-hidden', atBottom);
}
addEventListener('scroll', onScrollUI, { passive: true });
addEventListener('resize', onScrollUI);
onScrollUI();
if (toTopEl) toTopEl.addEventListener('click', () => {
  blip(880, 0.05, 'square');
  scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---------- WARP MENU: mobile collapse toggle ---------- */
const warpEl = document.querySelector('.warp');
const warpToggle = document.getElementById('warp-toggle');
if (warpEl && warpToggle) {
  const setWarpOpen = (open) => {
    warpEl.classList.toggle('is-open', open);
    warpToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  warpToggle.addEventListener('click', () => setWarpOpen(!warpEl.classList.contains('is-open')));
  warpEl.querySelectorAll('.warp__links a').forEach(a => a.addEventListener('click', () => setWarpOpen(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setWarpOpen(false); });
  addEventListener('click', (e) => { if (!warpEl.contains(e.target)) setWarpOpen(false); });
}

/* ---------- ZONE / SKY: tracked via IntersectionObserver ---------- */
const SKIES = {
  dawn:      { 1: '#ff8a5a', 2: '#ffb888', 3: '#ffd8a0', sun: '#ffd870', glow: 'rgba(255,180,100,.5)' },
  morning:   { 1: '#88c4f0', 2: '#bce0f8', 3: '#e8d8a0', sun: '#fff6c8', glow: 'rgba(255,240,180,.45)' },
  day:       { 1: '#6ab8e8', 2: '#aad6f0', 3: '#d8e8f0', sun: '#fffae0', glow: 'rgba(255,250,200,.5)' },
  afternoon: { 1: '#f0a85a', 2: '#f8c890', 3: '#fde8b8', sun: '#fff0b0', glow: 'rgba(255,200,120,.5)' },
  dusk:      { 1: '#c44830', 2: '#f08040', 3: '#fac890', sun: '#ff8a40', glow: 'rgba(255,120,60,.45)' },
  night:     { 1: '#0a1838', 2: '#1a2a58', 3: '#3a3060', sun: '#e8e8f0', glow: 'rgba(200,200,220,.35)' },
};
function applySky(name) {
  const s = SKIES[name] || SKIES.morning;
  root.style.setProperty('--sky-1', s[1]);
  root.style.setProperty('--sky-2', s[2]);
  root.style.setProperty('--sky-3', s[3]);
  root.style.setProperty('--celestial-1', s.sun);
  root.style.setProperty('--celestial-glow', s.glow);
}
/* Initial sky/zone can be set per-page via <body data-sky data-zone>.
   On the homepage the section observers below take over immediately. */
applySky(document.body.dataset.sky || 'dawn');

const zoneEl = document.getElementById('zone-name');
if (document.body.dataset.zone) zoneEl.textContent = document.body.dataset.zone;
const zoneIO = new IntersectionObserver((entries) => {
  /* most-visible section wins */
  let best = null, bestRatio = 0;
  entries.forEach(e => {
    if (e.intersectionRatio > bestRatio) {
      bestRatio = e.intersectionRatio;
      best = e.target;
    }
  });
  if (best) {
    const zone = best.dataset.zone;
    const sky = best.dataset.sky;
    if (zone) zoneEl.textContent = zone;
    if (sky)  applySky(sky);
  }
}, { threshold: [0.25, 0.5, 0.75], rootMargin: '-25% 0px -25% 0px' });
document.querySelectorAll('section.screen').forEach(s => zoneIO.observe(s));

/* ---------- REVEALS ---------- */
const revIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revIO.unobserve(e.target); }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach(el => revIO.observe(el));

/* ---------- CHIPTUNE BLIPS (after user interacts) ---------- */
let audioCtx = null;
function arm() {
  if (audioCtx) return;
  try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {}
}
addEventListener('pointerdown', arm, { once: true });
addEventListener('keydown', arm, { once: true });
addEventListener('wheel', arm, { once: true });

function blip(freq = 660, dur = 0.06, type = 'square') {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.08, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(audioCtx.destination);
  o.start(t); o.stop(t + dur);
}

/* Step sound: trigger on every walk frame swap */
let lastStepTime = 0;
const origScroll = onScroll;
addEventListener('scroll', () => {
  const now = performance.now();
  if (now - lastStepTime > 220 && Math.abs(scrollY - lastY) > 4) {
    blip(220 + (frameSwap === 0 ? 0 : 40), 0.045, 'square');
    lastStepTime = now;
  }
}, { passive: true });

/* Dialog reveal sound */
const dialogIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      blip(880, 0.05, 'square');
      setTimeout(() => blip(660, 0.06, 'square'), 60);
      dialogIO.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.dialog, .item-get, .scroll-card, .signpost, .story-box').forEach(el => dialogIO.observe(el));
