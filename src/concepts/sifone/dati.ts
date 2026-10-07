// Dati di fantasia di SIFONE: unica fonte per i problemi, le zone e il tariffario.
export const TEL = '+390200000000';
export const TEL_VISIBILE = '02 0000 0000';

export type Problema = {
	id: string;
	nome: string;
	breve: string;
	subito: string[];
	tempo: string;
	da: number;
	nota: string;
};

export const problemi: Problema[] = [
	{
		id: 'perdita',
		nome: 'Perdita d’acqua',
		breve: 'Gocciola, scorre, macchia sul soffitto',
		subito: [
			'Chiudi il rubinetto generale: di solito sta vicino al contatore o sotto il lavello.',
			'Spegni la corrente nelle stanze bagnate dal quadro, se l’acqua è vicino a prese o lampadine.',
			'Raccogli l’acqua con secchi e stracci e fotografa il danno: servirà all’assicurazione.',
		],
		tempo: '30–60 min',
		da: 70,
		nota: 'Ricerca della perdita e riparazione provvisoria incluse.',
	},
	{
		id: 'scarico',
		nome: 'Scarico intasato',
		breve: 'Lavello, doccia o WC che non scende',
		subito: [
			'Non versare prodotti chimici forti: peggiorano il lavoro e rovinano i tubi.',
			'Se l’acqua risale, chiudi i rubinetti e non tirare lo sciacquone.',
			'Tieni libero l’accesso al sifone sotto il lavello: il tecnico parte da lì.',
		],
		tempo: '45–90 min',
		da: 80,
		nota: 'Disostruzione con sonda manuale; macchina a pressione a parte.',
	},
	{
		id: 'caldaia',
		nome: 'Caldaia ferma',
		breve: 'Niente acqua calda o niente riscaldamento',
		subito: [
			'Guarda il display: annota il codice di errore e la pressione indicata dal manometro.',
			'Se senti odore di gas, apri le finestre, chiudi il gas e non toccare interruttori: chiama il numero di emergenza gas.',
			'Controlla che il gas sia aperto e la corrente arrivi: a volte basta quello.',
		],
		tempo: '1–2 ore',
		da: 90,
		nota: 'Diagnosi sul posto; i ricambi si ordinano dopo il preventivo.',
	},
	{
		id: 'sanitari',
		nome: 'Rubinetti e sanitari',
		breve: 'Sostituzione, montaggio, cassetta del WC',
		subito: [
			'Chiudi la valvolina sotto il sanitario o, se manca, il rubinetto generale.',
			'Tieni a portata di mano il pezzo nuovo e la scatola: contiene le misure.',
			'Libera lo spazio intorno al lavoro e togli ciò che può bagnarsi.',
		],
		tempo: 'Oggi stesso',
		da: 50,
		nota: 'Prezzo per un pezzo; il materiale lo porti tu o lo forniamo noi a listino.',
	},
];

export type Zona = { id: string; nome: string; minuti: number; uscita: number; x: number; y: number };

// x, y: posizione sullo schema (0–100)
export const zone: Zona[] = [
	{ id: 'centro', nome: 'Centro', minuti: 20, uscita: 0, x: 50, y: 50 },
	{ id: 'nord', nome: 'Quartiere Nord', minuti: 30, uscita: 0, x: 50, y: 16 },
	{ id: 'sud', nome: 'Quartiere Sud', minuti: 30, uscita: 0, x: 50, y: 84 },
	{ id: 'collina', nome: 'Colle e Borgo', minuti: 45, uscita: 15, x: 82, y: 28 },
	{ id: 'est', nome: 'Periferia Est', minuti: 40, uscita: 10, x: 86, y: 70 },
	{ id: 'ovest', nome: 'Periferia Ovest', minuti: 40, uscita: 10, x: 14, y: 62 },
];

export type Fascia = 'giorno' | 'notte' | 'festivo';

export const fasce: { id: Fascia; nome: string; dettaglio: string; molt: number }[] = [
	{ id: 'giorno', nome: 'Giorno', dettaglio: 'lun–sab, 7–20', molt: 1 },
	{ id: 'notte', nome: 'Notte', dettaglio: 'tutti i giorni, 20–7', molt: 1.5 },
	{ id: 'festivo', nome: 'Festivo', dettaglio: 'domenica e festivi', molt: 1.4 },
];

export const tariffe = {
	chiamata: 35, // uscita e diagnosi, scalata dal lavoro se si procede
	ora: 45, // manodopera, per ogni ora iniziata
};

export const garanzie = [
	{ t: 'Prezzo detto prima', d: 'Il tecnico ti dice il costo prima di toccare qualcosa. Se non ti va bene, paghi solo l’uscita.' },
	{ t: 'Lavori garantiti 12 mesi', d: 'Se la riparazione cede entro un anno, torniamo senza costi di manodopera.' },
	{ t: 'Fattura e ricevuta', d: 'Documento fiscale sempre, anche per i piccoli lavori. Pagamento a lavoro finito.' },
	{ t: 'Tecnici in divisa', d: 'Mezzo e cartellino riconoscibili, ti avvisiamo con un messaggio quando partono.' },
];

export const recensioni = [
	{ n: 'Marta R.', z: 'Quartiere Nord', t: 'Perdita sotto il lavello di sera tardi. Il tecnico è arrivato in 25 minuti, ha detto il prezzo prima e ha fatto tutto pulito.', s: 5 },
	{ n: 'Giovanni P.', z: 'Centro', t: 'Scarico del bagno otturato di domenica. Costo come da tariffario, nessuna sorpresa. Risolto in meno di un’ora.', s: 5 },
	{ n: 'Elena S.', z: 'Colle e Borgo', t: 'Caldaia ferma a gennaio. Ha trovato il guasto, il ricambio è arrivato il giorno dopo. Un po’ di attesa, ma è stato onesto.', s: 4 },
	{ n: 'Paolo L.', z: 'Periferia Est', t: 'Cambio miscelatore e sifone in casa nuova. Puntuale, ordinato, fattura subito.', s: 5 },
];

export const orari = [
	{ g: 'Pronto intervento', o: 'Sempre, 24 ore su 24, 365 giorni' },
	{ g: 'Preventivi e lavori programmati', o: 'Lunedì–sabato 8:00–19:00' },
];
