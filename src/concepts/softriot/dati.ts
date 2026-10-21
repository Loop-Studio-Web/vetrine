// Dati di fantasia di Soft Riot: negozio di abbigliamento e accessori, in inglese. Prodotti, prezzi, taglie e
// nomi non esistono. I quattro pezzi "Soft Riot Original" sono render di brand; le altre foto sono di archivio
// (crediti in src/assets/softriot/foto/CREDITI.md).

export const SOGLIA_SPEDIZIONE = 60; // spedizione gratuita sopra questa cifra
export const COSTO_SPEDIZIONE = 4.9;

export type Categoria = 'outerwear' | 'knits' | 'bottoms' | 'shoes' | 'bags' | 'extras';
export type Forma = 'pillola' | 'arco' | 'ovale' | 'goccia' | 'foglia';
export type Misura = 's' | 'm' | 't' | 'l';

export const CATEGORIE: { chiave: Categoria; nome: string }[] = [
	{ chiave: 'outerwear', nome: 'Outerwear' },
	{ chiave: 'knits', nome: 'Knits & sweats' },
	{ chiave: 'bottoms', nome: 'Bottoms' },
	{ chiave: 'shoes', nome: 'Shoes' },
	{ chiave: 'bags', nome: 'Bags' },
	{ chiave: 'extras', nome: 'Hats & extras' },
];

export const TAGLIE = ['XS', 'S', 'M', 'L', 'XL', 'One size'] as const;

// colori per il filtro: il pallino e il nome
export const COLORI: Record<string, { nome: string; hex: string }> = {
	orange: { nome: 'Orange', hex: '#ff8a1f' },
	red: { nome: 'Red', hex: '#d63a2a' },
	pink: { nome: 'Pink', hex: '#f3a3b8' },
	yellow: { nome: 'Yellow', hex: '#f4d03f' },
	blue: { nome: 'Blue', hex: '#3f6fb0' },
	lilac: { nome: 'Lilac', hex: '#b9a8f2' },
	white: { nome: 'White', hex: '#f4f1f8' },
	sand: { nome: 'Sand', hex: '#cdb38c' },
	black: { nome: 'Black', hex: '#1d1033' },
};

// campi di colore dietro le foto (nomi dei token di base.css)
type Campo = [string, string];

export interface Prodotto {
	id: string;
	nome: string;
	prezzo: number;
	categoria: Categoria;
	colori: string[]; // chiavi di COLORI
	taglie: string[];
	testo: string;
	immagine: string; // nome del file in src/assets/softriot/foto (o brand, se originale)
	originale?: boolean; // render di brand ritagliato, non foto
	campo: Campo;
	forma: Forma;
	misura: Misura;
	/** punto del ritaglio (in %) e ingrandimento a riposo: la finestra mostra solo questo dettaglio */
	taglio: { x: number; y: number; zoom: number };
	/** posto della finestra dentro la tessera: sinistra, centro, destra */
	posto?: 'sx' | 'cx' | 'dx';
	nuovo?: boolean;
}

export const PRODOTTI: Prodotto[] = [
	{
		id: 'knot-set',
		nome: 'Knot bucket hat + scarf set',
		prezzo: 89,
		categoria: 'extras',
		colori: ['lilac', 'orange'],
		taglie: ['One size'],
		testo: 'Quilted satin in two halves that meet at a knot. The hat sits low, the scarf ties however you like.',
		immagine: 'cappello-e-sciarpa',
		originale: true,
		campo: ['lavanda', 'pesca'],
		forma: 'ovale',
		misura: 'l',
		taglio: { x: 59, y: 55, zoom: 2.1 },
		nuovo: true,
	},
	{
		id: 'chain-bag',
		nome: 'Quilted chain bag',
		prezzo: 149,
		categoria: 'bags',
		colori: ['lilac', 'orange'],
		taglie: ['One size'],
		testo: 'A small quilted crossbody, lavender on one side and peach on the other, with a chunky chain and a knotted tab.',
		immagine: 'borsa',
		originale: true,
		campo: ['ink', 'ink2'],
		forma: 'arco',
		misura: 'm',
		taglio: { x: 59, y: 40, zoom: 2.3 },
		nuovo: true,
	},
	{
		id: 'puff-mitts',
		nome: 'Puff mittens',
		prezzo: 59,
		categoria: 'extras',
		colori: ['lilac', 'orange'],
		taglie: ['S/M', 'M/L'],
		testo: 'Mittens padded like a duvet, tied together with a twisted cord so you never lose one.',
		immagine: 'muffole',
		originale: true,
		campo: ['mandarino', 'corallo'],
		forma: 'goccia',
		misura: 's',
		taglio: { x: 47, y: 50, zoom: 2.2 },
		nuovo: true,
	},
	{
		id: 'soft-goggles',
		nome: 'Soft goggles',
		prezzo: 79,
		categoria: 'extras',
		colori: ['lilac', 'orange'],
		taglie: ['One size'],
		testo: 'Sunglasses with a padded frame, knotted at the bridge. Lilac on the left, peach on the right.',
		immagine: 'occhiali',
		originale: true,
		campo: ['ink2', 'ink'],
		forma: 'pillola',
		misura: 's',
		taglio: { x: 70, y: 46, zoom: 2.4 },
		nuovo: true,
	},
	{
		id: 'fox-puffer',
		nome: 'Fox-hood puffer',
		prezzo: 129,
		categoria: 'outerwear',
		colori: ['red'],
		taglie: ['XS', 'S', 'M', 'L'],
		testo: 'A cropped puffer with a faux-fur hood and yellow rib cuffs. Warm enough for February, loud enough for any day.',
		immagine: 'puffer-rosso',
		campo: ['lavanda', 'nebbia'],
		forma: 'arco',
		misura: 't',
		taglio: { x: 56, y: 48, zoom: 2.1 },
		posto: 'cx',
	},
	{
		id: 'cloud-puffer',
		nome: 'Cloud puffer',
		prezzo: 139,
		categoria: 'outerwear',
		colori: ['white'],
		taglie: ['S', 'M', 'L', 'XL'],
		testo: 'A white puffer cut wide through the body, with a high collar that covers your chin.',
		immagine: 'puffer-bianco',
		campo: ['pesca', 'corallo'],
		forma: 'ovale',
		misura: 'm',
		taglio: { x: 55, y: 34, zoom: 2.2 },
		posto: 'dx',
	},
	{
		id: 'rinse-denim',
		nome: 'Rinsed denim jacket',
		prezzo: 99,
		categoria: 'outerwear',
		colori: ['blue'],
		taglie: ['XS', 'S', 'M', 'L', 'XL'],
		testo: 'Stiff raw denim with a collar that stands up on its own. It softens by the second wash.',
		immagine: 'denim-colletto',
		campo: ['mandarino', 'pesca'],
		forma: 'pillola',
		misura: 's',
		taglio: { x: 36, y: 80, zoom: 1.9 },
		posto: 'sx',
	},
	{
		id: 'open-knit',
		nome: 'Open-knit sweater',
		prezzo: 75,
		categoria: 'knits',
		colori: ['orange', 'pink'],
		taglie: ['XS', 'S', 'M', 'L'],
		testo: 'A loose, holey knit in coral that lets the air through. Wear it over a vest or just over your shoulders.',
		immagine: 'maglia-corallo',
		campo: ['lavanda', 'lavanda'],
		forma: 'goccia',
		misura: 'm',
		taglio: { x: 26, y: 64, zoom: 2 },
		posto: 'dx',
	},
	{
		id: 'oat-cardi',
		nome: 'Oat cardigan',
		prezzo: 85,
		categoria: 'knits',
		colori: ['sand'],
		taglie: ['S', 'M', 'L'],
		testo: 'A long cardigan in a brushed oat wool blend. The sleeves are cut deep enough to pull over your hands.',
		immagine: 'cardigan',
		campo: ['corallo', 'mandarino'],
		forma: 'foglia',
		misura: 't',
		taglio: { x: 40, y: 78, zoom: 2.1 },
		posto: 'sx',
	},
	{
		id: 'hush-hoodie',
		nome: 'Hush hoodie',
		prezzo: 69,
		categoria: 'knits',
		colori: ['pink'],
		taglie: ['XS', 'S', 'M', 'L', 'XL'],
		testo: 'A heavy pink hoodie with a hood that stands up. Cut oversized, so size down if you want it neat.',
		immagine: 'felpa-rosa',
		campo: ['ink', 'ink2'],
		forma: 'ovale',
		misura: 'm',
		taglio: { x: 30, y: 60, zoom: 2.4 },
		posto: 'cx',
	},
	{
		id: 'tangerine-trousers',
		nome: 'Tangerine trousers',
		prezzo: 95,
		categoria: 'bottoms',
		colori: ['orange'],
		taglie: ['XS', 'S', 'M', 'L'],
		testo: 'Straight, high-waisted tailoring in a colour you cannot lose in a crowd. Pairs with the Tomato trainers.',
		immagine: 'pantaloni-arancio',
		campo: ['lavanda', 'lavanda'],
		forma: 'pillola',
		misura: 't',
		taglio: { x: 40, y: 84, zoom: 2.2 },
		posto: 'sx',
	},
	{
		id: 'tie-jeans',
		nome: 'Drawstring jeans',
		prezzo: 79,
		categoria: 'bottoms',
		colori: ['blue'],
		taglie: ['XS', 'S', 'M', 'L', 'XL'],
		testo: 'Wide-leg jeans with a drawstring waist and a raw hem. The comfort of a tracksuit, the line of denim.',
		immagine: 'jeans-laccio',
		campo: ['pesca', 'mandarino'],
		forma: 'arco',
		misura: 's',
		taglio: { x: 50, y: 14, zoom: 2.7 },
		posto: 'dx',
	},
	{
		id: 'tomato-trainers',
		nome: 'Tomato trainers',
		prezzo: 119,
		categoria: 'shoes',
		colori: ['red'],
		taglie: ['S', 'M', 'L'],
		testo: 'Low-profile trainers in a red you can see from across the street. S is 38–39, M 40–41, L 42–43.',
		immagine: 'scarpe-rosse',
		campo: ['lavanda', 'nebbia'],
		forma: 'goccia',
		misura: 'm',
		taglio: { x: 52, y: 52, zoom: 2.1 },
		posto: 'cx',
	},
	{
		id: 'slim-shades',
		nome: 'Slim shades',
		prezzo: 69,
		categoria: 'extras',
		colori: ['black'],
		taglie: ['One size'],
		testo: 'Thin black frames with dark rose lenses. They fold flat in a pocket.',
		immagine: 'occhiali',
		campo: ['corallo', 'pesca'],
		forma: 'pillola',
		misura: 's',
		taglio: { x: 50, y: 56, zoom: 1.9 },
		posto: 'sx',
	},
	{
		id: 'riot-scarf',
		nome: 'Riot silk scarf',
		prezzo: 49,
		categoria: 'extras',
		colori: ['orange', 'blue'],
		taglie: ['One size'],
		testo: 'A square silk scarf in orange and blue. Knot it at the neck, on a bag strap or in your hair.',
		immagine: 'foulard',
		campo: ['ink', 'ink2'],
		forma: 'foglia',
		misura: 'm',
		taglio: { x: 54, y: 42, zoom: 2.3 },
		posto: 'dx',
	},
	{
		id: 'butter-bag',
		nome: 'Butter mini bag',
		prezzo: 119,
		categoria: 'bags',
		colori: ['yellow'],
		taglie: ['One size'],
		testo: 'A small butter-yellow bag with a thin chain handle. Fits a phone, keys and a lip balm.',
		immagine: 'borsa-gialla',
		campo: ['lavanda', 'lavanda'],
		forma: 'ovale',
		misura: 't',
		taglio: { x: 50, y: 66, zoom: 2.1 },
		posto: 'sx',
	},
	{
		id: 'pink-tote',
		nome: 'Quilted pink tote',
		prezzo: 139,
		categoria: 'bags',
		colori: ['pink'],
		taglie: ['One size'],
		testo: 'A roomy quilted tote with slim shoulder straps. It holds a laptop and a change of shoes.',
		immagine: 'borsa-rosa',
		campo: ['mandarino', 'corallo'],
		forma: 'arco',
		misura: 'm',
		taglio: { x: 70, y: 76, zoom: 2 },
		posto: 'cx',
	},
	{
		id: 'sand-bucket',
		nome: 'Sand bucket hat',
		prezzo: 45,
		categoria: 'extras',
		colori: ['sand'],
		taglie: ['One size'],
		testo: 'A soft bucket hat in sand cotton with a flat brim. Folds into a coat pocket.',
		immagine: 'cappello-sabbia',
		campo: ['lavanda', 'pesca'],
		forma: 'pillola',
		misura: 't',
		taglio: { x: 42, y: 38, zoom: 2.6 },
		posto: 'sx',
	},
];

// le quattro slide del carosello: pezzi di brand
export interface Slide {
	prodotto: string;
	titolo: string;
	testo: string;
	cta: string;
	campo: [string, string];
	macchia: string;
	inchiostro: 'ink' | 'nebbia';
	oggetto: string; // classe di posizione, per ogni pezzo la sua
	alt: string;
}

export const SLIDE: Slide[] = [
	{
		prodotto: 'knot-set',
		titolo: 'Tie one on',
		testo: 'A quilted hat and scarf that share a knot. Two colours, one set.',
		cta: 'Shop the set',
		campo: ['#b9a8f2', '#ece6ff'],
		macchia: '#ff8a1f',
		inchiostro: 'ink',
		oggetto: 'set',
		alt: 'A quilted bucket hat and a quilted scarf tied in a knot, both half lavender and half peach.',
	},
	{
		prodotto: 'chain-bag',
		titolo: 'Carry the quilt',
		testo: 'A small bag with a big chain. Lavender on one side, peach on the other.',
		cta: 'Shop the bag',
		campo: ['#1d1033', '#3a2561'],
		macchia: '#b9a8f2',
		inchiostro: 'nebbia',
		oggetto: 'borsa',
		alt: 'A small quilted crossbody bag, lavender on the left and peach on the right, with a gold chain strap and a knotted tab.',
	},
	{
		prodotto: 'puff-mitts',
		titolo: 'Hands up, hands warm',
		testo: 'Puffed mittens on a twisted cord. Impossible to lose, hard to put down.',
		cta: 'Shop the mittens',
		campo: ['#ff8a1f', '#ff6b5a'],
		macchia: '#b9a8f2',
		inchiostro: 'ink',
		oggetto: 'muffole',
		alt: 'A pair of quilted mittens, one lavender and one peach, tied together with a twisted cord.',
	},
	{
		prodotto: 'soft-goggles',
		titolo: 'See it soft',
		testo: 'Sunglasses with a padded frame and a knot at the bridge.',
		cta: 'Shop the goggles',
		campo: ['#ece6ff', '#b9a8f2'],
		macchia: '#ffb27a',
		inchiostro: 'ink',
		oggetto: 'occhiali',
		alt: 'Padded sunglasses with one lavender side and one peach side, tied at the bridge with a cord.',
	},
];

export const EURO = (n: number) => `€${Number.isInteger(n) ? n : n.toFixed(2)}`;
