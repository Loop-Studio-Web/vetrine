// Papel picado: una cuerda con banderas de papel de china calado, generadas con una semilla.
// Cada bandera es un solo <path> con fill-rule evenodd: los huecos dejan ver el color de la sección.

const rng = (seed: number) => {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
};

const f = (v: number) => Math.round(v * 10) / 10;
const circ = (cx: number, cy: number, r: number) => `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;
const rombo = (cx: number, cy: number, r: number) => `M${f(cx)} ${f(cy - r)}L${f(cx + r * 0.7)} ${f(cy)}L${f(cx)} ${f(cy + r)}L${f(cx - r * 0.7)} ${f(cy)}Z`;

const bandera = (W: number, H: number, tipo: number, rand: () => number) => {
	const base = H * 0.84;
	const dientes = 6;
	let d = `M0 0H${W}V${f(base)}`;
	for (let i = dientes; i > 0; i--) {
		const x1 = (W * (i - 0.5)) / dientes;
		const x2 = (W * (i - 1)) / dientes;
		d += `L${f(x1)} ${f(H * (0.97 + rand() * 0.03))}L${f(x2)} ${f(base)}`;
	}
	d += 'Z';
	const cx = W / 2;
	// huecos
	const cy = H * 0.44;
	if (tipo === 0) {
		d += circ(cx, cy, W * 0.13);
		for (let i = 0; i < 8; i++) {
			const a = (i / 8) * Math.PI * 2;
			d += circ(cx + Math.cos(a) * W * 0.27, cy + Math.sin(a) * W * 0.27, W * 0.055);
		}
	} else if (tipo === 1) {
		d += rombo(cx, cy, H * 0.2);
		for (let i = 0; i < 4; i++) d += circ(W * (0.2 + i * 0.2), H * 0.68, W * 0.05);
	} else if (tipo === 2) {
		// una flor de cuatro pétalos
		for (let i = 0; i < 4; i++) {
			const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
			d += circ(cx + Math.cos(a) * W * 0.14, cy + Math.sin(a) * W * 0.14, W * 0.1);
		}
		d += circ(cx, cy, W * 0.05);
	} else {
		// calavera de lejos: dos ojos y una rendija, entre cenefas
		d += circ(cx - W * 0.14, cy - H * 0.05, W * 0.09) + circ(cx + W * 0.14, cy - H * 0.05, W * 0.09);
		d += rombo(cx, cy + H * 0.1, W * 0.07);
	}
	// cenefa superior y marco de puntos
	for (let i = 0; i < 5; i++) d += rombo(W * (0.14 + i * 0.18), H * 0.1, H * 0.055);
	for (let i = 0; i < 3; i++) d += circ(W * (0.25 + i * 0.25), H * 0.8, W * 0.035);
	return d;
};

export const COLORES_PAPEL = ['#ff2d95', '#ff9a1f', '#12b5ad', '#ffc83d', '#7a2e8e', '#ffffff'];

/**
 * @param n banderas
 * @param semilla número fijo para que el build sea estable
 * @param colores colores de las banderas (se turnan)
 */
export const papelPicado = (n: number, semilla: number, colores = COLORES_PAPEL, W = 1200) => {
	const rand = rng(semilla);
	const paso = W / n;
	const bw = paso * 0.84;
	const bh = bw * 1.22;
	const sag = 16;
	const cuerda = (x: number) => 8 + 4 * sag * (x / W) * (1 - x / W);
	let d = '';
	for (let i = 0; i < n; i++) {
		const x = paso * i + (paso - bw) / 2;
		const y = cuerda(x + bw / 2);
		const col = colores[(i + Math.floor(rand() * 2)) % colores.length];
		const inc = ((rand() - 0.5) * 2).toFixed(2);
		const lag = (rand() * -6).toFixed(2);
		d += `<g transform="translate(${f(x)} ${f(y)})"><path class="pp" style="--inc:${inc}deg;--lag:${lag}s" fill="${col}" fill-rule="evenodd" d="${bandera(bw, bh, i % 4, rand)}"/></g>`;
	}
	return (
		`<svg class="papel" viewBox="0 0 ${W} ${Math.round(8 + sag + bh + 8)}" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">` +
		`<path d="M0 8Q${W / 2} ${8 + sag * 2} ${W} 8" stroke="#2b0a1e" stroke-width="1.5" fill="none" opacity=".55"/>` +
		d +
		`</svg>`
	);
};
