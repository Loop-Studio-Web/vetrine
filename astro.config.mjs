// @ts-check
import { defineConfig } from 'astro/config';

// Repo "vetrine" di Loop Studio: homepage-concept dimostrative, una rotta
// per ciascuna, raggruppate per macrocategoria (src/pages/<macrocategoria>/<variante>/).
// Nessun componente/layout condiviso tra i concept per scelta: questa repo è
// solo l'infrastruttura comune (build + deploy), non un design system — ogni
// concept ha markup, CSS e JS propri. Vedi CLAUDE.md.
//
// Pubblicata su GitHub Pages con dominio personalizzato: https://vetrine.theloopstudio.org
// (record CNAME su Cloudflare verso loop-studio-web.github.io, DNS only). Essendo
// un dominio dedicato il sito sta alla radice, quindi `base` è '/'. Tutti i percorsi
// interni passano da import.meta.env.BASE_URL, perciò funzionano con qualunque base.
export default defineConfig({
	site: 'https://vetrine.theloopstudio.org',
	base: '/',
	output: 'static',
});
