// Dati di fantasia della Limonaia Aurelia: spazi, formati, tipi di evento.
// Misure in centimetri. Modulo puro: lo usano frontmatter e browser.

export type TipoEvento = 'matrimonio' | 'compleanno' | 'aziendale' | 'laurea';
export type Formato = 'tondi' | 'imperiale' | 'cocktail' | 'cerimonia';
export type SpazioId = 'limonaia' | 'giardino' | 'cantina';

export interface Tipo {
	id: TipoEvento;
	nome: string;
	ospiti: number; // numero tipico
	formato: Formato;
	spazio: SpazioId;
	cateringTesta: number; // € a persona, indicativo
}

export const TIPI: Tipo[] = [
	{ id: 'matrimonio', nome: 'Matrimonio', ospiti: 90, formato: 'tondi', spazio: 'limonaia', cateringTesta: 95 },
	{ id: 'compleanno', nome: 'Compleanno', ospiti: 36, formato: 'imperiale', spazio: 'cantina', cateringTesta: 70 },
	{ id: 'aziendale', nome: 'Cena aziendale', ospiti: 80, formato: 'cocktail', spazio: 'limonaia', cateringTesta: 65 },
	{ id: 'laurea', nome: 'Festa di laurea', ospiti: 40, formato: 'imperiale', spazio: 'giardino', cateringTesta: 60 },
];

export interface FormatoInfo {
	id: Formato;
	nome: string;
	mqPersona: number; // metri quadri utili per persona
	nota: string;
}

export const FORMATI: FormatoInfo[] = [
	{ id: 'tondi', nome: 'Tavoli tondi', mqPersona: 1.5, nota: 'Otto per tavolo, corridoi da 80 cm' },
	{ id: 'imperiale', nome: 'Tavolata imperiale', mqPersona: 1.25, nota: 'Tavoli lunghi, 60 cm a persona' },
	{ id: 'cocktail', nome: 'Cocktail in piedi', mqPersona: 0.8, nota: 'Tavoli alti, si circola' },
	{ id: 'cerimonia', nome: 'Cerimonia', mqPersona: 0.55, nota: 'File di sedie con corridoio' },
];

export interface Spazio {
	id: SpazioId;
	nome: string;
	dove: string; // forma con la preposizione: «nella limonaia»
	w: number;
	d: number;
	max: number; // limite di sicurezza
	mesi: number[]; // mesi aperti (0 = gennaio)
	testo: string;
}

export const SPAZI: Spazio[] = [
	{
		id: 'limonaia',
		nome: 'La limonaia',
		dove: 'nella limonaia',
		w: 2400,
		d: 1200,
		max: 160,
		mesi: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
		testo: 'Vetrate a capriate e pietra: riscaldata d’inverno, aperta sul giardino d’estate.',
	},
	{
		id: 'giardino',
		nome: 'Il giardino',
		dove: 'in giardino',
		w: 3200,
		d: 2200,
		max: 220,
		mesi: [3, 4, 5, 6, 7, 8, 9],
		testo: 'Prato e vasi di agrumi, da aprile a ottobre. Luci a ghirlanda dopo le 19.',
	},
	{
		id: 'cantina',
		nome: 'La cantina',
		dove: 'in cantina',
		w: 1400,
		d: 650,
		max: 50,
		mesi: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
		testo: 'Volta a botte in pietra: per cene raccolte, fresca anche ad agosto.',
	},
];

export const MARGINE = 80; // cm tra pareti e primo tavolo
export const PALCO = 260; // profondità del palco, cm

export function spazio(id: SpazioId): Spazio {
	return SPAZI.find((s) => s.id === id) ?? SPAZI[0];
}
export function formato(id: Formato): FormatoInfo {
	return FORMATI.find((f) => f.id === id) ?? FORMATI[0];
}
export function tipo(id: TipoEvento): Tipo {
	return TIPI.find((t) => t.id === id) ?? TIPI[0];
}
