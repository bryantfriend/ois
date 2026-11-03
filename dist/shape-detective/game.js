(() => {
  'use strict';
  const $ = s => document.querySelector(s), canvas = $('#garden'), ctx = canvas.getContext('2d');
  const W = 1000, H = 780, names = ['circle', 'square', 'triangle'];
  const colours = ['#efbe42', '#468fbd', '#e57660'];
  const speech = {
    welcome: "Welcome to the garden, detective! Let's find Dot's hiding places.",
    find: 'Choose every shape that contains Dot. Look carefully at the outlines.',
    hide: 'Move Dot to the hiding place on your clue card. You can drag her, or tap the garden.',
    good: "Clues confirmed! You found Dot's hiding place.",
    placed: 'A perfect hiding place! Well done, detective.',
    retry: "Take another look. Follow each shape's outline around Dot.",
    retryHide: 'Not quite. Check which shapes Dot is inside, and which she is outside.',
    finish: "Casebook complete! You're a brilliant shape detective."
  };
  const defaultCases = [
    { name: 'The secret meeting', mode: 'find', answer: ['circle', 'triangle'] },
    { name: 'A new hiding place', mode: 'hide', answer: ['square', 'triangle'] },
    { name: 'Beside the birdbath', mode: 'find', answer: ['circle'] },
    { name: 'The blue garden', mode: 'find', answer: ['square'] },
    { name: 'Under the petals', mode: 'find', answer: ['triangle'] },
    { name: 'Two little clues', mode: 'find', answer: ['circle', 'square'] },
    { name: 'The secret centre', mode: 'hide', answer: ['circle', 'square', 'triangle'] },
    { name: 'The final discovery', mode: 'find', answer: ['circle', 'square', 'triangle'] }
  ];
  let cases = defaultCases, lessonTitle = 'A garden full of little mysteries.', custom = false;
  const params = new URLSearchParams(location.search);
  if (params.get('lesson') === '1') {
    try {
      const lesson = JSON.parse(sessionStorage.getItem('shape-detective-lesson'));
      if (!lesson || !Array.isArray(lesson.items) || lesson.items.length < 1 || lesson.items.length > 100) throw Error('Invalid lesson');
      const parsed = lesson.items.map((q, i) => {
        const answer = String(q.answer).split('|').map(s => s.trim());
        if (!answer.length || new Set(answer).size !== answer.length || !answer.every(s => names.includes(s))) throw Error('Invalid shape');
        return { name: `Garden clue ${i + 1}`, mode: 'find', answer, prompt: String(q.prompt || '').slice(0, 1500), explanation: String(q.explanation || '').slice(0, 1500) };
      });
      if (lesson.shuffle) for (let i = parsed.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [parsed[i], parsed[j]] = [parsed[j], parsed[i]]; }
      cases = lesson.campaign === true ? defaultCases : parsed; custom = lesson.campaign !== true; lessonTitle = String(lesson.title || 'My garden casebook').slice(0, 120);
      if (/^[a-zA-Z0-9_-]{1,150}$/.test(lesson.id || '')) $('#home').href = '../?game=' + encodeURIComponent(lesson.id);
    } catch { $('#lesson-title').textContent = 'Your lesson could not be opened. Playing the garden casebook.'; }
  }
  $('#lesson-title').textContent = lessonTitle;
  let index = 0, selected = [], dot = { x: 380, y: 470 }, solved = false, complete = false;
  let inspect = false, outline = -1, lens = { x: 460, y: 430 }, dragging = false, activePointer = null;
  let paused = false, ready = false, narrating = false, epoch = 0, started = false, time = 0;
  let muted = false;
  try { muted = localStorage.getItem('shape-detective-muted') === '1'; } catch { /* Private browsing can disable storage. */ }
  const background = new Image(), ladybird = new Image();
  const scene = document.createElement('canvas'); scene.width = W; scene.height = H;
  const pen = scene.getContext('2d');
  function current() { return cases[index]; }
  function membership(x, y) {
    const a = [320, 265], b = [165, 665], c = [730, 665];
    const cross = (p, q) => (q[0] - p[0]) * (y - p[1]) - (q[1] - p[1]) * (x - p[0]);
    const d = [cross(a, b), cross(b, c), cross(c, a)];
    return [Math.hypot(x - 470, y - 335) < 215, x > 480 && x < 810 && y > 355 && y < 685, d.every(v => v <= 0) || d.every(v => v >= 0)];
  }
  function distanceToLine(x, y, a, b) { return Math.abs((b[0] - a[0]) * (a[1] - y) - (a[0] - x) * (b[1] - a[1])) / Math.hypot(b[0] - a[0], b[1] - a[1]); }
  function safety(x, y) {
    return Math.min(Math.abs(Math.hypot(x - 470, y - 335) - 215), Math.abs(x - 480), Math.abs(x - 810), Math.abs(y - 355), Math.abs(y - 685), distanceToLine(x, y, [320, 265], [165, 665]), distanceToLine(x, y, [320, 265], [730, 665]), Math.abs(y - 665));
  }
  function pointFor(answer, variation = 0) {
    const candidates = [];
    for (let y = 235; y < 645; y += 10) for (let x = 230; x < 795; x += 10) {
      if (membership(x, y).every((v, i) => v === answer.includes(names[i]))) candidates.push({ x, y, safe: safety(x, y) });
    }
    candidates.sort((a, b) => b.safe - a.safe);
    if (!candidates.length) throw Error('No valid hiding place');
    return candidates[Math.min(variation % 4, candidates.length - 1)];
  }
  function shapePath(p, i) {
    p.beginPath();
    if (i === 0) p.arc(470, 335, 215, 0, Math.PI * 2);
    else if (i === 1) p.rect(480, 355, 330, 330);
    else { p.moveTo(320, 265); p.lineTo(165, 665); p.lineTo(730, 665); p.closePath(); }
  }
  function paintShape(p, i) {
    const faded = outline >= 0 && outline !== i;
    p.save(); p.globalAlpha = faded ? .15 : 1;
    shapePath(p, i); p.fillStyle = colours[i] + '55'; p.fill();
    p.lineJoin = 'round'; p.strokeStyle = '#fff5d5cc'; p.lineWidth = outline === i ? 11 : 7; p.stroke();
    p.strokeStyle = colours[i]; p.lineWidth = outline === i ? 6 : 3.5; p.stroke();
    // A fine pencil edge keeps the translucent habitats readable on the painted lawn.
    shapePath(p, i); p.strokeStyle = '#6c482d44'; p.lineWidth = 1; p.stroke(); p.restore();
  }
  function drawDot(p) {
    p.save();
    p.fillStyle = '#24362044'; p.beginPath(); p.ellipse(dot.x + 2, dot.y + 19, 31, 10, 0, 0, Math.PI * 2); p.fill();
    if (current().mode === 'hide' && !solved) {
      p.strokeStyle = '#fff4c6'; p.lineWidth = 3; p.setLineDash([4, 6]); p.beginPath(); p.ellipse(dot.x, dot.y, 43, 35, 0, 0, Math.PI * 2); p.stroke(); p.setLineDash([]);
    }
    if (ladybird.complete && ladybird.naturalWidth) p.drawImage(ladybird, dot.x - 43, dot.y - 38, 86, 76);
    p.restore();
  }
  function draw() {
    pen.clearRect(0, 0, W, H);
    if (background.complete && background.naturalWidth) pen.drawImage(background, 0, 0, W, H);
    else { pen.fillStyle = '#cfca87'; pen.fillRect(0, 0, W, H); }
    for (let i = 0; i < 3; i++) paintShape(pen, i);
    drawDot(pen);
    // Small painted butterflies respond to progress, leaving the actual clue area still.
    for (let i = 0; i < Math.min(index, 5); i++) {
      pen.save(); pen.translate(110 + i * 155, 180 + (i % 2) * 30); pen.rotate(-.3 + i * .2);
      pen.fillStyle = ['#e8b54c', '#e7a3a1', '#a2bed5'][i % 3];
      pen.beginPath(); pen.ellipse(-5, 0, 7, 10, -.5, 0, 7); pen.ellipse(5, 0, 7, 10, .5, 0, 7); pen.fill();
      pen.strokeStyle = '#6b5634'; pen.lineWidth = 2; pen.beginPath(); pen.moveTo(0, -6); pen.lineTo(0, 9); pen.stroke(); pen.restore();
    }
    ctx.clearRect(0, 0, W, H); ctx.drawImage(scene, 0, 0);
    if (inspect) {
      const x = lens.x, y = lens.y, r = 86;
      ctx.save(); ctx.shadowColor = '#34251180'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 7;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = '#d8b66a'; ctx.fill(); ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.arc(x, y, r - 7, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(scene, x - 48, y - 48, 96, 96, x - r, y - r, r * 2, r * 2);
      const glass = ctx.createLinearGradient(x - r, y - r, x + r, y + r); glass.addColorStop(0, '#ffffff4d'); glass.addColorStop(.5, '#ffffff00'); glass.addColorStop(1, '#4c817b22');
      ctx.fillStyle = glass; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
      ctx.strokeStyle = '#775626'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#f0d17b'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, r - 4, 0, Math.PI * 2); ctx.stroke();
      ctx.save(); ctx.translate(x + 61, y + 61); ctx.rotate(-Math.PI / 4); ctx.fillStyle = '#6a3e21'; ctx.fillRect(-11, 0, 22, 105); ctx.strokeStyle = '#ad7d45'; ctx.lineWidth = 3; ctx.strokeRect(-11, 0, 22, 105); ctx.restore();
    }
  }
  function tokenArt(i) {
    const shape = ['<circle cx="50" cy="50" r="42"/>', '<rect x="10" y="10" width="80" height="80" rx="2"/>', '<path d="M50 6L96 91H4Z"/>'][i];
    return `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><filter id="grain-${i}"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".2"/></feComponentTransfer><feComposite in2="SourceAlpha" operator="in"/><feBlend in="SourceGraphic" mode="multiply"/></filter></defs><g fill="${colours[i]}" stroke="#fff1c7" stroke-width="2" filter="url(#grain-${i})">${shape}</g><path d="M43 63Q29 44 59 33Q68 50 43 63ZM43 62L56 41" fill="#48563866" stroke="#48563888" stroke-width="2"/></svg>`;
  }
  function updateControls() {
    const c = current();
    $('#check').disabled = !ready || paused || narrating;
    $('#check-label').textContent = solved ? (index === cases.length - 1 ? 'Close my casebook' : 'Next little mystery →') : c.mode === 'hide' ? 'Test my hiding place' : 'Check my clues';
    $('#voice').textContent = muted ? '♪ Voice off' : '♪ Voice on'; $('#voice').setAttribute('aria-pressed', String(!muted));
    $('#inspect').setAttribute('aria-pressed', String(inspect)); $('#outline-tools').hidden = !inspect;
    document.querySelectorAll('[data-outline]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.outline === outline)));
    $('#garden-tip').textContent = inspect ? 'Move the glass. Tap a symbol to inspect its outline.' : c.mode === 'hide' && !solved ? 'Drag Dot, tap the garden, or use the arrow keys.' : 'Follow the outlines. Find the clues.';
    canvas.style.cursor = inspect ? 'zoom-in' : c.mode === 'hide' && !solved ? 'grab' : 'default';
  }
  function render() {
    const c = current();
    $('#chapter').textContent = `CASE ${String(index + 1).padStart(2, '0')} / ${cases.length}`;
    $('#case-name').textContent = c.name;
    $('#heading').textContent = c.mode === 'hide' ? 'Make a hiding place.' : 'Where is Dot hiding?';
    const wanted = c.answer.join(' and '), outside = names.filter(n => !c.answer.includes(n));
    $('#instruction').textContent = c.mode === 'hide' ? `Move Dot inside the ${wanted}${outside.length ? ', but outside the ' + outside.join(' and ') : ''}.` : (c.prompt || 'Choose every shape that contains Dot.');
    $('#evidence').innerHTML = names.map((n, i) => {
      const chosen = c.mode === 'hide' ? c.answer.includes(n) : selected.includes(i);
      return `<button class="evidence-card" data-shape="${i}" aria-pressed="${chosen}" ${c.mode === 'hide' || solved ? 'disabled' : ''}>${tokenArt(i)}<span>${n[0].toUpperCase() + n.slice(1)}<small>${c.mode === 'hide' ? (chosen ? 'Dot goes inside' : 'Keep Dot outside') : 'Shape evidence'}</small></span><em>${chosen ? '✓' : ''}</em></button>`;
    }).join('');
    document.querySelectorAll('[data-shape]').forEach(b => b.onclick = () => {
      if (!ready || solved || paused || complete) return;
      const i = +b.dataset.shape; selected = selected.includes(i) ? selected.filter(v => v !== i) : [...selected, i];
      render();
    });
    $('#move-controls').hidden = c.mode !== 'hide' || solved;
    $('#progress-label').textContent = `${index + (solved ? 1 : 0)} / ${cases.length}`;
    $('#stamps').innerHTML = cases.map((_, i) => `<span class="stamp ${i < index || i === index && solved ? 'done' : i === index ? 'current' : ''}" aria-label="Case ${i + 1}: ${i < index || i === index && solved ? 'solved' : i === index ? 'current' : 'waiting'}">${i < index || i === index && solved ? '✓' : i + 1}</span>`).join('');
    $('#celebrate').hidden = !solved; updateControls(); draw();
  }
  function cancelVoice() { epoch++; window.ClassroomVoice?.cancel(); narrating = false; updateControls(); }
  async function say(text) {
    if (muted || paused || !window.ClassroomVoice) return;
    const ticket = ++epoch; narrating = true; updateControls();
    await ClassroomVoice.speak(text);
    if (ticket !== epoch) return;
    narrating = false; updateControls();
  }
  function beginRound() {
    cancelVoice(); selected = []; solved = false; complete = false; inspect = false; outline = -1; dragging = false; activePointer = null;
    const c = current(), target = c.mode === 'hide' ? { x: 255, y: 565 } : pointFor(c.answer, index);
    dot = { x: target.x, y: target.y }; lens = { x: dot.x, y: dot.y };
    $('#feedback').textContent = c.mode === 'hide' ? 'The ticked cards tell you where Dot should go.' : 'A little look can lead to a big discovery.';
    render();
  }
  async function check() {
    if (!ready || paused || narrating || complete) return;
    if (solved) {
      cancelVoice();
      if (index === cases.length - 1) {
        complete = true; $('#finish-message').textContent = `You solved all ${cases.length} garden mysteries. Every little clue discovered.`;
        $('#finish-dialog').showModal(); await say(speech.finish); return;
      }
      index++; beginRound(); await say(speech[current().mode]); return;
    }
    started = true;
    const actual = membership(dot.x, dot.y), expected = current().mode === 'hide' ? current().answer.map(n => names.indexOf(n)) : selected;
    const matched = actual.every((v, i) => v === expected.includes(i));
    const good = matched && (current().mode !== 'hide' || safety(dot.x, dot.y) >= 20);
    if (good) {
      solved = true; inspect = false; outline = -1;
      $('#feedback').textContent = current().explanation || `Clues confirmed! Dot is inside the ${current().answer.join(' and ')}.`;
      render(); await say(current().mode === 'hide' ? speech.placed : speech.good);
    } else {
      $('#feedback').textContent = current().mode === 'hide' ? (matched ? 'Nearly there! Move Dot a little farther from the outlines, so her hiding place is clear.' : 'Not yet. Match the ticked cards and keep Dot away from the other shape.') : 'Keep looking. Check every outline that surrounds Dot.';
      await say(current().mode === 'hide' ? speech.retryHide : speech.retry);
    }
  }
  function reset() {
    cancelVoice(); for (const d of [$('#finish-dialog'), $('#pause-dialog')]) if (d.open) d.close();
    paused = false; document.body.classList.remove('paused'); index = 0; started = true; beginRound(); void say(speech.welcome + ' ' + speech.find);
  }
  function position(e) { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height }; }
  function place(p) { dot = { x: Math.max(130, Math.min(840, p.x)), y: Math.max(220, Math.min(695, p.y)) }; draw(); }
  function moveDot(direction) {
    if (!ready || paused || solved || complete || current().mode !== 'hide') return;
    const d = { left: [-12, 0], right: [12, 0], up: [0, -12], down: [0, 12] }[direction];
    if (d) { inspect = false; outline = -1; place({ x: dot.x + d[0], y: dot.y + d[1] }); updateControls(); }
  }
  canvas.addEventListener('pointerdown', e => {
    if (!ready || paused || solved || complete) return;
    const p = position(e); started = true;
    if (inspect) { lens = { x: Math.max(100, Math.min(850, p.x)), y: Math.max(240, Math.min(640, p.y)) }; draw(); return; }
    if (current().mode !== 'hide') return;
    e.preventDefault(); cancelVoice(); canvas.focus({ preventScroll: true }); dragging = true; activePointer = e.pointerId; canvas.setPointerCapture(e.pointerId); place(p);
  });
  canvas.addEventListener('pointermove', e => {
    if (!ready || paused || solved || complete) return;
    const p = position(e);
    if (inspect) { lens = { x: Math.max(100, Math.min(850, p.x)), y: Math.max(240, Math.min(640, p.y)) }; draw(); }
    else if (dragging && activePointer === e.pointerId) place(p);
  });
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(type, () => { dragging = false; activePointer = null; });
  canvas.addEventListener('keydown', e => { const direction = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' }[e.key]; if (direction && current().mode === 'hide') { e.preventDefault(); moveDot(direction); } });
  $('#check').onclick = () => void check(); $('#restart').onclick = reset; $('#again').onclick = reset;
  $('#replay').onclick = () => { started = true; void say(speech[current().mode]); };
  $('#inspect').onclick = () => { if (!ready || paused || solved || complete) return; inspect = !inspect; outline = -1; lens = { x: dot.x, y: dot.y }; updateControls(); draw(); };
  document.querySelectorAll('[data-outline]').forEach(b => b.onclick = () => { outline = outline === +b.dataset.outline ? -1 : +b.dataset.outline; updateControls(); draw(); });
  document.querySelectorAll('[data-move]').forEach(b => b.onclick = () => moveDot(b.dataset.move));
  $('#voice').onclick = () => { muted = !muted; cancelVoice(); try { localStorage.setItem('shape-detective-muted', muted ? '1' : '0'); } catch {} updateControls(); };
  function pause() { if (paused || complete) return; paused = true; dragging = false; activePointer = null; cancelVoice(); document.body.classList.add('paused'); $('#pause-dialog').showModal(); }
  function resume() { paused = false; document.body.classList.remove('paused'); $('#pause-dialog').close(); updateControls(); canvas.focus({ preventScroll: true }); }
  $('#pause').onclick = pause; $('#resume').onclick = resume;
  $('#pause-dialog').addEventListener('cancel', e => { e.preventDefault(); resume(); });
  $('#finish-dialog').addEventListener('cancel', e => { e.preventDefault(); cancelVoice(); $('#finish-dialog').close(); complete = false; updateControls(); });
  $('#fullscreen').onclick = () => { if (document.fullscreenElement) document.exitFullscreen?.(); else document.documentElement.requestFullscreen?.().catch(() => {}); };
  window.addEventListener('keydown', e => { if (e.key.toLowerCase() === 'f' && !e.ctrlKey && !e.metaKey && !e.target.closest('input,textarea')) { e.preventDefault(); $('#fullscreen').click(); } });
  document.addEventListener('visibilitychange', () => { if (document.hidden && ready && !complete) pause(); });
  window.addEventListener('pagehide', () => window.ClassroomVoice?.cancel());
  $('#home').addEventListener('click', cancelVoice);
  window.render_game_to_text = () => JSON.stringify({ ready, index, total: cases.length, mode: current().mode, solved, complete, paused, muted, narrating, selected: selected.map(i => names[i]), target: current().mode === 'hide' ? current().answer : undefined, dot, containing: membership(dot.x, dot.y).map((v, i) => v ? names[i] : null).filter(Boolean), inspect, outline, custom, coordinates: '1000x780, origin top left, x right and y down', geometry: { circle: { x: 470, y: 335, r: 215 }, square: { x: 480, y: 355, size: 330 }, triangle: [[320, 265], [165, 665], [730, 665]] } });
  window.advanceTime = ms => { time += ms; draw(); };
  function load(image, src) { return new Promise((resolve, reject) => { image.onload = resolve; image.onerror = () => reject(Error('Could not load ' + src)); image.src = src; }); }
  render();
  Promise.all([load(background, 'assets/garden.webp'), load(ladybird, 'assets/dot.webp')]).then(() => {
    ready = true; $('#asset-status').hidden = true; beginRound();
  }).catch(error => { $('#asset-status').textContent = 'The garden artwork could not load. Please reload the page.'; console.error(error); });
})();
