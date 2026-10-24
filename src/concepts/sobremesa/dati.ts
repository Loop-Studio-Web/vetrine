// Dati di fantasia di Sobremesa (negozio-rivista inventato). Prezzi in pesos argentini, tutti "de ejemplo".
import fotoLampara from '../../assets/sobremesa/objetos/lampara-naranja.jpg';
import fotoJarra from '../../assets/sobremesa/objetos/jarra-gres.jpg';
import fotoVasos from '../../assets/sobremesa/objetos/vasos-4.jpg';
import fotoMantel from '../../assets/sobremesa/objetos/lino-colores.jpg';
import fotoPlato from '../../assets/sobremesa/objetos/plato-gres.jpg';
import fotoTabla from '../../assets/sobremesa/objetos/tabla-madera.jpg';
import fotoVela from '../../assets/sobremesa/objetos/vela-bronce.jpg';
import fotoFlorero from '../../assets/sobremesa/objetos/florero-gres.jpg';
import tallerAlfareria from '../../assets/sobremesa/talleres/alfareria.jpg';
import tallerVidrio from '../../assets/sobremesa/talleres/vidrio.jpg';
import tallerTelar from '../../assets/sobremesa/talleres/telar.jpg';
import historia1 from '../../assets/sobremesa/plates/story-1-photo.png';
import historia2 from '../../assets/sobremesa/plates/story-2-photo.png';
import escena from '../../assets/sobremesa/plates/scena.png';

export const PRECIO_ENVIO_GRATIS = 150000;

export const pesos = (n: number) => `$${n.toLocaleString('es-AR')}`;

export type Color = 'amarillo' | 'rojo' | 'cobalto' | 'blanco' | 'negro';

export type Objeto = {
	id: string;
	nombre: string;
	precio: number;
	/** una frase, escrita como la diría la revista */
	frase: string;
	taller: string;
	dias: number;
	stock: number;
	color: Color;
	foto: ImageMetadata;
	/** cuántas columnas ocupa en el estante (variar el ritmo, no repetir tarjetas iguales) */
	ancho: 3 | 4 | 5;
};

export const OBJETOS: Objeto[] = [
	{
		id: 'lampara-chapa',
		nombre: 'Lámpara de chapa',
		precio: 84000,
		frase: 'Cúpula de chapa esmaltada, como las de los talleres. Cuelga a 70 cm de la mesa.',
		taller: 'Chapería Boedo',
		dias: 14,
		stock: 6,
		color: 'amarillo',
		foto: fotoLampara,
		ancho: 5,
	},
	{
		id: 'jarra-gres',
		nombre: 'Jarra de gres',
		precio: 48900,
		frase: 'Un litro y medio de gres esmaltado a mano; el esmalte nunca sale igual.',
		taller: 'Taller Ñandú',
		dias: 12,
		stock: 3,
		color: 'negro',
		foto: fotoJarra,
		ancho: 3,
	},
	{
		id: 'vasos-4',
		nombre: 'Vasos ×4',
		precio: 36500,
		frase: 'Cuatro vasos de vidrio soplado, verde apenas. Aguantan el lavavajillas.',
		taller: 'Vidriería Santa Ana',
		dias: 9,
		stock: 11,
		color: 'rojo',
		foto: fotoVasos,
		ancho: 4,
	},
	{
		id: 'mantel-lino',
		nombre: 'Mantel de lino',
		precio: 62000,
		frase: 'Lino lavado, 1,60 × 2,40 m, con la raya azul del telar. Seis colores.',
		taller: 'Telar La Quinta',
		dias: 20,
		stock: 5,
		color: 'blanco',
		foto: fotoMantel,
		ancho: 4,
	},
	{
		id: 'plato-gres',
		nombre: 'Plato llano de gres',
		precio: 18400,
		frase: 'Veintiocho centímetros de borde pardo; va del horno a la mesa.',
		taller: 'Taller Ñandú',
		dias: 12,
		stock: 14,
		color: 'cobalto',
		foto: fotoPlato,
		ancho: 3,
	},
	{
		id: 'tabla-lenga',
		nombre: 'Tabla de lenga',
		precio: 27800,
		frase: 'Lenga maciza, aceitada con cera de abeja. Se usa de los dos lados.',
		taller: 'Carpintería Lenga',
		dias: 7,
		stock: 8,
		color: 'blanco',
		foto: fotoTabla,
		ancho: 5,
	},
	{
		id: 'candelero-bronce',
		nombre: 'Candelero de bronce',
		precio: 22600,
		frase: 'Bronce fundido a la cera perdida, con una vela de abeja de regalo.',
		taller: 'Cerería del Sur',
		dias: 10,
		stock: 4,
		color: 'rojo',
		foto: fotoVela,
		ancho: 3,
	},
	{
		id: 'florero-gres',
		nombre: 'Florero de gres negro',
		precio: 41200,
		frase: 'Gres negro, cuello angosto. Vive bien con flores secas y con nada.',
		taller: 'Taller Ñandú',
		dias: 12,
		stock: 2,
		color: 'cobalto',
		foto: fotoFlorero,
		ancho: 4,
	},
];

export const porId = (id: string) => OBJETOS.find((o) => o.id === id);

export const COLOR: Record<Color, { fondo: string; tinta: string; filete: string }> = {
	amarillo: { fondo: '#e8b414', tinta: '#0b1e64', filete: '#f6d25a' },
	rojo: { fondo: '#a82a1a', tinta: '#ffffff', filete: '#d9523f' },
	cobalto: { fondo: '#06236b', tinta: '#eef0f7', filete: '#3a63c4' },
	blanco: { fondo: '#d6d1ca', tinta: '#0b1e64', filete: '#ffffff' },
	negro: { fondo: '#14161a', tinta: '#eef0f7', filete: '#5a5f68' },
};

// Los cuatro objetos de "La mesa larga de Caro y Mati" que cuelgan de la foto de la portada.
export const OBJETOS_MESA = ['lampara-chapa', 'jarra-gres', 'vasos-4', 'mantel-lino'].map((id) => porId(id)!);

export const HISTORIAS = [
	{ id: 'cocina-de-pasillo', titulo: ['COCINA', 'DE PASILLO'], seccion: 'Historias', minutos: 5 },
	{ id: 'un-domingo-de-lino', titulo: ['UN DOMINGO', 'DE LINO'], seccion: 'Objetos', minutos: 4 },
];

export const TALLERES = [
	{
		id: 'alfareria',
		nombre: 'Taller Ñandú',
		oficio: 'Alfarería de gres',
		lugar: 'Tigre, Buenos Aires',
		texto: 'Tres personas, un horno de gas y una regla: nada sale dos veces igual. Hacen la jarra, el plato y el florero.',
		foto: tallerAlfareria,
		dias: 12,
	},
	{
		id: 'vidrio',
		nombre: 'Vidriería Santa Ana',
		oficio: 'Vidrio soplado',
		lugar: 'Avellaneda, Buenos Aires',
		texto: 'Soplan los lunes y los jueves, cuando el horno está parejo. Los vasos salen con una burbuja que no se corrige.',
		foto: tallerVidrio,
		dias: 9,
	},
	{
		id: 'telar',
		nombre: 'Telar La Quinta',
		oficio: 'Lino tejido a mano',
		lugar: 'Gualeguaychú, Entre Ríos',
		texto: 'Un telar de pedales heredado y lino del campo. La raya azul es de la casa, igual que el apuro de nunca tenerlo.',
		foto: tallerTelar,
		dias: 20,
	},
];

export const ZONAS = [
	{ id: 'caba', nombre: 'CABA y Gran Buenos Aires', dias: '2 a 3 días', costo: 4900 },
	{ id: 'bsas', nombre: 'Resto de Buenos Aires', dias: '3 a 5 días', costo: 7200 },
	{ id: 'litoral', nombre: 'Córdoba, Santa Fe y Entre Ríos', dias: '4 a 6 días', costo: 8900 },
	{ id: 'norte-cuyo', nombre: 'Cuyo y Noroeste', dias: '5 a 8 días', costo: 11800 },
	{ id: 'patagonia', nombre: 'Patagonia', dias: '7 a 10 días', costo: 14500 },
];

export const CUOTAS = [3, 6, 12];

export type Numero = { n: number; titulo: string; estacion: string; foto: ImageMetadata; indice: string[] };

export const NUMEROS: Numero[] = [
	{ n: 7, titulo: 'La mesa larga', estacion: 'Otoño', foto: escena, indice: ['La mesa larga de Caro y Mati', 'Cocina de pasillo', 'Un domingo de lino'] },
	{ n: 6, titulo: 'El gres', estacion: 'Invierno', foto: fotoJarra, indice: ['Las manos del Taller Ñandú', 'Platos que se heredan', 'Qué se hornea en un horno de gas'] },
	{ n: 5, titulo: 'Vidrio', estacion: 'Primavera', foto: tallerVidrio, indice: ['Lunes de soplado en Avellaneda', 'Vasos que no se rompen (casi)', 'La burbuja es la firma'] },
	{ n: 4, titulo: 'Lino', estacion: 'Verano', foto: fotoMantel, indice: ['Un telar de pedales', 'Cómo lavar un mantel de lino', 'Seis colores, una raya'] },
	{ n: 3, titulo: 'Cocinar para muchos', estacion: 'Otoño', foto: historia1, indice: ['Doce en una mesa de seis', 'La olla que sirve para todo', 'Postres de sobremesa'] },
	{ n: 2, titulo: 'Luz de chapa', estacion: 'Invierno', foto: fotoLampara, indice: ['Lámparas de taller en casas de familia', 'Cuánta luz para comer', 'Chapa esmaltada, un oficio que se va'] },
];

export const PASOS_PEDIDO = ['Confirmado', 'En el taller', 'En camino', 'Entregado'];
