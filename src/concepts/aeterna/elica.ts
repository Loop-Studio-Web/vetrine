// Elica di DNA dell'hero: doppia elica di particelle + pioli, shader GLSL propri (dispersione cromatica
// sul bordo di ogni punto, profondità di campo, repulsione dal puntatore) e inerzia sul mouse.
// Si carica a parte (import dinamico) solo dopo il primo paint: Three.js non pesa sull'LCP.
import {
	AdditiveBlending,
	BufferAttribute,
	BufferGeometry,
	Color,
	Group,
	LineSegments,
	PerspectiveCamera,
	Points,
	Scene,
	ShaderMaterial,
	WebGLRenderer,
} from 'three';

export interface Elica {
	/** progresso di scorrimento dell'hero (0 = elica, 1 = elica sciolta e svanita) */
	scroll(p: number): void;
	/** sospende o riprende il rendering (hero fuori vista, scheda nascosta) */
	attiva(si: boolean): void;
	distruggi(): void;
	/** shader compilati senza bloccare il thread principale: solo da qui in poi conviene mostrare il canvas */
	pronta: Promise<void>;
}

interface Opzioni {
	leggero: boolean; // meno particelle e pixel su telefoni e schede deboli
	ridotto: boolean; // un solo fotogramma, nessun loop
	suPerso: () => void; // contesto WebGL perso: l'hero torna al poster
}

const FUNZIONE_ELICA = /* glsl */ `
	uniform float uTime;
	uniform float uTwist;
	vec3 elica(float t, float s) {
		float y = (t - 0.5) * 11.0;
		float ang = t * 6.2831853 * 3.4 * uTwist + s * 3.14159265 + uTime * 0.16;
		float r = 1.15 + 0.14 * sin(t * 13.0 + uTime * 0.55);
		return vec3(cos(ang) * r, y, sin(ang) * r);
	}
`;

const VERTEX_PUNTI = /* glsl */ `
	${FUNZIONE_ELICA}
	uniform vec2 uMouse;
	uniform float uPx;
	uniform float uScala;
	uniform float uFuoco;
	attribute float aT;
	attribute float aS;
	attribute float aK;
	attribute float aR;
	varying float vK;
	varying float vBlur;
	varying float vA;
	void main() {
		vec3 p;
		if (aK > 1.5) {
			// polvere: deriva lenta verso l'alto, ripetuta in un volume
			p = position;
			p.y = mod(p.y + uTime * (0.1 + aR * 0.25) + 5.5, 11.0) - 5.5;
			p.x += sin(uTime * 0.2 + aR * 40.0) * 0.4;
		} else {
			p = elica(aT, aS);
			p += vec3(sin(uTime * 0.7 + aR * 40.0), cos(uTime * 0.6 + aR * 31.0), sin(uTime * 0.5 + aR * 17.0)) * 0.03;
		}
		vec4 wp = modelMatrix * vec4(p, 1.0);
		vec2 d = wp.xy - uMouse;
		float f = exp(-dot(d, d) * 0.7);
		wp.xy += normalize(d + vec2(1e-4)) * f * 0.6;
		wp.z += f * 0.5;
		vec4 mv = viewMatrix * wp;
		float depth = -mv.z;
		float blur = clamp(abs(depth - uFuoco) / 3.4, 0.0, 1.0);
		float misura = aK > 1.5 ? 0.05 + aR * 0.05 : (aK > 0.5 ? 0.3 : 0.13);
		gl_PointSize = misura * uScala / depth * (1.0 + blur * 2.2) * uPx;
		vK = aK;
		vBlur = blur;
		vA = (1.0 - blur * 0.5) * (0.62 + 0.38 * sin(uTime * 1.2 + aR * 30.0)) * (aK > 1.5 ? 0.5 : 1.0);
		gl_Position = projectionMatrix * mv;
	}
`;

const FRAGMENT_PUNTI = /* glsl */ `
	precision mediump float;
	uniform vec3 uC1;
	uniform vec3 uC2;
	uniform float uAlfa;
	varying float vK;
	varying float vBlur;
	varying float vA;
	void main() {
		vec2 c = (gl_PointCoord - 0.5) * 2.0;
		if (length(c) > 1.0) discard;
		// dispersione: tre aloni appena sfasati, come luce che attraversa una lente
		float cr = smoothstep(1.0, 0.0, length(c - vec2(0.12, 0.05)));
		float cg = smoothstep(1.0, 0.0, length(c));
		float cb = smoothstep(1.0, 0.0, length(c + vec2(0.12, 0.05)));
		vec3 base = (vK > 0.5 && vK < 1.5) ? uC2 : uC1;
		float nucleo = pow(cg, mix(2.0, 1.0, vBlur));
		vec3 col = base * vec3(cr, cg, cb) * 1.5 + vec3(1.0) * pow(cg, 7.0) * 0.8;
		gl_FragColor = vec4(col * vA * uAlfa, nucleo * vA * uAlfa);
	}
`;

const VERTEX_PIOLI = /* glsl */ `
	${FUNZIONE_ELICA}
	uniform vec2 uMouse;
	uniform float uFuoco;
	attribute float aT;
	attribute float aS;
	varying float vA;
	void main() {
		vec3 p = elica(aT, aS);
		vec4 wp = modelMatrix * vec4(p, 1.0);
		vec2 d = wp.xy - uMouse;
		float f = exp(-dot(d, d) * 0.7);
		wp.xy += normalize(d + vec2(1e-4)) * f * 0.6;
		vec4 mv = viewMatrix * wp;
		float depth = -mv.z;
		vA = clamp(1.25 - abs(depth - uFuoco) / 3.2, 0.1, 1.0);
		gl_Position = projectionMatrix * mv;
	}
`;

const FRAGMENT_PIOLI = /* glsl */ `
	precision mediump float;
	uniform vec3 uC1;
	uniform float uAlfa;
	varying float vA;
	void main() {
		gl_FragColor = vec4(uC1, 0.42 * vA * uAlfa);
	}
`;

export function avvia(canvas: HTMLCanvasElement, opz: Opzioni): Elica | null {
	let renderer: WebGLRenderer;
	try {
		renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
	} catch {
		return null;
	}
	renderer.setClearColor(0x000000, 0);

	const camera = new PerspectiveCamera(38, 1, 0.1, 60);
	camera.position.z = 11;
	const scene = new Scene();
	const gruppo = new Group();
	scene.add(gruppo);

	const comuni = {
		uTime: { value: 0 },
		uTwist: { value: 1 },
		uMouse: { value: { x: 99, y: 99 } },
		uFuoco: { value: 11 },
		uC1: { value: new Color('#4e9f8e') },
		uC2: { value: new Color('#e2c15a') },
		uAlfa: { value: 1 },
	};

	// --- punti dei due filamenti (con nodi d'oro ogni tanto) + polvere ---
	const N = opz.leggero ? 120 : 210;
	const POLVERE = opz.leggero ? 220 : 520;
	const tot = N * 2 + POLVERE;
	const pos = new Float32Array(tot * 3);
	const aT = new Float32Array(tot);
	const aS = new Float32Array(tot);
	const aK = new Float32Array(tot);
	const aR = new Float32Array(tot);
	let seme = 1234567;
	const rnd = () => ((seme = (seme * 1664525 + 1013904223) >>> 0) / 4294967296);
	let i = 0;
	for (let s = 0; s < 2; s++) {
		for (let n = 0; n < N; n++, i++) {
			aT[i] = n / (N - 1);
			aS[i] = s;
			aK[i] = n % 17 === 4 ? 1 : 0;
			aR[i] = rnd();
		}
	}
	for (let n = 0; n < POLVERE; n++, i++) {
		pos[i * 3] = (rnd() - 0.5) * 17;
		pos[i * 3 + 1] = (rnd() - 0.5) * 11;
		pos[i * 3 + 2] = (rnd() - 0.5) * 9;
		aK[i] = 2;
		aR[i] = rnd();
	}
	const gPunti = new BufferGeometry();
	gPunti.setAttribute('position', new BufferAttribute(pos, 3));
	gPunti.setAttribute('aT', new BufferAttribute(aT, 1));
	gPunti.setAttribute('aS', new BufferAttribute(aS, 1));
	gPunti.setAttribute('aK', new BufferAttribute(aK, 1));
	gPunti.setAttribute('aR', new BufferAttribute(aR, 1));
	const uPunti = { ...comuni, uPx: { value: 1 }, uScala: { value: 800 } };
	const mPunti = new ShaderMaterial({
		vertexShader: VERTEX_PUNTI,
		fragmentShader: FRAGMENT_PUNTI,
		uniforms: uPunti,
		transparent: true,
		depthWrite: false,
		blending: AdditiveBlending,
	});
	const punti = new Points(gPunti, mPunti);
	punti.frustumCulled = false;
	gruppo.add(punti);

	// --- pioli tra i due filamenti ---
	const PIOLI = Math.floor(N / 3);
	const pT = new Float32Array(PIOLI * 2);
	const pS = new Float32Array(PIOLI * 2);
	const pPos = new Float32Array(PIOLI * 2 * 3);
	for (let n = 0; n < PIOLI; n++) {
		const t = (n + 0.5) / PIOLI;
		pT[n * 2] = pT[n * 2 + 1] = t;
		pS[n * 2] = 0;
		pS[n * 2 + 1] = 1;
	}
	const gPioli = new BufferGeometry();
	gPioli.setAttribute('position', new BufferAttribute(pPos, 3));
	gPioli.setAttribute('aT', new BufferAttribute(pT, 1));
	gPioli.setAttribute('aS', new BufferAttribute(pS, 1));
	const mPioli = new ShaderMaterial({
		vertexShader: VERTEX_PIOLI,
		fragmentShader: FRAGMENT_PIOLI,
		uniforms: comuni,
		transparent: true,
		depthWrite: false,
		blending: AdditiveBlending,
	});
	const pioli = new LineSegments(gPioli, mPioli);
	pioli.frustumCulled = false;
	gruppo.add(pioli);

	// --- stato ---
	const mouse = { x: 0, y: 0, tx: 0, ty: 0, attivo: false };
	let progresso = 0;
	let t0 = performance.now();
	let tempo = opz.ridotto ? 3.2 : 0;
	let vivo = true;
	let visibile = true;
	let w = 1;
	let h = 1;

	function misura() {
		const r = canvas.getBoundingClientRect();
		w = Math.max(1, Math.round(r.width));
		h = Math.max(1, Math.round(r.height));
		const dpr = Math.min(devicePixelRatio || 1, opz.leggero ? 1.5 : 1.75);
		renderer.setPixelRatio(dpr);
		renderer.setSize(w, h, false);
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
		uPunti.uPx.value = 1;
		uPunti.uScala.value = (h * dpr) / (2 * Math.tan((camera.fov * Math.PI) / 360));
		const largo = w / h > 1.15;
		gruppo.position.x = largo ? Math.min(3.2, 1.2 + (w / h) * 0.85) : 0;
		gruppo.scale.setScalar(largo ? 1 : 0.8);
		comuni.uAlfa.value = largo ? 1 : 0.62;
		if (opz.ridotto) disegna();
	}

	function disegna() {
		// puntatore → piano z=0 del mondo
		const mezzaAltezza = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
		comuni.uMouse.value = mouse.attivo ? { x: mouse.x * mezzaAltezza * camera.aspect, y: mouse.y * mezzaAltezza } : { x: 99, y: 99 };
		gruppo.rotation.y = mouse.x * 0.45 + progresso * 0.8;
		gruppo.rotation.x = -mouse.y * 0.18;
		gruppo.rotation.z = -0.3 + progresso * 0.3;
		gruppo.position.y = progresso * 3.4;
		comuni.uTwist.value = 1 - 0.94 * progresso;
		comuni.uTime.value = tempo;
		renderer.render(scene, camera);
	}

	function ciclo() {
		if (!vivo || !visibile || document.hidden) return;
		const ora = performance.now();
		tempo += Math.min(0.05, (ora - t0) / 1000);
		t0 = ora;
		// inerzia: il bersaglio segue il puntatore, la scena segue il bersaglio
		mouse.x += (mouse.tx - mouse.x) * 0.06;
		mouse.y += (mouse.ty - mouse.y) * 0.06;
		disegna();
		requestAnimationFrame(ciclo);
	}

	function mossa(e: PointerEvent) {
		const r = canvas.getBoundingClientRect();
		if (e.clientY < r.top || e.clientY > r.bottom) return;
		mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
		mouse.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
		mouse.attivo = true;
		if (opz.ridotto) disegna();
	}
	function fuori() {
		mouse.attivo = false;
		mouse.tx = 0;
		mouse.ty = 0;
	}

	const ro = new ResizeObserver(misura);
	ro.observe(canvas);
	addEventListener('pointermove', mossa, { passive: true });
	document.documentElement.addEventListener('pointerleave', fuori);
	const visib = () => {
		if (!document.hidden && !opz.ridotto) {
			t0 = performance.now();
			requestAnimationFrame(ciclo);
		}
	};
	document.addEventListener('visibilitychange', visib);
	const perso = (e: Event) => {
		e.preventDefault();
		vivo = false;
		opz.suPerso();
	};
	canvas.addEventListener('webglcontextlost', perso);

	misura();
	// compileAsync (KHR_parallel_shader_compile) evita che la compilazione blocchi il thread e faccia scattare le animazioni dell'hero
	const pronta = (renderer.compileAsync ? renderer.compileAsync(scene, camera) : Promise.resolve())
		.catch(() => {})
		.then(() => {
			if (!vivo) return;
			if (opz.ridotto) disegna();
			else {
				t0 = performance.now();
				requestAnimationFrame(ciclo);
			}
		});

	return {
		pronta,
		scroll(p) {
			progresso = Math.min(1, Math.max(0, p));
			if (opz.ridotto) disegna();
		},
		attiva(si) {
			const riparte = si && !visibile;
			visibile = si;
			if (riparte && !opz.ridotto) {
				t0 = performance.now();
				requestAnimationFrame(ciclo);
			}
		},
		distruggi() {
			vivo = false;
			ro.disconnect();
			removeEventListener('pointermove', mossa);
			document.documentElement.removeEventListener('pointerleave', fuori);
			document.removeEventListener('visibilitychange', visib);
			canvas.removeEventListener('webglcontextlost', perso);
			gPunti.dispose();
			gPioli.dispose();
			mPunti.dispose();
			mPioli.dispose();
			renderer.dispose();
		},
	};
}
