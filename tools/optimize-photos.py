"""Shrink project photos for the web and strip their EXIF data (camera model, GPS, etc.).

Not part of the site - run manually when adding photos to a project page:
    python tools/optimize-photos.py <source folder> <project folder>/img
Each photo becomes <slug>-800.jpg (shown in the gallery) and <slug>-1600.jpg (opened on click).
Requires Pillow (pip install pillow).
"""
import re
import sys
from pathlib import Path

from PIL import Image, ImageOps

SIZES = [800, 1600]  # longest side, px


def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def main(src_dir, out_dir):
    src_dir, out_dir = Path(src_dir), Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    for src in sorted(src_dir.glob("*")):
        if src.suffix.lower() not in (".jpg", ".jpeg", ".png", ".webp", ".jfif"):
            continue
        # exif_transpose applies the camera's rotation before the EXIF is dropped.
        img = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
        for size in SIZES:
            copy = img.copy()
            copy.thumbnail((size, size), Image.LANCZOS)
            out = out_dir / f"{slug(src.stem)}-{size}.jpg"
            copy.save(out, "JPEG", quality=80, optimize=True, progressive=True)  # no exif= -> stripped
            print(f"{out}: {copy.width}x{copy.height}, {out.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
