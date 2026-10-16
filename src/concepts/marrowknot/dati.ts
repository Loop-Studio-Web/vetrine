// Contenuti di Marrow & Knot (planner di nozze di fantasia, in inglese). Unica fonte per sale, menù e modulo.

export interface Sala {
	id: string;
	nome: string; // nome del luogo, anche per il menù
	breve: string; // voce corta di navigazione
	tinta: 'pompeiano' | 'verderame' | 'vino' | 'marmo' | 'carminio';
	titolo: string;
	testo: string;
	fatti: [string, string][];
	/** foto grande ad arco e foto bassa: file in src/assets/marrowknot/foto, alt */
	a: { file: string; alt: string };
	b: { file: string; alt: string } | { video: string; alt: string };
	/** 'a' = arco alto a sinistra, 'b' = arco alto a destra */
	disposizione: 'a' | 'b';
	cta: string;
}

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
		a: { file: 'como-arcata', alt: 'A columned loggia with potted plants opening onto the lake and mountains' },
		b: { file: 'como-isola', alt: 'A villa on a wooded promontory in the turquoise lake' },
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
		a: { file: 'puglia-trulli', alt: 'A whitewashed lane of trulli with a vine over an arched doorway' },
		b: { file: 'puglia-mare', alt: 'Cliffside houses over the sea at sunset' },
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
		a: { file: 'costiera-pergola', alt: 'A pergola of wood beams and bougainvillea on a terrace over the sea' },
		b: { file: 'costiera-ravello', alt: 'Church domes and a pine tree above the blue coast of Ravello' },
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
		a: { file: 'toscana-finestra', alt: 'Cypress trees on a green hill, framed by a dark window' },
		b: { file: 'toscana-villa', alt: 'An old brick farmhouse with green shutters and an outside staircase' },
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
		a: { file: 'venezia-ponte', alt: 'A white stone bridge between two palazzi over a narrow canal' },
		b: { video: 'venezia-chiave', alt: 'Moored boats and red brick palazzi on a quiet Venetian canal, seen through a gap between two walls' },
		disposizione: 'a',
		cta: 'Plan a wedding in Venice',
	},
];

export const luoghi = [...sale.map((s) => s.nome), 'Not sure yet'];
