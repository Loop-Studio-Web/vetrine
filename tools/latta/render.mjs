// Render della latta di Chioma Saracena (solo per fare immagini: niente di questo va sul sito).
// Uso (da tools/latta): node render.mjs etichette | prova [f] [angolo] | giro [f] [n] [w] [h] | scatti
// HDRI di Poly Haven (CC0), non versionati: scaricare in tools/latta/ studio_small_03_1k.hdr e studio_small_08_1k.hdr da
// https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/<nome>_1k.hdr (rinominati senza _1k).
// Luce usata: SCENA="env=box&fondo=0.5&box=5&envrot=1.2" node render.mjs giro 3 36 600 1000 (poi ritaglio in webp, vedi CREDITI.md)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '../node_modules/playwright-core/index.mjs';
import { CHROME } from '../chrome.mjs';
import { FORMATI, PX_CM, giro } from './misure.js';

const QUI = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(QUI, '../..');
const OUT = path.join(QUI, 'out');
fs.mkdirSync(OUT, { recursive: true });
const MAPPA = {
	'/three/': path.join(REPO, 'node_modules/three/'),
	'/brand/': path.join(REPO, 'src/assets/chioma/brand/'),
};
const FONT = {
	'/font/rozha.woff2': path.join(REPO, 'node_modules/@fontsource/rozha-one/files/rozha-one-latin-400-normal.woff2'),
	'/font/funnel.woff2': path.join(REPO, 'node_modules/@fontsource-variable/funnel-sans/files/funnel-sans-latin-wght-normal.woff2'),
};
const TIPI = { '.html': 'text/html', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.hdr': 'application/octet-stream' };

const [, , cosa = 'prova', ...arg] = process.argv;
const b = await chromium.launch({ executablePath: CHROME, args: ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'] });
const ctx = await b.newContext({ viewport: { width: 1000, height: 1000 } });
await ctx.route('http://latta.local/**', (r) => {
	const u = new URL(r.request().url()).pathname;
	let file = FONT[u];
	if (!file) {
		const k = Object.keys(MAPPA).find((p) => u.startsWith(p));
		file = k ? path.join(MAPPA[k], u.slice(k.length)) : path.join(QUI, u);
	}
	if (!fs.existsSync(file)) return r.fulfill({ status: 404, body: 'no' });
	r.fulfill({ status: 200, body: fs.readFileSync(file), contentType: TIPI[path.extname(file)] || 'application/octet-stream' });
});
const p = await ctx.newPage();
p.on('console', (m) => m.type() === 'error' && console.log('console:', m.text()));
p.on('pageerror', (e) => console.log('errore:', e.message));

async function etichette() {
	for (const f of Object.keys(FORMATI)) {
		const { perimetro } = giro(f);
		const w = Math.round(perimetro * PX_CM);
		const h = Math.round(FORMATI[f].h * PX_CM);
		await p.setViewportSize({ width: w, height: h });
		await p.goto(`http://latta.local/etichetta.html?f=${f}`);
		await p.waitForSelector('body[data-pronto]');
		await p.screenshot({ path: path.join(OUT, `etichetta-${f}.png`), clip: { x: 0, y: 0, width: w, height: h } });
		console.log('etichetta', f, w, h);
	}
}

const EXTRA = process.env.SCENA || '';
async function scena(w, h) {
	await p.setViewportSize({ width: w, height: h });
	await p.goto(`http://latta.local/scena.html?w=${w}&h=${h}&${EXTRA}`);
	await p.waitForFunction(() => window.pronto, null, { timeout: 120000 });
}
const salva = (dataUrl, nome) => fs.writeFileSync(path.join(OUT, nome), Buffer.from(dataUrl.split(',')[1], 'base64'));
// inquadratura per formato: la latta riempie il fotogramma in altezza
const camera = (f) => ({ elev: 9, dist: FORMATI[f].h * 4.9, mira: FORMATI[f].h * 0.52, fov: 18 });

if (cosa === 'etichette') await etichette();
if (cosa === 'prova') {
	const [f = '3', ang = '-28'] = arg;
	await scena(700, 1100);
	await p.evaluate((f) => window.prepara([f]), f);
	salva(await p.evaluate((o) => window.posa(o), { angoli: [Number(ang)], ...camera(f) }), `prova-${f}-${ang}${process.env.NOME || ''}.png`);
	console.log('ok prova');
}
if (cosa === 'giro') {
	const [f = '3', n = '36', w = '560', h = '1000'] = arg;
	await scena(+w, +h);
	await p.evaluate((f) => window.prepara([f], false), f);
	const dir = path.join(OUT, `giro-${f}`);
	fs.mkdirSync(dir, { recursive: true });
	for (let i = 0; i < +n; i++) {
		const d = await p.evaluate((o) => window.posa(o), { angoli: [-(i * 360) / +n], ...camera(f) });
		fs.writeFileSync(path.join(dir, `${String(i).padStart(2, '0')}.png`), Buffer.from(d.split(',')[1], 'base64'));
	}
	console.log('ok giro', n);
}
if (cosa === 'scatti') {
	// le tre latte in fila (per la cassa) e ciascuna da sola di tre quarti
	await scena(1600, 1200);
	await p.evaluate(() => window.prepara(['1', '3', '5']));
	salva(await p.evaluate((o) => window.posa(o), { angoli: [-18, -24, -30], xs: [-17, 0, 19.5], zs: [4, 0, -3], elev: 10, dist: 175, mira: 14, fov: 20 }), 'fila.png');
	for (const f of ['1', '3', '5']) {
		await scena(900, 1300);
		await p.evaluate((f) => window.prepara([f]), f);
		salva(await p.evaluate((o) => window.posa(o), { angoli: [-30], ...camera(f) }), `scatto-${f}.png`);
		salva(await p.evaluate((o) => window.posa(o), { angoli: [0], ...camera(f) }), `fronte-${f}.png`);
		salva(await p.evaluate((o) => window.posa(o), { angoli: [180], ...camera(f) }), `retro-${f}.png`);
	}
	console.log('ok scatti');
}
await b.close();
