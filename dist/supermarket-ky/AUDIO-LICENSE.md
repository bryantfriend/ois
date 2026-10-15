# Kyrgyz synthetic narration

The bundled MP3 narration in `kyrgyz-audio.js` is generated synthetic speech,
not a human recording. It was generated with the Kyrgyz (`ky`, `trk/ky`)
voice in eSpeak NG, via @echogarden/espeak-ng-emscripten 0.3.5.

eSpeak NG source and Kyrgyz pronunciation rules:
https://github.com/espeak-ng/espeak-ng

Emscripten port source and build instructions:
https://github.com/echogarden-project/espeak-ng-emscripten
https://github.com/echogarden-project/espeak-ng/tree/fork

eSpeak NG is licensed under GPLv3. Only generated audio is distributed with
this game; the engine is a build-time tool and is not shipped to the browser.
MP3 encoding uses lamejs 1.2.1 (LGPL), also only at build time:
https://github.com/zhuker/lamejs

Rebuild scripts in the GP_Games workspace: supermarket/build-kyrgyz-audio.mjs
and supermarket/apply-kyrgyz-voice.cjs. No paid API or installed device voice
is required to play these clips.
