// Clip di un'interazione, a passi: a ogni fotogramma si esegue un pezzetto dell'azione, si fanno avanzare
// di 1/fps tutte le animazioni CSS/WAAPI (anche i transition appena nati) e si scatta. Il tempo è deterministico.
// Le animazioni legate allo scroll e quelle in requestAnimationFrame (GSAP, Three.js) NON sono controllate.
// Uso: node clip-azione.mjs <macro/variante> <scenario> [attesa-ms=1500] [cartella-uscita]
import { chromium } from 'playwright-core';
import { CHROME } from './chrome.mjs';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { scenari } from './scenari.mjs';
const [, , page, nome, wait = '1500', outDir = 'C:/Users/utente/Videos/Assets/Loop_Studio/Clip_Mobile'] = process.argv;
const slug = page.split('/')[1], FPS = 30, DT = 1000 / FPS;
const sc = scenari[`${slug}/${nome}`];
if (!sc) throw new Error('scenari: ' + Object.keys(scenari).join(', '));
const tmp = `${outDir}/_${slug}-${nome}`; rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true });
const b = await chromium.launch({ executablePath: CHROME });
const ctx = await b.newContext({ viewport: { width: 390, height: 693 }, deviceScaleFactor: 1080 / 390, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
// lo scroll morbido nativo non si può fermare: lo rifaccio io a passi
await p.addInitScript(() => { Element.prototype.scrollIntoView = function () {}; });
await p.goto(`http://localhost:4401/${page}/`, { waitUntil: 'networkidle' });
await p.waitForTimeout(+wait);
const cdp = await ctx.newCDPSession(p);
let n = 0;
const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const fotogramma = async () => {
	await p.evaluate((dt) => {
		for (const a of document.getAnimations()) {
			if (a.timeline !== document.timeline) continue;
			if (a.__t === undefined) { a.__t = +a.currentTime || 0; a.pause(); }
			a.__t += dt; a.currentTime = a.__t;
		}
	}, DT);
	await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
	await p.waitForTimeout(30);
	const y = await p.evaluate(() => Math.round(scrollY));
	const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 95, fromSurface: true, clip: { x: 0, y, width: 390, height: 693, scale: 1080 / 390 } });
	writeFileSync(`${tmp}/f${String(n++).padStart(5, '0')}.jpg`, Buffer.from(data, 'base64'));
};
const H = {
	// ferma per s secondi
	attendi: async (s) => { for (let i = 0; i < s * FPS; i++) await fotogramma(); },
	// per s secondi chiama fn(k) con k da 0 a 1 (con ease opzionale)
	anima: async (s, fn, easing = true) => { const N = Math.round(s * FPS); for (let i = 1; i <= N; i++) { const k = i / N; await fn(easing ? ease(k) : k); await fotogramma(); } },
	// scorre fino a che l'elemento è a `margine` px dal bordo alto
	vaiA: async (sel, s = 1.2, margine = 70) => {
		const [da, a] = await p.evaluate(([sel, m]) => [scrollY, Math.max(0, document.querySelector(sel).getBoundingClientRect().top + scrollY - m)], [sel, margine]);
		await H.anima(s, (k) => p.evaluate((y) => scrollTo(0, y), da + (a - da) * k));
	},
	tocca: async (sel) => { const bb = await p.locator(sel).first().boundingBox(); await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); },
	p, FPS,
};
await fotogramma();
await sc(H);
await b.close();
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', `${tmp}/f%05d.jpg`, '-vf', 'scale=1080:1920', '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${outDir}/azione-${slug}-${nome}.mp4`]);
rmSync(tmp, { recursive: true, force: true });
console.log('ok', slug, nome, n, 'fotogrammi =', (n / FPS).toFixed(1), 's');
