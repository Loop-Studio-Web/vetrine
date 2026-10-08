// Bozza del reel (45-55 s, 9:16): apertura con un video di via notturna, scena dell'hub, montaggio delle clip,
// interazioni, chiusura. Testi IT/EN generati come PNG trasparenti (font dell'hub) e sovrapposti con ffmpeg.
// Uso: node reel-bozza.mjs [it|en]    Cartelle: CLIP (clip mobili), PEX (video Pexels), OUT (bozze)
import { chromium } from 'playwright-core';
import { CHROME } from './chrome.mjs';
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const lang = process.argv[2] || 'it';
const BASE = 'C:/Users/utente/Videos/Assets/Loop_Studio';
const CLIP = `${BASE}/Clip_Mobile`, PEX = `${BASE}/Pexels`, OUT = `${BASE}/Reel`;
const W = resolve('..').replace(/\\/g, '/');
mkdirSync(OUT, { recursive: true });
const WORK = `${OUT}/_lavoro-${lang}`;
if (!process.env.KEEP) rmSync(WORK, { recursive: true, force: true });
mkdirSync(WORK, { recursive: true });

const T = {
	it: {
		t1: 'Apre<br><em>Loop Street.</em>', t2: 'Ogni mestiere.<br><em>Una vetrina.</em>', t3: 'Ogni dettaglio<br><em>è diverso.</em>',
		t4: 'Non sono immagini.<br><em>Funzionano.</em>', t5: 'Scegline una.<br><em>Parti da qui.</em>',
		macro: { ristorazione: 'Ristorazione', benessere: 'Benessere', tech: 'Tech', abitare: 'Abitare' }, url: 'vetrine.theloopstudio.org', t6: 'Ne vuoi una<br><em>così?</em>',
	},
	en: {
		t1: 'Loop Street<br><em>is opening.</em>', t2: 'Every trade.<br><em>One storefront.</em>', t3: 'Every detail<br><em>is different.</em>',
		t4: 'Not just pictures.<br><em>They work.</em>', t5: 'Pick one.<br><em>Start here.</em>',
		macro: { ristorazione: 'Dining', benessere: 'Wellness', tech: 'Tech', abitare: 'Home & craft' }, url: 'vetrine.theloopstudio.org', t6: 'Want one<br><em>like it?</em>',
	},
}[lang];

const concepts = [
	['trattoria', 'ristorazione', 'Trattoria del Borgo'], ['ristopub', 'ristorazione', 'Luppolo & Watt'], ['grande-ristorante', 'ristorazione', 'Ossidiana'],
	['barbiere', 'benessere', 'Bottega Tre Rasoi'], ['estetica', 'benessere', 'Atelier Lumen'], ['longevity', 'benessere', 'Aeterna'],
	['riparazioni', 'tech', 'FIXLAB'], ['pc-gaming', 'tech', 'Hot Swap'], ['studio', 'tech', 'Ordito'],
	['idraulico', 'abitare', 'Sifone'], ['ristrutturazioni', 'abitare', 'Obra Fina'],
];
const menus = ['barbiere', 'ristopub', 'grande-ristorante', 'idraulico', 'ristrutturazioni', 'studio'];

const font = (n) => `file:///${W}/node_modules/@fontsource-variable/${n}/files`;
const logo = `data:image/svg+xml;base64,${readFileSync(`${W}/src/assets/hub/loop-logo-on-dark.svg`).toString('base64')}`;
const css = `@font-face{font-family:B;src:url(${font('bricolage-grotesque')}/bricolage-grotesque-latin-wght-normal.woff2);font-weight:200 800}
@font-face{font-family:H;src:url(${font('hanken-grotesk')}/hanken-grotesk-latin-wght-normal.woff2);font-weight:100 900}
html,body{margin:0;width:1080px;height:1920px;background:transparent;font-family:B,sans-serif;color:#fff;overflow:hidden}
.c{position:absolute;left:0;right:0;text-align:center;padding:0 70px;box-sizing:border-box}
h1{margin:0;font-weight:800;line-height:.98;letter-spacing:-.02em;text-shadow:0 4px 40px rgba(0,0,0,.65),0 2px 6px rgba(0,0,0,.5)}
em{font-style:normal;color:#fe3b30}`;

const html = {
	t1: `<div class=c style="top:640px"><h1 style="font-size:150px">${T.t1}</h1></div>`,
	t2: `<div class=c style="top:720px"><div style="display:inline-block;background:rgba(8,6,6,.78);padding:46px 60px 52px;border-radius:6px;border-left:10px solid #fe3b30"><h1 style="font-size:112px;text-align:left">${T.t2}</h1></div></div>`,
	t3: `<div class=c style="top:300px"><h1 style="font-size:104px">${T.t3}</h1></div>`,
	t4: `<div class=c style="top:300px"><h1 style="font-size:104px">${T.t4}</h1></div>`,
	t5: `<div class=c style="top:420px"><img src="${logo}" style="width:360px;display:block;margin:0 auto 70px"><h1 style="font-size:128px">${T.t5}</h1>
	<div style="margin:70px auto 0;display:inline-block;font:700 46px H,sans-serif;letter-spacing:.02em;border:3px solid #fe3b30;padding:22px 40px;border-radius:6px;background:rgba(0,0,0,.45)">${T.url}</div></div>`,
};
const ico = (f) => `data:image/png;base64,${readFileSync(`C:/Users/utente/Videos/Assets/Loop_Studio/Social/${f}`).toString('base64')}`;
html.t6 = `<div class=c style="top:380px"><h1 style="font-size:132px">${T.t6}</h1>
	<div style="margin:80px auto 0;display:inline-block;font:700 62px H,sans-serif;letter-spacing:.02em;border:3px solid #fe3b30;padding:26px 48px;border-radius:6px;background:rgba(0,0,0,.45)">theloopstudio.org</div>
	<div style="display:flex;justify-content:center;gap:10px;margin-top:70px">
	<img src="${ico('instagram-acquerello.png')}" style="width:430px;height:auto;filter:drop-shadow(0 6px 24px rgba(0,0,0,.5))"><img src="${ico('facebook-acquerello.png')}" style="width:430px;height:auto;filter:drop-shadow(0 6px 24px rgba(0,0,0,.5))"></div>
	<div style="font:700 56px H,sans-serif;margin-top:30px;text-shadow:0 3px 20px rgba(0,0,0,.7)">@loopstudioweb</div></div>`;
for (const [slug, macro, nome] of concepts) {
	html['c-' + slug] = `<div class=c style="top:1260px"><div style="display:inline-block;text-align:left;background:rgba(10,8,8,.72);padding:26px 40px 28px;border-left:8px solid #fe3b30;border-radius:4px">
	<div style="font:700 34px H,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#fe3b30">${T.macro[macro]}</div><div style="font-weight:800;font-size:76px;letter-spacing:-.01em;margin-top:6px">${nome}</div></div></div>`;
}

const b = await chromium.launch({ executablePath: CHROME });
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
for (const [k, v] of Object.entries(html)) {
	writeFileSync(`${WORK}/${k}.html`, `<!doctype html><meta charset=utf-8><style>${css}</style>${v}`);
	await pg.goto(`file:///${WORK}/${k}.html`);
	await pg.evaluate(() => document.fonts.ready);
	await pg.waitForTimeout(150);
	await pg.screenshot({ path: `${WORK}/${k}.png`, omitBackground: true });
}
await b.close();

const ff = (...a) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...a]);
const ENC = ['-c:v', 'libx264', '-crf', '15', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '30', '-an'];
const vf = 'fps=30,scale=1080:1920,setsar=1';

// un segmento: ritaglio del video (ss, t, speed), filtri facoltativi, grafica di testo con dissolvenze
const seg = (out, src, { ss = 0, t, speed = 1, pre = '', png, from = 0.4, fade = 0.35 }) => {
	const d = t / speed;
	const args = ['-ss', String(ss), '-t', String(t), '-i', src];
	let f = `[0:v]${vf},setpts=(PTS-STARTPTS)/${speed}${pre ? ',' + pre : ''},fps=30[v]`;
	if (png) {
		args.push('-loop', '1', '-framerate', '30', '-t', String(d), '-i', `${WORK}/${png}.png`);
		f += `;[1:v]format=rgba,fade=t=in:st=${from}:d=${fade}:alpha=1,fade=t=out:st=${Math.max(from + fade, d - fade - 0.05)}:d=${fade}:alpha=1[o];[v][o]overlay=0:0:format=auto[v]`;
	}
	ff(...args, '-filter_complex', f, '-map', '[v]', '-t', String(d), ...ENC, `${WORK}/${out}.mp4`);
	return d;
};

// Tempo della musica (126 BPM misurati sul brano): ogni segmento dura un numero intero di battiti, arrotondato ai fotogrammi
// con l'errore riportato in avanti, così i tagli restano sul beat per tutto il video.
const BPM = Number(process.env.BPM || 126), B = 60 / BPM;
const AB_BEATS = 28;
let cum = AB_BEATS, prevF = Math.round(cum * B * 30);
const dur = (n) => { cum += n; const f = Math.round(cum * B * 30); const d = (f - prevF) / 30; prevF = f; return d; };

// 1) apertura: via notturna con spinta lenta
const d1 = seg('s1', `${PEX}/15961928-hd_1080_1920_50fps.mp4`, {
	ss: 1, t: 7, pre: "scale=1188:2112,crop=1080:1920:x='(in_w-1080)/2+t*7':y='(in_h-1920)/2'", png: 't1', from: 0.7, fade: 0.5,
});
// 2) la via dell'hub, in dissolvenza dalla ripresa vera
seg('s2', `${CLIP}/scroll-hub.mp4`, { ss: 1.1, t: Math.round(AB_BEATS * B * 30) / 30 - d1 + 0.9, png: 't2', from: 1.2, fade: 0.5 });
const X = 0.9;
ff('-i', `${WORK}/s1.mp4`, '-i', `${WORK}/s2.mp4`, '-filter_complex', `[0:v][1:v]xfade=transition=fade:duration=${X}:offset=${d1 - X}[v]`, '-map', '[v]', ...ENC, `${WORK}/ab.mp4`);
const parts = ['ab'];

// 3) i concept leggibili: fermi con lento zoom (2 battiti) e, su Ossidiana e Aeterna, uno scroll lento x2 (4 battiti), col nome del settore
const lenti = new Set(['grande-ristorante', 'longevity']);
const ordine = ['trattoria', 'ristopub', 'grande-ristorante', 'barbiere', 'estetica', 'longevity', 'riparazioni', 'pc-gaming', 'studio', 'idraulico', 'ristrutturazioni'];
for (const slug of ordine) {
	const name = 'c-' + slug;
	if (lenti.has(slug)) {
		seg(name, `${CLIP}/scroll-${slug}.mp4`, { ss: 1.2, t: dur(4) * 2, speed: 2, png: name, from: 0.1, fade: 0.15 });
	} else {
		const STILL = dur(2);
		ff('-ss', '1.5', '-i', `${CLIP}/scroll-${slug}.mp4`, '-frames:v', '1', `${WORK}/${name}-f.png`);
		ff('-loop', '1', '-framerate', '30', '-t', String(STILL), '-i', `${WORK}/${name}-f.png`, '-loop', '1', '-framerate', '30', '-t', String(STILL), '-i', `${WORK}/${name}.png`,
			'-filter_complex', `[0:v]scale=w='1080*(1+0.07*t/${STILL})':h=-2:eval=frame,crop=1080:1920,setsar=1,fps=30[v];[1:v]format=rgba[o];[v][o]overlay=0:0:format=auto[v]`,
			'-map', '[v]', '-t', String(STILL), ...ENC, `${WORK}/${name}.mp4`);
	}
	parts.push(name);
}
// 4) sei menù che si aprono
menus.forEach((m, i) => {
	seg(`m${i}`, `${CLIP}/menu-${m}.mp4`, { ss: 0.5, t: dur(3), png: i === 0 ? 't3' : null, from: 0.1, fade: 0.3 });
	parts.push(`m${i}`);
});
// 5) tre interazioni
seg('i0', `${CLIP}/azione-idraulico-valvola.mp4`, { ss: 2.5, t: dur(9), png: 't4', from: 0.2, fade: 0.35 });
seg('i1', `${CLIP}/azione-riparazioni-pezzo.mp4`, { ss: 0.9, t: dur(7) * 1.2, speed: 1.2 });
seg('i2', `${CLIP}/azione-ristrutturazioni-estancia.mp4`, { ss: 3.3, t: dur(8) * 1.6, speed: 1.6 });
parts.push('i0', 'i1', 'i2');
// 6) chiusura sul vicolo, schiarito e sfocato, con logo e indirizzo
const finePre = 'eq=brightness=0.07:gamma=1.45:saturation=1.1,gblur=sigma=6';
seg('fin', `${PEX}/18622210-hd_1080_1920_30fps.mp4`, { ss: 3, t: dur(12), pre: finePre, png: 't5', from: 0.5, fade: 0.5 });
seg('fin2', `${PEX}/18622210-hd_1080_1920_30fps.mp4`, { ss: 8.5, t: dur(8), pre: finePre, png: 't6', from: 0.3, fade: 0.5 });
parts.push('fin', 'fin2');

const inputs = parts.flatMap((p) => ['-i', `${WORK}/${p}.mp4`]);
const chain = parts.map((_, i) => `[${i}:v]`).join('');
ff(...inputs, '-filter_complex', `${chain}concat=n=${parts.length}:v=1:a=0[v]`, '-map', '[v]', '-r', '30', '-c:v', 'libx264', '-crf', '15', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', `${OUT}/bozza-${lang}.mp4`);
// 7) musica: il brano originale, senza filtri né normalizzazione (che distorcevano i bassi), solo dissolvenza in entrata e uscita
const MUSICA = process.env.MUSICA || `${OUT}/monume-house-519225.mp3`;
if (MUSICA !== '0') {
	const tot = prevF / 30;
	ff('-i', `${OUT}/bozza-${lang}.mp4`, '-ss', String(process.env.SS || 0), '-i', MUSICA, '-filter_complex',
		`[1:a]atrim=duration=${tot + 1},asetpts=PTS-STARTPTS,atrim=duration=${tot},afade=t=in:d=0.6,afade=t=out:st=${tot - 6 * B}:d=${6 * B}[a]`,
		'-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', `${OUT}/bozza-${lang}-musica.mp4`);
	console.log('ok', `${OUT}/bozza-${lang}-musica.mp4`, tot.toFixed(2), 's');
}
if (!process.env.KEEP) rmSync(WORK, { recursive: true, force: true });
console.log('ok', `${OUT}/bozza-${lang}.mp4`);
