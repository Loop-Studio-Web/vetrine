// Illustrazioni dei prodotti: oggetti piatti, contorno grafite e "spessore" a colore pieno, nello stile dei tasti.
// Sono stringhe SVG perché le usano sia il markup sia gli script (catalogo, anteprima, confronto).
// Nessuna foto: niente marchi di terzi visibili, e il negozio ha un suo linguaggio.
import type { Forma } from './catalogo';

const colori = {
	arancio: { c: '#ff6b2c', d: '#d44e12' },
	acqua: { c: '#2fb5a8', d: '#1f8a80' },
	grafite: { c: '#3a3a3e', d: '#1c1c1e' },
	avorio: { c: '#f4f0e6', d: '#c4bba6' },
} as const;
type Colore = keyof typeof colori;

const G = '#2a2a2d';
const A = '#fff6e8'; // luce
const S = `stroke="${G}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;

export function figura(forma: Forma, colore: Colore, titolo = ''): string {
	const { c, d } = colori[colore];
	const cuori: Record<Forma, string> = {
		tower: `
			<rect x="34" y="12" width="52" height="72" rx="7" fill="${d}" ${S}/>
			<rect x="34" y="8" width="52" height="72" rx="7" fill="${c}" ${S}/>
			<rect x="41" y="16" width="30" height="42" rx="3" fill="${G}"/>
			<circle cx="56" cy="37" r="11" fill="none" stroke="${A}" stroke-width="2.5"/>
			<path d="M56 26v22M45 37h22" stroke="${A}" stroke-width="2.5" stroke-linecap="round"/>
			<rect x="76" y="16" width="4" height="22" rx="2" fill="${G}"/>
			<circle cx="46" cy="68" r="3.4" fill="${G}"/><rect x="54" y="66" width="20" height="4" rx="2" fill="${G}"/>`,
		laptop: `
			<path d="M26 66h68l8 12H18z" fill="${d}" ${S}/>
			<rect x="30" y="16" width="60" height="48" rx="5" fill="${c}" ${S}/>
			<rect x="35" y="21" width="50" height="38" rx="2" fill="${G}"/>
			<path d="M40 52l9-11 7 8 8-14 11 17z" fill="${A}" opacity=".9"/>
			<rect x="48" y="70" width="24" height="3" rx="1.5" fill="${G}"/>`,
		gpu: `
			<rect x="10" y="26" width="100" height="40" rx="6" fill="${d}" ${S}/>
			<rect x="10" y="22" width="100" height="40" rx="6" fill="${c}" ${S}/>
			<circle cx="37" cy="42" r="14" fill="${G}"/><circle cx="37" cy="42" r="4" fill="${A}"/>
			<path d="M37 30v8M37 46v8M25 42h8M41 42h8" stroke="${A}" stroke-width="2.5" stroke-linecap="round"/>
			<circle cx="80" cy="42" r="14" fill="${G}"/><circle cx="80" cy="42" r="4" fill="${A}"/>
			<path d="M80 30v8M80 46v8M68 42h8M84 42h8" stroke="${A}" stroke-width="2.5" stroke-linecap="round"/>
			<rect x="20" y="70" width="52" height="7" rx="1" fill="${G}"/>`,
		cpu: `
			<rect x="30" y="24" width="60" height="60" rx="8" fill="${d}" ${S}/>
			<rect x="30" y="18" width="60" height="60" rx="8" fill="${c}" ${S}/>
			<rect x="42" y="30" width="36" height="36" rx="4" fill="${G}"/>
			<rect x="49" y="37" width="22" height="22" rx="2" fill="none" stroke="${A}" stroke-width="2.5"/>
			<path d="M42 12v6M54 12v6M66 12v6M78 12v6M42 78v6M54 78v6M66 78v6M78 78v6M24 30h6M24 42h6M24 54h6M24 66h6M90 30h6M90 42h6M90 54h6M90 66h6" stroke="${G}" stroke-width="3" stroke-linecap="round"/>`,
		ram: `
			<rect x="8" y="36" width="104" height="34" rx="4" fill="${d}" ${S}/>
			<rect x="8" y="30" width="104" height="34" rx="4" fill="${c}" ${S}/>
			<rect x="16" y="38" width="16" height="18" rx="2" fill="${G}"/><rect x="38" y="38" width="16" height="18" rx="2" fill="${G}"/>
			<rect x="60" y="38" width="16" height="18" rx="2" fill="${G}"/><rect x="82" y="38" width="16" height="18" rx="2" fill="${G}"/>
			<path d="M14 70v6M22 70v6M30 70v6M38 70v6M46 70v6M74 70v6M82 70v6M90 70v6M98 70v6" stroke="${G}" stroke-width="3" stroke-linecap="round"/>`,
		ssd: `
			<rect x="22" y="22" width="76" height="52" rx="6" fill="${d}" ${S}/>
			<rect x="22" y="16" width="76" height="52" rx="6" fill="${c}" ${S}/>
			<rect x="30" y="24" width="38" height="36" rx="3" fill="${G}"/>
			<path d="M36 52l8-8 6 5 9-11" fill="none" stroke="${A}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
			<circle cx="82" cy="28" r="3.5" fill="${G}"/><rect x="74" y="44" width="16" height="4" rx="2" fill="${G}"/><rect x="74" y="52" width="16" height="4" rx="2" fill="${G}"/>`,
		psu: `
			<rect x="22" y="26" width="76" height="52" rx="6" fill="${d}" ${S}/>
			<rect x="22" y="20" width="76" height="52" rx="6" fill="${c}" ${S}/>
			<circle cx="52" cy="46" r="17" fill="${G}"/>
			<path d="M52 33v26M39 46h26M43 37l18 18M61 37L43 55" stroke="${A}" stroke-width="2" stroke-linecap="round"/>
			<rect x="78" y="32" width="14" height="6" rx="2" fill="${G}"/><rect x="78" y="44" width="14" height="6" rx="2" fill="${G}"/><rect x="78" y="56" width="14" height="6" rx="2" fill="${G}"/>`,
		board: `
			<rect x="22" y="14" width="78" height="72" rx="6" fill="${d}" ${S}/>
			<rect x="22" y="8" width="78" height="72" rx="6" fill="${c}" ${S}/>
			<rect x="32" y="18" width="22" height="22" rx="3" fill="${G}"/><rect x="37" y="23" width="12" height="12" rx="1" fill="none" stroke="${A}" stroke-width="2"/>
			<path d="M66 16v26M73 16v26M80 16v26M87 16v26" stroke="${G}" stroke-width="4" stroke-linecap="round"/>
			<rect x="32" y="52" width="58" height="6" rx="2" fill="${G}"/><rect x="32" y="63" width="30" height="6" rx="2" fill="${G}"/><circle cx="80" cy="68" r="4" fill="${G}"/>`,
		monitor: `
			<path d="M46 82h28M60 66v16" ${S} fill="none"/>
			<rect x="12" y="20" width="96" height="52" rx="6" fill="${d}" ${S}/>
			<rect x="12" y="14" width="96" height="52" rx="6" fill="${c}" ${S}/>
			<rect x="19" y="21" width="82" height="38" rx="2" fill="${G}"/>
			<path d="M26 52l16-17 12 11 14-20 18 26z" fill="${A}" opacity=".9"/>`,
		keyboard: `
			<rect x="8" y="30" width="104" height="48" rx="8" fill="${d}" ${S}/>
			<rect x="8" y="24" width="104" height="48" rx="8" fill="${c}" ${S}/>
			${[0, 1, 2]
				.map((r) => [0, 1, 2, 3, 4, 5, 6].map((k) => `<rect x="${17 + k * 13}" y="${31 + r * 11}" width="10" height="8" rx="2" fill="${G}"/>`).join(''))
				.join('')}
			<rect x="30" y="64" width="60" height="5" rx="2.5" fill="${G}"/>`,
		mouse: `
			<path d="M60 12c-16 0-24 10-24 26v30c0 12 10 18 24 18s24-6 24-18V38c0-16-8-26-24-26z" fill="${d}" ${S} transform="translate(0 5)"/>
			<path d="M60 12c-16 0-24 10-24 26v30c0 12 10 18 24 18s24-6 24-18V38c0-16-8-26-24-26z" fill="${c}" ${S}/>
			<path d="M60 12v28M36 40h48" stroke="${G}" stroke-width="3"/>
			<rect x="56.5" y="22" width="7" height="12" rx="3.5" fill="${G}"/>`,
		headset: `
			<path d="M26 56V46c0-20 14-32 34-32s34 12 34 32v10" fill="none" stroke="${G}" stroke-width="9" stroke-linecap="round"/>
			<path d="M26 56V46c0-20 14-32 34-32s34 12 34 32v10" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>
			<rect x="14" y="48" width="22" height="34" rx="8" fill="${d}" ${S}/>
			<rect x="14" y="44" width="22" height="34" rx="8" fill="${c}" ${S}/>
			<rect x="84" y="48" width="22" height="34" rx="8" fill="${d}" ${S}/>
			<rect x="84" y="44" width="22" height="34" rx="8" fill="${c}" ${S}/>
			<path d="M20 78c0 8 8 10 18 10" fill="none" ${S}/>`,
		desk: `
			<rect x="10" y="62" width="100" height="9" rx="3" fill="${d}" ${S}/>
			<path d="M20 71v14M100 71v14" ${S} fill="none"/>
			<rect x="30" y="16" width="46" height="30" rx="4" fill="${c}" ${S}/>
			<rect x="35" y="21" width="36" height="20" rx="1.5" fill="${G}"/>
			<path d="M53 46v8M44 54h18" ${S} fill="none"/>
			<rect x="82" y="28" width="22" height="34" rx="4" fill="${d}" ${S}/>
			<rect x="82" y="24" width="22" height="34" rx="4" fill="${c}" ${S}/>
			<circle cx="93" cy="34" r="4" fill="${G}"/>
			<rect x="26" y="56" width="38" height="6" rx="2" fill="${c}" ${S}/>`,
	};
	const t = titolo ? `<title>${titolo}</title>` : '';
	return `<svg viewBox="0 0 120 92" fill="none" xmlns="http://www.w3.org/2000/svg" ${titolo ? 'role="img"' : 'aria-hidden="true"'}>${t}${cuori[forma]}</svg>`;
}
