// Percorso del Chrome di sistema (Playwright non scarica browser). Si può forzare con CHROME_PATH.
import fs from 'node:fs';
const candidati = [
	process.env.CHROME_PATH,
	'C:/Program Files/Google/Chrome/Application/chrome.exe',
	'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	'/usr/bin/google-chrome',
];
export const CHROME = candidati.find((p) => p && fs.existsSync(p));
if (!CHROME) throw new Error('Chrome non trovato: imposta CHROME_PATH');
