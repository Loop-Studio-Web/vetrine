/* La materioteca: un campione a grandezza naturale illuminato da una torcia radente.
   Materiali scansionati (colore + rilievo: normale in RG, ruvidità in B) e due procedurali
   (bronzo spazzolato con riflesso anisotropo, lacca con riflesso netto). WebGL2, nessuna libreria. */

const vert = /* glsl */ `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const frag = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform sampler2D uCol, uRil;
uniform int uTipo;            // 0 scansione, 1 bronzo, 2 lacca, 3 velluto (scansione + sheen)
uniform vec2 uLuce;           // posizione della torcia in pixel (origine in basso)
uniform float uAltezza;       // altezza della torcia sul campione (bassa = radente)
uniform float uRilievo;       // esagera il rilievo
uniform float uScala;         // quante volte entra la texture nell'altezza
uniform float uAccesa;        // 0 → 1 all'avvio
out vec4 o;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
	vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}

void main() {
	vec2 px = gl_FragCoord.xy;
	vec2 uv = px / uRes.y * uScala;
	uv.y = -uv.y;

	vec3 alb, n;
	float rough, metal = 0.0, coat = 0.0;
	vec3 T = vec3(1, 0, 0);
	if (uTipo == 0 || uTipo == 3) {
		alb = pow(texture(uCol, uv).rgb, vec3(2.2));
		vec3 r = texture(uRil, uv).rgb;
		n = vec3((r.xy * 2.0 - 1.0) * uRilievo, 1.0);
		rough = r.b;
	} else if (uTipo == 1) {
		// Bronzo spazzolato: righe sottilissime lungo x, piccole ammaccature.
		float riga = noise(vec2(uv.x * 3.0, uv.y * 1400.0)) + 0.5 * noise(vec2(uv.x * 9.0, uv.y * 3100.0));
		float macchia = noise(uv * 6.0);
		alb = pow(vec3(0.62, 0.44, 0.24) * (0.85 + 0.25 * macchia), vec3(2.2));
		n = vec3(0.0, (riga - 0.75) * 0.35, 1.0);
		rough = 0.32;
		metal = 1.0;
	} else {
		// Lacca bordeaux: buccia d'arancia appena visibile sotto un riflesso netto.
		float buccia = noise(uv * 160.0) - 0.5;
		alb = pow(vec3(0.33, 0.035, 0.07), vec3(2.2));
		n = vec3(buccia * 0.035, (noise(uv * 150.0 + 3.0) - 0.5) * 0.035, 1.0);
		rough = 0.5;
		coat = 1.0;
	}
	n = normalize(n);

	// La torcia: posizione in pixel, altezza bassa. La luce arriva quasi di taglio.
	vec3 pos = vec3(px / uRes.y, 0.0);
	vec3 lp = vec3(uLuce / uRes.y, uAltezza);
	vec3 L = lp - pos;
	float d = length(L);
	L /= d;
	vec3 V = vec3(0, 0, 1);
	vec3 H = normalize(L + V);
	float att = uAccesa / (1.0 + d * d * 14.0);

	float nl = max(dot(n, L), 0.0);
	float nh = max(dot(n, H), 0.0);
	float lucido = mix(260.0, 6.0, rough);
	vec3 F0 = mix(vec3(0.04), alb, metal);
	float spec = pow(nh, lucido) * (lucido + 8.0) / 25.0;
	if (uTipo == 1) {
		// Riflesso anisotropo: la luce si allunga perpendicolare alla spazzolatura.
		float th = dot(T, H);
		spec = pow(sqrt(max(1.0 - th * th, 0.0)), 90.0) * 2.2 + spec * 0.3;
	}
	vec3 col = alb * (1.0 - metal) * nl * 2.2 + F0 * spec * nl;
	if (uTipo == 3) {
		// Velluto: niente riflesso netto, ma il pelo si accende dove la luce lo prende di taglio.
		float sheen = pow(1.0 - max(dot(n, V), 0.0), 2.0) * 6.0 + pow(max(dot(n, H), 0.0), 6.0) * 0.5;
		col = alb * nl * 2.0 + mix(alb, vec3(1.0, 0.72, 0.55), 0.4) * sheen * (0.3 + nl);
	}
	if (coat > 0.0) {
		float c = pow(max(dot(vec3(0, 0, 1), H), 0.0), 900.0) * 9.0;
		col += vec3(c) * 0.9 + pow(nh, 40.0) * 0.06;
	}
	col *= att * vec3(1.0, 0.96, 0.9) * 3.0;
	col += alb * 0.015; // un filo di luce ambiente: il resto è buio

	col = col / (1.0 + col);               // tone mapping morbido
	col = pow(col, vec3(1.0 / 2.2));
	col += (hash(px) - 0.5) / 255.0;
	o = vec4(col, 1.0);
}
`;

export type Campione = { tipo: 0 | 1 | 2 | 3; col?: string; ril?: string; rilievo?: number; scala?: number };

export type Materioteca = {
	mostra(c: Campione): Promise<void>;
	luce(x: number, y: number): void; // in pixel CSS rispetto al canvas
	automatica(on: boolean): void;
	distruggi(): void;
};

function carica(src: string): Promise<HTMLImageElement> {
	return new Promise((ok, ko) => {
		const i = new Image();
		i.decoding = 'async';
		i.onload = () => ok(i);
		i.onerror = ko;
		i.src = src;
	});
}

export async function avviaMateria(canvas: HTMLCanvasElement): Promise<Materioteca | null> {
	const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
	if (!gl) return null;
	const sh = (t: number, s: string) => { const x = gl.createShader(t)!; gl.shaderSource(x, s); gl.compileShader(x); return x; };
	const prog = gl.createProgram()!;
	gl.attachShader(prog, sh(gl.VERTEX_SHADER, vert));
	const fs = sh(gl.FRAGMENT_SHADER, frag);
	gl.attachShader(prog, fs);
	gl.linkProgram(prog);
	if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(gl.getShaderInfoLog(fs)); return null; }
	gl.useProgram(prog);
	gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
	const loc = gl.getAttribLocation(prog, 'p');
	gl.enableVertexAttribArray(loc);
	gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

	const U = Object.fromEntries(['uRes', 'uCol', 'uRil', 'uTipo', 'uLuce', 'uAltezza', 'uRilievo', 'uScala', 'uAccesa'].map((n) => [n, gl.getUniformLocation(prog, n)]));
	gl.uniform1i(U.uCol, 0);
	gl.uniform1i(U.uRil, 1);

	const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
	const cache = new Map<string, WebGLTexture>();
	const texture = async (src: string, srgb: boolean) => {
		if (cache.has(src)) return cache.get(src)!;
		const im = await carica(src);
		const t = gl.createTexture()!;
		gl.bindTexture(gl.TEXTURE_2D, t);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
		if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, 8);
		cache.set(src, t);
		return t;
	};
	// Texture vuota per i procedurali.
	const vuota = gl.createTexture()!;
	gl.bindTexture(gl.TEXTURE_2D, vuota);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([128, 128, 128, 255]));

	let lx = 0, ly = 0, tx = 0, ty = 0, auto = true, accesa = 0, raf = 0, t0 = performance.now(), visibile = true;

	const dimensiona = () => {
		const dpr = Math.min(devicePixelRatio || 1, 1.5);
		const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
		if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
	};

	const giro = (t: number) => {
		raf = 0;
		dimensiona();
		const W = canvas.width, H = canvas.height, dpr = W / (canvas.clientWidth || 1);
		if (auto) {
			// Senza mano: la torcia passa lenta sul campione, a otto.
			const k = (t - t0) / 1000;
			tx = (0.5 + 0.36 * Math.sin(k * 0.45)) * canvas.clientWidth;
			ty = (0.5 + 0.28 * Math.sin(k * 0.9 + 1.0)) * canvas.clientHeight;
		}
		lx += (tx - lx) * 0.12;
		ly += (ty - ly) * 0.12;
		accesa = Math.min(1, accesa + 0.03);
		gl.uniform2f(U.uRes, W, H);
		gl.uniform2f(U.uLuce, lx * dpr, H - ly * dpr);
		gl.uniform1f(U.uAccesa, accesa);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		if (visibile) raf = requestAnimationFrame(giro);
	};
	const sveglia = () => { if (!raf && visibile) raf = requestAnimationFrame(giro); };

	// Disegna solo quando la sezione è in vista.
	const io = new IntersectionObserver(([e]) => { visibile = e.isIntersecting; if (visibile) sveglia(); });
	io.observe(canvas);

	lx = tx = canvas.clientWidth / 2;
	ly = ty = canvas.clientHeight / 2;

	return {
		async mostra(c) {
			if ((c.tipo === 0 || c.tipo === 3) && c.col && c.ril) {
				const [col, ril] = await Promise.all([texture(c.col, true), texture(c.ril, false)]);
				gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, col);
				gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, ril);
			} else {
				gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, vuota);
				gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, vuota);
			}
			gl.uniform1i(U.uTipo, c.tipo);
			gl.uniform1f(U.uRilievo, c.rilievo ?? 1.6);
			gl.uniform1f(U.uScala, c.scala ?? 1);
			gl.uniform1f(U.uAltezza, 0.09);
			accesa = 0.35;
			sveglia();
		},
		luce(x, y) { auto = false; tx = x; ty = y; sveglia(); },
		automatica(on) { auto = on; if (on) t0 = performance.now() - 2000; sveglia(); },
		distruggi() { cancelAnimationFrame(raf); io.disconnect(); },
	};
}
