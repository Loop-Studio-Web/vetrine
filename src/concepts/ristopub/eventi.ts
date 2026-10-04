// Calendario del locale: eventi ricorrenti per giorno della settimana. Le date vengono calcolate
// a partire da "oggi" (sia in build sia nel browser), così la lista non invecchia mai.

export type Tipo = 'live' | 'quiz' | 'assaggio' | 'sport';

export const tipi: { id: Tipo | 'tutti'; nome: string }[] = [
	{ id: 'tutti', nome: 'Tutto' },
	{ id: 'live', nome: 'Live' },
	{ id: 'quiz', nome: 'Quiz' },
	{ id: 'assaggio', nome: 'Assaggi' },
	{ id: 'sport', nome: 'Partite' },
];

type Ricorrenza = {
	giorno: number; // 0 = domenica
	tipo: Tipo;
	titoli: string[]; // ruotano di settimana in settimana
	dettagli: string[];
	ora: string;
	ingresso: string;
};

const ricorrenze: Ricorrenza[] = [
	{
		giorno: 3,
		tipo: 'quiz',
		titoli: ['Quiz del mercoledì'],
		dettagli: ['Squadre da 2 a 5. Cinque round, un giro di birre per chi vince, una scopa per chi perde.'],
		ora: '21:00',
		ingresso: 'Libero',
	},
	{
		giorno: 4,
		tipo: 'assaggio',
		titoli: ['Assaggi guidati: tre IPA a confronto', 'Assaggi guidati: dal chiaro allo scuro', 'Assaggi guidati: le acide'],
		dettagli: [
			'Con il mastro birraio: sei assaggi da 0,1 l e uno stuzzichino per ciascuno.',
			'Sei assaggi dalla Helles alla Stout, in ordine di corpo, con pane e formaggi.',
			'Sour e Berliner a confronto, con frutta e sottaceti per capire dove vanno.',
		],
		ora: '20:30',
		ingresso: '12 €',
	},
	{
		giorno: 5,
		tipo: 'live',
		titoli: ['Cinghiali Elettrici', 'Mastelli Blues Band', 'The Secondo Giro', 'Tre Cavi e Una Spina'],
		dettagli: [
			'Rock’n’roll di quello che fa battere il piede, dalle dieci in poi.',
			'Blues e rhythm’n’blues, sei elementi sul palchetto di fondo.',
			'Cover da cantare tutti insieme, dal brit-pop ai grandi classici.',
			'Power trio, tre chitarre e nessuna pietà per i timpani.',
		],
		ora: '22:00',
		ingresso: 'Libero',
	},
	{
		giorno: 6,
		tipo: 'live',
		titoli: ['Sottopalco Sessions', 'Ruvida Pelle', 'Il Secchio d’Oro', 'Luppolo Funk Orchestra'],
		dettagli: [
			'Il palco aperto: portate lo strumento, ci pensiamo noi all’impianto.',
			'Cantautorato ruvido e chitarra acustica, con gli ospiti a sorpresa.',
			'Ska e reggae per ballare in piedi tra i tavoli.',
			'Nove musicisti, un groove solo, fino a chiusura.',
		],
		ora: '22:00',
		ingresso: 'Libero',
	},
	{
		giorno: 0,
		tipo: 'sport',
		titoli: ['Partita sul maxischermo'],
		dettagli: ['Diretta sul telo grande, audio acceso. Panino e media a 12 € per tutta la partita.'],
		ora: '20:45',
		ingresso: 'Libero',
	},
];

export type Evento = {
	id: string;
	tipo: Tipo;
	titolo: string;
	dettaglio: string;
	ora: string;
	ingresso: string;
	data: Date;
	iso: string; // aaaa-mm-gg
};

const giorni = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const mesi = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];

export const nomeGiorno = (d: Date) => giorni[d.getDay()];
export const nomeMese = (d: Date) => mesi[d.getMonth()];
export const isoLocale = (d: Date) =>
	`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** I prossimi `n` eventi a partire da `da` (oggi compreso, se l'ora non è passata di molto). */
export function prossimiEventi(da: Date, n = 8): Evento[] {
	const inizio = new Date(da.getFullYear(), da.getMonth(), da.getDate());
	const lista: Evento[] = [];
	for (let i = 0; i < 28 && lista.length < n * 2; i++) {
		const d = new Date(inizio);
		d.setDate(inizio.getDate() + i);
		for (const r of ricorrenze) {
			if (d.getDay() !== r.giorno) continue;
			const settimana = Math.floor(d.getTime() / (7 * 86400000));
			const k = settimana % r.titoli.length;
			const iso = isoLocale(d);
			lista.push({
				id: `${r.tipo}-${iso}`,
				tipo: r.tipo,
				titolo: r.titoli[k],
				dettaglio: r.dettagli[k % r.dettagli.length],
				ora: r.ora,
				ingresso: r.ingresso,
				data: d,
				iso,
			});
		}
	}
	return lista.sort((a, b) => a.data.getTime() - b.data.getTime()).slice(0, n);
}

const etichettaTipo: Record<Tipo, string> = { live: 'Live', quiz: 'Quiz', assaggio: 'Assaggio guidato', sport: 'Partita' };

/** Markup dei biglietti: lo stesso testo serve in build e nel browser (le date si aggiornano a "oggi"). */
export function biglietti(lista: Evento[]): string {
	return lista
		.map(
			(e) => `<li class="bigl" data-tipo="${e.tipo}">
	<div class="bigl__data" aria-hidden="true"><span>${nomeGiorno(e.data).slice(0, 3)}</span><b>${e.data.getDate()}</b><span>${nomeMese(e.data)}</span></div>
	<div class="bigl__corpo">
		<p class="bigl__tipo bigl__tipo--${e.tipo}">${etichettaTipo[e.tipo]}</p>
		<h3>${e.titolo}</h3>
		<p class="bigl__det">${e.dettaglio}</p>
		<p class="bigl__quando"><span class="sr-only">${nomeGiorno(e.data)} ${e.data.getDate()} ${nomeMese(e.data)}, </span>ore ${e.ora} · Ingresso ${e.ingresso.toLowerCase()}</p>
	</div>
	<button type="button" class="bigl__vai" data-serata="${e.id}" data-tipo-evento="${e.tipo}" data-iso="${e.iso}" data-ora="${e.ora}" data-titolo="${e.titolo}">Prenota<span class="sr-only"> per ${e.titolo}</span> <span aria-hidden="true">→</span></button>
</li>`,
		)
		.join('');
}
