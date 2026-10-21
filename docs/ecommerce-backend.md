# E-commerce: i livelli contano anche per il backend (deciso il 2026-10-20)

I tre livelli di E-commerce si distinguono dal frontend **e dal motore dietro il negozio**. Sull'hub si resta **neutri**:
nessun nome di piattaforma, nessuna cifra; la piattaforma si sceglie in sede di preventivo. In `data.ts` il campo opzionale
`backend` (solo E-commerce) racconta il costo ricorrente, `Dettaglio.astro` lo mostra come "Dietro il negozio" e
`Livelli.astro` ha una nota sul motore. Da compilare per ogni vetrina E-commerce (Soft Riot ed Editoriale ancora da fare).

**Regola sui nomi (2026-10-20)**: le piattaforme si nominano solo nei documenti interni (CLAUDE.md, memoria, preventivi, questo file), MAI nei siti
pubblici (hub, vetrine, sito madre): cambiano nel tempo, si dice "template custom", "servizio di pagamento". Unica eccezione sul sito madre: i
progetti del portfolio già online che usano davvero WordPress (non toccarli).

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
