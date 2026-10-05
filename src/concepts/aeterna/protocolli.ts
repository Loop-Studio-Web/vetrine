// Protocolli di Aeterna: dati di fantasia, usati dalla sezione a scorrimento, dal Bio-Assessment e dalla suite.
export type Asse = 'energia' | 'recupero' | 'metabolismo' | 'mente' | 'tessuti';

export interface Protocollo {
	id: string;
	nome: string;
	breve: string;
	descrizione: string;
	durata: number; // minuti
	prezzo: number; // euro
	macchina: boolean; // ha una scheda a scorrimento con il disegno
	specifiche: [string, string][];
	asse: Asse; // asse del radar che il protocollo sostiene di più
}

export const protocolli: Protocollo[] = [
	{
		id: 'checkup',
		nome: 'Check-up biomarcatori',
		breve: 'Prelievo, analisi e report',
		descrizione: 'Il punto di partenza: prelievo, pannello di biomarcatori e colloquio con il medico per leggere il profilo.',
		durata: 60,
		prezzo: 190,
		macchina: false,
		specifiche: [],
		asse: 'metabolismo',
	},
	{
		id: 'cryo',
		nome: 'Criosauna',
		breve: 'Freddo a −110 °C',
		descrizione:
			'Tre minuti in una camera a vapori di azoto a −110 °C. Il freddo estremo accende la risposta di recupero e lascia una sensazione di leggerezza che dura ore.',
		durata: 30,
		prezzo: 60,
		macchina: true,
		specifiche: [
			['Temperatura', '−110 °C'],
			['In camera', '3 minuti'],
			['Ciclo consigliato', '6–10 sedute'],
			['Sostiene', 'Recupero'],
		],
		asse: 'recupero',
	},
	{
		id: 'infusione',
		nome: 'Terapia infusionale',
		breve: 'Flebo su misura',
		descrizione:
			'Una infusione di vitamine, minerali e idratazione composta dopo il check-up, con il medico presente. Per chi cerca energia e un recupero rapido.',
		durata: 45,
		prezzo: 140,
		macchina: true,
		specifiche: [
			['Formula', 'Su misura'],
			['Durata', '45 minuti'],
			['Controllo', 'Medico in suite'],
			['Sostiene', 'Energia'],
		],
		asse: 'energia',
	},
	{
		id: 'biolight',
		nome: 'Bio-Light',
		breve: 'Luce rossa e infrarossa',
		descrizione:
			'Un pannello a luce rossa e infrarossa vicina avvolge viso e corpo per venti minuti. Una routine rilassante, pensata per i tessuti e per la qualità della pelle.',
		durata: 20,
		prezzo: 70,
		macchina: true,
		specifiche: [
			['Lunghezze d’onda', '660 · 850 nm'],
			['Durata', '20 minuti'],
			['Zona', 'Viso e corpo'],
			['Sostiene', 'Tessuti'],
		],
		asse: 'tessuti',
	},
	{
		id: 'iperbarica',
		nome: 'Camera iperbarica',
		breve: 'Ossigeno in pressione',
		descrizione:
			'Una camera a pressione lievemente aumentata con ossigeno ad alta concentrazione. Un’ora di quiete, pensata per chi vuole chiarezza mentale e recupero profondo.',
		durata: 60,
		prezzo: 110,
		macchina: true,
		specifiche: [
			['Pressione', '1,5 ATA'],
			['Durata', '60 minuti'],
			['Ossigeno', '95 %'],
			['Sostiene', 'Mente'],
		],
		asse: 'mente',
	},
];

export const assi: { id: Asse; nome: string }[] = [
	{ id: 'energia', nome: 'Energia' },
	{ id: 'recupero', nome: 'Recupero' },
	{ id: 'metabolismo', nome: 'Metabolismo' },
	{ id: 'mente', nome: 'Mente' },
	{ id: 'tessuti', nome: 'Tessuti' },
];

export const medici = [
	{ id: 'm1', nome: 'Dott.ssa Elena Voss', ruolo: 'Medico della longevità', sigla: 'EV', extra: 0 },
	{ id: 'm2', nome: 'Dott. Marco Ardèn', ruolo: 'Medicina dello sport e recupero', sigla: 'MA', extra: 0 },
	{ id: 'm3', nome: 'Prof. Livia Sandri', ruolo: 'Direttrice scientifica', sigla: 'LS', extra: 40 },
];

export const complementari = [
	{ id: 'hrv', nome: 'Monitor HRV per 7 giorni', prezzo: 35 },
	{ id: 'integratori', nome: 'Piano di integrazione', prezzo: 55 },
	{ id: 'respiro', nome: 'Sessione di respirazione guidata', prezzo: 30 },
	{ id: 'massaggio', nome: 'Massaggio decontratturante 30′', prezzo: 50 },
];
