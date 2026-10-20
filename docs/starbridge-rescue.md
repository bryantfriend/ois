# Starbridge Rescue

Integer Sprint is now Starbridge Rescue, keeping lesson ID `math-7-quiz`, its six integer-operation questions, editable question decks, quiz points and streak bonuses.

The player pilots a rescue shuttle through an asteroid field around a disabled research station. Each question represents one crew-pod beacon. A correct answer powers a tractor beam, pulls the pod aboard, lights the cargo indicator and updates the recovered count. An incorrect answer sends debris into the shield, produces impact sparks and leaves that beacon active. The final report distinguishes a complete rescue from a sweep with outstanding beacons and offers replay. No planet destination or new narration is used.

The ship has fixed hull geometry (144 × 76 scene units). The flight deck uses a viewport-based height independent of question/feedback content, fixing the shared fitting routine's previous resizing after answers. The phone view uses a closer composition for readable HUD text and a larger apparent ship, with the same geometry throughout a run.

Correct and incorrect reactions last 2.2 and 1.45 seconds. Continue is locked until the sequence finishes; direct next-round actions are guarded too. Pause stops the simulation and locks answers. Reduced motion shows the outcome immediately with no animation wait. No external pictures are needed for the canvas artwork.

Implementation: `dist/starbridge-rescue.js` and `.css`, loaded after the shared presentation layer. Saved lessons carrying the legacy default title are renamed on loading; a validated `settings.starbridgeRescue` marker retains the mission for edited/saved copies. Other quiz lessons retain their original presentation.

Validation: `scripts/qa-starbridge-rescue.mjs` covers the name/objective, fixed hull and canvas dimensions, delayed pod recovery, shield impacts, input locking, pause/resume, partial/perfect results, replay, reduced motion, desktop/mobile and isolation from another quiz. Screenshots in `output/starbridge-rescue` were visually reviewed. The required web-game client and 194 existing syntax checks passed; the new script also passed an explicit syntax check.

Local preview: http://127.0.0.1:4196/?game=math-7-quiz
