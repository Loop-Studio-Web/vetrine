# Stato del concept: aeterna

(Scheda spostata da CLAUDE.md il 2026-10-20; aggiornarla qui a ogni modifica.)

**Benessere / Clinica di longevità** (Aeterna, `src/pages/benessere/longevity/`, concept `src/concepts/aeterna/`):
  livello **High** della macro, pubblicata il 2026-10-05, rifinita lo stesso giorno (stesso concept, commit successivo). `build` ok, axe 0 violazioni
  (desktop, dopo flusso assessment/suite, drawer aperto, mobile con menù aperto), Lighthouse 90 mobile / 96 desktop. Idea-guida: laboratorio di notte
  (blu abisso, smeraldo, filo d'oro, pause chiare "ghiaccio"); Instrument Serif (titoli) + Montserrat + JetBrains Mono (solo dati tecnici) + Cinzel (solo marchio). Tecnologie: Three.js con shader GLSL
  propri (`elica.ts`, import dinamico dopo il primo paint; su telefono solo alla prima interazione, poster SVG nel markup), GSAP + ScrollTrigger +
  Lenis (`motore.ts`; Lenis solo con mouse e senza reduced-motion), sezione protocolli bloccata con scorrimento orizzontale e lente
  sui disegni SVG (`disegni.ts`, `protocolli.ts`), Bio-Assessment a 4 passi con radar SVG in tempo reale, scanner prima/dopo in canvas, prenotazione
  della suite con prezzo live e drawer (`<dialog>`), cursore ad anello e bottoni magnetici (solo mouse fine). Dati e valori clinici sono di fantasia e
  dichiarati tali (nessun claim medico presentato come reale, nessun volto nel prima/dopo). Marchio: SVG dell'isotipo ad anello fornito dall'utente
  (idea `aeterna`), ricostruito in `Logo.astro`. Scelta tra due proposte dell'utente (Aeterna e Althea): scelta Aeterna perché Althea (salvia/avorio,
  18 sezioni standard) somigliava a barbiere e Lumen e non aveva WebGL. Attenzione: `motore.ts` usa il browser, nel frontmatter `.astro` importare
  solo `formato.ts`. Preloader a OGNI caricamento (non una volta per sessione): copre la preparazione dell'elica; Three.js si scarica subito e gli shader si compilano con `compileAsync` (se parte tardi, rovina l'animazione del titolo: provato con un contatore `?perf`, poi tolto). Su telefono i Protocolli sono a scorrimento nativo, una schermata per volta con freccia; i `fieldset` vanno con `min-width: 0` (hanno min-content) e le griglie a una colonna con `minmax(0, 1fr)`, altrimenti sotto i 320 px la pagina sborda. Da fare: Firefox/Safari reali, rilettura testi, controllo che il nome "Aeterna" non coincida con un marchio reale.
