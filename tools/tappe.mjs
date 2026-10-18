// Fotogrammi di una pagina a "tappe" ([data-tappa], es. Chioma Saracena) a valori di t scelti (t = i quando la tappa i è sotto la barra).
// Uso: node tappe.mjs <url> <larghezza> <altezza> <prefisso> 0,0.6,1.5,...   (interpolazione lineare fra le tappe, non le ancore data-t)
import { chromium } from 'playwright-core';
import { CHROME } from './chrome.mjs';
const [, , url, w, h, out, lista] = process.argv;
const b = await chromium.launch({ executablePath: CHROME });
const ctx = await b.newContext({ viewport: { width: +w, height: +h }, hasTouch: +w < 700 });
const p = await ctx.newPage();
const errs = [];
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
p.on('pageerror', (e) => errs.push(String(e)));
await p.goto(url, { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
const soglie = await p.evaluate(() => {
	const barra = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--barra-h')) || 56;
	return [...document.querySelectorAll('[data-tappa]')].map((el, i) => (i === 0 ? 0 : el.getBoundingClientRect().top + scrollY - barra));
});
console.log('soglie', soglie.map(Math.round).join(' '), 'errori', JSON.stringify(errs));
for (const ts of lista.split(',')) {
	const t = parseFloat(ts);
	let y;
	if (t >= 5) y = soglie[5] + (t - 5) * +h;
	else {
		const i = Math.floor(t);
		y = soglie[i] + (t - i) * (soglie[i + 1] - soglie[i]);
	}
	await p.evaluate((y) => scrollTo(0, y), y);
	await p.waitForTimeout(350);
	await p.screenshot({ path: `${out}-${w}-t${ts}.png` });
}
const ov = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log('overflowX', ov, 'errori', JSON.stringify(errs));
await b.close();
