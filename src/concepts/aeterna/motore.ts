// Motore di animazione di Aeterna: GSAP + ScrollTrigger + Lenis, inizializzati una sola volta.
// Importato da ogni sezione del concept (Astro raggruppa il modulo in un solo file).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

const mqRidotto = matchMedia('(prefers-reduced-motion: reduce)');
export const ridotto = mqRidotto.matches;
export const mouseFine = matchMedia('(hover: hover) and (pointer: fine)').matches;

// Scorrimento con inerzia solo con mouse e movimento consentito: su touch lo scorrimento nativo è meglio
export let lenis: Lenis | null = null;
if (!ridotto && mouseFine) {
	lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.95 });
	lenis.on('scroll', ScrollTrigger.update);
	gsap.ticker.add((t) => lenis!.raf(t * 1000));
	gsap.ticker.lagSmoothing(0);
}

/** Scorre fino a un elemento o a una posizione, con o senza inerzia. */
export function vai(dove: Element | number, opzioni: { offset?: number; immediato?: boolean } = {}) {
	const offset = opzioni.offset ?? 0;
	if (lenis) {
		lenis.scrollTo(dove as HTMLElement | number, { offset, duration: opzioni.immediato ? 0 : 1.6, easing: (x) => 1 - Math.pow(1 - x, 4) });
	} else if (typeof dove === 'number') {
		scrollTo({ top: dove + offset, behavior: ridotto ? 'auto' : 'smooth' });
	} else {
		const y = dove.getBoundingClientRect().top + scrollY + offset;
		scrollTo({ top: y, behavior: ridotto ? 'auto' : 'smooth' });
	}
}

/** Ferma/riprende lo scorrimento (menù aperto, drawer, intro). */
export function blocca(si: boolean) {
	if (lenis) {
		if (si) lenis.stop();
		else lenis.start();
	}
}

/** Spezza il testo in parole dentro una maschera, senza perdere i tag interni (es. <em>). Restituisce gli span da animare. */
export function dividi(el: HTMLElement): HTMLElement[] {
	const parole: HTMLElement[] = [];
	const visita = (nodo: Node) => {
		for (const f of Array.from(nodo.childNodes)) {
			if (f.nodeType === Node.TEXT_NODE) {
				const frammenti = (f.textContent ?? '').split(/(\s+)/);
				const dest = document.createDocumentFragment();
				for (const p of frammenti) {
					if (!p) continue;
					if (/^\s+$/.test(p)) {
						dest.appendChild(document.createTextNode(' '));
						continue;
					}
					const m = document.createElement('span');
					m.className = 'maschera';
					const i = document.createElement('span');
					i.textContent = p;
					m.appendChild(i);
					dest.appendChild(m);
					parole.push(i);
				}
				f.replaceWith(dest);
			} else if (f.nodeType === Node.ELEMENT_NODE && (f as HTMLElement).tagName !== 'BR') {
				visita(f);
			}
		}
	};
	visita(el);
	return parole;
}

/** Titoli [data-split]: parole che salgono dalla maschera quando entrano in vista. */
export function titoliSplit(radice: ParentNode = document) {
	radice.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
		if (el.dataset.fatto) return;
		el.dataset.fatto = '1';
		if (ridotto) return;
		const parole = dividi(el);
		gsap.set(parole, { yPercent: 115 });
		el.classList.add('is-pronto');
		ScrollTrigger.create({
			trigger: el,
			start: 'top 88%',
			once: true,
			onEnter: () => gsap.to(parole, { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.045 }),
		});
	});
}

const GLIFI = '▓▒░<>/\\_-+=0123456789ABCDEF';

/** Decodifica il testo di un elemento con un effetto "scrambled". */
export function scramble(el: HTMLElement, finale: string, durata = 1100) {
	if (ridotto) {
		el.textContent = finale;
		return;
	}
	const inizio = performance.now();
	const passo = (ora: number) => {
		const p = Math.min(1, (ora - inizio) / durata);
		const fissi = Math.floor(finale.length * p);
		let s = finale.slice(0, fissi);
		for (let i = fissi; i < finale.length; i++) {
			s += finale[i] === ' ' ? ' ' : GLIFI[Math.floor(Math.random() * GLIFI.length)];
		}
		el.textContent = s;
		if (p < 1) requestAnimationFrame(passo);
		else el.textContent = finale;
	};
	requestAnimationFrame(passo);
}

/** Blocchi [data-rivela]: dissolvenza e risalita all'ingresso in vista. */
export function rivela(radice: ParentNode = document) {
	const els = radice.querySelectorAll<HTMLElement>('[data-rivela]');
	if (ridotto) return;
	const io = new IntersectionObserver(
		(voci) => {
			for (const v of voci) {
				if (v.isIntersecting) {
					v.target.classList.add('is-visibile');
					io.unobserve(v.target);
				}
			}
		},
		{ threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
	);
	els.forEach((e) => io.observe(e));
}

/** Luce che segue il mouse sul bordo delle schede .luce. */
export function luceBordo(radice: ParentNode = document) {
	if (!mouseFine) return;
	radice.querySelectorAll<HTMLElement>('.luce').forEach((el) => {
		el.addEventListener('pointermove', (e) => {
			const r = el.getBoundingClientRect();
			el.style.setProperty('--mx', `${e.clientX - r.left}px`);
			el.style.setProperty('--my', `${e.clientY - r.top}px`);
		});
	});
}

export { euro } from './formato';
