// Stato dell'evento nel browser: una sola copia, ogni sezione lo legge e lo scrive.
// La scheda finisce nell'hash dell'URL (solo dopo una scelta dell'utente), così si può mandare a qualcuno.
import { aHash, daHash, normalizza, predefinito, type Evento } from './evento';
import type { TipoEvento } from './dati';

export type Opzione = Evento | null;
export interface Sposta {
	x: number;
	y: number;
}

let ev: Evento = predefinito();
let override: Record<string, Sposta> = {};
const opzioni: { A: Opzione; B: Opzione } = { A: null, B: null };
const ascoltatori = new Set<() => void>();
let toccato = false;

const chiave = (e: Evento) => `${e.spazio}|${e.formato}|${e.ospiti}|${e.palco}`;

function avvisa() {
	ascoltatori.forEach((f) => f());
}

function scrivi() {
	if (!toccato) return;
	try {
		history.replaceState(null, '', `${location.pathname}${location.search}#${aHash(ev)}`);
	} catch {
		/* ambienti senza History API */
	}
}

export const leggi = (): Evento => ev;
export const spostati = (): Record<string, Sposta> => override;
export const scelte = () => opzioni;

export function ascolta(f: () => void): () => void {
	ascoltatori.add(f);
	return () => ascoltatori.delete(f);
}

export function imposta(patch: Partial<Evento>): void {
	const prima = chiave(ev);
	toccato = true;
	ev = normalizza({ ...ev, ...patch });
	if (chiave(ev) !== prima) override = {};
	scrivi();
	avvisa();
}

export function scegliTipo(t: TipoEvento): void {
	const base = predefinito(t);
	imposta({ ...base, data: ev.data, ora: ev.ora, catering: ev.catering });
}

export function sposta(id: string, p: Sposta): void {
	override = { ...override, [id]: p };
	avvisa();
}
export function riordina(): void {
	override = {};
	avvisa();
}

export function tieni(slot: 'A' | 'B'): void {
	opzioni[slot] = { ...ev };
	avvisa();
}
export function togli(slot: 'A' | 'B'): void {
	opzioni[slot] = null;
	avvisa();
}
export function usa(slot: 'A' | 'B'): void {
	const o = opzioni[slot];
	if (o) imposta(o);
}

export function linkScheda(): string {
	return `${location.origin}${location.pathname}#${aHash(ev)}`;
}

// all'avvio: se l'URL porta già una scheda, la si adotta (senza riscriverla)
if (typeof location !== 'undefined') {
	const da = daHash(location.hash);
	if (da) ev = da;
	addEventListener('hashchange', () => {
		const nuovo = daHash(location.hash);
		if (nuovo && aHash(nuovo) !== aHash(ev)) {
			override = {};
			ev = nuovo;
			avvisa();
		}
	});
}
