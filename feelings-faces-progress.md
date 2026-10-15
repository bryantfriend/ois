Original prompt: Implement sticker-book Feelings Faces concept 5 for a Kyrgyz international school. Five characters (hijab girl, kalpak boy, football boy, everyday girl, snow leopard), 12 feelings each. Curtains reveal faces, correct answers trigger confetti then curtains close and open for the next round.

- Using original generated 4 × 3 expression sheets, extracted into 60 local WebP portraits.
- Feelings: happy, sad, surprised, angry, worried, sleepy, excited, scared, proud, shy, confused, calm.
- Keep existing OIS lesson/editor integration; new game renderer only for the emotions activity.
- Shared Sonia narration must be bundled and awaited, with cancellation on pause/mute/navigation/restart.
- Implemented `dist/feelings-faces.js` and `.css`, loaded after existing OIS scripts. All twelve feelings accepted; existing saved lessons keep their original question decks.
- All 60 WebP portraits bundled under `dist/assets/feelings-faces` (about 1.6 MB total). Original sheets and built-in image-generation prompts preserved at `../output/feelings-faces-art`.
- Local Sonia recordings generated and synchronized into `dist/shared/voice`; text catalog in `feelings-voice-texts.json` and shared library generator.
- Sequence: closed/loading -> opening -> spoken prompt -> answer -> confetti + awaited spoken praise -> closing -> change round while fully closed -> opening. Final round reveals the completion screen.
- Mixed or fixed characters; six shuffled choices per round; twelve default rounds. Wrong answers allow retry; success immediately locks input.
- Pause, mute, visibility, navigation, restart confirmations and replay cancel narration. Reduced motion uses short curtains and static confetti. Keyboard: 1–6 answers, P pause, M mute, F fullscreen.
- Required skill client and `scripts/qa-feelings-faces.mjs` passed: 60 assets, natural narration, awaited praise, retries, character changes, intermediate/closed curtains, confetti, duplicate-input lock, pause/resume, mute, restart, all 12 rounds, replay, reduced motion, navigation and primary-activity regression.
- Layout screenshots inspected at 390×844, 768×1024, 1024×600, 1366×768 and 1920×1080. Artifacts: `../output/feelings-faces-qa`.
- `npm run check` passed. No deployment performed. No known required follow-up work.

2026-10-15 follow-up: added six question templates and six specific correct-answer responses in `dist/feelings-lines.js`. Separate shuffle bags use every variation before repeating, including across bag boundaries. Listen/retry/pause/character switches preserve the current round's wording. On-screen prompts and praise match the spoken lines. The shared catalog generator expands every template for all twelve feelings (144 combinations) and bundles Sonia recordings.

- Follow-up validation passed: required skill client, all 144 natural-voice combinations available, all six prompt/praise variants used per six-round block without adjacent repeats, spoken/visible text consistency, full game regression, and longest-question layouts at phone/tablet/smartboard sizes. Syntax checks passed for the game, template data and shared catalog generator. Asset URLs versioned for refresh.
