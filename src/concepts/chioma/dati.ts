// Dati del frantoio (di fantasia) e regole della cassa. Modulo puro: lo usano il frontmatter e il browser.

export const FRANTOIO = {
	nome: 'Chioma Saracena',
	luogo: 'Piana di Gioia Tauro',
	cultivar: 'Ottobratica',
	campagna: '2026/27',
	email: 'ordini@chiomasaracena.example',
	telefono: '+39 0966 000 000',
};

// Valori di esempio: in un frantoio vero qui va l'analisi del lotto.
export const ANALISI = [
	{ voce: 'Dalla pianta al frantoio', valore: '6 ore', spiega: 'Più l’oliva aspetta, più fermenta. Oltre un giorno, l’olio rischia di non essere più extravergine.' },
	{ voce: 'Gramolatura', valore: '26 °C', spiega: 'Sotto i 27 gradi la legge permette di scrivere «estratto a freddo».' },
	{ voce: 'Acidità', valore: '0,18 %', spiega: 'Il limite dell’extravergine è 0,8 %. Più è bassa, più l’oliva era sana quando è entrata.' },
	{ voce: 'Polifenoli', valore: '512 mg/kg', spiega: 'Sono loro l’amaro e il piccante. Calano con la luce e con i mesi, per questo la latta.' },
];

// scala = altezza della latta rispetto alla 3 L (misure vere: 20, 29,5 e 31,5 cm), per la latta posata nella cassa
export type Formato = { id: string; litri: number; prezzo: number; nota: string; scala: number; misure: string; peso: string };
export const FORMATI: Formato[] = [
	{ id: '1', litri: 1, prezzo: 17, nota: 'Per provarlo', scala: 0.68, misure: '9,5 × 6 × 20 cm', peso: '1,05 kg' },
	{ id: '3', litri: 3, prezzo: 45, nota: 'Due mesi in cucina', scala: 1, misure: '12 × 9 × 29,5 cm', peso: '3 kg' },
	{ id: '5', litri: 5, prezzo: 70, nota: 'La scorta di casa', scala: 1.07, misure: '15 × 12 × 31,5 cm', peso: '4,9 kg' },
];
export const SPEDIZIONE = 7.9;
export const GRATIS_DA = 60;
export const MAX_LATTE = 6;

export const eur = (n: number) =>
	n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: Number.isInteger(n) ? 0 : 2 });

export function conto(prezzo: number, quante: number) {
	const merce = prezzo * quante;
	const spedizione = merce >= GRATIS_DA ? 0 : SPEDIZIONE;
	return { merce, spedizione, totale: merce + spedizione };
}

// Le rate senza interessi: tre quote uguali, l'ultima assorbe i centesimi.
export function rate(totale: number, n = 3) {
	const quota = Math.floor((totale / n) * 100) / 100;
	return { quota, ultima: Math.round((totale - quota * (n - 1)) * 100) / 100 };
}

// Metodi di pagamento più usati in Italia. In questa vetrina sono finti: si vedono, non addebitano niente.
export type Metodo = { id: string; nome: string; nota: string; marchi: string[] };
export const METODI: Metodo[] = [
	{ id: 'carta', nome: 'Carta di credito o debito', nota: 'Visa, Mastercard, American Express, prepagate', marchi: ['visa', 'mastercard', 'americanexpress'] },
	{ id: 'paypal', nome: 'PayPal', nota: 'Ti porta su PayPal per confermare', marchi: ['paypal'] },
	{ id: 'paypal-3', nome: 'PayPal, paga in 3 rate', nota: 'Senza interessi, da 20 € in su', marchi: ['paypal'] },
	{ id: 'klarna', nome: 'Klarna', nota: 'In 3 rate senza interessi o tra 30 giorni', marchi: ['klarna'] },
	{ id: 'scalapay', nome: 'Scalapay', nota: 'In 3 rate, la prima oggi', marchi: ['scalapay'] },
	{ id: 'satispay', nome: 'Satispay', nota: 'Confermi dall’app', marchi: ['satispay'] },
	{ id: 'bonifico', nome: 'Bonifico o MyBank', nota: 'La latta parte quando arriva il bonifico', marchi: ['mybank'] },
];

export const numeroOrdine = () => `CS-${String(Math.floor(1000 + Math.random() * 9000))}`;

// Data di partenza. L'olio nuovo parte dal primo lunedì dopo il 4 novembre; dopo quella data si spedisce
// il primo giorno feriale utile dal lunedì al giovedì (così la latta non resta in magazzino nel fine settimana).
const GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
const MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

function oggiARoma(adesso = new Date()) {
	const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(adesso);
	const [a, m, g] = p.split('-').map(Number);
	return new Date(Date.UTC(a, m - 1, g));
}

export function partenza(adesso = new Date()) {
	const oggi = oggiARoma(adesso);
	const anno = oggi.getUTCMonth() >= 7 ? oggi.getUTCFullYear() : oggi.getUTCFullYear() - 1; // la campagna parte in autunno
	const prima = new Date(Date.UTC(anno, 10, 5));
	while (prima.getUTCDay() !== 1) prima.setUTCDate(prima.getUTCDate() + 1);
	let giorno: Date;
	let prenotazione = false;
	if (oggi < prima) {
		giorno = prima;
		prenotazione = true;
	} else {
		giorno = new Date(oggi);
		giorno.setUTCDate(giorno.getUTCDate() + 1);
		while (![1, 2, 3, 4].includes(giorno.getUTCDay())) giorno.setUTCDate(giorno.getUTCDate() + 1);
	}
	const testo = `${GIORNI[giorno.getUTCDay()]} ${giorno.getUTCDate()} ${MESI[giorno.getUTCMonth()]}`;
	return { testo, prenotazione };
}
