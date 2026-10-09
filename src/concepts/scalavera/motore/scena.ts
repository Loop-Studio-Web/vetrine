/* La discesa di scala: tappe, inquadrature e tagli di montaggio allineati sull'oggetto
   conduttore (il tavolo in travertino). Puro: niente DOM, usabile ovunque.

   Una vista è { c: centro in uv dell'immagine, z: zoom }. Con z = 1 l'altezza
   dell'immagine riempie l'altezza della tavola. Le immagini sono tutte 4:5. */

export type Vista = { cx: number; cy: number; z: number };
export type Foto = { tx: number; ty: number; w: number }; // il tavolo: centro e larghezza in uv-x
export type Tappa = { img: number; v: Vista; asciutto: number; scala: number };

// Misure del tavolo nelle tre inquadrature (frazioni dell'immagine).
export const foto: Foto[] = [
	{ tx: 0.574, ty: 0.655, w: 0.23 }, // a1, dalla soglia
	{ tx: 0.52, ty: 0.874, w: 0.427 }, // a2, la parete
	{ tx: 0.457, ty: 0.646, w: 0.95 }, // a6, il tavolo
];

const intera: Vista = { cx: 0.5, cy: 0.5, z: 1 };

export const tappe: Tappa[] = [
	{ img: 0, v: intera, asciutto: 0, scala: 50 },
	{ img: 0, v: intera, asciutto: 1, scala: 50 },
	{ img: 0, v: { cx: 0.57, cy: 0.63, z: 2.2 }, asciutto: 1, scala: 25 },
	{ img: 1, v: intera, asciutto: 1, scala: 20 },
	{ img: 1, v: { cx: 0.52, cy: 0.8, z: 2.4 }, asciutto: 1, scala: 10 },
	{ img: 2, v: intera, asciutto: 1, scala: 5 },
	{ img: 2, v: { cx: 0.66, cy: 0.8, z: 4.5 }, asciutto: 1, scala: 1 },
];

const G = 1.3; // zoom in più durante un taglio, perché il movimento non si fermi

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// Zoom "naturale": scala esponenziale e centro pesato sullo zoom (i punti non scivolano).
export function interpola(a: Vista, b: Vista, t: number): Vista {
	const z = a.z * Math.pow(b.z / a.z, t);
	const wa = (1 - t) * a.z, wb = t * b.z, s = wa + wb || 1;
	return { cx: (a.cx * wa + b.cx * wb) / s, cy: (a.cy * wa + b.cy * wb) / s, z };
}

// Zoom di g attorno al tavolo, lasciandolo fermo sullo schermo.
function attorno(v: Vista, f: Foto, g: number): Vista {
	return { cx: f.tx - (f.tx - v.cx) / g, cy: f.ty - (f.ty - v.cy) / g, z: v.z * g };
}

// La vista di B in cui il tavolo occupa lo stesso posto e la stessa larghezza che ha in A.
function combacia(v: Vista, a: Foto, b: Foto): Vista {
	const z = (v.z * a.w) / b.w;
	return { cx: b.tx - ((a.tx - v.cx) * v.z) / z, cy: b.ty - ((a.ty - v.cy) * v.z) / z, z };
}

// Tiene la vista dentro l'immagine (la tavola che si posa durante un taglio può uscirne).
function dentro(v: Vista): Vista {
	const z = Math.max(v.z, 1), m = 0.5 / z;
	const c = (x: number) => Math.min(Math.max(x, m), 1 - m);
	return { cx: c(v.cx), cy: c(v.cy), z };
}

export type Stato = {
	a: number; va: Vista; // immagine sotto
	b: number; vb: Vista; // immagine che entra (uguale ad a fuori dai tagli)
	taglio: number; // 0 → 1, avanzamento della dissolvenza da a a b
	asciutto: number; // 0 = acquerello bagnato, 1 = render
	scala: number; // denominatore della scala mostrata (1:n)
};

export function stato(s: number): Stato {
	const n = tappe.length - 1;
	s = Math.min(Math.max(s, 0), n);
	const i = Math.min(Math.floor(s), n - 1);
	const t = s - i;
	const A = tappe[i], B = tappe[i + 1];
	const scala = A.scala * Math.pow(B.scala / A.scala, t);
	if (A.img === B.img) {
		const v = interpola(A.v, B.v, t);
		return { a: A.img, va: v, b: A.img, vb: v, taglio: 0, asciutto: mix(A.asciutto, B.asciutto, t), scala };
	}
	// Taglio: nella prima metà le due inquadrature combaciano e zoomano insieme sul tavolo,
	// nella seconda B prosegue da sola verso la sua vista.
	const fa = foto[A.img], fb = foto[B.img];
	const inizio = combacia(A.v, fa, fb);
	const k = Math.min(t / 0.5, 1);
	const g = Math.pow(G, k);
	const va = attorno(A.v, fa, g);
	const vb = t < 0.5 ? attorno(inizio, fb, g) : interpola(attorno(inizio, fb, G), B.v, (t - 0.5) / 0.5);
	return { a: A.img, va: dentro(va), b: B.img, vb: t < 0.5 ? vb : dentro(vb), taglio: k, asciutto: 1, scala };
}
