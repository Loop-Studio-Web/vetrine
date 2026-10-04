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
macrocategoria (`macros` in `data.ts`). Ogni concept ha anche una pagina di dettaglio indicizzabile
(`src/pages/<macro>/<variante>/info.astro`, 5 righe che usano `src/hub/Dettaglio.astro`; i testi sono in
`data.ts`) da aggiungere anche in `public/sitemap.xml`. I concept restano `noindex`. Ogni pagina ha anche
il proprio menù su mobile (hub: pannello a cerchio; Trattoria: cartoncino che si srotola; Ossidiana: sipario).

## Convenzioni di un concept

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
- **Ristorazione / Grande ristorante** (Ossidiana): costruito in locale,
  `build` ok, axe 0 violazioni, non ancora pubblicato. Solo tema scuro per
  scelta; percorso a 5 portate in scroll-snap con zoom lento (Ken Burns) sulle
  foto; font Bodoni Moda + Jost + IBM Plex Mono. Logo generato con AI
  (simbolo ritagliato in `src/assets/ossidiana/brand/simbolo.png`).

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
`Loop-Studio`). Prima di iniziare qualunque lavoro, e di nuovo prima di
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

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
