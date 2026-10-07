// OBRA FINA — datos de ejemplo. Empresa, precios, plazos, barrios, reseñas y teléfono son de fantasía.
// Solo datos: nada de DOM, así el frontmatter de Astro y el navegador leen la misma fuente.

export const TEL = '+34960555013';
export const TEL_VISIBLE = '960 555 013';

export type Nivel = 0 | 1 | 2 | 3;

export const niveles = [
	{ n: 0, nombre: 'Sin obra', corto: 'Sin obra', d: 'Esta estancia se queda como está.', incluye: [] as string[] },
	{
		n: 1,
		nombre: 'Refresco',
		corto: 'Refresco',
		d: 'Para que se vea nueva sin levantar nada. Se puede vivir en casa.',
		incluye: ['Pintura o cal en paredes y techo', 'Reparación de grietas y humedades leves', 'Rodapiés y puntos de luz nuevos'],
	},
	{
		n: 2,
		nombre: 'Reforma',
		corto: 'Reforma',
		d: 'Cambia suelos, revestimientos y parte de las instalaciones.',
		incluye: ['Suelo nuevo (el que elijas en el muestrario)', 'Revestimientos y carpintería interior', 'Electricidad y fontanería de la estancia revisadas', 'Pintura o cal en dos manos'],
	},
	{
		n: 3,
		nombre: 'A fondo',
		corto: 'A fondo',
		d: 'Se vacía y se rehace: instalaciones nuevas, acabados de primera.',
		incluye: ['Derribos, albañilería y reparación de estructura', 'Instalaciones nuevas completas', 'Aislamiento térmico y acústico', 'Acabados de primera, cal a la llana'],
	},
] as const;

// Reparto del coste por capa de obra (estructura · instalaciones · acabados) según el nivel
export const reparto: Record<number, [number, number, number]> = {
	0: [0, 0, 0],
	1: [0.05, 0.1, 0.85],
	2: [0.2, 0.3, 0.5],
	3: [0.3, 0.3, 0.4],
};

export type Extra = { id: string; nombre: string; precio: number; por: 'fijo' | 'm2'; desde: Nivel; capa: 0 | 1 | 2 };

export type Estancia = {
	id: string;
	nombre: string;
	corto: string;
	m2: { min: number; max: number; def: number };
	precios: [number, number, number]; // €/m² por nivel 1, 2, 3 (sin IVA)
	dificultad: number; // multiplica los días de obra
	extras: Extra[];
	ini: { nivel: Nivel; m2: number; pared: string };
};

const elec: Extra = { id: 'elec', nombre: 'Instalación eléctrica nueva', precio: 38, por: 'm2', desde: 2, capa: 1 };
const clima: Extra = { id: 'clima', nombre: 'Aire acondicionado (split)', precio: 1450, por: 'fijo', desde: 1, capa: 1 };
const vent: Extra = { id: 'vent', nombre: 'Ventana de doble acristalamiento', precio: 790, por: 'fijo', desde: 1, capa: 2 };
const radiante: Extra = { id: 'rad', nombre: 'Suelo radiante', precio: 72, por: 'm2', desde: 3, capa: 1 };

export const estancias: Estancia[] = [
	{
		id: 'terraza',
		nombre: 'Azotea y terraza',
		corto: 'Terraza',
		m2: { min: 6, max: 40, def: 14 },
		precios: [60, 150, 260],
		dificultad: 0.9,
		extras: [
			{ id: 'imper', nombre: 'Impermeabilización y pendientes', precio: 34, por: 'm2', desde: 2, capa: 0 },
			{ id: 'perg', nombre: 'Pérgola de madera', precio: 2800, por: 'fijo', desde: 1, capa: 2 },
		],
		ini: { nivel: 0, m2: 14, pared: 'arena' },
	},
	{
		id: 'dorm2',
		nombre: 'Dormitorio 2',
		corto: 'Dormitorio 2',
		m2: { min: 7, max: 18, def: 10 },
		precios: [110, 230, 370],
		dificultad: 1,
		extras: [elec, clima, vent, radiante],
		ini: { nivel: 0, m2: 10, pared: 'tiza' },
	},
	{
		id: 'bano',
		nombre: 'Baño',
		corto: 'Baño',
		m2: { min: 3, max: 10, def: 5 },
		precios: [520, 1000, 1550],
		dificultad: 1.6,
		extras: [
			{ id: 'fonta', nombre: 'Fontanería nueva completa', precio: 1350, por: 'fijo', desde: 2, capa: 1 },
			{ id: 'plato', nombre: 'Plato de ducha y mampara a medida', precio: 950, por: 'fijo', desde: 2, capa: 2 },
			elec,
			radiante,
		],
		ini: { nivel: 2, m2: 5, pared: 'cal' },
	},
	{
		id: 'dorm1',
		nombre: 'Dormitorio principal',
		corto: 'Dormitorio',
		m2: { min: 9, max: 24, def: 14 },
		precios: [110, 235, 380],
		dificultad: 1,
		extras: [
			elec,
			clima,
			vent,
			radiante,
			{ id: 'vestidor', nombre: 'Armario empotrado a medida', precio: 2300, por: 'fijo', desde: 2, capa: 2 },
		],
		ini: { nivel: 0, m2: 14, pared: 'oliva' },
	},
	{
		id: 'entrada',
		nombre: 'Entrada y pasillo',
		corto: 'Entrada',
		m2: { min: 4, max: 20, def: 9 },
		precios: [90, 185, 310],
		dificultad: 0.9,
		extras: [elec, { id: 'puerta', nombre: 'Puerta de entrada blindada', precio: 1650, por: 'fijo', desde: 1, capa: 2 }],
		ini: { nivel: 0, m2: 9, pared: 'cal' },
	},
	{
		id: 'cocina',
		nombre: 'Cocina',
		corto: 'Cocina',
		m2: { min: 6, max: 20, def: 11 },
		precios: [380, 760, 1150],
		dificultad: 1.5,
		extras: [
			{ id: 'tabique', nombre: 'Abrir la cocina al salón (derribo de tabique)', precio: 1900, por: 'fijo', desde: 3, capa: 0 },
			{ id: 'fonta', nombre: 'Fontanería nueva completa', precio: 1350, por: 'fijo', desde: 2, capa: 1 },
			{ id: 'muebles', nombre: 'Muebles de cocina a medida', precio: 3200, por: 'fijo', desde: 2, capa: 2 },
			elec,
			vent,
		],
		ini: { nivel: 2, m2: 11, pared: 'arcilla' },
	},
	{
		id: 'salon',
		nombre: 'Salón comedor',
		corto: 'Salón',
		m2: { min: 12, max: 45, def: 24 },
		precios: [120, 260, 420],
		dificultad: 1,
		extras: [elec, clima, vent, radiante],
		ini: { nivel: 1, m2: 24, pared: 'cal' },
	},
];

export const paredes = [
	{ id: 'cal', nombre: 'Cal rosa', color: '#ecc9b1' },
	{ id: 'arcilla', nombre: 'Arcilla', color: '#c76a47' },
	{ id: 'oliva', nombre: 'Verde oliva', color: '#9a9c62' },
	{ id: 'arena', nombre: 'Arena', color: '#dfc79f' },
	{ id: 'tiza', nombre: 'Azul tiza', color: '#8497d9' },
	{ id: 'tabaco', nombre: 'Tabaco', color: '#8d5c3e' },
] as const;

// Baldosas hidráulicas: dibujos hechos a mano en SVG 80×80. `supl` = suplemento €/m² respecto al suelo base.
const C = { crema: '#efe3cf', arcilla: '#b9482a', sepia: '#241a14', tiza: '#2b49c8', oliva: '#59582b', ocre: '#d9a441', rosa: '#e4b9a0' };
const junta = `<rect width="80" height="80" fill="none" stroke="rgba(36,26,20,.28)" stroke-width="2"/>`;
const svg = (cuerpo: string) => `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">${cuerpo}${junta}</svg>`;

export const suelos = [
	{
		id: 'ruzafa',
		nombre: 'Ruzafa',
		dibujo: 'Estrella de ocho puntas',
		supl: 62,
		svg: svg(
			`<rect width="80" height="80" fill="${C.crema}"/><circle cx="0" cy="0" r="16" fill="${C.oliva}"/><circle cx="80" cy="0" r="16" fill="${C.oliva}"/><circle cx="0" cy="80" r="16" fill="${C.oliva}"/><circle cx="80" cy="80" r="16" fill="${C.oliva}"/><rect x="21" y="21" width="38" height="38" fill="${C.arcilla}"/><rect x="21" y="21" width="38" height="38" fill="${C.arcilla}" transform="rotate(45 40 40)"/><rect x="31" y="31" width="18" height="18" fill="${C.crema}" transform="rotate(45 40 40)"/><circle cx="40" cy="40" r="4" fill="${C.sepia}"/>`,
		),
	},
	{
		id: 'cabanyal',
		nombre: 'Cabanyal',
		dibujo: 'Rombos de proa',
		supl: 58,
		svg: svg(
			`<rect width="80" height="80" fill="${C.arcilla}"/><path d="M40 4 76 40 40 76 4 40Z" fill="${C.crema}"/><path d="M40 16 64 40 40 64 16 40Z" fill="${C.sepia}"/><path d="M40 28 52 40 40 52 28 40Z" fill="${C.arcilla}"/><path d="M0 0 14 0 0 14ZM80 0 66 0 80 14ZM0 80 14 80 0 66ZM80 80 66 80 80 66Z" fill="${C.crema}"/>`,
		),
	},
	{
		id: 'patacona',
		nombre: 'Patacona',
		dibujo: 'Damero de terracota',
		supl: 40,
		svg: svg(
			`<rect width="80" height="80" fill="${C.crema}"/><rect width="40" height="40" fill="${C.arcilla}"/><rect x="40" y="40" width="40" height="40" fill="${C.arcilla}"/><circle cx="20" cy="20" r="7" fill="${C.crema}"/><circle cx="60" cy="60" r="7" fill="${C.crema}"/><circle cx="60" cy="20" r="5" fill="${C.arcilla}"/><circle cx="20" cy="60" r="5" fill="${C.arcilla}"/>`,
		),
	},
	{
		id: 'turia',
		nombre: 'Turia',
		dibujo: 'Florón azul',
		supl: 74,
		svg: svg(
			`<rect width="80" height="80" fill="${C.crema}"/><g fill="none" stroke="${C.tiza}" stroke-width="5"><circle cx="40" cy="0" r="24"/><circle cx="40" cy="80" r="24"/><circle cx="0" cy="40" r="24"/><circle cx="80" cy="40" r="24"/></g><circle cx="40" cy="40" r="11" fill="${C.ocre}"/><circle cx="40" cy="40" r="4" fill="${C.tiza}"/>`,
		),
	},
	{
		id: 'benimaclet',
		nombre: 'Benimaclet',
		dibujo: 'Cuatrifolio de oliva',
		supl: 66,
		svg: svg(
			`<rect width="80" height="80" fill="${C.oliva}"/><g fill="${C.crema}"><circle cx="0" cy="0" r="30"/><circle cx="80" cy="0" r="30"/><circle cx="0" cy="80" r="30"/><circle cx="80" cy="80" r="30"/></g><g fill="${C.oliva}"><circle cx="0" cy="0" r="17"/><circle cx="80" cy="0" r="17"/><circle cx="0" cy="80" r="17"/><circle cx="80" cy="80" r="17"/></g><circle cx="40" cy="40" r="8" fill="${C.ocre}"/>`,
		),
	},
	{
		id: 'terrazo',
		nombre: 'Mercado',
		dibujo: 'Terrazo claro',
		supl: 96,
		svg: svg(
			`<rect width="80" height="80" fill="#e8dccb"/><g><path d="M8 14 20 8 24 20 12 24Z" fill="${C.arcilla}"/><path d="M50 10 62 14 58 26 46 20Z" fill="${C.oliva}"/><path d="M66 44 76 40 78 52 68 56Z" fill="${C.tiza}"/><path d="M14 52 28 48 30 62 16 66Z" fill="${C.sepia}"/><path d="M40 40 50 36 54 46 44 50Z" fill="${C.ocre}"/><path d="M30 24 36 22 38 30 32 32Z" fill="${C.rosa}"/><path d="M58 64 66 62 68 70 60 72Z" fill="${C.arcilla}"/><path d="M4 36 10 34 12 42 6 44Z" fill="${C.oliva}"/><path d="M42 68 50 66 52 74 44 76Z" fill="${C.sepia}"/></g>`,
		),
	},
	{
		id: 'albufera',
		nombre: 'Albufera',
		dibujo: 'Parquet de roble en damero',
		supl: 88,
		svg: svg(
			`<rect width="80" height="80" fill="#b98756"/><g stroke="#8a5e35" stroke-width="2"><path d="M0 20H40M0 40H40M0 60H40M40 0V40M60 0V40"/><path d="M40 60H80M40 40H80M40 80H80M40 40V80M60 40V80"/></g><g fill="#c99a68" opacity=".55"><rect x="2" y="2" width="36" height="16"/><rect x="42" y="42" width="36" height="16"/><rect x="42" y="2" width="16" height="36"/></g>`,
		),
	},
	{
		id: 'micro',
		nombre: 'Microcemento',
		dibujo: 'Continuo, sin juntas',
		supl: 70,
		svg: `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="3"/><feColorMatrix values="0 0 0 0 .55 0 0 0 0 .45 0 0 0 0 .38 0 0 0 .55 0"/></filter><rect width="80" height="80" fill="#cdb9a5"/><rect width="80" height="80" filter="url(#n)"/></svg>`,
	},
] as const;

export const suelo0 = 'ruzafa';

export const urlSvg = (s: string) => `url("data:image/svg+xml,${encodeURIComponent(s).replace(/'/g, '%27').replace(/"/g, '%22')}")`;

// Fases de la obra (el calendario las coloca según el alcance elegido)
export const fases = [
	{ id: 'visita', nombre: 'Visita y presupuesto cerrado', d: 'Medimos con láser, miramos instalaciones y te entregamos el presupuesto cerrado en 72 horas.' },
	{ id: 'licencia', nombre: 'Licencia y permisos', d: 'Proyecto técnico y licencia si hay estructura; comunicación previa al ayuntamiento si no.' },
	{ id: 'gruesa', nombre: 'Obra gruesa', d: 'Derribos, tabiques, rozas y todo lo que se tapa: lo que hace que aguante.' },
	{ id: 'instal', nombre: 'Instalaciones', d: 'Fontanería, electricidad y climatización, probadas antes de cerrar las paredes.' },
	{ id: 'fina', nombre: 'Obra fina', d: 'Suelos, alicatados, cal a la llana, carpintería y pintura: lo que se toca y se ve.' },
	{ id: 'entrega', nombre: 'Remates y entrega', d: 'Limpieza final, repaso con lista de defectos y entrega de llaves con garantía.' },
] as const;

export const barrios = ['Ruzafa', 'El Cabanyal', 'Benimaclet', 'Campanar', 'El Carmen', 'Patraix', 'Algirós', 'Otro barrio'];

export const resenas = [
	{
		texto: 'Nos dieron el presupuesto cerrado a los tres días y a final de obra pagamos exactamente eso. En el piso de mi madre no tocaron nada que no estuviera hablado.',
		quien: 'Marta y Jorge',
		donde: 'Piso en Ruzafa, 74 m²',
		nota: 'cocina y baño',
	},
	{
		texto: 'Se acabó el suelo hidráulico un viernes y el sábado ya estaban limpiando. El jefe de obra me mandaba una foto cada tarde, con la hora y con lo que faltaba.',
		quien: 'Familia Ibáñez',
		donde: 'Casa con patio, Benimaclet',
		nota: 'reforma integral',
	},
	{
		texto: 'Lo que más me convenció fue que me dijeran qué no hacía falta cambiar. Ahorramos un baño entero y el resultado es mejor.',
		quien: 'Lucía P.',
		donde: 'Ático en El Carmen',
		nota: 'refresco y terraza',
	},
];

export const compromisos = [
	{ t: 'Precio cerrado', d: 'El presupuesto es el precio. Si aparece algo que no estaba, lo asumimos nosotros; si tú quieres añadir algo, se firma antes.' },
	{ t: 'Fecha de entrega por escrito', d: 'Con penalización diaria si nos pasamos por culpa nuestra. Con calendario semanal que ya has visto arriba.' },
	{ t: 'Un solo responsable', d: 'Un jefe de obra con nombre y teléfono, que está en tu casa cada día y que responde en el mismo día.' },
	{ t: 'Obra limpia', d: 'Contenedor, protección de zonas comunes y limpieza al terminar cada jornada. Los vecinos también son clientes.' },
	{ t: 'Garantía por escrito', d: 'Un año en acabados, tres en instalaciones y diez en estructura. Y una visita de repaso a los tres meses, sin que la pidas.' },
];

// Días de visita: los próximos laborables a partir de mañana; algunas franjas ya ocupadas (determinista por fecha).
export const franjas = [
	{ id: 'm1', t: '10:00', n: 'Mañana' },
	{ id: 'm2', t: '12:30', n: 'Mañana' },
	{ id: 't1', t: '17:00', n: 'Tarde' },
	{ id: 't2', t: '18:30', n: 'Tarde' },
] as const;
