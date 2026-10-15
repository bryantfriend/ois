"""Extract the 4 x 3 original expression sheets into the game's 60 WebP stickers."""
from pathlib import Path
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[2]
CHARACTERS = ['hijab-girl', 'kalpak-boy', 'football-boy', 'everyday-girl', 'snow-leopard']
FEELINGS = ['happy', 'sad', 'surprised', 'angry', 'worried', 'sleepy', 'excited', 'scared', 'proud', 'shy', 'confused', 'calm']
for character in CHARACTERS:
    sheet = Image.open(ROOT / 'output/feelings-faces-art' / (character + '.png')).convert('RGB')
    # Generated sheets have small variations in spacing. Find the white gutters
    # near each nominal grid boundary so a neighbouring hat/ear never leaks in.
    grey = sheet.convert('L')
    def gutter(expected, axis):
        scores = []
        for coordinate in range(expected - 35, expected + 36):
            line = grey.crop((0, coordinate, sheet.width, coordinate + 1) if axis == 'y' else (coordinate, 0, coordinate + 1, sheet.height))
            dark = sum(1 for pixel in line.getdata() if pixel < 220)
            scores.append((dark + abs(coordinate - expected) * .05, coordinate))
        return min(scores)[1]
    columns = [0] + [gutter(round(sheet.width * i / 4), 'x') for i in range(1, 4)] + [sheet.width]
    rows = [0] + [gutter(round(sheet.height * i / 3), 'y') for i in range(1, 3)] + [sheet.height]
    target = ROOT / 'ois/dist/assets/feelings-faces' / character
    target.mkdir(parents=True, exist_ok=True)
    for i, feeling in enumerate(FEELINGS):
        x, y = i % 4, i // 4
        box = (columns[x], rows[y], columns[x + 1], rows[y + 1])
        cell = sheet.crop(box)
        # Centre the complete cutout on a square with breathing room.
        difference = ImageChops.difference(cell, Image.new('RGB', cell.size, 'white')).convert('L')
        bounds = difference.point(lambda value: 255 if value > 55 else 0).getbbox()
        if bounds:
            bounds = (max(0, bounds[0] - 5), max(0, bounds[1] - 5), min(cell.width, bounds[2] + 5), min(cell.height, bounds[3] + 5))
            cell = cell.crop(bounds)
        cell.thumbnail((340, 340), Image.Resampling.LANCZOS)
        sticker = Image.new('RGB', (362, 362), 'white')
        sticker.paste(cell, ((362 - cell.width) // 2, (362 - cell.height) // 2))
        sticker.save(target / (feeling + '.webp'), quality=92, method=6)
    print(character + ': 12 stickers extracted; gutters ' + str((columns, rows)))
