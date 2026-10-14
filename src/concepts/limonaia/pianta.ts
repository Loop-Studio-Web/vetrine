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

const GIOCO_PISTA = 20;

/** Pista da ballo: il rettangolo centrale che si libera dopo la cena. */
function pistaIn(area: Rettangolo): Rettangolo {
	const w = Math.min(900, area.w * 0.4);
	const h = Math.min(700, area.h * 0.8);
	return { x: area.x + area.w / 2 - w / 2, y: area.y + area.h / 2 - h / 2, w, h };
}

/**
 * Disposizione dei tavoli. Con `notte` la pista è un'area esclusa: i tavoli si dispongono nelle due fasce ai lati
 * (e quelli lunghi si dimezzano), così non si sovrappongono mai. La cerimonia non ha pista.
 */
export function dispone(spazioId: SpazioId, formatoId: Formato, ospiti: number, palco: boolean, notte = false): Pianta {
	const s = spazio(spazioId);
	const area = areaUtile(spazioId, palco);
	const pRect: Rettangolo | null = palco ? { x: MARGINE, y: MARGINE, w: PALCO - 40, h: s.d - 2 * MARGINE } : null;
	let elementi: Elemento[] = [];
	let posti = 0;
	const conPista = notte && formatoId !== 'cerimonia';
	const pr = pistaIn(area);
	const fasciaW = Math.max(0, area.w / 2 - pr.w / 2 - GIOCO_PISTA);
	const sx: Rettangolo = { x: area.x, y: area.y, w: fasciaW, h: area.h };
	const dx: Rettangolo = { x: pr.x + pr.w + GIOCO_PISTA, y: area.y, w: fasciaW, h: area.h };

	if (conPista && (formatoId === 'tondi' || formatoId === 'cocktail')) {
		const tondo = formatoId === 'tondi';
		const n = Math.ceil(ospiti / (tondo ? 8 : 6));
		const nSx = Math.ceil(n / 2);
		const opt = tondo ? ([340, 300, 'tondo', DIAM_TONDO, 8] as const) : ([240, 200, 'alto', DIAM_ALTO, 6] as const);
		const a = griglia(sx, nSx, opt[0], opt[1], opt[2], opt[3], opt[4]);
		const b = griglia(dx, n - nSx, opt[0], opt[1], opt[2], opt[3], opt[4]);
		elementi = [...a.elementi, ...b.elementi].map((e, i) => ({ ...e, id: `${opt[2]}-${i + 1}` }));
		posti = Math.min(ospiti, (a.piazzati + b.piazzati) * opt[4]);
	} else if (conPista && formatoId === 'imperiale') {
		const postiMaxRiga = Math.max(2, 2 * Math.floor(fasciaW / 60)) * 2;
		const righeMax = Math.max(1, Math.floor(area.h / 270));
		const righe = Math.min(righeMax, Math.max(1, Math.ceil(ospiti / postiMaxRiga)));
		const perMeta = Math.ceil(Math.min(ospiti, righe * postiMaxRiga) / righe / 2);
		const lung = Math.max(120, Math.min(fasciaW, Math.ceil(perMeta / 2) * 60));
		const passo = Math.min(320, area.h / righe);
		const cy = area.y + area.h / 2;
		for (let r = 0; r < righe; r++) {
			const y = Math.round(cy + (r - (righe - 1) / 2) * passo);
			const w = Math.floor(lung / 60) * 60;
			for (const [lato, rect] of [['a', sx], ['b', dx]] as const) {
				elementi.push({ id: `lungo-${r + 1}${lato}`, tipo: 'lungo', x: Math.round(rect.x + rect.w / 2), y, w, h: LARGH_LUNGO, posti: 2 * Math.floor(w / 60) });
			}
		}
		posti = Math.min(ospiti, elementi.reduce((a, e) => a + e.posti, 0));
	} else if (formatoId === 'tondi') {
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

/** La pista di una pianta, per disegnarla. */
export function pista(p: Pianta): Rettangolo {
	return pistaIn(p.area);
}
