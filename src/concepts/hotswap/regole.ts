// Le regole del builder, senza DOM: compatibilità, consumi, FPS e prezzi. Le usa solo Builder.astro.
import { pezzi, giochi, assemblaggio, type Pezzo, type Slot } from './catalogo';

export type Montaggio = Partial<Record<Slot, string>>;
export const pezzoDi = (id: string) => pezzi.find((p) => p.id === id)!;
export const montati = (m: Montaggio) => (Object.entries(m) as [Slot, string][]).map(([, id]) => pezzoDi(id));
const daSlot = (m: Montaggio, s: Slot) => (m[s] ? pezzoDi(m[s]!) : undefined);

// una scheda ATX sta solo in un case ATX, una mATX in ATX e mATX, una ITX dappertutto
const rango = { ITX: 0, mATX: 1, ATX: 2 } as const;
export const staNelCase = (scheda: Pezzo, cassa: Pezzo) => rango[scheda.forma!] <= rango[cassa.forma!];

/** Perché `p` NON può entrare nel montaggio `m` (con il suo slot ignorato), oppure null se va bene. */
export function conflitto(p: Pezzo, m: Montaggio): string | null {
	const altro = (s: Slot) => (s === p.slot ? undefined : daSlot(m, s));
	const cassa = altro('case');
	const scheda = altro('board');
	const cpu = altro('cpu');
	const ram = altro('ram');
	const gpu = altro('gpu');
	switch (p.slot) {
		case 'cpu':
			if (scheda && scheda.socket !== p.socket) return `Socket ${p.socket}: your ${scheda.nome} is socket ${scheda.socket}.`;
			break;
		case 'board':
			if (cpu && cpu.socket !== p.socket) return `Socket ${p.socket}: your ${cpu.nome} is socket ${cpu.socket}.`;
			if (ram && ram.ram !== p.ram) return `Takes ${p.ram}: your memory is ${ram.ram}.`;
			if (cassa && !staNelCase(p, cassa)) return `${p.forma} board, too big for the ${cassa.nome}.`;
			break;
		case 'ram':
			if (scheda && scheda.ram !== p.ram) return `${p.ram}: your ${scheda.nome} takes ${scheda.ram}.`;
			break;
		case 'gpu':
			if (cassa && p.len! > cassa.maxGpu!) return `${p.len} mm: the ${cassa.nome} fits ${cassa.maxGpu} mm.`;
			break;
		case 'case':
			if (scheda && !staNelCase(scheda, p)) return `Too small for your ${scheda.forma} board.`;
			if (gpu && gpu.len! > p.maxGpu!) return `Fits cards up to ${p.maxGpu} mm: yours is ${gpu.len} mm.`;
			break;
	}
	return null;
}

export type Controllo = { id: string; stato: 'ok' | 'no' | 'att' | 'avviso'; titolo: string; testo: string };

export const consumo = (m: Montaggio) => (daSlot(m, 'cpu')?.watt ?? 0) + (daSlot(m, 'gpu')?.watt ?? 0) + 90;
export const alimentatoreConsigliato = (m: Montaggio) => Math.ceil((consumo(m) * 1.3) / 50) * 50;

export function controlli(m: Montaggio): Controllo[] {
	const cassa = daSlot(m, 'case');
	const scheda = daSlot(m, 'board');
	const cpu = daSlot(m, 'cpu');
	const ram = daSlot(m, 'ram');
	const gpu = daSlot(m, 'gpu');
	const psu = daSlot(m, 'psu');
	const out: Controllo[] = [];
	out.push(
		!cpu || !scheda
			? { id: 'socket', stato: 'att', titolo: 'Socket', testo: 'Needs a CPU and a motherboard.' }
			: cpu.socket === scheda.socket
				? { id: 'socket', stato: 'ok', titolo: 'Socket', testo: `CPU and board are both ${cpu.socket}.` }
				: { id: 'socket', stato: 'no', titolo: 'Socket', testo: `${cpu.socket} CPU on a ${scheda.socket} board.` },
	);
	out.push(
		!ram || !scheda
			? { id: 'ram', stato: 'att', titolo: 'Memory type', testo: 'Needs memory and a motherboard.' }
			: ram.ram === scheda.ram
				? { id: 'ram', stato: 'ok', titolo: 'Memory type', testo: `${ram.ram} on a ${scheda.ram} board.` }
				: { id: 'ram', stato: 'no', titolo: 'Memory type', testo: `${ram.ram} on a ${scheda.ram} board.` },
	);
	out.push(
		!cassa || !scheda
			? { id: 'forma', stato: 'att', titolo: 'Board fits case', testo: 'Needs a case and a motherboard.' }
			: staNelCase(scheda, cassa)
				? { id: 'forma', stato: 'ok', titolo: 'Board fits case', testo: `${scheda.forma} board in an ${cassa.forma} case.` }
				: { id: 'forma', stato: 'no', titolo: 'Board fits case', testo: `${scheda.forma} board does not fit.` },
	);
	out.push(
		!cassa || !gpu
			? { id: 'gpu', stato: 'att', titolo: 'Card clearance', testo: 'Needs a case and a graphics card.' }
			: gpu.len! <= cassa.maxGpu!
				? { id: 'gpu', stato: 'ok', titolo: 'Card clearance', testo: `${gpu.len} mm card, ${cassa.maxGpu} mm of room.` }
				: { id: 'gpu', stato: 'no', titolo: 'Card clearance', testo: `${gpu.len} mm card, only ${cassa.maxGpu} mm of room.` },
	);
	const draw = consumo(m);
	if (!psu || !cpu || !gpu) out.push({ id: 'psu', stato: 'att', titolo: 'Power', testo: 'Needs CPU, graphics card and power supply.' });
	else if (psu.watt! < draw) out.push({ id: 'psu', stato: 'no', titolo: 'Power', testo: `Draws about ${draw} W, the supply gives ${psu.watt} W.` });
	else if (draw / psu.watt! > 0.8) out.push({ id: 'psu', stato: 'avviso', titolo: 'Power', testo: `Tight: ${draw} W of ${psu.watt} W. We suggest ${alimentatoreConsigliato(m)} W.` });
	else out.push({ id: 'psu', stato: 'ok', titolo: 'Power', testo: `About ${draw} W of ${psu.watt} W, with room to spare.` });
	return out;
}

export const completo = (m: Montaggio) => (['case', 'board', 'cpu', 'ram', 'gpu', 'storage', 'psu'] as Slot[]).every((s) => m[s]);
export const senzaErrori = (m: Montaggio) => controlli(m).every((c) => c.stato !== 'no');

export const risoluzioni = { '1080p': 1, '1440p': 0.78, '4K': 0.45 } as const;
export type Risoluzione = keyof typeof risoluzioni;

/** Stima di fantasia: la GPU pesa di più alle risoluzioni alte, la CPU nei giochi competitivi e di strategia. */
export function fps(m: Montaggio, res: Risoluzione) {
	const gpu = daSlot(m, 'gpu');
	const cpu = daSlot(m, 'cpu');
	if (!gpu || !cpu) return null;
	return giochi.map((g) => {
		const grezzo = ((gpu.gpuScore! * risoluzioni[res] * (1 - g.cpu) + cpu.cpuScore! * g.cpu) * 1.7) / g.peso;
		return { nome: g.nome, genere: g.genere, fps: Math.max(8, Math.round(grezzo)) };
	});
}

export const sommaPezzi = (m: Montaggio) => montati(m).reduce((s, p) => s + p.prezzo, 0);
export const totale = (m: Montaggio, conMontaggio: boolean) => sommaPezzi(m) + (conMontaggio && montati(m).length ? assemblaggio : 0);

/** Codice breve e stabile del montaggio, per la scheda da portare in negozio. */
export function codice(m: Montaggio) {
	const s = Object.values(m).sort().join('|');
	let h = 7;
	for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 33554393;
	// alfabeto senza lettere ambigue (0/O, 1/I)
	const abc = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
	let out = '';
	for (let i = 0; i < 4; i++) {
		out += abc[h % abc.length];
		h = Math.floor(h / abc.length);
	}
	return `BLD-${out}`;
}

/** Idea di upgrade della scheda video entro il budget che avanza. */
export function ideaGpu(m: Montaggio, avanza: number): { da: Pezzo; a: Pezzo; extra: number } | null {
	const g = daSlot(m, 'gpu');
	if (!g || avanza <= 0) return null;
	const candidati = pezzi
		.filter((p) => p.slot === 'gpu' && p.gpuScore! > g.gpuScore! && p.prezzo - g.prezzo <= avanza && !conflitto(p, m))
		.sort((a, b) => b.gpuScore! - a.gpuScore!);
	return candidati.length ? { da: g, a: candidati[0], extra: candidati[0].prezzo - g.prezzo } : null;
}
