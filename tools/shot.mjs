// Screenshot a pezzi (un viewport alto) dopo uno scroll graduale che fa scattare i reveal.
// Uso: node shot.mjs <url> [larghezza=1440] [altezza=900] [prefisso=shot] [tutto=1]
// Stampa altezza pagina, scorrimento orizzontale (deve essere 0) ed errori in console.
import { chromium } from 'playwright-core';
import { CHROME } from './chrome.mjs';
const [, , url, w = '1440', h = '900', out = 'shot', full = '1'] = process.argv;
if (!url) throw new Error('uso: node shot.mjs <url> [larghezza] [altezza] [prefisso] [tutto]');
const b = await chromium.launch({ executablePath: CHROME });
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, hasTouch: +w < 700 });
const p = await ctx.newPage();
const errs = [];
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
p.on('pageerror', (e) => errs.push(String(e)));
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(800);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < H; y += 500) {
	await p.evaluate((y) => scrollTo(0, y), y);
	await p.waitForTimeout(120);
}
await p.evaluate(() => scrollTo(0, 0));
await p.waitForTimeout(500);
const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log('altezza', H, 'overflowX', ov, 'errori', JSON.stringify(errs));
const n = full === '1' ? Math.ceil(H / +h) : 1;
for (let i = 0; i < n; i++) {
	await p.evaluate((y) => scrollTo(0, y), i * +h);
	await p.waitForTimeout(250);
	await p.screenshot({ path: `${out}-${w}-${String(i).padStart(2, '0')}.png` });
}
console.log('pezzi', n);
await b.close();
