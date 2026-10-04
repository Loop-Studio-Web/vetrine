// Le spine del locale (di fantasia). Usate dalla lavagna e dai suggerimenti di abbinamento in cucina.

export type Gruppo = 'chiare' | 'luppolate' | 'ambrate' | 'scure' | 'acide';

export const gruppi: { id: Gruppo | 'tutte'; nome: string }[] = [
	{ id: 'tutte', nome: 'Tutte' },
	{ id: 'chiare', nome: 'Chiare' },
	{ id: 'luppolate', nome: 'Luppolate' },
	{ id: 'ambrate', nome: 'Ambrate' },
	{ id: 'scure', nome: 'Scure' },
	{ id: 'acide', nome: 'Acide' },
];

export type Birra = {
	id: string;
	spina: number;
	nome: string;
	stile: string;
	gruppo: Gruppo;
	gradi: number; // % vol
	ibu: number; // amaro, 0-100
	ebc: number; // colore
	colore: string; // tinta del liquido
	stato: 'alla spina' | 'ultimi litri' | 'in arrivo';
	note: string;
	profumo: string;
	prezzo: [string, string]; // 0,2 l e 0,4 l
};

export const birre: Birra[] = [
	{
		id: 'fiume-chiara',
		spina: 1,
		nome: 'Fiume Chiara',
		stile: 'Helles',
		gruppo: 'chiare',
		gradi: 4.8,
		ibu: 18,
		ebc: 6,
		colore: '#f3c84a',
		stato: 'alla spina',
		note: 'La birra da sete: pulita, di pane e miele, con un amaro che si fa dimenticare. Quella che si ordina senza guardare la lavagna.',
		profumo: 'Crosta di pane, fieno, fiori di tiglio',
		prezzo: ['3,5', '6'],
	},
	{
		id: 'roadie',
		spina: 2,
		nome: 'Roadie',
		stile: 'Session Pale Ale',
		gruppo: 'chiare',
		gradi: 3.5,
		ibu: 28,
		ebc: 8,
		colore: '#e9b03a',
		stato: 'alla spina',
		note: 'Leggera di grado e piena di agrumi: perfetta per chi porta le casse e deve ancora guidare. Se ne beve una dopo l’altra.',
		profumo: 'Pompelmo, mandarino, erba tagliata',
		prezzo: ['3', '5,5'],
	},
	{
		id: 'sottopalco',
		spina: 3,
		nome: 'Sottopalco',
		stile: 'West Coast IPA',
		gruppo: 'luppolate',
		gradi: 6.4,
		ibu: 62,
		ebc: 12,
		colore: '#d98a1a',
		stato: 'alla spina',
		note: 'Il nostro luppolo senza compromessi: secca, resinosa, amara in fondo. Il cavallo di battaglia del mastro birraio.',
		profumo: 'Resina di pino, pompelmo rosa, scorza d’arancia',
		prezzo: ['4,5', '7,5'],
	},
	{
		id: 'distorsore',
		spina: 4,
		nome: 'Distorsore',
		stile: 'Double NEIPA',
		gruppo: 'luppolate',
		gradi: 7.8,
		ibu: 45,
		ebc: 9,
		colore: '#eec04a',
		stato: 'ultimi litri',
		note: 'Torbida, morbida come un succo e pericolosa come un amplificatore a palla. Luppolo aggiunto a freddo, tre volte.',
		profumo: 'Mango, ananas, pesca gialla',
		prezzo: ['5', '8,5'],
	},
	{
		id: 'amplificatore',
		spina: 5,
		nome: 'Amplificatore',
		stile: 'Amber Ale',
		gruppo: 'ambrate',
		gradi: 5.4,
		ibu: 30,
		ebc: 28,
		colore: '#b8601a',
		stato: 'alla spina',
		note: 'Malti caramellati e un luppolo che sta al suo posto. È la birra da panino: tiene testa a tutto ciò che è grigliato.',
		profumo: 'Caramello, nocciola tostata, frutta secca',
		prezzo: ['4', '6,5'],
	},
	{
		id: 'basso-profondo',
		spina: 6,
		nome: 'Basso Profondo',
		stile: 'Imperial Stout',
		gruppo: 'scure',
		gradi: 8.5,
		ibu: 55,
		ebc: 80,
		colore: '#2a1a12',
		stato: 'alla spina',
		note: 'Nera, densa, lenta. Cacao amaro e caffè, con una dolcezza che arriva solo a metà bicchiere. Si divide in due.',
		profumo: 'Cacao amaro, caffè, prugna',
		prezzo: ['5', '9'],
	},
	{
		id: 'ultima-corda',
		spina: 7,
		nome: 'Ultima Corda',
		stile: 'Porter al caffè',
		gruppo: 'scure',
		gradi: 5.9,
		ibu: 35,
		ebc: 65,
		colore: '#3a2216',
		stato: 'in arrivo',
		note: 'Una porter con caffè in grani di una torrefazione del paese, aggiunto a freddo. Da lunedì prossimo sulla spina 7.',
		profumo: 'Caffè fresco, cioccolato al latte, tostato',
		prezzo: ['4', '7'],
	},
	{
		id: 'feedback',
		spina: 8,
		nome: 'Feedback',
		stile: 'Sour al lampone',
		gruppo: 'acide',
		gradi: 3.9,
		ibu: 6,
		ebc: 14,
		colore: '#d8506a',
		stato: 'alla spina',
		note: 'Acida, rosa e fresca come un sorbetto. Per chi dice di non amare la birra e poi chiede il bis.',
		profumo: 'Lampone, limone, un velo di yogurt',
		prezzo: ['4', '7'],
	},
];

export const birraPerId = (id: string) => birre.find((b) => b.id === id)!;
