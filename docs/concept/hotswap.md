# Stato del concept: hotswap

(Scheda spostata da CLAUDE.md il 2026-10-20; aggiornarla qui a ogni modifica.)

**Tech / Computer e gaming** (Hot Swap, `src/pages/tech/pc-gaming/`, concept `src/concepts/hotswap/`): livello **Medium** della macro Tech,
  pubblicata il 2026-10-07. `build` ok, axe 0 violazioni (desktop, 390 px, cassetto lista con scelta del ritiro), Lighthouse 99 mobile / 100 desktop (CLS 0).
  **Unico concept in INGLESE** (lang="en", prezzi in €); fascia di ritorno, hub e `info` restano italiani. Idea-guida: tastiera meccanica "colorway"
  (beige, grafite, arancio #ff6b2c, acqua #2fb5a8; Rubik + Albert Sans; bottoni `.tasto` con spessore che si abbassa; scrollbar a tasto; nessuna foto,
  illustrazioni SVG in `figure.ts`). Pezzi forti: `Builder.astro` + `regole.ts` (drag con mouse/penna/maniglia su touch, regole vere di socket/RAM/lunghezza
  scheda/alimentatore, budget, FPS di giochi di fantasia, scontrino con codice), `Shop.astro` (FLIP, ricerca, ordinamento, anteprima, confronto fino a 3),
  `Lista.astro` (cassetto + scelta di giorno/ora di ritiro dalle fasce reali, biglietto), `Visita.astro` (orari, "aperto ora" su ora di Roma, biglietto del
  ritiro, piantina), `Servizi.astro` (badge dalla lista, icone animate all'hover o in vista su touch), `Offerte.astro` (3 sconti scelti dal giorno, conto alla
  rovescia a mezzanotte), `Recensioni.astro`. Dati in `catalogo.ts`; orari e fasce in `ritiro.ts` (unica fonte per tabella e prenotazione, solo browser a runtime).
  Eventi interni: `hotswap:aggiungi`, `hotswap:lista` (porta `ids`), `hotswap:ritiro`, `hotswap:filtro`. Nome "Hot Swap" = termine tecnico generico (marchio debole):
  controllo marchi su TMview/UIBM ancora da fare davvero. Marchi, prodotti e giochi sono di fantasia. Il menù mobile ha l'icona sola sotto i 520 px. Barra fissa su telefono (`Barra.astro`, 2026-10-17): "Build your PC" + "My list" con contatore, compare dopo l hero e si nasconde nel builder e nella visita (non ancora provata a vista).
  Firefox/Safari reali, rilettura testi. Non fatto: hero con mini-builder a preset (valutato, rimandato). Sul sito madre (`vetrinePerContatti`), verificato il 2026-10-20.
