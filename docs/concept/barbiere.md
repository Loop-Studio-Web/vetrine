# Stato del concept: barbiere

(Scheda spostata da CLAUDE.md il 2026-10-20; aggiornarla qui a ogni modifica.)

**Benessere / Barbiere** (Bottega Tre Rasoi, `src/pages/benessere/barbiere/`): pubblicata (2026-10-04),
  livello **Low key** della macro. `build` ok, axe 0 violazioni (desktop chiaro/scuro, dopo il flusso
  del turno, mobile con menù aperto), Lighthouse 95 mobile / 100 desktop. Crema, verde bottiglia, ottone;
  Fraunces + Figtree; tema scuro "chiusura serale". Prenotazione "a turno" con numerino, tre sedie
  (anche sulla foto della sala) con primo posto libero calcolato da oggi (`turni.ts`), menù mobile ad
  asciugamano, cursore a forbici (CSS `cursor: url(svg)`, nessun JS) e scrollbar a righe come il palo.
  Foto Unsplash libere; i poster con marchi nella foto delle poltrone sono stati sfocati. Logo generato con AI e
  vettorializzato (`src/assets/barbiere/brand/`). Scala dei livelli: **Medium e High devono aggiungere animazioni,
  hover ed effetti (anche JS)** per far notare la differenza di budget.
