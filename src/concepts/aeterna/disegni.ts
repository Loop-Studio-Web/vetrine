// Disegni tecnici dei macchinari, in SVG. Hanno dettagli minuscoli (sigle, scale, numeri di serie)
// pensati per la lente d'ingrandimento della sezione dei protocolli. Gli stili .d-* stanno in Trattamenti.astro.
const cornice = (sigla: string) => `
	<g class="d-cornice">
		<circle cx="200" cy="200" r="188" fill="none" stroke-dasharray="1 7"></circle>
		<circle cx="200" cy="200" r="176" fill="none" opacity=".4"></circle>
		<path d="M200 6v18M200 376v18M6 200h18M376 200h18" stroke-linecap="round"></path>
		<text x="22" y="30" class="d-micro">${sigla}</text>
		<text x="378" y="388" class="d-micro" text-anchor="end">SN 0042-A · REV 3</text>
	</g>`;

const scala = (x: number, y0: number, y1: number, n: number, lato: 1 | -1 = 1) =>
	Array.from({ length: n + 1 }, (_, i) => {
		const y = y0 + ((y1 - y0) * i) / n;
		const l = i % 5 === 0 ? 14 : 7;
		return `<path d="M${x} ${y.toFixed(1)}h${l * lato}"></path>`;
	}).join('');

export const disegni: Record<string, string> = {
	cryo: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
		${cornice('CRYO-01 · CAMERA A VAPORI DI AZOTO')}
		<g class="d-linea">
			<rect x="138" y="70" width="124" height="260" rx="62"></rect>
			<rect x="154" y="86" width="92" height="228" rx="46" opacity=".5"></rect>
			<rect x="166" y="108" width="68" height="132" rx="34" class="d-vetro"></rect>
			<path d="M178 150l44 0M178 170l44 0M178 190l30 0M178 210l40 0" opacity=".35"></path>
			<path d="M176 340v26M224 340v26M158 366h84" stroke-linecap="round"></path>
			<circle cx="200" cy="268" r="9"></circle><path d="M200 262v6l4 3" stroke-linecap="round"></path>
			<path d="M184 288h32M184 298h32" opacity=".5"></path>
		</g>
		<g class="d-linea" transform="translate(300 0)">
			<path d="M0 90V310"></path>
			${scala(0, 90, 310, 22)}
			<rect x="-6" y="172" width="12" height="138" class="d-liquido"></rect>
			<text x="22" y="100" class="d-micro">0 °C</text>
			<text x="22" y="204" class="d-micro">−60</text>
			<text x="22" y="312" class="d-micro">−110 °C</text>
		</g>
		<g class="d-linea d-vapore">
			<path d="M150 336c-18-14 8-28-10-44s6-26-6-40" class="d-v1"></path>
			<path d="M200 346c-14-16 10-30-6-48s8-30-2-46" class="d-v2"></path>
			<path d="M250 336c18-14-8-28 10-44s-6-26 6-40" class="d-v3"></path>
		</g>
		<text x="36" y="316" class="d-micro">N₂ 99,9 % · FLUSSO 4,2 L/MIN</text>
		<text x="36" y="328" class="d-micro">T. CAMERA −110,4 °C</text>
	</svg>`,

	infusione: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
		${cornice('IV-02 · LINEA DI INFUSIONE')}
		<g class="d-linea">
			<path d="M120 60V352"></path>
			<path d="M80 352h80M92 360h56" stroke-linecap="round"></path>
			<path d="M120 76h96"></path>
			<rect x="170" y="76" width="92" height="124" rx="22"></rect>
			<rect x="178" y="124" width="76" height="68" rx="14" class="d-liquido"></rect>
			<path d="M178 124h76" class="d-livello"></path>
			${Array.from({ length: 8 }, (_, i) => `<path d="M262 ${96 + i * 12}h-${i % 2 ? 7 : 12}"></path>`).join('')}
			<path d="M216 200v28"></path>
			<rect x="202" y="228" width="28" height="52" rx="10"></rect>
			<path d="M208 244h16" opacity=".5"></path>
			<circle cx="216" cy="258" r="3.4" class="d-goccia d-g1"></circle>
			<path d="M216 280v26"></path>
			<rect x="205" y="306" width="22" height="16" rx="3"></rect>
			<path d="M216 322v14c0 22 30 30 52 30h66" stroke-linecap="round"></path>
			<path d="M334 366l22-8v16z" class="d-ago"></path>
		</g>
		<text x="276" y="100" class="d-micro">500 ml</text>
		<text x="276" y="196" class="d-micro">FORMULA 07 · SU MISURA</text>
		<text x="238" y="262" class="d-micro">38 gtt/min</text>
		<text x="238" y="330" class="d-micro">CLAMP 3/4</text>
	</svg>`,

	biolight: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
		${cornice('BIO-03 · PANNELLO LED')}
		<g class="d-linea">
			<rect x="86" y="78" width="228" height="104" rx="10"></rect>
			<path d="M120 78v-26M280 78v-26M120 52h160" stroke-linecap="round"></path>
			${Array.from({ length: 4 }, (_, r) =>
				Array.from({ length: 11 }, (_, c) => `<circle cx="${112 + c * 17.6}" cy="${100 + r * 24}" r="4.6" class="d-led" style="animation-delay:${((r * 11 + c) * 0.07).toFixed(2)}s"></circle>`).join(''),
			).join('')}
		</g>
		<g class="d-raggi">
			<path d="M92 186L26 358M146 186L112 358M200 186V358M254 186l34 172M308 186l66 172"></path>
			<path d="M96 186Q200 218 304 186" class="d-onda"></path>
			<path d="M80 232Q200 270 320 232" class="d-onda" opacity=".6"></path>
			<path d="M64 284Q200 326 336 284" class="d-onda" opacity=".35"></path>
		</g>
		<text x="40" y="206" class="d-micro">660 nm</text>
		<text x="40" y="258" class="d-micro">850 nm</text>
		<text x="238" y="150" class="d-micro">44 LED · 18 mW/cm²</text>
		<text x="140" y="378" class="d-micro">DISTANZA 20 CM</text>
	</svg>`,

	iperbarica: `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
		${cornice('HBO-04 · CAMERA A PRESSIONE')}
		<g class="d-linea">
			<rect x="44" y="150" width="262" height="116" rx="58"></rect>
			<rect x="56" y="162" width="238" height="92" rx="46" opacity=".5"></rect>
			<circle cx="116" cy="208" r="30" class="d-vetro"></circle>
			<circle cx="116" cy="208" r="22" opacity=".5"></circle>
			<circle cx="190" cy="208" r="30" class="d-vetro"></circle>
			<circle cx="190" cy="208" r="22" opacity=".5"></circle>
			<path d="M236 168v80" opacity=".6"></path>
			<path d="M306 208h30" stroke-linecap="round"></path>
			<path d="M92 266v38M258 266v38M70 304h44M236 304h44" stroke-linecap="round"></path>
			<circle cx="336" cy="130" r="40"></circle>
			<circle cx="336" cy="130" r="32" opacity=".4"></circle>
			${Array.from({ length: 13 }, (_, i) => {
				const a = ((-210 + i * 20) * Math.PI) / 180;
				const r1 = 32;
				const r2 = i % 2 === 0 ? 24 : 27;
				return `<path d="M${(336 + Math.cos(a) * r1).toFixed(1)} ${(130 + Math.sin(a) * r1).toFixed(1)}L${(336 + Math.cos(a) * r2).toFixed(1)} ${(130 + Math.sin(a) * r2).toFixed(1)}"></path>`;
			}).join('')}
			<path d="M336 130L336 104" class="d-ago-man" stroke-linecap="round"></path>
			<circle cx="336" cy="130" r="3.6" class="d-ago"></circle>
			<path d="M336 170v38" opacity=".6"></path>
		</g>
		<text x="318" y="152" class="d-micro">1,5 ATA</text>
		<text x="60" y="150" class="d-micro" transform="translate(0 -8)">O₂ 95 % · 60 MIN</text>
		<text x="96" y="326" class="d-micro">VALVOLA DI SICUREZZA · TARATA</text>
	</svg>`,
};
