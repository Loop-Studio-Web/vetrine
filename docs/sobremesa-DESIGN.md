---
name: Sobremesa
description: A demo magazine-shop whose whole interface is the enamelled-steel sign wall of an Argentine almacén, dark green paint behind flat fields of cobalt, red, yellow, enamel white and black.
colors:
  pared: "#16261c"
  pared-fondo: "#0e1a13"
  cobalto: "#06236b"
  cobalto-vivo: "#1747b8"
  rojo: "#a82a1a"
  amarillo: "#e8b414"
  esmalte: "#d6d1ca"
  esmalte-luz: "#ebe8e2"
  negro: "#14161a"
  tinta: "#0b1e64"
  blanco: "#eef0f7"
  filete-amarillo: "#f6d25a"
  filete-rojo: "#d9523f"
  filete-cobalto: "#3a63c4"
  filete-negro: "#5a5f68"
typography:
  display:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(2rem, 4.6vw, 4rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Anton, Arial Narrow, sans-serif"
    fontSize: "clamp(1.6rem, 2.6vw, 2.3rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0.01em"
  title:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.02em"
  body:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "clamp(1.0625rem, 1.5vw, 1.25rem)"
    fontWeight: 500
    lineHeight: 1.45
  label:
    fontFamily: "Barlow Condensed, Arial Narrow, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "0.08em"
  wordmark:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "calc(70 * var(--k))"
    fontWeight: 850
    lineHeight: 1
    letterSpacing: "-0.015em"
  hand:
    fontFamily: "Caveat, Segoe Print, cursive"
    fontSize: "1.6rem"
    fontWeight: 700
    lineHeight: 1
rounded:
  plate: "calc(16 * var(--k))"
  plate-small: "calc(12 * var(--k))"
  button: "10px"
  photo: "calc(10 * var(--k))"
spacing:
  gutter: "clamp(16px, 4vw, 48px)"
  section: "clamp(72px, 9vw, 140px)"
  shelf-gap: "clamp(36px, 5vw, 76px)"
  tap-target: "44px"
components:
  button-primary:
    backgroundColor: "{colors.cobalto-vivo}"
    textColor: "#ffffff"
    typography: "{typography.title}"
    rounded: "{rounded.button}"
    padding: "0 22px"
    height: "48px"
  button-light:
    backgroundColor: "{colors.esmalte}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.button}"
    padding: "0 22px"
    height: "48px"
  button-pay:
    backgroundColor: "{colors.amarillo}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.button}"
    height: "56px"
  plate-title:
    backgroundColor: "{colors.esmalte}"
    textColor: "{colors.tinta}"
    typography: "{typography.display}"
    rounded: "{rounded.plate}"
  plate-bag:
    backgroundColor: "{colors.rojo}"
    textColor: "#ffffff"
    typography: "{typography.title}"
    rounded: "{rounded.plate-small}"
  object-plate:
    backgroundColor: "{colors.cobalto}"
    textColor: "{colors.blanco}"
    rounded: "{rounded.plate}"
---

# Design System: Sobremesa

## Overview

**Creative North Star: "La pared del almacén"**

Every surface is an enamelled steel sign hung on a dark green painted wall. Colour arrives as big flat fields of cobalt, signal red, yellow, enamel white and black; each field is a plate with rounded corners, four screw heads, a glossy highlight and a pale rim. The wall itself stays quiet so the signs carry all the colour. The page is recognisable with its words removed: plates, screws, grain.

Type is a loud condensed sign-painter's voice: Anton capitals for titles and prices, Barlow Condensed for everything that is read, a heavy Archivo wordmark for the shop name, and Caveat handwriting only where a person would write on cardboard. Depth is physical, not digital: plates cast a soft drop shadow onto the wall and carry an inset rim, never a flat border.

The system is built for one demonstration shop. It records what the build does; it is not a house style for other concepts in the repo.

**Key Characteristics:**
- Dark green wall (`pared`) with a tiled paint texture; plates in full-colour enamel on top.
- Every container is a plate (`.chapa`): screws, gloss gradient, grain, soft drop shadow, inset rim.
- One shared scale unit `--k` (one pixel of the 1536 px mockup) sizes plate radii, screws, shadows and the first-screen type.
- Anton only at weight 400; headings in uppercase.
- Irregular shelf: wide plates alternate with groups of three tall plates hung at different heights and tilted under 1 degree.
- Price tags are kraft cardboard with handwritten text.

## Colors

A saturated primary-enamel palette on a near-black green wall; no beige, cream or ivory base. The nearest warm tone, enamel white, is a cool-leaning grey (`#d6d1ca`), used for signs, not as page ground.

### Primary
- **Cobalt Enamel** (#06236b): the headline sign, the "no era este" closing plate, object plates in cobalt. Text on it is `blanco`.
- **Live Cobalt** (#1747b8): buttons and focus halo; the brighter blue for things that get pressed.
- **Signal Red** (#a82a1a): the Bolsa sign, the bag title, the pressed heart. White text.

### Secondary
- **Almacén Yellow** (#e8b414): the free-shipping strip, the pay button, bag progress bar, scrollbar, selection and skip link. Text on it is `tinta`.

### Neutral
- **Painted Wall** (#16261c): page background under a tiled wall texture; `theme-color`.
- **Wall Shadow** (#0e1a13): `html` background, scrollbar track, drawer and backdrop base.
- **Enamel White** (#d6d1ca) and **Enamel Light** (#ebe8e2): sign faces, wordmark plate, navigation, form fields in the bag. Text on them is `tinta`.
- **Sign Black** (#14161a): black object plates (text `blanco`).
- **Navy Ink** (#0b1e64): all text on light enamel and on yellow.
- **Cool White** (#eef0f7): body text on the wall and on dark plates.
- **Rim tones** (#f6d25a, #d9523f, #3a63c4, #5a5f68): the lighter edge ring around photos on yellow, red, cobalt and black plates.

### Named Rules
**The Flat Enamel Rule.** A plate is one solid colour from the palette above plus gloss and grain. Gradients appear only as the diagonal gloss (112 degrees, white 20% to transparent to black 14%) and the screw dots, never as a colour fill.

**The Ink Pairing Rule.** Dark ink (`tinta`) goes on enamel white and yellow; white goes on cobalt, red and black. Do not cross them.

## Typography

**Display Font:** Anton (Arial Narrow fallback), weight 400 only
**Body Font:** Barlow Condensed (Arial Narrow fallback), 600 and 700, with 500 for long prose
**Wordmark Font:** Archivo Variable, `wght` 850, used for "Sobremesa" only
**Hand Font:** Caveat 600 and 700

**Character:** Shop-sign capitals with a narrow, tall read; the hand font is the only human trace and is kept to price tags and bag prices.

### Hierarchy
- **Display** (Anton 400, clamp(2rem, 4.6vw, 4rem), 1.02, uppercase): section sign titles (`.rotulo`). The first-screen headline uses Anton at `calc(91 * var(--k))`.
- **Headline** (Anton 400, clamp(1.6rem, 2.6vw, 2.3rem), 1.05, uppercase): object names; wide plates raise it to clamp(2.2rem, 4.2vw, 3.8rem). Prices are Anton at 1.75rem.
- **Title** (Barlow Condensed 700, 1.25rem, 0.02em): buttons and navigation signs (navigation is `calc(27 * var(--k))` on desktop, 1.0625rem on phones).
- **Body** (Barlow Condensed 500, clamp(1.0625rem, 1.5vw, 1.25rem), 1.45, max 62ch): section leads. Card phrases are 600 at 1.0625rem.
- **Label** (Barlow Condensed 700, 0.9375rem, 0.08em, uppercase): stock and workshop meta lines and form labels.
- **Hand** (Caveat 700, 1.6rem, in the bag; 600/700 at `calc(17 * var(--k))` on the kraft tags): prices and names on cardboard.

### Named Rules
**The One Weight Rule.** Anton exists only at 400; `font-synthesis: none` is set on the body so no faux bold is ever produced.

**The Cardboard Hand Rule.** Caveat appears only on kraft tags and the price line of a bag item (a tag-like sign). It is never used for body copy or headings.

## Layout

The first screen is a fixed-proportion 3:2 frame (the approved mockup, 1536 by 1024). Its parts are placed by percentage boxes (`medidas.ts`), and every size inside scales with `--k = 100cqw / 1536`. Below it, `.cuerpo` flows as a single column whose width follows the frame (clamp 1280px to 1760px, with the viewport height driving it), with `--gutter` side padding and a section gap of clamp(72px, 9vw, 140px). In the flowing body `--k` is clamp(0.62px, 100vw / 1536, 1px).

The object shelf (`.estante`) alternates a wide plate (photo 1.2fr, text 1fr; mirrored on the second), a group of three tall plates (3 columns, gap clamp(20px, 3vw, 48px)), another wide plate, another group of three, and a closing cobalt plate. Tall plates hang at different heights (top offsets 0, up to 108px, up to 44px) and tilt -0.5, +0.6 and -0.3 degrees; photo ratios differ (4:5, 1:1, 3:4). Below 900px the wide plates stack, tall plates go to two columns with no offset or tilt; below 620px they go to one column. On phones the first-screen frame collapses to a flow: bag and name row, a four-sign navigation row, one cobalt headline plate, a strip of the photo with numbered object pins.

Touch targets are 44px or more (buttons 48px, pay 56px). The bag is a 480px drawer from the right.

## Elevation & Depth

Depth is physical and consistent: a plate sits on the wall with a soft black drop shadow (about `0 7k 14k` at 50%), an inset light rim (2.5k at 30% white) and an inset bottom shade (`0 -5k 9k` at 28% black). Photos sit in a plate with a coloured rim ring and a smaller shadow. Hover on controls lifts them 2px with a brightness bump; pressed sinks them 1px. A pointer-following soft highlight (`overlay` blend, radial white 50%) is the only dynamic reflection and is a finish, not a feature.

Shadow vocabulary lives in the sidecar. There are no hard offset shadows.

### Named Rules
**The Hung-Not-Floating Rule.** Shadows fall straight down, short and dark, as on a wall. Never a coloured glow or a large ambient blur.

## Shapes

Rounded rectangles throughout: plates 16k (about 16px at full width), small plates 12k, photos 10k, buttons 10px, form fields 10px, the bag lines 12px. Four round screw heads at the corners of every large plate; small plates have two, vertically centred at the sides. Photos on the first screen are printed across three plates with a gap between them (seams with screw holes). The call-to-action on the cover is an arrow-shaped sign (a pentagon with a pale inner outline). Rim lines on photos and rules inside plates are 2 to 4k wide.

## Components

### Buttons
- **Shape:** 10px radius, 48px minimum height, 22px side padding.
- **Primary:** live cobalt face (#1747b8), white Barlow Condensed 700 at 1.25rem, an inset white ring (2px at 85%) and a drop shadow.
- **Light:** enamel white face with `tinta` text and a navy-tinted inset ring.
- **Pay:** yellow face, `tinta` text, 56px, labelled "Pagar (de prueba)".
- **Hover / Focus:** hover lifts 2px and brightens 12%; active sinks 1px; focus is a 3px white outline with a 6px live-cobalt halo. Disabled drops to 55% opacity.
- **Small:** 44px high for the shelf ("Sumá"); a heart button is 44px square, outlined, and turns red when saved.

### Plates (signature)
A `.chapa` takes its colour from `--c`, its texture from `--textura` (a grain image at soft-light, 55% opacity) and its screw colour from `--tornillo`. Object plates take background, ink and rim from the five-colour table (yellow/navy, red/white, cobalt/cool white, white/navy, black/cool white) and carry a photo, a name, a phrase, a workshop line, a divider rule in the ink colour, a price and the Sumá button.

### Navigation
The wordmark is a white plate (Archivo 850 name plus a spaced uppercase sub line); four enamel-white small plates link to sections; the Bolsa plate is red with a bag icon and a live count. The count plate gives a short scale and rotate knock when something is added.

### Kraft price tags
Real cardboard-tag raster, rotated, hung by a thread from its object on the cover photo, with handwritten name and a larger price. Hover swings them 5 degrees. On phones they collapse to numbered dots.

### Bag drawer
A dark wall-colored drawer with a pale left edge; each line is a tilted (+/-0.4 degree) enamel-white card with thumbnail, uppercase name, handwritten price, stepper, and a yellow free-shipping bar. A completed order shows a yellow plate. The drawer states that no payment is real.

## Do's and Don'ts

### Do:
- **Do** build every new container as a plate: one palette colour, grain, screws, gloss, the soft drop shadow.
- **Do** keep the wall `#16261c` / `#0e1a13` and let the signs carry colour.
- **Do** use Anton 400 uppercase for titles and prices, Barlow Condensed for reading text.
- **Do** size anything inside the frame with `--k` so it scales with the plates.
- **Do** keep 44px tap targets and the white-plus-cobalt focus ring.
- **Do** keep irregular, hand-hung rhythm on the shelf (varied photo ratios, tilts under 1 degree).

### Don't:
- **Don't** put text on a plate with the wrong ink pairing (navy on cobalt, white on enamel).
- **Don't** use Anton at any weight but 400 or enable synthetic bold.
- **Don't** use Caveat outside cardboard tags and bag prices.
- **Don't** add hard offset shadows, coloured glows or gradient colour fills.
- **Don't** introduce beige, cream or ivory as a ground colour.
- **Don't** repeat identical cards in a uniform grid.

Defects the build carries and this file does not canonize: see sidecar narrative notes.

## Added after the documenter run (2026-10-24)

The sidecar and the sections above were derived before three late additions; they follow the same tokens (enamel plates, `.chapa`, `.btn-chapa`, `.punto`):
- **Depósito** (`Deposito.astro`): colour-coded large cards (3 then 4 per row, alternate tilt among the visible ones) and small boxes, colour dots as 44 px targets with `aria-pressed`, one live counter "Mostrando N de 360 objetos", a floating "Filtrar" button on narrow screens while the depot is in view.
- **Filtros** (`Filtros.astro`): left drawer `<dialog>`, one option per group, AND between groups, honest empty state.
- **Laterales / Rieles**: side plates (hero) and fixed vertical signs (after the hero) in the strips beside the wall, only at ≥1700 px and ≥16:9; arrows are drawn SVG, not glyphs.
