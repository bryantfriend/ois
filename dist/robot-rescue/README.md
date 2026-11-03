# Robot Rescue: Code Studio

A local, dependency-free SVG classroom game for OIS. Open `index.html` directly or serve `ois/dist` and visit `/robot-rescue/index.html`. The OIS Computer Science card opens this page.

## Toolbox

- Motion: Move with a separate Up / Right / Down / Left direction input.
- Control: Repeat, Repeat until, If / Else, Wait (seconds).
- Sensing: Path clear in a selected direction or ahead, At exit, Facing a direction.
- Operators: nested And / Or / Not and comparisons (=, ≠, <, >, ≤, ≥); number literals.
- Variables: create named numeric variables; Set and Change; variable reporters in numeric sockets. Move count, Batteries, and Keys collected are read-only reporters updated by the world.
- My blocks: create a named definition, edit its nested body, and call it repeatedly from any script. Calls may contain other calls, loops, and decisions.

Drag a statement to a + insertion target, including inside a control block's body. Drag a direction, Boolean expression, or number reporter into its matching input socket. Touch pointers use the same system. Tapping an insertion point or socket and then a toolbox item also works. Numeric fields and dropdowns edit values directly. The small + on an existing block inserts before it; × removes it. Undo restores edits, including definitions and variable creation.

The program can have any length. Empty or incomplete programs cannot run. Editing after a run resets Pip and all runtime values, preserving code. There is no project save/import UI; code lives in the current page session.

## Execution

Run and Step use the same explicit interpreter stack. Step executes one visible block (including conditions, loop entry/checks and custom calls). Execution follows into a custom definition and returns to the main script when appropriate. Loops evaluate their count once at entry; Repeat until checks before each iteration. If / Else evaluates once and selects its branch.

Wait uses elapsed milliseconds, freezes on pause, and must finish before another Step. Switching away pauses a running program. Reset clears movement, counters, pickups, pending waits and the execution stack while preserving scripts. Blocks cannot be edited during Run.

A program succeeds when it ends at E1 with the room's required keys. Barriers and room edges stop an attempted Move. Keys and batteries are collected automatically on entry and count only once per run. Reset restores them. The original six rooms are joined by an open loop laboratory, a battery collection room and a locked key vault. Room starters and examples are accessible from the example picker.

Loops stop after 2,000 executed blocks; custom calls can nest 24 deep. Repeat counts accept 0–10,000, waits 0–60 seconds, and variable values must be finite and within ±1,000,000,000. These limits stop runaway programs with explanatory feedback.

## Files

- `art.js`: SVG artwork, directional Pip models, room construction.
- `game.js`: nested block model, pointer/tap editor, interpreter, examples and world state.
- `game.css`: classroom layout, block categories, inputs and animation.
- `progress.md`: task history and verification notes.

This is a game-specific Scratch-style editor, not a Scratch project importer or an embedded Scratch runtime. It uses no remote assets, external scripts, narration, or network APIs.

## Verification

From `ois`, with the existing Playwright install at `../bamboozled/node_modules/playwright`, serve `dist` on port 4190:

    node scripts/serve.mjs 4190
    node scripts/qa-robot-studio.mjs
    node scripts/qa-robot-studio-ui.mjs
    node scripts/qa-robot-studio-edges.mjs

These cover nine rooms, nested loops/branches/operators, all comparisons, variable state, definition/call editing, Run/Step equivalence, waits/pause, safety limits, collision sensing, keys/batteries/reset, ordinary numeric edits, undo, mouse/touch dragging, console errors and mobile overflow. Screenshots are written to `ois/output/robot-rescue/`.

`window.render_game_to_text()` exposes the program AST, definitions, active block, variables, world objects and interpreter status. `window.advanceTime(ms)` advances the same interpreter clock as normal play. `RobotStudio` supplies constructors and bounded QA hooks; production execution does not depend on them.
