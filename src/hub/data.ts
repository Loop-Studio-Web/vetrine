// Dati dell'hub: una vetrina per voce. Per aggiungere un concept basta una voce qui
// (e il suo percorso in src/pages/<macrocategoria>/<variante>/, più la pagina info accanto).
import cardTrattoria from '../assets/hub/card-trattoria.jpg';
import cardOssidiana from '../assets/hub/card-ossidiana.jpg';
import shotTrattoria from '../assets/hub/shot-trattoria.jpg';
import shotOssidiana from '../assets/hub/shot-ossidiana.jpg';
import cardRistopub from '../assets/hub/card-ristopub.jpg';
import shotRistopub from '../assets/hub/shot-ristopub.jpg';
import cardBarbiere from '../assets/hub/card-barbiere.jpg';
import shotBarbiere from '../assets/hub/shot-barbiere.jpg';
import cardLumen from '../assets/hub/card-lumen.jpg';
import shotLumen from '../assets/hub/shot-lumen.jpg';
import cardAeterna from '../assets/hub/card-aeterna.jpg';
import shotAeterna from '../assets/hub/shot-aeterna.jpg';
import cardFixlab from '../assets/hub/card-fixlab.jpg';
import shotFixlab from '../assets/hub/shot-fixlab.jpg';
import cardHotswap from '../assets/hub/card-hotswap.jpg';
import shotHotswap from '../assets/hub/shot-hotswap.jpg';
import cardOrdito from '../assets/hub/card-ordito.jpg';
import shotOrdito from '../assets/hub/shot-ordito.jpg';
import cardSifone from '../assets/hub/card-sifone.jpg';
import shotSifone from '../assets/hub/shot-sifone.jpg';

export const SITE = 'https://theloopstudio.org/';
export const CONTACT = 'https://theloopstudio.org/contatti';
export const LAB = 'https://theloopstudio.org/lab/';
export const REPO = 'https://github.com/Loop-Studio-Web/vetrine';

// Macrocategorie: filtro dell'hub. L'ordine è quello dei chip.
export const macros = [
	{ slug: 'ristorazione', nome: 'Ristorazione' },
	{ slug: 'studi', nome: 'Studi e servizi' },
	{ slug: 'benessere', nome: 'Benessere' },
	{ slug: 'tech', nome: 'Tech' },
	{ slug: 'casa', nome: 'Casa e artigiani' },
	{ slug: 'commercio', nome: 'Commercio' },
] as const;
export type MacroSlug = (typeof macros)[number]['slug'];

// I livelli sono relativi alla macrocategoria: dalla vetrina più essenziale alla più ricca del settore.
export const livelli = [
	{
		n: 1,
		nome: 'Essenziale',
		d: 'Una homepage chiara, con carattere, che fa bene il suo lavoro: si capisce chi sei, cosa offri e come contattarti. Movimento discreto, pochi strumenti.',
		perChi: 'Per chi vuole farsi trovare e dare subito fiducia.',
	},
	{
		n: 2,
		nome: 'Evoluto',
		d: 'Oltre a presentarti, la pagina fa qualcosa: si sceglie, si filtra, si prenota con più passaggi, si esplora. Movimento curato e dettagli che si notano.',
		perChi: 'Per chi vuole distinguersi dalla concorrenza e guidare il cliente verso una scelta.',
	},
	{
		n: 3,
		nome: 'Esperienza',
		d: 'La homepage è parte del servizio: un percorso orchestrato, scene e interazioni che raccontano l’attività prima ancora di incontrarla.',
		perChi: 'Per chi vende atmosfera, fiducia o innovazione e vuole che il sito sia memorabile.',
	},
] as const;
export const lingueNomi = { IT: 'Italiano', EN: 'Inglese', ES: 'Spagnolo' } as const;

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
	livello: 1 | 2 | 3; // relativo al settore: 1 Essenziale, 2 Evoluto, 3 Esperienza
	lingua: 'IT' | 'EN' | 'ES';
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
		livello: 1,
		lingua: 'IT',
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
		slug: 'ristopub',
		macro: 'ristorazione',
		nome: 'Luppolo & Watt',
		categoria: 'Ristorazione',
		archetipo: 'Il birrificio-pub con il palco',
		claim: 'Otto spine fatte in casa, panini con le mani e musica dal vivo.',
		path: '/ristorazione/ristopub/',
		infoPath: '/ristorazione/ristopub/info/',
		titoloSeo: 'Sito web per pub e birrificio: homepage concept con spine, eventi e prenotazione',
		descrizioneSeo:
			'Come potrebbe essere la homepage di un pub con birrificio e musica dal vivo: lavagna delle spine, calendario serate, prenotazione del tavolo o della serata. Concept dimostrativo di Loop Studio.',
		intro: [
			'Un pub vive di due cose: che cosa si beve e che cosa succede la sera. Questa homepage le mette sullo stesso piano. La lavagna delle spine dice subito che birre ci sono e con quale panino vanno d’accordo; il calendario dice chi suona stasera e permette di prenotare il posto con un tocco.',
			'È una vetrina dimostrativa: il locale, le birre, i gruppi, i prezzi e gli indirizzi sono di fantasia. Serve a mostrare come può essere il sito di un pub quando ha un’identità forte e le informazioni che i clienti cercano davvero, senza ricorrere a un modello generico.',
		],
		perChi:
			'Pub, birrifici artigianali, birrerie con cucina e locali che fanno musica dal vivo o serate a tema. Adatta a chi cambia spesso la carta delle birre e il programma, e vuole che il sito resti sempre aggiornato e facile da gestire.',
		sezioni: [
			{
				t: 'La lavagna delle spine, sempre aggiornata',
				d: 'Le birre si filtrano per tipo e si aprono una alla volta: grado, amaro, colore e prezzo, con un bicchiere che si riempie. Cambiare una spina vuol dire cambiare una riga di dati.',
			},
			{
				t: 'Ogni piatto indica la sua birra',
				d: 'Dal menù, un tocco su «in coppia con…» porta alla scheda della birra giusta. L’abbinamento diventa una guida per scegliere, non una nota a piè di pagina.',
			},
			{
				t: 'Un calendario che non invecchia',
				d: 'Le serate si calcolano a partire da oggi: la pagina mostra sempre i prossimi appuntamenti e si filtra per live, quiz, assaggi e partite. Il pulsante «Prenota» arriva al modulo già compilato con la serata scelta.',
			},
			{
				t: 'Un menù mobile che si versa',
				d: 'Su telefono il menù si riempie di birra dal basso, con la schiuma in cima e le bollicine che salgono. Un gesto che racconta il locale prima ancora di leggere una parola.',
			},
		],
		awning: ['#e8921a', '#1a1815'],
		glow: 'rgba(232, 146, 26, 0.55)',
		livello: 2,
		lingua: 'IT',
		card: cardRistopub,
		shot: shotRistopub,
		shotAlt: '',
		crop: '35% 50%',
		cardAlt: 'Luppolo & Watt su desktop e su telefono: titolo gigante su fondo ambra, polaroid di una birra con la schiuma, menù mobile che si riempie di birra.',
		mood: 'Etichetta e locandina: carta kraft, ambra, inchiostro. Una sola luce chiara, con un palco scuro.',
		caratteri: 'Big Shoulders Display e Archivo',
		palette: ['#f1e8d4', '#e6d9bb', '#1a1815', '#e8921a', '#a82915', '#3d6a2a'],
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
		livello: 3,
		lingua: 'IT',
		card: cardOssidiana,
		shot: shotOssidiana,
		shotAlt: '',
		crop: '80% 50%',
		cardAlt: 'Ossidiana su desktop e su telefono: un piatto di anatra illuminato come su un palco, appunti dello chef scritti a penna.',
		mood: 'Teatrale, silenzioso, preciso. Solo tema scuro, per scelta.',
		caratteri: 'Bodoni Moda, Jost e un corsivo a penna',
		palette: ['#0b0b0c', '#151517', '#efe9dd', '#7a1426', '#d2566b'],
		metriche: [
			{ label: 'Performance', valore: '100' },
			{ label: 'Accessibilità', valore: '100' },
			{ label: 'Buone pratiche', valore: '100' },
		],
	},
	{
		slug: 'barbiere',
		macro: 'benessere',
		nome: 'Bottega Tre Rasoi',
		categoria: 'Benessere',
		archetipo: 'Il barbiere di quartiere',
		claim: 'Taglio, barba e rasoio, senza fretta. Si prende il numero come in bottega.',
		path: '/benessere/barbiere/',
		infoPath: '/benessere/barbiere/info/',
		titoloSeo: 'Sito web per barbiere: homepage concept con listino, sedie e prenotazione a turno',
		descrizioneSeo:
			'Come potrebbe essere la homepage di un barbiere di quartiere: listino dei servizi, scelta del barbiere, prenotazione a turno con il numerino. Concept dimostrativo di Loop Studio.',
		intro: [
			'Un barbiere di quartiere non ha bisogno di effetti speciali: ha bisogno che chi cerca un taglio trovi subito che cosa costa, da chi può sedersi e quando c’è posto. Questa homepage mette quelle tre cose in primo piano e le racconta con il linguaggio della bottega: il palo che gira, il tariffario appeso al muro, il numerino da prendere.',
			'È una vetrina dimostrativa: il locale, i barbieri, i prezzi e gli indirizzi sono di fantasia. Serve a mostrare come può essere il sito di un’attività semplice e curata, con un budget contenuto, senza ricorrere a un modello generico.',
		],
		perChi:
			'Barbieri, parrucchieri uomo e piccoli saloni di quartiere che lavorano su appuntamento e vogliono togliersi le telefonate. Adatta a chi ha poche sedie, un listino chiaro e una clientela che torna.',
		sezioni: [
			{
				t: 'Il listino come un tariffario appeso',
				d: 'Servizi, prezzi e durate in una bacheca leggibile in due secondi. Cambiare un prezzo vuol dire cambiare una riga di dati.',
			},
			{
				t: 'Tre sedie, e il prossimo posto libero',
				d: 'Ogni barbiere ha la sua sedia numerata, anche sulla foto della sala, con l’orario del primo posto libero calcolato da oggi. Un tocco e la prenotazione parte già con quella sedia.',
			},
			{
				t: 'Prenotazione “a turno”, con il numerino',
				d: 'Servizio, sedia, giorno e ora, con controlli sui dati. Alla fine si “stampa” il numerino con il riepilogo: la prenotazione ha un gesto che la rende memorabile.',
			},
			{
				t: 'Un menù mobile che si stende e un cursore a forbici',
				d: 'Su telefono il menù è un asciugamano caldo che si stende dall’alto. Con il mouse il puntatore diventa un paio di forbici che si aprono sui link e si chiudono al click.',
			},
		],
		awning: ['#1f4d3a', '#f2e8d5'],
		glow: 'rgba(31, 110, 78, 0.55)',
		livello: 1,
		lingua: 'IT',
		card: cardBarbiere,
		shot: shotBarbiere,
		shotAlt: '',
		crop: '40% 50%',
		cardAlt: 'Bottega Tre Rasoi su desktop e su telefono: un titolo grande su fondo crema, un barbiere al lavoro in un arco con il palo a righe, il menù mobile che si stende come un asciugamano.',
		mood: 'Crema, verde bottiglia e ottone: la bottega di quartiere, luminosa, con un tema scuro “chiusura serale”.',
		caratteri: 'Fraunces e Figtree',
		palette: ['#f2e8d5', '#e8dbc0', '#1f4d3a', '#143426', '#b8892f', '#17211c'],
		metriche: [
			{ label: 'Performance', valore: '95' },
			{ label: 'Accessibilità', valore: '100' },
			{ label: 'Buone pratiche', valore: '100' },
		],
	},
	{
		slug: 'lumen',
		macro: 'benessere',
		nome: 'Atelier Lumen',
		categoria: 'Benessere',
		archetipo: 'Il centro estetico a base di luce',
		claim: 'La pelle ha una luce. La ritroviamo. Si sceglie il momento, il resto lo facciamo noi.',
		path: '/benessere/estetica/',
		infoPath: '/benessere/estetica/info/',
		titoloSeo: 'Sito web per centro estetico: homepage concept con rituale su misura e prenotazione',
		descrizioneSeo:
			'Come potrebbe essere la homepage di un centro estetico: trattamenti per momento della giornata, rituale su misura, cabine, boutique e prenotazione per fasce di luce. Concept dimostrativo di Loop Studio.',
		intro: [
			'Un centro estetico vende tempo e cura, e le persone scelgono in base a come si sentono: stanche, tese, con voglia di luce. Questa homepage racconta il centro come una giornata. Dall’alba alla sera cambiano i colori, i trattamenti consigliati e l’ora segnata in alto, mentre si scorre.',
			'È una vetrina dimostrativa: il centro, i trattamenti, i prezzi e gli indirizzi sono di fantasia. Serve a mostrare un livello di sito più ricco di una pagina semplice: movimento, interazioni e un configuratore, pensati per un centro che vuole farsi ricordare.',
		],
		perChi:
			'Centri estetici, saloni con trattamenti, studi di massaggio e piccoli centri benessere che vendono pacchetti e rituali. Adatta a chi ha un listino ampio, cabine diverse e vuole far scegliere il cliente in modo guidato prima di prenotare.',
		sezioni: [
			{
				t: 'Una giornata di luce che scorre con la pagina',
				d: 'Ogni sezione ha il suo momento, dall’alba alla sera, con i suoi colori. Un piccolo orologio solare nella barra segna l’ora a seconda di dove si è arrivati, e un alone di luce segue il mouse.',
			},
			{
				t: 'Un rituale su misura, composto in tempo reale',
				d: 'Tre scelte (tipo di pelle, tempo a disposizione, cosa si cerca) ricompongono il percorso passaggio per passaggio, con durata, prezzo e un colore di luce che cambia. Un tocco e il rituale arriva già scelto nella prenotazione.',
			},
			{
				t: 'Schede che si inclinano, cabine che si aprono',
				d: 'I trattamenti si filtrano per zona e le schede reagiscono al mouse con inclinazione e riflesso. Le tre cabine si espandono una alla volta, ciascuna con la sua luce e il suo carattere.',
			},
			{
				t: 'Prenotazione per fasce di luce',
				d: 'Trattamento, giorno, fascia (mattina, pomeriggio, sera) e contatti, in quattro passaggi con un sole che attraversa il cielo. Alla fine si stampa un “biglietto di luce” con il riepilogo.',
			},
		],
		awning: ['#b9715f', '#f7e3dc'],
		glow: 'rgba(231, 169, 148, 0.55)',
		livello: 2,
		lingua: 'IT',
		card: cardLumen,
		shot: shotLumen,
		shotAlt: '',
		crop: '50% 40%',
		cardAlt: 'Atelier Lumen su desktop e su telefono: titolo elegante su fondo cipria, un arco con una nuvola rosa all’alba, il menù mobile come una tenda che si apre sulla luce.',
		mood: 'Una giornata di luce: cipria, pesca, avorio, oro rosato e prugna. Dall’alba alla sera.',
		caratteri: 'Cormorant e DM Sans',
		palette: ['#f7e3dc', '#fbf3ea', '#f0cdb9', '#b9715f', '#8f4b3d', '#241619'],
		metriche: [
			{ label: 'Performance', valore: '99' },
			{ label: 'Accessibilità', valore: '100' },
			{ label: 'Buone pratiche', valore: '100' },
		],
	},
	{
		slug: 'aeterna',
		macro: 'benessere',
		nome: 'Aeterna',
		categoria: 'Benessere',
		archetipo: 'La clinica di longevità',
		claim: 'La longevità si misura e si progetta. Un’elica di DNA in 3D, un Bio-Assessment e una suite da prenotare.',
		path: '/benessere/longevity/',
		infoPath: '/benessere/longevity/info/',
		titoloSeo: 'Sito web per clinica di longevità: homepage concept con WebGL, Bio-Assessment e prenotazione',
		descrizioneSeo:
			'Come potrebbe essere la homepage di una clinica di longevità: elica di DNA in WebGL, protocolli a scorrimento orizzontale, Bio-Assessment con grafico radar, scanner cellulare e prenotazione della suite. Concept dimostrativo di Loop Studio.',
		intro: [
			'Una clinica di longevità vende fiducia nei dati prima ancora dei trattamenti: chi arriva vuole capire che cosa viene misurato, con quale metodo e che cosa ne esce. Aeterna lo mette in scena con un linguaggio da laboratorio: un’elica di DNA che reagisce al mouse, indicatori biometrici, un percorso in cinque tempi.',
			'È il livello Esperienza della macrocategoria Benessere e una vetrina dimostrativa: la clinica, i medici, i valori, i prezzi e gli indirizzi sono di fantasia, e nulla è un parere medico. Serve a mostrare fin dove si può spingere un sito quando c’è budget per animazioni, grafica in tempo reale e interazioni su misura.',
		],
		perChi:
			'Cliniche private, centri di medicina estetica e della longevità, poliambulatori e brand del benessere premium che vogliono distinguersi con un’esperienza digitale memorabile e un percorso di prenotazione guidato.',
		sezioni: [
			{
				t: 'Un’elica di DNA in WebGL',
				d: 'Nell’apertura una doppia elica di particelle segue il mouse con inerzia, con profondità di campo e uno shader scritto per il progetto. Si scioglie mentre si scorre, e senza WebGL resta un poster in SVG.',
			},
			{
				t: 'Protocolli a scorrimento orizzontale, con lente',
				d: 'La sezione resta ferma e i quattro protocolli scorrono di lato mentre si scende. Su ogni disegno tecnico una lente d’ingrandimento rivela i dettagli minuscoli.',
			},
			{
				t: 'Un Bio-Assessment con radar in tempo reale',
				d: 'Quattro domande senza ricaricare la pagina: il grafico radar si ridisegna a ogni risposta e il report finale consiglia il percorso e precompila la prenotazione.',
			},
			{
				t: 'Scanner cellulare e suite con caparra simulata',
				d: 'Uno slider confronta lo stesso tessuto prima e dopo, con i dati che scorrono. La prenotazione della suite calcola il prezzo in tempo reale e si conferma in un pannello laterale.',
			},
		],
		awning: ['#2b6a5c', '#0c1626'],
		glow: 'rgba(78, 159, 142, 0.55)',
		livello: 3,
		lingua: 'IT',
		card: cardAeterna,
		shot: shotAeterna,
		shotAlt: '',
		crop: '75% 45%',
		cardAlt: 'Aeterna su desktop e su telefono: titolo grande su fondo blu notte, una doppia elica di DNA luminosa in 3D, il menù mobile a scansione.',
		mood: 'Laboratorio di notte: blu abisso, smeraldo e un filo d’oro, con pause chiare “ghiaccio”.',
		caratteri: 'Instrument Serif, Montserrat, JetBrains Mono e Cinzel',
		palette: ['#060b14', '#0c1626', '#4e9f8e', '#86d6c3', '#d4af37', '#e2ece9'],
		metriche: [
			{ label: 'Performance', valore: '90' },
			{ label: 'Accessibilità', valore: '100' },
			{ label: 'Buone pratiche', valore: '100' },
		],
	},
	{
		slug: 'fixlab',
		macro: 'tech',
		nome: 'FIXLAB',
		categoria: 'Tech',
		archetipo: 'Il laboratorio di riparazioni',
		claim: 'La tecnologia si rompe, noi la rimettiamo in funzione. Una scheda di lavoro in due tocchi, prezzi indicativi e un banco con lo smartphone aperto.',
		path: '/tech/riparazioni/',
		infoPath: '/tech/riparazioni/info/',
		titoloSeo: 'Sito web per riparazione smartphone e PC: homepage concept con scheda di lavoro e prezzi',
		descrizioneSeo:
			'Come potrebbe essere la homepage di un laboratorio di riparazione di smartphone, PC, tablet e console: smartphone in vista esplosa, scheda di lavoro con prezzo indicativo, stato della riparazione e richiesta di assistenza. Concept dimostrativo di Loop Studio.',
		intro: [
			'Chi porta un dispositivo rotto ha fretta e un po’ d’ansia: vuole sapere cosa non va, quanto costa e quando torna a usarlo. Questa homepage risponde a queste tre domande prima ancora di entrare in negozio. Il sito è una scheda di lavoro: ogni sezione è un campo da compilare, dalla diagnosi alla richiesta di assistenza.',
			'È il livello Essenziale della categoria Tech e una vetrina dimostrativa: il laboratorio, i prezzi, le recensioni, gli orari e l’indirizzo sono di fantasia. Serve a mostrare che un negozio di quartiere può avere un sito chiaro, rapido e senza effetti inutili, pensato per far arrivare alla richiesta.',
		],
		perChi:
			'Laboratori di riparazione di smartphone e PC, negozi di assistenza informatica, centri di recupero dati e piccoli negozi tech di quartiere. Adatta a chi vuole ridurre le telefonate ripetitive, far capire i prezzi “da” e ricevere richieste già ordinate.',
		sezioni: [
			{
				t: 'Uno smartphone aperto, pezzo per pezzo',
				d: 'In apertura un telefono in vista esplosa, costruito in CSS 3D: ogni pezzo è un servizio con il suo prezzo e, toccandolo, la scheda si compila da sola.',
			},
			{
				t: 'Trova il servizio in due tocchi',
				d: 'Dispositivo e problema, poi compare la scheda di lavoro con prezzo indicativo, tempi, passi e un talloncino numerato. Un tocco e la richiesta parte già precompilata.',
			},
			{
				t: 'Prezzi “da” e segui la riparazione',
				d: 'Un listino per dispositivo con tempi chiari, e un tracker dove si inserisce il codice della scheda e si vede a che punto è il lavoro, dalla diagnosi al ritiro.',
			},
			{
				t: 'Richiesta di assistenza e dove siamo',
				d: 'Un modulo corto con messaggi d’errore chiari e una ricevuta finale, una mappa illustrata e gli orari con l’indicazione “aperto ora”. Su telefono restano sempre a portata di pollice la chiamata e la richiesta.',
			},
		],
		awning: ['#1d5fd9', '#f5f7f9'],
		glow: 'rgba(40, 120, 255, 0.55)',
		livello: 1,
		lingua: 'IT',
		card: cardFixlab,
		shot: shotFixlab,
		shotAlt: '',
		crop: '89% 50%',
		cardAlt: 'FIXLAB su desktop e su telefono: titolo grande su fondo ghiaccio, uno smartphone in vista esplosa con i prezzi dei pezzi, il menù mobile come pannello posteriore avvitato.',
		mood: 'Il laboratorio di quartiere: ghiaccio, blu notte e un blu elettrico usato come accento, con una scheda di lavoro al posto del solito carosello.',
		caratteri: 'Outfit e Instrument Sans',
		palette: ['#f5f7f9', '#ffffff', '#17232d', '#2878ff', '#89949e', '#48b883'],
		metriche: [
			{ label: 'Performance', valore: '100' },
			{ label: 'Accessibilità', valore: '100' },
			{ label: 'Buone pratiche', valore: '100' },
		],
	},
	{
		slug: 'hotswap',
		macro: 'tech',
		nome: 'Hot Swap',
		categoria: 'Tech',
		archetipo: 'Il negozio di computer e gaming',
		claim: 'Il tuo PC, a modo tuo. Un configuratore che si trascina pezzo per pezzo, con prezzo, consumi e fotogrammi al secondo in tempo reale.',
		path: '/tech/pc-gaming/',
		infoPath: '/tech/pc-gaming/info/',
		titoloSeo: 'Sito web per negozio di computer e gaming: homepage concept con configuratore PC',
		descrizioneSeo:
			'Come potrebbe essere la homepage di un negozio di computer e gaming: catalogo con filtri e confronto, configuratore di PC con compatibilità reali, offerte del giorno, prenotazione del ritiro in negozio. Concept dimostrativo di Loop Studio.',
		intro: [
			'Chi compra un PC vuole capire cosa sta comprando: se i pezzi stanno insieme, quanto consumano, quanti fotogrammi faranno nei giochi. Questa homepage lascia che sia il cliente a scoprirlo, costruendo il suo computer trascinando i pezzi in uno chassis, con le regole di compatibilità vere e un conto che si aggiorna a ogni scelta.',
			'È il livello Evoluto della categoria Tech e una vetrina dimostrativa, scritta in inglese come farebbe un negozio rivolto a un pubblico internazionale: il negozio, i marchi, i prezzi, le recensioni, gli orari e l’indirizzo sono di fantasia. Lo stile richiama una tastiera meccanica: ogni bottone è un tasto che si abbassa quando lo premi.',
		],
		perChi:
			'Negozi di informatica e gaming, assemblatori di PC su misura, rivenditori di componenti e periferiche, store che offrono assistenza e montaggio. Adatta a chi vuole far giocare il cliente con il prodotto prima dell’acquisto e portarlo in negozio con una lista già pronta.',
		sezioni: [
			{
				t: 'Un negozio con filtri che si muovono',
				d: 'Le categorie sono tasti: il catalogo si riordina con animazioni fluide, si cerca, si ordina per prezzo o potenza, si guarda un’anteprima e si confrontano fino a tre prodotti della stessa categoria.',
			},
			{
				t: 'Il configuratore con regole vere',
				d: 'Si trascinano i pezzi negli alloggiamenti dello chassis (anche con il dito, tramite una maniglia). Socket, memoria, dimensione della scheda video e alimentatore vengono controllati, con budget, stima dei fotogrammi in quattro giochi e una scheda finale con codice.',
			},
			{
				t: 'Una lista che arriva fino al banco',
				d: 'Prodotti, servizi, offerte e il PC configurato finiscono in un’unica lista. Da lì si sceglie giorno e ora del ritiro, tra quelli in cui il negozio è davvero aperto, e il biglietto compare anche nella sezione della visita.',
			},
			{
				t: 'Servizi, offerte del giorno e orari',
				d: 'Cinque servizi al banco con suggerimenti dalla lista, tre offerte che cambiano ogni giorno con il conto alla rovescia fino a mezzanotte, recensioni a rotazione, orari con l’indicazione “aperto ora” e una piantina illustrata.',
			},
		],
		awning: ['#ff6b2c', '#e7e0d1'],
		glow: 'rgba(255, 107, 44, 0.55)',
		livello: 2,
		lingua: 'EN',
		card: cardHotswap,
		shot: shotHotswap,
		shotAlt: '',
		crop: '60% 40%',
		cardAlt: 'Hot Swap su desktop e su telefono: titolo grande su fondo beige, una tastiera di categorie con il tasto arancio del configuratore, il menù mobile come vassoio con LED.',
		mood: 'Una tastiera meccanica colorway: beige, grafite, arancio e verde acqua, con bottoni che hanno spessore e si abbassano quando li premi. Nessuna foto: illustrazioni piatte.',
		caratteri: 'Rubik e Albert Sans',
		palette: ['#e7e0d1', '#d8d0bf', '#2a2a2d', '#ff6b2c', '#2fb5a8', '#f4f0e6'],
		metriche: [
			{ label: 'Performance', valore: '99' },
			{ label: 'Accessibilità', valore: '100' },
			{ label: 'Buone pratiche', valore: '100' },
		],
	},
	{
		slug: 'ordito',
		macro: 'tech',
		nome: 'Ordito',
		categoria: 'Tech',
		archetipo: 'Lo studio tecnologico per casa e ufficio',
		claim: 'La casa che ti conosce. Una casa in 3D da toccare: sposti il sole, accendi le stanze, scrivi le regole e guardi l’impianto eseguirle.',
		path: '/tech/studio/',
		infoPath: '/tech/studio/info/',
		titoloSeo: 'Sito web per studio di domotica e smart home: homepage concept con casa 3D interattiva',
		descrizioneSeo:
			'Come potrebbe essere la homepage di uno studio di domotica, sicurezza ed energia per case e uffici: una casa in 3D che reagisce a luci, clima e allarme, un editor di regole “quando… allora…”, un capitolato su misura e la richiesta di sopralluogo. Concept dimostrativo di Loop Studio.',
		intro: [
			'Chi si rivolge a uno studio di domotica ha un dubbio semplice: che cosa farà davvero questo impianto a casa mia? Questa homepage risponde mostrando una casa di prova, costruita in 3D, che si attraversa scorrendo: ogni stanza è un passo del racconto e ogni pannello cambia davvero la scena, dalla luce del sole ai consumi.',
			'È il livello Esperienza della categoria Tech e una vetrina dimostrativa: lo studio, i progetti, i prezzi, i numeri e i recapiti sono di fantasia. Il colore è luce: il cielo della casa passa dall’alba rosa al giorno ciano, dal tramonto magenta alla notte viola, e tinge anche bottoni e schede. Serve a mostrare quanto può spingersi un sito quando il budget lo permette, senza perdere velocità né accessibilità.',
		],
		perChi:
			'Studi di domotica e integratori di smart home, installatori di impianti di sicurezza, energia e fotovoltaico, studi di progettazione impiantistica e aziende che vendono automazione per case, uffici e negozi. Adatta a chi vuole far capire un servizio invisibile facendolo toccare.',
		sezioni: [
			{
				t: 'Una casa in 3D, attraversata scorrendo',
				d: 'La casa è costruita con forme semplici e luce vera: scorrendo, la camera si sposta di stanza in stanza. Su telefono la scena parte alla prima interazione, con un fotogramma pronto al suo posto.',
			},
			{
				t: 'Sposti il sole, la casa risponde',
				d: 'Un orologio e cinque momenti (mattino, arrivo, cena, notte, vacanza) cambiano cielo, luci, tapparelle, clima, allarme e persino i consumi in kW e la produzione del fotovoltaico.',
			},
			{
				t: 'Le regole le scrivi in una frase',
				d: '“Quando torno a casa e è sera, allora accendi le luci del soggiorno”: si compone dentro la frase, non trascinando blocchi. Poi si fa correre una giornata e si vede quando le regole scattano.',
			},
			{
				t: 'Capitolato su misura e sopralluogo',
				d: 'Tipo di immobile, metri quadri e aree da automatizzare diventano un capitolato con prezzo indicativo, tempi e risparmio stimato. Tre casi si aprono a schermo intero con una transizione, e il modulo del sopralluogo si precompila.',
			},
		],
		awning: ['#6a2cff', '#ff2e93'],
		glow: 'rgba(255, 46, 147, 0.6)',
		livello: 3,
		lingua: 'IT',
		card: cardOrdito,
		shot: shotOrdito,
		shotAlt: '',
		crop: '75% 50%',
		cardAlt: 'Ordito su desktop e su telefono: titolo grande su un cielo al tramonto viola e magenta, una casa a due piani in 3D con bordi al neon, orologio e consumi, il menù mobile.',
		mood: 'Aurora: inchiostro viola-nero, viola elettrico, magenta, ciano e lime acido. Il cielo della casa cambia con l’ora e colora tutta la pagina; sotto, blocchi di colore a tutta larghezza, vetro e scritte che scorrono.',
		caratteri: 'Share Tech, Syne e Schibsted Grotesk',
		palette: ['#0b0620', '#6a2cff', '#ff2e93', '#2be4ff', '#d6ff3d', '#ece8ff'],
		metriche: [
			{ label: 'Performance', valore: '99' },
			{ label: 'Accessibilità', valore: '100' },
			{ label: 'Buone pratiche', valore: '100' },
		],
	},
	{
		slug: 'sifone',
		macro: 'casa',
		nome: 'Sifone',
		categoria: 'Casa e artigiani',
		archetipo: 'L’idraulico di pronto intervento',
		claim: 'Perde, scarica, si ferma: arriviamo noi. Una valvola da girare, cosa fare subito, tempi per zona e tariffe in chiaro.',
		path: '/casa/idraulico/',
		infoPath: '/casa/idraulico/info/',
		titoloSeo: 'Sito web per idraulico: homepage concept con pronto intervento, tempi per zona e tariffe',
		descrizioneSeo:
			'Come potrebbe essere la homepage di un idraulico di pronto intervento: valvola interattiva, cosa fare subito per ogni problema, tempi di arrivo per zona, tariffe con contatore e richiesta di intervento. Concept dimostrativo di Loop Studio.',
		intro: [
			'Chi chiama un idraulico ha l’acqua sul pavimento, o il bagno che non scarica, e decide in pochi secondi, con il telefono in mano. Questa homepage parte da lì: prima ti dice cosa fare per limitare i danni, poi quanto ci mettiamo ad arrivare e quanto costa, poi lascia il numero ben in vista. Il sito è una bottega che lavora con tubi veri: fotografie di rame e ottone, un’insegna dipinta a mano e un tubo di rame che corre lungo la pagina e si riempie d’acqua mentre scorri.',
			'È il livello Essenziale della categoria Casa e artigiani e una vetrina dimostrativa: l’impresa, le tariffe, le zone, le recensioni e il numero di telefono sono di fantasia. Serve a mostrare che un artigiano può avere un sito chiaro, immediato e fatto per far chiamare, con fotografie vere al posto delle solite icone e senza effetti inutili.',
		],
		perChi:
			'Idraulici, elettricisti, fabbri, caldaisti e altri artigiani di pronto intervento. Adatta a chi lavora su chiamata, vuole ridurre le telefonate che non portano lavoro, far capire subito i prezzi e le zone servite e ricevere richieste già ordinate.',
		sezioni: [
			{
				t: 'Una valvola da girare',
				d: 'In apertura un volantino che si gira con il dito o con il mouse (o con un tocco): la valvola si apre, l’acqua scorre e compare il numero da chiamare con il tempo di arrivo.',
			},
			{
				t: 'Cosa fare subito, problema per problema',
				d: 'Quattro raccordi (perdita, scarico, caldaia, sanitari): per ciascuno i primi passi da spuntare, i tempi, il prezzo “da” e un pulsante che precompila la richiesta.',
			},
			{
				t: 'Un manometro per i tempi',
				d: 'Lo schema dell’impianto con le zone servite: si tocca la propria e la lancetta indica i minuti di arrivo, con l’eventuale costo di uscita fuori zona.',
			},
			{
				t: 'Tariffe con il contatore',
				d: 'Giorno, notte o festivo e quante ore di lavoro: un contatore a cifre che scorrono mostra la stima del conto, con le voci scritte una per una.',
			},
			{
				t: 'Ordine di intervento e ricevuta',
				d: 'Un modulo corto con messaggi d’errore chiari e una ricevuta con numero d’ordine. Su telefono restano sempre a portata di pollice la chiamata e la richiesta.',
			},
		],
		awning: ['#e58857', '#0f3a3f'],
		glow: 'rgba(229, 136, 87, 0.55)',
		livello: 1,
		lingua: 'IT',
		card: cardSifone,
		shot: shotSifone,
		shotAlt: '',
		crop: '60% 40%',
		cardAlt: 'Sifone su desktop e su telefono: titolo in serif su calce, i tubi di rame in una parete aperta ritagliati ad arco, un volantino rosso di una valvola da girare, il menù mobile come serranda a lamelle petrolio.',
		mood: 'L’idraulico che arriva: blu petrolio, rame e calce, con fotografie vere (tubi di rame, un vecchio rubinetto, gli attrezzi in officina), grana di carta e un’insegna dipinta a mano con il secondo colore fuori registro.',
		caratteri: 'Gloock e Karla',
		palette: ['#efe9dc', '#e58857', '#08212a', '#0f3a3f', '#34b3a8', '#d8412a'],
		metriche: [
			{ label: 'Performance', valore: '98' },
			{ label: 'Accessibilità', valore: '100' },
			{ label: 'Buone pratiche', valore: '100' },
		],
	},
];

// stato: 'presto' = quasi pronta, 'cantiere' = ancora in costruzione (nessuna data promessa)
export type StatoProssima = 'presto' | 'cantiere';
export const prossime: { nome: string; categoria: string; macro: MacroSlug; stato: StatoProssima }[] = [
	{ nome: 'Legale e professionale', categoria: 'Studi e servizi', macro: 'studi', stato: 'cantiere' },
	{ nome: 'Negozio locale', categoria: 'Commercio', macro: 'commercio', stato: 'cantiere' },
];
