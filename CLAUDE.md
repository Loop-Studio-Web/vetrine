# Loop Studio — Vetrine

## Cos'è

Homepage concept dimostrative, non siti di clienti reali: materiale di
portfolio per attrarre nuovi clienti, linkato dal Lab del sito principale
(theloopstudio.org/lab/). Organizzate per macrocategoria di attività (es.
"Ristorazione"), con più varianti/archetipi dentro ciascuna (es. Grande
ristorante di classe, Trattoria, RistoPub) per intercettare
il maggior numero possibile di tipologie di cliente.

Repo gemella di [Loop-Studio-Web/lab](https://github.com/Loop-Studio-Web/lab)
(micro-esperimenti e componenti), ma con un'infrastruttura diversa: qui ogni
concept è una pagina intera e il progetto usa Astro con build, non file
statici serviti as-is.

## Regola più importante: nessuna struttura o design condivisi tra i concept

Questa repo è **solo infrastruttura comune** (un `package.json`, una build,
un deploy automatico): NON è un design system. Ogni concept ha markup, CSS e
JS propri, indipendenti dagli altri — niente componenti/layout riusati per
principio tra una variante e l'altra, nemmeno tra varianti della stessa
macrocategoria. L'obiettivo esplicito è evitare N concept che sono in realtà
lo stesso sito con palette e font diversi. Si riusa un pezzo di codice tra
due concept solo per coincidenza opportunistica (stesso identico problema
tecnico risolto allo stesso modo), mai come regola.

Ogni concept è libero di usare tecniche/librerie diverse (CSS puro, JS
vanilla, un framework via Astro islands) a seconda di cosa serve a
quel concept specifico — stessa logica di varietà tecnica del repo `lab`.

## Struttura

```
src/pages/<macrocategoria>/<variante>/index.astro   → un concept (solo l'impianto della pagina)
src/concepts/<variante>/                            → sezioni (.astro) e base.css del concept
src/assets/<variante>/                              → immagini, ottimizzate da astro:assets
public/images/<variante>/                           → file con URL fisso (og:image, favicon)
```

Esempio: `src/pages/ristorazione/trattoria/index.astro` importa i componenti di
`src/concepts/trattoria/` (Navbar, Hero, Carousel, Diario, Menu, Reviews,
Storia, Booking, Info, Footer) e `base.css` con token colore, reset e
animazioni. I componenti restano **dentro il concept**: la cartella
`src/concepts/<variante>/` serve a spezzare il file, non a condividere codice
con le altre varianti.

La `src/pages/index.astro` in radice è l'**hub pubblico delle vetrine**: unico punto
d'ingresso, con il marchio dello studio (nero e rosso, Bricolage Grotesque e Hanken
Grotesk, tema scuro e chiaro come theloopstudio.org). Vive in `src/hub/` ed è separato
dai concept. I contenuti sono in `src/hub/data.ts`: a ogni nuova pubblicazione si
aggiunge una voce lì (con le immagini in `src/assets/hub/`) e il concept compare da solo
nella "via" in alto (a scorrimento orizzontale su telefono) e nella sezione delle vetrine, filtrabile per
macrocategoria (`macros` in `data.ts`). L'hub e le pagine `info` replicano gli stili del sito madre (repo `Loop-Studio-Web/Loop_Studio`; la cartella locale cambia da PC a PC, non è sempre `../Loop-Studio`: se non si trova, chiedere o cercare la cartella con quel remoto): header (logo 52/42 px, righe rosse al passaggio, toggle tema con etichetta), footer a colonne con filo rosso animato e icone social, cursore "loop" (`src/hub/Cursore.astro`), scrollbar e selezione del testo, bottoni a 4 px. Sono COPIE, non componenti condivisi: se cambiano sul sito madre vanno riallineate a mano. Cursore e scrollbar del sito madre valgono SOLO per l'hub: i concept hanno i propri (il barbiere: forbici e scrollbar a righe). Ogni concept ha anche una pagina di dettaglio indicizzabile
(`src/pages/<macro>/<variante>/info.astro`, 5 righe che usano `src/hub/Dettaglio.astro`; i testi sono in
`data.ts`) da aggiungere anche in `public/sitemap.xml`. I concept restano `noindex`. I link dall'hub alle homepage dei concept si aprono in una nuova scheda (`target="_blank" rel="noopener"` + testo per lettori di schermo), così l'hub resta aperto; i link alle pagine `info` restano nella stessa scheda. La via è una scena (tutto in `Hero.astro`, CSS + SVG generati con un seme, nessuna immagine): ogni riga di categoria ha cielo, due strati di edifici, finestre, lampioni, marciapiede e strada, con parallasse allo scroll (`--p`, fermo con reduced-motion). Tema scuro = notte, chiaro = giorno. Ogni categoria ha la sua ora (`atmoDi()`, attributo `data-atmo`): Ristorazione = sera, Benessere = alba, Abitare (ex Casa e artigiani) = tramonto (cielo ambra, `tramonto` in `atmoDi`), Tech = notte fonda (cielo quasi nero, finestre azzurre come schermi; in tema chiaro cielo lilla), Studi e Commercio = giorno, righe "in cantiere" = grigio con la gru. Una riga "Stanno per aprire" prende l'ora della sua macro (non la gru). Per una nuova macro basta aggiungerla a `atmoDi` (o scegliere un'ora nuova in CSS). Sopra la via c'è il testo "Benvenuto in Loop Street" (numeri adattati a `concepts`); le categorie senza vetrine hanno `stato` in `prossime` (`'presto'` = "Stanno per aprire", `'cantiere'` = "In cantiere"; il testo parla di "stanno per aprire" solo se esiste almeno una `'presto'`). Il neon "Aperto" ha un difetto per lettera (max 3 lampi/s, fermo con reduced-motion). I titoli con `data-scramble` si decodificano all'ingresso in vista (script in `Layout.astro`, copia della logica del sito madre): mai sull'h1 (LCP mobile) e nascosti con `opacity`, non `visibility` (altrimenti saltano nell'albero di accessibilità). Ogni pagina ha anche
il proprio menù su mobile (hub: pannello a cerchio; Trattoria: cartoncino che si srotola; Ossidiana: sipario; RistoPub: pannello che si riempie di birra; Tre Rasoi: asciugamano che si stende; Lumen: tenda che si apre sulla luce; Aeterna: scansione laser che rivela l'indice; Hot Swap: vassoio con LED; Ordito: tenda di colore con voci giganti e X di chiusura; Sifone: serranda che scende con maniglia e X; Obra Fina: tre mani di llana di colore che si stendono).

- **Livelli (2026-10-07):** ogni concept ha `livello` 1/2/3 e `lingua` in `data.ts`: Essenziale · Evoluto · Esperienza, **relativi alla macrocategoria** (giudicati dal frontend percepito, non dallo stack: Ristorazione = Trattoria 1, Luppolo & Watt 2, Ossidiana 3). Cartellino a tre lampadine (`src/hub/Livello.astro`) su card della via, card delle vetrine e pagina `info`; legenda nella scena di benvenuto e sezione `Livelli.astro` ("Come scegliere", con la frase "Parti da una vetrina, non da zero"). Regole commerciali: ogni concept si vende UNA volta e poi esce dall'hub (va sostituito con uno nuovo); lo sconto NON è pubblico (varia per cliente, si dà nel preventivo); niente fasce di prezzo per livello sull'hub. Lingua come codice testuale (IT/EN/ES), mai bandiere; il prossimo progetto sarà in spagnolo (decidere il mercato). Non usare più "Low key/Medium/High" nei testi pubblici.

## Convenzioni di un concept

- **Niente aspetto "da AI"** (regola dell'utente, 2026-10-07): ogni concept, anche Low key, deve avere carattere visivo vero. Prima di disegnare cercare riferimenti reali, preferire fotografia/texture vere e tipografia con personalità, imperfezioni volute e dettagli artigianali; evitare griglie di schede uguali, palette "da brief", bordi netti + ombre piene, icone SVG troppo pulite, copy da template. Confrontare sempre con i concept esistenti: palette e font non devono ripetersi.
- **Niente beige, crema o avorio come base** (regola dell'utente, 2026-10-07): il portfolio ne è già pieno (Barbiere, Lumen, Sifone, RistoPub, Hot Swap) e Obra Fina è passata a calce azzurrina (*azulete*) proprio per questo. Per ogni nuovo concept scegliere una base che non somigli a quelle già usate (azzurri, verdi, grigi freddi, toni scuri, colori pieni). I **gradienti sono graditi**: usarli con intenzione (OKLCH, `@property`, luce che si sposta con lo scroll), non come decorazione.
- **Palette diverse dentro la stessa macro** (regola dell'utente, 2026-10-09): le tre vetrine di una macrocategoria stanno una accanto all'altra nella via dell'hub, quindi devono differire nettamente per luminosità e tinta di base (es. una scura, una chiara, una a colore pieno). Abitare è venuta troppo simile (Sifone, Obra Fina, Scala Vera: basi chiare e fredde): accettata, da non ripetere. Prima di fissare una palette confrontarla con il campo `palette` delle altre vetrine della macro in `src/hub/data.ts`.
- **Strumenti di collaudo** in `tools/` (package.json proprio, non fanno parte del sito né del deploy): `cd tools && npm install` una volta per PC, poi `node shot.mjs <url> [w] [h] [prefisso]` (screenshot a pezzi, overflow orizzontale, errori in console), `node axe.mjs <url> [selettore da cliccare]` (axe a 1440 e 390 px, anche col menù aperto), `node lh.mjs <url>` (Lighthouse mobile e desktop su `astro preview`). Usano il Chrome di sistema (`CHROME_PATH` per forzarlo).
- **Un componente per sezione**, con markup, CSS (scoped) e JS propri. Gli
  elementi creati via JavaScript non ricevono lo scope: i loro stili vanno in
  un blocco `<style is:global>` dello stesso componente.
- **Immagini solo in locale**, in `src/assets/` e con `<Image>` di
  `astro:assets`: niente hotlink. Da Unsplash solo URL `images.unsplash.com/photo-…`
  (licenza libera); `plus.unsplash.com` è Unsplash+ a pagamento, da scartare.
  Controllare sempre l'assenza di watermark prima di salvare.
- **Percorsi con `base`**: `import.meta.env.BASE_URL` non ha lo slash finale (e con `base: '/'` diventa stringa vuota dopo il replace).
  Usare `const base = import.meta.env.BASE_URL.replace(/\/$/, '')` e poi
  `${base}/percorso`, altrimenti favicon, video e link danno 404 online.
- **Sono vetrine dimostrative**: `noindex, nofollow` su ogni pagina, dati,
  indirizzi e recensioni di fantasia dichiarati come tali ("di esempio"),
  nessun nome o foto di clienti reali, nessun logo di terzi (es. Google).
- **Widget ispirati al lab** (recensioni, prenotazione): si ricreano nel
  concept, con stile proprio, non si importano i bundle compilati.
- **Fascia di ritorno** in cima a ogni concept (`Fascia.astro` nel concept, stile proprio): "vetrina dimostrativa · concept di Loop Studio", link "Tutte le vetrine" e "Ne voglio una così" (`https://theloopstudio.org/contatti/?concept=<slug>`). Non è fissa: è `position: absolute` e scorre via; la navbar fissa del concept ha `top: var(--fascia, 0px)` (lo script della fascia aggiorna `--fascia` allo scroll) così a inizio pagina sta sotto di lei e poi risale. È un `<aside>` con `aria-label` (axe: landmark).
- **Footer** con il logo Loop Studio (SVG, nero o bianco + rosso `#fe3b30`) e
  link a https://theloopstudio.org/.
- **Prima di pubblicare**: `astro build`, `axe-core` a 0 violazioni in tema
  chiaro e scuro, nessuno scorrimento orizzontale a 390 px, prova del flusso
  dei widget e dell'anteprima social (`og:image` 1200×630 in
  `public/images/<variante>/`).
- **Dev server**: dopo riscritture grandi di un componente può servire stili
  vecchi. Se la pagina appare senza stili, `astro dev stop` e
  `astro dev --background`.

## Stato dei concept

- **Ristorazione / Trattoria** (Trattoria del Borgo): pubblicata. Da rifare il
  video dell'hero (il file attuale non è pertinente).
- **Ristorazione / Grande ristorante** (Ossidiana): pubblicata. `build` ok, axe 0 violazioni. Solo tema scuro per
  scelta; percorso a 5 portate in scroll-snap con zoom lento (Ken Burns) sulle
  foto; font Bodoni Moda + Jost + IBM Plex Mono. Logo generato con AI
  (simbolo ritagliato in `src/assets/ossidiana/brand/simbolo.png`).
- **Ristorazione / RistoPub** (Luppolo & Watt, `src/pages/ristorazione/ristopub/`): pubblicata
  (2026-10-04). `build` ok, axe 0 violazioni (desktop, mobile con menù aperto, dopo il flusso di
  prenotazione), Lighthouse 99/100/100. Birrificio-pub con palco: carta kraft, ambra, inchiostro,
  Big Shoulders Display + Archivo; tema chiaro con sezione "palco" scura. Menù mobile "a spina"
  (si riempie di birra), boccale che accompagna il cursore (solo mouse), intro breve una volta per
  sessione, barra di avanzamento e scrollbar ambra con schiuma. Date degli eventi calcolate da oggi
  (`eventi.ts`). Logo generato con AI e vettorializzato (`src/assets/ristopub/brand/simbolo.svg`).
  Foto Unsplash libere, scelte senza marchi di terzi sulle spine. Da collaudare ancora su WebKit/iPhone
  reale e Firefox.
- **La macrocategoria Ristorazione è chiusa**: tre concept (Trattoria, Ossidiana, Luppolo & Watt).
- **Benessere / Barbiere** (Bottega Tre Rasoi, `src/pages/benessere/barbiere/`): pubblicata (2026-10-04),
  livello **Low key** della macro. `build` ok, axe 0 violazioni (desktop chiaro/scuro, dopo il flusso
  del turno, mobile con menù aperto), Lighthouse 95 mobile / 100 desktop. Crema, verde bottiglia, ottone;
  Fraunces + Figtree; tema scuro "chiusura serale". Prenotazione "a turno" con numerino, tre sedie
  (anche sulla foto della sala) con primo posto libero calcolato da oggi (`turni.ts`), menù mobile ad
  asciugamano, cursore a forbici (CSS `cursor: url(svg)`, nessun JS) e scrollbar a righe come il palo.
  Foto Unsplash libere; i poster con marchi nella foto delle poltrone sono stati sfocati. Logo generato con AI e
  vettorializzato (`src/assets/barbiere/brand/`). Scala dei livelli: **Medium e High devono aggiungere animazioni,
  hover ed effetti (anche JS)** per far notare la differenza di budget.
- **Benessere / Centro estetico** (Atelier Lumen, `src/pages/benessere/estetica/`, concept `src/concepts/lumen/`):
  livello **Medium** della macro, pubblicata (2026-10-04). `build` ok, axe 0 violazioni (desktop, dopo il
  flusso di prenotazione, mobile con menù aperto), Lighthouse 99 mobile / 100 desktop. Idea-guida: una giornata di luce
  (alba, mattino, mezzogiorno, tramonto, sera; `data-ora` per sezione), cipria/pesca/avorio/oro rosato/prugna; Cormorant +
  DM Sans. Salto rispetto al barbiere: configuratore del rituale (`SuMisura.astro`, dati in `servizi.ts`, il risultato
  precompila la prenotazione via evento `lumen:servizio`), meridiana nella navbar (ora dallo scroll) e alone di luce
  col mouse (`Meridiana.astro`), schede con tilt 3D e filtro, tre cabine a fisarmonica, prenotazione a fasce di luce con
  "biglietto di luce" (`fasce.ts`, giorni calcolati da oggi), menù mobile a tenda. Nessun volto: foto Unsplash libere di
  cielo, oli, candele, prodotti. Logo: SVG forniti dall'utente (`src/assets/lumen/brand/`), favicon dal simbolo nel cerchio.
  Provato su iPhone 12 mini/Safari dall'utente (ok); sito madre e banner del README aggiornati. Da fare: Firefox, rilettura dei testi.
- **Benessere / Clinica di longevità** (Aeterna, `src/pages/benessere/longevity/`, concept `src/concepts/aeterna/`):
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
- **Tech / Riparazioni** (FIXLAB, `src/pages/tech/riparazioni/`, concept `src/concepts/fixlab/`): livello **Low key** della nuova macro Tech
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
- **Tech / Computer e gaming** (Hot Swap, `src/pages/tech/pc-gaming/`, concept `src/concepts/hotswap/`): livello **Medium** della macro Tech,
  pubblicata il 2026-10-07. `build` ok, axe 0 violazioni (desktop, 390 px, cassetto lista con scelta del ritiro), Lighthouse 99 mobile / 100 desktop (CLS 0).
  **Unico concept in INGLESE** (lang="en", prezzi in €); fascia di ritorno, hub e `info` restano italiani. Idea-guida: tastiera meccanica "colorway"
  (beige, grafite, arancio #ff6b2c, acqua #2fb5a8; Rubik + Albert Sans; bottoni `.tasto` con spessore che si abbassa; scrollbar a tasto; nessuna foto,
  illustrazioni SVG in `figure.ts`). Pezzi forti: `Builder.astro` + `regole.ts` (drag con mouse/penna/maniglia su touch, regole vere di socket/RAM/lunghezza
  scheda/alimentatore, budget, FPS di giochi di fantasia, scontrino con codice), `Shop.astro` (FLIP, ricerca, ordinamento, anteprima, confronto fino a 3),
  `Lista.astro` (cassetto + scelta di giorno/ora di ritiro dalle fasce reali, biglietto), `Visita.astro` (orari, "aperto ora" su ora di Roma, biglietto del
  ritiro, piantina), `Servizi.astro` (badge dalla lista, icone animate all'hover o in vista su touch), `Offerte.astro` (3 sconti scelti dal giorno, conto alla
  rovescia a mezzanotte), `Recensioni.astro`. Dati in `catalogo.ts`; orari e fasce in `ritiro.ts` (unica fonte per tabella e prenotazione, solo browser a runtime).
  Eventi interni: `hotswap:aggiungi`, `hotswap:lista` (porta `ids`), `hotswap:ritiro`, `hotswap:filtro`. Nome "Hot Swap" = termine tecnico generico (marchio debole):
  controllo marchi su TMview/UIBM ancora da fare davvero. Marchi, prodotti e giochi sono di fantasia. Il menù mobile ha l'icona sola sotto i 520 px. Da fare:
  barra fissa mobile (non fatta), Firefox/Safari reali, rilettura testi. Non fatto: hero con mini-builder a preset (valutato, rimandato). Non ancora sul sito madre.
- **Tech / Studio tecnologico** (Ordito, `src/pages/tech/studio/`, concept `src/concepts/ordito/`): livello **High** della macro Tech, pubblicata il 2026-10-07.
  `build` ok, axe 0 violazioni (desktop, 390 px, dopo i flussi), Lighthouse 99 mobile / 100 desktop (CLS 0). Idea-guida: **la casa che ti conosce**, una casa a due piani
  in 3D (Three.js, solo forme semplici, nessun modello) su un palco `position: sticky` con i passi del racconto accanto: la camera passa da una stanza all'altra scorrendo
  (`pose` in `casa3d.ts`, posa frazionaria dalla posizione dei passi) e ogni pannello cambia lo stato condiviso (`stato.ts`: ora, luci, tapparelle, clima, allarme, serratura, tv, ev,
  presenza + grandezze derivate kW). Identità "AURORA" (riprogettata il 2026-10-07 perché la prima versione chiara calce/ambra somigliava troppo a Hot Swap): inchiostro #0b0620, viola #6a2cff, magenta #ff2e93, ciano #2be4ff, lime #d6ff3d; Share Tech (solo h1 e orologio, un solo peso: `font-synthesis: none`), Syne 700 (titoli, MAI con `-webkit-text-stroke`: i contorni sovrapposti del variabile si vedono), Schibsted Grotesk (testo). Scena a TUTTO SCHERMO sticky con schede di vetro sopra (`position: sticky` + `margin-top: -100svh`), cielo = gradiente CSS scritto dalla scena (`--cielo-su/giu`, `--bagliore` RGB per bottoni e schede), canvas con alpha (il poster va fatto sfumare quando la scena è pronta, altrimenti trasparisce), sole/luna/stelle, bordi al neon, vista spostata a destra (`setViewOffset`). Sezioni sotto a blocchi di colore (Striscia magenta, Su misura lime, Casi viola, Metodo ciano, Sopralluogo e footer inchiostro). Navbar a pillola fluttuante. Due poster (`poster-desk.jpg`, `poster-mob.jpg`).
  Pezzi: `Casa.astro` (palco, HUD, punti caldi proiettati dal 3D, passi 0-5), `Regole.astro` (ultimo passo, via slot: regole dentro una frase con `<select>`, giornata simulata con diario),
  `SuMisura.astro` (capitolato a prezzo "da", dati in `dati.ts`), `Casi.astro` (dialog a schermo intero con View Transitions API), `Metodo.astro`, `Sopralluogo.astro` (modulo con errori e ricevuta,
  precompilato dal capitolato), menù mobile a tenda di colore con le voci giganti (testata con logo e X di chiusura dentro il menu, che copre la navbar; altezza `100lvh` così lo sfondo copre tutto lo schermo anche quando la barra del browser si ritrae). Eventi: `ordito:stato`, `ordito:scenario`, `ordito:capitolato`. Three.js è import dinamico (desktop dopo idle, telefono alla prima
  interazione); il palco mostra `src/assets/ordito/poster.jpg` (fotogramma reale della scena, da rigenerare se cambia la scena) e ci resta senza WebGL. Il passo attivo si evidenzia con un filo ambra e NON
  con `opacity` (axe: contrasto). Attenzione: i punti caldi sono `aria-hidden` e `tabindex=-1` (duplicano i comandi accessibili dei pannelli); gli stili di `Casa.astro` e `Regole.astro` sono `is:global` (lo slot li usa; gli elementi creati via JS non ricevono lo scope). Logo: generato con AI dall'utente (`ordito2.png`: tile viola→magenta con tre fili bianchi e due barre lime) e vettorializzato da me: simbolo RICOSTRUITO a mano in SVG sulle misure del PNG (`src/assets/ordito/brand/simbolo.svg`, variante `simbolo-lime.svg`, favicon in `public/images/ordito/`), marchio verbale "ordito" tracciato con potrace dal PNG (`marchio.svg`, bianco; l'asta della "d" aveva un taglio obliquo, raddrizzato), logo orizzontale in `docs/img/logo-ordito-orizzontale.svg`. In navbar e footer il marchio è un'immagine: la regola che dimensiona il simbolo va limitata a `img:first-child`. Nome "Ordito" (in tessitura i fili
  tesi su cui passa la trama): nessun risultato in rete, controllo marchi su TMview/UIBM ancora da fare. In italiano. Non ancora sul sito madre. Da fare: **vedere Ordito su un telefono vero (l'utente non l'ha ancora fatto: pubblicato il 2026-10-07 provato solo con Playwright a 390 px)**, Firefox/Safari reali, controllo marchi, rilettura testi.
- **Piano Tech:** Low = FIXLAB (riparazioni), Medium = Hot Swap (computer store e gaming, configuratore PC custom: FATTO, ex nome NEXUS), High = Ordito (ex NÓVA; studio tecnologico: smart home, AI,
  automazione, sicurezza). Progressione dal PDF: Low informare, Medium esplorare, High interagire. Attenzione: NEXUS non deve cadere nell'estetica gaming
  nero/neon standard e NÓVA non deve somigliare ad Aeterna (blu abisso, dati, shader): serve una direzione davvero diversa.
- **Casa e artigiani / Idraulico** (Sifone, `src/pages/casa/idraulico/`, concept `src/concepts/sifone/`): livello **Low key** della nuova macro Abitare (ex Casa e artigiani)
  (ora hub "tramonto"). Pubblicata il 2026-10-07, **grafica rifatta lo stesso giorno** dopo il giudizio dell'utente ("sembra la classica proposta AI", somigliava a Luppolo & Watt). `build` ok, axe 0 violazioni (desktop/390, dopo la valvola, menu aperto), Lighthouse 98 mobile / 100 desktop.
  Identità attuale: **bottega che lavora con tubi veri**. Blu petrolio #0f3a3f, rame #e58857 (testi su chiaro #98411a), calce #efe9dc, notte #08212a, acqua #34b3a8, rosso minio #d8412a solo per il volantino; Gloock (titoli, un solo peso) + Karla (testo, etichette in maiuscolo spaziato). Foto Unsplash libere in `src/assets/sifone/foto/` (tubi di rame in una parete aperta, ad arco nell'hero; vecchio rubinetto e parete di attrezzi nella `Bottega.astro`; senza volti né marchi), grana di carta (`body::after`), `.insegna` = targa dipinta con bordo mangiato dal filtro SVG `#sifone-ruvido` (definito in index.astro) e ombra di rame fuori registro, bottoni a placca con angolo tagliato, niente bordi neri o ombre piene. Struttura e pezzi interattivi invariati: `Impianto.astro` (tubo di rame a sinistra che si riempie d'acqua con lo scroll), `Ingresso.astro` (volantino rosso da trascinare o toccare, valvola in ottone), `Problemi.astro` (evento `sifone:problema` che precompila il modulo), `Zone.astro` (schema a tubi + manometro, `sifone:zona`), `Tariffe.astro` (contatore a cifre, box largo 0,84em per le cifre di Gloock), `Bottega.astro` (racconto di fantasia, dal 1974), `Fiducia.astro` (lista con grandi numeri e citazioni sfalsate, non schede), `Richiesta.astro` (errori e ricevuta), `Barra.astro` (chiama/richiedi su telefono), menù mobile a serranda di lamelle petrolio con voci in Gloock (testata con logo e X dentro il menu, altezza `100lvh`). Dati in `dati.ts`. Logo: PNG generato con AI dall'utente, vettorializzato da me (ricolorato rame/notte; il marchio verbale condensato bold stona un po' con Gloock: da valutare) in `src/assets/sifone/brand/`. Nome "Sifone" generico (marchio debole): controllo TMview/UIBM da fare. Dati, prezzi, zone e telefono di fantasia.
  Non ancora sul sito madre. Da fare: provarlo su telefono vero (con la nuova grafica), Firefox/Safari, rilettura testi. Abitare è chiusa: Sifone, Obra Fina, Scala Vera.
- **Abitare / Impresa di ristrutturazioni** (Obra Fina, `src/pages/casa/ristrutturazioni/`, concept `src/concepts/obrafina/`): livello **Evoluto** (Medium) della macro **Abitare** (ex "Casa e artigiani", rinominata il 2026-10-07; lo slug resta `casa`). Pubblicata il 2026-10-07. `build` ok, axe 0 violazioni (desktop dopo tutti i flussi, 390 px, menù aperto), Lighthouse 94 mobile (LCP 2,8 s: testo, il più basso della via) / 100 desktop, CLS 0 (togliere i preload dei font lo peggiora: CLS 0,16). **Unico concept in SPAGNOLO** (lang="es", Spagna, Valencia, prezzi in €, IVA 10% da riforma di vivienda); fascia di ritorno, hub e `info` restano italiani. Ricerca frontend fatta prima di cominciare (CSS 2026: scroll-driven animations, `@property`, `color-mix()`, oklch, `field-sizing`, View Transitions, `@starting-style`; GSAP gratis, WebGPU Baseline): **verificare sempre il supporto reale**. Idea-guida: **una casa in sezione disegnata in CSS** con sette stanze (terraza, dormitorio 2, baño, dormitorio, entrada, cocina, salón) da toccare: livello di opera (Sin obra/Refresco/Reforma/A fondo), metri su un righello, extra per stanza, colore delle pareti (passata di llana con `clip-path`) e tre capi (estructura/instalaciones/acabados) con View Transitions. Identità: **calce con azulete** #d9e3f1 (cambiata dopo il giudizio dell'utente: il beige/crema tornava già in Barbiere, Lumen, Sifone, RistoPub, Hot Swap), arcilla #b9482a, sepia #241a14, blu gesso #2b49c8 (il cordel del muratore), ocra #d9a441, oliva #59582b; gradienti in OKLCH che si spostano con lo scroll (`--luz-x/--luz-y` registrate con `@property`), non un tema chiaro/scuro (sezioni scure sepia/blu). Young Serif (titoli, richiama il lettering del logo) + Onest + Anybody (larghezza variabile, i `.rotulo` si allargano in vista) + Covered By Your Grace (appunti a matita). Logo: PNG generato con AI dall'utente (`src/assets/obrafina/brand/`): sfondo bianco tolto con alpha da luminanza (script una tantum, tre versioni: completo con riga di gesso, pulito, simbolo); NON vettoriale, in navbar il simbolo è un'immagine e il nome è testo. Foto Unsplash libere di archivio (`src/assets/obrafina/foto/`), dichiarate "di archivio, ilustrativas". Pezzi: `Entrada.astro` (arco di intonaco con foto, plomada che oscilla, cordello di gesso che si tende e "chasquea" con polvere), `Casa.astro` + `presupuesto.ts` (calcoli e plantilla della "hoja de obra", pura, usata da frontmatter e browser; dati in `datos.ts`), `Calendario.astro` (Gantt sui calcoli, date da oggi), `Muestrario.astro` (otto baldosas idrauliche in SVG fatte a mano, stanza in prospettiva, evento `obrafina:suelo`), `Obras.astro` (prima/dopo con plomada che oscilla), `Garantias.astro` (hoja de encargo con sello + pizarra di recensioni), `Visita.astro` (modulo con errori e "hoja de visita", giorni da oggi), menù mobile a **tre mani di llana** (`.menu` fuori dall'header, `100lvh`). Eventi: `obrafina:estado`, `obrafina:suelo`, `obrafina:visita`. Livello di bolla (`.nivel`) come barra di avanzamento con `animation-timeline: scroll()`. Attenzione: `.js [data-rev]` imposta `transform` (per ruotare usare la proprietà `rotate`); il rumore SVG su `background` va con `stitchTiles='stitch'`; i `hidden` su elementi con `display` esplicito (`.vf[hidden]`) vanno ripetuti in CSS. Dati, prezzi, plazos, reseñas e telefono sono di fantasia. Nome "Obra Fina" (termine di cantiere, marchio debole): controllo OEPM/TMview da fare. Da fare: rilettura dei testi in spagnolo (idealmente da un madrelingua), controllo marchi. Provato dall'utente su Firefox e telefono (ok).
- **Abitare / Studio di interni** (Scala Vera, `src/pages/casa/interior/`, concept `src/concepts/scalavera/`): livello **Esperienza** (High) della macro Abitare, in italiano. Pubblicata il 2026-10-09 (costruita su un ramo di lavoro, poi unita a `main` con un solo commit squash e ramo cancellato). `build` ok, axe 0 violazioni (1440/390, menù aperto, flusso campioni → brief → errori → ricevuta), Lighthouse 86-88 mobile (LCP 3,6 s: testo, ritardo tutto di render; provati senza esito togliere il corsivo e la grana fissa, sospetto il carico dei caratteri Playfair 110 + 126 KB) / 100 desktop, CLS ≤ 0,024. I motori WebGL partono solo con la sezione in vista (la discesa con rootMargin `0px 0px -15% 0px`; su telefono serve anche un gesto): partire su `requestIdleCallback` costava 260 ms di TBT al caricamento. Idea-guida: **lo scroll è uno zoom di scala** da 1:100 a 1:1 dentro un solo progetto, inquadrando sempre lo stesso oggetto (il tavolo tondo in travertino). Identità: carta da lucido verde-grigia `oklch(0.925 0.014 150)` che scurisce fino al basalto, un solo accento giallo metro `#f2c500` (MAI come testo su chiaro: sulla carta la quota ha un filo giallo sotto), Playfair (la versione 2 variabile con asse opsz 5-1200, NON Playfair Display: la quota cambia optical size con la scala) + Manrope. **Nessuna libreria**: due motori WebGL2 scritti apposta. `motore/gl.ts` + `shader.ts` + `scena.ts` (pura): tela sticky, il render passato in un filtro acquerello (Kuwahara a kernel ruotato dal rumore, pigmento come assorbimento siena/indaco, bordi carichi, granulazione) che si asciuga a chiazze con la riga di marea; tagli fra inquadrature allineati sul tavolo (`combacia`), la tavola successiva si posa sopra con bordo sfrangiato e ombra; posizione dallo scroll nativo inseguita da una molla critica. `motore/materia.ts`: materioteca con luce radente (normale in RG + ruvidità in B di texture ambientCG CC0 in `src/assets/scalavera/materia/`, bronzo spazzolato anisotropo e lacca procedurali). Foto: render 3D di SUHER DAA su Unsplash (licenza libera), dichiarati "render di progetto"; stanza A (6 inquadrature, `a1`-`a6`) e stanza B in tre colori (Progetti, proposte che si stendono con `clip-path`). Sezioni: `Apertura.astro` (pianta 1:100 in SVG che si traccia con `pathLength`, entra nel soggiorno con `animation-timeline: view()`), `Discesa.astro` (il metodo in 6 fasi, sfondo a gradini con `@property --buio`, mai grigio medio sotto il testo), `Materioteca.astro`, `Progetti.astro`, `Studio.astro`, `Brief.astro` (scala del progetto, tavola materiali, modulo con errori e ricevuta a cartiglio), menù mobile a **mazzetta di campioni a ventaglio** (`.mazzetta` fuori dall'header, `100lvh`), righello di scala a destra (tacca attiva gialla) e barra di avanzamento su telefono. Eventi: `scalavera:campione`, `scalavera:campione-tolto`, `scalavera:tono`. Debug: `?debug` espone `window.__tavola.vai(s)`. Logo: simbolo SVG a 14 tacche ricostruito (in `dati.ts`, `TACCHE`), nome come testo; favicon a 6 tacche. Dati, studio, progetti, prezzi e contatti di fantasia. `Riarreda.astro` + `motore/riarreda.ts`: "riarreda la foto" su `a2` con maschere RGB (`a2-maschere.png`, generate da `tools/scalavera-maschere.py`, solo Pillow: `python tools/scalavera-maschere.py <a2-parete.jpg> <a2-maschere.png>`: R parete per somiglianza di tinta, G mensola e B tavolini a poligoni), atlante 2×2 dei materiali (`materia/atlante.jpg`, ripetuto a specchio), ombreggiatura = luminanza della foto / luminanza media della superficie, stesura a macchia dal punto di posa, trascinamento dei campioni e "tieni premuto: com'era". Materioteca a 7 campioni: il velluto è *Velour Velvet* di Poly Haven (CC0) ritinto ruggine, con un termine di sheen nello shader (`uTipo == 3`). Progetti a tre tavole: la terza (Casa Salvia, `c1`/`c2`) è una serie di render di un'altra autrice su Unsplash, dove ho tolto il marchio del forno (FULGOR) e la scritta BAUHAUS del poster. Nome: nessuno studio o marchio di arredo "Scala Vera" in rete (esistono lo studio SCALA di Parigi, la collezione Scala di Marco Piva, il detersivo Scala); controllo formale TMview/UIBM ancora da fare a mano. Da fare: telefono vero, Firefox/Safari, rilettura testi, sito madre.
- **Prossime:** la macrocategoria Benessere è chiusa (barbiere, Lumen, Aeterna). Tech ha FIXLAB, Hot Swap e Ordito: la macro Tech è chiusa. Restano Legale/professionale e Negozio locale (3 concept ciascuna).

## Deploy

`output: 'static'`, pubblicato su GitHub Pages con dominio personalizzato:
**https://vetrine.theloopstudio.org** (record `CNAME` `vetrine` → `loop-studio-web.github.io`
su Cloudflare, DNS only, nuvola grigia; HTTPS forzato dalle impostazioni di Pages). Essendo un
dominio dedicato il sito sta alla radice: `astro.config.mjs` ha `site` sul sottodominio e
`base: '/'`. I vecchi indirizzi `loop-studio-web.github.io/vetrine/` rimandano in automatico al
nuovo. Deploy automatico via GitHub Actions (`.github/workflows/deploy.yml`) a ogni push su
`main`, nessuno step manuale. In locale il sito sta su `http://localhost:4321/`.

## Due PC: controllare SEMPRE l'allineamento con git

Si lavora da due computer diversi su questa repo (e sul sito madre
`Loop_Studio`). Prima di iniziare qualunque lavoro, e di nuovo prima di
committare, verificare che questo PC sia allineato al remoto e al deploy:

1. `git fetch --all --prune`, poi `git status` e `git rev-list --left-right --count HEAD...@{u}`
   (a sinistra i commit solo locali, a destra quelli solo remoti).
2. Se ci sono commit remoti non scaricati: leggerli (`git log HEAD..@{u}`) e fare
   `git pull --ff-only` PRIMA di toccare qualsiasi file. Se non è un fast-forward
   o ci sono modifiche locali non committate che confliggono: fermarsi e
   chiedere, mai forzare né risolvere in silenzio.
3. Prima di un push, ripetere il controllo: l'altro PC può aver pubblicato nel
   frattempo. Mai `push --force`.
4. Il deploy parte da ogni push su `main` (GitHub Actions): ciò che è online è
   ciò che sta su `origin/main`, non ciò che c'è sul PC. Dire sempre
   all'utente se una modifica è solo locale o già pubblicata.

## Repository: sempre sull'organizzazione GitHub dello studio

Il remoto di questa repo è `https://github.com/Loop-Studio-Web/vetrine.git`
(organizzazione **Loop-Studio-Web**). Regola dell'utente: tutte le repo
dello studio, vecchie e nuove, si pubblicano sull'organizzazione, **mai sul
profilo personale**, a meno di un suo comando esplicito. Per una repo nuova:
crearla direttamente sotto l'organizzazione (`gh repo create Loop-Studio-Web/<nome>`).
Se un `git remote -v` mostra un indirizzo personale, segnalarlo e aggiornarlo
con `git remote set-url origin …` (chiedendo prima).

## Timeline

Nessuna fretta: si costruisce un concept alla volta, con la cura che serve
a ciascuno, anche su un orizzonte di mesi. Niente scadenza da rispettare.
Lavoro di ampliamento portfolio in attesa che i preventivi in corso vengano
accettati dai nuovi clienti.

## Macrocategorie pianificate

Senza ordine fisso tra macrocategorie:

- **Ristorazione** — 3 varianti: Grande ristorante di classe, Trattoria,
  RistoPub (Home restaurant scartata: troppo vicina alla Trattoria). Obiettivo:
  3 concept totalmente diversi per ogni macrocategoria. Si è partiti da Trattoria (bacino
  di clienti potenziali più ampio).
- Legale/professionale
- Beauty & wellness
- Negozio/e-commerce locale

Altre macrocategorie si aggiungeranno nel tempo.

**Punto di partenza per i concept di Ristorazione:** esiste una base tecnica
Astro già pronta in repo private, nata per un altro progetto. Riusabile solo
come base tecnica/architetturale (la versione Astro, non quella WordPress —
non gira su GitHub Pages), mai con nome, foto o dati reali di terzi: contenuti
e brand completamente nuovi prima di pubblicare qualunque cosa qui.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

**Porte (regola dell'utente, 2026-10-07):** per i test (screenshot, axe, Lighthouse) si usa l'anteprima su `http://localhost:4401/` (`astro preview --port 4401` sulla cartella `dist`, da rifare con `astro build` dopo ogni modifica). La porta **4321 è il server di sviluppo dell'utente: non toccarla mai** (niente `astro dev stop`, niente `taskkill` su node). Se la 4401 è già occupata da un'anteprima, riusarla così com'è.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
