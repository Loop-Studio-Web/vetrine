// OBRA FINA — cuentas del presupuestador y del calendario, y las plantillas HTML de la hoja de obra y del diagrama.
// Sin DOM: lo usan el frontmatter de Astro (estado inicial ya pintado, sirve también sin JavaScript) y el navegador.
import { estancias, niveles, reparto, suelos, fases, type Nivel } from './datos';

export type EstadoEst = { nivel: Nivel; m2: number; extras: string[]; pared: string };
export type Estado = { estancias: Record<string, EstadoEst>; suelo: string };

export function estadoInicial(): Estado {
	const e: Estado = { estancias: {}, suelo: 'ruzafa' };
	for (const s of estancias) {
		e.estancias[s.id] = { nivel: s.ini.nivel, m2: s.ini.m2, extras: [], pared: s.ini.pared };
	}
	return e;
}

const eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, useGrouping: 'always' } as Intl.NumberFormatOptions);
export const euros = (n: number) => eur.format(Math.round(n));
export const num = (n: number) => new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 }).format(n);

// días de cuadrilla por estancia: fijo + por m², multiplicados por la dificultad
const diasBase = [0, 2, 5, 9];
const diasM2 = [0, 0.12, 0.35, 0.65];
// cuánto de esos días cae en cada fase (gruesa, instalaciones, fina)
const repDias: Record<number, [number, number, number]> = { 0: [0, 0, 0], 1: [0, 0.1, 0.9], 2: [0.2, 0.3, 0.5], 3: [0.35, 0.3, 0.35] };

export type Linea = {
	id: string;
	nombre: string;
	nivel: Nivel;
	m2: number;
	base: number;
	extras: { nombre: string; importe: number }[];
	total: number;
};

export type Fila = { id: string; nombre: string; ini: number; fin: number; activa: boolean; nota: string };

export type Resultado = {
	hay: boolean;
	lineas: Linea[];
	capas: [number, number, number]; // euros por capa (estructura, instalaciones, acabados)
	subtotal: number;
	gestion: number;
	licencia: { nombre: string; importe: number };
	contenedor: number;
	base: number;
	iva: number;
	total: number;
	rango: [number, number];
	semanas: number;
	filas: Fila[];
	vivir: 'si' | 'parcial' | 'no';
	estancias: number;
};

const medio = (x: number) => (x <= 0 ? 0 : Math.max(0.5, Math.round(x * 2) / 2));

export function calcular(e: Estado): Resultado {
	const suelo = suelos.find((s) => s.id === e.suelo) ?? suelos[0];
	const lineas: Linea[] = [];
	const capas: [number, number, number] = [0, 0, 0];
	let dG = 0,
		dI = 0,
		dF = 0;
	let hayN3 = false,
		hayN2 = false,
		tabique = false;
	let cocinaOBano2 = false;

	for (const def of estancias) {
		const st = e.estancias[def.id];
		if (!st || st.nivel === 0) continue;
		const nivel = st.nivel;
		if (nivel === 3) hayN3 = true;
		if (nivel >= 2) hayN2 = true;
		if ((def.id === 'cocina' || def.id === 'bano') && nivel >= 2) cocinaOBano2 = true;
		const base = def.precios[nivel - 1] * st.m2;
		const rep = reparto[nivel];
		capas[0] += base * rep[0];
		capas[1] += base * rep[1];
		capas[2] += base * rep[2];
		const extras: { nombre: string; importe: number }[] = [];
		let dias = diasBase[nivel] + st.m2 * diasM2[nivel];
		for (const x of def.extras) {
			if (!st.extras.includes(x.id) || x.desde > nivel) continue;
			const importe = x.por === 'm2' ? x.precio * st.m2 : x.precio;
			extras.push({ nombre: x.nombre, importe });
			capas[x.capa] += importe;
			dias += x.id === 'tabique' || x.id === 'fonta' || x.id === 'muebles' ? 2 : 1;
			if (x.id === 'tabique') tabique = true;
		}
		if (nivel >= 2 && def.id !== 'terraza') {
			const importe = suelo.supl * st.m2;
			extras.push({ nombre: `Suelo ${suelo.nombre} (suplemento)`, importe });
			capas[2] += importe;
		}
		dias *= def.dificultad;
		dG += dias * repDias[nivel][0];
		dI += dias * repDias[nivel][1];
		dF += dias * repDias[nivel][2];
		const total = base + extras.reduce((a, x) => a + x.importe, 0);
		lineas.push({ id: def.id, nombre: def.nombre, nivel, m2: st.m2, base, extras, total });
	}

	const hay = lineas.length > 0;
	const subtotal = lineas.reduce((a, l) => a + l.total, 0);
	const gestion = subtotal * 0.07;
	const licencia = hay
		? hayN3 || tabique
			? { nombre: 'Proyecto técnico, licencia de obra y tasas', importe: subtotal * 0.032 }
			: hayN2
				? { nombre: 'Comunicación previa al ayuntamiento', importe: 190 }
				: { nombre: 'Sin licencia: obra menor', importe: 0 }
		: { nombre: '', importe: 0 };

	// calendario: cuadrilla de dos, cinco días por semana
	const sem = (d: number) => d / 2 / 5;
	const g = medio(sem(dG));
	const i = medio(sem(dI));
	const f = medio(sem(dF));
	const L = !hay ? 0 : hayN3 || tabique ? 4 : hayN2 ? 1 : 0;
	const s0 = 1 + L;
	const iniI = s0 + g * 0.6;
	const finG = s0 + g;
	const finI = Math.max(iniI + i, finG);
	const finF = finI + f;
	const fin = finF + (hay ? 0.5 : 0);
	const filas: Fila[] = [
		{ id: 'visita', nombre: fases[0].nombre, ini: 0, fin: 1, activa: hay, nota: 'Semana 1' },
		{ id: 'licencia', nombre: fases[1].nombre, ini: 1, fin: 1 + L, activa: hay && L > 0, nota: L === 4 ? 'Licencia de obra' : L === 1 ? 'Comunicación previa' : 'No hace falta' },
		{ id: 'gruesa', nombre: fases[2].nombre, ini: s0, fin: finG, activa: hay && g > 0, nota: g > 0 ? '' : 'No hace falta' },
		{ id: 'instal', nombre: fases[3].nombre, ini: iniI, fin: iniI + i, activa: hay && i > 0, nota: i > 0 ? '' : 'No hace falta' },
		{ id: 'fina', nombre: fases[4].nombre, ini: finI, fin: finF, activa: hay && f > 0, nota: '' },
		{ id: 'entrega', nombre: fases[5].nombre, ini: finF, fin, activa: hay, nota: '' },
	];
	const semanasObra = g + i + f;
	const contenedor = hay ? 260 * Math.max(1, Math.ceil(semanasObra / 3)) : 0;

	const base = subtotal + gestion + licencia.importe + contenedor;
	const iva = base * 0.1;
	const total = base + iva;
	const r100 = (n: number) => Math.round(n / 100) * 100;
	return {
		hay,
		lineas,
		capas,
		subtotal,
		gestion,
		licencia,
		contenedor,
		base,
		iva,
		total,
		rango: [r100(total * 0.93), r100(total * 1.07)],
		semanas: hay ? Math.ceil(fin) : 0,
		filas,
		vivir: hayN3 ? 'no' : cocinaOBano2 ? 'parcial' : 'si',
		estancias: lineas.length,
	};
}

export const textoVivir = {
	si: 'Puedes seguir viviendo en casa: solo hay pintura y suelos puntuales.',
	parcial: 'Se puede vivir en casa: te dejamos una cocina y un baño provisionales los días críticos.',
	no: 'Mejor fuera de casa durante la obra gruesa: hay semanas sin cocina, baño ni agua.',
} as const;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

// Hoja de obra (el "recibo" de la obra): líneas por estancia, tres capas, gestión, IVA y total
export function hojaHtml(r: Resultado): string {
	if (!r.hay) {
		return `<p class="hoja__vacia">Elige una estancia y un nivel de obra. La hoja se rellena sola.</p>`;
	}
	const tot = r.capas[0] + r.capas[1] + r.capas[2] || 1;
	const pct = r.capas.map((c) => Math.round((c / tot) * 100));
	const lineas = r.lineas
		.map(
			(l) => `<li class="hoja__linea"><div class="hoja__fila"><span class="hoja__n">${esc(l.nombre)} <small>${niveles[l.nivel].corto} · ${num(l.m2)} m²</small></span><span class="hoja__i">${euros(l.base)}</span></div>${l.extras
				.map((x) => `<div class="hoja__fila hoja__fila--extra"><span class="hoja__n">+ ${esc(x.nombre)}</span><span class="hoja__i">${euros(x.importe)}</span></div>`)
				.join('')}</li>`,
		)
		.join('');
	return `<ul class="hoja__lineas">${lineas}</ul>
<div class="hoja__capas" role="img" aria-label="Reparto del coste: estructura ${pct[0]} por ciento, instalaciones ${pct[1]} por ciento, acabados ${pct[2]} por ciento">
<i style="flex:${r.capas[0] || 0.0001}" class="c0"></i><i style="flex:${r.capas[1] || 0.0001}" class="c1"></i><i style="flex:${r.capas[2] || 0.0001}" class="c2"></i></div>
<ul class="hoja__leyenda"><li><b class="c0"></b>Obra gruesa ${pct[0]} %</li><li><b class="c1"></b>Instalaciones ${pct[1]} %</li><li><b class="c2"></b>Obra fina ${pct[2]} %</li></ul>
<div class="hoja__sub">
<div class="hoja__fila"><span class="hoja__n">Suma de estancias</span><span class="hoja__i">${euros(r.subtotal)}</span></div>
<div class="hoja__fila"><span class="hoja__n">Jefe de obra y gestión (7 %)</span><span class="hoja__i">${euros(r.gestion)}</span></div>
${r.licencia.importe > 0 ? `<div class="hoja__fila"><span class="hoja__n">${esc(r.licencia.nombre)}</span><span class="hoja__i">${euros(r.licencia.importe)}</span></div>` : ''}
<div class="hoja__fila"><span class="hoja__n">Contenedor, protecciones y limpieza</span><span class="hoja__i">${euros(r.contenedor)}</span></div>
<div class="hoja__fila"><span class="hoja__n">IVA de reforma de vivienda (10 %)</span><span class="hoja__i">${euros(r.iva)}</span></div>
</div>
<div class="hoja__total"><span>Total estimado</span><strong data-total>${euros(r.total)}</strong></div>
<p class="hoja__rango">Con la visita lo cerramos. Hoy, entre <b>${euros(r.rango[0])}</b> y <b>${euros(r.rango[1])}</b>.</p>`;
}

const fmtFecha = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' });

// Primer lunes que cae al menos 14 días después de hoy, más el desfase elegido (días)
export function lunesInicio(desfase: number, hoy = new Date()): Date {
	const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 14 + desfase);
	const dia = (d.getDay() + 6) % 7; // 0 = lunes
	if (dia !== 0) d.setDate(d.getDate() + (7 - dia));
	return d;
}
export const sumaSemanas = (d: Date, s: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + Math.round(s * 7));
export const textoFecha = (d: Date) => fmtFecha.format(d).replace('.', '');

// Diagrama de barras de la obra: una fila por fase; las columnas son medias semanas
export function ganttHtml(r: Resultado, inicio?: Date): string {
	if (!r.hay) return `<p class="g__vacia">Elige alguna estancia en el presupuesto y aquí aparecerá tu obra, semana a semana.</p>`;
	const n = Math.max(4, r.semanas);
	const cols = n * 2;
	const paso = n > 18 ? 4 : n > 10 ? 2 : 1;
	const cab = Array.from({ length: n }, (_, i) => {
		const mostrar = i % paso === 0;
		const f = inicio ? `<small>${textoFecha(sumaSemanas(inicio, i))}</small>` : '';
		return `<span class="g__sem" style="grid-column:${2 + i * 2} / span 2">${mostrar ? `S${i + 1}${f}` : ''}</span>`;
	}).join('');
	const filas = r.filas
		.map((f, k) => {
			const d = fases.find((x) => x.id === f.id)!;
			const a = 2 + Math.round(f.ini * 2);
			const b = Math.max(a + 1, 2 + Math.round(f.fin * 2));
			const dur = f.fin - f.ini;
			const nota = f.activa ? (f.nota ? `${f.nota} · ` : '') + `${num(dur)} ${dur === 1 ? 'semana' : 'semanas'}` : f.nota || 'No hace falta';
			const barra = f.activa ? `<i class="g__barra g__barra--${f.id}" style="grid-column:${a} / ${b};--i:${k}"><span>${num(dur)} sem</span></i>` : '';
			return `<div class="g__fila${f.activa ? '' : ' g__fila--off'}" style="--cols:${cols}"><div class="g__etq"><b>${d.nombre}</b><small>${nota}</small></div>${barra}</div>`;
		})
		.join('');
	return `<div class="g__cab" style="--cols:${cols}"><span></span>${cab}</div>${filas}`;
}
