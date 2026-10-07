// Dati del negozio Hot Swap. Marchi, modelli, prezzi e prestazioni sono di fantasia (nessun marchio reale).
// Unica fonte per catalogo, builder e offerte: se cambia un pezzo cambia ovunque.

export type Categoria = 'pc' | 'notebook' | 'componenti' | 'periferiche' | 'setup';

export const categorie: { id: Categoria; nome: string; nota: string }[] = [
	{ id: 'pc', nome: 'Gaming PCs', nota: 'Built, tested, ready to plug in' },
	{ id: 'notebook', nome: 'Notebooks', nota: 'For play, work and the commute' },
	{ id: 'componenti', nome: 'Components', nota: 'CPUs, GPUs, memory, storage' },
	{ id: 'periferiche', nome: 'Monitors & Peripherals', nota: 'Screens, keyboards, mice, audio' },
	{ id: 'setup', nome: 'Gaming Setups', nota: 'The whole desk, sorted' },
];

export type Forma = 'tower' | 'laptop' | 'gpu' | 'cpu' | 'ram' | 'ssd' | 'psu' | 'board' | 'monitor' | 'keyboard' | 'mouse' | 'headset' | 'desk';

export type Prodotto = {
	id: string;
	nome: string;
	cat: Categoria;
	forma: Forma;
	colore: 'arancio' | 'acqua' | 'grafite' | 'avorio';
	prezzo: number;
	vecchio?: number; // prezzo prima dell'offerta
	punti: string[]; // 3 righe di scheda
	specs: [string, string][]; // per anteprima e confronto
	pezzi: number; // pezzi a magazzino (di fantasia; sotto 5 = "ultimi pezzi")
	nuovo?: boolean;
	potenza: number; // 1-10, per l'ordinamento "più potenti"
};

export const prodotti: Prodotto[] = [
	{
		id: 'ember-x',
		nome: 'Ember X',
		cat: 'pc',
		forma: 'tower',
		colore: 'arancio',
		prezzo: 1899,
		vecchio: 2099,
		punti: ['8-core Kestrel 7 CPU', 'Nimbus RX 760 16 GB', '32 GB DDR5 · 2 TB NVMe'],
		specs: [['CPU', 'Kestrel 7 7600 · 8 cores'], ['GPU', 'Nimbus RX 760 · 16 GB'], ['Memory', '32 GB DDR5-6000'], ['Storage', '2 TB NVMe Gen4'], ['Warranty', '3 years, in-store']],
		pezzi: 3,
		potenza: 8,
	},
	{
		id: 'ember-s',
		nome: 'Ember S',
		cat: 'pc',
		forma: 'tower',
		colore: 'acqua',
		prezzo: 1199,
		punti: ['6-core Kestrel 5 CPU', 'Nimbus RX 740 8 GB', '16 GB DDR5 · 1 TB NVMe'],
		specs: [['CPU', 'Kestrel 5 7500 · 6 cores'], ['GPU', 'Nimbus RX 740 · 8 GB'], ['Memory', '16 GB DDR5-5600'], ['Storage', '1 TB NVMe Gen4'], ['Warranty', '3 years, in-store']],
		pezzi: 9,
		potenza: 5,
	},
	{
		id: 'ember-pro',
		nome: 'Ember Pro Creator',
		cat: 'pc',
		forma: 'tower',
		colore: 'grafite',
		prezzo: 2799,
		punti: ['12-core Kestrel 9 CPU', 'Nimbus RX 790 24 GB', '64 GB DDR5 · 4 TB NVMe'],
		specs: [['CPU', 'Kestrel 9 7900 · 12 cores'], ['GPU', 'Nimbus RX 790 · 24 GB'], ['Memory', '64 GB DDR5-6000'], ['Storage', '4 TB NVMe Gen4'], ['Warranty', '3 years, in-store']],
		pezzi: 2,
		nuovo: true,
		potenza: 10,
	},
	{
		id: 'brick-mini',
		nome: 'Brick Mini',
		cat: 'pc',
		forma: 'tower',
		colore: 'avorio',
		prezzo: 899,
		punti: ['Small form factor, 4 L', 'Integrated Orbit graphics', '16 GB DDR4 · 512 GB NVMe'],
		specs: [['CPU', 'Orbit Z4 · 4 cores'], ['GPU', 'Integrated'], ['Memory', '16 GB DDR4'], ['Storage', '512 GB NVMe'], ['Warranty', '2 years, in-store']],
		pezzi: 12,
		potenza: 3,
	},
	{
		id: 'slate-15',
		nome: 'Slate 15 Play',
		cat: 'notebook',
		forma: 'laptop',
		colore: 'acqua',
		prezzo: 1399,
		vecchio: 1549,
		punti: ['15,6″ 165 Hz', 'Nimbus RX 740M', '16 GB · 1 TB NVMe'],
		specs: [['Screen', '15,6″ · 1080p · 165 Hz'], ['CPU', 'Kestrel 7 7600H'], ['GPU', 'Nimbus RX 740M'], ['Battery', 'up to 7 h'], ['Weight', '2,2 kg']],
		pezzi: 4,
		potenza: 6,
	},
	{
		id: 'slate-14',
		nome: 'Slate 14 Air',
		cat: 'notebook',
		forma: 'laptop',
		colore: 'avorio',
		prezzo: 999,
		punti: ['14″ OLED', 'Orbit integrated', '16 GB · 512 GB NVMe'],
		specs: [['Screen', '14″ · OLED · 90 Hz'], ['CPU', 'Orbit Z6'], ['GPU', 'Integrated'], ['Battery', 'up to 14 h'], ['Weight', '1,2 kg']],
		pezzi: 10,
		nuovo: true,
		potenza: 3,
	},
	{
		id: 'slate-17',
		nome: 'Slate 17 Studio',
		cat: 'notebook',
		forma: 'laptop',
		colore: 'grafite',
		prezzo: 2299,
		punti: ['17″ 240 Hz mini-LED', 'Nimbus RX 780M', '32 GB · 2 TB NVMe'],
		specs: [['Screen', '17″ · 1440p · 240 Hz'], ['CPU', 'Kestrel 9 7900H'], ['GPU', 'Nimbus RX 780M'], ['Battery', 'up to 6 h'], ['Weight', '2,8 kg']],
		pezzi: 3,
		potenza: 9,
	},
	{
		id: 'rx-790',
		nome: 'Nimbus RX 790',
		cat: 'componenti',
		forma: 'gpu',
		colore: 'arancio',
		prezzo: 899,
		punti: ['24 GB of memory', 'Triple fan, 31 cm', 'Recommended: 750 W PSU'],
		specs: [['Memory', '24 GB GDDR6'], ['Length', '310 mm'], ['Board power', '320 W'], ['Outputs', '3× DP, 1× HDMI']],
		pezzi: 2,
		potenza: 10,
	},
	{
		id: 'rx-760',
		nome: 'Nimbus RX 760',
		cat: 'componenti',
		forma: 'gpu',
		colore: 'acqua',
		prezzo: 489,
		vecchio: 539,
		punti: ['16 GB of memory', 'Double fan, 27 cm', 'Recommended: 650 W PSU'],
		specs: [['Memory', '16 GB GDDR6'], ['Length', '270 mm'], ['Board power', '220 W'], ['Outputs', '3× DP, 1× HDMI']],
		pezzi: 6,
		potenza: 8,
	},
	{
		id: 'k7-7600',
		nome: 'Kestrel 7 7600',
		cat: 'componenti',
		forma: 'cpu',
		colore: 'grafite',
		prezzo: 279,
		punti: ['8 cores, 16 threads', 'Socket V5', 'Cooler included'],
		specs: [['Cores', '8 / 16 threads'], ['Boost', '5,1 GHz'], ['Socket', 'V5'], ['Power', '65 W']],
		pezzi: 14,
		potenza: 7,
	},
	{
		id: 'ddr5-32',
		nome: 'Tuna DDR5 32 GB',
		cat: 'componenti',
		forma: 'ram',
		colore: 'arancio',
		prezzo: 119,
		punti: ['2×16 GB, 6000 MT/s', 'EXPO / XMP profile', 'Lifetime warranty'],
		specs: [['Capacity', '2 × 16 GB'], ['Speed', 'DDR5-6000'], ['Latency', 'CL30'], ['Warranty', 'Lifetime']],
		pezzi: 20,
		potenza: 5,
	},
	{
		id: 'nvme-2tb',
		nome: 'Pebble NVMe 2 TB',
		cat: 'componenti',
		forma: 'ssd',
		colore: 'acqua',
		prezzo: 139,
		vecchio: 169,
		punti: ['Reads at 7,000 MB/s', 'Gen4 x4', 'Cooler included'],
		specs: [['Capacity', '2 TB'], ['Read', '7.000 MB/s'], ['Write', '6.200 MB/s'], ['Interface', 'PCIe Gen4 x4']],
		pezzi: 4,
		potenza: 5,
	},
	{
		id: 'psu-750',
		nome: 'Anvil 750 Gold',
		cat: 'componenti',
		forma: 'psu',
		colore: 'grafite',
		prezzo: 109,
		punti: ['750 W, 80+ Gold', 'Fully modular', '10-year warranty'],
		specs: [['Power', '750 W'], ['Efficiency', '80+ Gold'], ['Cables', 'Fully modular'], ['Warranty', '10 years']],
		pezzi: 11,
		potenza: 4,
	},
	{
		id: 'mon-27',
		nome: 'Prism 27 QHD',
		cat: 'periferiche',
		forma: 'monitor',
		colore: 'acqua',
		prezzo: 329,
		punti: ['27″ 1440p · 180 Hz', 'IPS, 1 ms', 'FreeSync-ready'],
		specs: [['Size', '27″'], ['Resolution', '2560 × 1440'], ['Refresh', '180 Hz'], ['Panel', 'IPS · 1 ms']],
		pezzi: 8,
		potenza: 5,
	},
	{
		id: 'mon-34',
		nome: 'Prism 34 Ultrawide',
		cat: 'periferiche',
		forma: 'monitor',
		colore: 'grafite',
		prezzo: 599,
		vecchio: 679,
		punti: ['34″ curved 3440×1440', '165 Hz', 'HDR 400'],
		specs: [['Size', '34″ curved'], ['Resolution', '3440 × 1440'], ['Refresh', '165 Hz'], ['Panel', 'VA · HDR 400']],
		pezzi: 3,
		potenza: 7,
	},
	{
		id: 'kb-colorway',
		nome: 'Clack 75 Colorway',
		cat: 'periferiche',
		forma: 'keyboard',
		colore: 'arancio',
		prezzo: 149,
		punti: ['75%, hot-swap', 'Lubed linear switches', 'Aluminium case'],
		specs: [['Layout', '75% · 82 keys'], ['Switches', 'Linear, hot-swap'], ['Case', 'Aluminium'], ['Connection', 'USB-C / 2,4 GHz']],
		pezzi: 5,
		nuovo: true,
		potenza: 4,
	},
	{
		id: 'mouse-air',
		nome: 'Glide Air 58 g',
		cat: 'periferiche',
		forma: 'mouse',
		colore: 'avorio',
		prezzo: 79,
		punti: ['58 g, honeycomb shell', 'Sensore 26.000 DPI', 'Wireless 2,4 GHz'],
		specs: [['Weight', '58 g'], ['Sensor', '26.000 DPI'], ['Battery', '90 h'], ['Connection', '2,4 GHz / BT']],
		pezzi: 16,
		potenza: 3,
	},
	{
		id: 'cuffie-roomy',
		nome: 'Roomy Headset',
		cat: 'periferiche',
		forma: 'headset',
		colore: 'acqua',
		prezzo: 119,
		punti: ['Spatial audio', 'Detachable mic', '40 h wireless'],
		specs: [['Drivers', '50 mm'], ['Mic', 'Detachable, cardioid'], ['Battery', '40 h'], ['Connection', '2,4 GHz / BT']],
		pezzi: 7,
		potenza: 3,
	},
	{
		id: 'setup-starter',
		nome: 'Setup Starter',
		cat: 'setup',
		forma: 'desk',
		colore: 'acqua',
		prezzo: 1649,
		punti: ['Ember S + Prism 27', 'Keyboard, mouse and headset', 'Assembled and configured'],
		specs: [['PC', 'Ember S'], ['Monitor', 'Prism 27 QHD'], ['Peripherals', 'Keyboard, mouse, headset'], ['Setup', 'Done in-store']],
		pezzi: 5,
		potenza: 6,
	},
	{
		id: 'setup-streamer',
		nome: 'Setup Streamer',
		cat: 'setup',
		forma: 'desk',
		colore: 'arancio',
		prezzo: 2999,
		vecchio: 3249,
		punti: ['Ember X + Prism 34', 'Mic, arm and lights', 'Capture card included'],
		specs: [['PC', 'Ember X'], ['Monitor', 'Prism 34 Ultrawide'], ['Extras', 'Mic, arm, lights, capture'], ['Setup', 'Done in-store']],
		pezzi: 2,
		potenza: 9,
	},
];

export const ordina = {
	pop: { nome: 'Featured', f: (a: Prodotto, b: Prodotto) => prodotti.indexOf(a) - prodotti.indexOf(b) },
	basso: { nome: 'Price: low to high', f: (a: Prodotto, b: Prodotto) => a.prezzo - b.prezzo },
	alto: { nome: 'Price: high to low', f: (a: Prodotto, b: Prodotto) => b.prezzo - a.prezzo },
	forza: { nome: 'Most powerful', f: (a: Prodotto, b: Prodotto) => b.potenza - a.potenza },
} as const;

// ---------- Builder ----------
export type Slot = 'case' | 'cpu' | 'board' | 'ram' | 'gpu' | 'storage' | 'psu';

export const slot: { id: Slot; nome: string; nota: string }[] = [
	{ id: 'case', nome: 'Case', nota: 'Sets the board size and the longest card' },
	{ id: 'board', nome: 'Motherboard', nota: 'Decides the socket and the memory type' },
	{ id: 'cpu', nome: 'CPU', nota: 'The socket must match the board' },
	{ id: 'ram', nome: 'Memory', nota: 'DDR4 or DDR5, as the board says' },
	{ id: 'gpu', nome: 'Graphics card', nota: 'Must fit the case, and needs power' },
	{ id: 'storage', nome: 'Storage', nota: 'Where your games live' },
	{ id: 'psu', nome: 'Power supply', nota: 'Needs headroom for CPU and GPU' },
];

export type Pezzo = {
	id: string;
	slot: Slot;
	nome: string;
	prezzo: number;
	colore: 'arancio' | 'acqua' | 'grafite' | 'avorio';
	// attributi usati dalle regole
	socket?: 'V5' | 'R2';
	ram?: 'DDR4' | 'DDR5';
	forma?: 'ATX' | 'mATX' | 'ITX';
	maxGpu?: number; // mm
	len?: number; // mm
	watt?: number; // consumo (cpu, gpu) o capacità (psu)
	cpuScore?: number; // 1-100
	gpuScore?: number; // 1-100
	capienza?: number; // GB
	dettaglio: string;
};

export const pezzi: Pezzo[] = [
	// case
	{ id: 'case-loft', slot: 'case', nome: 'Loft ATX', prezzo: 109, colore: 'avorio', forma: 'ATX', maxGpu: 350, dettaglio: 'Mid tower · mesh front · up to 350 mm card' },
	{ id: 'case-cube', slot: 'case', nome: 'Cube mATX', prezzo: 89, colore: 'acqua', forma: 'mATX', maxGpu: 300, dettaglio: 'Compact · glass side · up to 300 mm card' },
	{ id: 'case-pico', slot: 'case', nome: 'Pico ITX', prezzo: 129, colore: 'arancio', forma: 'ITX', maxGpu: 260, dettaglio: 'Tiny · 14 L · up to 260 mm card' },
	// cpu
	{ id: 'cpu-k5', slot: 'cpu', nome: 'Kestrel 5 7500', prezzo: 189, colore: 'grafite', socket: 'V5', watt: 65, cpuScore: 58, dettaglio: '6 cores · socket V5 · 65 W' },
	{ id: 'cpu-k7', slot: 'cpu', nome: 'Kestrel 7 7600', prezzo: 279, colore: 'grafite', socket: 'V5', watt: 65, cpuScore: 74, dettaglio: '8 cores · socket V5 · 65 W' },
	{ id: 'cpu-k9', slot: 'cpu', nome: 'Kestrel 9 7900', prezzo: 449, colore: 'grafite', socket: 'V5', watt: 105, cpuScore: 92, dettaglio: '12 cores · socket V5 · 105 W' },
	{ id: 'cpu-o5', slot: 'cpu', nome: 'Orbit 5 R5', prezzo: 159, colore: 'avorio', socket: 'R2', watt: 65, cpuScore: 52, dettaglio: '6 cores · socket R2 · 65 W' },
	{ id: 'cpu-o7', slot: 'cpu', nome: 'Orbit 7 R7', prezzo: 239, colore: 'avorio', socket: 'R2', watt: 125, cpuScore: 70, dettaglio: '8 cores · socket R2 · 125 W' },
	// board
	{ id: 'mb-a', slot: 'board', nome: 'Atlas V5 ATX', prezzo: 219, colore: 'grafite', socket: 'V5', ram: 'DDR5', forma: 'ATX', dettaglio: 'Socket V5 · DDR5 · ATX' },
	{ id: 'mb-b', slot: 'board', nome: 'Bolt V5 mATX', prezzo: 159, colore: 'acqua', socket: 'V5', ram: 'DDR5', forma: 'mATX', dettaglio: 'Socket V5 · DDR5 · mATX' },
	{ id: 'mb-c', slot: 'board', nome: 'Chip V5 ITX', prezzo: 189, colore: 'arancio', socket: 'V5', ram: 'DDR5', forma: 'ITX', dettaglio: 'Socket V5 · DDR5 · ITX' },
	{ id: 'mb-d', slot: 'board', nome: 'Delta R2 ATX', prezzo: 139, colore: 'avorio', socket: 'R2', ram: 'DDR4', forma: 'ATX', dettaglio: 'Socket R2 · DDR4 · ATX' },
	{ id: 'mb-e', slot: 'board', nome: 'Echo R2 mATX', prezzo: 109, colore: 'avorio', socket: 'R2', ram: 'DDR4', forma: 'mATX', dettaglio: 'Socket R2 · DDR4 · mATX' },
	// ram
	{ id: 'ram-d4-16', slot: 'ram', nome: 'Tuna DDR4 16 GB', prezzo: 49, colore: 'acqua', ram: 'DDR4', capienza: 16, dettaglio: '2×8 GB · DDR4-3600' },
	{ id: 'ram-d5-16', slot: 'ram', nome: 'Tuna DDR5 16 GB', prezzo: 69, colore: 'arancio', ram: 'DDR5', capienza: 16, dettaglio: '2×8 GB · DDR5-5600' },
	{ id: 'ram-d5-32', slot: 'ram', nome: 'Tuna DDR5 32 GB', prezzo: 119, colore: 'arancio', ram: 'DDR5', capienza: 32, dettaglio: '2×16 GB · DDR5-6000' },
	{ id: 'ram-d5-64', slot: 'ram', nome: 'Tuna DDR5 64 GB', prezzo: 229, colore: 'arancio', ram: 'DDR5', capienza: 64, dettaglio: '2×32 GB · DDR5-6000' },
	// gpu
	{ id: 'gpu-740', slot: 'gpu', nome: 'Nimbus RX 740', prezzo: 299, colore: 'acqua', len: 240, watt: 160, gpuScore: 46, dettaglio: '8 GB · 24 cm · 160 W' },
	{ id: 'gpu-760', slot: 'gpu', nome: 'Nimbus RX 760', prezzo: 489, colore: 'acqua', len: 270, watt: 220, gpuScore: 68, dettaglio: '16 GB · 27 cm · 220 W' },
	{ id: 'gpu-780', slot: 'gpu', nome: 'Nimbus RX 780', prezzo: 699, colore: 'arancio', len: 300, watt: 270, gpuScore: 82, dettaglio: '20 GB · 30 cm · 270 W' },
	{ id: 'gpu-790', slot: 'gpu', nome: 'Nimbus RX 790', prezzo: 899, colore: 'arancio', len: 335, watt: 320, gpuScore: 96, dettaglio: '24 GB · 33,5 cm · 320 W' },
	// storage
	{ id: 'sto-1', slot: 'storage', nome: 'Pebble NVMe 1 TB', prezzo: 79, colore: 'acqua', capienza: 1000, dettaglio: '1 TB · 7.000 MB/s' },
	{ id: 'sto-2', slot: 'storage', nome: 'Pebble NVMe 2 TB', prezzo: 139, colore: 'acqua', capienza: 2000, dettaglio: '2 TB · 7.000 MB/s' },
	{ id: 'sto-4', slot: 'storage', nome: 'Pebble NVMe 4 TB', prezzo: 289, colore: 'acqua', capienza: 4000, dettaglio: '4 TB · 6.600 MB/s' },
	// psu
	{ id: 'psu-550', slot: 'psu', nome: 'Anvil 550 Bronze', prezzo: 69, colore: 'grafite', watt: 550, dettaglio: '550 W · 80+ Bronze' },
	{ id: 'psu-650', slot: 'psu', nome: 'Anvil 650 Gold', prezzo: 89, colore: 'grafite', watt: 650, dettaglio: '650 W · 80+ Gold' },
	{ id: 'psu-750', slot: 'psu', nome: 'Anvil 750 Gold', prezzo: 109, colore: 'grafite', watt: 750, dettaglio: '750 W · 80+ Gold' },
	{ id: 'psu-1000', slot: 'psu', nome: 'Anvil 1000 Platinum', prezzo: 189, colore: 'grafite', watt: 1000, dettaglio: '1000 W · 80+ Platinum' },
];

export const assemblaggio = 59; // prezzo del montaggio, test e installazione del sistema

// Giochi di fantasia per la stima degli FPS (nessun titolo reale)
export const giochi: { nome: string; genere: string; peso: number; cpu: number }[] = [
	{ nome: 'Cobalt Drift', genere: 'Racing', peso: 1.0, cpu: 0.25 },
	{ nome: 'Hollow Sunrise', genere: 'Open-world RPG', peso: 1.9, cpu: 0.45 },
	{ nome: 'Pixel Arena', genere: 'Competitive shooter', peso: 0.55, cpu: 0.7 },
	{ nome: 'Tidal Kingdoms', genere: 'Strategy', peso: 0.8, cpu: 0.8 },
];

// Configurazioni di partenza: caricano pezzi nel builder
export const presets: { id: string; nome: string; per: string; pezzi: string[] }[] = [
	{ id: 'work', nome: 'Work', per: 'Office, study, light editing', pezzi: ['case-cube', 'cpu-k5', 'mb-b', 'ram-d5-16', 'gpu-740', 'sto-1', 'psu-550'] },
	{ id: 'gaming', nome: 'Gaming', per: '1440p at high settings', pezzi: ['case-loft', 'cpu-k7', 'mb-a', 'ram-d5-32', 'gpu-760', 'sto-2', 'psu-750'] },
	{ id: 'creator', nome: 'Creator', per: 'Video, 3D, streaming', pezzi: ['case-loft', 'cpu-k9', 'mb-a', 'ram-d5-64', 'gpu-790', 'sto-4', 'psu-1000'] },
];

export const servizi = [
	{ id: 'assembly', nome: 'Assembly & testing', tempo: '2 days', prezzo: 'from €59', testo: 'We build it, cable-manage it, stress-test it for 24 hours and install the system.' },
	{ id: 'upgrade', nome: 'Upgrade while you wait', tempo: '1 hour', prezzo: 'from €25', testo: 'New card, more memory, a faster drive. Fitted at the counter, with a free health check.' },
	{ id: 'cleaning', nome: 'Deep clean & repaste', tempo: 'Same day', prezzo: 'from €39', testo: 'Dust out, fresh thermal paste, fans checked. Your PC runs cooler and quieter.' },
	{ id: 'migrate', nome: 'Data migration', tempo: '3 hours', prezzo: 'from €29', testo: 'Moving to a new machine? We copy files, settings and game libraries across.' },
	{ id: 'tradein', nome: 'Trade-in', tempo: '15 minutes', prezzo: 'quote on the spot', testo: 'Bring your old components or laptop: we value them and take it off the new price.' },
];

export const recensioni = [
	{ nome: 'Marco R.', voto: 5, testo: 'Brought a budget, left with a build I could not have chosen better. They talked me out of the card I did not need.', data: 'Sample review' },
	{ nome: 'Giulia T.', voto: 5, testo: 'Upgraded the RAM and SSD while I had a coffee. Honest prices and a free dust-off.', data: 'Sample review' },
	{ nome: 'Dario P.', voto: 4, testo: 'The builder is dangerously fun. Ended up with a creator PC for the studio, delivered in two days.', data: 'Sample review' },
	{ nome: 'Elena S.', voto: 5, testo: 'First gaming laptop for my son: they explained everything and set it all up. Great after-sales.', data: 'Sample review' },
];

export const euro = (n: number) => `€${n.toLocaleString('en-IE')}`;
