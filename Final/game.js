/* ============================================================
   LUCKY NUMBER — game.js
   Neu: Sounds (Web Audio), Highscore (localStorage), Auto-Submit
   ============================================================ */

// ========================
//  CONFIG
// ========================
const CONFIG = {
  maxAttempts:  10,
  timerSeconds: 5,
  levels: [
    { id: 1, name: 'Warm-up',      min: 1,    max: 99,   digits: 2 },
    { id: 2, name: 'Serious Mode', min: 100,  max: 999,  digits: 3 },
    { id: 3, name: 'No Mercy',     min: 1000, max: 9999, digits: 4 }
  ],
  modeMap: {
    1:'normal', 2:'normal', 3:'normal',
    4:'slot', 5:'choice', 6:'brain',
    7:'normal', 8:'normal', 9:'normal', 10:'normal'
  },
  quips: {
    low:     ["Zu niedrig.", "Kalt — sehr kalt.", "Höher denken.", "Da unten liegt nichts.", "Mehr Mut."],
    high:    ["Zu hoch.", "Runter kommen.", "Überschätzt.", "Deutlich zu viel.", "Etwas bescheidener."],
    timeout: ["Zu langsam.", "Tick tack — weg.", "5 Sekunden reichen.", "Wer zögert verliert.", "Zeit ist raus."],
    win:     ["Gewusst wie.", "Reiner Instinkt.", "Lucky Strike.", "Nicht aufzuhalten.", "Klasse."],
    lose:    ["Nächstes Mal.", "Die Zahl gewinnt heute.", "War knapp.", "Kein Grund zur Panik.", "Versuch's nochmal."]
  }
};

// ========================
//  SOUND ENGINE (Web Audio API)
//  Kein externes File nötig — alles generiert
// ========================
let audioCtx = null;

function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playSound(type) {
  try {
    const ctx = getAudio();
    const now = ctx.currentTime;

    if (type === 'correct') {
      // Aufsteigende Töne — Gewinn
      [523, 659, 784, 1047].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.25, now + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
        o.start(now + i * 0.1);
        o.stop(now + i * 0.1 + 0.3);
      });

    } else if (type === 'wrong') {
      // Tiefer Ton — Fehler
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(220, now);
      o.frequency.exponentialRampToValueAtTime(110, now + 0.25);
      g.gain.setValueAtTime(0.2, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      o.start(now); o.stop(now + 0.3);

    } else if (type === 'timeout') {
      // Kurzer doppelter Piep
      [330, 220].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type = 'square';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.1, now + i * 0.15);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.12);
        o.start(now + i * 0.15);
        o.stop(now + i * 0.15 + 0.15);
      });

    } else if (type === 'tick') {
      // Leises Tick für Timer
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sine';
      o.frequency.value = 800;
      g.gain.setValueAtTime(0.05, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      o.start(now); o.stop(now + 0.07);

    } else if (type === 'digit') {
      // Sanfter Klick beim Tippen
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'sine';
      o.frequency.value = 600;
      g.gain.setValueAtTime(0.08, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      o.start(now); o.stop(now + 0.06);

    } else if (type === 'spin') {
      // Slot-Rollen Sound
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = 'triangle';
      o.frequency.setValueAtTime(400, now);
      o.frequency.exponentialRampToValueAtTime(200, now + 0.08);
      g.gain.setValueAtTime(0.1, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      o.start(now); o.stop(now + 0.1);
    }
  } catch(e) { /* Kein Sound wenn Browser blockiert */ }
}

// ========================
//  HIGHSCORE (localStorage)
// ========================
function getHighscores() {
  try { return JSON.parse(localStorage.getItem('luckyNumberHS') || '{}'); }
  catch(e) { return {}; }
}

function saveHighscore(levelId, attempts) {
  const hs = getHighscores();
  const key = 'lvl' + levelId;
  if (!hs[key] || attempts < hs[key]) {
    hs[key] = attempts;
    localStorage.setItem('luckyNumberHS', JSON.stringify(hs));
    return true; // neuer Rekord
  }
  return false;
}

function getHighscore(levelId) {
  const hs = getHighscores();
  return hs['lvl' + levelId] || null;
}

function updateHighscoreBanner() {
  const banner = document.getElementById('highscore-banner');
  const hs = getHighscores();
  const entries = Object.entries(hs);
  if (entries.length === 0) { banner.style.display = 'none'; return; }

  const lvlNames = { lvl1: '01–99', lvl2: '100–999', lvl3: '1000–9999' };
  const parts = entries.map(([k, v]) => `${lvlNames[k] || k}: ${v} Versuche`);
  document.getElementById('highscore-text').textContent = '🏆 ' + parts.join(' · ');
  banner.style.display = 'flex';
}

// ========================
//  SPIELZUSTAND
// ========================
let secretNumber    = 0;
let selectedLevel   = 1;
let currentDigits   = 2;
let attempt         = 0;
let gameOver        = false;
let timerInterval   = null;
let timerLeft       = CONFIG.timerSeconds;
let dotStates       = [];
let transitionShown = false;
let typedValue      = '';   // aktuell getippte Ziffern
let lastTimerTick   = 0;

const rnd    = arr => arr[Math.floor(Math.random() * arr.length)];
const randBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ========================
//  LEVEL WAHL
// ========================
function selectLevel(l) {
  selectedLevel = l;
  document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('lvl-' + l).classList.add('selected');
}

// ========================
//  SCREENS
// ========================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function goToStart() {
  updateHighscoreBanner();
  showScreen('screen-start');
}

// ========================
//  SPIEL STARTEN
// ========================
function startGame() {
  const lvl       = CONFIG.levels.find(x => x.id === selectedLevel);
  secretNumber    = randBetween(lvl.min, lvl.max);
  currentDigits   = lvl.digits;
  attempt         = 0;
  gameOver        = false;
  transitionShown = false;
  typedValue      = '';
  dotStates       = Array(CONFIG.maxAttempts).fill('pending');

  renderDots();
  showScreen('screen-game');
  nextAttempt();
}

// ========================
//  NÄCHSTER VERSUCH
// ========================
function nextAttempt() {
  if (gameOver) return;
  attempt++;
  typedValue = '';

  if (attempt === 4 && !transitionShown) {
    transitionShown = true;
    stopTimer();
    showScreen('screen-transition');
    return;
  }

  updateCounter();
  renderDots();
  setMode(CONFIG.modeMap[attempt] || 'normal');
  setFeedback('info', 'Die Zahl wartet auf dich.');
  startTimer();
}

function continueFromTransition() {
  showScreen('screen-game');
  updateCounter();
  renderDots();
  setMode(CONFIG.modeMap[attempt] || 'normal');
  setFeedback('info', 'Die Zahl wartet auf dich.');
  startTimer();
}

// ========================
//  MODUS SETZEN
// ========================
function setMode(mode) {
  ['normal','slot','choice','brain'].forEach(z => {
    document.getElementById('zone-' + z).style.display = 'none';
  });

  const card  = document.getElementById('game-card');
  const badge = document.getElementById('phase-badge');
  card.className = 'game-card';

  // Digit-Slots an aktuelle Level-Tiefe anpassen
  setupDigitSlots('digit-display', currentDigits);
  setupDigitSlots('brain-digit-display', currentDigits);

  if (mode === 'normal') {
    document.getElementById('zone-normal').style.display = 'block';
    resetDigitDisplay('digit-display');
    badge.className = 'phase-badge normal';
    setBadge('normal', lucideTarget(), 'Normales Raten');
    setInstruction('<strong>Tippe die Zahl ein</strong> — automatische Auswertung nach ' + currentDigits + ' Ziffern.');
    focusHidden('main-input');

  } else if (mode === 'slot') {
    document.getElementById('zone-slot').style.display = 'block';
    document.getElementById('slot-number').textContent = '?';
    document.getElementById('slot-label').textContent  = 'Bereit zum Drehen';
    document.getElementById('slot-btn').disabled       = false;
    setBadge('slot', lucideRefresh(), 'Slot Mode');
    setInstruction('<strong>Drück den Knopf.</strong> Das Rad dreht sich und entscheidet — du hast keine Kontrolle.');

  } else if (mode === 'choice') {
    document.getElementById('zone-choice').style.display = 'block';
    buildChoices();
    setBadge('choice', lucideHelp(), '1 aus 10');
    setInstruction('<strong>Zehn Zahlen — eine ist richtig.</strong> Kein Hinweis, kein Mitleid.');

  } else if (mode === 'brain') {
    document.getElementById('zone-brain').style.display = 'block';
    buildEquation();
    resetDigitDisplay('brain-digit-display');
    setBadge('brain', lucideBrain(), 'Brain Mode');
    setInstruction('<strong>Löse die Gleichung.</strong> Das Ergebnis ist die gesuchte Zahl.');
    focusHidden('brain-input');
  }
}

function setInstruction(html) { document.getElementById('instruction').innerHTML = html; }

function setBadge(cls, iconSvg, text) {
  const badge = document.getElementById('phase-badge');
  badge.className = 'phase-badge ' + cls;
  document.getElementById('phase-badge-icon').innerHTML = iconSvg;
  document.getElementById('phase-badge-text').textContent = text;
}

// ========================
//  DIGIT DISPLAY
// ========================
function setupDigitSlots(containerId, digits) {
  for (let i = 0; i < 4; i++) {
    const prefix = containerId === 'digit-display' ? 'd' : 'bd';
    const el = document.getElementById(prefix + i);
    if (!el) continue;
    if (i < digits) {
      el.classList.remove('digit-hidden');
      el.textContent = '_';
      el.classList.remove('filled','active','correct','wrong');
    } else {
      el.classList.add('digit-hidden');
    }
  }
}

function resetDigitDisplay(containerId) {
  const prefix = containerId === 'digit-display' ? 'd' : 'bd';
  for (let i = 0; i < currentDigits; i++) {
    const el = document.getElementById(prefix + i);
    if (el) { el.textContent = '_'; el.classList.remove('filled','active','correct','wrong'); }
  }
  // Erste Slot aktiv
  const first = document.getElementById(prefix + '0');
  if (first) first.classList.add('active');
}

function updateDigitDisplay(val, containerId) {
  const prefix = containerId === 'digit-display' ? 'd' : 'bd';
  const str = val.toString();

  for (let i = 0; i < currentDigits; i++) {
    const el = document.getElementById(prefix + i);
    if (!el) continue;
    el.classList.remove('active','filled');
    if (i < str.length) {
      el.textContent = str[i];
      el.classList.add('filled');
    } else {
      el.textContent = '_';
      if (i === str.length) el.classList.add('active');
    }
  }
}

function focusHidden(id) {
  const el = document.getElementById(id);
  if (el) { el.value = ''; setTimeout(() => el.focus(), 80); }
}

// ========================
//  AUTO-SUBMIT INPUT
// ========================
function handleDigitInput(val) {
  if (gameOver) return;
  const clean = val.replace(/\D/g, '').slice(0, currentDigits);
  document.getElementById('main-input').value = clean;
  typedValue = clean;
  updateDigitDisplay(clean, 'digit-display');
  if (clean.length > 0) playSound('digit');
  if (clean.length === currentDigits) {
    stopTimer();
    setTimeout(() => processGuess(parseInt(clean)), 120);
  }
}

function handleBrainInput(val) {
  if (gameOver) return;
  const clean = val.replace(/\D/g, '').slice(0, currentDigits);
  document.getElementById('brain-input').value = clean;
  typedValue = clean;
  updateDigitDisplay(clean, 'brain-digit-display');
  if (clean.length > 0) playSound('digit');
  if (clean.length === currentDigits) {
    stopTimer();
    setTimeout(() => processGuess(parseInt(clean)), 120);
  }
}

// ========================
//  TIMER
// ========================
function startTimer() {
  stopTimer();
  timerLeft    = CONFIG.timerSeconds;
  lastTimerTick = Math.ceil(timerLeft);
  updateTimerUI();

  timerInterval = setInterval(() => {
    timerLeft -= 0.1;
    updateTimerUI();
    // Tick-Sound jede Sekunde wenn ≤ 3 Sekunden
    const curSec = Math.ceil(timerLeft);
    if (timerLeft <= 3 && curSec !== lastTimerTick && curSec > 0) {
      playSound('tick');
      lastTimerTick = curSec;
    }
    if (timerLeft <= 0) { stopTimer(); handleTimeout(); }
  }, 100);
}

function stopTimer() {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function updateTimerUI() {
  const pct  = timerLeft / CONFIG.timerSeconds;
  const fill = document.getElementById('timer-fill');
  const num  = document.getElementById('timer-num');
  num.textContent  = Math.max(0, Math.ceil(timerLeft));
  fill.style.width = (pct * 100) + '%';
  const state = pct <= 0.3 ? ' danger' : pct <= 0.55 ? ' warn' : '';
  fill.className = 'timer-fill' + state;
  num.className  = 'timer-num'  + state;
}

function handleTimeout() {
  playSound('timeout');
  dotStates[attempt - 1] = 'timeout';
  renderDots();
  setFeedback('timeout', rnd(CONFIG.quips.timeout));
  if (attempt >= CONFIG.maxAttempts) setTimeout(endGame, 1200);
  else setTimeout(nextAttempt, 1400);
}

// ========================
//  BRAIN MODUS
// ========================
function buildEquation() {
  const lvl = CONFIG.levels.find(x => x.id === selectedLevel);
  let eq;
  if (Math.random() < 0.5) {
    const a = randBetween(1, secretNumber - 1);
    eq = `${a} + ${secretNumber - a} = ?`;
  } else {
    const divisors = [];
    for (let i = 2; i <= Math.sqrt(secretNumber); i++) {
      if (secretNumber % i === 0) divisors.push(i);
    }
    if (divisors.length > 0) {
      const a = divisors[Math.floor(Math.random() * divisors.length)];
      eq = `${a} × ${secretNumber / a} = ?`;
    } else {
      const a = randBetween(1, secretNumber - 1);
      eq = `${a} + ${secretNumber - a} = ?`;
    }
  }
  document.getElementById('equation-text').textContent = eq;
}

// ========================
//  CHOICE MODUS
// ========================
function buildChoices() {
  const lvl  = CONFIG.levels.find(x => x.id === selectedLevel);
  const opts = new Set([secretNumber]);
  while (opts.size < 10) opts.add(randBetween(lvl.min, lvl.max));

  const shuffled = [...opts].sort(() => Math.random() - 0.5);
  const grid     = document.getElementById('choices-grid');
  grid.innerHTML = '';

  shuffled.forEach(n => {
    const btn = document.createElement('button');
    btn.className   = 'choice-btn';
    btn.textContent = n;
    btn.onclick = () => { stopTimer(); choicePick(n, btn); };
    grid.appendChild(btn);
  });
}

function choicePick(val, btn) {
  if (gameOver) return;
  document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
  if (val === secretNumber) {
    btn.classList.add('correct');
    processGuess(val);
  } else {
    btn.classList.add('wrong');
    setTimeout(() => processGuess(val), 400);
  }
}

// ========================
//  SLOT MODUS
// ========================
function spinSlot() {
  if (gameOver) return;
  stopTimer();
  const lvl   = CONFIG.levels.find(x => x.id === selectedLevel);
  const btn   = document.getElementById('slot-btn');
  const numEl = document.getElementById('slot-number');
  const label = document.getElementById('slot-label');
  btn.disabled = true;
  label.textContent = 'Dreht sich...';

  let ticks = 0;
  const roll = setInterval(() => {
    numEl.textContent = randBetween(lvl.min, lvl.max);
    playSound('spin');
    ticks++;
    if (ticks >= 24) {
      clearInterval(roll);
      const result      = randBetween(lvl.min, lvl.max);
      numEl.textContent = result;
      label.textContent = 'Das Schicksal hat gesprochen.';
      setTimeout(() => processGuess(result), 700);
    }
  }, 75);
}

// ========================
//  ERGEBNIS VERARBEITEN
// ========================
function processGuess(val) {
  if (val === secretNumber) {
    dotStates[attempt - 1] = 'correct';
    renderDots();
    playSound('correct');

    // Digit-Slots grün
    const prefix = (CONFIG.modeMap[attempt] === 'brain') ? 'bd' : 'd';
    for (let i = 0; i < currentDigits; i++) {
      const el = document.getElementById(prefix + i);
      if (el) { el.classList.remove('filled','active','wrong'); el.classList.add('correct'); }
    }

    setFeedback('win', rnd(CONFIG.quips.win));
    setTimeout(endGame, 900);

  } else {
    dotStates[attempt - 1] = 'wrong';
    renderDots();
    playSound('wrong');

    // Digit-Slots rot schütteln
    const prefix = (CONFIG.modeMap[attempt] === 'brain') ? 'bd' : 'd';
    for (let i = 0; i < currentDigits; i++) {
      const el = document.getElementById(prefix + i);
      if (el) { el.classList.remove('filled','active','correct'); el.classList.add('wrong'); }
    }

    const isLow = val < secretNumber;
    setFeedback(isLow ? 'low' : 'high', rnd(isLow ? CONFIG.quips.low : CONFIG.quips.high));

    if (attempt >= CONFIG.maxAttempts) setTimeout(endGame, 1200);
    else setTimeout(nextAttempt, 1500);
  }
}

// ========================
//  DOTS
// ========================
function renderDots() {
  const row = document.getElementById('attempts-row');
  row.innerHTML = '';
  for (let i = 0; i < CONFIG.maxAttempts; i++) {
    const d = document.createElement('div');
    d.className = 'attempt-dot';
    const isSpecial = CONFIG.modeMap[i + 1] !== 'normal';
    if      (dotStates[i] === 'correct')  d.classList.add('done-correct');
    else if (dotStates[i] === 'wrong')    d.classList.add('done-wrong');
    else if (dotStates[i] === 'timeout')  d.classList.add('done-timeout');
    else if (i === attempt - 1)           d.classList.add('active');
    else if (isSpecial)                   d.classList.add('special-pending');
    row.appendChild(d);
  }
}

function updateCounter() {
  document.getElementById('attempt-counter').textContent = attempt + '/' + CONFIG.maxAttempts;
}

// ========================
//  FEEDBACK
// ========================
function setFeedback(cls, text) {
  const box = document.getElementById('feedback-box');
  const txt = document.getElementById('feedback-text');
  box.className   = 'feedback-box';
  txt.textContent = text;
  setTimeout(() => { box.classList.add(cls); box.classList.add('show'); }, 10);
}

// ========================
//  SPIEL ENDE
// ========================
function endGame() {
  stopTimer();
  gameOver = true;

  const won    = dotStates[attempt - 1] === 'correct';
  const lvl    = CONFIG.levels.find(x => x.id === selectedLevel);
  let   isNew  = false;
  if (won) isNew = saveHighscore(selectedLevel, attempt);
  const hs     = getHighscore(selectedLevel);

  // Win Icon SVG
  const iconEl = document.getElementById('end-icon');
  if (won) {
    iconEl.className = 'end-icon win';
    iconEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`;
  } else {
    iconEl.className = 'end-icon lose';
    iconEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
  }

  document.getElementById('end-title').textContent = won ? 'GEWONNEN' : 'GAME OVER';
  document.getElementById('end-title').className   = 'end-title ' + (won ? 'win' : 'lose');
  document.getElementById('end-sub').textContent   = won
    ? `Du hast ${secretNumber} in Versuch ${attempt} gefunden${isNew ? ' — neuer Rekord!' : '.'}`
    : `Die Zahl war ${secretNumber}.`;
  document.getElementById('end-attempts').textContent  = attempt;
  document.getElementById('end-number').textContent    = secretNumber;
  document.getElementById('end-highscore').textContent = hs ? hs + ' V' : '—';
  document.getElementById('end-quip').textContent      = rnd(won ? CONFIG.quips.win : CONFIG.quips.lose);

  showScreen('screen-end');
}

// ========================
//  LUCIDE ICONS (inline SVG Strings)
// ========================
function lucideTarget() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`;
}
function lucideRefresh() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>`;
}
function lucideHelp() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
}
function lucideBrain() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.66Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.66Z"/></svg>`;
}

// ========================
//  INIT
// ========================
updateHighscoreBanner();