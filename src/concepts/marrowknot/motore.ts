// Il motore del percorso: scroll morbido (Lenis), corridoio orizzontale (GSAP ScrollTrigger con pin), tela delle foto
// (OGL) e il piccolo cervello che dice alla navbar in quale sala ci si trova. Caricato dopo il primo paint.
// Corridoio solo con mouse, schermo largo e senza reduced-motion: altrove la pagina resta una pila verticale nativa.

import { Arazzo, type InfoSala } from './arazzo';

const lim = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export async function avvia() {
	const d = document.documentElement;
	const orizz = d.classList.contains('h');
	const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;

	// se cambia la modalità (finestra ridimensionata, tablet con mouse) si ricarica: due layout diversi
	for (const q of ['(min-width: 900px)', '(hover: hover) and (pointer: fine)']) {
		matchMedia(q).addEventListener('change', () => location.reload());
	}

	const sale = [...document.querySelectorAll<HTMLElement>('[data-sala]')];
	const nav = document.querySelector<HTMLElement>('[data-nav]')!;
	const linkNav = [...nav.querySelectorAll<HTMLAnchorElement>('.nav__sale a')];

	let lenis: { scrollTo: (y: number, o: object) => void } | null = null;
	let pinY0 = 0;
	let pinY1 = Infinity; // dove finisce il corridoio: oltre c'è l'unico tratto di scroll verticale

	if (orizz) {
		// gsap, ScrollTrigger e Lenis servono solo al corridoio (desktop con mouse): sul telefono non si scaricano
		const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
			import('gsap'),
			import('gsap/ScrollTrigger'),
			import('lenis'),
		]);
		gsap.registerPlugin(ScrollTrigger);
		const l = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
		lenis = l;
		l.on('scroll', ScrollTrigger.update);
		gsap.ticker.add((t) => l.raf(t * 1000));
		gsap.ticker.lagSmoothing(0);

		const binario = document.querySelector<HTMLElement>('.binario')!;
		const infilata = document.querySelector<HTMLElement>('.infilata')!;
		const dist = () => Math.max(0, binario.scrollWidth - innerWidth);
		const st = ScrollTrigger.create({
			trigger: infilata,
			start: 'top top',
			end: () => '+=' + dist(),
			pin: true,
			scrub: true,
			invalidateOnRefresh: true,
			onUpdate: (self) => gsap.set(binario, { x: -dist() * self.progress }),
			onRefresh: (self) => {
				pinY0 = self.start;
				pinY1 = self.end;
				gsap.set(binario, { x: -dist() * self.progress });
			},
		});
		pinY0 = st.start;
		pinY1 = st.end;
	}

	// il binario è traslato, non scorso: se la tastiera porta il fuoco in una sala fuori vista, il browser scorrerebbe
	// il contenitore (overflow: hidden) e romperebbe il layout. Lo riportiamo a zero e scorriamo la pagina.
	if (orizz && lenis) {
		const infilata = document.querySelector<HTMLElement>('.infilata')!;
		infilata.addEventListener('scroll', () => (infilata.scrollLeft = 0));
		document.addEventListener('focusin', (e) => {
			const el = e.target as HTMLElement;
			if (!el.closest?.('.binario')) return;
			infilata.scrollLeft = 0;
			const r = el.getBoundingClientRect();
			if (r.left >= 0 && r.right <= innerWidth) return;
			lenis!.scrollTo(Math.max(0, scrollY + r.left - innerWidth * 0.2), { immediate: true });
		});
	}

	// ———— tela delle foto ————
	let arazzo: Arazzo | null = null;
	const tela = document.querySelector<HTMLCanvasElement>('[data-tela]');
	function accendiTela() {
		if (!tela || arazzo) return;
		try {
			arazzo = new Arazzo(tela, {
				orizzontale: orizz,
				onPerso: () => {
					d.classList.remove('gl');
					arazzo = null;
				},
			});
			d.classList.add('gl');
		} catch {
			d.classList.remove('gl');
			arazzo = null;
		}
	}
	if (d.dataset.glOk) {
		if (d.classList.contains('gl')) accendiTela();
		else {
			// telefono: la tela parte al primo gesto
			const primo = () => {
				removeEventListener('scroll', primo);
				removeEventListener('touchstart', primo);
				removeEventListener('pointerdown', primo);
				accendiTela();
			};
			addEventListener('scroll', primo, { passive: true, once: true });
			addEventListener('touchstart', primo, { passive: true, once: true });
			addEventListener('pointerdown', primo, { passive: true, once: true });
		}
	}

	// ———— ogni fotogramma ————
	// Ogni sala ha quattro slide (nome + claim, storia, da sapere, dati), una per foto. Qui si decide, dall'avanzamento nella sala,
	// quale foto è tessuta (`w`, anche per la tela), quando ogni slide entra (--in) ed esce (--out), dove sta il nome.
	// Corridoio: l'avanzamento è la posizione orizzontale della sala; pila: la posizione di ciascuna slide sullo schermo.
	const smooth = (a: number, b: number, x: number) => {
		const t = lim((x - a) / (b - a));
		return t * t * (3 - 2 * t);
	};
	const LIM = [0, 0.34, 0.58, 0.79, 1]; // dove finisce ciascuna slide (0..1 dell'avanzamento nella sala)
	const MEZZA = 0.07; // metà della fascia in cui una foto si tesse sull'altra

	interface Dati {
		caps: string[];
		cap: HTMLElement | null;
		capTesto: HTMLElement | null;
		segs: HTMLElement[];
		corrente: number;
		scena: HTMLElement | null;
		slides: HTMLElement[];
		nome: HTMLElement | null;
		imgs: HTMLElement[];
		val: Map<string, string>[]; // ultimo --in/--out scritti per slide
		spenta: boolean[];
		grande: { bx: number; by: number; S: number } | null;
	}
	const dati = new Map<HTMLElement, Dati>();
	for (const s of sale) {
		const f = s.querySelector<HTMLElement>('[data-fondo]');
		const caps: string[] = f ? (JSON.parse(f.dataset.scatti || '[]') as { cap: string }[]).map((x) => x.cap) : [];
		const slides = [...s.querySelectorAll<HTMLElement>('[data-slide]')];
		if (!orizz && slides[0]) s.dataset.vt = slides[0].dataset.tono; // il velo in pila parte dal tono della prima slide
		dati.set(s, {
			caps,
			cap: s.querySelector<HTMLElement>('[data-cap]'),
			capTesto: s.querySelector<HTMLElement>('[data-cap-testo]'),
			segs: [...s.querySelectorAll<HTMLElement>('[data-seg]')],
			corrente: 0,
			scena: s.querySelector<HTMLElement>('[data-scena]'),
			slides,
			nome: s.querySelector<HTMLElement>('[data-nome-grande]'),
			imgs: f ? [...f.querySelectorAll<HTMLElement>('.fondo__img')] : [],
			val: slides.map(() => new Map<string, string>()),
			spenta: slides.map(() => false),
			grande: null,
		});
	}

	// il nome nasce grande a sinistra, al centro, e scorrendo scende a posarsi in basso a sinistra (grande e trasparente):
	// si misura dove sta "a riposo" (in basso) e di quanto va spostato e ingrandito per partire dal centro
	function misura() {
		if (!orizz) return;
		const W = innerWidth;
		const H = innerHeight;
		for (const s of sale) {
			const d = dati.get(s)!;
			if (!d.nome) continue;
			const cy = d.nome.offsetTop + d.nome.offsetHeight / 2;
			d.grande = {
				bx: 0,
				by: H * 0.47 - cy,
				S: 1.15,
			};
		}
	}
	misura();
	document.fonts?.ready.then(misura);
	addEventListener('resize', misura);

	// scrive una proprietà solo se è cambiata davvero (a ogni fotogramma sono decine di slide)
	const scrivi = (el: HTMLElement, i: number, d: Dati, nome: string, v: number) => {
		const t = v.toFixed(3);
		if (d.val[i].get(nome) === t) return;
		d.val[i].set(nome, t);
		el.style.setProperty(nome, t);
	};

	let attiva = '';
	function frame() {
		const W = innerWidth;
		const H = innerHeight;
		let migliore: HTMLElement | null = null;
		let distMin = Infinity;
		const info: InfoSala[] = [];
		for (const s of sale) {
			const r = s.getBoundingClientRect();
			if (orizz ? r.right < -W * 0.2 || r.left > W * 1.2 : r.bottom < -H * 0.2 || r.top > H * 1.2) {
				if (arazzo && s.hasAttribute('data-con-foto')) info.push({ el: s, r, u: orizz ? (r.left < 0 ? 1 : 0) : r.top < 0 ? 1 : 0 });
				continue;
			}
			const centro = orizz ? (r.left + r.right) / 2 - W / 2 : (r.top + r.bottom) / 2 - H / 2;
			const ampiezza = orizz ? W : H;
			s.style.setProperty('--p', lim(centro / ampiezza, -1.5, 1.5).toFixed(3));
			const entrata = orizz ? (W - r.left) / (W * 0.9) : (H - r.top) / (H * 0.9);
			s.style.setProperty('--draw', lim(entrata).toFixed(3));

			const d = dati.get(s)!;
			const hero = s.hasAttribute('data-hero');
			// avanzamento nella sala
			const u = orizz
				? lim((W * 0.3 - r.left) / (W * 0.3 + r.width - W))
				: hero
					? lim((H * 0.8 - r.top) / (r.height * 0.9))
					: lim(-r.top / Math.max(1, r.height - H));
			let w: number[] | undefined;
			let vel: { w: [number, number]; chiaro: [number, number] } | undefined;

			if (d.slides.length && d.caps.length > 0) {
				// quanto è tessuta ogni foto (la prima la decide la tela, entrando)
				const tops = orizz ? [] : d.slides.map((el) => el.getBoundingClientRect().top);
				w = d.caps.map((_, j) =>
					j === 0 ? 1 : orizz ? smooth(LIM[j] - MEZZA, LIM[j] + MEZZA, u) : smooth(H * 0.96, H * 0.5, tops[Math.min(j, tops.length - 1)]),
				);
				let idx = 0;
				w.forEach((v, j) => {
					if (v > 0.5) idx = j;
				});
				// didascalia, segmenti e (senza WebGL) la foto visibile
				if (idx !== d.corrente) {
					d.corrente = idx;
					d.cap?.classList.add('cambia');
					setTimeout(() => {
						if (d.capTesto) d.capTesto.textContent = d.caps[d.corrente];
						d.cap?.classList.remove('cambia');
					}, 320);
					d.segs.forEach((g, k) => g.classList.toggle('attivo', k <= idx));
					d.imgs.forEach((im, k) => im.classList.toggle('fondo__img--on', k === idx));
					if (!orizz) s.dataset.vt = d.slides[Math.min(idx, d.slides.length - 1)].dataset.tono;
				}

				if (!ridotto) {
					// entrata e uscita di ogni slide; il velo di colore segue il lato dove stanno le slide visibili
					let vl = 0;
					let vr = 0;
					let cl = 0; // quanta parte del peso è di slide a testo scuro (velo chiaro)
					let cr = 0;
					const e = orizz ? lim((W - r.left) / (W * 0.72)) : 1;
					d.slides.forEach((el, k) => {
						let vin: number;
						let vout = 0;
						if (orizz) {
							vin = k === 0 ? e : smooth(LIM[k] + 0.005, LIM[k] + 0.115, u);
							vout = k < d.slides.length - 1 ? smooth(LIM[k + 1] - MEZZA, LIM[k + 1] - 0.005, u) : 0;
						} else vin = lim((H * 0.92 - tops[k]) / (H * 0.42));
						scrivi(el, k, d, '--in', vin);
						if (orizz) {
							// il velo sotto il testo scuro è più leggero di quello sotto il testo bianco
							const scuro = el.dataset.tono === 'scuro';
							const g = vin * (1 - vout) * (scuro ? 0.6 : 1);
							if (el.dataset.lato === 'sx') {
								vl += g;
								cl += scuro ? g : 0;
							} else {
								vr += g;
								cr += scuro ? g : 0;
							}
							scrivi(el, k, d, '--out', vout);
							const spenta = vin <= 0.001 || vout >= 0.999;
							if (spenta !== d.spenta[k]) {
								d.spenta[k] = spenta;
								el.toggleAttribute('inert', spenta);
							}
						}
					});
					if (orizz) vel = { w: [Math.min(1, vl), Math.min(1, vr)], chiaro: [vl > 0 ? cl / vl : 0, vr > 0 ? cr / vr : 0] };
					// il nome
					if (orizz && d.nome && d.grande) {
						const t = smooth(0.14, 0.36, u);
						d.nome.style.opacity = (1 - 0.28 * smooth(0.22, 0.38, u)).toFixed(3);
						const g = d.grande;
						d.nome.style.transform = `translate3d(${(g.bx * (1 - t)).toFixed(1)}px,${(g.by * (1 - t)).toFixed(1)}px,0) scale(${(1 + (g.S - 1) * (1 - t)).toFixed(4)})`;
						d.nome.style.setProperty('--wn', lim((e - 0.12) / 0.55).toFixed(3));
					}
					// il video nella serratura entra quando il nome ha lasciato il centro
					if (orizz && s.querySelector('[data-video]')) s.style.setProperty('--vk', smooth(LIM[1] - 0.02, LIM[1] + 0.08, u).toFixed(3));
				}
			}
			// corridoio: la scena resta ferma sullo schermo mentre le foto si danno il cambio; la sala dopo la copre come una tenda
			if (orizz && !hero && d.scena) d.scena.style.transform = `translate3d(${Math.max(0, -r.left).toFixed(1)}px,0,0)`;
			// la didascalia segue lo schermo dentro la sala (corridoio)
			if (orizz && d.cap) {
				// la didascalia sta in basso a destra (a sinistra c'è il nome), mai attaccata al bordo della sala che entra
				const cw = d.cap.offsetWidth;
				const voluto = W * 0.94 - cw;
				const cx = lim(voluto - r.left - d.cap.offsetLeft, W * 0.045, Math.max(W * 0.045, r.width - cw - d.cap.offsetLeft - W * 0.04));
				d.cap.style.setProperty('--cx', cx.toFixed(1) + 'px');
			}
			if (s.hasAttribute('data-con-foto')) info.push({ el: s, r, u, w, vel });

			// la sala "attiva" è quella che contiene il punto a un terzo dello schermo (orizz.) o il centro (pila)
			const ref = orizz ? W * 0.38 : H * 0.45;
			const inizio = orizz ? r.left : r.top;
			const fine = orizz ? r.right : r.bottom;
			const dd = ref < inizio ? inizio - ref : ref > fine ? ref - fine : 0;
			if (dd < distMin) {
				distMin = dd;
				migliore = s;
			}
		}
		if (migliore) {
			const id = (migliore as HTMLElement).id;
			if (id !== attiva) {
				attiva = id;
				nav.dataset.tinta = (migliore as HTMLElement).dataset.tinta!;
				nav.dataset.tono = (migliore as HTMLElement).dataset.tonoNav ?? 'chiaro';
				for (const a of linkNav) a.setAttribute('aria-current', String(a.dataset.vai === id));
			}
		}
		// finito il corridoio la pagina scorre in verticale sotto la navbar: sfondo nero, così non si confonde col testo
		nav.toggleAttribute('data-solido', orizz && scrollY > pinY1 + 4);
		arazzo?.disegna(info);
	}
	const giro = () => {
		frame();
		requestAnimationFrame(giro);
	};
	requestAnimationFrame(giro);

	// ———— navigazione tra le sale ————
	const lento = (t: number) => 1 - Math.pow(1 - t, 4);
	document.addEventListener('click', (e) => {
		const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
		if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
		const id = (a.dataset.vai || a.getAttribute('href')!.slice(1)).trim();
		const el = id ? document.getElementById(id) : null;
		if (!el) return;
		e.preventDefault();
		if (orizz && lenis) {
			const y = Math.round(pinY0 + (el.offsetLeft || 0));
			lenis.scrollTo(Math.max(0, y), { duration: 2.1, easing: lento });
		} else {
			const top = el.getBoundingClientRect().top + scrollY - (id === 'ingresso' ? 0 : 0);
			scrollTo({ top, behavior: ridotto ? 'auto' : 'smooth' });
		}
	});
}
