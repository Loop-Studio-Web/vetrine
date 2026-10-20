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

La `src/pages/index.astro` in radice è l'**hub pubblico delle vetrine** (marchio dello studio, tema scuro/chiaro come theloopstudio.org), separato dai concept: vive in `src/hub/`, contenuti in `src/hub/data.ts`. A ogni nuova pubblicazione: voce in `data.ts` (immagini in `src/assets/hub/`), pagina `info.astro` (5 righe con `src/hub/Dettaglio.astro`, testi in `data.ts`), voce in `public/sitemap.xml`. I concept restano `noindex`; i link dall'hub ai concept si aprono in nuova scheda, quelli alle `info` nella stessa. Ogni pagina ha il proprio menù mobile. Header, footer, cursore, scrollbar e toggle tema dell'hub sono COPIE del sito madre (`Loop-Studio-Web/Loop_Studio`; cartella locale variabile, se non si trova chiedere): vanno riallineate a mano e valgono SOLO per l'hub. **Dettagli di Concepts.astro, della scena "via" (Hero.astro, ore per categoria, `atmoDi`, neon, mini-nav) e dei menù mobile: `docs/hub.md`, da leggere prima di toccare l'hub.**

- **Livelli (2026-10-07):** ogni concept ha `livello` 1/2/3 e `lingua` in `data.ts`: Essenziale · Evoluto · Esperienza, **relativi alla macrocategoria** (giudicati dal frontend percepito, non dallo stack: Ristorazione = Trattoria 1, Luppolo & Watt 2, Ossidiana 3). Cartellino a tre lampadine (`src/hub/Livello.astro`) su card della via, card delle vetrine e pagina `info`; legenda nella scena di benvenuto e sezione `Livelli.astro` ("Come scegliere", con la frase "Parti da una vetrina, non da zero"). Regole commerciali: ogni concept si vende UNA volta e poi esce dall'hub (va sostituito con uno nuovo); lo sconto NON è pubblico (varia per cliente, si dà nel preventivo); niente fasce di prezzo per livello sull'hub. Lingua come codice testuale (IT/EN/ES), mai bandiere; il prossimo progetto sarà in spagnolo (decidere il mercato). Non usare più "Low key/Medium/High" nei testi pubblici.

## Skill di design (installate il 2026-10-13)

Dettagli e installazione sicura in `studio-kit/docs/skill-design.md`. Divisione dei compiti, per non farle litigare:

- **Movimento** (curve, durate, interruzioni, reduced-motion): Emil Kowalski (`animate`, `review-animations`, livello utente).
- **Struttura, gerarchia, qualità tecnica, contrasto**: Impeccable (`detect`, `critique`, `audit`, `polish`), in `.claude/skills/impeccable/`.
- **Direzione estetica prima del codice**: `frontend-design`. Il brief vince: se il concept vuole molto movimento, scriverlo nel brief.
- **Ordine d'uso consigliato** (dedotto dai testi delle skill e provato su Mala Hierba): frontend-design PRIMA del codice, Emil `animate` mentre si scrive il movimento, poi axe/Lighthouse e Impeccable `detect` (sulla pagina COMPILATA, non sui `.astro`) + `critique`; correzioni in un giro solo; `review-animations` lo lancia l'utente.
- Impeccable: installato `--no-hooks`, telemetria spenta in `.claude/settings.json`, motore nativo fuori da git. Non lanciare `live`
  (apre un helper su localhost) e `overdrive` solo con una direzione scelta dall'utente. Non installarlo a livello utente.
- Il rilevatore non vede il contrasto del testo sopra un canvas: misurarlo con `studio-kit/scripts/canvas-shot.mjs` + `canvas-contrast.py`.

## Convenzioni di un concept

- **Niente aspetto "da AI"** (regola dell'utente, 2026-10-07): ogni concept, anche Low key, deve avere carattere visivo vero. Prima di disegnare cercare riferimenti reali, preferire fotografia/texture vere e tipografia con personalità, imperfezioni volute e dettagli artigianali; evitare griglie di schede uguali, palette "da brief", bordi netti + ombre piene, icone SVG troppo pulite, copy da template. Confrontare sempre con i concept esistenti: palette e font non devono ripetersi.
- **Niente beige, crema o avorio come base** (regola dell'utente, 2026-10-07): il portfolio ne è già pieno (Barbiere, Lumen, Sifone, RistoPub, Hot Swap) e Obra Fina è passata a calce azzurrina (_azulete_) proprio per questo. Per ogni nuovo concept scegliere una base che non somigli a quelle già usate (azzurri, verdi, grigi freddi, toni scuri, colori pieni). I **gradienti sono graditi**: usarli con intenzione (OKLCH, `@property`, luce che si sposta con lo scroll), non come decorazione.
- **Palette diverse dentro la stessa macro** (regola dell'utente, 2026-10-09): le tre vetrine di una macrocategoria stanno una accanto all'altra nella via dell'hub, quindi devono differire nettamente per luminosità e tinta di base (es. una scura, una chiara, una a colore pieno). Abitare è venuta troppo simile (Sifone, Obra Fina, Scala Vera: basi chiare e fredde): accettata, da non ripetere. Prima di fissare una palette confrontarla con il campo `palette` delle altre vetrine della macro in `src/hub/data.ts`.
- **Struttura, materia e gesto non si ripetono** (regola dell'utente, 2026-10-15): la Limonaia è stata rifatta perché troppo simile a Obra Fina, e il problema era la struttura ("strumento da toccare + ricevuta", sette concept su tredici) più che la palette. Prima di disegnare un nuovo concept leggere `docs/ispirazioni.md`: matrice dei 13 concept, direzioni non ancora usate (solo tipografia, illustrazione a mano, brutalismo, colonne a scroll indipendente, un solo grande gesto) e siti di riferimento; **prima di ogni nuovo concept aprire anche https://www.testmuai.com/blog/web-design-trends/** (richiesta dell'autore 2026-10-19, vedi sezione 4b). Due concept non condividono tutte e tre le scelte, e nella stessa macro non ne condividono due. Il tema "luce / ora del giorno" è esaurito (Lumen, Aeterna, Ordito, Limonaia). A fine lavoro aggiornare la tabella.
- **Strumenti di collaudo** in `tools/` (package.json proprio, non fanno parte del sito né del deploy): `cd tools && npm install` una volta per PC, poi `node shot.mjs <url> [w] [h] [prefisso]` (screenshot a pezzi, overflow orizzontale, errori in console), `node axe.mjs <url> [selettore da cliccare]` (axe a 1440 e 390 px, anche col menù aperto), `node lh.mjs <url>` (Lighthouse mobile e desktop su `astro preview`; in locale è più severo di PSI), `node psi.mjs <url> [mobile|desktop]` (PageSpeed Insights di Google su una pagina già ONLINE: sono i numeri veri da riportare; chiave nella variabile d'ambiente `PSI_KEY`, mai in file della repo; senza chiave la quota anonima è spesso esaurita, errore 429). Usano il Chrome di sistema (`CHROME_PATH` per forzarlo).
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
  nessun nome o foto di clienti reali, nessun logo di terzi (es. Google). Eccezione decisa dall'utente il 2026-10-18: negli e-commerce i marchi dei metodi di pagamento (PayPal, Klarna, Scalapay, Satispay, Apple Pay, Google Pay, carte, MyBank) si mostrano, con bottoni finti e la dichiarazione che nessun pagamento è reale.
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

Schede complete (build, axe, Lighthouse/PSI, idea-guida, token, pezzi, trabocchetti, "da fare") in `docs/concept/<slug>.md`: **leggere quella del concept su cui si lavora** (note di macro in `docs/concept/_macro.md`, piano delle prossime macro in `docs/prossime-macro.md`). A fine lavoro aggiornare la scheda, non questo file.

Pubblicati (macro · livello 1/2/3 · slug scheda): Ristorazione: Trattoria (1, `trattoria`), Luppolo & Watt (2, `ristopub`), Ossidiana (3, `ossidiana`). Benessere: Bottega Tre Rasoi (1, `barbiere`), Atelier Lumen (2, `lumen`), Aeterna (3, `aeterna`). Tech: FIXLAB (1, `fixlab`), Hot Swap (2, `hotswap`), Ordito (3, `ordito`). Abitare: Sifone (1, `sifone`), Obra Fina (2, `obrafina`), Scala Vera (3, `scalavera`). Eventi: Mala Hierba Flores (1, `malahierba`), Limonaia Aurelia (2, `limonaia`), Marrow & Knot (3, `marrowknot`). E-commerce: Chioma Saracena (1, `chioma`). Macro chiuse: Ristorazione, Benessere, Tech, Abitare, Eventi.

Prossime: E-commerce Drop (2) ed Editoriale (3), poi Ospitalità, Animali, Legale (Motori e Sport in coda); settore medico escluso.

## E-commerce: i livelli contano anche per il backend (deciso il 2026-10-20)

I tre livelli di E-commerce si distinguono dal frontend **e dal motore dietro il negozio**. Sull'hub si resta **neutri**:
nessun nome di piattaforma, nessuna cifra; la piattaforma si sceglie in sede di preventivo. In `data.ts` il campo opzionale
`backend` (solo E-commerce) racconta il costo ricorrente, `Dettaglio.astro` lo mostra come "Dietro il negozio" e
`Livelli.astro` ha una nota sul motore. Da compilare anche per Drop ed Editoriale.

**Regola sui nomi (2026-10-20)**: le piattaforme si nominano solo nei documenti interni (CLAUDE.md, memoria, preventivi), MAI nei siti pubblici (hub, vetrine, sito madre): cambiano nel tempo, si dice "template custom", "servizio di pagamento". Unica eccezione sul sito madre: i progetti del portfolio già online che usano davvero WordPress (non toccarli).

- **Criterio**: il risparmio annuo del cliente nel lungo periodo (come per WordPress: mai plugin a pagamento). Il pacchetto
  assistenza è sempre facoltativo; il cliente gestisce il catalogo dal pannello (Woo, Medusa admin, Stripe), l'assistenza
  copre la parte tecnica (aggiornamenti, sicurezza, backup, errori, integrazioni).
- **Essenziale (monoprodotto)**: Stripe Checkout / Payment Links, nessun canone (Italia: 1,5% + 0,25 € sulle carte UE standard,
  verificato il 2026-10-20 su stripe.com/en-it/pricing).
- **Evoluto**: neutro, per cliente: WooCommerce headless senza plugin a pagamento oppure Medusa su un VPS piccolo.
- **Esperienza**: Medusa su misura (open source; serve un server Node + Postgres + Redis da mantenere).
- **Shopify**: tendenzialmente escluso (nessun piano gratuito; circa 24-33 €/mese in UE più 2% sul gateway esterno nel piano
  base, cifre da riverificare). Conviene più un pacchetto assistenza nostro, ma se l'assistenza + hosting costasse più del canone
  Shopify il vantaggio per il cliente sparisce: tenerne conto nel preventivo.

## Misure di performance: ogni mese

Una volta al mese si rimisurano TUTTE le homepage con `node tools/psi.mjs <url> mobile|desktop` (PSI online; chiave in `Assets/Loop/PSI.txt` -> variabile `PSI_KEY`, mai in repo) e si riallineano i `metriche` di `src/hub/data.ts` (e il README). Ultimi giri parziali: 2026-10-17 (Mala Hierba: 97 mobile / 100 desktop), 2026-10-18 (Chioma Saracena: 94 / 100). **Primo giro completo: novembre 2026.**

## Sito madre: ogni nuova homepage va comunicata (form contatti)

Ogni volta che si aggiunge un concept all'hub (o se ne cambia slug/nome), **avvisare l'utente che il sito madre
(`Loop-Studio-Web/Loop_Studio`) va aggiornato**: `src/data/vetrine.ts` ha l'elenco `vetrinePerContatti`
(slug -> nome) che il form di `/contatti/?concept=<slug>` accetta, e senza la nuova voce "Ne voglio una così"
dal nuovo concept arriva al form senza precompilare progetto e messaggio. Slug e nome devono combaciare con
`src/hub/data.ts` di questa repo. Il riquadro Vetrine del sito madre mostra invece solo una SELEZIONE di 6
anteprime (una per settore: Ossidiana, Ordito, Aeterna, Scala Vera, Luppolo & Watt, Mala Hierba Flores,
aggiornata il 2026-10-14): non si aggiunge, al massimo si sostituisce un'anteprima e solo su decisione dell'utente.

## Manutenzione di questo file (regola dell'utente, 2026-10-20)

Il CLAUDE.md si carica a ogni sessione e costa token. Quando una sessione cambia qualcosa di duraturo, aggiornarlo; quando si può, snellirlo senza perdere nulla di importante: cronache, schede e dettagli lunghi vanno in `docs/` (letti solo quando servono), qui restano le regole sempre valide e i rinvii. Tolgo le note con scadenza appena superate. Stessa cura per l'indice MEMORY.md (una riga per voce, niente duplicati né voci obsolete).

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

Nessuna fretta: un concept alla volta, con la cura che serve. Lavoro di ampliamento portfolio in attesa dei preventivi.

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
