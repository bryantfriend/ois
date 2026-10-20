Runtime artwork uses WebP siblings of the original PNG masters. Keep the PNGs for editing, but reference the WebP from HTML, CSS and game scripts.

Run `python scripts/optimize-artwork.py` with Pillow installed after adding PNG artwork, then `node scripts/build-loading.cjs`. Existing WebP files are preserved; remove a specific WebP before rebuilding it after editing its PNG master. The loading manifest excludes PNG masters when a WebP sibling exists.

Images retain transparency and proportions. Backgrounds are capped at 1280 pixels, chess boards and fantasy atlases at 768, traditional chess atlases at 960, and runner/hamster animation sheets at 1152. Atlas rendering continues to use proportional cells.

Run `python scripts/build-chess-previews.py` after changing chess artwork. Settings use these separate previews (384-pixel piece sheets and 160-pixel boards), open immediately, and never preload full armies while browsing. Only Apply loads the selected full board and armies. All ten fantasy previews total about 440 KiB, compared with 1.35 MiB for the gameplay sheets. `node scripts/qa-chess-loading.mjs` verifies that stalled previews do not block controls and only applied full armies download.

`artwork-optimization.json` records original/runtime dimensions and byte sizes. The initial conversion reduces 54 PNG assets from 100.03 MiB to 7.47 MiB, with about 50% fewer decoded pixels across those assets. Actual scene memory and load times depend on the artwork used and the device/network.
