// axe-core a 1440 e 390 px, prima e dopo un'interazione facoltativa (selettore da cliccare), e con il menù mobile aperto.
// Uso: node axe.mjs <url> [selettore-da-cliccare] [selettore-burger=[data-burger]]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { CHROME } from './chrome.mjs';
const axe = fs.readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const [, , url, click, burger = '[data-burger]'] = process.argv;
if (!url) throw new Error('uso: node axe.mjs <url> [selettore] [burger]');
const b = await chromium.launch({ executablePath: CHROME });
let totale = 0;
for (const [w, h] of [[1440, 900], [390, 844]]) {
	const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: w < 700 });
	const p = await ctx.newPage();
	await p.goto(url, { waitUntil: 'networkidle' });
	const H = await p.evaluate(() => document.documentElement.scrollHeight);
	for (let y = 0; y < H; y += 500) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(80); }
	await p.evaluate(() => scrollTo(0, 0));
	await p.waitForTimeout(400);
	const run = async (label) => {
		await p.addScriptTag({ content: axe });
		const r = await p.evaluate(async () => await axe.run(document, { resultTypes: ['violations'] }));
		totale += r.violations.length;
		console.log(w, label, 'violazioni:', r.violations.length);
		for (const v of r.violations) console.log('  -', v.id, v.impact, v.nodes.length, v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | '), '\n    ', v.nodes[0].failureSummary?.split('\n').slice(0, 3).join(' / '));
	};
	await run('iniziale');
	if (click) { await p.click(click); await p.waitForTimeout(700); await run(`dopo click ${click}`); }
	if (w < 700 && (await p.$(burger))) {
		await p.evaluate(() => scrollTo(0, 0));
		await p.click(burger);
		await p.waitForTimeout(1000);
		await run('menu aperto');
	}
	await ctx.close();
}
await b.close();
process.exitCode = totale ? 1 : 0;
