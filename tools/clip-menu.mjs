// Clip del menù mobile in tempo reale (CDP screencast a piena risoluzione) → MP4 1080x1920 a 60 fps.
// Uso: node clip-menu.mjs <macro/variante> [attesa-ms=1500] [cartella-uscita=clips]
import { chromium } from 'playwright-core';
import { CHROME } from './chrome.mjs';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const [, , page, wait = '1500', outDir = 'C:/Users/utente/Videos/Assets/Loop_Studio/Clip_Mobile'] = process.argv;
const slug = page.split('/')[1];
const tmp = `${outDir}/_${slug}`; rmSync(tmp, { recursive: true, force: true }); mkdirSync(tmp, { recursive: true });
const b = await chromium.launch({ executablePath: CHROME });
const ctx = await b.newContext({ viewport: { width: 390, height: 693 }, deviceScaleFactor: +(process.env.DPR || 1080 / 390), hasTouch: true, isMobile: true });
const p = await ctx.newPage();
await p.goto(`http://localhost:4401/${page}/`, { waitUntil: 'networkidle' });
await p.waitForTimeout(+wait);
const cdp = await ctx.newCDPSession(p);
const fr = []; let t0 = 0, t1 = 0;
cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
	const i = fr.length; writeFileSync(`${tmp}/f${String(i).padStart(5, '0')}.jpg`, Buffer.from(data, 'base64'));
	fr.push(metadata.timestamp); t1 = metadata.timestamp; cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
});
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 95, maxWidth: 1080, maxHeight: 1920, everyNthFrame: 1 });
await p.waitForTimeout(700);
const btn = p.locator('button[aria-expanded]').first();
const bb = await btn.boundingBox();
await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2);
await p.waitForTimeout(3000);
const tEnd = fr[fr.length - 1] + 0; await cdp.send('Page.stopScreencast');
await b.close();
// elenco con durata reale di ogni fotogramma → ffmpeg concat, poi 60 fps costanti
let list = '';
fr.forEach((t, i) => { const d = i < fr.length - 1 ? fr[i + 1] - t : Math.max(0.05, fr[0] + 4.2 - t); list += `file 'f${String(i).padStart(5, '0')}.jpg'\nduration ${d.toFixed(5)}\n`; });
list += `file 'f${String(fr.length - 1).padStart(5, '0')}.jpg'\n`;
writeFileSync(`${tmp}/list.txt`, list);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', `${tmp}/list.txt`, '-t', '4.2', '-vf', 'fps=60,scale=1080:1920', '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${outDir}/menu-${slug}.mp4`]);
rmSync(tmp, { recursive: true, force: true });
const dur = fr[fr.length - 1] - fr[0];
console.log('ok', slug, fr.length, 'fotogrammi in', dur.toFixed(1), 's =', (fr.length / dur).toFixed(0), 'fps reali');
