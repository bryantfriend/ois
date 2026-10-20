"""Build compact runtime artwork; retain PNG masters for future editing."""
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'dist'
report = []
for source in sorted(root.rglob('*.png')):
    target = source.with_suffix('.webp')
    if target.exists() and target.stat().st_size:
        continue  # Preserve artwork that already has a tuned web version.
    with Image.open(source) as original:
        image = original.convert('RGBA')
        limit = 1280
        if 'chess' in source.parts:
            limit = 960 if source.name.startswith('pieces-') else 768
        elif 'runner' in source.name or 'hamster' in source.name:
            limit = 1152
        image.thumbnail((limit, limit), Image.Resampling.LANCZOS)
        image.save(target, 'WEBP', quality=85, method=4, exact=True)
        report.append({'file': source.relative_to(root).as_posix(),
                       'originalBytes': source.stat().st_size,
                       'webBytes': target.stat().st_size,
                       'originalSize': original.size, 'webSize': image.size})
report = []
for source in sorted(root.rglob('*.png')):
    target = source.with_suffix('.webp')
    if target.exists():
        with Image.open(source) as original, Image.open(target) as web:
            report.append({'file': source.relative_to(root).as_posix(), 'originalBytes': source.stat().st_size, 'webBytes': target.stat().st_size, 'originalSize': original.size, 'webSize': web.size})
if report:
    (root.parent / 'artwork-optimization.json').write_text(json.dumps(report, indent=2) + '\n')
print(f'{len(report)} WebP images available: '
      f'{sum(r["originalBytes"] for r in report):,} -> '
      f'{sum(r["webBytes"] for r in report):,} bytes')
