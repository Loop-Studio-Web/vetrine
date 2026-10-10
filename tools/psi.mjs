// PageSpeed Insights (Google) su una pagina GIÀ ONLINE: i numeri che vede il cliente, più affidabili di lh.mjs in locale.
// Uso: node psi.mjs <url> [mobile|desktop]    (senza strategia fa entrambe)
// La chiave sta nella variabile d'ambiente PSI_KEY (mai in un file della repo, che è pubblica).
// Senza chiave funziona lo stesso, ma la quota anonima è condivisa e spesso esaurita (errore 429).
const url = process.argv[2];
if (!url) throw new Error('uso: node psi.mjs <url> [mobile|desktop]');
const strategie = process.argv[3] ? [process.argv[3]] : ['mobile', 'desktop'];
const key = process.env.PSI_KEY;
if (!key) console.warn('PSI_KEY non impostata: uso la quota anonima (può dare 429).');

for (const strategy of strategie) {
	const q = new URLSearchParams({ url, strategy });
	for (const c of ['performance', 'accessibility', 'best-practices', 'seo']) q.append('category', c);
	if (key) q.set('key', key);
	const res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${q}`);
	const r = await res.json();
	if (r.error) {
		console.log(strategy, 'errore', r.error.code, r.error.message.slice(0, 120));
		continue;
	}
	const l = r.lighthouseResult;
	const a = l.audits;
	const punti = Object.values(l.categories).map((c) => `${c.id}:${Math.round(c.score * 100)}`).join(' ');
	const m = (id) => a[id].displayValue;
	console.log(strategy, punti);
	console.log(`  FCP ${m('first-contentful-paint')} · LCP ${m('largest-contentful-paint')} · TBT ${m('total-blocking-time')} · CLS ${m('cumulative-layout-shift')} · SI ${m('speed-index')}`);
	const lcp = a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet;
	if (lcp) console.log(`  elemento LCP: ${lcp.slice(0, 90)}`);
}
