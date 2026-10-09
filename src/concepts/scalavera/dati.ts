/* Dati del concept: studio, materiali, progetti. Tutto di fantasia. */

export const STUDIO = {
	nome: 'Scala Vera',
	citta: 'Torino',
	indirizzo: 'Via dei Mercanti 00, Torino (indirizzo di esempio)',
	tel: '+390110000000',
	telVisibile: '011 000 0000',
	email: 'studio@scalavera.example',
};

// Tacche del simbolo, ricostruite dal logo (x, y, larghezza; altezza 17,7). La quinta è lo "zero".
export const TACCHE: [number, number, number][] = [
	[348.6, 228.8, 66.4], [304.1, 269.3, 57.7], [274.0, 309.3, 70.2], [251.9, 349.8, 99.7],
	[208.7, 392.2, 217.5], [266.8, 434.3, 220.2], [322.1, 475.9, 225.8], [372.8, 517.4, 214.9],
	[414.8, 558.9, 180.8], [459.1, 600.6, 118.9], [478.8, 643.9, 80.7], [467.9, 688.2, 69.0],
	[414.7, 735.6, 68.2], [354.2, 783.5, 69.8],
];
export const ZERO = 4;

export type Materiale = {
	id: string;
	nome: string;
	famiglia: string;
	origine: string;
	finitura: string;
	uso: string;
	tipo: 'scansione' | 'bronzo' | 'lacca' | 'velluto';
	campione: string; // colore di riserva (menù, tavola del brief)
	scala: number; // ripetizioni del campione sulla tela
};

export const MATERIALI: Materiale[] = [
	{
		id: 'travertino',
		nome: 'Travertino argento',
		famiglia: 'Pietra',
		origine: 'Cava di fantasia, Lazio',
		finitura: 'Levigato, pori aperti',
		uso: 'Piani, pavimenti, rivestimenti',
		tipo: 'scansione',
		campione: '#9aa3a8',
		scala: 1,
	},
	{
		id: 'terrazzo',
		nome: 'Terrazzo notte',
		famiglia: 'Graniglia',
		origine: 'Gettato in opera',
		finitura: 'Lucidato a piombo',
		uso: 'Pavimenti, piani bagno',
		tipo: 'scansione',
		campione: '#1d2a3a',
		scala: 1,
	},
	{
		id: 'noce',
		nome: 'Noce canaletto',
		famiglia: 'Legno',
		origine: 'Tavole selezionate',
		finitura: 'Olio e cera, lucido',
		uso: 'Arredi su misura, boiserie',
		tipo: 'scansione',
		campione: '#6b3622',
		scala: 1,
	},
	{
		id: 'onice',
		nome: 'Onice lilla',
		famiglia: 'Pietra',
		origine: 'Lastre a macchia aperta',
		finitura: 'Lucido, retroilluminabile',
		uso: 'Banconi, pareti, lavabi',
		tipo: 'scansione',
		campione: '#b9aeb3',
		scala: 1,
	},
	{
		id: 'bronzo',
		nome: 'Bronzo spazzolato',
		famiglia: 'Metallo',
		origine: 'Fonderia artigiana',
		finitura: 'Spazzolato a mano, cera',
		uso: 'Maniglie, profili, piani',
		tipo: 'bronzo',
		campione: '#8a6a3f',
		scala: 1,
	},
	{
		id: 'lacca',
		nome: 'Lacca bordeaux',
		famiglia: 'Finitura',
		origine: 'Laccatura a spruzzo',
		finitura: 'Lucido diretto, sette mani',
		uso: 'Ante, librerie, tavoli',
		tipo: 'lacca',
		campione: '#4c0d17',
		scala: 1,
	},
	{
		id: 'velluto',
		nome: 'Velluto ruggine',
		famiglia: 'Tessuto',
		origine: 'Tessitura di fantasia, Como',
		finitura: 'Pelo raso, cotone e viscosa',
		uso: 'Divani, testiere, tende',
		tipo: 'velluto',
		campione: '#7f3a22',
		scala: 1,
	},
];
