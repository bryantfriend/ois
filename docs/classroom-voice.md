# Classroom voice

Use the bundled Sonia natural British English voice in dist/shared/voice for current and future English games. Load manifest.js, then runtime.js, then the game. Call ClassroomVoice.speak(text); await the returned promise before a dependent scene transition. Call ClassroomVoice.cancel() on mute, pause and restart.

The 1,897 built-in recordings are stored in audio packs loaded on demand. New teacher-entered text uses the device voice until a recording is added. Add new built-in sentences using en-GB-SoniaNeural at rate -5%, then extend the manifest. Preserve Russian and Kyrgyz language-specific voices.
