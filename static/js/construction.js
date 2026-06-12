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

/* ===========================================================================
   UNDER-CONSTRUCTION SCENE — the hero shuffles between 3 beehives and hammers.
   (Reuses the hero sprite above; beehive + hammer are drawn here.)
   =========================================================================== */

function beehiveSVG() {
  return `<svg viewBox="0 0 64 82" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" width="64" height="82">
    <rect x="3"  y="74" width="58" height="6" fill="#5a3818"/>
    <rect x="3"  y="74" width="58" height="2" fill="#7a5028"/>
    <rect x="6"  y="60" width="52" height="14" fill="#c89a3a"/>
    <rect x="10" y="46" width="44" height="14" fill="#e0b450"/>
    <rect x="14" y="34" width="36" height="12" fill="#c89a3a"/>
    <rect x="18" y="24" width="28" height="10" fill="#e0b450"/>
    <rect x="22" y="16" width="20" height="8"  fill="#c89a3a"/>
    <rect x="27" y="9"  width="10" height="7"  fill="#a87830"/>
    <rect x="6"  y="60" width="52" height="2" fill="#f4d878"/>
    <rect x="10" y="46" width="44" height="2" fill="#f4d878"/>
    <rect x="14" y="34" width="36" height="2" fill="#f4d878"/>
    <rect x="18" y="24" width="28" height="2" fill="#f4d878"/>
    <rect x="22" y="16" width="20" height="2" fill="#f4d878"/>
    <rect x="46" y="46" width="12" height="28" fill="#a87830" opacity=".45"/>
    <rect x="28" y="64" width="8" height="6" fill="#1a1000"/>
    <rect x="28" y="62" width="8" height="2" fill="#3a2410"/>
  </svg>`;
}

function hammerSVG() {
  return `<svg viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" width="30" height="42">
    <rect x="12" y="9" width="6" height="32" fill="#7a5028"/>
    <rect x="12" y="9" width="2" height="32" fill="#9a6838"/>
    <rect x="2"  y="0" width="26" height="13" fill="#9aa0a8"/>
    <rect x="2"  y="0" width="26" height="3"  fill="#c8ccd4"/>
    <rect x="2"  y="10" width="26" height="3" fill="#565c64"/>
    <rect x="0"  y="2" width="4" height="9"   fill="#c8ccd4"/>
    <rect x="24" y="2" width="6" height="9"   fill="#787e86"/>
  </svg>`;
}

(function runScene() {
  const sprite  = document.getElementById('uc-sprite');
  const hammer  = document.getElementById('uc-hammer');
  const hero    = document.getElementById('uc-hero');
  const sparks  = document.getElementById('uc-sparks');
  const beesBox = document.getElementById('uc-bees');
  if (!sprite || !hero) return;

  sprite.innerHTML = SPRITES.idle;
  hammer.innerHTML = hammerSVG();
  document.querySelectorAll('.uc-hive').forEach(h => h.innerHTML = beehiveSVG());

  /* drifting bees */
  for (let i = 0; i < 7; i++) {
    const b = document.createElement('span');
    b.className = 'uc-bee';
    b.style.left = (12 + i * 11) + '%';
    b.style.setProperty('--rise', (30 + (i % 4) * 18) + 'px');
    b.style.animationDuration = (2.6 + (i % 5) * 0.5) + 's';
    b.style.animationDelay = (-i * 0.6) + 's';
    beesBox.appendChild(b);
  }

  const HERO_X = [18, 44, 70];   /* hero left-% (just left of each hive) */
  const WALK_MS = 1100;
  let idx = 0, walkTimer = null, frame = 0;

  const show = (name) => { sprite.innerHTML = SPRITES[name]; };

  function startWalk() {
    frame = 0;
    walkTimer = setInterval(() => {
      frame ^= 1;
      show(frame ? 'walkA' : 'walkB');
      hero.style.setProperty('--bob', frame ? '-3px' : '0px');
    }, 150);
  }
  function stopWalk() {
    clearInterval(walkTimer); walkTimer = null;
    show('idle'); hero.style.setProperty('--bob', '0px');
  }

  function strikeSparks() {
    for (let i = 0; i < 5; i++) {
      const s = document.createElement('span');
      s.className = 'uc-spark';
      s.style.setProperty('--sx', (Math.round(Math.random() * 22 - 11)) + 'px');
      s.style.setProperty('--sy', (-Math.round(8 + Math.random() * 14)) + 'px');
      sparks.appendChild(s);
      setTimeout(() => s.remove(), 480);
    }
  }

  function hammerHere(done) {
    hero.classList.add('uc-hero--hammer');   /* CSS swings the hammer */
    const STRIKES = 5, PERIOD = 360;
    let n = 0;
    const t = setInterval(() => {
      strikeSparks();
      if (++n >= STRIKES) { clearInterval(t); hero.classList.remove('uc-hero--hammer'); done(); }
    }, PERIOD);
  }

  function walkTo(i, done) {
    startWalk();
    hero.style.left = HERO_X[i] + '%';
    setTimeout(() => { stopWalk(); done(); }, WALK_MS + 40);
  }

  function loop() {
    hammerHere(() => {
      const next = (idx + 1) % HERO_X.length;
      walkTo(next, () => { idx = next; loop(); });
    });
  }

  hero.style.left = HERO_X[0] + '%';
  setTimeout(loop, 700);
})();
