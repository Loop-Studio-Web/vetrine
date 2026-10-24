# Loop Studio — Vetrine

## Cos'è

Homepage concept dimostrative, non siti di clienti reali: materiale di portfolio per attrarre clienti, linkato dal Lab del
sito principale (theloopstudio.org/lab/). Organizzate per macrocategoria (es. "Ristorazione"), con più varianti dentro
ciascuna, per intercettare più tipologie di cliente. Repo gemella di [Loop-Studio-Web/lab](https://github.com/Loop-Studio-Web/lab)
(micro-esperimenti), ma qui ogni concept è una pagina intera e il progetto usa Astro con build.

## Regola più importante: nessuna struttura o design condivisi tra i concept

La repo è **solo infrastruttura comune** (un `package.json`, una build, un deploy): NON è un design system. Ogni concept ha
markup, CSS e JS propri, indipendenti dagli altri, nemmeno tra varianti della stessa macro: l'obiettivo è evitare N concept
che sono lo stesso sito con palette e font diversi. Si riusa codice solo per coincidenza opportunistica (stesso identico
problema tecnico), mai come regola. Ogni concept è libero di usare tecniche/librerie diverse (CSS puro, JS vanilla, islands).

## Struttura

```
src/pages/<macrocategoria>/<variante>/index.astro   → un concept (solo l'impianto della pagina)
src/concepts/<variante>/                            → sezioni (.astro), base.css, dati del concept
src/assets/<variante>/                              → immagini, ottimizzate da astro:assets
public/images/<variante>/                           → file con URL fisso (og:image, favicon)
```

I componenti restano **dentro il concept** (la cartella serve a spezzare il file, non a condividere codice).

La `src/pages/index.astro` in radice è l'**hub pubblico delle vetrine** (marchio dello studio, tema scuro/chiaro come
theloopstudio.org), separato dai concept: vive in `src/hub/`, contenuti in `src/hub/data.ts`. A ogni nuova pubblicazione:
voce in `data.ts` (immagini in `src/assets/hub/`), pagina `info.astro` (5 righe con `src/hub/Dettaglio.astro`, testi in
`data.ts`), voce in `public/sitemap.xml`. I concept restano `noindex`; link hub→concept in nuova scheda, hub→`info` nella
stessa. Ogni pagina ha il proprio menù mobile. Header, footer, cursore, scrollbar e toggle tema dell'hub sono COPIE del sito
madre (`Loop-Studio-Web/Loop_Studio`; cartella locale variabile, se non si trova chiedere), riallineate a mano e valide
SOLO per l'hub. **Dettagli di Concepts.astro, scena "via" (Hero.astro, `atmoDi`, neon, mini-nav) e menù mobile: `docs/hub.md`, da leggere prima di toccare l'hub.**

**Livelli (2026-10-07):** ogni concept ha `livello` 1/2/3 e `lingua` in `data.ts`: Essenziale · Evoluto · Esperienza,
**relativi alla macrocategoria** (giudicati dal frontend percepito). Cartellino a tre lampadine (`Livello.astro`) su card
della via, card delle vetrine e `info`; legenda nella scena di benvenuto e sezione `Livelli.astro`. Regole commerciali: ogni
concept si vende UNA volta e poi esce dall'hub (si sostituisce con uno nuovo); lo sconto NON è pubblico (si dà nel preventivo);
niente fasce di prezzo per livello sull'hub. Lingua come codice testuale (IT/EN/ES), mai bandiere. Non usare più "Low key/Medium/High".

## Skill di design

Dettagli e installazione sicura in `studio-kit/docs/skill-design.md`. Movimento (curve, durate, reduced-motion): Emil
Kowalski (`animate`; `review-animations` lo lancia l'utente). Struttura, gerarchia, contrasto: Impeccable (`detect`,
`critique`, `audit`, `polish`, in `.claude/skills/impeccable/`; installato `--no-hooks`, telemetria spenta; non lanciare
`live`, `overdrive` solo con direzione scelta dall'utente; non installarlo a livello utente). Direzione estetica prima del
codice: `frontend-design` (il brief vince). Ordine d'uso: nel flusso del CLAUDE.md globale; `detect` sulla pagina
COMPILATA (dist), non sui `.astro`; correzioni in un giro solo. Il rilevatore non vede il contrasto del testo sopra un
canvas: `studio-kit/scripts/canvas-shot.mjs` + `canvas-contrast.py`.
**Verdetto della prova completa (Sobremesa, 2026-10-24; `studio-kit/docs/skill-design.md`):** niente `build-phase` comp-led;
finish reviewer con le catture sempre, prima di hub e deploy; `audit` + break-ui/harden solo sui concept interattivi;
`critique` con un solo agente e punteggio non affidabile; `generate`/`live` solo su richiesta dell'autore.

## Convenzioni di un concept

- **Niente aspetto "da AI"** (2026-10-07): carattere visivo vero. Prima di disegnare cercare riferimenti reali, fotografia/texture
  vere, tipografia con personalità, imperfezioni volute; evitare griglie di schede uguali, palette "da brief", bordi netti +
  ombre piene, icone SVG troppo pulite, copy da template.
- **Niente beige, crema o avorio come base** (2026-10-07): il portfolio ne è già pieno. Scegliere azzurri, verdi, grigi freddi,
  toni scuri, colori pieni. **Gradienti graditi** se con intenzione (OKLCH, `@property`, luce che segue lo scroll).
- **Palette diverse dentro la stessa macro** (2026-10-09): le tre vetrine di una macro stanno una accanto all'altra nella via,
  quindi differiscono per luminosità e tinta (una scura, una chiara, una a colore pieno). Confrontare con il campo `palette` di `data.ts`.
- **Struttura, materia e gesto non si ripetono** (2026-10-15): prima di ogni nuovo concept leggere `docs/ispirazioni.md` (matrice,
  direzioni non usate, riferimenti) e aprire https://www.testmuai.com/blog/web-design-trends/. Due concept non condividono tutte e
  tre le scelte, nella stessa macro non ne condividono due. "Luce / ora del giorno" è esaurito. A fine lavoro aggiornare la tabella.
- **Un componente per sezione**, con markup, CSS (scoped) e JS propri. Gli elementi creati via JS non ricevono lo scope: stili in `<style is:global>` dello stesso componente.
- **Immagini solo in locale** in `src/assets/` con `<Image>` di `astro:assets`, niente hotlink. Unsplash solo `images.unsplash.com/photo-…`
  (`plus.unsplash.com` è a pagamento: scartare). Controllare l'assenza di watermark.
- **Percorsi con `base`**: `const base = import.meta.env.BASE_URL.replace(/\/$/, '')` poi `${base}/percorso` (BASE_URL non ha slash finale), altrimenti 404 online.
- **Sono vetrine dimostrative**: `noindex, nofollow` ovunque; dati, indirizzi e recensioni di fantasia dichiarati "di esempio"; nessun
  cliente reale, nessun logo di terzi (es. Google). Eccezione (2026-10-18): negli e-commerce i marchi dei metodi di pagamento
  (PayPal, Klarna, Scalapay, Satispay, Apple Pay, Google Pay, carte, MyBank) si mostrano con bottoni finti e dichiarazione che nessun pagamento è reale.
- **Widget ispirati al lab** (recensioni, prenotazione): si ricreano nel concept, non si importano i bundle.
- **Fascia di ritorno** in cima (`Fascia.astro` del concept, stile proprio): "vetrina dimostrativa · concept di Loop Studio", link "Tutte le vetrine" e
  "Ne voglio una così" (`https://theloopstudio.org/contatti/?concept=<slug>`). `position: absolute` (scorre via); la navbar fissa ha
  `top: var(--fascia, 0px)` aggiornata dallo script. È un `<aside>` con `aria-label`.
- **Footer** con logo Loop Studio (SVG, nero o bianco + rosso `#fe3b30`) e link a https://theloopstudio.org/.
- **Collaudo** in `tools/` (package.json proprio, fuori dal deploy; `cd tools && npm install` una volta per PC): `shot.mjs <url> [w] [h] [prefisso]`
  (screenshot, overflow orizzontale, console), `axe.mjs <url> [selettore]` (1440 e 390, anche col menù aperto), `lh.mjs <url>` (Lighthouse su `astro preview`, più severo di PSI),
  `psi.mjs <url> [mobile|desktop]` (PSI su pagina ONLINE, sono i numeri veri; chiave in `PSI_KEY`, mai in repo; senza chiave 429). Usano il Chrome di sistema (`CHROME_PATH`).
- **Prima di pubblicare**: `astro build`, axe a 0 violazioni in tema chiaro e scuro, nessuno scorrimento orizzontale a 390 px, prova del flusso dei widget e dell'anteprima social (`og:image` 1200×630 in `public/images/<variante>/`).
- **Dev server**: dopo riscritture grandi può servire stili vecchi. Se la pagina appare senza stili: `astro dev stop` e `astro dev --background` (solo se è il NOSTRO server, vedi Porte).

## Stato dei concept

Schede complete (build, axe, Lighthouse/PSI, idea-guida, token, trabocchetti, "da fare") in `docs/concept/<slug>.md`: **leggere quella del concept su cui si lavora**
(macro in `docs/concept/_macro.md`, piano macro in `docs/prossime-macro.md`). A fine lavoro aggiornare la scheda, non questo file.

Pubblicati (macro · livello · slug): Ristorazione: Trattoria (1, `trattoria`), Luppolo & Watt (2, `ristopub`), Ossidiana (3, `ossidiana`). Benessere: Bottega Tre Rasoi (1, `barbiere`),
Atelier Lumen (2, `lumen`), Aeterna (3, `aeterna`). Tech: FIXLAB (1, `fixlab`), Hot Swap (2, `hotswap`), Ordito (3, `ordito`). Abitare: Sifone (1, `sifone`), Obra Fina (2, `obrafina`),
Scala Vera (3, `scalavera`). Eventi: Mala Hierba Flores (1, `malahierba`), Limonaia Aurelia (2, `limonaia`), Marrow & Knot (3, `marrowknot`). E-commerce: Chioma Saracena (1, `olio`), Soft Riot (2, `softriot`), Sobremesa (3, `sobremesa`).
Macro chiuse: Ristorazione, Benessere, Tech, Abitare, Eventi, E-commerce.

**Prossimo (2026-10-24): Ospitalità** (E-commerce chiusa con Sobremesa, `docs/concept/sobremesa.md`), poi Animali, Legale
(Motori e Sport in coda); settore medico escluso.

**E-commerce e backend:** i livelli contano anche per il motore dietro il negozio; sull'hub si resta neutri (nessun nome di piattaforma né cifra, campo `backend` in `data.ts`). Le piattaforme si nominano SOLO nei documenti
interni, mai nei siti pubblici. Criteri e scelte per livello in `docs/ecommerce-backend.md`.

## Misure di performance e controlli

Una volta al mese si rimisurano TUTTE le homepage con `node tools/psi.mjs <url> mobile|desktop` (chiave in `Assets/Loop/PSI.txt` → `PSI_KEY`) e si riallineano `metriche` di `src/hub/data.ts` e il README.
**Primo giro completo: novembre 2026** (concordato il 2026-10-21, non prima). Telefono reale: l'autore ha visto TUTTI i concept (2026-10-21), ok; non riproporlo. Resta la rilettura dei testi.
Marchi: nessun controllo (TMview/UIBM/IMPI), i nomi sono fittizi; solo se il cliente compra anche il brand.

## Sito madre: ogni nuova homepage va comunicata (form contatti)

A ogni concept aggiunto all'hub (o cambio di slug/nome) **avvisare l'utente che il sito madre** (`Loop-Studio-Web/Loop_Studio`) va aggiornato: `src/data/vetrine.ts`, elenco `vetrinePerContatti`
(slug → nome, devono combaciare con `src/hub/data.ts`), altrimenti "Ne voglio una così" non precompila il form. Il riquadro Vetrine del sito madre mostra solo 6 anteprime (una per settore: Ossidiana, Ordito, Aeterna,
Scala Vera, Luppolo & Watt, Mala Hierba Flores): non cresce, al massimo si sostituisce un'anteprima, solo su decisione dell'utente.

## Manutenzione di questo file (regola dell'utente, 2026-10-20)

Il CLAUDE.md si carica a ogni sessione e costa token: tenerlo il più leggero possibile. Cronache, schede e dettagli lunghi vanno in `docs/` (letti solo quando servono); qui restano le regole sempre valide e i rinvii.
Togliere le note con scadenza appena superate. Stessa cura per l'indice MEMORY.md (una riga per voce, niente duplicati né voci obsolete).

## Deploy

`output: 'static'`, GitHub Pages con dominio **https://vetrine.theloopstudio.org** (CNAME `vetrine` → `loop-studio-web.github.io` su Cloudflare, DNS only; HTTPS forzato). `astro.config.mjs`: `site` sul sottodominio, `base: '/'`.
I vecchi indirizzi `loop-studio-web.github.io/vetrine/` rimandano al nuovo. Deploy automatico (`.github/workflows/deploy.yml`) a ogni push su `main`. In locale: `http://localhost:4321/`.

## Due PC: controllare SEMPRE l'allineamento con git

Si lavora da due computer su questa repo e sul sito madre. Prima di iniziare e prima di committare:
1. `git fetch --all --prune`, poi `git status` e `git rev-list --left-right --count HEAD...@{u}` (sinistra = solo locali, destra = solo remoti).
2. Commit remoti non scaricati: leggerli (`git log HEAD..@{u}`) e `git pull --ff-only` PRIMA di toccare file. Se non è fast-forward o ci sono modifiche locali in conflitto: fermarsi e chiedere, mai forzare.
3. **Commit liberi, a pezzi logici; il push solo dopo il via esplicito** (2026-10-21). Prima del push ripetere il controllo. Mai `push --force`.
4. Ciò che è online è `origin/main`, non il PC: dire sempre se una modifica è solo locale o pubblicata.

## Repository: sempre sull'organizzazione dello studio

Remoto: `https://github.com/Loop-Studio-Web/vetrine.git`. Tutte le repo dello studio vanno sull'organizzazione **Loop-Studio-Web**, mai sul profilo personale salvo comando esplicito
(`gh repo create Loop-Studio-Web/<nome>`). Se `git remote -v` mostra un indirizzo personale, segnalarlo e chiedere prima di `git remote set-url origin …`.

## Timeline

Nessuna fretta: un concept alla volta, con la cura che serve. Lavoro di ampliamento portfolio in attesa dei preventivi.

## Development

Dev server in background: `astro dev --background` (gestione: `astro dev stop|status|logs`).
**Porte (2026-10-07):** i test (screenshot, axe, Lighthouse) usano l'anteprima su `http://localhost:4401/` (`astro preview --port 4401` sulla cartella `dist`, da rifare con `astro build` dopo ogni modifica; se è già occupata riusarla).
La **4321 è il server di sviluppo dell'utente: non toccarla mai** (niente `astro dev stop`, niente `taskkill` su node).
Documentazione Astro: https://docs.astro.build (routing, componenti, framework components, content collections, styling, i18n).
