# Stato del concept: sobremesa

**E-commerce / Esperienza** (Sobremesa, `src/pages/ecommerce/sobremesa/`, concept `src/concepts/sobremesa/`), livello 3, in **spagnolo rioplatense** (voseo, pesos ARS).
Negozio-rivista inventato di casa e tavola: ogni storia ha i suoi oggetti dentro. **Prova COMPLETA di Impeccable** (vedi memoria `impeccable-test-completo-prossima-homepage`).
**Stato (2026-10-24): bozza in costruzione sul ramo `prova-impeccable-editoriale`, SOLO LOCALE (nessun push, nulla in hub/sitemap).** Nome «Sobremesa» provvisorio: da cercare sul web prima di pubblicare.

**Riga struttura / materia / gesto:** home di negozio-rivista con scene acquistabili (parete di un almacén coperta di cartelli) / lamiere smaltate (cobalto, rosso, giallo, bianco, nero) su parete verde scuro, foto impresse su lamiere / «Del cuadro a la chapa»: toccando un oggetto della foto (o dello scaffale) i suoi pixel si fondono in una lamiera con la sua sagoma, che si appende vicino al cartello di dati; "Sumá a la bolsa" la fa volare al cartello rosso.

## Percorso Impeccable (dove siamo)
- `PRODUCT.md` (radice, da spostare in `docs/` a fine prova: influenza `detect`/`critique` degli altri concept) + brief di superficie `.impeccable/surfaces/src-pages-ecommerce-sobremesa-index-astro.md` col contratto di direzione (6 blocchi).
- Direzione **Chapa de almacén** scelta dall'autore (battendo il dado: assegnato "quaderno scolastico"). WOW scelto: **Del cuadro a la chapa**. Struttura sotto l'hero approvata (vedi sotto).
- Percorso **comp-led con mockup portati dall'autore** (nessun generatore nell'ambiente). Mockup approvato: `.impeccable/mocks/comp-1-b.png` (ChatGPT, 1536×1024; prompt incorporato nel PNG e in `.json`). Alternative viste: comp-2-b (colonna, utile come layout telefono), comp-3-b (lamiere con sagoma di oggetto).
- `build-phase` (stato in `.impeccable/build/state.json`; `build-phase status`): comps skipped · **spec closed** (40 riquadri, `spec.json`) · **plates closed (FORZATO)** · **hero closed (FORZATO)** · **sections APERTA** · motion · responsive · review pending.
- **Deroga**: l'autore ha scritto in chat «Ignore the comp for the two story photos and the four price tags.» e l'ho citata in `build-phase advance --force --reason "the user said: \"…\""`. Il motore accetta solo frasi che iniziano con ignore/waive/relax/skip/drop/disregard + the comp/plate/region (o «…does not need to match»): «downgrade» NON funziona. La forza riguarda 6 regioni (2 foto storie + 4 cartellini); se si cambia un file di plate il motore rivaluta e serve ripetere la citazione.
- Foto grande della tavola (3 lamiere): generata con ChatGPT dal ritaglio del mockup (`ref-scena.png`), passa il gate SENZA forza. Dichiarare «imagen de ejemplo» nel sito.
- Primo schermo: confronto col mockup **80% a scala esatta, 69% col piano della fascia di ritorno** (34 px in cima spostano/riducono il marco: regola della repo, tenuta). Il motore ha comunque lasciato passare l'hero.

## Struttura sotto l'hero (APPROVATA dall'autore)
1. Tre storie (la 1ª è l'hero, due piccole già nel mockup). 2. **Lo que vimos en la mesa** (`#objetos`, 8 oggetti, ritmo 3/4/5 colonne). 3. **Quién lo hace** (`#nosotros`, 3 talleres). 4. **Envíos y cuotas** (calcolatrice zona/monto). 5. **Números anteriores** (`#revista`, 6 tapas con indice). 6. **Bolsa** (cassetto: cartellini appesi, regalo + messaggio, scorte, barra spedizione gratuita, checkout di prova, nessun marchio di pagamento). 7. **Mi libreta** (preferiti) e **Seguí tu pedido** (4 tramiti). 8. Newsletter + piede con logo Loop.

## File (src/concepts/sobremesa/)
FATTI E VERIFICATI (build + screenshot 1536×1024): `base.css` (token, `.chapa`, `.chapa--chica`, `.cuerpo`, `.rotulo`, `.btn-chapa`), `caja.ts` + `medidas.ts` (riquadri del mockup in frazioni; `caja(id)`, `dentro(id,padre)`), `Fascia.astro`, `Pared.astro` (marco 3:2 con `container-type`, `--k` = 1 px del mockup), `Testata.astro`, `Portada.astro` (titolo, 3 lamiere foto, 4 cartellini `.cartelito[data-objeto]`, CTA `[data-sumar-mesa]`), `Historias.astro`, `Envio.astro` (fascia gialla), `estado.ts` (bolsa/libreta/pedidos in localStorage, eventi `sb:bolsa`, `sb:libreta`, `sb:pedidos`), `dati.ts` (8 oggetti `OBJETOS`, `COLOR`, `TALLERES`, `ZONAS`, `NUMEROS`, `PASOS_PEDIDO`).
COLLEGATI in `index.astro` (2026-10-24) e provati a 1440 e 390 (build ok, 0 errori console, overflow orizzontale 0): `Objetos`, `Talleres`, `Envios`, `Revista`, `Cuenta` dentro `<div class="cuerpo">` dopo `<Pared>`; poi `Pie`, `Chapa` (dialog oggetto) e `Bolsa` fuori dal `<main>`. Flusso provato con Playwright: cartellino → dialog oggetto → «Sumá a la bolsa» (contatore +1) → cassetto bolsa → «Sumá a la bolsa» della portada (+4 della mesa, apre il cassetto) → regalo/zona → pagamento di prova (id `SB-xxxxx`, bolsa svuotata, pedido in `localStorage`).
`Bolsa.astro` (classe `cajon`, NON `bolsa`: collideva con il bottone della testata): cassetto a destra, righe come cartellini bianchi con +/−/Sacar (quantità topata dallo stock), barra spedizione gratuita, regalo + messaggio, zona, totali, «Pagar (de prueba)»; pubblica `sb:bolsa-total` per `Envios`; fa il «colpo» del contatore su `sb:agregado`. `Pie.astro`: boletín finto, avvisi «de ejemplo», logo Loop, crediti.
**Telefono (FATTO 2026-10-24, <=900 px):** niente scala del marco; `Pared.astro` mette il marco in colonna e con `:where([style*='left:'])` annulla (`!important`) le misure del mockup (position relative, left/top/width/height auto), `--k` fisso a 0.8px. Ogni componente dice nel suo `@media (max-width: 900px)` come si dispone: `Testata` (marca + bolsa, 4 voci in griglia), `Portada` (un solo cartel cobalto sulla `<section>`: titolo, tira delle 3 lamine con rapporto del mockup, **punti numerati** al posto dei cartellini di cartone, `leyenda` 2x2 `aria-hidden` con click via `[data-objeto]`, bottone), `Historias` (2 cartelli con foto a sinistra), `Envio` (camion + testo). Trabocchetti: per sovrascrivere width/height di un elemento con `left:` nello style serve `!important` (la reset è `!important`); `svg` e `rule` ne sono esempi; il bottone-cartellino resta 48 px di zona tattile. Provato a 390/640/901/1440: overflow 0, 0 errori, tap su punto e su leyenda aprono il dialog.
**og.jpg FATTO** (`public/images/sobremesa/og.jpg`, screenshot 1200x630 dell'hero senza fascia, ricrearlo se cambia l'hero). **Texture ripulita FATTA**: `enamel-white/yellow.png` sostituite da `plates/enamel-grano.jpg` (grana procedurale periodica, soft-light); `enamel-blue.png` resta.
DA FARE ANCORA: `info.astro` (rinviata alla chiusura: serve la voce in `src/hub/data.ts` con card/shot e metriche, che dipendono dalla pagina finita e dai collaudi; è lavoro del punto 4 di "Da fare").

## Asset (`src/assets/sobremesa/`, crediti in `CREDITI.md`)
`plates/` (13 plate del gate + `tag.png`, `scena.png`), `objetos/*.jpg` (8 foto Unsplash quadrate), `recortes/*.png` (sagome con alfa: rembg; `hero-*` dalla scena), `talleres/*.jpg` (mani/lavorazioni, senza volti). Font (pacchetti `@fontsource`, OFL): Anton (titoli), Barlow Condensed 600/700 (cartelli), Archivo variabile (marchio), Caveat 600/700 (prezzi a mano). Anton scelto dal motore (`font-match --category sans`).

## Trabocchetti
- `.chapa` è `position:absolute` (per il marco): fuori dal marco usare `.chapa--flujo`. `--k` = `100cqw/1536` dentro `.pared__marco`; nel `.cuerpo` è `clamp(...vw...)`.
- Le caselle dei testi del mockup sono tight sull'inchiostro: i testi si posizionano con `dentro()` e vanno rifiniti a occhio (Anton: `margin-top` negativo).
- Cartellini: il cartone è scalato al 160% (lo spago esce dalla riga) e il prezzo sta nel corpo misurato in `cartonLayout.json`.
- rembg: con `U2NET_HOME` sbagliato scarica un secondo modello da GitHub; il modello vero è `C:\Users\utente\.rembg\models\isnet-general-use\`. Il python di sistema non ha numpy: usare `C:/Users/utente/tools/img-venv/Scripts/python.exe`.
- La pagina `serve-question` si chiude da sola dopo un po'; la pagina `component-review` è un server a parte (porta variabile).
- Unsplash: chiave in `C:\Users\utente\Documents\Assets\Loop\Unsplash.txt` (mai stamparla, 50 richieste/ora, registrare il download).

## Da fare (in ordine)
1. ~~Bolsa, Pie, collegare le sezioni, hero telefono, og.jpg, texture~~ FATTO (2026-10-24). `info.astro` a fine lavoro (punto 4).
2. Fase `sections` → `motion` (gesto firma già scritto in `Chapa.astro`; il resto del movimento sobrio, `reduced-motion`) → `responsive` (`build-phase` chiede `desktop.png` 1440 e `mobile.png` 390 in `.impeccable/review/`).
3. **Mostrare la bozza all'autore PRIMA di qualunque collaudo** (regola del flusso). Poi: `impeccable detect` sulla pagina compilata, finish reviewer (agente fresco), documenter (DESIGN.md + `.impeccable/design.json`), axe, Lighthouse, `build-phase finish --disposition ship`.
4. Chiusura: hub (`src/hub/data.ts` voce + `backend` neutro, `info.astro`, `public/sitemap.xml`, card/screenshot in `src/assets/hub/`), avviso sito madre (`vetrinePerContatti`: slug `sobremesa`), README, spostare PRODUCT.md in `docs/`, memoria. **Push solo dopo il via esplicito.**

## Promemoria clear (richiesta dell'autore, 2026-10-24)
Avvisare l'autore con un messaggio esplicito («È il momento di fare /clear» + il testo da incollare) in questi punti, dopo aver aggiornato questa scheda e la memoria e fatto un commit locale:
1. **Dopo la prima bozza completa** (sezioni collegate, bolsa, versione telefono) e dopo il suo parere, PRIMA dei collaudi.
2. **Dopo i collaudi e le correzioni** (detect, finish reviewer, documenter, axe, Lighthouse), PRIMA di hub / sito madre / README.
