"""Regenerate web-optimised logo images and favicons from the source logo.

Not part of the site - run manually if the source logo changes:
    python tools/optimize-images.py
Requires Pillow (pip install pillow).
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "psyphin-logo-black.jpg"
# Favicons come from the white-background logo, shared with fuel.psyphin.co.za.
FAVICON_SOURCE = ROOT / "psyphin-logo.jpg"
OUT = ROOT / "assets" / "img"

# Hero logo widths (px). The page picks one via srcset.
LOGO_WIDTHS = [480, 800, 1200]

# Square crops (left, top, size): the full "P" shield in SOURCE for the pinned
# header icon, and a crop centred on the "P" in FAVICON_SOURCE for the favicons,
# so it stays legible at 16-48px.
SHIELD_BOX = (428, 28, 560)
FAVICON_BOX = (522, 98, 360)

# Google wants favicons in multiples of 48px.
FAVICON_PNG_SIZES = [48, 96, 192]


def make_favicons():
    left, top, size = FAVICON_BOX
    p = Image.open(FAVICON_SOURCE).convert("RGB").crop((left, top, left + size, top + size))
    p.resize((48, 48), Image.LANCZOS).save(ROOT / "favicon.ico", sizes=[(48, 48), (32, 32), (16, 16)])
    for s in FAVICON_PNG_SIZES:
        p.resize((s, s), Image.LANCZOS).save(ROOT / f"favicon-{s}x{s}.png", optimize=True)
    p.resize((180, 180), Image.LANCZOS).save(ROOT / "apple-touch-icon.png", optimize=True)
    return [ROOT / "favicon.ico", ROOT / "apple-touch-icon.png"] + [ROOT / f"favicon-{s}x{s}.png" for s in FAVICON_PNG_SIZES]


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    src = Image.open(SOURCE).convert("RGB")

    for w in LOGO_WIDTHS:
        h = round(src.height * w / src.width)
        img = src.resize((w, h), Image.LANCZOS)
        img.save(OUT / f"logo-{w}.webp", "WEBP", quality=80, method=6)
        img.save(OUT / f"logo-{w}.jpg", "JPEG", quality=82, optimize=True, progressive=True)

    left, top, size = SHIELD_BOX
    shield = src.crop((left, top, left + size, top + size))

    shield.resize((64, 64), Image.LANCZOS).save(OUT / "brand-64.png", optimize=True)  # pinned-header icon

    favicons = make_favicons()

    # Social share preview (Open Graph recommends 1200x630).
    og = Image.new("RGB", (1200, 630), (1, 1, 1))
    logo = src.resize((1154, 630), Image.LANCZOS)
    og.paste(logo, ((1200 - logo.width) // 2, 0))
    og.save(OUT / "og-image.jpg", "JPEG", quality=85, optimize=True)

    for f in sorted(list(OUT.iterdir()) + favicons):
        print(f"{f.relative_to(ROOT)}: {f.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
