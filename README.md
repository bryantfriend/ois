# Oxford Classroom Games

A standalone teacher-facing game library for Oxford International School. The official logo is used unchanged from https://oxford.kg/wp-content/uploads/2024/09/logo.png. Red, indigo, and white guide the interface.

## Run locally

Node.js is required. No application dependencies or build step are needed.

    npm run dev

Open http://127.0.0.1:4174. A different port can be passed to `node scripts/serve.mjs 4180`.

    npm run check

## What is included

- 40 prepared lessons: 10 English and 10 Mathematics lessons for each of grades 7 and 8; 240 prepared questions/pairs/sequences.
- 10 playable formats: Quiz Sprint, Tug of War, Relay Race, Sort It Out, Match Pairs, Sequence Builder, Challenge Board, Confidence Quest, Three-Life Challenge, and Clue Detective.
- Separate Russian and Kyrgyz sections, plus the existing subject categories. Language lesson banks have not yet been authored, but custom lessons can be assigned to these subjects.
- Grade, subject and text filters; direct play; a shared teacher editor; editable team names; optional shuffled question order.
- Editable questions, answers, distractors, hints, and explanations. Spreadsheet paste can append questions or replace the deck.
- Browser-local saved copies and versioned JSON downloads/imports. No accounts, server database, or student records.
- Accessible HTML game controls with a canvas showing progress, team tracks, or tug-of-war position. Classroom presentation/fullscreen mode and result reviews.

The 40 entries are distinct grade/subject lesson packs across 10 reusable game formats, not 40 independently implemented engines. Grade placement is an initial proposal, not a verified mapping to a specific curriculum or Oxford textbook edition.

## Teacher workflow

1. Select grade and subject. Choose **Edit & play** on a game, or use the play button for its prepared questions.
2. Change the title, topic, or questions. For multiple-choice formats, add wrong choices one per line. Without wrong choices, the teacher marks spoken answers.
3. For matching, each answer must be unique. For sorting, supply another category as a wrong choice. For sequences, use `|` between steps in the correct order.
4. Paste tab-separated rows from a spreadsheet: question, answer, optional semicolon-separated wrong choices, optional hint. Review before play.
5. **Save to My lessons** saves to this browser only. **Download lesson file** creates a portable backup. **Open a lesson file** restores a downloaded lesson into the editor.
6. Play, discuss feedback, and review missed questions at the end. Custom copies never mutate prepared lessons.

Lesson files contain a `schemaVersion: 1` envelope and a validated `lesson` object. Limit: 2–40 questions per lesson and 100 browser-local saved copies. Browser data is not synced or guaranteed to survive clearing browser storage; the UI explains this and offers downloads.

## Source

- `dist/index.html`: library, editor and classroom surfaces.
- `dist/catalog.js`: subject taxonomy, format rules and prepared content.
- `dist/app.js`: validation, teacher workflow, persistence, import/export and game state.
- `dist/styles.css`: Oxford colors, responsive layouts, projector-friendly controls.
- `dist/assets/oxford-logo.png`: official school logo.
- `scripts/serve.mjs`: local preview.
- `scripts/qa.mjs`: Playwright functional and responsive regression checks.

`dist` contains authored source and must stay tracked. The live site is https://bryantfriend.github.io/ois/ and its repository is https://github.com/bryantfriend/ois. GitHub Actions checks JavaScript and publishes `dist` to GitHub Pages whenever `main` is updated. The Pages workflow can also be run manually from the Actions tab. Teacher lesson copies are saved per browser and website; use Download lesson file and Open a lesson file to transfer copies from the local preview to the hosted site.

## QA

The browser QA runner requires the `playwright` package and a Chromium browser. Install it in a development environment or set `OXFORD_PLAYWRIGHT_MODULE` to an existing installation's `index.mjs`. Set `OXFORD_TEST_URL` to test another local preview URL. Then run `node scripts/qa.mjs`.

The runner completes all 40 prepared lessons, tests incorrect-answer paths and game-specific rules, exercises teacher edit/paste/save/reload/import/export, checks invalid data, and captures desktop/mobile screenshots under ignored `output/qa/`. `window.render_game_to_text()` exposes the current visible game state; `window.advanceTime(ms)` redraws deterministic progress (these games have no real-time timer).

## Inspiration and next work

Reviewed https://github.com/bryantfriend/GP_Games and its tug-of-war, paraphrase relay, question sorting, and team-board ideas. Oxford implements its own shared engine and editor rather than embedding pages with hard-coded lesson data.

Next: review the content against the school's grade 7/8 curriculum, expand question banks, and author Russian/Kyrgyz lessons. Cross-device accounts or collaborative lesson storage require a separately designed backend.

Additional focused checks: `node scripts/qa-teacher.mjs` exercises paste replacement, unsaved work prompts, fullscreen transitions, custom spoken answers, validation, keyboard focus and the structured-filter contract in a simulated WebMCP context. Native in-app WebMCP verification was not repeated for this revision.

## Animated game worlds

The student-facing experience now uses ten animated canvas worlds: Rocket Rally, Hamster Tug of War, Hamster Dash, Ocean Rescue, Potion Partners, Bridge Builders, Treasure Quest, Lava Leap, Robot Rescue, and Midnight Mysteries. All 40 lesson packs use these scenes, with their existing learning and scoring rules.

`dist/arcade.js` reacts to the actual game state: moving hamsters and rope, rocket progress, animated sea life, potion filling, bridge planks, treasure chests, lava-platform movement, robot energy/shields, and illuminated city windows. It adds success/miss reactions, confetti, optional synthesized sound, and a motion control that respects the OS reduced-motion preference. Sound starts off. Sorting supports HTML drag-and-drop as well as existing click/touch/keyboard controls. `dist/arcade.css` styles the student play areas and colorful library thumbnails. The teacher editor retains the simpler school branding.

Inspiration reviewed in detail: GP_Games/hamsterruner.html (running characters and answer-driven travel), GP_Games/kareemboozled.html (bright team boards, animated reveals, synth sound), and GP_Games/oceancleaner.html (octopus animation, bubbles, and collection feedback). Procedural art is implemented locally; the page does not depend on those source pages or external assets.

Run `node scripts/qa-arcade.mjs` with the same Playwright setup to check ten animated scenes, automatic movement, particles/expiry, eased rope motion, sound and motion toggles, dragging, reduced motion, new-name search, and mobile layouts. Test-only `advanceTime(ms)` switches the scene to manual stepping for deterministic capture; ordinary play runs through requestAnimationFrame.


## Simultaneous Tug of War

Two students play side by side on a multi-touch board. Each has an independently shuffled deck from the same teacher-edited pool; each deck uses every question before refilling. Correct answers pull one step toward that player's side, and a three-step lead wins. Wrong answers do not move the rope. Each side advances automatically after brief feedback, without interrupting the other side. Questions require at least one wrong choice for independent answering. The game supports mouse and keyboard as well as simultaneous touch input.

Run `node scripts/qa-tug.mjs` for native two-pointer touch, deck cycling, opponent-panel stability, win/restart, custom-pool validation, keyboard and mobile checks.
