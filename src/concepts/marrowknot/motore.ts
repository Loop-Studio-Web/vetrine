// Il motore del percorso: scroll morbido (Lenis), corridoio orizzontale (GSAP ScrollTrigger con pin), tela delle foto
// (OGL) e il piccolo cervello che dice alla navbar in quale sala ci si trova. Caricato dopo il primo paint.
// Corridoio solo con mouse, schermo largo e senza reduced-motion: altrove la pagina resta una pila verticale nativa.

import { Arazzo } from './arazzo';

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
				gsap.set(binario, { x: -dist() * self.progress });
			},
		});
		pinY0 = st.start;
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
	let attiva = '';
	function frame() {
		const W = innerWidth;
		const H = innerHeight;
		let migliore: HTMLElement | null = null;
		let distMin = Infinity;
		for (const s of sale) {
			const r = s.getBoundingClientRect();
			if (orizz ? r.right < -W * 0.2 || r.left > W * 1.2 : r.bottom < -H * 0.2 || r.top > H * 1.2) continue;
			const centro = orizz ? (r.left + r.right) / 2 - W / 2 : (r.top + r.bottom) / 2 - H / 2;
			const ampiezza = orizz ? W : H;
			s.style.setProperty('--p', lim(centro / ampiezza, -1.5, 1.5).toFixed(3));
			const entrata = orizz ? (W - r.left) / (W * 0.9) : (H - r.top) / (H * 0.9);
			s.style.setProperty('--draw', lim(entrata).toFixed(3));
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
				for (const a of linkNav) a.setAttribute('aria-current', String(a.dataset.vai === id));
			}
		}
		arazzo?.disegna();
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
