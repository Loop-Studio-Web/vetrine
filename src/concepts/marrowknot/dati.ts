// Contenuti di Marrow & Knot (planner di nozze di fantasia, in inglese). Unica fonte per sale, menù e modulo.

export interface Scatto {
	file: string; // in src/assets/marrowknot/foto
	alt: string;
	cap: string; // didascalia breve che cambia con la foto
}

export interface Sala {
	id: string;
	nome: string; // nome del luogo, anche per il menù
	breve: string; // voce corta di navigazione e nome gigante
	tinta: 'pompeiano' | 'verderame' | 'vino' | 'marmo' | 'carminio';
	titolo: string;
	testo: string;
	fatti: [string, string][];
	/** un po' di storia e di contesto per chi arriva da lontano */
	storia: string;
	sapere: string[];
	/** le foto di sfondo: si danno il cambio, tessendosi, mentre si attraversa la sala */
	scatti: Scatto[];
	/** 'a' = testo a sinistra, 'b' = testo a destra */
	disposizione: 'a' | 'b';
	cta: string;
	/** video nella serratura (solo Venezia) */
	video?: { file: string; alt: string };
}

export const ingresso: Scatto = {
	file: 'ingresso',
	alt: 'Domes and bell towers of Venice in silhouette against an orange sunset, with flocks of birds',
	cap: 'Venice at the end of the day',
};

export const sale: Sala[] = [
	{
		id: 'como',
		nome: 'Lake Como',
		breve: 'Como',
		tinta: 'verderame',
		titolo: 'A loggia over deep water.',
		testo:
			'Vows on a stone terrace, a wooden boat to dinner, cypress for walls. Como suits couples who want hush and grandeur in the same hour.',
		fatti: [
			['Guests', '20 to 80'],
			['Season', 'April to October'],
			['From Milan', 'About an hour by car'],
		],
		storia:
			'Lake Como has been a retreat for the families of Milan since Roman times: Pliny the Younger, born in the town of Como, wrote about his villas on the shore. Most of the grand houses you see today were built between the 1500s and the 1800s as summer homes, and many still keep their terraced gardens down to the water.',
		sapere: [
			'The lake is long and narrow: the shores are linked by ferries and private boats, and the roads are slow.',
			'Several villas are licensed for civil ceremonies, so you can marry where you celebrate.',
			'Water is the setting, not the backdrop: we plan boat times as carefully as the menu.',
		],
		scatti: [
			{ file: 'como-1', alt: 'A villa on a wooded promontory reflected in the still water of Lake Como', cap: 'A villa on the water' },
			{ file: 'como-3', alt: 'A narrow lane of shuttered ochre houses with an iron lantern and the lake between the mountains', cap: 'The lanes above the water' },
			{ file: 'como-2', alt: 'A columned loggia with cypress trees and potted cacti opening onto the lake', cap: 'The loggia, before the guests arrive' },
			{ file: 'como-4', alt: 'The sun setting behind the mountains over Lake Como, with a villa among cypress trees', cap: 'Sunset over the lake' },
		],
		disposizione: 'a',
		cta: 'Plan a wedding on Lake Como',
	},
	{
		id: 'puglia',
		nome: 'Puglia',
		breve: 'Puglia',
		tinta: 'vino',
		titolo: 'Whitewashed courtyards, olive trees, a long table.',
		testo:
			'Dinner starts late and nobody checks the time. Stone cones for roofs, a courtyard that holds eighty people and the dark that comes down soft.',
		fatti: [
			['Guests', '40 to 160'],
			['Season', 'May to October'],
			['From Bari', 'About an hour by car'],
		],
		storia:
			'Puglia is the heel of Italy, and it has lived off olives, wheat and the sea for thousands of years: it still produces more olive oil than any other Italian region. The trulli, round houses of dry stone with conical roofs, are typical of the Itria Valley, and the ones in Alberobello are a UNESCO World Heritage Site. The masserie, fortified farmhouses, were the working heart of the countryside.',
		sapere: [
			'Summer afternoons are hot: ceremonies are usually after five, and dinner starts late.',
			'Food is the main event: expect fresh burrata, orecchiette and a long table that does not hurry.',
			'The nearest airports are Bari and Brindisi; most venues are an hour or so from either.',
		],
		scatti: [
			{ file: 'puglia-1', alt: 'A carved stone palazzo with a stair and arcades above the sea', cap: 'A palazzo above the sea' },
			{ file: 'puglia-4', alt: 'White limestone cliffs above clear turquoise water', cap: 'The cliffs and the clear sea' },
			{ file: 'puglia-2', alt: 'A blue arched door in a white wall with prickly pears in pots', cap: 'A blue door and prickly pears' },
			{ file: 'puglia-3', alt: 'Whitewashed trulli with conical stone roofs along a quiet lane', cap: 'Trulli, after the sun goes down' },
		],
		disposizione: 'b',
		cta: 'Plan a wedding in Puglia',
	},
	{
		id: 'costiera',
		nome: 'Amalfi Coast',
		breve: 'Amalfi',
		tinta: 'marmo',
		titolo: 'A pergola, a sea, a very long lunch.',
		testo:
			'Terraces shaded by lemon and wisteria, stairs that turn every arrival into an entrance. Small weddings, planned down to the last step.',
		fatti: [
			['Guests', '10 to 50'],
			['Season', 'April to October'],
			['From Naples', 'About ninety minutes'],
		],
		storia:
			'The Amalfi Coast was home to one of Italy\'s great maritime republics: from the ninth to the twelfth century, Amalfi traded across the Mediterranean. The steep cliffs were turned into terraces by hand, and the lemon groves, shaded by wooden pergolas, still supply the famous sfusato lemons. The coast has been a UNESCO World Heritage Site since 1997.',
		sapere: [
			'There is one narrow road along the coast and it is busy in summer: we move guests by boat and by small shuttle.',
			'Almost everything involves stairs, so we plan shoes, routes and quiet corners for people who need them.',
			'Venues are small and intimate, which is why the guest lists are short.',
		],
		scatti: [
			{ file: 'amalfi-1', alt: 'Pink flowers in the foreground and the Amalfi coast fading into the haze', cap: 'Morning above the terraces' },
			{ file: 'amalfi-2', alt: 'A turquoise bay with small boats under a green cliff and a village', cap: 'The bay at noon' },
			{ file: 'amalfi-3', alt: 'An arched window with climbing plants framing the sea and two stools at a counter', cap: 'Lunch with the window open' },
			{ file: 'amalfi-4', alt: 'Positano lit up at dusk on its cliff above a calm sea', cap: 'Positano, when the lights come on' },
		],
		disposizione: 'a',
		cta: 'Plan a wedding on the Amalfi Coast',
	},
	{
		id: 'toscana',
		nome: 'Tuscany',
		breve: 'Tuscany',
		tinta: 'carminio',
		titolo: 'A stone farmhouse at the end of the cypress road.',
		testo:
			'Green shutters, a brick staircase and a field that goes gold by six. We use farmhouses we know, with kitchens that cook for a crowd.',
		fatti: [
			['Guests', '30 to 120'],
			['Season', 'April to October'],
			['From Florence', 'About an hour and a quarter'],
		],
		storia:
			'The Tuscan countryside as you know it, with cypress-lined roads and stone farmhouses, grew out of centuries of farming. Families worked the land under the mezzadria system, a form of sharecropping, and built the poderi, the farmhouses that now host weddings. Parts of the region, like the Val d\'Orcia, are UNESCO World Heritage landscapes.',
		sapere: [
			'Late spring and September are the sweet spots; July and August are hot, and the harvest brings the grapes in autumn.',
			'Many farmhouses have their own kitchens and sleep part of the guest list on site.',
			'Florence, Siena and the airports are an hour or two away, so day trips for guests are easy.',
		],
		scatti: [
			{ file: 'toscana-1', alt: 'Green hills in the mist with a farmhouse among cypress trees at sunrise', cap: 'Mist at sunrise' },
			{ file: 'toscana-2', alt: 'Golden rolling hills with a cypress-lined road leading to a farmhouse', cap: 'The cypress road' },
			{ file: 'toscana-3', alt: 'A vine terrace with a small table and chairs under a curtain, hills beyond', cap: 'A table on the terrace' },
			{ file: 'toscana-4', alt: 'The dome and bell tower of Florence above red roofs in warm light', cap: 'Florence is an hour away' },
		],
		disposizione: 'b',
		cta: 'Plan a wedding in Tuscany',
	},
	{
		id: 'venezia',
		nome: 'Venice',
		breve: 'Venice',
		tinta: 'pompeiano',
		titolo: 'A palazzo, a canal, no cars.',
		testo:
			'Arrive by water. Marry in a room painted four centuries ago. Guests move on foot and by boat, and we keep the timetable.',
		fatti: [
			['Guests', '10 to 70'],
			['Season', 'March to November'],
			['Getting there', 'By boat from the airport'],
		],
		storia:
			'Venice grew on the islands of a lagoon from around the fifth century and became a Republic that lasted until 1797. Its palazzi were built facing the water, with the grand rooms on the first floor, called the piano nobile, to stay above the tide. That is why so many ceremonies happen in a hall painted by artists four centuries ago.',
		sapere: [
			'There are no cars: luggage and guests move by water taxi, on foot and over bridges with steps.',
			'High water, the acqua alta, happens mostly between autumn and early spring, and we always have a plan B.',
			'Some palazzi are licensed for civil ceremonies; others work as the reception and dinner.',
		],
		scatti: [
			{ file: 'venezia-1', alt: 'The Grand Canal and the dome of Santa Maria della Salute seen from above in early light', cap: 'The Grand Canal from above' },
			{ file: 'venezia-2', alt: 'A small arched bridge with iron railings and worn stone steps over a green canal', cap: 'A bridge on the quiet side' },
			{ file: 'venezia-3', alt: 'A canal at dusk with lit palazzi, moored boats and a violet sky reflected in the water', cap: 'The canal at dusk' },
		],
		disposizione: 'a',
		cta: 'Plan a wedding in Venice',
		video: {
			file: 'venezia-chiave',
			alt: 'Moored boats and red brick palazzi on a quiet Venetian canal, seen through a gap between two walls',
		},
	},
];

export const luoghi = [...sale.map((s) => s.nome), 'Not sure yet'];
