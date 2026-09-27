"""Regenerate web-optimised logo images and favicons from the source logo.

Not part of the site - run manually if the source logo changes:
    python tools/optimize-images.py
Requires Pillow (pip install pillow).
"""
from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "psyphin-logo-black.jpg"
OUT = ROOT / "assets" / "img"

# Hero logo widths (px). The page picks one via srcset.
LOGO_WIDTHS = [480, 800, 1200]

# Square crops (left, top, size) in the source image: the full "P" shield for
# large icons, and a tighter crop on the "P" so it stays legible at 16-48px.
SHIELD_BOX = (428, 28, 560)
P_BOX = (500, 100, 410)


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

    shield.resize((180, 180), Image.LANCZOS).save(ROOT / "apple-touch-icon.png", optimize=True)
    shield.resize((64, 64), Image.LANCZOS).save(OUT / "brand-64.png", optimize=True)  # pinned-header icon

    left, top, size = P_BOX
    p = src.crop((left, top, left + size, top + size))
    p = ImageEnhance.Contrast(p).enhance(1.35)
    p = ImageEnhance.Color(p).enhance(1.4)
    p.resize((32, 32), Image.LANCZOS).save(ROOT / "favicon-32.png", optimize=True)
    p.resize((256, 256), Image.LANCZOS).save(ROOT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    # Social share preview (Open Graph recommends 1200x630).
    og = Image.new("RGB", (1200, 630), (1, 1, 1))
    logo = src.resize((1154, 630), Image.LANCZOS)
    og.paste(logo, ((1200 - logo.width) // 2, 0))
    og.save(OUT / "og-image.jpg", "JPEG", quality=85, optimize=True)

    for f in sorted(list(OUT.iterdir()) + [ROOT / "favicon.ico", ROOT / "favicon-32.png", ROOT / "apple-touch-icon.png"]):
        print(f"{f.relative_to(ROOT)}: {f.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
