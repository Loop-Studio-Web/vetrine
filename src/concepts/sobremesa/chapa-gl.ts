// La lámina del diálogo hecha shader (WebGL1, sin librerías, ~3 KB): los píxeles de la foto se funden en el esmalte (celdas que
// van de gruesas a finas, cada una con su turno y teñida del color de la lámina) y el reborde en relieve recibe una luz que
// sigue al puntero. El canvas es transparente: los tornillos, el color y la grana siguen siendo CSS debajo. Si algo falla
// (sin WebGL, contexto perdido) crearLamina devuelve null o se desactiva y queda la lámina CSS de siempre.

const VERT = 'attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uFoto;
uniform float uPx;      // lado del canvas en píxeles
uniform float uPad;     // margen de la foto dentro de la lámina (0..1)
uniform float uRad;     // radio de las esquinas de la foto
uniform float uRim;     // ancho del reborde
uniform float uFuse;    // 0 = foto sin llegar, 1 = fundida
uniform vec2 uLuz;      // posición de la luz
uniform vec3 uEsm;      // color del esmalte
varying vec2 v;

float sd(vec2 q){
	vec2 b = vec2(.5 - uPad);
	vec2 d = abs(q - .5) - b + uRad;
	return length(max(d, 0.)) + min(max(d.x, d.y), 0.) - uRad;
}
float hash(vec2 c){ return fract(sin(dot(c, vec2(127.1, 311.7))) * 43758.5453); }
vec4 over(vec4 a, vec4 b){ return a + b * (1. - a.a); }

void main(){
	float px = 1. / uPx;
	float d = sd(v);
	vec2 e = vec2(px, 0.);
	vec2 g = normalize(vec2(sd(v + e.xy) - sd(v - e.xy), sd(v + e.yx) - sd(v - e.yx)) + 1e-5);

	// foto: celdas de 12 a 384 por lado; cada celda llega cuando le toca y entra teñida de esmalte
	float k = clamp(uFuse, 0., 1.);
	float nivel = min(floor(k * 6.), 5.);
	float celdas = 12. * exp2(nivel);
	vec2 puv = (v - uPad) / (1. - 2. * uPad);
	vec2 id = floor(puv * celdas);
	vec2 cen = (id + .5) / celdas;
	float fino = smoothstep(.86, 1., k);
	vec3 px3 = texture2D(uFoto, mix(cen, puv, fino)).rgb;
	vec3 col = mix(uEsm, px3, smoothstep(.1, .85, k) * .92 + .08);
	float llega = step(hash(id + nivel), min(k * 1.7, 1.));
	float dentro = 1. - smoothstep(-px, px, d);
	float foto = dentro * mix(llega, 1., fino);
	// brillo de esmalte sobre la foto impresa
	float lustre = exp(-length(v - uLuz) * 3.4) * .16;
	vec4 A = vec4((col + lustre) * foto, foto);

	// reborde en relieve alrededor de la foto: un cordón redondeado, iluminado desde uLuz
	float t = clamp(d / uRim, 0., 1.);
	float anillo = smoothstep(0., px * 1.5, d) * (1. - smoothstep(uRim - px * 1.5, uRim, d));
	float pend = cos(t * 3.14159) * 1.57;
	vec3 n = normalize(vec3(-g * pend, 1.));
	vec3 L = normalize(vec3(uLuz - v, .38));
	float sombra = dot(n, L) - L.z;
	vec3 H = normalize(L + vec3(0., 0., 1.));
	float brillo = pow(max(dot(n, H), 0.), 46.);
	float ap = smoothstep(0., .45, k);
	float luz = clamp(sombra * 1.8, 0., 1.);
	float osc = clamp(-sombra * 2.6, 0., .85);
	float bl = clamp(.4 + luz * .6 + brillo * .7, 0., 1.);
	float m = anillo * ap;
	vec4 R = vec4(vec3(m * bl), m * clamp(bl + osc, 0., 1.));

	gl_FragColor = over(A, R);
}`;

export type Lamina = {
	/** muestra la foto (ya decodificada) fundiéndose; con `quieto` dibuja el estado final sin movimiento */
	mostrar(foto: HTMLImageElement, quieto: boolean): void;
	/** lleva la luz hacia un punto de pantalla */
	luz(x: number, y: number): void;
	ocultar(): void;
	activa(): boolean;
};

const LUZ0: [number, number] = [0.22, 0.06];

export function crearLamina(figura: HTMLElement): Lamina | null {
	const canvas = document.createElement('canvas');
	canvas.setAttribute('aria-hidden', 'true');
	canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border-radius:inherit;pointer-events:none;display:none';
	const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' });
	if (!gl) return null;

	const compilar = (tipo: number, src: string) => {
		const s = gl.createShader(tipo)!;
		gl.shaderSource(s, src);
		gl.compileShader(s);
		return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
	};
	const vs = compilar(gl.VERTEX_SHADER, VERT);
	const fs = compilar(gl.FRAGMENT_SHADER, FRAG);
	if (!vs || !fs) return null;
	const prog = gl.createProgram()!;
	gl.attachShader(prog, vs);
	gl.attachShader(prog, fs);
	gl.linkProgram(prog);
	if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
	gl.useProgram(prog);

	const buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
	const loc = gl.getAttribLocation(prog, 'p');
	gl.enableVertexAttribArray(loc);
	gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

	const u = (n: string) => gl.getUniformLocation(prog, n);
	const U = { px: u('uPx'), pad: u('uPad'), rad: u('uRad'), rim: u('uRim'), fuse: u('uFuse'), luz: u('uLuz'), esm: u('uEsm') };
	const tex = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.clearColor(0, 0, 0, 0);

	let viva = true;
	let visible = false;
	let fuse = 1;
	let quieto = false;
	let lx = LUZ0[0], ly = LUZ0[1];
	let tx = lx, ty = ly;
	let raf = 0;
	let t0 = 0;
	let esm: [number, number, number] = [0.8, 0.8, 0.8];
	let geom = { px: 512, pad: 0.05, rim: 0.018 };
	const DUR = 720;

	canvas.addEventListener('webglcontextlost', (e) => {
		e.preventDefault();
		viva = false;
		cancelAnimationFrame(raf);
		canvas.style.display = 'none';
		figura.classList.remove('gl');
	});

	function medir() {
		const w = figura.clientWidth;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const px = Math.max(64, Math.round(w * dpr));
		// el lienzo nace de 300x150: con px = 300 solo el ancho coincidía y la foto salía recortada y ampliada
		if (canvas.width !== px || canvas.height !== px) canvas.width = canvas.height = px;
		gl!.viewport(0, 0, px, px);
		const pad = parseFloat(getComputedStyle(figura).paddingLeft) / w;
		geom = { px, pad, rim: pad * 0.36 };
		const c = getComputedStyle(figura).backgroundColor.match(/[\d.]+/g);
		if (c) esm = [+c[0] / 255, +c[1] / 255, +c[2] / 255];
	}

	function pintar() {
		if (!viva || !visible) return;
		gl!.clear(gl!.COLOR_BUFFER_BIT);
		gl!.uniform1f(U.px, geom.px);
		gl!.uniform1f(U.pad, geom.pad);
		gl!.uniform1f(U.rad, geom.pad * 0.38);
		gl!.uniform1f(U.rim, geom.rim);
		gl!.uniform1f(U.fuse, fuse);
		gl!.uniform2f(U.luz, lx, ly);
		gl!.uniform3f(U.esm, esm[0], esm[1], esm[2]);
		gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
	}

	// el bucle solo corre mientras la fusión avanza o la luz todavía se está acercando al puntero
	function paso(ahora: number) {
		raf = 0;
		if (!visible) return;
		if (fuse < 1) {
			const t = Math.min(1, (ahora - t0) / DUR);
			fuse = 1 - Math.pow(1 - t, 2.2);
			if (t >= 1) fuse = 1;
		}
		const dx = tx - lx, dy = ty - ly;
		lx += dx * 0.2;
		ly += dy * 0.2;
		const quedaLuz = Math.abs(dx) + Math.abs(dy) > 0.002;
		if (!quedaLuz) { lx = tx; ly = ty; }
		pintar();
		if (fuse < 1 || quedaLuz) raf = requestAnimationFrame(paso);
	}
	const pedir = () => { if (!raf && visible) raf = requestAnimationFrame(paso); };

	const ro = new ResizeObserver(() => {
		if (!visible) return;
		medir();
		pintar();
	});
	ro.observe(figura);

	return {
		activa: () => viva,
		mostrar(foto, q) {
			if (!viva) return;
			if (!canvas.isConnected) figura.appendChild(canvas);
			canvas.style.display = 'block';
			visible = true;
			quieto = q;
			medir();
			gl.bindTexture(gl.TEXTURE_2D, tex);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, foto);
			lx = tx = LUZ0[0];
			ly = ty = LUZ0[1];
			fuse = q ? 1 : 0;
			t0 = performance.now();
			pintar();
			if (!q) pedir();
		},
		luz(x, y) {
			if (!visible || quieto) return;
			const r = figura.getBoundingClientRect();
			tx = Math.max(-0.5, Math.min(1.5, (x - r.left) / r.width));
			// la y del shader sube; la del puntero baja
			ty = Math.max(-0.5, Math.min(1.5, 1 - (y - r.top) / r.height));
			pedir();
		},
		ocultar() {
			visible = false;
			cancelAnimationFrame(raf);
			raf = 0;
			canvas.style.display = 'none';
		},
	};
}
