# Maschere di "riarreda la foto" su a2: R = parete, G = mensola in pietra, B = tavolini. Solo Pillow.
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops
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
if len(sys.argv) > 3:
    # Foto a2r: colore ovunque (niente rettangoli grossolani attorno agli oggetti), poi si tolgono gli oggetti con poligoni
    # tracciati su ritagli ingranditi. Ogni lambda porta le coordinate del ritaglio in uv.
    parete = Image.new('L', (W, H), 0)
    m = parete.load()
    for y in range(H):
        for x in range(W):
            if not r[x, y]: continue
            (a, b), l = cr(px[x, y])
            if ((a - rr) ** 2 + (b - rg) ** 2) ** 0.5 < 0.06 and 10 < l < 205: m[x, y] = 255
    parete = parete.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.MinFilter(7))
    SS = 4
    esc = Image.new('L', (W * SS, H * SS), 0)
    de = ImageDraw.Draw(esc)
    ritaglio = lambda u0, u1, v0, v1, cw, ch: (lambda x, y: ((u0 + x / cw * (u1 - u0)) * W * SS, (v0 + y / ch * (v1 - v0)) * H * SS))
    A = ritaglio(.40, .60, .17, .40, 1100, 1586)   # lampada a sospensione
    Bq = ritaglio(.60, .90, .28, .48, 1100, 919)   # vasi e statuina
    Cq = ritaglio(.50, .90, .62, .76, 1100, 483)   # lampade da tavolo, scultura, cornice
    poly = lambda f, pts: de.polygon([f(*q) for q in pts], fill=255)
    poly(A, [(105, 1450), (105, 990), (135, 925), (200, 735), (255, 625), (335, 515), (385, 418), (430, 470), (515, 590), (545, 540), (570, 450), (595, 405), (625, 440), (655, 495), (690, 470), (725, 438), (780, 490), (830, 570), (880, 670), (935, 790), (970, 950), (978, 1050), (978, 1430), (955, 1452)])
    poly(A, [(518, 0), (548, 0), (548, 600), (518, 600)])                          # cavo
    poly(Bq, [(62, 175), (272, 175), (272, 408), (62, 408)])                       # vaso 1
    poly(Bq, [(308, 128), (497, 128), (497, 408), (308, 408)])                     # vaso 2
    poly(Bq, [(603, 822), (603, 670), (630, 658), (640, 600), (645, 562), (670, 548), (700, 555), (708, 600), (745, 640), (795, 640), (800, 610), (830, 600), (860, 610), (862, 700), (862, 822)])  # statuina
    poly(Cq, [(88, 195), (210, 195), (210, 290), (185, 292), (185, 472), (120, 472), (120, 292), (88, 290)])   # lampada nera
    poly(Cq, [(222, 128), (320, 128), (320, 270), (300, 272), (300, 472), (245, 472), (245, 272), (222, 270)])   # lampada bianca
    poly(Cq, [(420, 295), (610, 278), (640, 305), (640, 440), (600, 462), (450, 472), (425, 450), (470, 395)])   # scultura in ferro
    poly(Cq, [(606, 98), (960, 98), (960, 448), (606, 448)])                       # cornice
    # mensole in acciaio (fili scuri con ombra) e libro
    for xa, xb, v in ((.46, 1.0, .369), (.46, 1.0, .458), (.46, 1.0, .561)):
        de.rectangle((xa * W * SS, (v - .005) * H * SS, xb * W * SS, (v + .007) * H * SS), fill=255)
    de.rectangle((.583 * W * SS, .545 * H * SS, .68 * W * SS, .565 * H * SS), fill=255)
    esc = esc.resize((W, H), Image.LANCZOS).filter(ImageFilter.MaxFilter(3))
    parete = ImageChops.subtract(parete, esc)
    dp = ImageDraw.Draw(parete)
    dp.rectangle((.118 * W, .615 * H, .387 * W, .76 * H), fill=0)                  # nicchia
parete = parete.filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
mensola = Image.new('L', (W, H), 0)
dm = ImageDraw.Draw(mensola)
dm.polygon(P([(0, .757), (.2, .752), (.5, .752), (.75, .748), (.962, .752), (.965, .83), (0, .828)]), fill=255)
dm.rectangle((.755 * W, .786 * H, .925 * W, .84 * H), fill=0)   # tavolino davanti
mensola = mensola.filter(ImageFilter.GaussianBlur(0.8))
# Tavolini: disegnati a 4x e riportati a W x H (bordi puliti). Coordinate prese da un ritaglio
# della foto (x 0-1200, y 0-442 = u 0.2-0.98, v 0.76-0.99), poi riportate in uv.
S = 4
tav = Image.new('L', (W * S, H * S), 0)
dt = ImageDraw.Draw(tav)
T = lambda x, y: ((0.2 + x / 1200 * 0.78) * W * S, (0.76 + y / 442 * 0.23) * H * S)
TP = lambda pts: [T(x, y) for x, y in pts]
def ell(cx, cy, rx, ry, fill):
    (x0, y0), (x1, y1) = T(cx - rx, cy - ry), T(cx + rx, cy + ry)
    dt.ellipse((x0, y0, x1, y1), fill=fill)
def rect(x0, y0, x1, y1, fill):
    a, b = T(x0, y0), T(x1, y1)
    dt.rectangle((a[0], a[1], b[0], b[1]), fill=fill)
# tavolo tondo: contorno tracciato su un ritaglio (x 0-1100, y 0-488 = u 0.30-0.75, v 0.83-0.99)
V = lambda x, y: ((0.3 + x / 1100 * 0.45) * W * S, (0.83 + y / 488 * 0.16) * H * S)
VP = lambda pts: [V(x, y) for x, y in pts]
dt.polygon(VP([(15, 185), (22, 150), (60, 115), (130, 85), (250, 62), (380, 52), (540, 50), (700, 55), (800, 68), (900, 85), (980, 110), (1035, 145), (1062, 185),
               (1064, 440), (1052, 468), (1020, 480), (60, 480), (28, 474), (14, 445)]), fill=255)
# tavolino alto: piano e fusto
ell(982, 93, 127, 38, 255); dt.rounded_rectangle((*T(855, 93), *T(1110, 374)), radius=10 * S, fill=255)
# fuori: vassoio con tazze e uva, bicchiere sul tavolino, gambe in acciaio
dt.polygon(VP([(386, 222), (386, 106), (430, 100), (432, 66), (508, 64), (512, 100), (620, 100), (622, 54), (655, 44), (760, 38), (852, 78), (852, 120), (880, 124), (882, 222)]), fill=0)
rect(953, 28, 1005, 84, 0)
dt.rectangle((*V(522, 342), *V(568, 490)), fill=0)
rect(972, 128, 1008, 392, 0)
tav = tav.resize((W, H), Image.LANCZOS)
# Foto ritoccata per "Prova prima del cantiere" (a2r): tavolini sottili, solo piano tondo su barra di ferro.
# Terzo argomento "sottili": disegna questi dischi al posto dei vecchi tavolini con la base in pietra.
if len(sys.argv) > 3:
    tav = Image.new('L', (W * S, H * S), 0)
    dt = ImageDraw.Draw(tav)
    G = lambda x, y: ((0.28 + x / 1300 * 0.70) * W * S, (0.82 + y / 418 * 0.18) * H * S)  # ritaglio del tavolo grande
    K = lambda x, y: ((0.72 + x / 1200 * 0.24) * W * S, (0.77 + y / 686 * 0.11) * H * S)  # ritaglio del tavolino
    dt.polygon([G(*q) for q in [(62, 155), (100, 105), (200, 75), (300, 62), (450, 58), (600, 60), (700, 70), (780, 100), (825, 150), (835, 180),
                                (820, 195), (750, 225), (650, 242), (550, 248), (450, 250), (300, 242), (200, 225), (110, 200), (70, 175)]], fill=255)
    dt.polygon([G(*q) for q in [(338, 172), (338, 100), (370, 95), (372, 68), (425, 68), (428, 95), (490, 95), (512, 85), (515, 62), (555, 52), (600, 50), (665, 55), (690, 85), (704, 100), (704, 172)]], fill=0)
    dt.polygon([K(*q) for q in [(180, 200), (230, 165), (330, 145), (450, 135), (600, 132), (800, 138), (920, 160), (990, 190), (1010, 225),
                                (1012, 270), (960, 320), (850, 342), (700, 350), (500, 345), (350, 335), (230, 310), (180, 270)]], fill=255)
    dt.polygon([K(*q) for q in [(525, 100), (655, 100), (655, 200), (525, 200)]], fill=0)
    tav = tav.resize((W, H), Image.LANCZOS).filter(ImageFilter.MaxFilter(3))
from PIL import ImageChops
mensola = ImageChops.subtract(mensola, tav)
Image.merge('RGB', (parete, mensola, tav)).resize((1200, 1500), Image.BILINEAR).save(out)
# luminanza media di ogni superficie (per normalizzare l'ombreggiatura)
L = im.convert('L').load()
for n, mk in [('parete', parete), ('mensola', mensola), ('tavolini', tav)]:
    mm = mk.load(); s = c = 0
    for y in range(H):
        for x in range(W):
            if mm[x, y] > 128: s += L[x, y]; c += 1
    print(n, round(s / c / 255, 3), c)
