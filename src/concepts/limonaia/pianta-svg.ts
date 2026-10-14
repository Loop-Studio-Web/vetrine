// Disegna la pianta della sala come stringa SVG. Modulo puro: lo usano Pianta (trascinabile) e Giornata (sola lettura).
import { MARGINE, PALCO } from './dati';
import { pista, type Elemento, type Pianta } from './pianta';

export interface OpzioniSvg {
	ritiro?: number; // 0..1: 0 = disposizione di cena, 1 = disposizione con la pista
	notte?: Pianta | null; // la stessa sala con la pista come area esclusa
	override?: Record<string, { x: number; y: number }>;
	ospiti?: number;
	verticale?: boolean; // sala ruotata di 90°: sul telefono sta in larghezza senza scorrimento orizzontale
}

export const PAD = 130; // spazio attorno alla sala per le quote

const metri = (cm: number) => `${(cm / 100).toLocaleString('it-IT', { maximumFractionDigits: 1 })} m`;

function sedieTondo(n: number, r: number): { x: number; y: number }[] {
	return Array.from({ length: n }, (_, i) => {
		const a = (i / n) * Math.PI * 2 - Math.PI / 2;
		return { x: Math.round(Math.cos(a) * r), y: Math.round(Math.sin(a) * r) };
	});
}

function sedieLungo(posti: number, w: number, h: number): { x: number; y: number }[] {
	const perLato = Math.floor(posti / 2);
	const out: { x: number; y: number }[] = [];
	for (let i = 0; i < perLato; i++) {
		const x = -((perLato - 1) * 60) / 2 + i * 60;
		out.push({ x, y: -(h / 2 + 30) }, { x, y: h / 2 + 30 });
	}
	return out;
}

function sedieFila(posti: number, h: number): { x: number; y: number }[] {
	return Array.from({ length: posti }, (_, i) => ({ x: 0, y: -h / 2 + 25 + i * 50 }));
}

export function disegnaElemento(e: Elemento, pos: { x: number; y: number }, num: number, primoSeduto: number, seduti: number, dimOspiti?: number): string {
	let corpo = '';
	let sedie: { x: number; y: number }[] = [];
	if (e.tipo === 'tondo') {
		corpo = `<circle class="ps-tav" r="${e.w / 2}"/><text class="ps-num" y="4">${num}</text>`;
		sedie = sedieTondo(e.posti, e.w / 2 + 34);
	} else if (e.tipo === 'alto') {
		corpo = `<circle class="ps-tav" r="${e.w / 2}"/>`;
		sedie = sedieTondo(Math.min(e.posti, 5), e.w / 2 + 26).slice(0, 5);
	} else if (e.tipo === 'lungo') {
		corpo = `<rect class="ps-tav" x="${-e.w / 2}" y="${-e.h / 2}" width="${e.w}" height="${e.h}" rx="10"/><text class="ps-num" y="4">${num}</text>`;
		sedie = sedieLungo(e.posti, e.w, e.h);
	} else {
		corpo = `<rect class="ps-tav" x="${-e.w / 2}" y="${-e.h / 2}" width="${e.w}" height="${e.h}" rx="6" fill-opacity="0.35"/>`;
		sedie = sedieFila(e.posti, e.h);
	}
	const sz = e.tipo === 'fila' ? 18 : 22;
	const sed = sedie
		.map((s, i) => {
			const vuota = primoSeduto + i >= seduti;
			return `<circle class="ps-sed${vuota ? ' ps-sed--vuota' : ''}" cx="${s.x}" cy="${s.y}" r="${sz}"/>`;
		})
		.join('');
	const nome = e.tipo === 'fila' ? 'Blocco di sedie' : e.tipo === 'lungo' ? `Tavolo lungo ${num}` : e.tipo === 'alto' ? `Tavolo alto ${num}` : `Tavolo ${num}`;
	const edit = dimOspiti === undefined ? '' : ` tabindex="0" role="button" aria-label="${nome}, ${e.posti} posti. Frecce per spostarlo."`;
	return `<g class="ps-el ps-${e.tipo}" data-id="${e.id}" transform="translate(${pos.x} ${pos.y})"${edit}>${sed}${corpo}</g>`;
}

export function svgPianta(p: Pianta, o: OpzioniSvg = {}): string {
	const t = o.notte ? o.ritiro ?? 0 : 0;
	const parti: string[] = [];
	parti.push(`<rect class="ps-sala" x="0" y="0" width="${p.w}" height="${p.d}" rx="36"/>`);
	parti.push(`<rect class="ps-area" x="${p.area.x}" y="${p.area.y}" width="${p.area.w}" height="${p.area.h}" rx="20"/>`);
	if (p.palco) {
		const r = p.palco;
		parti.push(
			`<g class="ps-palco"><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="14"/><text transform="translate(${r.x + r.w / 2} ${r.y + r.h / 2}) rotate(-90)">PALCO</text></g>`,
		);
	}
	if (t > 0) {
		const r = pista(p);
		parti.push(`<g class="ps-pista" style="opacity:${t.toFixed(2)}"><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="20"/><text x="${r.x + r.w / 2}" y="${r.y + r.h / 2 + 18}">PISTA</text></g>`);
	}
	const op = (v: number) => (v < 1 ? ` style="opacity:${Math.max(0, v).toFixed(2)}"` : '');
	const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
	const notte = o.notte?.elementi ?? [];
	let seduto = 0;
	let num = 0;
	p.elementi.forEach((e, i) => {
		const base = o.override?.[e.id] ?? { x: e.x, y: e.y };
		const n = e.tipo !== 'fila' ? ++num : num;
		const gemello = t > 0 ? notte[i] : undefined;
		const stessa = gemello && gemello.tipo === e.tipo && (e.tipo === 'tondo' || e.tipo === 'alto');
		let pos = base;
		let vis = 1;
		if (t > 0 && o.notte) {
			if (stessa) pos = { x: mix(base.x, gemello.x), y: mix(base.y, gemello.y) };
			else vis = 1 - t;
		}
		const g = disegnaElemento(e, { x: Math.round(pos.x), y: Math.round(pos.y) }, n, seduto, p.posti, o.ospiti);
		parti.push(vis < 1 ? g.replace('<g ', `<g${op(vis)} `) : g);
		seduto += e.posti;
	});
	// gli elementi della disposizione con la pista che non hanno un gemello di cena entrano in dissolvenza
	if (t > 0 && o.notte) {
		let sn = 0;
		notte.forEach((e, i) => {
			const d = p.elementi[i];
			const stessa = d && d.tipo === e.tipo && (e.tipo === 'tondo' || e.tipo === 'alto');
			if (!stessa) parti.push(disegnaElemento(e, { x: e.x, y: e.y }, i + 1, sn, o.notte!.posti).replace('<g ', `<g${op(t)} `));
			sn += e.posti;
		});
	}
	if (o.verticale) {
		// x' = d - y, y' = x: la lunghezza della sala corre in verticale; i testi si contro-ruotano per restare leggibili
		const dritto = parti
			.join('')
			.replaceAll('<text class="ps-num"', '<text class="ps-num" transform="rotate(-90)"')
			.replace(/<text x="([\d.]+)" y="([\d.]+)">PISTA/g, '<text x="$1" y="$2" transform="rotate(-90 $1 $2)">PISTA');
		return `<svg class="ps ps--verticale" viewBox="${-PAD} ${-PAD} ${p.d + PAD * 2} ${p.w + PAD * 2}" role="group" aria-label="Pianta della sala"><g transform="translate(${p.d} 0) rotate(90)">${dritto}</g></svg>`;
	}
	return `<svg class="ps" viewBox="${-PAD} ${-PAD} ${p.w + PAD * 2} ${p.d + PAD * 2}" role="group" aria-label="Pianta della sala">${parti.join('')}</svg>`;
}

export { MARGINE, PALCO };
