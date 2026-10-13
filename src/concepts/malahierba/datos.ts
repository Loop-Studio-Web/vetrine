// Mala Hierba — datos de fantasía. Todo lo que aquí aparece (taller, precios, teléfono, reseñas) es inventado.

export const TALLER = {
	nombre: 'Mala Hierba Flores',
	ciudad: 'Guadalajara, Jal.',
	direccion: 'Calle Marsella 000, Col. Americana',
	telefono: '+52 33 0000 0000',
	whatsapp: 'https://wa.me/520000000000', // número de fantasía
	zona: 'America/Mexico_City',
};

// 0 = domingo. Horas en formato 24 h.
export const HORARIO: { dias: number[]; nombre: string; abre: number; cierra: number }[] = [
	{ dias: [1, 2, 3, 4, 5], nombre: 'Lunes a viernes', abre: 8, cierra: 20 },
	{ dias: [6], nombre: 'Sábado', abre: 8, cierra: 19 },
	{ dias: [0], nombre: 'Domingo', abre: 9, cierra: 15 },
];

/** Un solo formato de hora en todo el sitio: 24 h con "h" (de 9 a 12 h). */
export const h24 = (n: number) => `${n} h`;

/** Pedidos del mismo día: hasta esta hora (hora de México). */
export const CORTE_MISMO_DIA = 14;

export const FRANJAS = [
	{ ini: 9, fin: 12 },
	{ ini: 12, fin: 15 },
	{ ini: 15, fin: 18 },
];

export const TEMPORADA = {
	// Día de Muertos: 2 de noviembre
	mes: 10,
	dia: 2,
	pedirAntes: 28, // de octubre
	lista: [
		{ nombre: 'Mano de cempasúchil', nota: '12 piezas con tallo largo', precio: 95 },
		{ nombre: 'Cresta de gallo', nota: 'manojo, el morado de la ofrenda', precio: 60 },
		{ nombre: 'Kit de ofrenda', nota: 'cempasúchil, cresta y papel picado', precio: 620 },
		{ nombre: 'Arco de ofrenda 1.20 m', nota: 'armado, listo para colgar', precio: 1450 },
	],
};

export const MONTAJES = [
	{
		id: 'arco',
		titulo: 'Arco para la ceremonia',
		texto: 'Se arma en el lugar, con la flor de temporada que aguante el calor del salón. Incluye pasillo de pétalos si lo pides.',
		desde: 4800,
		unidad: 'desde',
	},
	{
		id: 'centros',
		titulo: 'Centros de mesa',
		texto: 'En vaso bajo para que se vean los invitados de enfrente. Mínimo ocho; los de más se hacen en el mismo taller.',
		desde: 350,
		unidad: 'por mesa, desde',
	},
	{
		id: 'tapetes',
		titulo: 'Tapetes y altares de flor',
		texto: 'Para atrios, procesiones y ofrendas. Se trabaja con la parroquia o la familia para medidas y dibujo.',
		desde: 2400,
		unidad: 'desde',
	},
];

export const PASOS = [
	{ n: '1', t: 'Armas tu ramo', d: 'Eliges ocasión, tamaño, flor y colores. Ves cómo queda y cuánto cuesta antes de escribirnos.' },
	{ n: '2', t: 'Te confirmamos por WhatsApp', d: 'Revisamos que la flor esté fresca para tu fecha y te pasamos la liga de pago o los datos de transferencia.' },
	{ n: '3', t: 'Lo recibes o lo recoges', d: 'Entregamos en la ciudad en la franja que elegiste, con tarjeta escrita a mano. O pasas al taller.' },
];

export const PREGUNTAS = [
	{ q: '¿Hasta qué hora puedo pedir para hoy?', a: 'Hasta las 14 h, de lunes a sábado, y siempre que la flor que elegiste esté en el taller. Si no está, te proponemos una igual de linda por el mismo precio.' },
	{ q: '¿Cuánto cuesta el envío?', a: '$90 dentro de Guadalajara, Zapopan y Tlaquepaque. Gratis en pedidos desde $1,200. Para otras zonas te cotizamos por WhatsApp.' },
	{ q: '¿Puedo cambiar o cancelar mi pedido?', a: 'Sí, hasta 24 horas antes. Después ya compramos y cortamos la flor, y solo podemos cambiar la dedicatoria y la hora.' },
];

export const RESENAS = [
	{
		texto:
			'Mi abuela compraba su cempasúchil siempre en el mismo puesto del mercado y este año ya no pudo ir. Armé la ofrenda con el kit y la cresta de gallo. Cuando abrí la caja olía a ella. Les escribí para darles las gracias y me contestaron con un audio.',
		quien: 'Rodrigo, Tlaquepaque',
		dato: 'Kit de ofrenda, Día de Muertos',
	},
	{ texto: 'Lo pedí desde el camión y le llegó a mi mamá antes de la comida. La tarjeta, con su letra chueca y todo.', quien: 'Ximena, Providencia', dato: 'Ramo mediano de gerbera' },
	{ texto: 'Arco y 18 centros de mesa para la boda en el jardín. A las cinco de la tarde, con 34 grados, seguían perfectos.', quien: 'Daniela y Julio, Tlajomulco', dato: 'Arco y centros de mesa' },
];

/** Número de folio de fantasía a partir del contenido y la hora. */
export const folio = (s: string) => {
	let h = 0;
	for (const c of s + Date.now()) h = (h * 31 + c.charCodeAt(0)) >>> 0;
	return `MH-${String(h % 9000 + 1000)}`;
};
