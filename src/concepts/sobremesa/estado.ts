// Estado de Sobremesa en localStorage: la bolsa, la libreta (guardados) y los pedidos de prueba.
// Los componentes se avisan con eventos "sb:bolsa", "sb:libreta" y "sb:pedidos".
const BOLSA = 'sobremesa:bolsa';
const LIBRETA = 'sobremesa:libreta';
const PEDIDOS = 'sobremesa:pedidos';

export type Linea = { id: string; n: number };
export type Pedido = {
	id: string;
	fecha: number;
	lineas: { id: string; nombre: string; n: number; precio: number }[];
	subtotal: number;
	envio: number;
	total: number;
	zona: string;
	regalo: string;
};

function leerJson<T>(clave: string, vacio: T): T {
	try {
		const v = JSON.parse(localStorage.getItem(clave) ?? 'null');
		return (v ?? vacio) as T;
	} catch {
		return vacio;
	}
}

function guardarJson(clave: string, valor: unknown, evento: string) {
	try {
		localStorage.setItem(clave, JSON.stringify(valor));
	} catch {
		/* modo privado o sitio bloqueado: el estado vive solo en esta visita */
	}
	window.dispatchEvent(new CustomEvent(evento, { detail: valor }));
}

// En memoria por si localStorage no se puede escribir
const memoria: Record<string, unknown> = {};
const leer = <T,>(clave: string, vacio: T): T => (clave in memoria ? (memoria[clave] as T) : leerJson(clave, vacio));
const escribir = (clave: string, valor: unknown, evento: string) => {
	memoria[clave] = valor;
	guardarJson(clave, valor, evento);
};

export const leerBolsa = (): Linea[] => leer<Linea[]>(BOLSA, []).filter((l) => l && typeof l.id === 'string' && l.n > 0);
export const cuenta = (lineas = leerBolsa()) => lineas.reduce((t, l) => t + l.n, 0);

export function sumar(id: string, n = 1) {
	const lineas = leerBolsa();
	const l = lineas.find((x) => x.id === id);
	if (l) l.n += n;
	else lineas.push({ id, n });
	escribir(BOLSA, lineas, 'sb:bolsa');
}
export function fijar(id: string, n: number) {
	const lineas = leerBolsa();
	const i = lineas.findIndex((l) => l.id === id);
	if (n <= 0) {
		if (i >= 0) lineas.splice(i, 1);
	} else if (i >= 0) lineas[i].n = n;
	else lineas.push({ id, n });
	escribir(BOLSA, lineas, 'sb:bolsa');
}
export const sacar = (id: string) => fijar(id, 0);
export const vaciar = () => escribir(BOLSA, [], 'sb:bolsa');

export const leerLibreta = (): string[] => leer<string[]>(LIBRETA, []);
export function alternarLibreta(id: string) {
	const l = leerLibreta();
	const nuevo = l.includes(id) ? l.filter((x) => x !== id) : [...l, id];
	escribir(LIBRETA, nuevo, 'sb:libreta');
	return nuevo.includes(id);
}

export const leerPedidos = (): Pedido[] => leer<Pedido[]>(PEDIDOS, []);
export function guardarPedido(p: Pedido) {
	escribir(PEDIDOS, [p, ...leerPedidos()].slice(0, 5), 'sb:pedidos');
}

// la bolsa que se ve ahora: la de la testata arriba, la de Rieles en pantallas anchas cuando la testata ya salió de la vista
export function bolsaVisible(): HTMLElement | null {
	const todas = [...document.querySelectorAll<HTMLElement>('[data-bolsa-abrir]')];
	return (
		todas.find((b) => {
			const r = b.getBoundingClientRect();
			return getComputedStyle(b).visibility === 'visible' && r.width > 0 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
		}) ?? todas[0] ?? null
	);
}
