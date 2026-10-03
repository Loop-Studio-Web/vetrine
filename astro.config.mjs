// @ts-check
import { defineConfig } from 'astro/config';

// Repo "vetrine" di Loop Studio: homepage-concept dimostrative, una rotta
// per ciascuna, raggruppate per macrocategoria (src/pages/<macrocategoria>/<variante>/).
// Nessun componente/layout condiviso tra i concept per scelta: questa repo è
// solo l'infrastruttura comune (build + deploy), non un design system — ogni
// concept ha markup, CSS e JS propri. Vedi CLAUDE.md.
//
// Pubblicata su GitHub Pages come project site (non su un dominio proprio),
// quindi serve sia `site` che `base`: senza `base` ogni asset e link assoluto
// (es. /favicon.svg) punterebbe alla radice del dominio invece che a
// /vetrine/, rompendo tutto fuori da localhost.
export default defineConfig({
	site: 'https://loop-studio-web.github.io',
	base: '/vetrine',
	output: 'static',
});
