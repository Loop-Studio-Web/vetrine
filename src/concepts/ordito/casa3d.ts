// La casa di Ordito in 3D: una casa a due piani aperta sul davanti, costruita solo con forme semplici (nessun modello esterno).
// Legge lo stato condiviso (stato.ts) e lo segue con inerzia: luci, sole, tapparelle, clima, allarme, presenza.
// Three.js arriva con import dinamico: non pesa sul primo caricamento della pagina.
import type { Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, PerspectiveCamera, PointLight, Color } from 'three';
import { stato, elevazione, derivati, type Stanza } from './stato';

export type Posa = { p: [number, number, number]; t: [number, number, number] };

// una posa di camera per ogni passo del racconto
export const pose: Posa[] = [
	{ p: [18, 10, 22], t: [0, 3, 0] }, // 0 la casa
	{ p: [13.5, 3.3, 12.5], t: [5.2, 1.5, 1.4] }, // 1 arrivo
	{ p: [-3, 2.9, 12.8], t: [-2.4, 1.5, -1] }, // 2 luce
	{ p: [7, 10, 13.5], t: [2.2, 4.4, -1] }, // 3 energia
	{ p: [-2.6, 5.5, 11.5], t: [-2.4, 4.1, -1.6] }, // 4 camera e clima
	{ p: [4, 12, 21], t: [4, 1.8, 3] }, // 5 sicurezza: la proprietà intera
	{ p: [10.5, 7.2, 13.5], t: [0, 3, 0] }, // 6 le regole
];

export type Hotspot = { id: string; pos: [number, number, number]; el: HTMLElement };
export type Controllo = { setF: (f: number) => void; ferma: () => void; riprendi: () => void; distruggi: () => void; colore: () => string };

const ss = (a: number, b: number, x: number) => {
	const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
	return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// colori del cielo per ora del giorno: [ora, in alto, all'orizzonte]
const chiavi: [number, number, number][] = [
	[0, 0x07041a, 0x1a0b4a], [5, 0x100836, 0x351566], [6.2, 0x5a2bd6, 0xff8a5c], [7.8, 0x2b7cff, 0xffe0b0],
	[12, 0x1578ff, 0x9fe8ff], [16.8, 0x2f6dff, 0xffd1a0], [18.3, 0x7a2bd6, 0xff6a5a], [19.6, 0x2a0e6b, 0xff4d8a],
	[21, 0x0d0630, 0x34127a], [24, 0x07041a, 0x1a0b4a],
];

export async function avvia(canvas: HTMLCanvasElement, opt: { mobile: boolean; hotspots: Hotspot[]; cielo: (su: string, giu: string) => void }): Promise<Controllo> {
	const THREE = await import('three');
	const { mobile } = opt;
	const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.05;

	const scena = new THREE.Scene();
	const cam: PerspectiveCamera = new THREE.PerspectiveCamera(36, 1, 0.5, 120);
	const cielo: Color = new THREE.Color(0x9fe8ff); // orizzonte
	const cieloSu: Color = new THREE.Color(0x1578ff);
	renderer.setClearColor(0x000000, 0);
	scena.fog = new THREE.Fog(cielo, 40, 100);

	// ---------- materiali ----------
	const std = (c: number, r = 0.85, m = 0): MeshStandardMaterial => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: m });
	const mur = std(0xf7f5fc), murIn = std(0xf5f2ea), cem = std(0xb9bcb5, 0.95), legno = std(0xc89b68, 0.7), legnoSc = std(0x6e4b30, 0.7);
	const antra = std(0x1f2326, 0.6), grigio = std(0x8a9096, 0.7), tess = std(0x7b8794, 0.95), ambraM = std(0xffb42b, 0.6);
	const verde = std(0x3ad8b0, 0.9), verdeSc = std(0x1d9c86, 0.9), erba = std(0xd9d3f0, 1);
	const vetro: MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x9fd3ef, toneMapped: false });
	const emis = (c: number, base = 0xece3cf): MeshStandardMaterial => new THREE.MeshStandardMaterial({ color: base, emissive: c, emissiveIntensity: 0, roughness: 0.5 });

	const casa: Group = new THREE.Group();
	scena.add(casa);
	const box = (w: number, h: number, d: number, x: number, y: number, z: number, m: MeshStandardMaterial | MeshBasicMaterial, ombra = true, g: Group = casa): Mesh => {
		const me = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
		me.position.set(x, y, z);
		me.castShadow = ombra;
		me.receiveShadow = true;
		g.add(me);
		return me;
	};

	// ---------- terreno ----------
	box(80, 0.2, 80, 0, -0.35, 0, erba, false).receiveShadow = true;
	box(10.8, 0.5, 7.8, 0, -0.1, 0, cem); // basamento
	box(2.2, 0.06, 7, 7.2, -0.02, 2.2, grigio, false); // vialetto fino alla porta
	box(5.5, 0.06, 2.4, 8.5, -0.02, 6.6, grigio, false); // posto auto
	box(1.2, 0.06, 10, 9.9, -0.02, 6, grigio, false);

	// ---------- piano terra ----------
	box(10.4, 0.2, 7.4, 0, 0.15, 0, legno, false); // pavimento (soggiorno e cucina)
	box(0.3, 3, 7.4, -5.15, 1.65, 0, mur); // muro sinistro
	box(10.4, 3, 0.3, 0, 1.65, -3.65, mur); // muro di fondo
	box(0.3, 3, 2.6, 5.15, 1.65, -2.3, mur); // muro destro, due tratti attorno alla porta
	box(0.3, 3, 2.2, 5.15, 1.65, 2.9, mur);
	box(0.3, 0.7, 1.6, 5.15, 2.95, 0.6, mur);
	const porta = box(0.18, 2.3, 1.5, 5.12, 1.4, 0.6, std(0x6a2cff, 0.5)); // porta d'ingresso
	box(10.6, 0.3, 7.6, 0, 3.3, 0, mur); // solaio
	// finestre di fondo (piano terra)
	const fin = (x: number, y: number, w: number, h: number, z = -3.49, g: Group = casa) => {
		box(w + 0.16, h + 0.16, 0.05, x, y, z, antra, false, g);
		return box(w, h, 0.07, x, y, z + 0.02, vetro, false, g);
	};
	fin(-2.8, 1.9, 3.6, 1.7);
	fin(2.6, 1.9, 2.6, 1.7);
	// parete sinistra: finestra
	box(0.05, 1.8, 2.4, -4.98, 1.9, 0, antra, false);
	box(0.06, 1.65, 2.25, -4.96, 1.9, 0, vetro, false);

	// tapparelle (si abbassano dall'alto, davanti alle finestre di fondo)
	const tap: Mesh[] = [];
	const tapparella = (x: number, y: number, w: number, h: number, z: number) => {
		const m = box(w, h, 0.05, x, y, z, std(0xd9d3c4, 0.9), false);
		m.geometry.translate(0, -h / 2, 0); // perno in alto
		m.position.y = y + h / 2;
		tap.push(m);
	};
	tapparella(-2.8, 1.9, 3.6, 1.7, -3.4);
	tapparella(2.6, 1.9, 2.6, 1.7, -3.4);

	// soggiorno
	const luceSog = new THREE.Group(); casa.add(luceSog);
	box(4.6, 0.04, 3.4, -2.6, 0.27, 0.2, std(0x2a1a6e, 0.95), false); // tappeto
	box(2.8, 0.45, 1, -2.6, 0.5, 1.1, std(0x6a2cff, 0.85)); // divano
	box(2.8, 0.55, 0.25, -2.6, 0.85, 1.6, std(0x6a2cff, 0.85));
	box(0.3, 0.7, 1, -4.1, 0.6, 1.1, std(0x6a2cff, 0.85));
	box(0.3, 0.7, 1, -1.1, 0.6, 1.1, std(0x6a2cff, 0.85));
	box(1.4, 0.3, 0.8, -2.6, 0.43, -0.3, legnoSc); // tavolino
	box(1.8, 0.7, 0.18, -2.6, 1.4, -3.4, antra); // tv a muro
	const schermo = box(1.7, 0.6, 0.04, -2.6, 1.4, -3.3, emis(0x6fa8ff, 0x101214), false);
	box(2.2, 0.5, 0.4, -2.6, 0.6, -3.35, legnoSc); // mobile tv
	// lampada da terra
	box(0.05, 1.5, 0.05, -4.4, 1, 0.9, antra);
	const bulbo = emis(0xffc477);
	const lampSog = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), bulbo); lampSog.position.set(-4.4, 1.85, 0.9); casa.add(lampSog);
	// pianta
	box(0.4, 0.4, 0.4, -4.6, 0.5, -2.8, std(0xd9d3c4)); const pianta = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0), verde); pianta.position.set(-4.6, 1.15, -2.8); pianta.castShadow = true; casa.add(pianta);

	// cucina
	box(3.6, 0.9, 0.7, 3.1, 0.7, -3.2, std(0xe4e0d4)); // base a muro
	box(3.6, 0.7, 0.4, 3.1, 2.6, -3.35, std(0xe4e0d4)); // pensili
	box(2.2, 0.95, 1.1, 3, 0.7, 0.2, std(0xe4e0d4)); // isola
	box(2.3, 0.07, 1.2, 3, 1.2, 0.2, antra);
	box(0.9, 2.1, 0.8, 4.6, 1.2, -2.2, grigio, true); // frigo
	const penzoli: Mesh[] = [];
	for (const x of [2.5, 3.5]) {
		box(0.03, 0.8, 0.03, x, 2.7, 0.2, antra);
		const l = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), emis(0xffc477)); l.position.set(x, 2.15, 0.2); casa.add(l); penzoli.push(l);
	}
	// scala decorativa
	for (let i = 0; i < 8; i++) box(0.9, 0.36, 0.34, 0.9 + 0.0, 0.5 + i * 0.36, 2.3 - i * 0.34, std(0xe4e0d4));

	// ---------- primo piano ----------
	box(10.4, 0.2, 7.4, 0, 3.55, 0, std(0xd8d3c6, 0.9), false); // pavimento
	box(0.3, 3, 7.4, -5.15, 5.1, 0, mur);
	box(10.4, 3, 0.3, 0, 5.1, -3.65, mur);
	box(0.3, 3, 7.4, 5.15, 5.1, 0, mur);
	box(0.25, 3, 2.4, -0.2, 5.1, -2.4, mur); // tramezzo con porta
	box(0.25, 3, 2.4, -0.2, 5.1, 2.4, mur);
	box(0.25, 0.7, 2.4, -0.2, 6.25, 0, mur);
	box(10.8, 0.28, 7.8, 0, 6.76, 0, mur); // copertura / terrazza
	fin(-2.7, 5.2, 3.2, 1.6); fin(2.8, 5.2, 3.2, 1.6);
	tapparella(-2.7, 5.2, 3.2, 1.6, -3.4); tapparella(2.8, 5.2, 3.2, 1.6, -3.4);
	// camera: letto
	box(2.2, 0.4, 2.4, -2.8, 3.95, -2.1, std(0xe8e4d8)); box(2.3, 0.5, 0.2, -2.8, 4.4, -3.3, legnoSc);
	box(0.7, 0.18, 0.5, -3.4, 4.25, -3.0, std(0xf8f6ef)); box(0.7, 0.18, 0.5, -2.2, 4.25, -3.0, std(0xf8f6ef));
	box(2.2, 0.12, 1.1, -2.8, 4.2, -1.6, std(0xff2e93, 0.9)); // coperta
	box(0.5, 0.5, 0.5, -4.4, 3.95, -3.1, legnoSc); box(0.5, 0.5, 0.5, -1.2, 3.95, -3.1, legnoSc);
	const lampCam = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), emis(0xffc477)); lampCam.position.set(-1.2, 4.4, -3.1); casa.add(lampCam);
	box(0.5, 2.3, 2, -4.8, 4.8, 1.2, legnoSc); // armadio
	// studio: scrivania
	box(2.4, 0.08, 0.9, 2.8, 4.3, -3, legno); box(0.08, 0.7, 0.8, 1.7, 3.95, -3, antra); box(0.08, 0.7, 0.8, 3.9, 3.95, -3, antra);
	const monitor = box(1.0, 0.6, 0.05, 2.8, 4.75, -3.3, emis(0xa7d3ff, 0x101214), false);
	box(0.5, 0.5, 0.5, 2.8, 4.15, -2.1, antra); // sedia
	const lampStu = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 12), emis(0xffc477)); lampStu.position.set(3.7, 4.65, -3); casa.add(lampStu);
	box(1.6, 0.04, 1, 3.4, 3.7, 0.8, std(0x3a4a52, 0.95), false);

	// tetto: pannelli solari e sirena
	const pannelli: MeshStandardMaterial = new THREE.MeshStandardMaterial({ color: 0x24344a, roughness: 0.35, metalness: 0.5, emissive: 0xffb42b, emissiveIntensity: 0 });
	for (let r = 0; r < 2; r++)
		for (let c = 0; c < 4; c++) {
			const p = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.07, 1.3), pannelli);
			p.position.set(-3.6 + c * 2.1, 7.1, -1.6 + r * 1.55);
			p.rotation.x = -0.2;
			p.castShadow = true;
			casa.add(p);
		}
	const sirena = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.4), emis(0xff3b30, 0x7a2a24)); sirena.position.set(4.7, 7.05, 3.3); casa.add(sirena);
	box(10.8, 0.5, 0.12, 0, 7.15, 3.85, mur); // parapetto davanti

	// ---------- esterno ----------
	// porta: serratura intelligente (LED)
	const ledPorta = emis(0x39d98a, 0x2a5a44); const led = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.14), ledPorta); led.position.set(5.26, 1.35, 1.1); casa.add(led);
	// wallbox + auto elettrica
	const ledEv = emis(0xffb42b); const wb = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.3), ledEv); wb.position.set(5.3, 1, 3.4); casa.add(wb);
	const auto = new THREE.Group(); auto.position.set(8.6, 0, 6.6); casa.add(auto);
	box(1.9, 0.55, 4.2, 0, 0.55, 0, std(0xdadde0, 0.4, 0.3), true, auto);
	box(1.7, 0.5, 2.2, 0, 1.05, 0.2, std(0x2c3338, 0.3, 0.2), true, auto);
	for (const [x, z] of [[-0.9, 1.3], [0.9, 1.3], [-0.9, -1.3], [0.9, -1.3]]) box(0.25, 0.6, 0.6, x, 0.3, z, antra, true, auto);
	const striscia = emis(0xffb42b); const sc = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.06, 4), striscia); sc.position.set(0, 0.2, 0); auto.add(sc);
	// cancello e telecamere
	box(0.2, 1.7, 0.2, 5.8, 0.9, 10.2, antra); box(0.2, 1.7, 0.2, 11, 0.9, 10.2, antra);
	const cancello = box(4.9, 1.2, 0.1, 8.4, 0.8, 10.2, std(0x39414a, 0.6, 0.3));
	const camP = new THREE.Group(); camP.position.set(5.8, 2, 10.2); casa.add(camP);
	box(0.5, 0.2, 0.2, 0, 0, 0, antra, true, camP);
	const ledCam = emis(0xff3b30, 0x7a2a24); const lc = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), ledCam); lc.position.set(0.2, 0, 0.12); camP.add(lc);
	const cono = new THREE.Mesh(new THREE.ConeGeometry(2.2, 6, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0xffb42b, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
	cono.rotation.x = Math.PI / 2; cono.rotation.z = 0.5; cono.position.set(2.5, -1.2, -2.5); camP.add(cono);
	// siepe e recinzione
	for (let i = 0; i < 7; i++) box(1.6, 1, 0.8, -9 + i * 1.7, 0.4, -7, verdeSc);
	for (let i = 0; i < 6; i++) box(1.7, 0.7, 0.2, -9.5 + i * 1.9, 0.25, 10.2, std(0xd9d3c4));
	// alberi
	const alberi: Mesh[] = [];
	const albero = (x: number, z: number, s: number) => {
		box(0.3 * s, 2 * s, 0.3 * s, x, s, z, legnoSc);
		const ch = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3 * s, 0), s > 1.1 ? verde : verdeSc);
		ch.position.set(x, 2.6 * s, z); ch.castShadow = true; casa.add(ch); alberi.push(ch);
	};
	albero(-9, 3, 1.3); albero(-8, 8, 1); albero(13, -2, 1.2); albero(-12, -3, 1.5); albero(9, -6, 1.1);
	// lampioncini del giardino
	const giardino = emis(0xffc477);
	const luciG: PointLight[] = [];
	for (const [x, z] of [[-6.5, 6], [3, 8], [6.2, 5], [-2, 8.6]]) {
		box(0.06, 0.8, 0.06, x, 0.3, z, antra);
		const b = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), giardino); b.position.set(x, 0.85, z); casa.add(b);
	}
	// nuvole
	const nuvole: Mesh[] = [];
	const matN = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, toneMapped: false });
	for (const [x, y, z, s] of [[-14, 17, -16, 4], [10, 20, -22, 5], [22, 15, -8, 3.5]]) {
		const n = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), matN); n.scale.set(s * 1.8, s * 0.5, s); n.position.set(x, y, z); scena.add(n); nuvole.push(n);
	}
	// pavimento riscaldato (si colora col clima)
	const caldo = new THREE.MeshBasicMaterial({ color: 0xff9a4a, transparent: true, opacity: 0, depthWrite: false });
	const pc = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 3.4), caldo); pc.rotation.x = -Math.PI / 2; pc.position.set(-2.6, 0.3, 0.2); casa.add(pc);
	const pcam = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 3.4), caldo); pcam.rotation.x = -Math.PI / 2; pcam.position.set(-2.8, 3.67, -0.8); casa.add(pcam);
	// la persona (una figura semplice)
	const persona = new THREE.Group(); casa.add(persona);
	const lime = std(0xd6ff3d, 0.6);
	box(0.4, 0.9, 0.3, 0, 0.75, 0, lime, true, persona);
	const testa = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), lime); testa.position.y = 1.4; testa.castShadow = true; persona.add(testa);

	// ---------- stelle, sole e luna, bordi al neon ----------
	const nStelle = 420;
	const pos3 = new Float32Array(nStelle * 3);
	for (let i = 0; i < nStelle; i++) {
		const u = Math.random() * Math.PI * 2, v = Math.acos(Math.random() * 0.95 + 0.04);
		pos3[i * 3] = Math.sin(v) * Math.cos(u) * 95; pos3[i * 3 + 1] = Math.cos(v) * 95; pos3[i * 3 + 2] = Math.sin(v) * Math.sin(u) * 95 - 20;
	}
	const gStelle = new THREE.BufferGeometry(); gStelle.setAttribute('position', new THREE.BufferAttribute(pos3, 3));
	const mStelle = new THREE.PointsMaterial({ color: 0xffffff, size: 0.55, sizeAttenuation: true, transparent: true, opacity: 0, fog: false, depthWrite: false });
	scena.add(new THREE.Points(gStelle, mStelle));
	const discoSole = new THREE.Mesh(new THREE.SphereGeometry(5, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffe9a8, fog: false, toneMapped: false }));
	const discoLuna = new THREE.Mesh(new THREE.SphereGeometry(3.4, 24, 16), new THREE.MeshBasicMaterial({ color: 0xe9e4ff, fog: false, toneMapped: false }));
	scena.add(discoSole, discoLuna);
	const neon = (c: number) => new THREE.MeshBasicMaterial({ color: c, toneMapped: false });
	const neonM = [neon(0xff2e93), neon(0x2be4ff), neon(0xd6ff3d)];
	const bordo = (w: number, y: number, z: number, m: MeshBasicMaterial) => { const me = new THREE.Mesh(new THREE.BoxGeometry(w, 0.09, 0.09), m); me.position.set(0, y, z); casa.add(me); };
	bordo(10.8, 3.2, 3.87, neonM[0]); // bordo del solaio
	bordo(11.2, 6.62, 3.97, neonM[1]); // bordo della copertura
	bordo(10.9, 0.2, 3.97, neonM[2]); // basamento
	for (const x of [-5.4, 5.4]) { const v = new THREE.Mesh(new THREE.BoxGeometry(0.09, 3.3, 0.09), neonM[1]); v.position.set(x, 4.9, 3.97); casa.add(v); }

	// ---------- luci ----------
	const sole = new THREE.DirectionalLight(0xfff1d6, 3);
	sole.castShadow = true;
	sole.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
	const sc2 = sole.shadow.camera; sc2.left = -17; sc2.right = 17; sc2.top = 17; sc2.bottom = -17; sc2.near = 1; sc2.far = 70;
	sole.shadow.bias = -0.0004; sole.shadow.normalBias = 0.05;
	scena.add(sole, sole.target);
	const luna = new THREE.DirectionalLight(0x6f8fe0, 0); luna.position.set(-10, 20, 12); scena.add(luna);
	const emisfero = new THREE.HemisphereLight(0xcfe8ff, 0xb7a98f, 0.8); scena.add(emisfero);

	const pl = (x: number, y: number, z: number): PointLight => {
		const l = new THREE.PointLight(0xffb36b, 0, 11, 1.7);
		l.position.set(x, y, z);
		casa.add(l);
		return l;
	};
	const punti: Record<Stanza, PointLight> = {
		ingresso: pl(4, 2.3, 1), soggiorno: pl(-2.6, 2.6, 0.3), cucina: pl(3, 2.4, 0.2),
		camera: pl(-2.8, 5.8, -0.5), studio: pl(2.8, 5.7, -0.8), giardino: pl(4, 1.5, 7),
	};
	void luciG;

	// ---------- stato visivo (segue lo stato con inerzia) ----------
	const s0 = stato;
	const vis = { ora: s0.ora, luci: { ...s0.luci }, tap: s0.tapparelle, allarme: 0, tv: 0, ev: 0, chiuso: 1, clima: s0.clima, via: s0.presenza === 'via' ? 1 : 0 };
	const col = (c: number): Color => new THREE.Color(c);
	const tmp = new THREE.Color(), tmp2 = new THREE.Color();
	let oraCss = -99;
	function coloraCielo(ora: number) {
		for (let i = 0; i < chiavi.length - 1; i++) {
			const [a, su1, hz1] = chiavi[i], [b, su2, hz2] = chiavi[i + 1];
			if (ora >= a && ora <= b) {
				const t = (ora - a) / (b - a);
				cieloSu.copy(tmp.set(su1)).lerp(tmp2.set(su2), t);
				cielo.copy(tmp.set(hz1)).lerp(tmp2.set(hz2), t);
				return;
			}
		}
	}

	// ---------- camera e hotspot ----------
	let f = 0;
	const pos = new THREE.Vector3(...pose[0].p), tgt = new THREE.Vector3(...pose[0].t);
	const posT = new THREE.Vector3(), tgtT = new THREE.Vector3();
	const v3 = new THREE.Vector3();
	function posaDa(fr: number) {
		const i = Math.min(pose.length - 2, Math.max(0, Math.floor(fr)));
		const t = ss(0, 1, Math.min(1, Math.max(0, fr - i)));
		const a = pose[i], b = pose[i + 1];
		posT.set(lerp(a.p[0], b.p[0], t), lerp(a.p[1], b.p[1], t), lerp(a.p[2], b.p[2], t));
		tgtT.set(lerp(a.t[0], b.t[0], t), lerp(a.t[1], b.t[1], t), lerp(a.t[2], b.t[2], t));
	}
	posaDa(0); pos.copy(posT); tgt.copy(tgtT);

	let w = 0, h = 0;
	function misura() {
		const r = canvas.getBoundingClientRect();
		const nw = Math.max(1, Math.round(r.width)), nh = Math.max(1, Math.round(r.height));
		if (nw === w && nh === h) return;
		w = nw; h = nh;
		renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.5 : 1.75));
		renderer.setSize(w, h, false);
		cam.aspect = w / h;
		// su schermi stretti serve più campo per far stare la casa
		cam.fov = w / h < 0.9 ? 52 : w / h < 1.3 ? 44 : 36;
		// su schermo largo la casa sta a destra, sotto le schede di vetro
		if (w >= 900) cam.setViewOffset(w, h, -w * 0.2, 0, w, h);
		else cam.clearViewOffset();
		cam.updateProjectionMatrix();
	}
	const ro = new ResizeObserver(misura);
	ro.observe(canvas);

	// ---------- ciclo di disegno ----------
	let attivo = true, raf = 0, ultimo = performance.now();
	const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
	function frame(ora: number) {
		raf = requestAnimationFrame(frame);
		if (!attivo) return;
		const dt = Math.min(0.1, (ora - ultimo) / 1000);
		ultimo = ora;
		const k = (r: number) => 1 - Math.exp(-dt * r);
		const t = ora / 1000;

		// stato → visivo
		vis.ora += (((((s0.ora - vis.ora) % 24) + 36) % 24) - 12) * k(2.2); // via più breve sul quadrante
		vis.ora = ((vis.ora % 24) + 24) % 24;
		(Object.keys(vis.luci) as Stanza[]).forEach((s) => (vis.luci[s] += (s0.luci[s] - vis.luci[s]) * k(6)));
		vis.tap += (s0.tapparelle - vis.tap) * k(4);
		vis.allarme += ((s0.allarme ? 1 : 0) - vis.allarme) * k(5);
		vis.tv += ((s0.tv ? 1 : 0) - vis.tv) * k(8);
		vis.ev += ((s0.ev ? 1 : 0) - vis.ev) * k(5);
		vis.chiuso += ((s0.serratura ? 1 : 0) - vis.chiuso) * k(8);
		vis.clima += (s0.clima - vis.clima) * k(4);
		vis.via += ((s0.presenza === 'via' ? 1 : 0) - vis.via) * k(4);

		// cielo e sole
		coloraCielo(vis.ora);
		(scena.fog as { color: Color }).color.copy(cielo);
		if (Math.abs(vis.ora - oraCss) > 0.004) {
			oraCss = vis.ora;
			opt.cielo('#' + cieloSu.getHexString(), '#' + cielo.getHexString());
		}
		const elev = elevazione(vis.ora);
		const giorno = ss(-0.08, 0.3, elev);
		const ang = (Math.PI * (vis.ora - 6.4)) / 12.4;
		sole.position.set(-Math.cos(ang) * 24, Math.max(0.5, Math.sin(ang)) * 22 + 2, 12);
		sole.target.position.set(0, 2, 0);
		sole.intensity = 3.2 * giorno;
		sole.color.setHSL(0.09 + 0.03 * Math.min(1, Math.max(0, elev)), 0.75 - 0.5 * Math.min(1, Math.max(0, elev)), 0.82);
		luna.intensity = 1.5 * (1 - giorno);
		emisfero.intensity = 0.6 + 0.95 * giorno;
		emisfero.color.copy(cielo).lerp(col(0xa9bbee), (1 - giorno) * 0.5).lerp(col(0xffffff), 0.25 * giorno);
		// astri e stelle
		discoSole.position.set(-Math.cos(ang) * 82, Math.sin(ang) * 62 - 2, -32);
		discoLuna.position.set(Math.cos(ang) * 82, -Math.sin(ang) * 62 - 2, -32);
		discoSole.visible = elev > -0.12; discoLuna.visible = elev < 0.05;
		(discoSole.material as MeshBasicMaterial).color.set(elev < 0.3 ? 0xffb07a : 0xfff0b8);
		mStelle.opacity = Math.max(0, 1 - giorno * 1.4) * 0.95;
		// bordi al neon: più vivi col buio
		neonM.forEach((m, i) => m.color.set([0xff2e93, 0x2be4ff, 0xd6ff3d][i]).multiplyScalar(0.55 + 0.45 * (1 - giorno)));
		renderer.toneMappingExposure = 1.2 - 0.0 * giorno;
		vetro.color.copy(cielo).lerp(col(0x33466e), 1 - giorno).multiplyScalar(0.9 + 0.35 * giorno);
		matN.opacity = 0.15 + 0.8 * giorno;

		// luci interne
		(Object.keys(punti) as Stanza[]).forEach((s) => (punti[s].intensity = vis.luci[s] * (s === 'giardino' ? 75 : 66)));
		bulbo.emissiveIntensity = vis.luci.soggiorno * 2.2;
		lampSog.visible = true;
		penzoli.forEach((l) => ((l.material as MeshStandardMaterial).emissiveIntensity = vis.luci.cucina * 2.4));
		(lampCam.material as MeshStandardMaterial).emissiveIntensity = vis.luci.camera * 2.4;
		(lampStu.material as MeshStandardMaterial).emissiveIntensity = vis.luci.studio * 2.4;
		(monitor.material as MeshStandardMaterial).emissiveIntensity = vis.luci.studio > 0.2 ? 1.1 : 0;
		giardino.emissiveIntensity = vis.luci.giardino * 2.6;
		(schermo.material as MeshStandardMaterial).emissiveIntensity = vis.tv * (0.9 + 0.2 * Math.sin(t * 2.1));
		(schermo.material as MeshStandardMaterial).emissive.setHSL(0.58 + 0.06 * Math.sin(t * 0.7), 0.7, 0.62);

		// tapparelle, porta, allarme
		for (const m of tap) m.scale.y = Math.max(0.02, 1 - vis.tap);
		ledPorta.emissive.set(vis.chiuso > 0.5 ? 0x39d98a : 0xffb42b);
		ledPorta.emissiveIntensity = 1.6;
		porta.rotation.y = 0;
		(sirena.material as MeshStandardMaterial).emissiveIntensity = vis.allarme * (0.8 + 0.8 * Math.max(0, Math.sin(t * 5)));
		ledCam.emissiveIntensity = 0.3 + vis.allarme * 1.8;
		(cono.material as MeshBasicMaterial).opacity = vis.allarme * (0.1 + 0.05 * Math.sin(t * 3));
		camP.rotation.y = Math.sin(t * 0.5) * 0.35 * (0.3 + vis.allarme);
		// energia
		const d = derivati(s0);
		pannelli.emissiveIntensity = Math.min(0.14, d.produzione * 0.035);
		ledEv.emissiveIntensity = 0.3 + vis.ev * 1.5;
		striscia.emissiveIntensity = vis.ev * (0.7 + 0.5 * Math.sin(t * 3));
		// clima: il pavimento si tinge
		const temp = (vis.clima - 15) / 11;
		caldo.color.set(temp > 0.55 ? 0xff8a3d : temp < 0.25 ? 0x5fb8ff : 0xffd69a);
		caldo.opacity = (0.08 + 0.18 * Math.abs(temp - 0.4) * 2) * (s0.presenza === 'via' ? 0.4 : 1);
		// persona
		const hr = vis.ora;
		let px = -1.5, py = 0.3, pz = 2.4;
		if (s0.presenza === 'letto') { px = -2.8; py = 4.2; pz = -2.1; persona.rotation.z = 0; }
		else if (hr > 6 && hr < 9.5) { px = 2.2; pz = 1.8; }
		else if (hr > 19 && hr < 21.5) { px = 3.6; pz = 1.4; }
		else if (hr > 9.5 && hr < 18) { px = 2.8; py = 3.6; pz = -1.3; }
		persona.position.x += (px - persona.position.x) * k(2.5);
		persona.position.y += (py - persona.position.y) * k(2.5);
		persona.position.z += (pz - persona.position.z) * k(2.5);
		persona.scale.setScalar(1 - vis.via);
		persona.visible = vis.via < 0.97;
		persona.rotation.z = s0.presenza === 'letto' ? Math.PI / 2 : 0;
		if (s0.presenza === 'letto') persona.position.y = 4.15;
		// vita: alberi e nuvole
		if (!ridotto) {
			alberi.forEach((a, i) => (a.rotation.z = Math.sin(t * 0.8 + i) * 0.03));
			nuvole.forEach((n, i) => (n.position.x += dt * (0.25 + i * 0.07)), void 0);
			nuvole.forEach((n) => { if (n.position.x > 34) n.position.x = -34; });
		}

		// camera: segue la posa del passo con inerzia, con un leggero respiro
		posaDa(f);
		pos.lerp(posT, k(3.2)); tgt.lerp(tgtT, k(3.2));
		const respiro = ridotto ? 0 : 1;
		cam.position.set(pos.x + Math.sin(t * 0.23) * 0.22 * respiro, pos.y + Math.sin(t * 0.31) * 0.12 * respiro, pos.z);
		cam.lookAt(tgt);

		misura();
		renderer.render(scena, cam);

		// hotspot: proiettati sullo schermo
		for (const hs of opt.hotspots) {
			v3.set(...hs.pos).project(cam);
			const dietro = v3.z > 1;
			hs.el.style.transform = `translate(${((v3.x + 1) / 2) * w}px, ${((1 - v3.y) / 2) * h}px) translate(-50%, -50%)`;
			hs.el.dataset.fuori = dietro || Math.abs(v3.x) > 1.05 || Math.abs(v3.y) > 1.05 ? '1' : '0';
		}
	}
	misura();
	raf = requestAnimationFrame(frame);
	// primo disegno già compilato: evita il balzo del primo frame
	if (renderer.compileAsync) await renderer.compileAsync(scena, cam).catch(() => undefined);
	renderer.render(scena, cam);

	return {
		setF: (x) => (f = Math.min(pose.length - 1, Math.max(0, x))),
		ferma: () => (attivo = false),
		riprendi: () => { attivo = true; ultimo = performance.now(); },
		colore: () => '#' + cielo.getHexString(),
		distruggi: () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			renderer.dispose();
		},
	};
}
