# Chess appearance artwork

Generated 20 October 2026 with the built-in image generation tool. Five boards and five transparent sprite atlases, used directly by chess-motion.js. Each atlas has six columns (king, queen, rook, bishop, knight, pawn) and two rows (white, black). All 25 combinations are supported.

## Board prompt template

Use case: stylized-concept. Asset type: chess game board texture. Perfect square full bleed orthographic overhead chessboard, exactly 8 by 8 equal squares, top-left square LIGHT, alternating MATERIAL. Board grid fills entire image edge to edge with NO border, NO perspective, NO pieces, NO labels, NO text, no objects. Subtle elegant material texture, crisp straight aligned grid, high readability. Save output for project use.

MATERIAL variations:
- walnut: warm walnut and maple wood grain
- marble: ivory marble and deep charcoal marble
- garden: pale cream limestone and sage green stone
- ocean: pale pearl ceramic and deep ocean blue ceramic
- royal: pale champagne and plum purple enamel

## Piece atlas prompt template

Use case: stylized-concept. Asset type: transparent chess game sprite atlas. Exactly TWELVE individual upright chess pieces in a strict 6 column by 2 row equally spaced grid. Each piece centered inside its equal rectangular cell, generous transparent padding, no overlap. Top row white side, bottom row black side. In EACH row left to right: KING with cross, QUEEN with crown, ROOK castle, BISHOP with slit mitre, KNIGHT horse head, PAWN round head. Style: STYLE. Clear conventional recognizable silhouettes for classroom chess, polished 3D game illustration, front elevation, consistent scale and ground baseline within each cell. Transparent background, NO board, no lettering, no numbers, no grid lines. All twelve pieces fully visible.

STYLE variations:
- classic: traditional Staunton ivory white and charcoal black
- woodland: hand carved light birch white and dark walnut black wood
- crystal: frosted pearl white and deep sapphire black crystal
- candy: playful rounded cream white and dark raspberry black ceramic
- space: futuristic pearl white and graphite black metal with subtle cyan accents

## Validation

qa-chess-appearance.mjs checks all 25 combinations, image loading, match preservation, local persistence, desktop/mobile, Escape and focus restoration. qa-chess-motion.mjs covers rotation, captures, castling, en passant, promotions, checkmate, replay and reduced motion.
