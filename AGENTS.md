# Loop Studio — Vetrine

## Cos'è

Homepage concept dimostrative, non siti di clienti reali: materiale di
portfolio per attrarre nuovi clienti, linkato dal Lab del sito principale
(theloopstudio.org/lab/). Organizzate per macrocategoria di attività (es.
"Ristorazione"), con più varianti/archetipi dentro ciascuna (es. Grande
ristorante di classe, Home restaurant, Trattoria, RistoPub) per intercettare
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
src/pages/<macrocategoria>/<variante>/index.astro   → un concept
```

Esempio: `src/pages/ristorazione/trattoria/index.astro`.

La `src/pages/index.astro` in radice è un indice semplice con i link ai
concept pubblicati (sul modello della index.html di `lab`), da aggiornare a
mano a ogni nuova pubblicazione.

## Deploy

`output: 'static'`, pubblicato su GitHub Pages come project site:
`https://loop-studio-web.github.io/vetrine/`. Per questo `astro.config.mjs`
ha sia `site` che `base: '/vetrine'` — necessario per Pages, altrimenti
asset e link assoluti puntano alla radice del dominio invece che dentro
`/vetrine/`. Deploy automatico via GitHub Actions
(`.github/workflows/deploy.yml`) a ogni push su `main`, nessuno step manuale.

## Timeline

Nessuna fretta: si costruisce un concept alla volta, con la cura che serve
a ciascuno, anche su un orizzonte di mesi. Niente scadenza da rispettare.

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
