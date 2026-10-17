// Gli sfondi come arazzi. Una sola tela WebGL (OGL) disegna, per ogni sala, una pila di fotografie:
// la prima si tesse entrando in sala (l'ordito scende, la trama lo attraversa, l'immagine si chiude),
// le altre si tessono una sull'altra mentre si attraversa la sala. Una lente segue il mouse.
// Corridoio: la foto resta ferma sullo schermo e la sala è una tenda che la scopre, con un velo di colore sotto il testo.
// Pila (telefono): la foto sta in un pannello in cima alla sala.
// Le texture si caricano quando la sala si avvicina e si rilasciano quando è lontana.

import { Renderer, Program, Mesh, Geometry, Texture } from 'ogl';

const VERT = /* glsl */ `
attribute vec2 position;
uniform vec4 uRect;
uniform vec2 uRes;
varying vec2 vPx;
void main() {
	vPx = uRect.xy + position * uRect.zw;
	vec2 c = vPx / uRes * 2.0 - 1.0;
	gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
}`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vPx;
uniform sampler2D uTex;
uniform vec4 uRect;
uniform vec2 uRes;
uniform vec2 uImg;
uniform float uScreen;
uniform float uSolid;
uniform vec3 uColor;
uniform float uCell;
uniform float uWeave;
uniform vec2 uMouse;
uniform float uHover;
uniform float uDrift;
uniform float uVeil;
uniform vec2 uSide; // quanto pesa il velo a sinistra e a destra (dipende da dove stanno le slide visibili)
uniform vec3 uColL; // colore del velo a sinistra e a destra: scuro sotto il testo chiaro, chiaro sotto il testo scuro
uniform vec3 uColR;
uniform vec2 uRoom; // bordo sinistro e destro della sala sullo schermo

float hash(float n) { return fract(sin(n * 127.1 + 11.7) * 43758.5453); }

void main() {
	if (uSolid > 0.5) {
		gl_FragColor = vec4(uColor, 1.0);
		return;
	}
	vec2 box = uScreen > 0.5 ? uRes : uRect.zw;
	vec2 loc = uScreen > 0.5 ? vPx : vPx - uRect.xy;
	vec2 q = loc / box;
	float asp = box.x / box.y;

	// lente
	vec2 dv = (loc - uMouse) / box.y;
	float bl = uHover * smoothstep(0.4, 0.0, length(dv));
	vec2 sq = q - (q - uMouse / box) * 0.16 * bl;

	// object-fit: cover, un po' di zoom e una deriva lenta con l'avanzare nella sala
	float ia = uImg.x / uImg.y;
	vec2 s = vec2(1.0);
	if (asp > ia) s.y = ia / asp; else s.x = asp / ia;
	s /= 1.08;
	vec3 col = texture2D(uTex, (sq - 0.5) * s + 0.5 + vec2(uDrift * 0.03, uDrift * 0.035)).rgb;

	// velo di colore dal lato del testo: leggero, la foto resta la protagonista (misure in schermi dal bordo della sala)
	if (uVeil > 0.0) {
		float xl = (vPx.x - uRoom.x) / uRes.x;
		float xr = (uRoom.y - vPx.x) / uRes.x;
		float aL = 0.5 * uSide.x * (1.0 - smoothstep(0.24, 0.58, xl));
		float aR = 0.5 * uSide.y * (1.0 - smoothstep(0.24, 0.58, xr));
		col = mix(mix(col, uColL, aL), uColR, aR);
	}

	// tessitura
	float W = uWeave;
	vec2 g = vPx / uCell;
	vec2 id = floor(g);
	vec2 f = fract(g);
	float wp = clamp((W - hash(id.x) * 0.32) / 0.5, 0.0, 1.0);
	float tp = clamp((W - 0.28 - hash(id.y + 37.0) * 0.3) / 0.46, 0.0, 1.0);
	float fy = mod(id.x, 2.0) < 1.0 ? q.y : 1.0 - q.y;
	float fx = mod(id.y, 2.0) < 1.0 ? q.x : 1.0 - q.x;
	float warp = step(fy - 0.0015, wp) * step(0.0005, W);
	float weft = step(fx - 0.0015, tp) * step(0.0005, W);
	float over = mod(id.x + id.y, 2.0);

	float sW = 0.7 + 0.3 * sin(3.14159 * f.x);
	float sT = 0.7 + 0.3 * sin(3.14159 * f.y);
	float build = 1.0 - smoothstep(0.8, 1.0, W);

	float vis = 0.0;
	float shade = 1.0;
	if (warp > 0.5 && weft > 0.5) {
		vis = 1.0;
		shade = mix(1.0, over > 0.5 ? sW : sT, build);
	} else if (warp > 0.5) {
		vis = mix(1.0, 1.0 - smoothstep(0.30, 0.36, abs(f.x - 0.5)), build);
		shade = mix(1.0, sW * 0.8, build);
	} else if (weft > 0.5) {
		vis = mix(1.0, 1.0 - smoothstep(0.30, 0.36, abs(f.y - 0.5)), build);
		shade = mix(1.0, sT * 0.8, build);
	}
	shade *= 1.0 + (hash(id.x * 7.0 + id.y * 13.0) - 0.5) * 0.12 * build;
	gl_FragColor = vec4(col * shade * vis, vis);
}`;

export interface InfoSala {
	el: HTMLElement;
	r: DOMRect;
	u: number; // 0..1 avanzamento nella sala
	/** quanto vuole essere tessuta ogni foto dopo la prima (0..1), deciso dal motore insieme alle slide */
	w?: number[];
	/** velo a sinistra e a destra: peso (0..1) e quanto è chiaro (0 = scuro, per il testo chiaro; 1 = chiaro, per il testo scuro) */
	vel?: { w: [number, number]; chiaro: [number, number] };
}

interface DatoScatto {
	g: string;
	m: string;
	v?: string; // foto verticale per il telefono
	cap: string;
	w: number;
	h: number;
}

interface Scatto {
	dato: DatoScatto;
	prog: Program;
	mesh: Mesh;
	tex: Texture | null;
	stato: 'vuoto' | 'carica' | 'pronto';
	weave: number;
	hov: number;
}

interface SalaGL {
	el: HTMLElement;
	fondo: HTMLElement;
	scatti: Scatto[];
	solid: Mesh;
	solidProg: Program;
	colore: [number, number, number];
	hero: boolean;
}

const CHIARO = [0.902, 0.925, 0.933]; // il marmo (#e6ecee), colore del velo sotto il testo scuro

const lim = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, x: number) => {
	const t = lim((x - a) / (b - a));
	return t * t * (3 - 2 * t);
};

function rgb(css: string): [number, number, number] {
	const c = document.createElement('canvas').getContext('2d')!;
	c.fillStyle = css.trim() || '#000';
	const h = c.fillStyle as string; // "#rrggbb"
	return [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
}

export class Arazzo {
	private renderer: Renderer;
	private gl: WebGL2RenderingContext | WebGLRenderingContext;
	private sale: SalaGL[] = [];
	private orizz: boolean;
	private fine: boolean;
	private t0 = performance.now();
	private mouse = { x: -1, y: -1 };
	private hover = 0;
	private disegnato = false;
	private vuota: Texture;

	constructor(
		private tela: HTMLCanvasElement,
		opts: { orizzontale: boolean; onPerso: () => void },
	) {
		this.orizz = opts.orizzontale;
		this.fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
		this.renderer = new Renderer({
			canvas: tela,
			alpha: true,
			premultipliedAlpha: true,
			antialias: false,
			dpr: Math.min(devicePixelRatio || 1, 1.5),
			powerPreference: 'low-power',
		});
		this.gl = this.renderer.gl;
		this.gl.clearColor(0, 0, 0, 0);
		this.vuota = new Texture(this.gl);
		tela.addEventListener('webglcontextlost', (e) => {
			e.preventDefault();
			opts.onPerso();
		});
		this.ridimensiona();
		addEventListener('resize', () => this.ridimensiona());
		if (this.fine) addEventListener('pointermove', (e) => ((this.mouse.x = e.clientX), (this.mouse.y = e.clientY)), { passive: true });

		const geo = new Geometry(this.gl, { position: { size: 2, data: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]) } });
		document.querySelectorAll<HTMLElement>('[data-sala][data-con-foto]').forEach((el) => this.aggiungi(el, geo));
	}

	private ridimensiona() {
		this.renderer.setSize(innerWidth, innerHeight);
	}

	private programma(solid: boolean, colore: [number, number, number], tex?: Texture) {
		return new Program(this.gl, {
			vertex: VERT,
			fragment: FRAG,
			transparent: true,
			depthTest: false,
			depthWrite: false,
			cullFace: false,
			uniforms: {
				uTex: { value: tex ?? this.vuota },
				uRect: { value: [0, 0, 1, 1] },
				uRes: { value: [innerWidth, innerHeight] },
				uImg: { value: [1, 1] },
				uScreen: { value: this.orizz ? 1 : 0 },
				uSolid: { value: solid ? 1 : 0 },
				uColor: { value: colore },
				uCell: { value: 18 },
				uWeave: { value: 0 },
				uMouse: { value: [0, 0] },
				uHover: { value: 0 },
				uDrift: { value: 0 },
				uVeil: { value: 0 },
				uSide: { value: [0, 0] },
					uColL: { value: colore },
					uColR: { value: colore },
				uRoom: { value: [0, 1] },
			},
		});
	}

	private aggiungi(el: HTMLElement, geo: Geometry) {
		const fondo = el.querySelector<HTMLElement>('[data-fondo]');
		if (!fondo) return;
		// telefono: la foto dell'ingresso resta l'<img> normale, senza tessitura (la tela parte al primo gesto e farebbe un salto)
		if (!this.orizz && el.hasAttribute('data-hero')) return;
		const dati: DatoScatto[] = JSON.parse(fondo.dataset.scatti || '[]');
		const colore = rgb(getComputedStyle(el).getPropertyValue('--fondo'));
		const gl = this.gl;
		const mk = (prog: Program) => new Mesh(gl, { geometry: geo, program: prog, mode: gl.TRIANGLE_STRIP, frustumCulled: false });
		const solidProg = this.programma(true, colore);
		const sala: SalaGL = {
			el,
			fondo,
			colore,
			hero: el.hasAttribute('data-hero'),
			solidProg,
			solid: mk(solidProg),
			scatti: dati.map((dato) => {
				const prog = this.programma(false, colore);
				return { dato, prog, mesh: mk(prog), tex: null, stato: 'vuoto', weave: 0, hov: 0 };
			}),
		};
		this.sale.push(sala);
	}

	private carica(s: Scatto) {
		if (s.stato !== 'vuoto') return;
		s.stato = 'carica';
		const img = new Image();
		img.decoding = 'async';
		img.onload = () => {
			if (s.stato !== 'carica') return;
			const gl = this.gl;
			const tex = new Texture(gl, { generateMipmaps: false, flipY: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR });
			tex.image = img;
			s.tex = tex;
			s.prog.uniforms.uTex.value = tex;
			s.prog.uniforms.uImg.value = [img.naturalWidth, img.naturalHeight];
			s.stato = 'pronto';
		};
		img.src = this.orizz ? s.dato.g : innerWidth < 900 && s.dato.v ? s.dato.v : s.dato.m;
	}

	private rilascia(s: Scatto) {
		if (s.stato === 'vuoto') return;
		if (s.tex) this.gl.deleteTexture(s.tex.texture);
		s.tex = null;
		s.prog.uniforms.uTex.value = this.vuota;
		s.stato = 'vuoto';
		s.weave = 0;
	}

	/** da chiamare a ogni fotogramma, con le sale già misurate dal motore */
	disegna(info: InfoSala[]) {
		const gl = this.gl;
		const W = innerWidth;
		const H = innerHeight;
		const t = (performance.now() - this.t0) / 1000;
		const intro = smooth(0.35, 2.7, t); // la foto dell'ingresso si tesse da sola al caricamento
		const da: Mesh[] = [];

		for (const inf of info) {
			const sala = this.sale.find((x) => x.el === inf.el);
			if (!sala) continue;
			const r = inf.r;
			const pr = this.orizz ? r : sala.fondo.getBoundingClientRect();
			const vicino = this.orizz ? r.left < W * 2.2 && r.right > -W * 1.2 : pr.top < H * 2.5 && pr.bottom > -H * 1.5;
			const lontano = this.orizz ? r.left > W * 4 || r.right < -W * 3 : pr.top > H * 4.5 || pr.bottom < -H * 3.5;
			if (lontano) {
				sala.scatti.forEach((s) => this.rilascia(s));
				continue;
			}
			if (vicino) sala.scatti.forEach((s) => this.carica(s));

			const x0 = this.orizz ? Math.max(pr.left, 0) : pr.left;
			const x1 = this.orizz ? Math.min(pr.right, W) : pr.right;
			if (x1 - x0 <= 0 || pr.bottom < -4 || pr.top > H + 4) continue;
			const rect = [x0, pr.top, x1 - x0, pr.height];

			// quanto è tessuta la prima foto (entrata) e le successive (avanzamento nella sala)
			const n = sala.scatti.length;
			let w0 = this.orizz ? smooth(1.04, 0.5, r.left / W) : Math.min(smooth(1.0, 0.7, pr.top / H), smooth(0.0, 0.3, pr.bottom / H));
			if (sala.hero) w0 = Math.min(w0, intro);
			const bersagli = sala.scatti.map((_, k) => (k === 0 ? w0 : (inf.w?.[k] ?? smooth(0.12, 0.88, inf.u * (n - 1) - (k - 1)))));
			sala.scatti.forEach((s, k) => {
				s.weave += (bersagli[k] - s.weave) * 0.16;
				if (Math.abs(bersagli[k] - s.weave) < 0.0008) s.weave = bersagli[k];
			});

			const comune = (p: Program) => {
				const u = p.uniforms;
				u.uRect.value = rect;
				u.uRes.value = [W, H];
				u.uCell.value = 18;
				// il velo segue il testo, che resta fermo sullo schermo (vedi --tx nel motore)
				u.uRoom.value = [sala.hero ? r.left : Math.max(r.left, 0), Math.min(r.right, W)];
				const v = inf.vel;
				u.uSide.value = v ? v.w : [1, 0];
				const mescola = (t: number) => sala.colore.map((c, i) => c + (CHIARO[i] - c) * t);
				u.uColL.value = mescola(v ? v.chiaro[0] : 0);
				u.uColR.value = mescola(v ? v.chiaro[1] : 0);
				u.uVeil.value = this.orizz ? 1 : 0;
				u.uDrift.value = (inf.u - 0.5) * 2;
			};

			// colore di base (corridoio: le sale sono trasparenti e il colore lo dà la tela)
			if (this.orizz) {
				comune(sala.solidProg);
				da.push(sala.solid);
			}
			// parte dall'ultimo scatto già tessuto per intero: quelli sotto sono coperti
			let da0 = 0;
			sala.scatti.forEach((s, k) => {
				if (s.stato === 'pronto' && s.weave >= 0.999) da0 = k;
			});
			const dentro = this.fine && this.mouse.x >= x0 && this.mouse.x <= x1 && this.mouse.y >= pr.top && this.mouse.y <= pr.bottom;
			for (let k = da0; k < n; k++) {
				const s = sala.scatti[k];
				if (s.stato !== 'pronto' || s.weave <= 0.0005) continue;
				comune(s.prog);
				const u = s.prog.uniforms;
				u.uWeave.value = s.weave;
				s.hov += ((dentro && s.weave > 0.95 ? 1 : 0) - s.hov) * 0.1;
				u.uHover.value = s.hov;
				u.uMouse.value = this.orizz ? [this.mouse.x, this.mouse.y] : [this.mouse.x - x0, this.mouse.y - pr.top];
				da.push(s.mesh);
			}
		}

		if (!da.length && !this.disegnato) return;
		gl.clear(gl.COLOR_BUFFER_BIT);
		for (const m of da) this.renderer.render({ scene: m, clear: false } as never);
		this.disegnato = da.length > 0;
	}
}
