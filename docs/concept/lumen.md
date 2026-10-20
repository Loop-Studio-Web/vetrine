# Stato del concept: lumen

(Scheda spostata da CLAUDE.md il 2026-10-20; aggiornarla qui a ogni modifica.)

**Benessere / Centro estetico** (Atelier Lumen, `src/pages/benessere/estetica/`, concept `src/concepts/lumen/`):
  livello **Medium** della macro, pubblicata (2026-10-04). `build` ok, axe 0 violazioni (desktop, dopo il
  flusso di prenotazione, mobile con menù aperto), Lighthouse 99 mobile / 100 desktop. Idea-guida: una giornata di luce
  (alba, mattino, mezzogiorno, tramonto, sera; `data-ora` per sezione), cipria/pesca/avorio/oro rosato/prugna; Cormorant +
  DM Sans. Salto rispetto al barbiere: configuratore del rituale (`SuMisura.astro`, dati in `servizi.ts`, il risultato
  precompila la prenotazione via evento `lumen:servizio`), meridiana nella navbar (ora dallo scroll) e alone di luce
  col mouse (`Meridiana.astro`), schede con tilt 3D e filtro, tre cabine a fisarmonica, prenotazione a fasce di luce con
  "biglietto di luce" (`fasce.ts`, giorni calcolati da oggi), menù mobile a tenda. Nessun volto: foto Unsplash libere di
  cielo, oli, candele, prodotti. Logo: SVG forniti dall'utente (`src/assets/lumen/brand/`), favicon dal simbolo nel cerchio.
  Provato su iPhone 12 mini/Safari dall'utente (ok); sito madre e banner del README aggiornati. Da fare: Firefox, rilettura dei testi.
