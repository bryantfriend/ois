# Natural narration

Default narration uses bundled MP3 clips generated with Microsoft's
`en-GB-SoniaNeural` voice at -5% speaking rate. It is synthetic neural speech,
not a human recording. Runtime playback uses local audio files; it does not
contact Microsoft or require an API key, a device voice installation, or the
build-time Python dependencies.

The voice covers 130 illustrated alphabet items, 24 simple word prompts,
feedback, completion and teacher preview. Teacher settings retain explicit
device voice choices. The default selection is the included natural voice.

To regenerate: install edge-tts in `output/post-office-voice-tools`, run
`node animal-post-office/prepare-voice-texts.cjs`, then run
`animal-post-office/build-natural-voice.py` with Python. The build reuses
existing valid clips. Keep `voice-manifest.js` and `assets/voice` together
when copying the game into OIS.

Build-time client source: https://github.com/rany2/edge-tts
Microsoft voice documentation:
https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support
