// Orari del negozio e fasce di ritiro, condivisi da Lista (prenotazione) e Visita (orari, biglietto).
// Tutto è calcolato sull'ora di Roma, non su quella di chi guarda. Solo browser: non importare dal frontmatter.
export const giorniBrevi = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// indice = getDay(): domenica 0. null = chiuso
export const orari: ([string, string] | null)[] = [null, null, ['09:30', '19:00'], ['09:30', '19:00'], ['09:30', '19:00'], ['09:30', '20:00'], ['10:00', '20:00']];

export const minuti = (h: string) => Number(h.slice(0, 2)) * 60 + Number(h.slice(3));
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

// "adesso" a Roma: giorno della settimana, minuti dalla mezzanotte e data (anno, mese, giorno)
export function adessoRoma() {
	const parti = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
	const v = (t: string) => parti.find((p) => p.type === t)!.value;
	return { giorno: giorniBrevi.indexOf(v('weekday')), min: (Number(v('hour')) % 24) * 60 + Number(v('minute')), y: Number(v('year')), m: Number(v('month')), d: Number(v('day')) };
}

export type Fascia = { id: string; etichetta: string; sub: string; ore: string[] };

// Le prossime giornate di apertura (fino a `n`), con un'ora di ritiro ogni 60 minuti. Oggi: solo da due ore da adesso in poi.
export function fasce(n = 4, anticipo = 120): Fascia[] {
	const a = adessoRoma();
	const out: Fascia[] = [];
	for (let k = 0; k < 10 && out.length < n; k++) {
		const data = new Date(Date.UTC(a.y, a.m - 1, a.d + k));
		const o = orari[data.getUTCDay()];
		if (!o) continue;
		const da = Math.max(minuti(o[0]), k === 0 ? Math.ceil((a.min + anticipo) / 60) * 60 : 0);
		const ore: string[] = [];
		for (let t = da; t <= minuti(o[1]) - 60; t += 60) ore.push(hhmm(t));
		if (!ore.length) continue;
		const nome = k === 0 ? 'Today' : k === 1 ? 'Tomorrow' : giorniBrevi[data.getUTCDay()];
		out.push({ id: data.toISOString().slice(0, 10), etichetta: nome, sub: `${data.getUTCDate()}/${data.getUTCMonth() + 1}`, ore });
	}
	return out;
}

export type Ritiro = { codice: string; quando: string; pezzi: number; totale: number; build: boolean };
export const chiaveRitiro = 'hotswap-ritiro';
export function leggiRitiro(): Ritiro | null {
	try {
		return JSON.parse(sessionStorage.getItem(chiaveRitiro) || 'null');
	} catch {
		return null;
	}
}
