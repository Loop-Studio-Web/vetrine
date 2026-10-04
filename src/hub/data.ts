// Dati dell'hub: una vetrina per voce. Per aggiungere un concept basta una voce qui
// (e il suo percorso in src/pages/<macrocategoria>/<variante>/, più la pagina info accanto).
import cardTrattoria from '../assets/hub/card-trattoria.jpg';
import cardOssidiana from '../assets/hub/card-ossidiana.jpg';
import shotTrattoria from '../assets/hub/shot-trattoria.jpg';
import shotOssidiana from '../assets/hub/shot-ossidiana.jpg';

export const SITE = 'https://theloopstudio.org/';
export const CONTACT = 'https://theloopstudio.org/contatti';
export const LAB = 'https://theloopstudio.org/lab/';
export const REPO = 'https://github.com/Loop-Studio-Web/vetrine';

// Macrocategorie: filtro dell'hub. L'ordine è quello dei chip.
export const macros = [
	{ slug: 'ristorazione', nome: 'Ristorazione' },
	{ slug: 'studi', nome: 'Studi e servizi' },
	{ slug: 'benessere', nome: 'Benessere' },
	{ slug: 'commercio', nome: 'Commercio' },
] as const;
export type MacroSlug = (typeof macros)[number]['slug'];

export type Concept = {
	slug: string;
	macro: MacroSlug;
	nome: string;
	categoria: string;
	archetipo: string;
	claim: string;
	path: string; // relativo alla base
	infoPath: string; // pagina di dettaglio, relativa alla base
	titoloSeo: string;
	descrizioneSeo: string;
	intro: string[]; // paragrafi della pagina di dettaglio
	perChi: string;
	sezioni: { t: string; d: string }[];
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
	metriche: { label: string; valore: string }[];
};

export const concepts: Concept[] = [
	{
		slug: 'trattoria',
		macro: 'ristorazione',
		nome: 'Trattoria del Borgo',
		categoria: 'Ristorazione',
		archetipo: 'La trattoria di quartiere',
		claim: 'Ristorazione autentica, rimodernizzata. Qualità senza pretese.',
		path: '/ristorazione/trattoria/',
		infoPath: '/ristorazione/trattoria/info/',
		titoloSeo: 'Sito web per trattoria: homepage concept con prenotazione e menù',
		descrizioneSeo:
			'Come potrebbe essere la homepage di una trattoria di quartiere: video a schermo intero, diario dei piatti, recensioni, prenotazione del tavolo. Concept dimostrativo di Loop Studio.',
		intro: [
			'Una trattoria vive di fiducia e di abitudine: chi entra vuole capire in pochi secondi che cosa mangerà, quanto spenderà e se c’è posto stasera. Questa homepage parte da lì. Il sito parla come parlerebbe il gestore, senza paroloni, e mette in primo piano i piatti e il tavolo da prenotare.',
			'È una vetrina dimostrativa: il locale, i piatti, gli indirizzi e le recensioni sono di fantasia. Serve a mostrare che cosa può diventare il sito di una trattoria vera quando viene disegnato intorno a lei e non adattato da un modello.',
		],
		perChi:
			'Trattorie e osterie di quartiere, locali a gestione familiare o giovane, cucina del territorio senza formalità. Adatta a chi vuole farsi trovare, far vedere i piatti e ricevere prenotazioni senza intermediari.',
		sezioni: [
			{
				t: 'Un video a schermo intero in apertura',
				d: 'La prima cosa che si vede è la cucina in movimento, con una locandina fissa di riserva per le connessioni lente. Il nome del locale e il pulsante per prenotare restano sempre a portata di pollice.',
			},
			{
				t: 'Il diario dei piatti, come un profilo social',
				d: 'I piatti del giorno si raccontano con foto e due righe, nel formato che i clienti già conoscono. Il gestore aggiorna il diario senza toccare il resto del sito.',
			},
			{
				t: 'Recensioni e prenotazione in più passaggi',
				d: 'Le recensioni danno la prova sociale; la prenotazione guida data, orario e persone un passo alla volta, con un riepilogo prima della conferma.',
			},
			{
				t: 'Una mappa illustrata invece di un riquadro generico',
				d: 'Come arrivare è disegnato in SVG, nei colori del locale: si carica subito, non traccia nessuno ed è leggibile anche con il sole sullo schermo.',
			},
		],
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
		metriche: [
			{ label: 'Performance', valore: '99' },
			{ label: 'Accessibilità', valore: '100' },
			{ label: 'Buone pratiche', valore: '100' },
		],
	},
	{
		slug: 'ossidiana',
		macro: 'ristorazione',
		nome: 'Ossidiana',
		categoria: 'Ristorazione',
		archetipo: 'Il ristorante da menù degustazione',
		claim: 'Una cena in cinque atti, in una sala che resta al buio.',
		path: '/ristorazione/grande-ristorante/',
		infoPath: '/ristorazione/grande-ristorante/info/',
		titoloSeo: 'Sito web per ristorante di classe: homepage concept con menù degustazione',
		descrizioneSeo:
			'Come potrebbe essere la homepage di un ristorante da menù degustazione: percorso in cinque portate, atlante dei produttori, prenotazione. Concept dimostrativo di Loop Studio.',
		intro: [
			'Un ristorante da menù degustazione vende un’esperienza prima ancora di un pasto. Il sito deve far arrivare il tono della sala: il buio, il ritmo lento, la cura del dettaglio. Ossidiana lo fa con una cena raccontata in cinque atti, da scorrere come si assaggia.',
			'È una vetrina dimostrativa: il ristorante, lo chef, i produttori e gli indirizzi sono di fantasia. Il concept mostra come si può trattare un locale di fascia alta con un linguaggio visivo proprio, senza ricorrere a un modello generico.',
		],
		perChi:
			'Ristoranti di alta cucina, locali con menù degustazione, sale che puntano sull’atmosfera e su una clientela che prenota in anticipo. Adatta a chi vuole un sito che somigli alla serata.',
		sezioni: [
			{
				t: 'Una luce che segue il cursore',
				d: 'Su desktop un fascio di luce segue il mouse, come un faretto su un piatto. Su touch, dove il cursore non esiste, la luce vaga da sola con calma, senza chiedere nulla a chi guarda.',
			},
			{
				t: 'Il percorso in cinque portate',
				d: 'Le portate si scorrono in orizzontale, una per schermata, con un lento zoom sulle foto. Il racconto della cena ha un inizio e una fine, e si capisce sempre a che punto si è.',
			},
			{
				t: 'L’atlante dei produttori',
				d: 'Una mappa con i produttori e le stagioni mostra da dove arriva ciò che c’è nel piatto: un modo concreto di far valere la materia prima.',
			},
			{
				t: 'Prenotazione con controlli e riepilogo',
				d: 'Per un locale con pochi coperti ogni prenotazione conta: il modulo verifica i dati e mostra il riepilogo prima dell’invio, per ridurre errori e disdette.',
			},
		],
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
		metriche: [
			{ label: 'Performance', valore: '97' },
			{ label: 'Accessibilità', valore: '100' },
			{ label: 'Buone pratiche', valore: '100' },
		],
	},
];

export const prossime: { nome: string; categoria: string; macro: MacroSlug }[] = [
	{ nome: 'RistoPub', categoria: 'Ristorazione', macro: 'ristorazione' },
	{ nome: 'Legale e professionale', categoria: 'Studi e servizi', macro: 'studi' },
	{ nome: 'Beauty e wellness', categoria: 'Benessere', macro: 'benessere' },
	{ nome: 'Negozio locale', categoria: 'Commercio', macro: 'commercio' },
];
