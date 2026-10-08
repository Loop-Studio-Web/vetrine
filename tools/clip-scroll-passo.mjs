// Scroll a passi (un fotogramma per posizione) per le pagine troppo pesanti per la cattura in tempo reale.
// Le animazioni a tempo (non legate allo scroll) restano ferme: va bene per pagine a scroll-driven.
// Uso: node clip-scroll-passo.mjs <macro/variante> [attesa-ms=1500] [distanza-px=4500] [secondi=10] [fps=30] [cartella-uscita]
import { chromium } from 'playwright-core';
import { CHROME } from './chrome.mjs';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const [, , page, wait = '1500', dist = '4500', dur = '10', fps = '30', outDir = 'C:/Users/utente/Videos/Assets/Loop_Studio/Clip_Mobile'] = process.argv;
const START = +(process.env.START || 0);
const slug = page === 'hub' ? 'hub' : page.split('/')[1], FPS = +fps;
const tmp = `${outDir}/_${slug}`; rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true });
const b = await chromium.launch({ executablePath: CHROME });
const ctx = await b.newContext({ viewport: { width: 390, height: 693 }, deviceScaleFactor: 1080 / 390, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
await p.goto(page === 'hub' ? 'http://localhost:4401/' : `http://localhost:4401/${page}/`, { waitUntil: 'networkidle' });
await p.waitForTimeout(+wait);
// giro a vuoto: fa scattare i reveal (una sola volta) prima di registrare
for (let y = 0; y < START + +dist + 700; y += 300) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(150); }
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(1200);
const cdp = await ctx.newCDPSession(p);
const max = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight), D = Math.min(+dist, max - START);
const e = (x) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const N = Math.round(+dur * FPS), hold = Math.round(0.6 * FPS);
for (let i = 0; i < N + 2 * hold; i++) {
	const k = Math.min(1, Math.max(0, (i - hold) / N));
	await p.evaluate((y) => scrollTo(0, y), START + D * e(k));
	await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
	await p.waitForTimeout(40);
	const { data } = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality: 95, fromSurface: true, clip: { x: 0, y: Math.round(START + D * e(k)), width: 390, height: 693, scale: 1080 / 390 } });
	writeFileSync(`${tmp}/f${String(i).padStart(5, '0')}.jpg`, Buffer.from(data, 'base64'));
}
await b.close();
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', `${tmp}/f%05d.jpg`, '-vf', 'scale=1080:1920', '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${outDir}/scroll-${slug}.mp4`]);
rmSync(tmp, { recursive: true, force: true });
console.log('ok', slug, N + 2 * hold, 'fotogrammi a', FPS, 'fps');
