// Dati e calcolo dei turni della bottega. Tutto di fantasia: le sedie "occupate" sono decise da una funzione
// deterministica, così la pagina mostra sempre gli stessi posti pieni per lo stesso giorno, a partire da oggi.

export const servizi = [
	{ id: 'taglio', nome: 'Taglio', prezzo: 18, durata: '30 min', nota: 'Forbice e macchinetta, rifinitura a rasoio' },
	{ id: 'sfumato', nome: 'Taglio sfumato', prezzo: 20, durata: '40 min', nota: 'Dissolvenza alta, media o bassa, a scelta' },
	{ id: 'barba', nome: 'Barba', prezzo: 12, durata: '20 min', nota: 'Contorno, forma e olio finale' },
	{ id: 'rasoio', nome: 'Rasatura a rasoio', prezzo: 15, durata: '30 min', nota: 'Con asciugamano caldo e sapone a pennello' },
	{ id: 'taglio-barba', nome: 'Taglio e barba', prezzo: 28, durata: '50 min', nota: 'Il turno completo, con una pausa di vapore' },
	{ id: 'bimbi', nome: 'Bimbi fino a 12 anni', prezzo: 14, durata: '25 min', nota: 'Sul cuscino rialzato, con il lecca-lecca' },
] as const;

export const sedie = [
	{
		n: 1,
		nome: 'Nino',
		mestiere: 'Il classico',
		testo: 'Forbice e pettine, taglio che resta bene per tre settimane. Rasoio a mano libera dal 1984.',
	},
	{
		n: 2,
		nome: 'Teo',
		mestiere: 'Le sfumature',
		testo: 'Dissolvenze pulite, tagli corti e movimento sopra. Vuole la foto di riferimento, anche storta.',
	},
	{
		n: 3,
		nome: 'Ivo',
		mestiere: 'Barba e rasoio',
		testo: 'Asciugamano caldo, sapone a pennello e mano ferma. Il turno più lento della bottega, e il più chiesto.',
	},
] as const;

export const ORE = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'];

const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
const GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
const GIORNI_BREVI = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];

export const chiave = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const nomeGiorno = (d: Date) => GIORNI[d.getDay()];
export const giornoBreve = (d: Date) => GIORNI_BREVI[d.getDay()];
export const meseBreve = (d: Date) => MESI[d.getMonth()];

// la bottega è chiusa la domenica e il lunedì
export const aperto = (d: Date) => d.getDay() >= 2 && d.getDay() <= 6;

export function giorniAperti(da = new Date(), quanti = 6): Date[] {
	const out: Date[] = [];
	const d = new Date(da.getFullYear(), da.getMonth(), da.getDate());
	while (out.length < quanti) {
		if (aperto(d)) out.push(new Date(d));
		d.setDate(d.getDate() + 1);
	}
	return out;
}

const hash = (s: string) => {
	let h = 7;
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
	return h;
};

export const occupato = (giorno: Date, sedia: number, ora: string) => hash(`${chiave(giorno)}|${sedia}|${ora}`) % 100 < 42;

// un orario già passato oggi non si può prenotare (si tengono 15 minuti di margine)
export function passato(giorno: Date, ora: string, adesso = new Date()) {
	const [h, m] = ora.split(':').map(Number);
	const t = new Date(giorno.getFullYear(), giorno.getMonth(), giorno.getDate(), h, m);
	return t.getTime() < adesso.getTime() + 15 * 60000;
}

export type Libera = { giorno: Date; ora: string; sedia: (typeof sedie)[number] };

// prima sedia libera a partire da adesso; con `soloSedia` si guarda una sedia sola
export function prossimaLibera(adesso = new Date(), soloSedia?: number): Libera | null {
	for (const g of giorniAperti(adesso, 7)) {
		for (const ora of ORE) {
			if (passato(g, ora, adesso)) continue;
			for (const s of sedie) {
				if (soloSedia && s.n !== soloSedia) continue;
				if (!occupato(g, s.n, ora)) return { giorno: g, ora, sedia: s };
			}
		}
	}
	return null;
}

export function quando(l: Libera, adesso = new Date()) {
	const oggi = chiave(adesso);
	const domani = new Date(adesso.getFullYear(), adesso.getMonth(), adesso.getDate() + 1);
	if (chiave(l.giorno) === oggi) return `oggi alle ${l.ora}`;
	if (chiave(l.giorno) === chiave(domani)) return `domani alle ${l.ora}`;
	return `${nomeGiorno(l.giorno)} alle ${l.ora}`;
}
