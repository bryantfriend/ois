# Feelings Faces sticker book

The existing Feelings Faces lesson uses a paper-and-sticker theatre with five original characters: a hijab girl, a boy in an ak-kalpak, a football boy, a girl in everyday clothes, and a snow leopard cub. Each has twelve expressions: happy, sad, surprised, angry, worried, sleepy, excited, scared, proud, shy, confused and calm.

The prepared lesson contains twelve rounds and six shuffled choices per round. Mix friends rotates the cast; selecting a character uses that character for subsequent questions. Switching a character changes the artwork behind closed curtains without changing progress. Saved lessons retain their authored questions.

Curtains open after the pictures load. The shared Sonia voice reads the prompt. Six question variations and six correct-answer responses rotate through separate shuffled sets, using each variation before repeating and avoiding back-to-back repeats. Listen, pause and character changes retain the current wording. The displayed and spoken text match. Correct answers lock input, show confetti, and play praise. After the praise finishes, the curtains close, the next round is prepared, and the curtains open again. Wrong answers allow another try without losing progress.

Keyboard: 1–6 choose a face, P pauses, M mutes, F opens fullscreen. Narration stops on pause, mute, navigation, hidden tabs, restart confirmation and replay. Motion-off mode shortens the curtains and uses static confetti.

Original generated sheets and exact built-in-tool prompts: `output/feelings-faces-art` at repository root. Extract the sheets with `scripts/build-feelings-art.py`; ship all 60 WebP files in `dist/assets/feelings-faces`. Shared voice clips are generated from `feelings-voice-texts.json` through `shared/voice/prepare-library.cjs` and `build-library.py`; use `sync-site.cjs` to bundle them with OIS.

Validation: run `node scripts/qa-feelings-faces.mjs --skill-client` with `OXFORD_PLAYWRIGHT_MODULE` and `PLAYWRIGHT_BROWSERS_PATH` set as needed. The test owns an ephemeral local server. Screenshots and readable state are saved under root `output/feelings-faces-qa`.
