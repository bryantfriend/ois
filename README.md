# Oxford Classroom Games

Live: https://bryantfriend.github.io/ois/ · Source: https://github.com/bryantfriend/ois

A teacher-facing library for Oxford International School, using its official logo and red/indigo branding. The library contains 176 editable lesson packs across 54 formats for English and Mathematics, grades 7 and 8. The new group/class packs reuse the prepared quiz question banks. Russian and Kyrgyz have separate sections; teachers can assign custom lessons to either.

## Four distinct modes

Every format has an explicit `SOLO`, `DUEL`, `TEAM`, or `CLASS` specification in `FORMATS`. A lesson's mode is derived from its format, including older saved/imported lessons. The library filter and card labels reflect that single mode.

- **Solo:** Rocket Rally, Ocean Rescue, Potion Partners, Bridge Builders, Lava Leap, Robot Rescue. One student owns the challenge and progress.
- **2 Player:** Hamster Tug of War, Hamster Dash, Treasure Quest. Two independent simultaneous touch panels, randomized question decks, and direct competition. Tug wins at a three-pull lead; Dash races to the pool size in correct answers; Treasure compares points after both decks finish.
- **Teams:** Kingdom Clash and Oxford-Boozled. Kingdom Clash: Two to six named groups share resources, roles, and investments. All captains lock their decisions before reveal. Correct answers earn wood, stone and gold. Farms/quarries improve later income; monuments earn prestige. One investment per group per round. Highest prestige plus one point per three leftover resources wins. Discuss away from the board; the teacher records agreed answers and decisions. Rotate captain, researcher and strategist each round.
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

GP_Games inspiration includes the user's hamster runner, Oxford-Boozled and ocean-cleaner games. Next content priorities: curriculum alignment, more question banks, and authored Russian/Kyrgyz packs.

## Oxford-Boozled

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

Oxford-Boozled opens with a team setup dialog from either library action or a direct game link. Choose 2–6 teams (two by default), optionally rename them, and continue to play or edit questions. Blank names fall back to Red, Blue, Green, Yellow, Purple and Orange. Saved team settings populate the dialog; existing boozled lesson IDs and downloads remain compatible. `scripts/qa-boozled-setup.mjs` covers setup, defaults, saved names, cancel and mobile behavior.

## Team launch and smartboard display

Every Teams format now uses the shared 2–6-team launch dialog, with optional custom names and default color names. Existing saved settings populate the screen. Continue starts the prepared lesson; Edit questions first retains the selected teams in the editor.

Landscape displays at least 1024 pixels wide automatically use the full play area. Main questions and answers use 20–32px text and touch controls are at least 48px high. Scores and teacher controls stay on screen; decorative artwork yields space when necessary. Long custom content remains scrollable inside the game area instead of being clipped. Full screen remains available from the toolbar; F does not interrupt typing in input fields.

Kingdom Clash uses a compact investment selector with costs, effect and confirmation; unavailable investments stay disabled. Territory Wars places its map beside the current challenge. `dist/team-setup.js`, `dist/smartboard.css` and `dist/smartboard.js` contain the shared changes. `scripts/qa-smartboard.mjs` checks all 32 formats at 1920×1080 and 1366×768, including six-team planning screens, every team count, fullscreen and long custom content.

## Subject navigation

Expandable groups organize Language (English, Russian, Kyrgyz), Science (Chemistry, Biology, Physics, General Science), and Computer (ICT, Computer Science). Mathematics, Humanities and Global Perspectives remain direct choices. The lesson editor uses the same groups; new subject IDs are valid in saved and imported lessons. Existing science lessons retain their ID under General Science. New subject shelves accept teacher-authored content; no new question banks were added with this navigation change.

## Activity collection

Twenty-two additional formats contribute 70 editable Grade 7–8 starter packs, bringing the library to 176 packs / 54 formats.

- **Teams:** Gameshow Quiz (turns, streaks, one 50:50 per team), Win or Lose Quiz (25/50/100-point stakes). Both use the shared 2–6-team setup.
- **Whole Class:** Flip Tiles (reveal and revisit), Labelled Diagram (place labels on an animal cell), Watch and Memorize (recall a sequence).
- **Solo:** Type the Answer, Wordsearch, Spell the Word, Hangman, Crossword, Maze Chase, True or False, Flying Fruit, Pair or No Pair, Balloon Pop, Airplane, Image Quiz, Whack-a-mole, Rank Order, Speed Sorting, Maths Generator, Word Magnets.

English word puzzles use grade-specific vocabulary; sentence magnets use word-level sentence construction. Math packs cover arithmetic, comparisons and geometry. Labelled Diagram starts in Biology with cell structures/functions. Most question-driven formats have both English and Math banks; teachers can reassign custom content to any supported subject.

Image Quiz supports an image upload for every question. Labelled Diagram supports one image plus up to twelve tap-positioned markers. Browser uploads accept PNG/JPEG/WebP up to 8 MB and compress them to at most 300,000 data-URL characters each; all image content stays in the lesson file or local browser storage. Total activity lesson payload is limited to 5 MB; import accepts files up to 6 MB. Default geometry and cell art is local SVG markup, with no external image service.

Wordsearch and Crossword accept 2–12 distinct words of 2–14 letters. Crosswords connect words when possible and can include disconnected entries for word sets with no shared letters. Wordsearch supports reversed and diagonal words. Hangman uses a kite illustration and six misses per word. Maze answers occupy separate dead ends; the chaser starts behind the player and moves every second step. Airplane crosses answer gates after ten active seconds; Speed Sorting runs for sixty active seconds. Hidden tabs and the editor pause activity time. Motion-off stops decorative animations while preserving required gameplay movement.

Maths Generator stores operation, maximum factor/operand and 2–40-question settings. Each run generates a new bank; division constructs whole-number answers and may use a dividend larger than the factor limit. Word Magnets supports both tapping and HTML drag/drop; keyboard-accessible taps are available for every magnet. Rank Order uses explicit up/down controls.

New implementation: `dist/activities-catalog.js`, `dist/activities.js`, `dist/activities.css`. Verification: `scripts/qa-activities.mjs` (all packs and each format), `scripts/qa-activity-edges.mjs` (image/marker persistence, generator settings, failure and scoring guards), and `scripts/qa-activity-layout.mjs` (all 70 starts plus crossword entry and diagram alignment at 1366×768).
