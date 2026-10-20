# Stato del concept: fixlab

(Scheda spostata da CLAUDE.md il 2026-10-20; aggiornarla qui a ogni modifica.)

**Tech / Riparazioni** (FIXLAB, `src/pages/tech/riparazioni/`, concept `src/concepts/fixlab/`): livello **Low key** della nuova macro Tech
  (aggiunta in più rispetto a Legale e Negozio, che restano "in cantiere"; Tech è l'ora "notte fonda" dell'hub). Pubblicata il 2026-10-05. `build` ok, axe 0 violazioni (desktop, dopo scheda e invio modulo, mobile con menù aperto, hub chiaro/scuro),
  Lighthouse 100/100/100 mobile e desktop (font precaricati con `?url`: senza, CLS 0,12 sull'hero). Brief dell'utente: PDF "TECH Vetrine Low/Medium/High"
  e spec FIXLAB (zip `fixlabtechlowkey`): palette ghiaccio #F5F7F9, blu notte #17232D, blu elettrico #2878FF, grigio #89949E, verde #48B883; logo F a circuito
  (SVG dell'utente in `src/assets/fixlab/brand/`, favicon in `public/images/fixlab/`). Idea-guida (mia, approvata): **la pagina è una scheda di lavoro di
  riparazione** (campi numerati "N° 02", cartellino con talloncino, ricevuta). Pezzi forti: smartphone in vista esplosa in CSS 3D nell'hero (ogni pezzo = servizio con
  prezzo, il click precompila "Trova il servizio"), "Trova il servizio" (dispositivo + problema → scheda con prezzo "da", tempi, passi; dati in `riparazioni.ts`,
  unica fonte anche per listino e modulo), tracker "segui la riparazione" con codici demo FX-0417/0382/0455, modulo come scheda con ricevuta, "aperto ora" calcolato,
  barra fissa chiama/richiedi su telefono, menù mobile = pannello posteriore avvitato (4 viti che si svitano). Caratteri Outfit + Instrument Sans; tema solo chiaro
  (sezioni scure blu notte); scrollbar a righello. Eventi interni: `fixlab:scegli` e `fixlab:richiesta`. Il `.cover` del menù sta FUORI dall'header (il backdrop-filter
  della barra fa da blocco contenitore ai fixed). Dati, prezzi, recensioni, indirizzo e numero di telefono sono di fantasia. Nessuna foto: tutto SVG/CSS.
  Da fare: controllo marchi sul nome "FIXLAB" (e NEXUS/NÓVA, nomi proposti per Medium e High), Firefox/Safari reali, rilettura testi.
