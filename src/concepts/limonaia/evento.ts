// Lo stato condiviso dell'evento: ogni sezione della pagina legge e scrive questo.
// Modulo puro (nessun DOM): lo usano frontmatter e browser.
import { FORMATI, SPAZI, TIPI, formato, spazio, tipo, type Formato, type SpazioId, type TipoEvento } from './dati';
import { dispone } from './pianta';

export interface Evento {
	tipo: TipoEvento;
	ospiti: number;
	formato: Formato;
	spazio: SpazioId;
	data: string | null; // AAAA-MM-GG
	ora: number; // 16 … 25 (25 = l'una di notte)
	palco: boolean;
	catering: boolean;
}

export const OSPITI_MIN = 20;
export const OSPITI_MAX = 220;
export const ORA_MIN = 16;
export const ORA_MAX = 25;

export function predefinito(t: TipoEvento = 'matrimonio'): Evento {
	const x = tipo(t);
	return { tipo: t, ospiti: x.ospiti, formato: x.formato, spazio: x.spazio, data: null, ora: 19, palco: t === 'matrimonio' || t === 'aziendale', catering: false };
}

const fra = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

/** Rende valido qualunque stato arrivi da fuori (hash dell'URL, campi di testo). */
export function normalizza(e: Partial<Evento>): Evento {
	const base = predefinito(TIPI.some((t) => t.id === e.tipo) ? e.tipo : 'matrimonio');
	const out: Evento = { ...base };
	if (Number.isFinite(e.ospiti)) out.ospiti = fra(Math.round(e.ospiti as number), OSPITI_MIN, OSPITI_MAX);
	if (FORMATI.some((f) => f.id === e.formato)) out.formato = e.formato as Formato;
	if (SPAZI.some((s) => s.id === e.spazio)) out.spazio = e.spazio as SpazioId;
	if (typeof e.data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(e.data) && !Number.isNaN(Date.parse(e.data))) out.data = e.data;
	if (Number.isFinite(e.ora)) out.ora = fra(e.ora as number, ORA_MIN, ORA_MAX);
	if (typeof e.palco === 'boolean') out.palco = e.palco;
	if (typeof e.catering === 'boolean') out.catering = e.catering;
	return out;
}

// ---------- scheda nell'URL ----------

export function aHash(e: Evento): string {
	const p = new URLSearchParams();
	p.set('t', e.tipo);
	p.set('o', String(e.ospiti));
	p.set('f', e.formato);
	p.set('s', e.spazio);
	if (e.data) p.set('d', e.data);
	p.set('h', String(Math.round(e.ora * 4) / 4));
	if (e.palco) p.set('p', '1');
	if (e.catering) p.set('c', '1');
	return p.toString();
}

export function daHash(h: string): Evento | null {
	const p = new URLSearchParams(h.replace(/^#/, ''));
	if (!p.has('t') && !p.has('o')) return null;
	return normalizza({
		tipo: (p.get('t') ?? undefined) as TipoEvento,
		ospiti: p.has('o') ? Number(p.get('o')) : undefined,
		formato: (p.get('f') ?? undefined) as Formato,
		spazio: (p.get('s') ?? undefined) as SpazioId,
		data: p.get('d'),
		ora: p.has('h') ? Number(p.get('h')) : undefined,
		palco: p.get('p') === '1',
		catering: p.get('c') === '1',
	});
}

// ---------- capienza e verdetto ----------

export function capienza(spazioId: SpazioId, formatoId: Formato, palco: boolean): number {
	// la capienza è quella che la disposizione dei tavoli regge davvero
	const max = spazio(spazioId).max;
	return Math.min(max, dispone(spazioId, formatoId, max, palco).posti);
}

/** Posti che restano quando nasce la pista (dopo le 22:30); la cerimonia non ha pista. */
export function capienzaConPista(spazioId: SpazioId, formatoId: Formato, palco: boolean): number {
	const max = spazio(spazioId).max;
	return Math.min(max, dispone(spazioId, formatoId, max, palco, true).posti);
}

export const ORA_PISTA = 22.5;

/** Numeri all'italiana con il punto anche sulle migliaia a quattro cifre (6.586, non 6586). */
export const migliaia = (n: number) => n.toLocaleString('it-IT', { useGrouping: 'always' as never, maximumFractionDigits: 0 });
export const eur = (n: number) => `${migliaia(n)} €`;

export type Giudizio = 'ampio' | 'giusto' | 'stretto' | 'noncista';

export interface Verdetto {
	giudizio: Giudizio;
	capienza: number;
	/** posti che restano con la pista, se sono meno degli ospiti (solo dalle 22:30) */
	conPista: number | null;
	testo: string;
	alternativa: SpazioId | null;
}

export function verdetto(e: Evento): Verdetto {
	const f = formato(e.formato);
	const s = spazio(e.spazio);
	const cap = capienza(e.spazio, e.formato, e.palco);
	const pieno = e.ospiti / Math.max(1, cap);
	let giudizio: Giudizio = 'giusto';
	if (e.ospiti > cap) giudizio = 'noncista';
	else if (pieno > 0.9) giudizio = 'stretto';
	else if (pieno < 0.6) giudizio = 'ampio';

	const alt = SPAZI.find((x) => x.id !== e.spazio && capienza(x.id, e.formato, e.palco) >= e.ospiti) ?? null;
	const dove = s.dove;
	const nomeF = f.nome.toLowerCase();
	const su = `${migliaia(e.ospiti)} su ${migliaia(cap)} posti`;
	let testo = '';
	if (giudizio === 'ampio') testo = `${su} ${dove} con ${nomeF}: c’è aria, anche per ballare.`;
	else if (giudizio === 'giusto') testo = `${su} ${dove} con ${nomeF}: ci state comodi, corridoi liberi.`;
	else if (giudizio === 'stretto') testo = `${su} ${dove} con ${nomeF}: ci si sta, ma stretti.`;
	else testo = `${su} ${dove} con ${nomeF}: non ci state.${alt ? ` Prova ${spazio(alt.id).dove}.` : ' Riduci gli ospiti o cambia formato.'}`;

	let conPista: number | null = null;
	if (e.ora >= ORA_PISTA && giudizio !== 'noncista' && e.formato !== 'cerimonia') {
		const c = capienzaConPista(e.spazio, e.formato, e.palco);
		if (e.ospiti > c) {
			conPista = c;
			testo += ` Dopo le 22:30 la pista toglie spazio: restano ${migliaia(c)} posti a sedere.`;
		}
	}
	return { giudizio, capienza: cap, conPista, testo, alternativa: giudizio === 'noncista' ? alt?.id ?? null : null };
}

// ---------- calendario ----------

export type StatoGiorno = 'libero' | 'opzionato' | 'occupato' | 'passato' | 'chiuso' | 'incompatibile';

function seme(s: string): number {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return ((h >>> 0) % 1000) / 1000;
}

export function iso(d: Date): string {
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const g = String(d.getDate()).padStart(2, '0');
	return `${d.getFullYear()}-${m}-${g}`;
}

export function stagione(d: Date): 'alta' | 'media' | 'bassa' {
	const m = d.getMonth();
	if (m >= 4 && m <= 8) return 'alta';
	if (m === 3 || m === 9) return 'media';
	return 'bassa';
}

export function statoGiorno(d: Date, e: Pick<Evento, 'spazio' | 'formato' | 'ospiti' | 'palco'>, oggi: Date): StatoGiorno {
	const inizio = new Date(oggi.getFullYear(), oggi.getMonth(), oggi.getDate());
	if (d < inizio) return 'passato';
	if (!spazio(e.spazio).mesi.includes(d.getMonth())) return 'chiuso';
	if (e.ospiti > capienza(e.spazio, e.formato, e.palco)) return 'incompatibile';
	const giorni = Math.round((d.getTime() - inizio.getTime()) / 86400000);
	if (giorni < 10) return 'occupato';
	const dow = d.getDay(); // 0 domenica
	const fine = dow === 6 ? 0.55 : dow === 5 || dow === 0 ? 0.3 : 0.08;
	const alta = stagione(d) === 'alta' ? 1.25 : stagione(d) === 'media' ? 1 : 0.6;
	const r = seme(`${iso(d)}|${e.spazio}`);
	if (r < fine * alta) return 'occupato';
	if (r < fine * alta + 0.12) return 'opzionato';
	return 'libero';
}

// ---------- preventivo ----------

export interface Voce {
	nome: string;
	importo: number;
	nota?: string;
}

export interface Preventivo {
	voci: Voce[];
	totale: number;
	da: number;
	a: number;
	allaTesta: number;
}

const BASE: Record<SpazioId, number> = { limonaia: 3800, giardino: 2900, cantina: 1700 };
const arrotonda = (n: number) => Math.round(n / 50) * 50;

export function preventivo(e: Evento): Preventivo {
	const data = e.data ? new Date(`${e.data}T12:00:00`) : null;
	const stag = data ? stagione(data) : 'media';
	const fStag = stag === 'alta' ? 1.2 : stag === 'bassa' ? 0.8 : 1;
	const dow = data ? data.getDay() : 6;
	const fGiorno = dow === 6 ? 1.2 : dow === 5 || dow === 0 ? 1 : 0.8;
	const pianta = dispone(e.spazio, e.formato, e.ospiti, e.palco);
	const tavoli = pianta.elementi.length;
	const voci: Voce[] = [];
	voci.push({ nome: `Affitto ${spazio(e.spazio).nome.toLowerCase()}`, importo: arrotonda(BASE[e.spazio] * fStag * fGiorno), nota: data ? `stagione ${stag}` : 'stagione media' });
	const unita = e.formato === 'cerimonia' ? Math.ceil(e.ospiti / 10) : tavoli;
	voci.push({ nome: 'Allestimento sala', importo: unita * 18 + (e.palco ? 350 : 0), nota: e.palco ? 'palco compreso' : undefined });
	voci.push({ nome: 'Servizio in sala', importo: Math.ceil(e.ospiti / 20) * 160 });
	if (e.ora >= 19) voci.push({ nome: 'Luci e ghirlande', importo: 420 });
	voci.push({ nome: 'Pulizie e custodia', importo: 250 });
	if (e.catering) voci.push({ nome: 'Catering', importo: e.ospiti * tipo(e.tipo).cateringTesta, nota: `${tipo(e.tipo).cateringTesta} € a persona` });
	const totale = voci.reduce((a, v) => a + v.importo, 0);
	return { voci, totale, da: arrotonda(totale * 0.93), a: arrotonda(totale * 1.07), allaTesta: Math.round(totale / e.ospiti) };
}

// ---------- la giornata ----------

export type Fase = 'giorno' | 'tramonto' | 'sera' | 'notte';

export interface Momento {
	da: number;
	nome: string;
	/** etichetta corta per i pulsanti: una riga, così hanno tutti la stessa altezza */
	breve: string;
}

export const MOMENTI: Momento[] = [
	{ da: 16, nome: 'Accoglienza', breve: 'Accoglienza' },
	{ da: 17.5, nome: 'Cerimonia e brindisi', breve: 'Brindisi' },
	{ da: 19, nome: 'Aperitivo nel giardino', breve: 'Aperitivo' },
	{ da: 20.5, nome: 'Cena', breve: 'Cena' },
	{ da: 22.5, nome: 'Taglio della torta', breve: 'La torta' },
	{ da: 23, nome: 'Si balla', breve: 'Si balla' },
	{ da: 25, nome: 'Ultima luce', breve: 'Ultima luce' },
];

export function fase(ora: number): Fase {
	if (ora < 18.5) return 'giorno';
	if (ora < 20.25) return 'tramonto';
	if (ora < 22.5) return 'sera';
	return 'notte';
}

/** Tappa fotografica della giornata: 0 serra di giorno, 1 tramonto, 2 sera, 3 notte. */
export function tappa(ora: number): 0 | 1 | 2 | 3 {
	return ora < 18 ? 0 : ora < 20.5 ? 1 : ora < 23 ? 2 : 3;
}

export function momento(ora: number): Momento {
	let m = MOMENTI[0];
	for (const x of MOMENTI) if (ora >= x.da) m = x;
	return m;
}

/** 0 = tavoli al loro posto, 1 = tavoli ritirati e pista libera. */
export function ritiro(ora: number): number {
	return fra((ora - ORA_PISTA) / 0.25, 0, 1);
}

/** Luce della sala da 0 (giorno pieno) a 1 (notte), per cielo e lampade. */
export function buio(ora: number): number {
	return fra((ora - 18) / 4, 0, 1);
}

export function oraTesto(ora: number): string {
	const h = Math.floor(ora) % 24;
	const m = Math.round((ora - Math.floor(ora)) * 60);
	return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
