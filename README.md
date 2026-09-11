# Oxford

A fresh classroom game library for teachers. Independent of GP_Games.

## Run locally
Requires Node.js. No installation or third-party dependencies are needed.

    npm run dev

Open http://127.0.0.1:4173. Run syntax checks with npm run check.

## First release
- Responsive library with grade 1–12 and subject filters, combined filtering, and reset.
- Six clearly labeled game concepts with learning-focus dialogs.
- Keyboard-accessible controls, native modal dialogs, and empty states.
- No playable games, accounts, or saved teacher content yet.

## Structure
- dist/index.html: teacher home screen.
- dist/styles.css: shared visual styles and responsive layouts.
- dist/catalog.js: subject taxonomy and game metadata.
- dist/app.js: filtering and concept details.
- scripts/serve.mjs: dependency-free local preview server.
- .openai/hosting.json: private Sites hosting identity when registered.

The dist directory is authored source and must remain tracked.

## Next phases
1. Agree on grade coverage, subjects, and the first game to build.
2. Build a game with a separate activity page and a clear return to the library.
3. Extend catalog entries with playable routes and ready status; update the card renderer to distinguish playable games from concepts.
4. Design a reusable game configuration schema: questions, answers, timing, and team settings.
5. Decide how teacher-created content is stored and shared before adding accounts or persistence.

Concepts and grade ranges are initial proposals, not claims of curriculum alignment.
Customization is intentionally a later phase. Do not store student information in this shell.
