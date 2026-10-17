// Contenuti di Marrow & Knot (planner di nozze di fantasia, in inglese). Unica fonte per sale, menù e modulo.

export interface Scatto {
	file: string; // in src/assets/marrowknot/foto
	/** foto verticale per il telefono (sotto i 900 px), se serve una inquadratura diversa */
	mobile?: string;
	/** colore del testo che regge su questa foto (misurato sulla zona del testo): chiaro = testo bianco, scuro = testo nero */
	tono?: 'chiaro' | 'scuro';
	alt: string;
	cap: string; // didascalia breve che cambia con la foto
}

/** Una pillola: compare con la sua foto, resta finché la foto resta, esce quando arriva la successiva. */
export interface Pillola {
	kicker: string; // etichetta piccola sopra il titolo
	titolo: string; // 3-4 parole, in Great Vibes
	testo?: string;
	punti?: string[];
}

export interface Sala {
	id: string;
	nome: string; // nome del luogo, anche per il menù
	breve: string; // voce corta di navigazione e nome gigante (Great Vibes)
	tinta: 'pompeiano' | 'verderame' | 'vino' | 'marmo' | 'carminio';
	/** una frase sotto il nome grande, esce quando arriva la seconda foto */
	claim: string;
	testo: string;
	fatti: [string, string][];
	/** pillole delle foto 2 e 3: un po' di storia e di contesto per chi arriva da lontano */
	storia: Pillola;
	sapere: Pillola;
	/** pillola della foto 4: la chiusura, con i dati e il pulsante */
	chiusura: Pillola;
	/** le foto di sfondo: si danno il cambio, tessendosi, mentre si attraversa la sala */
	scatti: Scatto[];
	/** 'a' = testo a sinistra, 'b' = testo a destra */
	disposizione: 'a' | 'b';
	/** colore del nome grande (misurato sulla zona in basso a sinistra) */
	tonoNome: 'chiaro' | 'scuro';
	/** colore del logo e delle voci della navbar mentre si attraversa la sala (misurato sulla fascia alta delle foto) */
	tonoNav: 'chiaro' | 'scuro';
	cta: string;
	/** video nella serratura (solo Venezia) */
	video?: { file: string; alt: string };
}

export const ingresso: Scatto = {
	file: 'ingresso',
	mobile: 'ingresso-mobile',
	alt: 'Domes and bell towers of Venice in silhouette against an orange sunset, with flocks of birds',
	cap: 'Venice at the end of the day',
};

export const sale: Sala[] = [
	{
		id: 'como',
		nome: 'Lake Como',
		breve: 'Como',
		tinta: 'verderame',
		claim: 'A loggia over deep water.',
		testo:
			'Vows on a stone terrace, a wooden boat to dinner, cypress for walls. Como suits couples who want hush and grandeur in the same hour.',
		fatti: [
			['Guests', '20 to 80'],
			['Season', 'April to October'],
			['From Milan', 'About an hour by car'],
		],
		storia: {
			kicker: 'A little history',
			titolo: 'Villas since Roman times',
			testo:
				'Pliny the Younger, born in Como, wrote about his villas on the shore. Most of the grand houses you see today were built between the 1500s and the 1800s as summer homes, and many still keep their terraced gardens down to the water.',
		},
		sapere: {
			kicker: 'Good to know',
			titolo: 'Water is the setting',
			punti: [
				'The lake is long and narrow: ferries and private boats link the shores, and the roads are slow.',
				'Several villas are licensed for civil ceremonies, so you can marry where you celebrate.',
				'We plan boat times as carefully as the menu.',
			],
		},
		chiusura: {
			kicker: 'At a glance',
			titolo: 'Quiet and grand',
			testo: 'Hush and grandeur in the same hour: one terrace, one boat at dusk.',
		},
		scatti: [
			{
				file: 'como-1', tono: 'chiaro',
				alt: 'A villa on a wooded promontory reflected in the still water of Lake Como',
				cap: 'A villa on the water',
			},
			{
				file: 'como-3', tono: 'chiaro',
				alt: 'A narrow lane of shuttered ochre houses with an iron lantern and the lake between the mountains',
				cap: 'The lanes above the water',
			},
			{
				file: 'como-2', tono: 'chiaro',
				alt: 'A columned loggia with cypress trees and potted cacti opening onto the lake',
				cap: 'The loggia, before the guests arrive',
			},
			{
				file: 'como-4', tono: 'chiaro',
				alt: 'The sun setting behind the mountains over Lake Como, with a villa among cypress trees',
				cap: 'Sunset over the lake',
			},
		],
		disposizione: 'a',
		tonoNome: 'chiaro',
		tonoNav: 'scuro',
		cta: 'Plan a wedding on Lake Como',
	},
	{
		id: 'puglia',
		nome: 'Puglia',
		breve: 'Puglia',
		tinta: 'vino',
		claim: 'Whitewashed courtyards, a long table.',
		testo:
			'Dinner starts late and nobody checks the time. Stone cones for roofs, a courtyard that holds eighty people and the dark that comes down soft.',
		fatti: [
			['Guests', '40 to 160'],
			['Season', 'May to October'],
			['From Bari', 'About an hour by car'],
		],
		storia: {
			kicker: 'A little history',
			titolo: 'Olives, stone and sea',
			testo:
				'Puglia has lived off olives, wheat and the sea for thousands of years, and still makes more olive oil than any other Italian region. The trulli of the Itria Valley, round houses of dry stone, are typical here, and those in Alberobello are a UNESCO World Heritage Site.',
		},
		sapere: {
			kicker: 'Good to know',
			titolo: 'Late and unhurried',
			punti: [
				'Summer afternoons are hot: ceremonies are usually after five, and dinner starts late.',
				'Food is the main event: fresh burrata, orecchiette and a long table that does not hurry.',
				'The nearest airports are Bari and Brindisi, about an hour from most venues.',
			],
		},
		chiusura: {
			kicker: 'At a glance',
			titolo: 'Room for everyone',
			testo: 'Courtyards for eighty, long tables for more.',
		},
		scatti: [
			{
				file: 'puglia-1', tono: 'chiaro',
				alt: 'A carved stone palazzo with a stair and arcades above the sea',
				cap: 'A palazzo above the sea',
			},
			{
				file: 'puglia-4', tono: 'chiaro',
				alt: 'White limestone cliffs above clear turquoise water',
				cap: 'The cliffs and the clear sea',
			},
			{
				file: 'puglia-2', tono: 'chiaro',
				alt: 'A blue arched door in a white wall with prickly pears in pots',
				cap: 'A blue door and prickly pears',
			},
			{
				file: 'puglia-3', tono: 'chiaro',
				alt: 'Whitewashed trulli with conical stone roofs along a quiet lane',
				cap: 'Trulli, after the sun goes down',
			},
		],
		disposizione: 'b',
		tonoNome: 'scuro',
		tonoNav: 'chiaro',
		cta: 'Plan a wedding in Puglia',
	},
	{
		id: 'toscana',
		nome: 'Tuscany',
		breve: 'Tuscany',
		tinta: 'carminio',
		claim: 'A stone farmhouse, a cypress road.',
		testo:
			'Green shutters, a brick staircase and a field that goes gold by six. We use farmhouses we know, with kitchens that cook for a crowd.',
		fatti: [
			['Guests', '30 to 120'],
			['Season', 'April to October'],
			['From Florence', 'About an hour and a quarter'],
		],
		storia: {
			kicker: 'A little history',
			titolo: 'Farms that became rooms',
			testo:
				"The Tuscan countryside of cypress roads and stone farmhouses grew out of centuries of farming under the mezzadria, a form of sharecropping. The poderi, the farmhouses of that time, now host weddings, and the Val d'Orcia is a UNESCO World Heritage landscape.",
		},
		sapere: {
			kicker: 'Good to know',
			titolo: 'Choose your month',
			punti: [
				'Late spring and September are the sweet spots; July and August are hot.',
				'Many farmhouses have their own kitchens and sleep part of the guest list on site.',
				'Florence, Siena and the airports are an hour or two away, so day trips are easy.',
			],
		},
		chiusura: {
			kicker: 'At a glance',
			titolo: 'A table in the field',
			testo: 'Kitchens that cook for a crowd, and a field that goes gold by six.',
		},
		scatti: [
			{
				file: 'toscana-1', tono: 'chiaro',
				alt: 'Green hills in the mist with a farmhouse among cypress trees at sunrise',
				cap: 'Mist at sunrise',
			},
			{
				file: 'toscana-2', tono: 'chiaro',
				alt: 'Golden rolling hills with a cypress-lined road leading to a farmhouse',
				cap: 'The cypress road',
			},
			{
				file: 'toscana-3', tono: 'chiaro',
				alt: 'A vine terrace with a small table and chairs under a curtain, hills beyond',
				cap: 'A table on the terrace',
			},
			{
				file: 'toscana-4', tono: 'chiaro',
				alt: 'The dome and bell tower of Florence above red roofs in warm light',
				cap: 'Florence is an hour away',
			},
		],
		disposizione: 'a',
		tonoNome: 'chiaro',
		tonoNav: 'scuro',
		cta: 'Plan a wedding in Tuscany',
	},
	{
		id: 'costiera',
		nome: 'Amalfi Coast',
		breve: 'Amalfi',
		tinta: 'marmo',
		claim: 'A pergola, a sea, a very long lunch.',
		testo:
			'Terraces shaded by lemon and wisteria, stairs that turn every arrival into an entrance. Small weddings, planned down to the last step.',
		fatti: [
			['Guests', '10 to 50'],
			['Season', 'April to October'],
			['From Naples', 'About ninety minutes'],
		],
		storia: {
			kicker: 'A little history',
			titolo: 'Lemons and a republic',
			testo:
				'From the ninth to the twelfth century Amalfi traded across the Mediterranean as a maritime republic. The steep cliffs were terraced by hand, and the lemon groves under wooden pergolas still supply the famous sfusato lemons. The coast is a UNESCO World Heritage Site.',
		},
		sapere: {
			kicker: 'Good to know',
			titolo: 'Mind the stairs',
			punti: [
				'One narrow coast road, busy in summer: we move guests by boat and small shuttle.',
				'Almost everything involves stairs, so we plan shoes, routes and quiet corners.',
				'Venues are small and intimate, which is why the guest lists are short.',
			],
		},
		chiusura: {
			kicker: 'At a glance',
			titolo: 'Small and exact',
			testo: 'Planned down to the last step, for a few people you love.',
		},
		scatti: [
			{
				file: 'amalfi-1', tono: 'scuro',
				alt: 'Pink flowers in the foreground and the Amalfi coast fading into the haze',
				cap: 'Morning above the terraces',
			},
			{
				file: 'amalfi-2', tono: 'scuro',
				alt: 'A turquoise bay with small boats under a green cliff and a village',
				cap: 'The bay at noon',
			},
			{
				file: 'amalfi-3', tono: 'scuro',
				alt: 'An arched window with climbing plants framing the sea and two stools at a counter',
				cap: 'Lunch with the window open',
			},
			{
				file: 'amalfi-4', tono: 'scuro',
				alt: 'Positano lit up at dusk on its cliff above a calm sea',
				cap: 'Positano, when the lights come on',
			},
		],
		disposizione: 'b',
		tonoNome: 'scuro',
		tonoNav: 'chiaro',
		cta: 'Plan a wedding on the Amalfi Coast',
	},
	{
		id: 'venezia',
		nome: 'Venice',
		breve: 'Venice',
		tinta: 'pompeiano',
		claim: 'A palazzo, a canal, no cars.',
		testo: 'Arrive by water. Marry in a room painted four centuries ago. Guests move on foot and by boat, and we keep the timetable.',
		fatti: [
			['Guests', '10 to 70'],
			['Season', 'March to November'],
			['Getting there', 'By boat from the airport'],
		],
		storia: {
			kicker: 'A little history',
			titolo: 'Rooms above the tide',
			testo:
				'Venice grew on the islands of a lagoon and was a Republic until 1797. Its palazzi face the water, with the grand rooms on the first floor, the piano nobile, above the tide. That is why so many ceremonies happen in a hall painted four centuries ago.',
		},
		sapere: {
			kicker: 'Good to know',
			titolo: 'Everything by water',
			punti: [
				'No cars: luggage and guests move by water taxi, on foot and over bridges with steps.',
				'Acqua alta comes mostly between autumn and early spring, and we always have a plan B.',
				'Some palazzi are licensed for civil ceremonies; others host the reception and dinner.',
			],
		},
		chiusura: {
			kicker: 'At a glance',
			titolo: 'Arrive by boat',
			testo: 'A timetable we keep, in a city that does not hurry.',
		},
		scatti: [
			{
				file: 'venezia-1', tono: 'chiaro',
				alt: 'The Grand Canal and the dome of Santa Maria della Salute seen from above in early light',
				cap: 'The Grand Canal from above',
			},
			{
				file: 'venezia-2', tono: 'chiaro',
				alt: 'A small arched bridge with iron railings and worn stone steps over a green canal',
				cap: 'A bridge on the quiet side',
			},
			{
				file: 'venezia-3', tono: 'chiaro',
				alt: 'A canal at dusk with lit palazzi, moored boats and a violet sky reflected in the water',
				cap: 'The canal at dusk',
			},
		],
		disposizione: 'a',
		tonoNome: 'chiaro',
		tonoNav: 'scuro',
		cta: 'Plan a wedding in Venice',
		video: {
			file: 'venezia-chiave',
			alt: 'Moored boats and red brick palazzi on a quiet Venetian canal, seen through a gap between two walls',
		},
	},
];

export const luoghi = [...sale.map((s) => s.nome), 'Not sure yet'];
