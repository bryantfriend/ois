# Fantasy chess armies

Generated on 20 October 2026 with the built-in image generation tool. Exact prompts and the corresponding filenames are preserved in [prompts.json](prompts.json).

Ten original sprite atlases provide sixty distinct miniature character designs:

| Army | King | Queen | Rook | Bishop | Knight | Pawn |
| --- | --- | --- | --- | --- | --- | --- |
| Robots | Command robot | Inventor | Shield bot | Scientist | Robot dog rider | Worker bot |
| Orcs | Chieftain | Champion | Shield-bearer | Shaman | Wolf rider | Footsoldier |
| Humans | King | Warrior queen | Armoured guard | Wizard | Horse knight | Infantry |
| Elves | Elven lord | Queen archer | Tree guardian | Druid | Stag rider | Archer |
| Dwarves | High king | Forge queen | Ironclad | Runesmith | Ram rider | Miner guard |
| Mechs | Command walker | Assault mech | Siege tank | Support mech | Scout walker | Utility mech |
| Military | General | Commander | Tank | Medic | Motorcycle scout | Infantry |
| SC2 Zerg | Brood patriarch | Queen | Ultralisk | Infestor | Hydralisk | Zergling |
| SC2 Protoss | Highlord | Commander | Immortal | High Templar | Stalker | Zealot |
| Goblins | Boss | Tinkerer queen | Junk barricade | Alchemist | Spider rider | Scout |

Each PNG is 1536 × 1024 with real alpha transparency. The layout is three equal columns by two equal rows: King, Queen, Rook above Bishop, Knight, Pawn. Each character includes its own round miniature base. Runtime SVG viewports crop the matching cell and add a role letter plus a light/dark team badge.

Different armies keep their illustrated palettes. If both players select the same army, SVG colour transfer creates a gold White side and a blue Black side, including moving pieces, captured pieces and victory artwork. The generated PNGs remain unchanged.

Traditional mode uses the existing ivory/charcoal Staunton atlas. Settings are applied after image loading, retain all moves, persist to local storage, and migrate the previous board choice. Cancel discards unapplied changes. Only the selected board and armies are required at game launch; the faction selector preloads its picture previews through the shared loading screen.

Validation: `scripts/qa-chess-factions.mjs` checks all ten side choices, all 100 matchups, all role crops, mirror tint, role badges, apply/cancel, match preservation, persistence, traditional mode and mobile layout. `CHESS_TEST_FANTASY=1` runs `qa-chess-motion.mjs` with Protoss versus Zerg to cover rotation, captures, castling, en passant, promotion, wins, replay and reduced motion.
