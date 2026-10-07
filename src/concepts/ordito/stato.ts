// Lo stato della casa di Ordito: unica fonte per la scena 3D, i pannelli, le regole e i numeri.
// Solo browser: nel frontmatter .astro importare soltanto formato.ts.
export type Stanza = 'ingresso' | 'soggiorno' | 'cucina' | 'camera' | 'studio' | 'giardino';
export type Presenza = 'casa' | 'via' | 'letto';

export type Stato = {
	ora: number; // 0..24
	luci: Record<Stanza, number>; // 0..1
	tapparelle: number; // 0 chiuse .. 1 aperte
	clima: number; // °C impostati
	allarme: boolean;
	serratura: boolean; // true = chiusa a chiave
	tv: boolean;
	ev: boolean; // auto in carica
	presenza: Presenza;
};

export const stanze: { id: Stanza; nome: string }[] = [
	{ id: 'ingresso', nome: 'Ingresso' },
	{ id: 'soggiorno', nome: 'Soggiorno' },
	{ id: 'cucina', nome: 'Cucina' },
	{ id: 'camera', nome: 'Camera' },
	{ id: 'studio', nome: 'Studio' },
	{ id: 'giardino', nome: 'Giardino' },
];

const spente: Record<Stanza, number> = { ingresso: 0, soggiorno: 0, cucina: 0, camera: 0, studio: 0, giardino: 0 };

export type Scenario = { id: string; nome: string; nota: string; ora: number; patch: Partial<Omit<Stato, 'luci'>> & { luci?: Partial<Record<Stanza, number>> } };

export const scenari: Scenario[] = [
	{ id: 'mattino', nome: 'Mattino', nota: 'Tapparelle su, colazione, clima a 21°', ora: 7.2, patch: { luci: { cucina: 0.8, ingresso: 0.4 }, tapparelle: 1, clima: 21, allarme: false, serratura: true, tv: false, presenza: 'casa' } },
	{ id: 'arrivo', nome: 'Arrivo a casa', nota: 'La porta si apre, le luci ti aspettano', ora: 18.6, patch: { luci: { ingresso: 0.9, soggiorno: 0.7, giardino: 0.8 }, tapparelle: 0.6, clima: 21, allarme: false, serratura: false, tv: false, presenza: 'casa' } },
	{ id: 'cena', nome: 'Cena', nota: 'Luce calda sull’isola, il resto in penombra', ora: 20.3, patch: { luci: { cucina: 1, soggiorno: 0.35, giardino: 0.4 }, tapparelle: 0, clima: 21, allarme: false, serratura: true, tv: false, presenza: 'casa' } },
	{ id: 'notte', nome: 'Notte', nota: 'Tutto spento, allarme inserito, clima a 18°', ora: 23.6, patch: { luci: { camera: 0.15 }, tapparelle: 0, clima: 18, allarme: true, serratura: true, tv: false, presenza: 'letto' } },
	{ id: 'vacanza', nome: 'Vacanza', nota: 'Casa vuota: clima in risparmio e presenza simulata', ora: 14, patch: { luci: {}, tapparelle: 0.3, clima: 15, allarme: true, serratura: true, tv: false, ev: false, presenza: 'via' } },
];

export const stato: Stato = {
	ora: 18.2,
	luci: { ...spente, ingresso: 0.5, giardino: 0.7, soggiorno: 0.35 },
	tapparelle: 1,
	clima: 21,
	allarme: false,
	serratura: true,
	tv: false,
	ev: true,
	presenza: 'casa',
};

type Patch = Partial<Omit<Stato, 'luci'>> & { luci?: Partial<Record<Stanza, number>> };

export function imposta(p: Patch) {
	const { luci, ...resto } = p;
	Object.assign(stato, resto);
	if (luci) Object.assign(stato.luci, luci);
	stato.ora = ((stato.ora % 24) + 24) % 24;
	dispatchEvent(new CustomEvent('ordito:stato', { detail: stato }));
}

export function applicaScenario(id: string) {
	const s = scenari.find((x) => x.id === id);
	if (!s) return;
	// ogni scenario parte da luci spente, poi accende quelle indicate
	imposta({ ora: s.ora, ...s.patch, luci: { ...spente, ...s.patch.luci } });
	dispatchEvent(new CustomEvent('ordito:scenario', { detail: id }));
}

/** Quale scenario sta descrivendo meglio lo stato attuale (per evidenziarlo), o '' se nessuno. */
export function scenarioAttivo(): string {
	return scenari.find((s) => Math.abs(s.ora - stato.ora) < 0.05)?.id ?? '';
}

// ---- grandezze derivate ----
export const elevazione = (ora: number) => Math.sin((Math.PI * (ora - 6.4)) / 12.4);
export const tempEsterna = (ora: number) => 13 + 7 * Math.sin(((ora - 9) / 24) * Math.PI * 2);

const potenzaLuce: Record<Stanza, number> = { ingresso: 0.04, soggiorno: 0.12, cucina: 0.1, camera: 0.08, studio: 0.08, giardino: 0.06 };

export function derivati(s: Stato = stato) {
	const elev = elevazione(s.ora);
	const produzione = elev > 0 ? 4.2 * Math.pow(elev, 1.2) : 0;
	const luci = (Object.keys(potenzaLuce) as Stanza[]).reduce((t, k) => t + potenzaLuce[k] * s.luci[k], 0);
	const tEst = tempEsterna(s.ora);
	const clima = 0.11 * Math.abs(s.clima - tEst) * (s.presenza === 'via' ? 0.6 : 1);
	const consumo = 0.18 + luci + clima + (s.tv ? 0.15 : 0) + (s.ev ? 3.7 : 0) + (s.allarme ? 0.02 : 0);
	return { elev, produzione, consumo, rete: consumo - produzione, tEst, clima, luci };
}

export const oraTesto = (o: number) => {
	const h = Math.floor(o);
	const m = Math.floor((o - h) * 60 + 0.0001);
	return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export function fraseOra(o: number) {
	if (o < 5.5 || o >= 22) return 'notte';
	if (o < 7.4) return 'alba';
	if (o < 11.5) return 'mattina';
	if (o < 15) return 'giorno';
	if (o < 18) return 'pomeriggio';
	if (o < 19.8) return 'tramonto';
	return 'sera';
}
