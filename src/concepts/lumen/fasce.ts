// Giorni e fasce di luce prenotabili. Tutto calcolato da oggi, così la pagina non invecchia.
// Aperti da martedì a sabato; il sabato niente fascia della sera. La disponibilità è inventata ma stabile per ogni giorno.
export type Fascia = { id: 'mattina' | 'pomeriggio' | 'sera'; nome: string; luce: string; orari: string[] };

export const fasce: Fascia[] = [
	{ id: 'mattina', nome: 'Mattina', luce: 'luce dorata', orari: ['09:00', '10:00', '11:00'] },
	{ id: 'pomeriggio', nome: 'Pomeriggio', luce: 'luce piena', orari: ['14:30', '15:30', '16:30'] },
	{ id: 'sera', nome: 'Sera', luce: 'luce di candela', orari: ['17:30', '18:30', '19:30'] },
];

const giorniNome = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
const mesiNome = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
const giorniEsteso = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
const mesiEsteso = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];

export const aperto = (d: Date) => d.getDay() >= 2 && d.getDay() <= 6;
export const chiave = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
export const breve = (d: Date) => ({ g: giorniNome[d.getDay()], n: d.getDate(), m: mesiNome[d.getMonth()] });
export const esteso = (d: Date) => `${giorniEsteso[d.getDay()]} ${d.getDate()} ${mesiEsteso[d.getMonth()]}`;

export function giorniPrenotabili(da: Date, quanti: number): Date[] {
	const out: Date[] = [];
	const d = new Date(da.getFullYear(), da.getMonth(), da.getDate());
	while (out.length < quanti) {
		if (aperto(d)) out.push(new Date(d));
		d.setDate(d.getDate() + 1);
	}
	return out;
}

const hash = (s: string) => {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
	return (h >>> 0) % 100;
};

// ritorna per ogni fascia gli orari con la loro disponibilità
export function orariDelGiorno(d: Date, adesso: Date) {
	const oggi = chiave(d) === chiave(adesso);
	return fasce
		.filter((f) => !(f.id === 'sera' && d.getDay() === 6))
		.map((f) => ({
			...f,
			slot: f.orari.map((o) => {
				const [h, m] = o.split(':').map(Number);
				const passato = oggi && (h * 60 + m < adesso.getHours() * 60 + adesso.getMinutes() + 30);
				const pieno = hash(`${chiave(d)}-${o}`) < 32;
				return { o, libero: !passato && !pieno };
			}),
		}));
}
