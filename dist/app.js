const state = { grade: "all", subject: "all" };
const grades = document.querySelector("#grades");
const subjects = document.querySelector("#subjects");
const dialog = document.querySelector("#details");
const art = {
  words: '<span class="paper">C L U E<br>W O R D<br>F I N D</span><span class="lens">⌕</span>',
  numbers: '<span class="number n1">7</span><span class="number n2">+</span><span class="number n3">5</span><span class="number n4">= ?</span>',
  science: '<span class="orbit">✳</span><span class="specimen">◒</span><span class="science-tag">Observe. Sort. Discover.</span>',
  time: '<span class="time-path"></span><span class="year y1">1789</span><span class="year y2">1969</span><span class="year y3">TODAY</span>',
  perspectives: '<span class="bubble b1">What if…</span><span class="bubble b2">I see it<br>differently.</span>',
  conversation: '<span class="language l1">Hello!</span><span class="language l2">¡Hola!</span><span class="language l3">Bonjour!</span>'
};
function render() {
  grades.innerHTML = ["all", ...Array.from({length: 12}, (_, i) => i + 1)].map(grade => `<button class="grade ${state.grade === grade ? "active" : ""}" data-grade="${grade}" aria-pressed="${state.grade === grade}">${grade === "all" ? "All grades" : `<span>Grade</span> ${grade}`}</button>`).join("");
  subjects.innerHTML = SUBJECTS.map(subject => `<button class="subject ${state.subject === subject.id ? "active" : ""}" data-subject="${subject.id}" aria-pressed="${state.subject === subject.id}"><span class="subject-icon" aria-hidden="true">${subject.icon}</span>${subject.name}<span class="subject-arrow" aria-hidden="true">↗</span></button>`).join("");
  const filtered = GAMES.filter(game => (state.grade === "all" || game.grades.includes(state.grade)) && (state.subject === "all" || game.subject === state.subject));
  const subject = SUBJECTS.find(item => item.id === state.subject);
  document.querySelector("#library-title").textContent = state.subject === "all" ? "All game concepts" : subject.name;
  document.querySelector("#results").textContent = `${filtered.length} game concept${filtered.length === 1 ? "" : "s"} · ${state.grade === "all" ? "All grades" : `Grade ${state.grade}`}`;
  document.querySelector("#reset").hidden = state.grade === "all" && state.subject === "all";
  document.querySelector("#empty").hidden = filtered.length !== 0;
  document.querySelector("#games").innerHTML = filtered.map(game => `<article class="game-card"><button class="game-open" data-game="${game.id}" aria-label="View ${game.title} concept"><div class="game-art ${game.artwork}" aria-hidden="true">${art[game.artwork]}<span class="coming">COMING SOON</span></div><div class="card-body"><div class="card-meta"><span>${SUBJECTS.find(s => s.id === game.subject).name}</span><span>Grades ${game.grades[0]}–${game.grades.at(-1)}</span></div><h3>${game.title}<span aria-hidden="true">↗</span></h3><p>${game.description}</p><div class="card-footer"><span>◷ &nbsp;${game.minutes}</span><span>${game.mode}</span></div></div></button></article>`).join("");
}
grades.addEventListener("click", event => {
  const button = event.target.closest("[data-grade]");
  if (!button) return;
  state.grade = button.dataset.grade === "all" ? "all" : Number(button.dataset.grade);
  render();
  grades.querySelector(`[data-grade="${state.grade}"]`).focus();
});
subjects.addEventListener("click", event => {
  const button = event.target.closest("[data-subject]");
  if (!button) return;
  state.subject = button.dataset.subject;
  render();
  subjects.querySelector(`[data-subject="${state.subject}"]`).focus();
});
function reset() { state.grade = "all"; state.subject = "all"; render(); grades.querySelector("button").focus(); }
document.querySelector("#reset").addEventListener("click", reset);
document.querySelector("#empty-reset").addEventListener("click", reset);
document.querySelector("#games").addEventListener("click", event => {
  const button = event.target.closest("[data-game]");
  if (!button) return;
  const game = GAMES.find(item => item.id === button.dataset.game);
  document.querySelector("#detail-content").innerHTML = `<span class="eyebrow">GAME CONCEPT · COMING SOON</span><h2 id="detail-title">${game.title}</h2><p>${game.description}</p><div class="detail-facts">Grades ${game.grades[0]}–${game.grades.at(-1)} · ${game.minutes} · ${game.mode}</div><h3>Learning focus</h3><p>${game.objective}</p><div class="detail-note">This is an early game idea. Playable games and teacher customization will be added in a future phase.</div>`;
  dialog.showModal();
});
document.querySelector(".close").addEventListener("click", () => dialog.close());
document.querySelector(".dialog-done").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if(event.target === dialog) { const r=dialog.getBoundingClientRect(); if(event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) dialog.close(); } });
render();
if (document.modelContext?.registerTool) {
  const lifecycle = new AbortController();
  try {
    Promise.resolve(document.modelContext.registerTool({
      name: "filter_game_concepts",
      description: "Filter Oxford's visible game concept library by grade and subject. Does not start a playable game.",
      inputSchema: { type: "object", properties: { grade: { enum: ["all",1,2,3,4,5,6,7,8,9,10,11,12] }, subject: { enum: SUBJECTS.map(subject => subject.id) } }, required: ["grade","subject"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!input || !["all",1,2,3,4,5,6,7,8,9,10,11,12].includes(input.grade) || !SUBJECTS.some(subject => subject.id === input.subject) || Object.keys(input).some(key => !["grade","subject"].includes(key))) throw new Error("Choose a valid grade and subject.");
        state.grade = input.grade;
        state.subject = input.subject;
        render();
        return { grade: state.grade, subject: state.subject, summary: document.querySelector("#results").textContent };
      }
    }, { signal: lifecycle.signal })).catch(() => {});
  } catch {}
  window.addEventListener("pagehide", () => lifecycle.abort(), { once: true });
}
