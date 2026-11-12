# Generates the Repwise icon: graphite canvas, champagne barbell with a check mark.
import sys
from PIL import Image, ImageDraw

def icon(size, bg=(18, 18, 20, 255), transparent=False):
    s = size / 1024
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0) if transparent else bg)
    d = ImageDraw.Draw(img)
    gold = (227, 197, 143, 255)
    dark = (40, 34, 24, 255)
    if not transparent:
        d.ellipse([132 * s, 112 * s, 892 * s, 872 * s], fill=(31, 29, 30, 255))  # subtle charcoal disc
    # bar
    d.rounded_rectangle([170 * s, 488 * s, 854 * s, 536 * s], radius=20 * s, fill=gold)
    # plates
    for x0, w, h in [(222, 64, 300), (300, 46, 220), (678, 46, 220), (738, 64, 300)]:
        d.rounded_rectangle([x0 * s, (512 - h / 2) * s, (x0 + w) * s, (512 + h / 2) * s], radius=18 * s, fill=gold)
    # collars
    d.rounded_rectangle([352 * s, 470 * s, 372 * s, 554 * s], radius=6 * s, fill=gold)
    d.rounded_rectangle([652 * s, 470 * s, 672 * s, 554 * s], radius=6 * s, fill=gold)
    # check badge
    d.ellipse([430 * s, 650 * s, 594 * s, 814 * s], fill=gold)
    d.line([(470 * s, 734 * s), (502 * s, 766 * s), (558 * s, 702 * s)], fill=dark, width=int(22 * s), joint='curve')
    return img

out = sys.argv[1]
icon(1024).convert('RGB').save(f'{out}/icon.png')
icon(1024, transparent=True).save(f'{out}/android-icon-foreground.png')
Image.new('RGBA', (1024, 1024), (18, 18, 20, 255)).save(f'{out}/android-icon-background.png')
mono = icon(1024, transparent=True)
mono.save(f'{out}/android-icon-monochrome.png')
splash = icon(1024, transparent=True)
splash.save(f'{out}/splash-icon.png')
icon(48).convert('RGB').save(f'{out}/favicon.png')
print('icons written')
