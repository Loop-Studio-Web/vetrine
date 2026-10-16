// Il nodo finale: un trifoglio disegnato punto per punto, con passaggi sopra/sotto, che si stringe.
// `creaNodo(svg)` restituisce `imposta(stringi, disegna)`: stringi 0 = lasco e sottile, 1 = serrato e grosso.

const N = 260;
const GIRO = 11; // quanti punti per lato attorno a un incrocio hanno il passaggio "sopra"

type P = [number, number];

function punti(k: number): P[] {
	const out: P[] = [];
	const b = 2 - 0.42 * k;
	const sc = 62 * (1 - 0.3 * k);
	for (let i = 0; i < N; i++) {
		const s = (i / N) * Math.PI * 2;
		out.push([(Math.sin(s) + b * Math.sin(2 * s)) * sc, (Math.cos(s) - b * Math.cos(2 * s)) * sc]);
	}
	return out;
}

function interseca(a: P, b: P, c: P, d: P) {
	const r: P = [b[0] - a[0], b[1] - a[1]];
	const s: P = [d[0] - c[0], d[1] - c[1]];
	const den = r[0] * s[1] - r[1] * s[0];
	if (Math.abs(den) < 1e-9) return false;
	const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den;
	const u = ((c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0]) / den;
	return t > 0 && t < 1 && u > 0 && u < 1;
}

/** indici dei punti in cui il filo passa sopra a se stesso (calcolati una volta, sulla forma a metà) */
function incroci(): number[] {
	const p = punti(0.5);
	const out: number[] = [];
	for (let i = 0; i < N; i++) {
		for (let j = i + 2; j < N; j++) {
			if (i === 0 && j === N - 1) continue;
			if (interseca(p[i], p[(i + 1) % N], p[j], p[(j + 1) % N])) out.push(j);
		}
	}
	return out;
}

function tratto(p: P[], da: number, a: number) {
	let d = '';
	for (let i = da; i <= a; i++) {
		const q = p[((i % N) + N) % N];
		d += (i === da ? 'M' : 'L') + q[0].toFixed(1) + ' ' + q[1].toFixed(1);
	}
	return d;
}

export function creaNodo(svg: SVGSVGElement) {
	const sotto = svg.querySelector<SVGPathElement>('[data-sotto]')!;
	const alone = svg.querySelector<SVGPathElement>('[data-alone]')!;
	const sopra = svg.querySelector<SVGPathElement>('[data-sopra]')!;
	const sopraIdx = incroci();

	function imposta(stringi: number, disegna: number) {
		const k = Math.max(0, Math.min(1, stringi));
		const p = punti(k);
		const largo = 2.2 + 11 * k;
		sotto.setAttribute('d', tratto(p, 0, N) + 'Z');
		sotto.style.strokeWidth = String(largo);
		sotto.style.strokeDasharray = '1';
		sotto.style.strokeDashoffset = String(1 - disegna);
		const pezzi = sopraIdx.map((j) => tratto(p, j - GIRO, j + GIRO)).join('');
		alone.setAttribute('d', pezzi);
		alone.style.strokeWidth = String(largo + 7 + 5 * k);
		sopra.setAttribute('d', pezzi);
		sopra.style.strokeWidth = String(largo);
		const visibile = disegna > 0.97 ? 1 : 0;
		alone.style.opacity = sopra.style.opacity = String(visibile);
	}
	return { imposta };
}
