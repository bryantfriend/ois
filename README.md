# Oxford Classroom Games

Live: https://bryantfriend.github.io/ois/ · Source: https://github.com/bryantfriend/ois

A teacher-facing library for Oxford International School, using its official logo and red/indigo branding. The library contains 106 editable lesson packs across 32 formats for English and Mathematics, grades 7 and 8. The new group/class packs reuse the prepared quiz question banks. Russian and Kyrgyz have separate sections; teachers can assign custom lessons to either.

## Four distinct modes

Every format has an explicit `SOLO`, `DUEL`, `TEAM`, or `CLASS` specification in `FORMATS`. A lesson's mode is derived from its format, including older saved/imported lessons. The library filter and card labels reflect that single mode.

- **Solo:** Rocket Rally, Ocean Rescue, Potion Partners, Bridge Builders, Lava Leap, Robot Rescue. One student owns the challenge and progress.
- **2 Player:** Hamster Tug of War, Hamster Dash, Treasure Quest. Two independent simultaneous touch panels, randomized question decks, and direct competition. Tug wins at a three-pull lead; Dash races to the pool size in correct answers; Treasure compares points after both decks finish.
- **Teams:** Kingdom Clash and Kareem-Boozled. Kingdom Clash: Two to six named groups share resources, roles, and investments. All captains lock their decisions before reveal. Correct answers earn wood, stone and gold. Farms/quarries improve later income; monuments earn prestige. One investment per group per round. Highest prestige plus one point per three leftover resources wins. Discuss away from the board; the teacher records agreed answers and decisions. Rotate captain, researcher and strategist each round.
- **Whole Class:** Four Corners, Save the World, and teacher-guided Midnight Mysteries. Four Corners uses movement, pointing or seated letter responses, optional teacher-entered vote counts, reveal and discussion, without individual winners. Save the World shares one health meter: start at 60, gain 10 for correct class decisions (cap 100), lose 15 for mistakes, and finish with health remaining to succeed together.

These are shared-screen activities. No student-device joining, networked sessions, accounts or backend are implemented. Polls use concealed, anonymous choices on one passed device; private roles also require passing that device while everyone else looks away. Group membership/role assignment happens in the room; team names and group count are saved in lesson settings.

## Teacher workflow

Filter by grade, subject, game mode or topic. Choose **Edit & play**, edit questions and answer choices, then launch. New Team/Class templates require 1–3 wrong choices (2–4 answers total). Simultaneous duel formats also require wrong choices. Matching requires unique answers; sequences use `|` between steps.

Paste tab-separated spreadsheet rows: question, answer, optional semicolon-separated wrong choices, optional hint. Save browser-local copies or download versioned JSON lesson files to transfer between devices/sites. Limits: 2–40 questions per lesson and 100 saved copies per browser. No student records are collected. The content is a starting point for teacher review, not a verified mapping to a particular Oxford textbook edition.

## Local development and deployment

Node.js required; no dependencies or build step for the application.

    npm run dev
    npm run check

Preview: http://127.0.0.1:4174. `dist` contains authored, tracked source. GitHub Actions checks syntax and publishes `dist` whenever `main` changes. `.openai/hosting.json` is historical metadata from the initial preview; GitHub Pages is the current host.

- `dist/catalog.js`: prepared data, format/mode specifications.
- `dist/app.js`: library, validation, lesson editing/persistence, original game engines.
- `dist/tug.js`: independent two-player decks and touch controls.
- `dist/modes.js`: team strategy, classroom voting, shared class objective, and setup.
- `dist/arcade.js`, `dist/arcade.css`: procedural animation, effects, optional sound and reduced-motion support.
- `dist/assets/oxford-logo.png`: original logo from https://oxford.kg/wp-content/uploads/2024/09/logo.png.

Hamster Dash's markings wrap continuously; wrong answers randomly trigger a tumble, sneeze, dizzy wobble, hop or squash on that player's hamster. Motion-off uses static cues. All artwork/animation is local; no external game pages are embedded.

## Verification

Browser runners require Playwright and Chromium. Set `OXFORD_PLAYWRIGHT_MODULE` to its `index.mjs` if needed, and `OXFORD_TEST_URL` to change the preview URL. Screenshots go into ignored `output/`.

- `scripts/qa.mjs`: complete the 56 original lesson packs and verify original gameplay/edit/import/export flows.
- `scripts/qa-modes.mjs`: exclusive mode filters; new templates; team setup/save/export; lock/reveal rules; investments/income; class vote counts; shared success/failure; replay and mobile.
- `scripts/qa-duel.mjs`, `scripts/qa-tug.mjs`: simultaneous native browser touch, independent decks, scoring, restarts and layouts.
- `scripts/qa-hamster.mjs`: five reactions, player isolation, expiry and track visibility through an hour.
- `scripts/qa-arcade.mjs`, `scripts/qa-teacher.mjs`: animation and focused teacher/keyboard/fullscreen checks.

`render_game_to_text()` includes mode and group/class session state. `advanceTime(ms)` steps visual animation deterministically; ordinary play uses requestAnimationFrame. Question feedback delays use real timers.

GP_Games inspiration includes the user's hamster runner, Kareem-Boozled and ocean-cleaner games. Next content priorities: curriculum alignment, more question banks, and authored Russian/Kyrgyz packs.

## Kareem-Boozled

Adapted from https://bryantfriend.github.io/GP_Games/kareemboozled.html. A shuffled hidden tile board mixes editable lesson questions with 0, 2, 4 or 8 surprise tiles. The original reward (+15) and five effects are preserved: score swap, steal up to 20, lose up to 20, gain 50, and a rival loses up to 20. Expanded to 2–6 named teams; targeted effects let the active group choose a rival. Teacher reveals and marks spoken answers, then advances the turn. No negative scores or repeated effects. All tiles must be used before the winner/tie is announced. Four prepared English/Math grade 7/8 packs reuse existing quiz banks; custom questions and team/surprise settings save and export normally. Visuals, sound and reduced-motion behavior use the Oxford engine; no external page embedding or runtime dependencies.

`scripts/qa-boozled.mjs` completes all four packs and checks every surprise against a separate score ledger, target choice, duplicate activation, replay, six teams, zero-surprise mode, wrong answers, custom import/export and mobile layout.

## Expanded Teams and Whole Class catalogue

All twenty requested concepts are available: eighteen new formats plus Kingdom Clash (enhanced with armies and raid defenses) and the existing shared planet game renamed Save the World. Existing lesson IDs remain compatible. Fifty new editable packs bring the total to 106.

Each entry below has separate Grade 7 and Grade 8 banks. English uses vocabulary in context, persuasive writing, interpretation and language clues; Math uses signed-number operations, powers, roots and numerical comparisons. Opinion polls have specially written discussion prompts with no correct answer. Teachers can change the content and grade before playing. These are suggested subject placements, not a textbook-specific curriculum claim.

| Mode | Subjects | Games |
|---|---|---|
| Teams | English and Math | Kingdom Clash, Territory Wars, Boss Raid, Treasure Fleet, Capture the Crystal |
| Teams | English | Survival Island, Spy Network |
| Teams | Math | Race to Mars, Build It!, Classroom Tycoon |
| Whole Class | English and Math | Save the World, Defeat the Monster, Classroom Escape Room, Class Streak |
| Whole Class | English | Guess What the Class Thinks, Disaster!, Who Is the Impostor?, Classroom Adventure |
| Whole Class | Math | Class Mission Control, Higher or Lower |

Teams discuss one shared question, lock decisions before reveal, then commit strategic plans together. Territory Wars continues with recycled questions until its timer ends; contested captures leave ownership unchanged. Crystal defenses resolve before incoming attacks; simultaneous contributors share a capture. Build It! grants rare material for a correct answer on every third round. Short custom banks repeat where needed to allow at least five building rounds, four raid rounds or three Mars rounds.

Teacher settings include 2–6 named teams; 4–40 participants for private polls/roles; 1–2 impostors; and 5–30 active-play minutes for territory and escape games. Settings round-trip through saved lessons and JSON files. Timers pause when the page is hidden or the editor is open. Secret-role and polling flows are classroom honor-system privacy, not authenticated multi-device sessions. Higher or Lower requires numeric answers; secret games accept terms/clues; all other new question formats require 2–4 distinct choices.

- `dist/expansion-catalog.js`: new format metadata, subject/grade placement, specialized poll and numeric banks.
- `dist/expansion.js`: private information, strategic team rounds, cooperative branches, timers and animated progress displays.
- `scripts/qa-expansion.mjs`: launch all 50 new packs; complete every new format; check replay and mobile widths.
- `scripts/qa-expansion-edges.mjs`: failure paths, timer penalties, contested territory, crystal defenses, pending-plan persistence, concealed ballots/roles, custom settings and numeric validation.
