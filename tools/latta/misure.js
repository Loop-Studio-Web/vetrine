// Misure delle latte (cm), comuni all'etichetta e alla scena. Latte quadre da olio vere: 5 L = 15 × 12 × 31,5 cm.
export const FORMATI = {
	1: { w: 9.5, d: 6.2, h: 20, r: 0.7, tappo: 1.7 },
	3: { w: 12, d: 9, h: 29.5, r: 0.85, tappo: 2.2 },
	5: { w: 15, d: 12, h: 31.5, r: 0.95, tappo: 2.4 },
};
export const PX_CM = 110; // risoluzione dell'etichetta
export const FASCIA = 1.1; // banda di metallo nudo sopra e sotto, vicino all'aggraffatura

// Il giro dell'etichetta: fronte, spigolo, fianco destro, spigolo, retro, spigolo, fianco sinistro, spigolo.
// u = 0 all'inizio del tratto piatto del fronte.
export function giro(f) {
	const { w, d, r } = FORMATI[f];
	const a = (Math.PI * r) / 2;
	const tratti = [
		{ nome: 'fronte', l: w - 2 * r },
		{ nome: 'spigolo', l: a },
		{ nome: 'dx', l: d - 2 * r },
		{ nome: 'spigolo', l: a },
		{ nome: 'retro', l: w - 2 * r },
		{ nome: 'spigolo', l: a },
		{ nome: 'sx', l: d - 2 * r },
		{ nome: 'spigolo', l: a },
	];
	let x = 0;
	for (const t of tratti) {
		t.x = x;
		x += t.l;
	}
	return { tratti, perimetro: x };
}
