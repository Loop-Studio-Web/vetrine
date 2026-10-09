# Maschere di "riarreda la foto" su a2: R = parete, G = mensola in pietra, B = tavolini. Solo Pillow.
import sys
from PIL import Image, ImageDraw, ImageFilter
src, out = sys.argv[1], sys.argv[2]
W, H = 600, 750
im = Image.open(src).convert('RGB').resize((W, H), Image.LANCZOS)
px = im.load()
def cr(c):
    s = sum(c) or 1
    return (c[0] / s, c[1] / s), s / 3
# colore di riferimento dell'intonaco
camp = [px[x, y] for x in range(150, 230) for y in range(230, 330)]
rif = tuple(sum(c[i] for c in camp) / len(camp) for i in range(3))
(rr, rg), _ = cr(rif)
print('intonaco', rif)
P = lambda pts: [(x * W, y * H) for x, y in pts]
parete = Image.new('L', (W, H), 0)
d = ImageDraw.Draw(parete)
reg = Image.new('L', (W, H), 0); ImageDraw.Draw(reg).polygon(P([(0, .158), (1, .165), (1, .757), (0, .757)]), fill=255)
r = reg.load(); m = parete.load()
oggetti = [(.405, .19, .585, .39), (.115, .61, .39, .76), (.715, .64, .855, .76), (.525, .665, .625, .76), (.645, .685, .725, .76), (.615, .3, .735, .375), (.755, .39, .845, .465), (.58, .54, .675, .565), (.493, .0, .507, .21)]
def in_ogg(x, y):
    fx, fy = x / W, y / H
    return any(b[0] <= fx <= b[2] and b[1] <= fy <= b[3] for b in oggetti)
for y in range(H):
    for x in range(W):
        if not r[x, y]: continue
        (a, b), l = cr(px[x, y])
        dc = ((a - rr) ** 2 + (b - rg) ** 2) ** 0.5
        if in_ogg(x, y):
            ok = dc < 0.04 and 25 < l < 148
        else:
            ok = dc < 0.06 and 10 < l < 205
        if ok: m[x, y] = 255
# la nicchia del camino resta fuori del tutto
d.rectangle((.118 * W, .615 * H, .387 * W, .76 * H), fill=0)
parete = parete.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MinFilter(7))
pm = parete.load()
for y in range(H):
    for x in range(W):
        if pm[x, y] and in_ogg(x, y):
            (a2, b2), l = cr(px[x, y])
            if l > 150 or l < 18: pm[x, y] = 0
dp = ImageDraw.Draw(parete)
dp.rectangle((.118 * W, .615 * H, .387 * W, .76 * H), fill=0)          # nicchia
dp.rectangle((.722 * W, .645 * H, .852 * W, .752 * H), fill=0)         # quadro
dp.polygon(P([(.416, .388), (.416, .29), (.44, .25), (.47, .232), (.49, .252), (.5, .225), (.522, .252), (.547, .228), (.577, .278), (.58, .388)]), fill=0)  # lampada
parete = parete.filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
mensola = Image.new('L', (W, H), 0)
dm = ImageDraw.Draw(mensola)
dm.polygon(P([(0, .757), (.2, .752), (.5, .752), (.75, .748), (.962, .752), (.965, .83), (0, .828)]), fill=255)
dm.rectangle((.755 * W, .786 * H, .925 * W, .84 * H), fill=0)   # tavolino davanti
mensola = mensola.filter(ImageFilter.GaussianBlur(0.8))
tav = Image.new('L', (W, H), 0)
dt = ImageDraw.Draw(tav)
dt.ellipse((.305 * W, .842 * H, .735 * W, .898 * H), fill=255)                # piano
dt.rounded_rectangle((.306 * W, .868 * H, .734 * W, .965 * H), radius=14, fill=255)  # spessore
dt.rectangle((.758 * W, .79 * H, .92 * W, .955 * H), fill=255)                # tavolino
dt.ellipse((.758 * W, .78 * H, .92 * W, .805 * H), fill=255)
dt.rectangle((.455 * W, .832 * H, .665 * W, .9 * H), fill=0)                  # vassoio
dt.rectangle((.815 * W, .775 * H, .845 * W, .8 * H), fill=0)                  # bicchiere
dt.rectangle((.79 * W, .84 * H, .815 * W, .96 * H), fill=0)                   # gamba in acciaio
dt.rectangle((.485 * W, .9 * H, .505 * W, .97 * H), fill=0)
tav = tav.filter(ImageFilter.GaussianBlur(0.8))
Image.merge('RGB', (parete, mensola, tav)).resize((1200, 1500), Image.BILINEAR).save(out)
# luminanza media di ogni superficie (per normalizzare l'ombreggiatura)
L = im.convert('L').load()
for n, mk in [('parete', parete), ('mensola', mensola), ('tavolini', tav)]:
    mm = mk.load(); s = c = 0
    for y in range(H):
        for x in range(W):
            if mm[x, y] > 128: s += L[x, y]; c += 1
    print(n, round(s / c / 255, 3), c)
