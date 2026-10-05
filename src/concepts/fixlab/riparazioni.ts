// Dati di fantasia del laboratorio: prezzi "da", tempi e problemi per dispositivo.
// Una sola fonte per "Trova il servizio", per il listino e per la richiesta di assistenza.
export type Tempo = 'In giornata' | '24–48 ore' | '2–4 giorni';
export type Problema = { id: string; nome: string; da: number; tempo: Tempo; nota: string };
export type Dispositivo = { id: string; nome: string; breve: string; problemi: Problema[] };

export const dispositivi: Dispositivo[] = [
	{
		id: 'smartphone',
		nome: 'Smartphone',
		breve: 'Display, batteria, ricarica, acqua',
		problemi: [
			{ id: 'vetro', nome: 'Vetro o display rotto', da: 59, tempo: 'In giornata', nota: 'Sostituzione del vetro o dell’intero display, con prova di touch e colori prima della consegna.' },
			{ id: 'batteria', nome: 'La batteria dura poco', da: 39, tempo: 'In giornata', nota: 'Batteria nuova e controllo del consumo: in negozio, mentre aspetti.' },
			{ id: 'ricarica', nome: 'Non carica più', da: 45, tempo: 'In giornata', nota: 'Pulizia o sostituzione del connettore di ricarica; spesso è solo polvere.' },
			{ id: 'accende', nome: 'Non si accende', da: 15, tempo: '24–48 ore', nota: 'Diagnosi sulla scheda e sull’alimentazione. Se ripari da noi, la diagnosi è inclusa.' },
			{ id: 'acqua', nome: 'È caduto in acqua', da: 49, tempo: '2–4 giorni', nota: 'Pulizia in bagno a ultrasuoni e controllo dei componenti. Prima si porta, meglio è.' },
			{ id: 'fotocamera', nome: 'Fotocamera o altoparlante', da: 49, tempo: '24–48 ore', nota: 'Sostituzione del modulo fotocamera, dell’altoparlante o del microfono.' },
		],
	},
	{
		id: 'pc',
		nome: 'PC e notebook',
		breve: 'Lentezza, SSD, schermo, virus',
		problemi: [
			{ id: 'lento', nome: 'È diventato lentissimo', da: 69, tempo: '24–48 ore', nota: 'Installazione di un SSD con clonazione del sistema: stesso PC, un altro scatto.' },
			{ id: 'avvio', nome: 'Non si avvia', da: 39, tempo: '24–48 ore', nota: 'Diagnosi di disco, memoria e alimentazione. Poi ti diciamo cosa conviene fare.' },
			{ id: 'schermo', nome: 'Schermo del notebook rotto', da: 89, tempo: '2–4 giorni', nota: 'Pannello nuovo compatibile; il prezzo definitivo dipende dal modello.' },
			{ id: 'tastiera', nome: 'Tastiera o trackpad', da: 59, tempo: '24–48 ore', nota: 'Sostituzione di tastiera, trackpad o singoli tasti, dove il modello lo permette.' },
			{ id: 'caldo', nome: 'Si scalda e fa rumore', da: 45, tempo: 'In giornata', nota: 'Pulizia delle ventole e pasta termica nuova. Una volta all’anno fa bene.' },
			{ id: 'software', nome: 'Virus o sistema impazzito', da: 39, tempo: '24–48 ore', nota: 'Pulizia, ripristino o reinstallazione, con i tuoi dati al sicuro.' },
			{ id: 'dati', nome: 'Recupero dati', da: 79, tempo: '2–4 giorni', nota: 'Valutazione senza impegno: ti diciamo prima se i dati sono recuperabili.' },
		],
	},
	{
		id: 'tablet',
		nome: 'Tablet',
		breve: 'Display, batteria, ricarica',
		problemi: [
			{ id: 'display', nome: 'Display rotto', da: 79, tempo: '24–48 ore', nota: 'Vetro o schermo completo, a seconda del danno.' },
			{ id: 'batteria', nome: 'La batteria non regge', da: 49, tempo: '24–48 ore', nota: 'Sostituzione e prova di carica completa.' },
			{ id: 'ricarica', nome: 'Non carica', da: 45, tempo: 'In giornata', nota: 'Connettore pulito o sostituito.' },
			{ id: 'accende', nome: 'Non si accende', da: 15, tempo: '24–48 ore', nota: 'Diagnosi inclusa se la riparazione si fa da noi.' },
		],
	},
	{
		id: 'console',
		nome: 'Console',
		breve: 'HDMI, surriscaldamento, lettore, stick',
		problemi: [
			{ id: 'hdmi', nome: 'Niente immagine (HDMI)', da: 69, tempo: '2–4 giorni', nota: 'Sostituzione della porta HDMI, con prova su schermo.' },
			{ id: 'caldo', nome: 'Si surriscalda e si spegne', da: 49, tempo: '24–48 ore', nota: 'Pulizia interna e pasta termica nuova.' },
			{ id: 'lettore', nome: 'Non legge i dischi', da: 79, tempo: '2–4 giorni', nota: 'Pulizia o sostituzione del lettore.' },
			{ id: 'stick', nome: 'Il pad “scivola” da solo', da: 29, tempo: 'In giornata', nota: 'Sostituzione dei potenziometri degli stick del controller.' },
			{ id: 'accende', nome: 'Non si accende', da: 15, tempo: '24–48 ore', nota: 'Diagnosi su alimentazione e scheda.' },
		],
	},
];

// Il listino: stessi dati, più gli accessori
export const accessori: { nome: string; da: number }[] = [
	{ nome: 'Cover e custodie', da: 9 },
	{ nome: 'Vetro temperato (applicato in negozio)', da: 12 },
	{ nome: 'Cavi di ricarica', da: 8 },
	{ nome: 'Alimentatori e caricatori', da: 15 },
	{ nome: 'Mouse e tastiere', da: 14 },
	{ nome: 'SSD e memorie', da: 39 },
];

export const prezzo = (n: number) => `${n} €`;

// Gli esempi per “segui la riparazione”: stati e codici di fantasia
export const stati = ['Ricevuto', 'In diagnosi', 'Preventivo', 'In riparazione', 'Pronto'] as const;
export const demo: Record<string, { dispositivo: string; stato: number; nota: string }> = {
	'FX-0417': { dispositivo: 'Smartphone · display', stato: 3, nota: 'Display nuovo montato, stiamo facendo la prova di touch. Ti scriviamo appena è pronto.' },
	'FX-0382': { dispositivo: 'Notebook · SSD', stato: 4, nota: 'Pronto per il ritiro. Porta un documento e, se puoi, il codice di questa scheda.' },
	'FX-0455': { dispositivo: 'Console · HDMI', stato: 1, nota: 'In diagnosi: guardiamo la porta e la scheda. Il preventivo arriva entro domani.' },
};
