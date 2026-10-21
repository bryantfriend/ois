"""Make small runtime artwork from the generated, editable Cloud Courier masters."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
source = root / 'output/concepts/cloud-courier/masters'
target = root / 'dist/assets/cloud-courier'
target.mkdir(parents=True, exist_ok=True)
for name, limit in [('sky', 1600), ('plane', 640), ('dock', 720)]:
    with Image.open(source / f'{name}.png') as original:
        image = original.convert('RGBA')
        if name != 'sky':
            bounds = image.getchannel('A').getbbox()
            if bounds:
                image = image.crop(bounds)
        image.thumbnail((limit, limit), Image.Resampling.LANCZOS)
        image.save(target / f'{name}.webp', 'WEBP', quality=86, method=4, exact=True)
        if name == 'sky':
            image.thumbnail((480, 300), Image.Resampling.LANCZOS)
            image.save(target / 'preview.webp', 'WEBP', quality=78, method=4)
print('Built Cloud Courier background, transparent plane/dock, and library preview.')
