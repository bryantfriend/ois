# Starport Cargo

OIS Mathematics Grades 1–7. Open dist/space-cargo/index.html through a web server, or use the library entries. A grade query parameter selects the entry grade.

Detailed original SVG hangar, 20 spaceship configurations, articulated gantry robot, clickable loading/unloading, arm retraction, narration-dependent door closure and takeoff. 126 prepared missions cover 21 concepts and three difficulties. Ratio, factor and equal-group missions check their additional rules. Integer ticks keep fractions and decimals exact.

241 bundled Sonia clips cover questions, hints and feedback. Twenty success messages use shuffled cycles without repeats; the remaining order persists across reloads. Mute, pause, navigation, reset and hidden tabs cancel speech. Controls support touch, keyboard, fullscreen and reduced motion; narrow screens use a swipeable dock.

Browser QA scripts: scripts/qa-space-cargo.cjs, qa-space-cargo-final.cjs and qa-space-cargo-success.cjs. Set OXFORD_PLAYWRIGHT_MODULE to your installed Playwright module and CARGO_QA_BASE_URL to the served dist root (default http://127.0.0.1:4189). The first verifies all 126 solutions and plays 63 UI settings. Focused tests verify real recorded narration, gated doors, OIS grade launch and two non-repeating success cycles with reload persistence.
