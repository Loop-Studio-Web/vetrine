# Stato del concept: softriot

**E-commerce / Evoluto** (Soft Riot, `src/pages/ecommerce/softriot/`, concept `src/concepts/softriot/`, slug hub `softriot`), livello 2, in **inglese**. Negozio di abbigliamento e accessori. **In lavorazione dal 2026-10-21** (nessun commit di codice finora).

**Riga struttura / materia / gesto:** home da negozio (fascia avvisi, hero carosello, catalogo filtrabile, scheda rapida, carrello laterale) / campi di colore pieno, raso trapuntato 3D (render AI di brand) e foto vere di moda in ritagli / il ritaglio che si apre (una finestra con forma diversa per tessera che al passaggio/tocco si allarga sul capo intero). Differisce da Chioma in tutte e tre le colonne. Il nodo è solo immagine di brand (Marrow & Knot lo ha già come gesto); il colore cambia per umore del prodotto, non per ora del giorno (Ordito).

**Decisioni (2026-10-21):**
- Palette: inchiostro viola `#1d1033`, mandarino `#ff8a1f` (guida), lavanda `#b9a8f2`, pesca `#ffb27a`, corallo `#ff6b5a`, nebbia lilla `#ece6ff` (con grana). Rischio "viola da AI": il mandarino guida, il gradiente vive solo nella lucentezza del raso e tra le coppie del carosello.
- Font: LT Cowboy (+ Cowboy Text) per wordmark e titoli, LT Gutbust per una riga editoriale, Bricolage Grotesque per i testi. Tutti OFL, file in `src/assets/softriot/font/` con OFL-*.txt.
- Carosello: i pezzi generati (cappello+sciarpa, borsa, muffole, occhiali) sono **prodotti trend del marchio Soft Riot**; il resto del catalogo è fatto di foto vere da siti con licenza libera (Pexels, Unsplash, Pixabay), scelte senza vincolo di affinità, crediti in `src/assets/softriot/foto/CREDITI.md`.
- Ritagli degli asset (rembg) in `src/assets/softriot/brand/` (WebP con trasparenza). Originali JPG in `C:\Users\utente\Pictures\Assets\Soft-Riot`.
- Test: prima si mostra la bozza all'utente; solo se approvata, Impeccable (`detect` sulla pagina compilata + `critique`) PRIMA di axe e Lighthouse; altrimenti prima le modifiche.

**Struttura del progetto (fase 2):**
```
src/pages/ecommerce/softriot/index.astro     impianto (head, font preload, ordine sezioni)
src/pages/ecommerce/softriot/info.astro      scheda hub (5 righe con Dettaglio.astro)
src/concepts/softriot/base.css               token, @font-face, reset, grana
src/concepts/softriot/dati.ts                prodotti, filtri, slide, testi (EN)
src/concepts/softriot/Fascia.astro           fascia di ritorno alle vetrine
src/concepts/softriot/Annunci.astro          striscia avvisi (spedizione, resi, demo)
src/concepts/softriot/Testata.astro          nav asimmetrica + wordmark + carrello (menù mobile proprio)
src/concepts/softriot/Carosello.astro        hero: 4 slide a colore pieno con i pezzi di brand
src/concepts/softriot/Catalogo.astro         barra filtri sticky + griglia irregolare + ritagli che si aprono
src/concepts/softriot/Scheda.astro           scheda rapida (<dialog>), il ritaglio cresce fino a riempirla
src/concepts/softriot/Carrello.astro         cassetto laterale, barra spedizione gratuita, ordine di prova
src/concepts/softriot/Striscia.astro         fascia editoriale Gutbust a campo mandarino
src/concepts/softriot/Footer.astro           logo completo B, link allo studio
src/assets/softriot/{font,brand,foto}/       font OFL, pezzi di brand (WebP), foto catalogo + CREDITI.md
public/images/softriot/                      og.jpg 1200x630, favicon.svg (la "S")
```
Fase 3 (asset): font e pezzi di brand fatti; foto del catalogo in corso (Pexels via ricerca con curl, 14-16 prodotti); mancano favicon "S" vettoriale, og:image, eventuale carrello vuoto/404 (cintura annodata già disponibile).

**Stato (2026-10-21, sera): prima bozza costruita, NON ancora vista dall'utente; nessun test fatto** (build ok, solo controllo visivo con screenshot locali su `http://localhost:4401/ecommerce/softriot/`).
- Pezzi: Fascia, Annunci, Testata (cartellino ink appeso + menù mobile a pannello), Carosello (4 slide dei pezzi di brand, scroll-snap, pausa), Catalogo (18 tessere: 14 foto Pexels + 4 originali; filtri categoria/taglia/colore/ricerca/ordine; finestre clip-path che si aprono; sul telefono si aprono a metà schermo), Scheda (dialog), Carrello (cassetto/foglio, barra spedizione, ordine di prova), Striscia (Gutbust + "S"), Footer (logo B).
- Stato condiviso in `stato.ts` (borsa in localStorage + eventi `sr:*`). Gli elementi creati da JS hanno stili in `<style is:global>` (Scheda `.taglia`, Carrello `.riga*`).
- Trabocchetti: i brand-cutout nel catalogo usano le immagini `*-quadro.webp` (pezzo già centrato nell'aspetto della tessera: così `taglio` è in coordinate di tessera); le variabili `--ib/--it/...` sono gli inset della finestra (`--b` è il colore del campo!); `[data-conta]` esiste sia nella testata (borsa) sia nel catalogo.
- Da fare dopo l'approvazione: voce in `data.ts` (campo `backend`, livello 2, lingua EN) + `info.astro` + sitemap; avvisare per `vetrinePerContatti` nel sito madre; test (Impeccable detect+critique, axe, Lighthouse); PSI online; rilettura testi; eventuale View Transition tessera→scheda.

**Seconda giro (2026-10-21, dopo i riferimenti dell'utente):** testata rifatta sul riferimento (05-fotografia-prodotto-estrema): riga 2 grande con due voci a sinistra, nome al centro (testo Cowboy + "S" in raso piccola; logo verticale B non adatto all'header), a destra Login (finto, dialog) · cuore preferiti (localStorage, filtra il catalogo) · cerca a cerchio che si allarga (searchbar 2, apre SOPRA le icone) · carrello con conto; riga 3 lavanda "Shop by:" che scorre via (sticky solo la riga 2). Su telefono: menù a pannello + cerca + carrello. Filtri: cassetto verticale a sinistra (`Filtri.astro`, riferimento d52f97d7…webp: sezioni richiudibili, scelte con +/×, prezzo a doppio cursore, "Show only", ordina, bottone "Show N pieces"); nella barra restano le categorie, l'ordina e il bottone "Filter" con conto; filtri attivi come chip rimovibili sotto la barra. Tessere e scheda: cuore + carrello (aggiunta veloce con avviso, o apre la scheda se serve la taglia). Striscia: "S" portata più su, `id="chi-siamo"`.
- Idee per la barra, da decidere: densità griglia (2/3 colonne), "Saved (n)" come scorciatoia, "New in" come filtro, vista a elenco.
- Trabocchetti: `.chip` è in base.css (usato da barra e cassetto); `.attivo` e le righe del carrello/`.taglia` sono `is:global` perché creati da JS.
