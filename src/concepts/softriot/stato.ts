// Stato condiviso dei componenti di Soft Riot (solo lato browser): catalogo letto dal JSON della pagina,
// borsa salvata in localStorage (se c'è) e tre eventi per far parlare tra loro scheda, borsa e carosello.
import { COSTO_SPEDIZIONE, SOGLIA_SPEDIZIONE } from './dati';

export interface ProdottoClient {
	id: string;
	nome: string;
	prezzo: number;
	categoria: string;
	colori: { chiave: string; nome: string; hex: string }[];
	taglie: string[];
	testo: string;
	piccola: string; // immagine della tessera
	grande: string; // immagine della scheda rapida
	originale: boolean;
	campo: string; // sfondo CSS già composto
}

export interface Riga {
	id: string;
	taglia: string;
	q: number;
}

const CHIAVE = 'softriot-borsa';
let catalogo: Record<string, ProdottoClient> | null = null;

export function prodotti(): Record<string, ProdottoClient> {
	if (!catalogo) {
		const el = document.getElementById('sr-dati');
		const lista: ProdottoClient[] = el ? JSON.parse(el.textContent || '[]') : [];
		catalogo = Object.fromEntries(lista.map((p) => [p.id, p]));
	}
	return catalogo;
}

let righe: Riga[] | null = null;

export function borsa(): Riga[] {
	if (righe) return righe;
	try {
		const salvata = JSON.parse(localStorage.getItem(CHIAVE) || '[]');
		righe = Array.isArray(salvata) ? salvata.filter((r) => prodotti()[r.id]) : [];
	} catch {
		righe = [];
	}
	return righe!;
}

function salva() {
	try {
		localStorage.setItem(CHIAVE, JSON.stringify(righe));
	} catch {
		/* nessuna memoria: la borsa vive solo finché la pagina è aperta */
	}
	document.dispatchEvent(new CustomEvent('sr:borsa'));
}

export function aggiungi(id: string, taglia: string, q = 1) {
	const lista = borsa();
	const esiste = lista.find((r) => r.id === id && r.taglia === taglia);
	if (esiste) esiste.q = Math.min(9, esiste.q + q);
	else lista.push({ id, taglia, q });
	salva();
}

export function cambia(id: string, taglia: string, q: number) {
	const lista = borsa();
	const r = lista.find((x) => x.id === id && x.taglia === taglia);
	if (!r) return;
	r.q = Math.max(0, Math.min(9, q));
	righe = lista.filter((x) => x.q > 0);
	salva();
}

export function svuota() {
	righe = [];
	salva();
}

export function conteggio() {
	return borsa().reduce((n, r) => n + r.q, 0);
}

export function parziale() {
	return borsa().reduce((s, r) => s + r.q * (prodotti()[r.id]?.prezzo ?? 0), 0);
}

export function spedizione(p = parziale()) {
	return p === 0 || p >= SOGLIA_SPEDIZIONE ? 0 : COSTO_SPEDIZIONE;
}

export const apriScheda = (id: string) => document.dispatchEvent(new CustomEvent('sr:scheda', { detail: { id } }));
export const apriBorsa = () => document.dispatchEvent(new CustomEvent('sr:apri-borsa'));
export const filtra = (detail: { categoria?: string; originali?: boolean }) =>
	document.dispatchEvent(new CustomEvent('sr:filtra', { detail }));

export const ridotto = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
