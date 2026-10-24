import { MEDIDAS } from './medidas';

const pc = (v: number) => `${+(v * 100).toFixed(3)}%`;

// Posición de un riquadro del mockup aprobado dentro del marco de la parete (todo en % del marco).
export const caja = (id: string) => {
	const [x, y, w, h] = MEDIDAS[id];
	return `left:${pc(x)};top:${pc(y)};width:${pc(w)};height:${pc(h)}`;
};

// Posición de un riquadro respecto de otro que lo contiene (para un texto dentro de su cartel).
export const dentro = (id: string, padre: string) => {
	const [x, y, w, h] = MEDIDAS[id];
	const [px, py, pw, ph] = MEDIDAS[padre];
	return `left:${pc((x - px) / pw)};top:${pc((y - py) / ph)};width:${pc(w / pw)};height:${pc(h / ph)}`;
};
