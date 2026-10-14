// Geometria della sala: dove vanno i tavoli per un formato, una sala e un numero di ospiti.
// Modulo puro, coordinate in centimetri, origine in alto a sinistra della sala.
import { MARGINE, PALCO, spazio, type Formato, type SpazioId } from './dati';

export type TipoElemento = 'tondo' | 'lungo' | 'alto' | 'fila';

export interface Elemento {
	id: string;
	tipo: TipoElemento;
	x: number; // centro
	y: number;
	w: number;
	h: number;
	posti: number;
}

export interface Rettangolo {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface Pianta {
	w: number;
	d: number;
	area: Rettangolo; // zona utile per i tavoli
	palco: Rettangolo | null;
	elementi: Elemento[];
	posti: number; // ospiti seduti/serviti
	fuori: number; // ospiti che non trovano posto
}

const DIAM_TONDO = 180;
const DIAM_ALTO = 70;
const LARGH_LUNGO = 90;
const SEDIA = 50;

export function areaUtile(spazioId: SpazioId, palco: boolean): Rettangolo {
	const s = spazio(spazioId);
	const p = palco ? PALCO : 0;
	return { x: MARGINE + p, y: MARGINE, w: s.w - 2 * MARGINE - p, h: s.d - 2 * MARGINE };
}

/** Metri quadri utili della zona tavoli. */
export function mqUtili(spazioId: SpazioId, palco: boolean): number {
	const a = areaUtile(spazioId, palco);
	return (a.w * a.h) / 10000;
}

// Griglia di tavoli rotondi o alti: prova passi sempre più stretti finché ci stanno tutti.
function griglia(
	area: Rettangolo,
	n: number,
	passoIdeale: number,
	passoMin: number,
	tipo: 'tondo' | 'alto',
	diam: number,
	posti: number,
): { elementi: Elemento[]; piazzati: number } {
	let passo = passoIdeale;
	let cols = Math.max(1, Math.floor(area.w / passo));
	let righe = Math.max(1, Math.floor(area.h / passo));
	while (cols * righe < n && passo > passoMin) {
		passo -= 10;
		cols = Math.max(1, Math.floor(area.w / passo));
		righe = Math.max(1, Math.floor(area.h / passo));
	}
	const usate = Math.min(righe, Math.ceil(n / cols));
	const totale = Math.min(n, cols * righe);
	const elementi: Elemento[] = [];
	const cx = area.x + area.w / 2;
	const cy = area.y + area.h / 2;
	let resto = totale;
	for (let r = 0; r < usate; r++) {
		const nella = Math.ceil(resto / (usate - r));
		resto -= nella;
		for (let c = 0; c < nella; c++) {
			elementi.push({
				id: `${tipo}-${elementi.length + 1}`,
				tipo,
				x: Math.round(cx + (c - (nella - 1) / 2) * passo),
				y: Math.round(cy + (r - (usate - 1) / 2) * passo),
				w: diam,
				h: diam,
				posti,
			});
		}
	}
	return { elementi, piazzati: totale };
}

export function dispone(spazioId: SpazioId, formatoId: Formato, ospiti: number, palco: boolean): Pianta {
	const s = spazio(spazioId);
	const area = areaUtile(spazioId, palco);
	const pRect: Rettangolo | null = palco ? { x: MARGINE, y: MARGINE, w: PALCO - 40, h: s.d - 2 * MARGINE } : null;
	let elementi: Elemento[] = [];
	let posti = 0;

	if (formatoId === 'tondi') {
		const n = Math.ceil(ospiti / 8);
		const g = griglia(area, n, 340, 300, 'tondo', DIAM_TONDO, 8);
		elementi = g.elementi;
		posti = Math.min(ospiti, g.piazzati * 8);
	} else if (formatoId === 'cocktail') {
		const n = Math.ceil(ospiti / 6);
		const g = griglia(area, n, 240, 200, 'alto', DIAM_ALTO, 6);
		elementi = g.elementi;
		posti = Math.min(ospiti, g.piazzati * 6);
	} else if (formatoId === 'imperiale') {
		const postiMaxRiga = Math.max(2, 2 * Math.floor(area.w / 60));
		const righeMax = Math.max(1, Math.floor(area.h / 270));
		const righe = Math.min(righeMax, Math.max(1, Math.ceil(ospiti / postiMaxRiga)));
		const perRiga = Math.ceil(Math.min(ospiti, righe * postiMaxRiga) / righe);
		const lung = Math.min(area.w, Math.ceil(perRiga / 2) * 60);
		const passo = Math.min(320, area.h / righe);
		const cy = area.y + area.h / 2;
		for (let r = 0; r < righe; r++) {
			elementi.push({
				id: `lungo-${r + 1}`,
				tipo: 'lungo',
				x: Math.round(area.x + area.w / 2),
				y: Math.round(cy + (r - (righe - 1) / 2) * passo),
				w: lung,
				h: LARGH_LUNGO,
				posti: 2 * Math.floor(lung / 60),
			});
		}
		posti = Math.min(ospiti, elementi.reduce((a, e) => a + e.posti, 0));
	} else {
		// cerimonia: file di sedie in due blocchi, corridoio centrale lungo la sala
		const perBlocco = Math.max(1, Math.floor((area.h - 120) / 2 / SEDIA));
		const file = Math.max(1, Math.floor((area.w - 200) / SEDIA));
		const servono = Math.ceil(ospiti / (2 * perBlocco));
		const n = Math.min(file, servono);
		const x0 = area.x + area.w / 2 - (n * SEDIA) / 2;
		const cy = area.y + area.h / 2;
		for (let i = 0; i < n; i++) {
			const x = Math.round(x0 + i * SEDIA + SEDIA / 2);
			for (const lato of [-1, 1]) {
				elementi.push({
					id: `fila-${i + 1}${lato < 0 ? 'a' : 'b'}`,
					tipo: 'fila',
					x,
					y: Math.round(cy + lato * (60 + (perBlocco * SEDIA) / 2)),
					w: SEDIA,
					h: perBlocco * SEDIA,
					posti: perBlocco,
				});
			}
		}
		posti = Math.min(ospiti, n * 2 * perBlocco);
	}

	return { w: s.w, d: s.d, area, palco: pRect, elementi, posti, fuori: Math.max(0, ospiti - posti) };
}

/** Pista da ballo: il rettangolo centrale che si libera dopo la cena. */
export function pista(p: Pianta): Rettangolo {
	const w = Math.min(900, p.area.w * 0.45);
	const h = Math.min(700, p.area.h * 0.8);
	return { x: p.area.x + p.area.w / 2 - w / 2, y: p.area.y + p.area.h / 2 - h / 2, w, h };
}

/** Posizione di un elemento mentre i tavoli si ritirano (t da 0 a 1) per fare posto alla pista. */
export function ritirato(e: Elemento, p: Pianta, t: number): { x: number; y: number } {
	if (t <= 0) return { x: e.x, y: e.y };
	const r = pista(p);
	const cx = r.x + r.w / 2;
	const cy = r.y + r.h / 2;
	const dx = e.x - cx;
	const dy = e.y - cy;
	// se è dentro la pista, va al bordo più vicino; fuori resta dov'è
	const dentroX = Math.abs(dx) < r.w / 2 + e.w / 2;
	const dentroY = Math.abs(dy) < r.h / 2 + e.h / 2;
	if (!(dentroX && dentroY)) return { x: e.x, y: e.y };
	const spX = (r.w / 2 + e.w / 2 + 40) * Math.sign(dx || 1);
	const spY = (r.h / 2 + e.h / 2 + 40) * Math.sign(dy || 1);
	const vaX = Math.abs(spX) - Math.abs(dx) < Math.abs(spY) - Math.abs(dy);
	const tx = vaX ? cx + spX : e.x;
	const ty = vaX ? e.y : cy + spY;
	const x = Math.min(p.w - e.w / 2 - 20, Math.max(e.w / 2 + 20, tx));
	const y = Math.min(p.d - e.h / 2 - 20, Math.max(e.h / 2 + 20, ty));
	return { x: e.x + (x - e.x) * t, y: e.y + (y - e.y) * t };
}
