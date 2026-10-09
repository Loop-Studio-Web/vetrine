/* Riarreda la foto: il render della parete con tre superfici mascherate (R parete,
   G mensola in pietra, B tavolini). Ogni superficie prende un colore a calce o un materiale
   dell'atlante; l'ombreggiatura resta quella della foto (luminanza / luminanza media della
   superficie), così luce e ombre non cambiano. Il nuovo materiale si stende a macchia
   dal punto in cui lo si posa. WebGL2, nessuna libreria. */

const vert = /* glsl */ `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const frag = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform sampler2D uFoto, uMasc, uAtlante;
uniform int uTipo[6];        // 0 com'è, 1 colore, 2 materiale dell'atlante (indice in uTex)
uniform vec3 uCol[6];
uniform int uTex[6];
uniform float uProg[3];      // avanzamento della stesura per superficie
uniform vec2 uCentro[3];     // punto da cui si stende (uv della foto)
uniform vec3 uRif;           // luminanza media delle tre superfici nella foto
uniform float uOriginale;    // 1 = mostra la foto com'è (tieni premuto)
out vec4 o;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
	vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
	return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// Coordinate del materiale per ogni superficie, ripetute a specchio (mai una cucitura nell'atlante).
vec2 specchio(vec2 c) { return abs(fract(c * 0.5) * 2.0 - 1.0) * 0.996 + 0.002; }
vec2 coordinate(int s, vec2 uv) {
	if (s == 0) return uv * vec2(0.8, 1.0) * 1.6;
	if (s == 1) return vec2(uv.x, (uv.y - 0.74) * 1.25) * 3.4;
	// tavolini: il piano ellittico diventa un disco, lo spessore una fascia
	vec2 d = (uv - vec2(0.52, 0.87)) / vec2(0.215, 0.215 * 0.8);
	return d * 1.3;
}

vec3 materiale(int k, int s, vec2 uv, vec3 foto, float ombra) {
	if (uTipo[k] == 0) return foto;
	// La calce assorbe luce: colore un poco spento e scuro come la stanza.
	if (uTipo[k] == 1) return mix(vec3(lum(uCol[k])), uCol[k], 0.8) * ombra * 0.78;
	int t = uTex[k];
	vec2 c = coordinate(s, uv);
	if (t == 3) c *= 0.5; // la venatura del noce vuole tavole lunghe
	vec2 cella = vec2(float(t % 2), float(t / 2)) * 0.5;
	vec2 a = cella + specchio(c) * 0.5;
	vec3 alb = textureGrad(uAtlante, a, dFdx(c * 0.5), dFdy(c * 0.5)).rgb;
	return alb * ombra * 1.05;
}

void main() {
	vec2 uv = gl_FragCoord.xy / uRes;
	uv.y = 1.0 - uv.y;
	vec3 foto = texture(uFoto, uv).rgb;
	vec3 m = texture(uMasc, uv).rgb;
	vec3 col = foto;
	float l = lum(foto);
	for (int s = 0; s < 3; s++) {
		float ms = s == 0 ? m.r : (s == 1 ? m.g : m.b);
		if (ms < 0.004) continue;
		float rif = s == 0 ? uRif.x : (s == 1 ? uRif.y : uRif.z);
		float ombra = clamp(l / rif, 0.0, 2.6);
		vec3 nuovo = materiale(s, s, uv, foto, ombra);
		vec3 vecchio = materiale(s + 3, s, uv, foto, ombra);
		// La stesura: un cerchio che si allarga con il bordo irregolare di una passata di rullo.
		float dist = length((uv - uCentro[s]) * vec2(0.8, 1.0));
		float r = uProg[s] * 1.4;
		float bordo = (noise(uv * 38.0) - 0.5) * 0.06;
		float f = smoothstep(r, r - 0.04, dist + bordo);
		col = mix(col, mix(vecchio, nuovo, f), ms);
	}
	col = mix(col, foto, uOriginale);
	col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
	o = vec4(col, 1.0);
}
`;

export type Finitura = { tipo: 0 } | { tipo: 1; col: [number, number, number] } | { tipo: 2; tex: number };

export type Riarredo = {
	posa(superficie: number, f: Finitura, centro?: [number, number]): void;
	originale(on: boolean): void;
	superficieIn(x: number, y: number): number; // -1 se nessuna (coordinate 0..1 della foto)
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

export async function avviaRiarredo(
	canvas: HTMLCanvasElement,
	src: { foto: string; maschere: string; atlante: string },
	rif: [number, number, number],
	centri: [number, number][],
): Promise<Riarredo | null> {
	const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, preserveDrawingBuffer: false });
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

	const [foto, masc, atl] = await Promise.all([carica(src.foto), carica(src.maschere), carica(src.atlante)]);
	// Le maschere sono dati, non colore: niente conversioni di spazio colore.
	const texture = (im: HTMLImageElement, unita: number, dati = false) => {
		const t = gl.createTexture()!;
		gl.activeTexture(gl.TEXTURE0 + unita);
		gl.bindTexture(gl.TEXTURE_2D, t);
		gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, dati ? gl.NONE : gl.BROWSER_DEFAULT_WEBGL);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		return t;
	};
	texture(foto, 0);
	texture(masc, 1, true);
	texture(atl, 2);
	const u = (n: string) => gl.getUniformLocation(prog, n);
	gl.uniform1i(u('uFoto'), 0);
	gl.uniform1i(u('uMasc'), 1);
	gl.uniform1i(u('uAtlante'), 2);
	gl.uniform3f(u('uRif'), ...rif);

	// Copia piccola delle maschere per capire che superficie c'è sotto il dito.
	const piccola = document.createElement('canvas');
	piccola.width = 120;
	piccola.height = 150;
	const ctx = piccola.getContext('2d', { willReadFrequently: true })!;
	ctx.drawImage(masc, 0, 0, 120, 150);
	const pixel = ctx.getImageData(0, 0, 120, 150).data;

	// Stato: 0-2 finitura attuale, 3-5 la precedente.
	const stato: Finitura[] = [{ tipo: 0 }, { tipo: 0 }, { tipo: 0 }, { tipo: 0 }, { tipo: 0 }, { tipo: 0 }];
	const prog3 = [1, 1, 1];
	const centro: [number, number][] = centri.map((c) => [...c] as [number, number]);
	let originale = 0, voluto = 0, raf = 0;
	const inizio = [0, 0, 0];

	const carica_stato = () => {
		const tipi = new Int32Array(6), tex = new Int32Array(6), col = new Float32Array(18);
		stato.forEach((f, i) => {
			tipi[i] = f.tipo;
			if (f.tipo === 1) col.set(f.col, i * 3);
			if (f.tipo === 2) tex[i] = f.tex;
		});
		gl.uniform1iv(u('uTipo'), tipi);
		gl.uniform1iv(u('uTex'), tex);
		gl.uniform3fv(u('uCol'), col);
	};

	const dimensiona = () => {
		const dpr = Math.min(devicePixelRatio || 1, 1.5);
		const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
		if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
	};

	const giro = (t: number) => {
		raf = 0;
		dimensiona();
		let ancora = false;
		for (let s = 0; s < 3; s++) {
			if (prog3[s] < 1) { prog3[s] = Math.min(1, (t - inizio[s]) / 1100); ancora = true; }
		}
		originale += (voluto - originale) * 0.25;
		if (Math.abs(voluto - originale) > 0.002) ancora = true;
		else originale = voluto;
		gl.uniform2f(u('uRes'), canvas.width, canvas.height);
		gl.uniform1fv(u('uProg'), prog3.map((p) => 1 - Math.pow(1 - p, 3)));
		gl.uniform2fv(u('uCentro'), centro.flat());
		gl.uniform1f(u('uOriginale'), originale);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		if (ancora) raf = requestAnimationFrame(giro);
	};
	const sveglia = () => { if (!raf) raf = requestAnimationFrame(giro); };
	const ro = new ResizeObserver(sveglia);
	ro.observe(canvas);
	carica_stato();
	sveglia();

	const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
	return {
		posa(s, f, c) {
			stato[s + 3] = stato[s];
			stato[s] = f;
			if (c) centro[s] = c;
			carica_stato();
			prog3[s] = ridotto ? 1 : 0;
			inizio[s] = performance.now();
			sveglia();
		},
		originale(on) { voluto = on ? 1 : 0; sveglia(); },
		superficieIn(x, y) {
			const i = (Math.min(149, Math.max(0, Math.floor(y * 150))) * 120 + Math.min(119, Math.max(0, Math.floor(x * 120)))) * 4;
			const v = [pixel[i], pixel[i + 1], pixel[i + 2]];
			const max = Math.max(...v);
			return max > 110 ? v.indexOf(max) : -1;
		},
		distruggi() { cancelAnimationFrame(raf); ro.disconnect(); },
	};
}
