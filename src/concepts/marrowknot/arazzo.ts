// Le foto come arazzi: ogni <figure data-foto> viene disegnata da una tela WebGL (OGL) sulla sua stessa posizione.
// Entrando nella sala i fili dell'ordito scendono, poi la trama li attraversa e l'immagine si chiude;
// uscendo si sfila. Col mouse, una lente ingrandisce il punto sotto il cursore.
// Un solo contesto per tutta la pagina; si disegna solo ciò che è in vista.

import { Renderer, Program, Mesh, Geometry, Texture } from 'ogl';

const VERT = /* glsl */ `
attribute vec2 position;
uniform vec4 uRect;
uniform vec2 uRes;
varying vec2 vUv;
void main() {
	vUv = position;
	vec2 px = uRect.xy + position * uRect.zw;
	vec2 c = px / uRes * 2.0 - 1.0;
	gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
}`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uSize;
uniform vec2 uImg;
uniform float uR;
uniform float uCell;
uniform float uWeave;
uniform vec2 uMouse;
uniform float uHover;

float hash(float n) { return fract(sin(n * 127.1 + 11.7) * 43758.5453); }

float sdTop(vec2 p, vec2 b, float r) {
	float rr = p.y < 0.0 ? r : 0.0;
	vec2 q = abs(p) - b + rr;
	return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - rr;
}

void main() {
	vec2 uv = vUv;
	float asp = uSize.x / uSize.y;

	// lente
	vec2 dv = (uv - uMouse) * vec2(asp, 1.0);
	float bl = uHover * smoothstep(0.42, 0.0, length(dv));
	vec2 suv = uv - (uv - uMouse) * 0.24 * bl;

	// object-fit: cover
	float ia = uImg.x / uImg.y;
	vec2 s = vec2(1.0);
	if (asp > ia) s.y = ia / asp; else s.x = asp / ia;
	vec3 col = texture2D(uTex, (suv - 0.5) * s + 0.5).rgb;

	// forma: arco o arco ribassato
	float d = sdTop((uv - 0.5) * uSize, uSize * 0.5, uR);
	float a = 1.0 - smoothstep(-1.0, 0.6, d);

	// tessitura
	float W = uWeave;
	vec2 g = uv * uSize / uCell;
	vec2 id = floor(g);
	vec2 f = fract(g);
	float wp = clamp((W - hash(id.x) * 0.32) / 0.5, 0.0, 1.0);
	float tp = clamp((W - 0.28 - hash(id.y + 37.0) * 0.3) / 0.46, 0.0, 1.0);
	float fy = mod(id.x, 2.0) < 1.0 ? uv.y : 1.0 - uv.y;
	float fx = mod(id.y, 2.0) < 1.0 ? uv.x : 1.0 - uv.x;
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
		vis = 1.0 - smoothstep(0.30, 0.36, abs(f.x - 0.5)) * 1.0;
		vis = mix(1.0, vis, build);
		shade = mix(1.0, sW * 0.8, build);
	} else if (weft > 0.5) {
		vis = 1.0 - smoothstep(0.30, 0.36, abs(f.y - 0.5));
		vis = mix(1.0, vis, build);
		shade = mix(1.0, sT * 0.8, build);
	}
	shade *= 1.0 + (hash(id.x * 7.0 + id.y * 13.0) - 0.5) * 0.12 * build;

	float k = a * vis;
	gl_FragColor = vec4(col * shade * k, k);
}`;

interface Pezzo {
	el: HTMLElement;
	mesh: Mesh;
	prog: Program;
	pronto: boolean;
	weave: number;
	hover: number;
	mouse: [number, number];
	dentro: boolean;
}

const lim = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, x: number) => {
	const t = lim((x - a) / (b - a));
	return t * t * (3 - 2 * t);
};

export class Arazzo {
	private renderer: Renderer;
	private gl: WebGL2RenderingContext | WebGLRenderingContext;
	private pezzi: Pezzo[] = [];
	private orizz: boolean;
	private fine: boolean;
	private t0 = performance.now();
	private disegnato = false;

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
			dpr: Math.min(devicePixelRatio || 1, 1.6),
			powerPreference: 'low-power',
		});
		this.gl = this.renderer.gl;
		this.gl.clearColor(0, 0, 0, 0);
		tela.addEventListener('webglcontextlost', (e) => {
			e.preventDefault();
			opts.onPerso();
		});
		this.ridimensiona();
		addEventListener('resize', () => this.ridimensiona());

		const geo = new Geometry(this.gl, {
			position: { size: 2, data: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]) },
		});
		document.querySelectorAll<HTMLElement>('[data-foto]').forEach((el) => this.aggiungi(el, geo));
		if (this.fine) addEventListener('pointermove', (e) => this.muovi(e), { passive: true });
	}

	private ridimensiona() {
		this.renderer.setSize(innerWidth, innerHeight);
	}

	private aggiungi(el: HTMLElement, geo: Geometry) {
		const gl = this.gl;
		const texture = new Texture(gl, { generateMipmaps: false, flipY: false, minFilter: gl.LINEAR, magFilter: gl.LINEAR });
		const prog = new Program(gl, {
			vertex: VERT,
			fragment: FRAG,
			transparent: true,
			depthTest: false,
			depthWrite: false,
			cullFace: false,
			uniforms: {
				uTex: { value: texture },
				uRect: { value: [0, 0, 0, 0] },
				uRes: { value: [innerWidth, innerHeight] },
				uSize: { value: [1, 1] },
				uImg: { value: [1, 1] },
				uR: { value: 0 },
				uCell: { value: 18 },
				uWeave: { value: 0 },
				uMouse: { value: [0.5, 0.5] },
				uHover: { value: 0 },
			},
		});
		const mesh = new Mesh(gl, { geometry: geo, program: prog, mode: gl.TRIANGLE_STRIP, frustumCulled: false });
		const pezzo: Pezzo = { el, mesh, prog, pronto: false, weave: 0, hover: 0, mouse: [0.5, 0.5], dentro: false };
		this.pezzi.push(pezzo);

		const img = new Image();
		img.decoding = 'async';
		img.onload = () => {
			texture.image = img;
			prog.uniforms.uImg.value = [img.naturalWidth, img.naturalHeight];
			pezzo.pronto = true;
		};
		img.src = el.dataset.tex!;
	}

	private muovi(e: PointerEvent) {
		for (const p of this.pezzi) {
			const r = p.el.getBoundingClientRect();
			const dentro = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
			p.dentro = dentro;
			if (dentro) p.mouse = [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height];
		}
	}

	/** quanto è "tessuta" la foto in base a dove sta nello schermo */
	private tessitura(r: DOMRect) {
		// intera quando la foto è per buona parte in vista, si sfila solo uscendo davvero dallo schermo
		if (this.orizz) {
			return Math.min(smooth(1.0, 0.64, r.left / innerWidth), smooth(0.02, 0.4, r.right / innerWidth));
		}
		return Math.min(smooth(1.0, 0.7, r.top / innerHeight), smooth(0.0, 0.3, r.bottom / innerHeight));
	}

	/** da chiamare a ogni fotogramma (ticker) */
	disegna() {
		const gl = this.gl;
		const w = innerWidth;
		const h = innerHeight;
		const t = (performance.now() - this.t0) / 1000;
		const intro = smooth(0.35, 2.7, t); // la prima foto si tesse da sola al caricamento
		let qualcuna = false;
		const da: Pezzo[] = [];

		for (const p of this.pezzi) {
			const r = p.el.getBoundingClientRect();
			const fuori = r.right < -40 || r.left > w + 40 || r.bottom < -40 || r.top > h + 40;
			let target = fuori ? 0 : this.tessitura(r);
			if (p.el.closest('.ingresso')) target = Math.min(target, intro);
			p.weave += (target - p.weave) * 0.18;
			if (Math.abs(target - p.weave) < 0.0008) p.weave = target;
			p.hover += ((p.dentro && p.weave > 0.95 ? 1 : 0) - p.hover) * 0.1;
			if (!p.pronto || fuori || p.weave <= 0.0005) continue;

			const u = p.prog.uniforms;
			u.uRect.value = [r.left, r.top, r.width, r.height];
			u.uRes.value = [w, h];
			u.uSize.value = [r.width, r.height];
			u.uR.value = r.width * (p.el.dataset.forma === 'arco' ? 0.5 : 0.22);
			u.uCell.value = Math.max(12, Math.min(26, r.width / 22));
			u.uWeave.value = p.weave;
			u.uMouse.value = p.mouse;
			u.uHover.value = p.hover;
			da.push(p);
			qualcuna = true;
		}

		if (!qualcuna && !this.disegnato) return;
		gl.clear(gl.COLOR_BUFFER_BIT);
		for (const p of da) this.renderer.render({ scene: p.mesh, clear: false } as never);
		this.disegnato = qualcuna;
	}
}
