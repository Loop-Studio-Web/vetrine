// Mala Hierba — dati del banco e generatore del ramo in SVG.
// Modulo puro: lo usano il frontmatter (ramo iniziale già nel markup) e il browser (ogni scelta lo ridisegna).

export type FlorId = 'rosa' | 'gerbera' | 'cempasuchil' | 'girasol' | 'alcatraz' | 'clavel';
export type PaletaId = 'rosa' | 'cempasuchil' | 'blanco' | 'atardecer' | 'terciopelo' | 'cielo';
export type TamanoId = 'chico' | 'mediano' | 'grande' | 'cascada';
export type EnvolturaId = 'kraft' | 'china-fucsia' | 'china-turquesa' | 'tela';
export type OcasionId = 'boda' | 'xv' | 'bautizo' | 'cumple' | 'aniversario' | 'condolencias' | 'muertos';

export const FLORES: { id: FlorId; nombre: string; extra: number; nota: string }[] = [
	{ id: 'rosa', nombre: 'Rosa', extra: 160, nota: 'Rosa de Tabasco, de tallo largo' },
	{ id: 'gerbera', nombre: 'Gerbera', extra: 60, nota: 'Alegre y aguanta una semana' },
	{ id: 'cempasuchil', nombre: 'Cempasúchil', extra: 0, nota: 'De temporada, de Atlixco' },
	{ id: 'girasol', nombre: 'Girasol', extra: 40, nota: 'Grande y soleado' },
	{ id: 'alcatraz', nombre: 'Alcatraz', extra: 190, nota: 'Elegante, para bodas y duelo' },
	{ id: 'clavel', nombre: 'Clavel', extra: 20, nota: 'Rinde mucho y dura' },
];

export const PALETAS: { id: PaletaId; nombre: string; colores: string[]; nota: string }[] = [
	{ id: 'rosa', nombre: 'Rosa mexicano', colores: ['#e4007c', '#ff5ca8', '#ffb3d1', '#a30850'], nota: 'El de siempre' },
	{ id: 'cempasuchil', nombre: 'Cempasúchil', colores: ['#ff9a1f', '#ffc83d', '#e8590c', '#7a2e8e'], nota: 'Naranja con un morado' },
	{ id: 'blanco', nombre: 'Blanco y verde', colores: ['#ffffff', '#eef6ee', '#cfe8d5', '#8ccf9f'], nota: 'Calma, para despedidas y bodas' },
	{ id: 'atardecer', nombre: 'Bugambilia', colores: ['#ff6b4a', '#ffb347', '#ff8fb1', '#c2185b'], nota: 'Coral, durazno y fresa' },
	{ id: 'terciopelo', nombre: 'Cresta de gallo', colores: ['#6a1b9a', '#c2185b', '#e91e63', '#ffb300'], nota: 'Morado y granate, con un destello' },
	{ id: 'cielo', nombre: 'Agapando', colores: ['#8fc9f2', '#ffffff', '#c9b8ff', '#ffd6e8'], nota: 'Azul claro, para bautizos' },
];

export const TAMANOS: { id: TamanoId; nombre: string; tallos: number; precio: number; para: string }[] = [
	{ id: 'chico', nombre: 'Chico', tallos: 12, precio: 480, para: 'Para una mesa o un detalle' },
	{ id: 'mediano', nombre: 'Mediano', tallos: 24, precio: 780, para: 'El más pedido' },
	{ id: 'grande', nombre: 'Grande', tallos: 40, precio: 1180, para: 'Para recibir con las dos manos' },
	{ id: 'cascada', nombre: 'Cascada', tallos: 60, precio: 1650, para: 'Ramo de novia o de escenario' },
];

export const ENVOLTURAS: { id: EnvolturaId; nombre: string; color: string; moño: string; extra: number }[] = [
	{ id: 'kraft', nombre: 'Papel kraft', color: '#a9744a', moño: '#ffffff', extra: 0 },
	{ id: 'china-fucsia', nombre: 'Papel de china fucsia', color: '#e4007c', moño: '#ffc83d', extra: 0 },
	{ id: 'china-turquesa', nombre: 'Papel de china turquesa', color: '#12b5ad', moño: '#ff5ca8', extra: 0 },
	{ id: 'tela', nombre: 'Manta con listón', color: '#e8e2d4', moño: '#0e3b2b', extra: 40 },
];

export const OCASIONES: {
	id: OcasionId;
	nombre: string;
	paleta: PaletaId;
	flor: FlorId;
	tamano: TamanoId;
	dedicatoria: string;
	desde: number;
	frase: string;
}[] = [
	{ id: 'boda', nombre: 'Boda', paleta: 'blanco', flor: 'alcatraz', tamano: 'cascada', dedicatoria: 'Que les dure toda la vida.', desde: 1650, frase: 'Ramo de novia, arreglos de mesa y de iglesia' },
	{ id: 'xv', nombre: 'XV años', paleta: 'rosa', flor: 'rosa', tamano: 'grande', dedicatoria: 'Felices quince, princesa.', desde: 780, frase: 'Ramo, centros de mesa y el arco del vals' },
	{ id: 'bautizo', nombre: 'Bautizo', paleta: 'cielo', flor: 'clavel', tamano: 'mediano', dedicatoria: 'Bienvenido al mundo.', desde: 480, frase: 'Arreglos pequeños para la iglesia y la mesa' },
	{ id: 'cumple', nombre: 'Cumpleaños', paleta: 'atardecer', flor: 'gerbera', tamano: 'mediano', dedicatoria: 'Feliz cumpleaños, te quiero mucho.', desde: 480, frase: 'Ramos que se entregan el mismo día' },
	{ id: 'aniversario', nombre: 'Aniversario', paleta: 'terciopelo', flor: 'rosa', tamano: 'grande', dedicatoria: 'Otro año contigo.', desde: 780, frase: 'Rosas, sin tanto lío' },
	{ id: 'condolencias', nombre: 'Condolencias', paleta: 'blanco', flor: 'alcatraz', tamano: 'grande', dedicatoria: 'Con todo nuestro cariño y respeto.', desde: 1180, frase: 'Coronas y arreglos, entregados con discreción' },
	{ id: 'muertos', nombre: 'Día de Muertos', paleta: 'cempasuchil', flor: 'cempasuchil', tamano: 'mediano', dedicatoria: 'Aquí te seguimos esperando.', desde: 480, frase: 'Cempasúchil, cresta de gallo y arco de ofrenda' },
];

export const ENVIO = { domicilio: 90, gratisDesde: 1200 };

export type Eleccion = {
	flor: FlorId;
	paleta: PaletaId;
	tamano: TamanoId;
	envoltura: EnvolturaId;
	semilla: number;
};

export const precioRamo = (e: Eleccion) => {
	const t = TAMANOS.find((x) => x.id === e.tamano)!;
	const f = FLORES.find((x) => x.id === e.flor)!;
	const w = ENVOLTURAS.find((x) => x.id === e.envoltura)!;
	return t.precio + f.extra + w.extra;
};

export const pesos = (n: number) => `$${n.toLocaleString('es-MX')} MXN`;

// ───────────────────────── dibujo ─────────────────────────

const rng = (seed: number) => {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
};

const mix = (hex: string, to: string, f: number) => {
	const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
	const a = p(hex);
	const b = p(to);
	return '#' + a.map((v, i) => Math.round(v + (b[i] - v) * f).toString(16).padStart(2, '0')).join('');
};
const osc = (c: string, f = 0.28) => mix(c, '#2b0a1e', f);
const luz = (c: string, f = 0.3) => mix(c, '#ffffff', f);
const n1 = (v: number) => Math.round(v * 10) / 10;

type R = () => number;

const rosa = (x: number, y: number, r: number, c: string, rot: number, rand: R) => {
	let s = `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(rot)})">`;
	s += `<circle cx="2" cy="3" r="${n1(r)}" fill="#2b0a1e" opacity=".16"/>`;
	s += `<circle r="${n1(r)}" fill="${osc(c, 0.12)}"/>`;
	for (let i = 0; i < 6; i++) {
		const a = (i / 6) * Math.PI * 2 + rand() * 0.3;
		s += `<circle cx="${n1(Math.cos(a) * r * 0.62)}" cy="${n1(Math.sin(a) * r * 0.62)}" r="${n1(r * 0.42)}" fill="${c}"/>`;
	}
	s += `<circle r="${n1(r * 0.62)}" fill="${luz(c, 0.12)}"/>`;
	let d = '';
	for (let t = 0; t < Math.PI * 5; t += 0.4) {
		const rr = r * 0.06 + t * r * 0.045;
		d += `${d ? 'L' : 'M'}${n1(Math.cos(t) * rr)} ${n1(Math.sin(t) * rr)}`;
	}
	s += `<path d="${d}" fill="none" stroke="${osc(c, 0.45)}" stroke-width="${n1(Math.max(1.2, r * 0.07))}" stroke-linecap="round"/>`;
	return s + '</g>';
};

const gerbera = (x: number, y: number, r: number, c: string, rot: number, rand: R) => {
	let s = `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(rot)})">`;
	s += `<circle cx="2" cy="3" r="${n1(r)}" fill="#2b0a1e" opacity=".16"/>`;
	const n = 14;
	for (let i = 0; i < n; i++) {
		const a = (i / n) * 360 + rand() * 6;
		s += `<ellipse cx="0" cy="${n1(-r * 0.58)}" rx="${n1(r * 0.17)}" ry="${n1(r * 0.42)}" fill="${i % 2 ? c : luz(c, 0.12)}" transform="rotate(${n1(a)})"/>`;
	}
	s += `<circle r="${n1(r * 0.27)}" fill="${osc(c, 0.7)}"/><circle r="${n1(r * 0.15)}" fill="#ffc83d"/>`;
	return s + '</g>';
};

const cempasuchil = (x: number, y: number, r: number, c: string, rot: number, rand: R) => {
	let s = `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(rot)})">`;
	s += `<circle cx="2" cy="3" r="${n1(r)}" fill="#2b0a1e" opacity=".18"/>`;
	const anillos = [
		{ n: 11, d: 0.66, k: 0.3, col: osc(c, 0.18) },
		{ n: 8, d: 0.42, k: 0.3, col: c },
		{ n: 5, d: 0.18, k: 0.27, col: luz(c, 0.2) },
	];
	for (const a of anillos) {
		const off = rand() * 6;
		for (let i = 0; i < a.n; i++) {
			const t = (i / a.n) * Math.PI * 2 + off;
			s += `<circle cx="${n1(Math.cos(t) * r * a.d)}" cy="${n1(Math.sin(t) * r * a.d)}" r="${n1(r * a.k)}" fill="${a.col}"/>`;
		}
	}
	s += `<circle r="${n1(r * 0.2)}" fill="${luz(c, 0.35)}"/>`;
	return s + '</g>';
};

const girasol = (x: number, y: number, r: number, c: string, rot: number, rand: R) => {
	let s = `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(rot)})">`;
	s += `<circle cx="2" cy="3" r="${n1(r)}" fill="#2b0a1e" opacity=".16"/>`;
	const n = 17;
	for (let i = 0; i < n; i++) {
		const a = (i / n) * 360 + rand() * 5;
		s += `<path d="M0 ${n1(-r * 0.3)}C${n1(r * 0.28)} ${n1(-r * 0.55)} ${n1(r * 0.1)} ${n1(-r * 0.92)} 0 ${n1(-r)}C${n1(-r * 0.1)} ${n1(-r * 0.92)} ${n1(-r * 0.28)} ${n1(-r * 0.55)} 0 ${n1(-r * 0.3)}Z" fill="${i % 2 ? c : luz(c, 0.1)}" transform="rotate(${n1(a)})"/>`;
	}
	s += `<circle r="${n1(r * 0.4)}" fill="#4a2410"/><circle r="${n1(r * 0.28)}" fill="#6b3a18"/>`;
	for (let i = 0; i < 7; i++) {
		const t = rand() * Math.PI * 2;
		const d = rand() * r * 0.28;
		s += `<circle cx="${n1(Math.cos(t) * d)}" cy="${n1(Math.sin(t) * d)}" r="${n1(r * 0.04)}" fill="#2a1408"/>`;
	}
	return s + '</g>';
};

const alcatraz = (x: number, y: number, r: number, c: string, rot: number, _rand: R) => {
	const w = r * 0.85;
	let s = `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(rot)})">`;
	s += `<path d="M0 ${n1(r * 0.95)}C${n1(-w * 1.2)} ${n1(r * 0.3)} ${n1(-w * 1.1)} ${n1(-r * 0.7)} ${n1(-w * 0.1)} ${n1(-r)}C${n1(w * 0.9)} ${n1(-r * 0.7)} ${n1(w * 1.2)} ${n1(r * 0.3)} 0 ${n1(r * 0.95)}Z" fill="#2b0a1e" opacity=".16" transform="translate(2 3)"/>`;
	s += `<path d="M0 ${n1(r * 0.95)}C${n1(-w * 1.2)} ${n1(r * 0.3)} ${n1(-w * 1.1)} ${n1(-r * 0.7)} ${n1(-w * 0.1)} ${n1(-r)}C${n1(w * 0.9)} ${n1(-r * 0.7)} ${n1(w * 1.2)} ${n1(r * 0.3)} 0 ${n1(r * 0.95)}Z" fill="${c}"/>`;
	s += `<path d="M0 ${n1(r * 0.95)}C${n1(-w * 0.4)} ${n1(r * 0.2)} ${n1(-w * 0.35)} ${n1(-r * 0.5)} ${n1(-w * 0.08)} ${n1(-r * 0.95)}" fill="none" stroke="${osc(c, 0.3)}" stroke-width="1.6" stroke-linecap="round"/>`;
	s += `<rect x="${n1(-r * 0.1)}" y="${n1(-r * 0.3)}" width="${n1(r * 0.2)}" height="${n1(r * 0.75)}" rx="${n1(r * 0.1)}" fill="#ffc83d"/>`;
	return s + '</g>';
};

const clavel = (x: number, y: number, r: number, c: string, rot: number, rand: R) => {
	let s = `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(rot)})">`;
	s += `<circle cx="2" cy="3" r="${n1(r)}" fill="#2b0a1e" opacity=".16"/>`;
	const n = 10;
	for (let i = 0; i < n; i++) {
		const a = (i / n) * Math.PI * 2 + rand() * 0.2;
		s += `<circle cx="${n1(Math.cos(a) * r * 0.72)}" cy="${n1(Math.sin(a) * r * 0.72)}" r="${n1(r * 0.3)}" fill="${osc(c, 0.1)}"/>`;
	}
	for (let i = 0; i < 7; i++) {
		const a = (i / 7) * Math.PI * 2 + rand();
		s += `<circle cx="${n1(Math.cos(a) * r * 0.42)}" cy="${n1(Math.sin(a) * r * 0.42)}" r="${n1(r * 0.3)}" fill="${c}"/>`;
	}
	s += `<circle r="${n1(r * 0.28)}" fill="${luz(c, 0.25)}"/>`;
	return s + '</g>';
};

const DIBUJO: Record<FlorId, typeof rosa> = { rosa, gerbera, cempasuchil, girasol, alcatraz, clavel };
// las que tienen color propio no se tiñen con la paleta
const PROPIO: Partial<Record<FlorId, string[]>> = {
	cempasuchil: ['#ff9a1f', '#f27a0a', '#ffb52e'],
	girasol: ['#ffc21a', '#ffd23f', '#f5a800'],
};

const hoja = (x: number, y: number, len: number, ang: number, c: string) =>
	`<path d="M0 0C${n1(len * 0.3)} ${n1(-len * 0.22)} ${n1(len * 0.75)} ${n1(-len * 0.18)} ${n1(len)} 0C${n1(len * 0.75)} ${n1(len * 0.18)} ${n1(len * 0.3)} ${n1(len * 0.22)} 0 0Z" fill="${c}" transform="translate(${n1(x)} ${n1(y)}) rotate(${n1(ang)})"/>`;

const ATADO = { x: 200, y: 350 };

export const ramoSVG = (e: Eleccion, opts: { id?: string; animar?: boolean } = {}) => {
	const id = opts.id ?? 'mh';
	const rand = rng(e.semilla * 7919 + 13);
	const t = TAMANOS.find((x) => x.id === e.tamano)!;
	const pal = PALETAS.find((x) => x.id === e.paleta)!;
	const env = ENVOLTURAS.find((x) => x.id === e.envoltura)!;
	const N = t.tallos;
	const rx = 62 + Math.min(N, 60) * 1.45; // el ramo se ensancha con el tamaño
	const ry = 70 + Math.min(N, 60) * 1.1;
	const cx = 200;
	const cy = 330 - ry * 0.78;
	const radio = Math.max(17, Math.min(44, (rx * 1.18) / Math.sqrt(N)));

	// posiciones en filotaxis dentro de una elipse; las del borde van atrás
	const pts: { x: number; y: number; d: number }[] = [];
	const ang = 2.39996;
	for (let i = 0; i < N; i++) {
		const q = Math.sqrt((i + 0.6) / N);
		const a = i * ang + rand() * 0.25;
		pts.push({ x: cx + Math.cos(a) * rx * q * 0.92 + (rand() - 0.5) * 6, y: cy + Math.sin(a) * ry * q * 0.9 + (rand() - 0.5) * 6, d: q });
	}
	pts.sort((a, b) => b.d - a.d);

	const verde = ['#1f7a4d', '#2e9560', '#14603c', '#4aa874'];
	let bg = '';
	// hojas por detrás, hacia afuera
	const nh = Math.round(7 + N / 5);
	for (let i = 0; i < nh; i++) {
		const a = -Math.PI * (0.05 + 0.9 * rand());
		const dd = 0.78 + rand() * 0.3;
		const hx = cx + Math.cos(a) * rx * dd;
		const hy = cy + Math.sin(a) * ry * dd * 0.95 + ry * 0.15;
		const ang2 = (Math.atan2(hy - cy, hx - cx) * 180) / Math.PI + (rand() - 0.5) * 30;
		bg += hoja(hx - Math.cos((ang2 * Math.PI) / 180) * 12, hy - Math.sin((ang2 * Math.PI) / 180) * 12, 46 + rand() * 30, ang2, verde[Math.floor(rand() * 4)]);
	}
	// nubes de flor pequeña (velo de novia)
	let nube = '';
	for (let i = 0; i < 9; i++) {
		const a = rand() * Math.PI * 2;
		const dd = 0.55 + rand() * 0.5;
		const bx = cx + Math.cos(a) * rx * dd;
		const by = cy + Math.sin(a) * ry * dd * 0.9;
		for (let k = 0; k < 6; k++) nube += `<circle cx="${n1(bx + (rand() - 0.5) * 16)}" cy="${n1(by + (rand() - 0.5) * 16)}" r="${n1(1.8 + rand() * 1.6)}" fill="${i % 3 ? '#ffffff' : luz(pal.colores[2] ?? '#ffffff', 0.4)}"/>`;
	}

	let tallos = '';
	let flores = '';
	pts.forEach((p, i) => {
		// tres de cada cinco son la flor elegida; el resto la acompaña (el borde se dibuja primero, el centro al frente)
		let tipo: FlorId = e.flor;
		if (i % 5 >= 3) tipo = e.flor === 'cempasuchil' ? 'clavel' : (['clavel', 'gerbera', 'rosa'][Math.floor(rand() * 3)] as FlorId);
		const propios = PROPIO[tipo];
		const col = propios ? propios[Math.floor(rand() * propios.length)] : pal.colores[Math.floor(rand() * 3)];
		const r = radio * (0.82 + rand() * 0.34) * (1 - p.d * 0.12);
		tallos += `<path d="M${p.x.toFixed(1)} ${p.y.toFixed(1)}Q${((p.x + ATADO.x) / 2).toFixed(1)} ${((p.y + ATADO.y) / 2 + 14).toFixed(1)} ${ATADO.x + (rand() - 0.5) * 14} ${ATADO.y}" stroke="#1a5c38" stroke-width="3" fill="none" stroke-linecap="round"/>`;
		const anim = opts.animar ? ` class="mh-pop" style="--i:${i}"` : '';
		flores += `<g${anim}>${DIBUJO[tipo](p.x, p.y, r, col, rand() * 360, rand)}</g>`;
	});

	// envoltura: hoja trasera, tallos, flores, hoja delantera con borde ruidoso
	const colEnv = env.color;
	const cono = `M${n1(cx - rx * 0.62)} ${ATADO.y - 40}L${ATADO.x} 486L${n1(cx + rx * 0.62)} ${ATADO.y - 40}Z`;
	const frente = `M${n1(cx - rx * 0.66)} ${ATADO.y - 34}L${n1(cx - rx * 0.22)} ${ATADO.y - 58}L${ATADO.x} ${ATADO.y - 30}L${n1(cx + rx * 0.22)} ${ATADO.y - 58}L${n1(cx + rx * 0.66)} ${ATADO.y - 34}L${ATADO.x + 6} 490L${ATADO.x - 6} 490Z`;
	const filtro = `${id}-rough`;
	const moño = `<g transform="translate(${ATADO.x} ${ATADO.y + 10})"><path d="M0 0C-26 -22 -40 6 -20 12C-8 14 -2 6 0 0ZM0 0C26 -22 40 6 20 12C8 14 2 6 0 0Z" fill="${env.moño}"/><circle r="6" fill="${osc(env.moño, 0.2)}"/><path d="M-4 6L-14 36M4 6L14 36" stroke="${env.moño}" stroke-width="5" stroke-linecap="round"/></g>`;

	return (
		`<svg class="mh-ramo" viewBox="0 0 400 500" role="img" aria-label="Vista previa del ramo: ${t.tallos} tallos de ${FLORES.find((f) => f.id === e.flor)!.nombre.toLowerCase()} en ${pal.nombre.toLowerCase()}, envuelto en ${env.nombre.toLowerCase()}" xmlns="http://www.w3.org/2000/svg">` +
		`<defs><filter id="${filtro}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="${e.semilla % 90}"/><feDisplacementMap in="SourceGraphic" scale="5"/></filter></defs>` +
		`<g filter="url(#${filtro})"><path d="${cono}" fill="${osc(colEnv, 0.22)}"/></g>` +
		bg +
		tallos +
		nube +
		flores +
		`<g filter="url(#${filtro})"><path d="${frente}" fill="${colEnv}"/><path d="M${ATADO.x} ${ATADO.y - 30}L${ATADO.x} 488" stroke="${osc(colEnv, 0.3)}" stroke-width="2" opacity=".5"/></g>` +
		moño +
		`</svg>`
	);
};

/** Arco de ceremonia: flores a lo largo de una elipse, con hojas en medio. */
export const arcoSVG = (paleta: PaletaId, flor: FlorId, semilla: number) => {
	const rand = rng(semilla * 104729 + 7);
	const pal = PALETAS.find((x) => x.id === paleta)!;
	const rx = 150;
	const ry = 250;
	const cx = 200;
	const cy = 330;
	let hojas = '';
	let flores = '';
	const N = 46;
	for (let i = 0; i <= N; i++) {
		const t = Math.PI * (i / N);
		const base = i / N;
		// más densas en los extremos de arriba y en una "ceja" al lado izquierdo, como se arman de verdad
		const grosor = 0.55 + 0.45 * Math.sin(t) + (base < 0.3 ? 0.25 : 0);
		const x = cx - Math.cos(t) * rx;
		const y = cy - Math.sin(t) * ry;
		for (let k = 0; k < 2; k++) {
			const a = rand() * Math.PI * 2;
			hojas += hoja(x + Math.cos(a) * 14, y + Math.sin(a) * 14, 32 + rand() * 26, (a * 180) / Math.PI, ['#1f7a4d', '#2e9560', '#14603c'][Math.floor(rand() * 3)]);
		}
		const tipo: FlorId = i % 3 === 0 ? 'gerbera' : i % 5 === 0 ? 'clavel' : flor;
		const propios = PROPIO[tipo];
		const col = propios ? propios[Math.floor(rand() * propios.length)] : pal.colores[Math.floor(rand() * 3)];
		const r = (14 + rand() * 9) * grosor + 6;
		flores += DIBUJO[tipo](x + (rand() - 0.5) * 18, y + (rand() - 0.5) * 18, r, col, rand() * 360, rand);
	}
	const poste = (x: number) => `<rect x="${x - 4}" y="${cy - 8}" width="8" height="40" rx="3" fill="#6b3a18"/><rect x="${x - 16}" y="${cy + 28}" width="32" height="8" rx="3" fill="#3b1f0c"/>`;
	return (
		`<svg class="mh-arco" viewBox="0 0 400 380" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">` +
		poste(cx - rx) +
		poste(cx + rx) +
		`<path d="M${cx - rx} ${cy}A${rx} ${ry} 0 0 1 ${cx + rx} ${cy}" stroke="#6b3a18" stroke-width="7" fill="none"/>` +
		hojas +
		flores +
		`</svg>`
	);
};

/** Centro de mesa: un vaso bajo con flores en cúpula. */
export const centroSVG = (paleta: PaletaId, flor: FlorId, semilla: number) => {
	const rand = rng(semilla * 31337 + 3);
	const pal = PALETAS.find((x) => x.id === paleta)!;
	let hojas = '';
	let flores = '';
	for (let i = 0; i < 9; i++) {
		const a = -Math.PI * (i / 8);
		hojas += hoja(200 + Math.cos(a) * 70, 170 + Math.sin(a) * 52, 44 + rand() * 20, (a * 180) / Math.PI - 10 + rand() * 20, ['#1f7a4d', '#2e9560', '#14603c'][i % 3]);
	}
	const pos = [[200, 80, 40], [148, 112, 32], [252, 112, 32], [110, 160, 28], [290, 160, 28], [172, 150, 30], [228, 150, 30], [200, 126, 26]];
	pos.forEach(([x, y, r], i) => {
		const tipo: FlorId = i % 3 === 2 ? 'clavel' : flor;
		const propios = PROPIO[tipo];
		const col = propios ? propios[i % propios.length] : pal.colores[i % 3];
		flores += DIBUJO[tipo](x + (rand() - 0.5) * 6, y, r * (0.9 + rand() * 0.2), col, rand() * 360, rand);
	});
	return (
		`<svg class="mh-centro" viewBox="0 0 400 300" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">` +
		hojas +
		`<path d="M118 196h164l-14 70c-2 10-10 16-20 16h-96c-10 0-18-6-20-16z" fill="#e8e2d4"/><path d="M118 196h164" stroke="#2b0a1e" stroke-width="3" stroke-linecap="round"/>` +
		flores +
		`<path d="M132 214c20 8 40 10 68 10s48-2 68-10" fill="none" stroke="#12b5ad" stroke-width="5" stroke-linecap="round" opacity=".9"/></svg>`
	);
};
