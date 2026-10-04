// Dati dell'hub: una vetrina per voce. Per aggiungere un concept basta una voce qui
// (e il suo percorso in src/pages/<macrocategoria>/<variante>/).
import cardTrattoria from '../assets/hub/card-trattoria.jpg';
import cardOssidiana from '../assets/hub/card-ossidiana.jpg';
import shotTrattoria from '../assets/hub/shot-trattoria.jpg';
import shotOssidiana from '../assets/hub/shot-ossidiana.jpg';

export const SITE = 'https://theloopstudio.org/';
export const CONTACT = 'https://theloopstudio.org/contatti';
export const LAB = 'https://theloopstudio.org/lab/';
export const REPO = 'https://github.com/Loop-Studio-Web/vetrine';

export type Concept = {
	slug: string;
	nome: string;
	categoria: string;
	archetipo: string;
	claim: string;
	path: string; // relativo alla base
	awning: [string, string];
	glow: string;
	card: ImageMetadata;
	shot: ImageMetadata;
	shotAlt: string;
	crop: string; // object-position della miniatura nella via
	cardAlt: string;
	mood: string;
	caratteri: string;
	palette: string[];
	punti: string[];
	metriche: { label: string; valore: string }[];
};

export const concepts: Concept[] = [
	{
		slug: 'trattoria',
		nome: 'Trattoria del Borgo',
		categoria: 'Ristorazione',
		archetipo: 'La trattoria di quartiere',
		claim: 'Ristorazione autentica, rimodernizzata. Qualità senza pretese.',
		path: '/ristorazione/trattoria/',
		awning: ['#b5412a', '#f6f0e6'],
		glow: 'rgba(181, 65, 42, 0.55)',
		card: cardTrattoria,
		shot: shotTrattoria,
		shotAlt: '',
		crop: '50% 45%',
		cardAlt: 'La Trattoria del Borgo su desktop e su telefono: un video di cucina a schermo intero dietro una scheda traslucida, accenti color terracotta.',
		mood: 'Luce del giorno, terracotta, carta. Tema chiaro e scuro con selettore.',
		caratteri: 'Newsreader e Space Grotesk',
		palette: ['#f6f0e6', '#ece3d3', '#2a1f1a', '#b5412a', '#5c6a2e', '#a8741a'],
		punti: [
			'Hero a schermo intero con video e locandina di riserva',
			'Diario dei piatti in stile social',
			'Recensioni di esempio e prenotazione del tavolo in più passaggi',
			'Mappa illustrata in SVG',
		],
		metriche: [
			{ label: 'Performance', valore: '99' },
			{ label: 'Accessibilità', valore: '100' },
			{ label: 'Buone pratiche', valore: '100' },
		],
	},
	{
		slug: 'ossidiana',
		nome: 'Ossidiana',
		categoria: 'Ristorazione',
		archetipo: 'Il ristorante da menù degustazione',
		claim: 'Una cena in cinque atti, in una sala che resta al buio.',
		path: '/ristorazione/grande-ristorante/',
		awning: ['#7a1426', '#151517'],
		glow: 'rgba(210, 86, 107, 0.5)',
		card: cardOssidiana,
		shot: shotOssidiana,
		shotAlt: '',
		crop: '80% 50%',
		cardAlt: 'Ossidiana su desktop e su telefono: un piatto di anatra illuminato come su un palco, appunti dello chef scritti a penna.',
		mood: 'Teatrale, silenzioso, preciso. Solo tema scuro, per scelta.',
		caratteri: 'Bodoni Moda, Jost e un corsivo a penna',
		palette: ['#0b0b0c', '#151517', '#efe9dd', '#7a1426', '#d2566b'],
		punti: [
			'Una luce che segue il cursore, e vaga da sola sul touch',
			'Percorso in cinque portate a scorrimento orizzontale',
			'Atlante dei produttori con mappa e stagioni',
			'Prenotazione con controlli e riepilogo',
		],
		metriche: [
			{ label: 'Performance', valore: '97' },
			{ label: 'Accessibilità', valore: '100' },
			{ label: 'Buone pratiche', valore: '100' },
		],
	},
];

export const prossime = [
	{ nome: 'Home restaurant', categoria: 'Ristorazione' },
	{ nome: 'RistoPub', categoria: 'Ristorazione' },
	{ nome: 'Legale e professionale', categoria: 'Studi e servizi' },
	{ nome: 'Beauty e wellness', categoria: 'Benessere' },
	{ nome: 'Negozio locale', categoria: 'Commercio' },
];
