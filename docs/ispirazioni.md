# Ispirazioni e matrice degli stili

Documento di riferimento da leggere **prima di disegnare un nuovo concept**. Nasce il 2026-10-15 dopo che la
Limonaia è stata rifatta perché troppo simile a Obra Fina. Non sostituisce le regole del CLAUDE.md
(niente beige, palette diverse nella stessa macro, niente aspetto "da AI"): le completa con uno
strumento per vedere cosa abbiamo già fatto e dove ci sono ancora buchi.

## 1. Matrice dei concept

Tre scelte per ogni concept: **struttura** (che cosa fa la pagina), **materia** (di che cosa è fatta
visivamente), **gesto** (l'unico effetto che si ricorda). Compilata dalle note del CLAUDE.md;
le celle con "?" vanno verificate sul concept prima di fidarsi.

| Concept | Struttura | Materia | Gesto / idea-guida |
|---|---|---|---|
| Trattoria del Borgo | racconto + prenotazione | foto | ? |
| Luppolo & Watt | prenotazione + eventi | foto + kraft | menù a spina che si riempie di birra, boccale sul cursore |
| Ossidiana | racconto a 5 portate | foto, solo tema scuro | scroll-snap con zoom lento |
| Bottega Tre Rasoi | prenotazione a turno | foto + crema/ottone | cursore a forbici, numerino di turno |
| Atelier Lumen | configuratore trattamenti | foto | una giornata di luce (alba, tramonto, sera) |
| Aeterna | racconto + grafica in tempo reale | WebGL | laboratorio di notte |
| FIXLAB | strumento (tracker riparazione) | pulita, blu elettrico | scheda di lavoro, codici FX |
| Hot Swap | configuratore PC | beige/arancio, tasti | tastiera meccanica: ogni bottone è un tasto |
| Ordito | scena sticky + configuratore | gradienti, WebGL | la casa che ti conosce, colore = luce del giorno |
| Sifone | chiamata rapida | foto vere | essenziale, "fatto per far chiamare" |
| Obra Fina | strumento (preventivo) + ricevuta | CSS disegnato + foto | casa in sezione da toccare |
| Scala Vera | strumento (brief) + ricevuta | WebGL acquerello | lo scroll è uno zoom di scala |
| Mala Hierba Flores | strumento (ramo) + ordine | carta, papel picado | taller de papel picado |
| Limonaia Aurelia | strumento (pianta) + invito | foto + vetro | la pagina cambia luce con l'ora della festa |
| Marrow & Knot | corridoio orizzontale di sale + nodo che si stringe | foto a tutta pagina tessute a fili (WebGL/OGL) + video in maschera a serratura | le foto si tessono entrando in sala e una si tesse sull'altra mentre si avanza; il testo si costruisce con lo scroll |
| Chioma Saracena | pagina lunga a oggetto unico, acquisto in fondo (pagina prodotto + carrello + checkout) | lastre fotografiche + vetro cannettato, litografia su latta fuori registro, latta in render 3D | un oggetto solo che scende con lo scroll e cambia forma: oliva, goccia, latta che si posa accanto al pulsante |

### Cosa si ripete (lettura al 2026-10-15)

- **"Strumento da toccare + ricevuta/preventivo finale"**: sette concept su tredici. È il motivo vero per cui
  Limonaia somigliava a Obra Fina, più della palette. Il confronto con i concept esistenti va fatto sulla
  struttura prima ancora che sui colori.
- **Luce / ora del giorno come tema**: Lumen (giornata di luce), Aeterna (notte), Ordito (colore = luce),
  Limonaia (ora della festa). Quattro concept. Idea esaurita: non usarla più.
- **Scena sticky a tutto schermo con schede sopra**: Ordito, Scala Vera, Aeterna.
- **WebGL/canvas scritto apposta**: Aeterna, Ordito, Scala Vera. Costoso e già dimostrato.
- **Beige/crema e basi chiare fredde**: vedi regole nel CLAUDE.md.
- **Quasi tutte poggiano su foto di archivio**: poche vetrine sono davvero tipografiche o illustrate.

## 2. Regola per i nuovi concept

Prima di scrivere codice, compilare per il nuovo concept la riga struttura / materia / gesto e
confrontarla con la tabella sopra. **Due concept non possono condividere tutte e tre**, e in una
stessa macro non possono condividerne due. Scrivere la riga nella nota del concept in `CLAUDE.md`
(Stato dei concept), accanto all'idea-guida, e aggiornare questa tabella a fine lavoro.

## 3. Direzioni non ancora usate

Cinque direzioni che nessuna Vetrina occupa. Sono spunti da cui partire, non obblighi.

1. **Solo tipografia, zero foto.** Testo enorme, colore pieno, solo line-art SVG. Quasi gratis in peso,
   Lighthouse alto per costruzione. Candidata naturale: Legale (studi legali).
2. **Illustrazione a mano come identità.** Ritratti a penna, tratto disegnato, mano che spinge il
   pulsante del form. Mala Hierba ha la carta ma non un tratto disegnato. Adatta a bottega,
   libreria, artigiano.
3. **Brutalismo / Gen Z.** Caos voluto, immagini che seguono il cursore, colori urlati, tipografia
   enorme. Hot Swap si avvicina ma resta ordinato. Adatta a negozio locale, street.
4. **Colonne a scroll indipendente.** Una colonna ferma, l'altra scorre, poi si sblocca. È un layout,
   non una scena: diversa dalla scena sticky che già usiamo. Fattibile con `position: sticky`.
5. **Un solo grande gesto in una pagina semplice.** Il fiore che ruota e riempie lo sfondo di
   Superlocal: l'opposto di Ordito/Aeterna. Tutto il resto resta sobrio. **Usata** da Chioma Saracena
   (2026-10-18: oliva → goccia → latta): non riprenderla nella stessa forma.

Dall'articolo Figma sulle tendenze sono utili solo **collage** (ritagli, texture, adesivi) e
**massimalismo**. Scartati: neumorfismo (datato), gamification, voce, chatbot (fuori target per
piccole attività locali). 3D/WebGL: già coperto, vedi sopra.

## 4. Siti di riferimento (collezione Framer)

Fonte: video "Web Designs of 2026 that are Inspiring and Human made" (canale Codex Community,
https://www.youtube.com/watch?v=KhSDaVDF3YA) e articolo
https://www.framer.com/blog/one-page-website-examples/. **Attenzione**: è contenuto sponsorizzato da
Framer e tutti i siti sono costruiti con Framer, quindi vale come raccolta di esempi, non come
giudizio. Le note sotto vengono dall'articolo e dalla trascrizione; **i siti non sono stati visitati
direttamente**: aprirli prima di prenderne spunto.

| Sito | Link | Da guardare | Direzione |
|---|---|---|---|
| Pay Network (Payy) | https://payy.link/ | niente immagini: testo grande, colore, line-art SVG; narrazione problema, poi soluzione | 1 |
| Punkt | https://punkt.co/ | minimale a mano, ritratti a penna, manina che spinge il pulsante del form nel footer; "il contenuto precede il design" | 2 |
| Feastie | https://www.feastie.ca/ | illustrazioni da manifesto di eventi locali, colori vivaci, CTA ripetuto | 2 |
| UGLYCASH | https://ugly.cash/ | brutalismo, immagini che seguono il cursore con scia di adesivi, tipografia enorme | 3 |
| Melnūdens Coffee | https://melnudens.coffee/ | split screen, colonna sinistra ferma e destra che scorre, hero che diventa carosello | 4 |
| Superlocal Design | https://superlocaldesign.com/ | fiore enorme che ruota e riempie lo sfondo, hover sulle foto del team | 5 |
| GTE | https://www.gte.xyz/ | bento grid con line-art, transizioni di colore tra sezioni, sezioni di un solo titolo | struttura |
| Lóvi | https://lovi.care/ | mostrare invece di spiegare (telefono trasparente che scansiona), bento, un solo CTA nel menù | struttura |
| Tiempo Fitness | https://www.tiempo.fitness/ | l'oggetto e il CTA verde "seguono" lo scroll, un solo colore d'azione | struttura |
| Comet (Perplexity) | https://perplexity.ai/comet | sezioni di prompt con cui interagire, motivo futuristico di cerchi | da evitare (prompt ovunque) |
| Tapdaa | https://www.tapdaa.com/ | hero che passa da spiegazione a uso, nav sticky con ancore | struttura |

### Cosa prenderne e cosa no

- **Sì**: un solo CTA ripetuto, contenuto concreto subito, sezioni separate con molto bianco, nav con
  ancore, mobile che si impila senza trucchi.
- **No**: copiare un layout intero (regola base della repo: ogni concept è isolato e originale). Prendere
  il principio, non la pagina.
- Il giudizio dell'autore del video ("meno animazione, più fatto a mano") coincide con la regola
  "niente aspetto da AI": usarlo come conferma, non come nuova regola.

## 4b. Fonte da consultare per prima: tendenze di web design (testmuai)

Richiesta dell'autore (2026-10-19): **al prossimo progetto vetrina, prima di disegnare, aprire e leggere**
https://www.testmuai.com/blog/web-design-trends/ . Contiene molte idee da cui prendere spunto.

- Immagini scaricate (2026-10-21, su richiesta dell'autore) in
  `C:\Users\utente\Pictures\Assets\Ispirational` (fuori dalla repo, solo riferimento, mai in `src/assets`):
  26 screenshot dell'articolo, rinominati col numero e la tendenza (`01-forme-organiche` … `25-velocita-di-caricamento`;
  `00-` è la testata). Le tendenze senza immagine nell'articolo (griglia, navigazioni animate, micro-interazioni,
  video, scroll, cursori dinamici) vanno lette sul testo.
- Stato: pagina **letta il 2026-10-21** per Soft Riot (E-commerce Evoluto). Direzioni utili annotate:
  fotografia di prodotto estrema (ritagli che si allargano = gesto di Soft Riot), forme organiche (finestre
  pillola/arco/cerchio al posto delle card), griglia irregolare, colori a contrasto e gradienti, tipografia
  emotiva, nav asimmetrica e azioni primarie in basso su mobile. Scartate: 3D interattivo, hero solo testo,
  cursori dinamici. Il testo è generico (nessuna indicazione per la moda).
- Vale lo stesso criterio della sezione 4: prendere il principio, non copiare il layout, e
  confrontare con la matrice della sezione 1 (struttura / materia / gesto non si ripetono).

## 5. Da fare quando si apre un nuovo concept

1. Leggere questo file e la tabella della sezione 1, poi aprire la pagina della sezione 4b (testmuai) per le idee.
2. Scegliere una direzione della sezione 3, o motivare perché no.
3. Compilare la riga struttura / materia / gesto e confrontarla con quelle esistenti.
4. Dopo la pubblicazione: aggiungere la riga alla tabella, controllare se altre direzioni sono ora
   occupate, aggiornare `src/hub/data.ts` e il sito madre come da CLAUDE.md.
