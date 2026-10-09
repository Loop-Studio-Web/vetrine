/* Motore WebGL2 della tavola, senza librerie: un triangolo a tutto schermo, uno shader,
   le texture delle inquadrature con mipmap. Disegna solo quando qualcosa si muove. */
import { vert, frag } from './shader';
import { stato, type Vista } from './scena';

export type Tavola = {
	vai(s: number): void; // posizione voluta (frazionaria) nella discesa
	distruggi(): void;
};

function compila(gl: WebGL2RenderingContext, tipo: number, src: string) {
	const s = gl.createShader(tipo)!;
	gl.shaderSource(s, src);
	gl.compileShader(s);
	return s;
}

function carica(src: string): Promise<HTMLImageElement> {
	return new Promise((ok, ko) => {
		const i = new Image();
		i.decoding = 'async';
		i.onload = () => ok(i);
		i.onerror = ko;
		i.src = src;
	});
}

export async function avvia(
	canvas: HTMLCanvasElement,
	immagini: string[],
	opz: { carta: [number, number, number]; suScala?: (n: number, s: number) => void },
): Promise<Tavola | null> {
	const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'high-performance' });
	if (!gl) return null;

	const ext = gl.getExtension('KHR_parallel_shader_compile');
	const vs = compila(gl, gl.VERTEX_SHADER, vert);
	const fs = compila(gl, gl.FRAGMENT_SHADER, frag);
	const prog = gl.createProgram()!;
	gl.attachShader(prog, vs);
	gl.attachShader(prog, fs);
	gl.linkProgram(prog);

	// Texture e shader si preparano in parallelo.
	const imgs = await Promise.all(immagini.map(carica));
	if (ext) {
		while (!gl.getProgramParameter(prog, ext.COMPLETION_STATUS_KHR)) await new Promise((r) => requestAnimationFrame(r));
	}
	if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
		console.error(gl.getShaderInfoLog(fs) || gl.getProgramInfoLog(prog));
		return null;
	}
	gl.useProgram(prog);

	const buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
	const loc = gl.getAttribLocation(prog, 'p');
	gl.enableVertexAttribArray(loc);
	gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

	const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
	const tex = imgs.map((im) => {
		const t = gl.createTexture()!;
		gl.bindTexture(gl.TEXTURE_2D, t);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, 8);
		return { t, w: im.naturalWidth, h: im.naturalHeight };
	});

	const u = (n: string) => gl.getUniformLocation(prog, n);
	const U = {
		res: u('uRes'), asp: u('uAsp'), A: u('uA'), B: u('uB'), TA: u('uTA'), TB: u('uTB'),
		VA: u('uVA'), VB: u('uVB'), taglio: u('uTaglio'), asciutto: u('uAsciutto'), tempo: u('uTempo'), carta: u('uCarta'),
	};
	gl.uniform1i(U.A, 0);
	gl.uniform1i(U.B, 1);
	gl.uniform1f(U.asp, tex[0].w / tex[0].h);
	gl.uniform3fv(U.carta, opz.carta);

	// Dimensioni: densità limitata a 1.5 (la tela è grande e lo shader non è leggero).
	const dimensiona = () => {
		const dpr = Math.min(devicePixelRatio || 1, 1.5);
		const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
		if (canvas.width !== w || canvas.height !== h) {
			canvas.width = w;
			canvas.height = h;
			gl.viewport(0, 0, w, h);
			sveglia();
		}
	};

	// La scena insegue la posizione voluta con una molla smorzata criticamente:
	// lo scroll resta quello del browser, la morbidezza è della scena.
	let voluta = 0, pos = 0, vel = 0, raf = 0, prima = 0, ultimaScala = -1;
	const vista = (v: Vista, k: WebGLUniformLocation | null) => gl.uniform3f(k, v.cx, v.cy, v.z);

	const disegna = () => {
		const st = stato(pos);
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, tex[st.a].t);
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, tex[st.b].t);
		gl.uniform2f(U.res, canvas.width, canvas.height);
		gl.uniform2f(U.TA, tex[st.a].w, tex[st.a].h);
		gl.uniform2f(U.TB, tex[st.b].w, tex[st.b].h);
		vista(st.va, U.VA);
		vista(st.vb, U.VB);
		gl.uniform1f(U.taglio, st.taglio);
		gl.uniform1f(U.asciutto, st.asciutto);
		gl.uniform1f(U.tempo, (performance.now() % 1000) / 1000);
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		const n = Math.round(st.scala);
		if (n !== ultimaScala) { ultimaScala = n; opz.suScala?.(n, pos); }
	};

	const giro = (t: number) => {
		const dt = Math.min((t - (prima || t)) / 1000, 1 / 20);
		prima = t;
		const w = 7; // rigidezza della molla (rad/s)
		const acc = w * w * (voluta - pos) - 2 * w * vel;
		vel += acc * dt;
		pos += vel * dt;
		const ferma = Math.abs(voluta - pos) < 0.0005 && Math.abs(vel) < 0.0005;
		if (ferma) { pos = voluta; vel = 0; }
		disegna();
		raf = ferma ? 0 : requestAnimationFrame(giro);
		if (!raf) prima = 0;
	};
	const sveglia = () => { if (!raf) raf = requestAnimationFrame(giro); };

	const ro = new ResizeObserver(dimensiona);
	ro.observe(canvas);
	dimensiona();
	disegna();

	return {
		vai(s) { voluta = s; sveglia(); },
		distruggi() { cancelAnimationFrame(raf); ro.disconnect(); },
	};
}
