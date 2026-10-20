# Shared classroom loading screen

The library and standalone games use an inline SVG illustration, a native progress bar, picture counts, and retry/back controls. The illustration has no image request of its own. Progress counts successfully loaded and decoded pictures, rather than elapsed time. English, Russian, and Kyrgyz page labels are supported. Reduced-motion preferences suppress the illustration animation.

`manifest.js` lists the pictures needed for each game. Run `node scripts/build-loading.cjs` from the OIS folder after adding artwork or a standalone entry. The builder is idempotent and installs the shared scripts in game HTML files. Explorer Island preloads its deployed WebP pictures, rather than the source PNGs. Coastal photographs are loaded for the rendered scene rather than downloading the entire destination library.

`runtime.js` loads up to six pictures at a time, decodes them, caches successful results, and retries only failed requests. The screen waits 100 ms before showing so a warm-cache launch does not flash. A picture that fails or takes longer than 45 seconds offers a retry and a return to the library. Failed images do not count as ready. No lesson scores, questions, or saved progress change during loading.

`library.js` wraps the existing launch action. Its loading promise finishes before the game starts its clocks or narration. Repeated start clicks are ignored during the same launch, and returning to the library cancels a pending launch. The shared animation clock pauses while a later scene is waiting for pictures. Chess uses `chessRequiredAssets()` to preload the chosen board and Traditional pieces or both Fantasy armies, with one atlas for a mirror matchup. An image watcher also handles new HTML and SVG pictures in the player.

Standalone HTML keeps its game scripts inert with `type="text/plain" data-loading-script="classic"` (or `module`). The runtime executes them in order after the artwork is ready, retaining the existing order of narration and game scripts. Future scripts that rely on DOMContentLoaded should instead initialize immediately at that point, or listen for `classroom-ready` after startup.

Public API: `ClassroomLoading.prepare(paths, {title, onCancel})` resolves to true on success or false on cancellation. Paths are relative to the game-library root; absolute URLs are also accepted. `watch(root)` handles new HTML/SVG images, `cancel()` cancels the active wait, and `state` exposes the loading count for browser QA. Keep audio in its existing language and voice runtime; this screen adds no narration.

Validation: `scripts/qa-loading.mjs` deliberately holds an image request, verifies real progress and delayed game startup, checks phone layouts and keyboard behavior, aborts and retries an image, checks cancellation, and launches all 14 standalone game entries. Desktop/mobile/retry/gameplay screenshots are saved under `output/loading`.
