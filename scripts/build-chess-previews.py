"""Build small settings previews; gameplay keeps its larger WebP artwork."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'dist/assets/chess'
sources = [root / 'pieces-classic.webp', *root.glob('board-*.webp'),
           *(root / 'factions').glob('*.webp')]
for source in sources:
    target = root / 'previews' / source.relative_to(root)
    target.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as image:
        limit = 160 if source.name.startswith('board-') else 384
        image.thumbnail((limit, limit), Image.Resampling.LANCZOS)
        image.save(target, 'WEBP', quality=78, method=4)
print(f'Built {len(sources)} chess menu previews.')
