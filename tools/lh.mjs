// Lighthouse mobile e desktop su un'anteprima (`npm run build && npx astro preview --port 4400` nella radice).
// Uso: node lh.mjs <url>
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { CHROME } from './chrome.mjs';
const url = process.argv[2];
if (!url) throw new Error('uso: node lh.mjs <url>');
for (const m of ['mobile', 'desktop']) {
	const file = `lh-${m}.json`;
	const args = ['lighthouse', url, '--only-categories=performance,accessibility,best-practices,seo', '--chrome-flags=--headless=new', '--output=json', `--output-path=${file}`, '--quiet'];
	if (m === 'desktop') args.push('--preset=desktop');
	execFileSync('npx', args, { stdio: 'inherit', shell: true, env: { ...process.env, CHROME_PATH: CHROME } });
	const r = JSON.parse(fs.readFileSync(file, 'utf8'));
	console.log(m, Object.entries(r.categories).map(([k, v]) => `${k}:${Math.round(v.score * 100)}`).join(' '), 'CLS', r.audits['cumulative-layout-shift'].displayValue, 'LCP', r.audits['largest-contentful-paint'].displayValue);
	fs.unlinkSync(file);
}
