"""Draw the app icon (original artwork): a teal tile with a speech bubble and truck-art stripes."""
from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "public" / "icons"
TEAL, CREAM, ROSE, AMBER, DEEP = "#0f7a73", "#fbf4e8", "#c93a63", "#f0a315", "#0a5651"


def draw(size: int, maskable: bool) -> Image.Image:
    s = size / 512
    im = Image.new("RGBA", (size, size), TEAL if maskable else (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    if not maskable:
        d.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(112 * s), fill=TEAL)
    pad = 0.16 if maskable else 0.0
    def S(v):  # scale into the safe zone for maskable icons
        return int((pad * 512 + v * (1 - 2 * pad)) * s)
    # bubble
    d.rounded_rectangle([S(96), S(110), S(416), S(350)], radius=S(70) - S(0) + int(10 * s), fill=CREAM)
    d.polygon([(S(170), S(340)), (S(150), S(420)), (S(250), S(345))], fill=CREAM)
    # stripes inside the bubble (truck-art)
    for i, c in enumerate([ROSE, AMBER, TEAL]):
        y = 175 + i * 50
        d.rounded_rectangle([S(150), S(y), S(362), S(y + 28)], radius=int(14 * s), fill=c)
    # dot accent
    d.ellipse([S(380), S(70), S(440), S(130)], fill=AMBER, outline=DEEP, width=max(1, int(6 * s)))
    return im


for size, name, mask in [(192, "icon-192.png", False), (512, "icon-512.png", False), (512, "maskable-512.png", True), (180, "apple-touch-icon.png", True)]:
    draw(size, mask).save(OUT / name)
print("icons written")
