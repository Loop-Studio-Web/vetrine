// Un scenario per interazione: riceve gli helper di clip-azione.mjs (attendi, anima, vaiA, tocca, p).
export const scenari = {
	// FIXLAB: lo smartphone in vista esplosa → il pezzo tocca "Trova il servizio"
	'riparazioni/pezzo': async ({ attendi, tocca, vaiA, p }) => {
		await attendi(1.2);
		await vaiA('.banco', 1.2, 90);
		await attendi(1);
		await tocca('[data-pezzo][data-p="schermo"]');
		await attendi(0.6);
		await vaiA('#diagnosi', 1.4, 70);
		await attendi(2.4);
	},
	// Sifone: si gira il volantino della valvola, l'acqua arriva
	'idraulico/valvola': async ({ attendi, anima, vaiA, p }) => {
		await attendi(1);
		await vaiA('[data-valvola]', 1.4, 110);
		await attendi(0.8);
		const r = await p.evaluate(() => { const b = document.querySelector('[data-ruota]').getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, r: b.width / 2 }; });
		const pt = (g) => [r.x + Math.cos(g) * r.r * 0.8, r.y + Math.sin(g) * r.r * 0.8];
		let [x, y] = pt(0);
		await p.mouse.move(x, y); await p.mouse.down();
		await anima(3.2, async (k) => { const [mx, my] = pt(k * Math.PI * 3); await p.mouse.move(mx, my); }, false);
		await p.mouse.up();
		await attendi(2.4);
	},
	// Obra Fina: si tocca una stanza, si sceglie il livello d'opera e il colore delle pareti
	'ristrutturazioni/estancia': async ({ attendi, tocca, vaiA, p }) => {
		await attendi(1);
		await vaiA('#presupuesto', 1.4, 60);
		await attendi(1);
		await tocca('[data-est="cocina"]');
		await attendi(1.2);
		await vaiA('#ficha', 1, 70);
		await attendi(0.8);
		await tocca('label:has(input[name="of-nivel"][value="3"])');
		await attendi(1.8);
		await tocca('label:has(input[name="of-pared"]:not(:checked))');
		await attendi(2);
	},
};
