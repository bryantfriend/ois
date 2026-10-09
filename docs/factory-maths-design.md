# Factory Maths — design v1

Original request: Build a Builderment-style educational game in OIS. Design through one-at-a-time questions, then finish the design and start building.

## Agreed experience

Grade 7–8 teams take turns completing separate, unlockable factory puzzles on a large touchscreen smartboard. One team owns each attempt; others discuss. Early levels fit 10–15 minutes; later puzzles may take longer. Bright green tile grid, dark conveyors, purple/orange machines and individual moving items stay close to the supplied reference. Original code and graphics.

Every level follows predict → build → test → revise. Predictions never block building. Display individual recipes and rates, measured delivery rate and queues; do not calculate the required machine counts for students. Provide a large numeric keypad for board input. Reflection compares the saved prediction with measured results.

## Progress and economy

Three objectives per level: deliver a specified quantity, sustain a target rate, and meet a construction-efficiency constraint. First star unlocks the next level. Each objective awards one currency star only once per team, even on replays. Stars earned and stars spent are separate: purchases cannot relock levels. Each team has independent browser-local progress and upgrades. Export/import backups move progress between devices. No accounts.

Each fresh attempt receives a construction budget. Belt tiles and machines cost credits; removal fully refunds their construction cost. Currency stars are never construction credits. Restart resets the factory and prediction, preserving team progress. Upgrades increase machine output by 25%, belt capacity by 50%, or add queue labels. Levels whitelist upgrades; early rate lessons keep their original rates. Display effective upgraded rates in prediction prompts and recipe cards.

The economical-layout objective uses peak construction spending while the factory runs. Removing machines after delivery cannot earn this star; retry a cheaper layout on a fresh attempt. A replay may earn different optimisation stars with different layouts.

Tap a placed piece to rotate or delete it using its on-board panel. Multi-select offers additive tap selection and drag-area selection, with a count/refund preview and group Delete/Clear actions. Deletion refunds construction credits and supports atomic Undo. Delivery docks stay fixed; deletion saves the new layout and does not spend or remove earned stars.

## Simulation and controls

Infinite resource patches have finite extraction rates. Extractors must sit on matching patches. Workshops consume recipe inputs, take production time, and output discrete items. Input/output buffers are finite. Belts carry individual items and have finite throughput. Splitters alternate between available forward/left/right outputs. Blocked output stops production; wrong ingredients do not enter a recipe. Delivery accepts only the target product. No offscreen/offline production.

Touch: tap to place, drag belts with automatic turns, direction button to rotate, Inspect for machine information, Remove for refunds, Undo for the last construction stroke. Construction, deletion, rotation and Undo preserve the current running/paused state. The upgrade shop keeps production running during purchases. Edits restart the optimisation observation window without stopping item simulation. Other menus pause production; Info and Settings resume a previously running factory on close. Manual resume starts a clean measurement window. 1× and 4× simulation speeds change time, not relative rates. Use 30 simulated seconds of delivery history for measured rate, then hold the required rate for 20 simulated seconds to earn the throughput star. No waiting-based throughput exploits with prefilled stores: star observation starts after a fresh run and excludes the initial warmup.

## Initial level sequence

1. First planks — items per minute; one material.
2. Double the line — scaling rates; two extractors.
3. Metal works — two-stage production.
4. Gear ratios — two ingots per gear.
5. Shared supply — splitters and equal fractions; two delivery points.
6. Toolkit balance — two wood parts and three ingots per toolkit.
7. Upgrade percentages — 25% machine boost and revised predictions.
8. Conveyor ceiling — identify a transport bottleneck.
9. Circuit chain — three ingredients and multistep reasoning.
10. Lean factory — production target with a tight cost objective.
11. Solve the unknown — solve recipe quantities from a desired rate.
12. Factory finale — combine rates, ratios, splitting, budgets and upgrades.

All levels use fixed resource patches and delivery docks, with free placement elsewhere. Starter explanations introduce new tools. Predictions concern required input rate or achievable output rate, never a hidden quiz gate. The first release should be validated for reachable objectives, item conservation, budget refunds, once-only rewards, team isolation, purchase effects, level locks, reload and touch interaction.

## Boundaries

This local release uses an isometric board with 55–350% zoom, wheel/pinch zoom, a Move view tool and two-finger pan. Tap an existing building or belt for on-board clockwise/counterclockwise rotation. Continuous rails, rounded corners, moving treads and prominent output arrows make transport directions legible. Factories show circular progress rings tied to actual recipe time; extractor pumps and workshop saws/pistons animate during production. Logs have bark and cut-end rings, while planks have board thickness and grain. Items follow continuous paths through tile boundaries and curves, with raised sprites drawn above conveyor surfaces. Pausing freezes production visuals. No multiplayer network, teacher analytics or cloud sync. Team saves and resumable layouts live on this browser; downloadable JSON backup is provided. Future additions: authorable levels, larger boards and teacher assessment summaries.

### Larger assemblers and underground transport
New toolkit/circuit assemblers occupy a fixed 2×2 footprint. Rotation moves the model and ports around that footprint. Toolkits have two labelled rear inputs (planks, ingots); circuits add a third side input (wire). Only the correct ingredient delivered at its designated port enters the buffer. One output sits on the forward edge. Touching any footprint tile selects/deletes the complete building; collisions and source patches reject placement without charging. Saved compact assemblers retain their former rules until rebuilt, protecting existing layouts.
Tunnel in and Tunnel out unlock from level 6. Each end costs 4 credits. Pair ends along the same grid axis facing the same direction, at most 5 tiles apart. Cargo travels at belt speed underground and has an independent queue, so crossing surface belts cannot mix cargo. Missing, rotated or blocked exits hold cargo. Selection shows the underground link; stats show role, range, pairing and travel time. Both ends support rotation, refunds, Undo and saved layouts.


### Maths lab and evidence loop
Production planner: choose total target output across docks, predict ingredient rates, check recursive recipe multipliers and round required machine counts up. Built capacity includes allowed active motors, separate from measured throughput. Save guesses and target for the current team/level. Touch keypad supports editing numbers without a physical keyboard.
Splitters expose forward/right/left weights (0–9), equal-thirds and 1:1/1:2/2:3 presets. Zero closes a port; all-zero is rejected. Ratios are normalised over connected open outlets. Routing follows a deterministic weighted cycle; congestion remains a real constraint. Edits apply to newly entering items and support live Undo and persistence. Level 13 requires a 1:2 share: 8 and 16 planks at the two docks, with sustained rates of 8/min and 16/min.
Flow overlay shows actual successful output transfers / rated capacity in items/min, with a rolling 30-second simulation window and startup warmup. Amber indicates outputs continuously blocked at least 2 seconds; it is evidence, not an automatic claim of the root cause. Review run includes per-dock graphs with goal lines, actual vs predicted output, machine evidence, calculation/explanation and an improvement prediction. Plans and explanations save with team drafts. Explanations are teacher-discussed, not automatically graded. Students can open/reopen reviews from Math lab or from completion. Gameplay continues while Math lab is open.


### Guided optimisation tutorial
Nine coached steps use a separate practice factory: inspect a workshop, predict the 12/min bottleneck, measure a 60-second baseline, calculate 24÷12=2 workshops, build a parallel line with an equal splitter, predict/test 24/min for another 60 simulation seconds, calculate 49 extra construction credits including the refund, calculate a 100% output increase, then transfer the method back to missions. The lesson has highlighted tiles, a touch keypad, correctness feedback with worked hints, and an optional one-piece building demonstration. Students can use normal build/rotate/delete controls and 4× speed.
Tutorial progress and practice construction are stored per team, separately from mission drafts. Resume restores construction and coaching progress; measurement steps collect fresh evidence after resuming. Practice earns no mission stars or unlocks. Leaving restores the previous board, camera, simulation state and flow display. A completion marker permits replay. Available from the level selector and Tutorial header button.


Placement: the selected build tool displays a translucent grey model and footprint under the pointer. A red outline means placement is blocked. Touch users slide to aim and lift to place one piece; mouse users click to place and can drag belts. Two-finger pan/pinch and cancelled gestures do not build. A labelled Fullscreen button sits with the board camera controls; F toggles it and Escape exits.
