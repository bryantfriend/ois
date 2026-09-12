# Oxford Classroom Games

Live: https://bryantfriend.github.io/ois/ · Source: https://github.com/bryantfriend/ois

A teacher-facing library for Oxford International School, using its official logo and red/indigo branding. The library contains 490 editable lesson packs across 191 formats, including Grades 1–6 maths, logic, physics and computing alongside Grades 7–8 English and Mathematics. The new group/class packs reuse the prepared quiz question banks. Russian and Kyrgyz have separate sections; teachers can assign custom lessons to either.

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

## Reference template collection

Added all 12 templates from the teacher’s image: Match Up, Quiz, Flash Cards, Speaking Cards, Group Sort, Complete the Sentence, Spin the Wheel, Find the Match, Anagram, Unjumble, Open the Box and Matching Pairs. They add 42 grade 7–8 packs: all twelve have English starters; nine also have Math starters.

Speaking Cards, Spin the Wheel and Open the Box use Whole Class mode. The other templates use Solo mode with large shared-board controls. Existing formats remain available. Matching and sorting support drag-and-drop plus tap controls; letter/word building also supports undo and clear. Flash Cards keeps missed cards in the review deck. Wheel and speaking prompts do not repeat within a round.

Teachers use the existing Edit & play, paste, save and lesson-file controls. Matching lessons support up to 12 unique pairs; Group Sort supports up to six categories. Complete the Sentence uses exactly one ___ blank per prompt. Anagram answers use 2–14 letters; Unjumble accepts 2–12 words separated with |.

Implementation: dist/templates.js and dist/templates.css. Browser QA: scripts/qa-templates.mjs and scripts/qa-template-edges.mjs.

## Early-primary visual games

Interpreted the sixteen distinct activity types in the teacher’s unlabelled image: Block Builder, Shape Detective, Picture Sudoku, Picture Analogies, Follow the Path, Count and Match, Number Tracing, Missing Picture Piece, Feelings Faces, Picture Maths Grid, Symmetry Drawing, Picture Strip Puzzle, Picture Addition, Turn the Tiles, Direction Patterns and Letter Tracing. Cropped repeated tiles were not duplicated.

Each has three Grade 1–3 starter packs (48 total), placed in English for feelings, pre-writing and letter formation, and Math for counting, number formation and spatial/logic puzzles. Grade shortcuts now include 1, 2 and 3. These are foundational practice packs; teachers can change their grade placement.

The editor provides ready-made variation selectors plus editable prompts, puzzle setups and explanations. Format instructions describe each setup: counts, picture sets, shape names, block heights, tile rotations or symmetry points. Tracing supports all capital letters A–Z and digits 0–9, uses ordered strokes, and checks pointer progress along the path. Paths are stylized block letter guides. Picture artwork is native SVG; no external image downloads are needed.

Tests: scripts/qa-primary.mjs covers all 48 launches, all sixteen complete games/replays/mobile widths and real pointer tracing. scripts/qa-primary-edges.mjs covers retries, fixed clues, reverse symmetry paths, undo/drag, tracing boundaries after resize, grade navigation and all sixteen preset/save/reopen workflows with a lesson-file round-trip.

## PlayMath-inspired collection

The September 2026 directory contains 105 titles. Oxford now provides 104 original classroom adaptations plus the existing Number Tracing game. Use **Explore 104 new maths & logic games** or search by either the Oxford title or source title. Each pack has a suggested grade, subject and player mode. The full mapping is in [docs/playmath-coverage.json](docs/playmath-coverage.json).

These are independently written, simplified classroom games with original artwork and levels, not copies of PlayMath or its publishers’ commercial games. They cover number models, logic grids, geometric puzzles, movement, merging, sorting, drawing physics, resource economies and traditional board games. Several related source titles intentionally share a classroom engine and a smaller rule set. The economic games are short decision simulations; falling-block games use deliberate placement rather than timed arcade falling; drawing-outline games use touchable anchor points. They do not include the source games’ campaigns, licensed characters, commercial art, online opponents or full progression systems.

Teachers can change the title, instructions, grade, subject and challenge numbers, save a copy, and import/export JSON. Challenge numbers 1–99 reproduce seeded puzzle variations where supported; standard board positions and fixed introductory puzzles do not change with every seed. These puzzle packs do not turn arbitrary uploaded lesson questions into puzzles. Existing quiz and vocabulary editors remain available for that workflow. Two-player board games take turns according to their rules; Times Racers uses independent simultaneous touch panels.

Chess uses chess.js 1.4.0 under its BSD-2-Clause license, included in `dist/vendor/chess.js`. Other new engines have no external runtime dependencies.

Validation: `qa-lab.mjs` completes the number/logic packs; `qa-lab-path.mjs` covers route and traditional games; `qa-lab-collection.mjs` covers the remaining engines; `qa-lab-edges.mjs` checks rule edges, all 10,296 seed initializations, teacher files and simultaneous touch; `qa-lab-layout.mjs` checks all 104 starter screens at 1366×768. Initialization checks do not claim every generated puzzle was solved.

Whack-a-Mole uses a nine-hole animated garden. Each question’s answer choices appear in distinct random holes, rise, hold for reading, and duck down before the next wave. Only visible raised moles accept hits. Tap, use keys 1–9, or freeze the moles for more reading time; wrong hits cost hearts. Teacher-authored question pools are preserved. Focused coverage: `scripts/qa-mole.mjs`.

## Picture Vocabulary

A solo picture-to-word game with large illustrated clues, two to four answer choices, feedback, points and progress. Four starter packs cover everyday English (Grade 2), scientific English (Grade 7), science vocabulary (Grade 5) and ICT equipment (Grade 7). Teachers can change the grade and subject, edit the words, select one of fourteen original illustrations, or upload a picture for each question. Uploaded pictures are compressed and included in saved/downloaded lessons. The optional Listen button uses browser speech synthesis and available device voices.

`scripts/qa-picture-vocab.mjs` checks all four packs, scoring, replay, keyboard input, layouts, picture editing, uploads, save/export/import and validation.

## Geography smartboard collection

116 playable adaptations cover all 58 topics in the supplied 7A, 7BC and Grade 8 plan, with 29 lessons in each mode. Four Geography mode engines share nine task types: source choices, ordered stages, map markers, scale measurements, memory maps, profiles, glacier mass balance, token planning, and teacher-reviewed explanations. Each lesson has recognition, application and explanation checkpoints plus an individual exit prompt.

Two-player panels accept simultaneous native touch and repaint independently. Teams choose 2–6 names and all lock their answers before shared review; whole-class games share progress. Teachers edit sources, answers, maps/markers, budgets and models. Uploaded maps stay with browser saves and exported lesson JSON.

These are adaptations rather than full recreations of every physical/hidden-information activity. Textbook-specific evidence is not available: the Thames file is explicitly fictional, and Africa history uses source-evaluation practice. Maps are schematic and example data/budgets are labelled. The teacher guide lists each original idea, implemented task and source notes: `dist/geography-guide.html`. Regenerate it with `node scripts/build-geography-guide.mjs`.

Verification: `scripts/qa-geography.mjs` completes all 116 packs and checks native two-touch, team locking, save/import/export, uploaded maps and mobile; `qa-geography-layout.mjs` checks every application screen; `qa-geography-edges.mjs` covers boundary cases, other screen states and guide filtering.

Geography visual worlds: all 116 activities have illustrated catalogue cards and mission banners. Ten original SVG worlds share five character guides, with topic-specific hooks, coloured answer tiles and animated environment details. Correct answers trigger a hop/star reaction; mistakes trigger an encouraging wobble. CSS SVG animation respects both OS reduced motion and the in-game motion toggle. `dist/geography-art.js` / `.css` decorate existing render paths while keeping two-player panels independent. `scripts/qa-geography-art.mjs` checks world coverage, unique SVG IDs, reactions, motion settings and mobile.

### Geography practical missions (September 2026)
All 116 Geography catalogue activities now contain two practical missions. Eighteen shared interaction families replace the recognition/application/explanation quiz loop. Original topic/grade/mode assignments and animated SVG worlds remain. Data, constraints and worked checks are editable; old saved question-based Geography lessons still use their original supported engine.

Run `node scripts/qa-geography-missions.mjs` for complete catalogue play-throughs and smartboard checks, and `node scripts/qa-geography-mission-edges.mjs` for native multi-touch, dragging, revision, team locking and editor validation. Set `OXFORD_PLAYWRIGHT_MODULE` to the installed Playwright entry point where needed. The earlier Geography QA files document the previous catalogue shape; the mission suites supersede those shape-specific checks. Regenerate the teacher guide with `node scripts/build-geography-guide.mjs`.
