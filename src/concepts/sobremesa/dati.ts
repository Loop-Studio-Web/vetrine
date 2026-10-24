// Dati di fantasia di Sobremesa (negozio-rivista inventato). Prezzi in pesos argentini, tutti "de ejemplo".
import fotoLampara from '../../assets/sobremesa/objetos/lampara-naranja.jpg';
import fotoJarra from '../../assets/sobremesa/objetos/jarra-gres.jpg';
import fotoVasos from '../../assets/sobremesa/objetos/vasos-4.jpg';
import fotoMantel from '../../assets/sobremesa/objetos/lino-colores.jpg';
import fotoPlato from '../../assets/sobremesa/objetos/plato-gres.jpg';
import fotoTabla from '../../assets/sobremesa/objetos/tabla-madera.jpg';
import fotoVela from '../../assets/sobremesa/objetos/vela-bronce.jpg';
import fotoFlorero from '../../assets/sobremesa/objetos/florero-gres.jpg';
import fotoAros from '../../assets/sobremesa/objetos/aros-par.jpg';
import fotoMadera from '../../assets/sobremesa/objetos/madera-par.jpg';
import fotoMaceta from '../../assets/sobremesa/objetos/maceta-eucalipto.jpg';
import fotoVelaAmbar from '../../assets/sobremesa/objetos/vela-ambar.jpg';
import fotoVelaAlta from '../../assets/sobremesa/objetos/vela-alta.jpg';
import fotoVelaCobre from '../../assets/sobremesa/objetos/vela-cobre.jpg';
import fAlmohadonCrudo from '../../assets/sobremesa/objetos/almohadon.jpg';
import fAlmohadonCobalto from '../../assets/sobremesa/objetos/almohadon-cobalto.jpg';
import fAlmohadonRojo from '../../assets/sobremesa/objetos/almohadon-rojo.jpg';
import fAlmohadonAmarillo from '../../assets/sobremesa/objetos/almohadon-amarillo.jpg';
import fAlmohadonNegro from '../../assets/sobremesa/objetos/almohadon-negro.jpg';
import fTazaCrudo from '../../assets/sobremesa/objetos/taza.jpg';
import fTazaCobalto from '../../assets/sobremesa/objetos/taza-cobalto.jpg';
import fTazaRojo from '../../assets/sobremesa/objetos/taza-rojo.jpg';
import fTazaAmarillo from '../../assets/sobremesa/objetos/taza-amarillo.jpg';
import fTazaNegro from '../../assets/sobremesa/objetos/taza-negro.jpg';
import fBolsoCrudo from '../../assets/sobremesa/objetos/bolso.jpg';
import fBolsoCobalto from '../../assets/sobremesa/objetos/bolso-cobalto.jpg';
import fBolsoRojo from '../../assets/sobremesa/objetos/bolso-rojo.jpg';
import fBolsoAmarillo from '../../assets/sobremesa/objetos/bolso-amarillo.jpg';
import fBolsoNegro from '../../assets/sobremesa/objetos/bolso-negro.jpg';
import fBancoCrudo from '../../assets/sobremesa/objetos/banco.jpg';
import fBancoCobalto from '../../assets/sobremesa/objetos/banco-cobalto.jpg';
import fBancoRojo from '../../assets/sobremesa/objetos/banco-rojo.jpg';
import fBancoAmarillo from '../../assets/sobremesa/objetos/banco-amarillo.jpg';
import fBancoNegro from '../../assets/sobremesa/objetos/banco-negro.jpg';
import fLamparaPieCrudo from '../../assets/sobremesa/objetos/lampara-pie.jpg';
import fLamparaPieCobalto from '../../assets/sobremesa/objetos/lampara-pie-cobalto.jpg';
import fLamparaPieRojo from '../../assets/sobremesa/objetos/lampara-pie-rojo.jpg';
import fLamparaPieAmarillo from '../../assets/sobremesa/objetos/lampara-pie-amarillo.jpg';
import fLamparaPieNegro from '../../assets/sobremesa/objetos/lampara-pie-negro.jpg';
import fCacerolaCrudo from '../../assets/sobremesa/objetos/cacerola.jpg';
import fCacerolaCobalto from '../../assets/sobremesa/objetos/cacerola-cobalto.jpg';
import fCacerolaRojo from '../../assets/sobremesa/objetos/cacerola-rojo.jpg';
import fCacerolaAmarillo from '../../assets/sobremesa/objetos/cacerola-amarillo.jpg';
import fCacerolaNegro from '../../assets/sobremesa/objetos/cacerola-negro.jpg';
import fRepasadorCrudo from '../../assets/sobremesa/objetos/repasador.jpg';
import fRepasadorCobalto from '../../assets/sobremesa/objetos/repasador-cobalto.jpg';
import fRepasadorRojo from '../../assets/sobremesa/objetos/repasador-rojo.jpg';
import fRepasadorAmarillo from '../../assets/sobremesa/objetos/repasador-amarillo.jpg';
import fRepasadorNegro from '../../assets/sobremesa/objetos/repasador-negro.jpg';
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
	/** la foto del estante no es el objeto de la escena de la portada (lámpara y jarra) */
	ilustrativa?: boolean;
	color: Color;
	foto: ImageMetadata;
	/** cuántas columnas ocupa en el estante (variar el ritmo, no repetir tarjetas iguales); los del depósito no lo usan */
	ancho?: 3 | 4 | 5;
	/** el mismo objeto en otros colores: la primera es la que se ve al entrar; `color` es el de la lámina de esa foto */
	variantes?: Variante[];
	/** categoría del depósito (los filtros del cajón); los ocho del estante no la usan */
	categoria?: Categoria;
};

export type Categoria = 'mesa-cocina' | 'luz' | 'textiles' | 'plantas';
export const CATEGORIAS: { id: Categoria; nombre: string }[] = [
	{ id: 'mesa-cocina', nombre: 'Mesa y cocina' },
	{ id: 'luz', nombre: 'Luz' },
	{ id: 'textiles', nombre: 'Textiles' },
	{ id: 'plantas', nombre: 'Plantas y flores' },
];
export const FRANJAS = [
	{ id: 'bajo', nombre: 'Hasta $20.000', hasta: 20000 },
	{ id: 'medio', nombre: '$20.000 a $60.000', hasta: 60000 },
	{ id: 'alto', nombre: 'Más de $60.000', hasta: Infinity },
];
export const franja = (precio: number) => FRANJAS.find((f) => precio <= f.hasta)!.id;
export const slug = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export type Variante = { color: Color; foto: ImageMetadata };
export const NOMBRE_COLOR: Record<Color, string> = { blanco: 'crudo', cobalto: 'cobalto', rojo: 'rojo', amarillo: 'amarillo', negro: 'negro' };
export const clave = (id: string, color?: Color) => (color ? `${id}~${color}` : id);
const variantes = (pref: Record<Color, ImageMetadata>, orden: Color[]): Variante[] => orden.map((color) => ({ color, foto: pref[color] }));

export const OBJETOS: Objeto[] = [
	{
		id: 'lampara-chapa',
		nombre: 'Lámpara de chapa',
		precio: 84000,
		frase: 'Cúpula de chapa esmaltada, como las de los talleres. Cuelga a 70 cm de la mesa.',
		taller: 'Chapería Boedo',
		dias: 14,
		stock: 6,
		ilustrativa: true,
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
		ilustrativa: true,
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
		frase: 'Lino lavado, 1,60 × 2,40 m, con la raya azul del telar.',
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
	{
		id: 'almohadon',
		nombre: 'Almohadón de terciopelo',
		precio: 22000,
		frase: 'Terciopelo de algodón, relleno de plumas. Funda con cierre para lavarla.',
		taller: 'Telar La Quinta',
		dias: 10,
		stock: 12,
		categoria: 'textiles',
		color: 'cobalto',
		foto: fAlmohadonCobalto,
		variantes: variantes({ blanco: fAlmohadonCrudo, cobalto: fAlmohadonCobalto, rojo: fAlmohadonRojo, amarillo: fAlmohadonAmarillo, negro: fAlmohadonNegro }, ['cobalto', 'rojo', 'amarillo', 'negro', 'blanco']),
	},
	{
		id: 'taza',
		nombre: 'Taza panzona',
		precio: 12900,
		frase: 'Cabe un mate cocido grande y se agarra con una mano. Gres esmaltado, va al lavavajillas.',
		taller: 'Taller Ñandú',
		dias: 9,
		stock: 40,
		categoria: 'mesa-cocina',
		color: 'amarillo',
		foto: fTazaAmarillo,
		variantes: variantes({ blanco: fTazaCrudo, cobalto: fTazaCobalto, rojo: fTazaRojo, amarillo: fTazaAmarillo, negro: fTazaNegro }, ['amarillo', 'cobalto', 'rojo', 'negro', 'blanco']),
	},
	{
		id: 'bolso',
		nombre: 'Bolso de lona',
		precio: 18500,
		frase: 'Lona cruda cosida a mano, asa larga para el hombro. Se lava a 40 grados.',
		taller: 'Telar La Quinta',
		dias: 8,
		stock: 25,
		categoria: 'textiles',
		color: 'rojo',
		foto: fBolsoRojo,
		variantes: variantes({ blanco: fBolsoCrudo, cobalto: fBolsoCobalto, rojo: fBolsoRojo, amarillo: fBolsoAmarillo, negro: fBolsoNegro }, ['rojo', 'cobalto', 'amarillo', 'negro', 'blanco']),
	},
	{
		id: 'banco',
		nombre: 'Banco de cocina',
		precio: 96000,
		frase: 'Madera maciza pintada a mano, con travesaños que aguantan los pies. Alto de barra.',
		taller: 'Carpintería del Parque',
		dias: 18,
		stock: 5,
		categoria: 'mesa-cocina',
		color: 'negro',
		foto: fBancoNegro,
		variantes: variantes({ blanco: fBancoCrudo, cobalto: fBancoCobalto, rojo: fBancoRojo, amarillo: fBancoAmarillo, negro: fBancoNegro }, ['negro', 'cobalto', 'rojo', 'amarillo', 'blanco']),
	},
	{
		id: 'lampara-pie',
		nombre: 'Lámpara de pie',
		precio: 129000,
		frase: 'Trípode de madera y pantalla de tela. Se pide con el cable que va con tu enchufe.',
		taller: 'Chapería Boedo',
		dias: 21,
		stock: 4,
		categoria: 'luz',
		color: 'amarillo',
		foto: fLamparaPieAmarillo,
		variantes: variantes({ blanco: fLamparaPieCrudo, cobalto: fLamparaPieCobalto, rojo: fLamparaPieRojo, amarillo: fLamparaPieAmarillo, negro: fLamparaPieNegro }, ['amarillo', 'rojo', 'cobalto', 'negro', 'blanco']),
	},
	{
		id: 'cacerola',
		nombre: 'Cacerola esmaltada',
		precio: 58000,
		frase: 'Esmalte salpicado, tapa que cierra bien y asas anchas para llevarla caliente a la mesa.',
		taller: 'Taller Ñandú',
		dias: 14,
		stock: 7,
		categoria: 'mesa-cocina',
		color: 'cobalto',
		foto: fCacerolaCobalto,
		variantes: variantes({ blanco: fCacerolaCrudo, cobalto: fCacerolaCobalto, rojo: fCacerolaRojo, amarillo: fCacerolaAmarillo, negro: fCacerolaNegro }, ['cobalto', 'amarillo', 'rojo', 'negro', 'blanco']),
	},
	{
		id: 'repasador',
		nombre: 'Repasador estampado',
		precio: 7900,
		frase: 'Algodón grueso que seca de verdad. El dibujo va estampado a mano, uno por uno.',
		taller: 'Telar La Quinta',
		dias: 6,
		stock: 60,
		categoria: 'textiles',
		color: 'rojo',
		foto: fRepasadorRojo,
		variantes: variantes({ blanco: fRepasadorCrudo, cobalto: fRepasadorCobalto, rojo: fRepasadorRojo, amarillo: fRepasadorAmarillo, negro: fRepasadorNegro }, ['rojo', 'cobalto', 'amarillo', 'negro', 'blanco']),
	},
	{
		id: 'aros-par',
		nombre: 'Jarrones aro (par)',
		precio: 64000,
		frase: 'Dos tamaños de gres crudo con el agujero al medio. Se paran solos y piden pocas flores.',
		taller: 'Taller Ñandú',
		dias: 16,
		stock: 4,
		categoria: 'plantas',
		color: 'blanco',
		foto: fotoAros,
	},
	{
		id: 'madera-par',
		nombre: 'Jarrón y maceta de mango',
		precio: 71000,
		frase: 'Madera torneada de una sola pieza, con la veta a la vista. Viene el par.',
		taller: 'Carpintería del Parque',
		dias: 15,
		stock: 6,
		categoria: 'plantas',
		color: 'amarillo',
		foto: fotoMadera,
	},
	{
		id: 'maceta-eucalipto',
		nombre: 'Maceta facetada de cemento',
		precio: 24500,
		frase: 'Cemento blanco colado en molde facetado. Con agujero de drenaje y platito.',
		taller: 'Cementos del Bajo',
		dias: 10,
		stock: 14,
		categoria: 'plantas',
		color: 'negro',
		foto: fotoMaceta,
	},
	{
		id: 'vela-ambar',
		nombre: 'Vela en frasco ámbar',
		precio: 18900,
		frase: 'Cera de soja en vidrio ámbar, unas cuarenta horas. Se recarga cuando se termina.',
		taller: 'Vidriería Santa Ana',
		dias: 7,
		stock: 30,
		categoria: 'luz',
		color: 'rojo',
		foto: fotoVelaAmbar,
	},
	{
		id: 'vela-alta',
		nombre: 'Vela alta ámbar',
		precio: 26500,
		frase: 'La misma cera en frasco alto, para el centro de la mesa. Arde parejo hasta el final.',
		taller: 'Vidriería Santa Ana',
		dias: 7,
		stock: 18,
		categoria: 'luz',
		color: 'cobalto',
		foto: fotoVelaAlta,
	},
	{
		id: 'vela-cobre',
		nombre: 'Vela en lata de cobre',
		precio: 21900,
		frase: 'Lata de cobre con tapa que se vuelve a poner. Para llevar a cualquier mesa.',
		taller: 'Chapería Boedo',
		dias: 9,
		stock: 22,
		categoria: 'luz',
		color: 'blanco',
		foto: fotoVelaCobre,
	},
];

// Lo que no cuelga de la foto: los que vienen en varios colores primero (se ven más grandes), después los de una sola foto.
export const DEPOSITO = OBJETOS.slice(8).sort((a, b) => Number(!!b.variantes) - Number(!!a.variantes));
export const TOTAL_CATALOGO = 360;

// Cada objeto con colores se vuelve una entrada por color (clave `id~color`): la bolsa, la libreta y los pedidos guardan la clave.
export const CLAVES: Objeto[] = OBJETOS.flatMap((o) =>
	o.variantes ? o.variantes.map((v) => ({ ...o, id: clave(o.id, v.color), nombre: `${o.nombre} · ${NOMBRE_COLOR[v.color]}`, foto: v.foto, color: v.color })) : [o],
);

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
	{ id: 'cocina-de-pasillo', titulo: ['COCINA', 'DE PASILLO'], seccion: 'Historias', objetos: ['jarra-gres', 'plato-gres', 'tabla-lenga'] },
	{ id: 'un-domingo-de-lino', titulo: ['UN DOMINGO', 'DE LINO'], seccion: 'Objetos', objetos: ['mantel-lino', 'vasos-4', 'candelero-bronce'] },
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
