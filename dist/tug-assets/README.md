# Plush mountain tug artwork

Created 19 October 2026 with the built-in image generation tool for the selected concept 1. All runtime assets are local and ship with `dist`. No new narration was added; the existing shared Sonia runtime remains loaded before game code.

## Files

- `jailoo.png`: Kyrgyz mountain meadow background, lake and distant yurt; no baked-in UI.
- `coral-hamster.png`: transparent golden hamster animation sheet, four columns by two rows.
- `teal-hamster.png`: transparent silver hamster animation sheet, four columns by two rows.
- `rope.png`: transparent braided rope and coral/teal ribbon prop.

Both sheets have these frames, left to right, top to bottom: ready, anticipation, pull, settle, blink, stumble, recovery, victory. The teal sheet faces right in the source and is mirrored in the game. `tug-plush.js` measures the alpha bounds of each cell at load, registers all poses to a shared foot baseline and scale, and draws the rope independently. Preserve alpha when exporting sheets. Do not assume the sheets have identical pixel or cell dimensions.

## Animation behavior

- Idle: subtle breathing and occasional blinking, with staggered teammate timing.
- Correct: anticipation, leaning pull, settle; eased rope position reflects the real score.
- Incorrect: friendly stumble, recovery, then ready during the existing five-second cooldown.
- Second consecutive mistake: same recovery reaction; existing score/pull penalty still applies.
- Victory: raised-paw pose and gentle hops for the winning team; other team recovers without falling over.
- Motion off: static expressive poses, no breathing/hops/rope easing; question timers still run.
- Pause: simulation and CSS animation freeze, answer panels become inert; resume, restart and navigation restore the appropriate state.

The question buttons retain their fixed layout and independent multi-touch behavior. All tug-format lesson packs share this artwork. Other game formats continue to use their existing art.

## Generation prompt set

Background: Production background plate for plush mountain hamsters classroom tug of war game. Wide landscape composition. Premium soft 3D animated family film scenery matching adorable plush fur characters. Sunny Kyrgyz jailoo meadow with distant blue Tian Shan snow peaks, turquoise distant lake, a small cream yurt at far right rear, subtle wildflowers and grass edges. Camera almost ground-level looking across flat horizontal meadow playing field. Foreground bottom 35 percent is clear warm sandy short-grass playing ground, uninterrupted across full width. Mountains in upper half, cheerful blue sky. Soft warm daylight, restrained detail and inviting depth. No characters, animals, people, ropes, text, logos, UI, borders, flags or score markers.

Coral sheet: Production game sprite sheet, true transparent background. Exactly four columns by two rows, eight equal cells, no labels or grid lines. Same adorable golden plush hamster with cream belly, detailed soft fur, round ears, shiny black eyes and coral red neck scarf, premium 3D family animation quality. Full body, three-quarter profile facing right. Same scale, camera distance and foot baseline, generous padding, no overlap. Forepaws forward at chest height to grasp an invisible rope. Top row: neutral ready; anticipating pull leaning slightly right; strong tug leaning back left with bent knees; settle near upright. Bottom row: relaxed blinking idle; friendly surprised stumble; planted recovery with relieved smile; delighted raised-paw victory. Consistent identity and warm studio light. No floor, backdrop, extra objects or baked checkerboard.

Teal sheet: Same four-column/two-row pose specification and consistent registration as coral sheet. Silver-grey plush hamster, cream belly and cheeks, teal neck scarf, full body facing right in every cell, premium soft 3D family animation quality. True transparent background, no floor, labels, rope or extra objects.

Teal transparency repair: Remove all background completely to true alpha transparency. Preserve all eight grey hamster characters with teal scarves in their existing four-column/two-row positions, scale, poses, edges, fur and dimensions. Transparent empty space between characters and around edges; no gradients, coloured halo or baked checkerboard.

Rope: Single long straight horizontal thick golden tan braided tug-of-war rope on true transparent background, wide composition. Nearly full width, centred vertically, taut and consistent diameter, detailed twisted fibre texture, premium 3D animated family-film art. Small coral red ribbon tied at exact middle, two short hanging tails and tiny teal knot accent. Isolated prop, endpoints fully contained with margins. No characters, hands, floor, scenery, text, borders or backdrop shadows.

## Validation

Run `scripts/qa-tug-plush.mjs` for artwork states, pause/resume, penalties, reduced motion, replay, restart, navigation and responsive screenshots. Existing `scripts/qa-tug-fair-play.mjs` covers cooldowns, stable targets, native simultaneous touches, keyboard, long content and both win paths. The shared celebration chess guard uses optional session access so non-session games can finish without a browser error.
