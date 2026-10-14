// Disegna la pianta della sala come stringa SVG. Modulo puro: lo usano Pianta (trascinabile) e Giornata (sola lettura).
import { MARGINE, PALCO } from './dati';
import { pista, ritirato, type Elemento, type Pianta } from './pianta';

export interface OpzioniSvg {
	ora?: number; // se presente, i tavoli si ritirano dopo la cena
	ritiro?: number; // 0..1, calcolato da chi chiama
	override?: Record<string, { x: number; y: number }>;
	ospiti?: number;
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
	const t = o.ritiro ?? 0;
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
		parti.push(`<g class="ps-pista" style="opacity:${t}"><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="20"/><text x="${r.x + r.w / 2}" y="${r.y + r.h / 2 + 18}">PISTA</text></g>`);
	}
	let seduto = 0;
	let num = 0;
	for (const e of p.elementi) {
		const base = o.override?.[e.id] ?? { x: e.x, y: e.y };
		const pos = t > 0 ? ritirato({ ...e, ...base }, p, t) : base;
		if (e.tipo !== 'fila') num++;
		parti.push(disegnaElemento(e, { x: Math.round(pos.x), y: Math.round(pos.y) }, num, seduto, p.posti, o.ospiti));
		seduto += e.posti;
	}
	// quote
	parti.push(`<text class="ps-quota" x="${p.w / 2}" y="-44">${metri(p.w)}</text>`);
	parti.push(`<text class="ps-quota" transform="translate(-44 ${p.d / 2}) rotate(-90)">${metri(p.d)}</text>`);
	return `<svg class="ps" viewBox="${-PAD} ${-PAD} ${p.w + PAD * 2} ${p.d + PAD * 2}" role="group" aria-label="Pianta della sala">${parti.join('')}</svg>`;
}

export { MARGINE, PALCO };
