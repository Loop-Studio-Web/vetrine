// Dati dei trattamenti di fantasia di Atelier Lumen: nomi, durate e prezzi non esistono davvero.
export type Area = 'viso' | 'corpo' | 'mani';
export type Ora = 'alba' | 'mattino' | 'giorno' | 'sera';

export type Servizio = {
	id: string;
	nome: string;
	area: Area;
	min: number;
	prezzo: number;
	testo: string;
	ora: Ora;
};

export const aree: { id: Area | 'tutti'; nome: string }[] = [
	{ id: 'tutti', nome: 'Tutti' },
	{ id: 'viso', nome: 'Viso' },
	{ id: 'corpo', nome: 'Corpo' },
	{ id: 'mani', nome: 'Mani e piedi' },
];

// Ogni trattamento ha il suo momento della giornata: dà il colore della scheda e l'ora che si legge nel titolo
export const oraNome: Record<Ora, { label: string; ora: string }> = {
	alba: { label: 'Alba', ora: '07:00' },
	mattino: { label: 'Mattino', ora: '09:30' },
	giorno: { label: 'Mezzogiorno', ora: '12:30' },
	sera: { label: 'Vespro', ora: '18:30' },
};

export const servizi: Servizio[] = [
	{
		id: 'pulizia-alba',
		nome: 'Pulizia Alba',
		area: 'viso',
		min: 60,
		prezzo: 58,
		ora: 'alba',
		testo: 'Vapore tiepido, detersione profonda e maschera calmante. Il modo più gentile di ricominciare, soprattutto per pelli stanche.',
	},
	{
		id: 'luce-led',
		nome: 'Luce Lumen LED',
		area: 'viso',
		min: 45,
		prezzo: 65,
		ora: 'mattino',
		testo: 'Fototerapia a LED con luce ambra, rossa o blu a seconda di cosa chiede la pelle. Nessun dolore, nessun tempo di recupero.',
	},
	{
		id: 'siero-a-strati',
		nome: 'Siero a strati',
		area: 'viso',
		min: 75,
		prezzo: 89,
		ora: 'giorno',
		testo: 'Tre sieri sovrapposti con massaggio lento: idratazione, luminosità, protezione. Per arrivare a sera con la pelle che brilla.',
	},
	{
		id: 'gua-sha',
		nome: 'Modellante Gua Sha',
		area: 'viso',
		min: 60,
		prezzo: 72,
		ora: 'mattino',
		testo: 'Un massaggio con pietra liscia che scioglie le tensioni del volto, drena e ridisegna i contorni. Si esce con lo sguardo disteso.',
	},
	{
		id: 'scrub-olio',
		nome: 'Scrub e olio caldo',
		area: 'corpo',
		min: 50,
		prezzo: 64,
		ora: 'giorno',
		testo: 'Esfoliazione al sale fine e olio tiepido steso a lunghe passate. Pelle liscia e profumata di agrumi, senza essenze invadenti.',
	},
	{
		id: 'meridiana',
		nome: 'Massaggio Meridiana',
		area: 'corpo',
		min: 60,
		prezzo: 78,
		ora: 'giorno',
		testo: 'Il massaggio di fondo della casa: schiena, spalle e gambe, pressione media e ritmo costante. Per chi lavora seduto tutto il giorno.',
	},
	{
		id: 'vespro',
		nome: 'Vespro drenante',
		area: 'corpo',
		min: 75,
		prezzo: 92,
		ora: 'sera',
		testo: 'Drenaggio lento a luce di candela per gambe pesanti e fine settimana lunghe. Si chiude con un impacco caldo ai piedi.',
	},
	{
		id: 'manicure',
		nome: 'Manicure Cipria',
		area: 'mani',
		min: 45,
		prezzo: 32,
		ora: 'mattino',
		testo: 'Cura delle cuticole e smalto semipermanente nelle tinte nude: cipria, pesca, sabbia. Eleganti senza farsi notare.',
	},
	{
		id: 'pedicure',
		nome: 'Pedicure estetico',
		area: 'mani',
		min: 60,
		prezzo: 45,
		ora: 'giorno',
		testo: 'Bagno tiepido, limatura e massaggio ai piedi. Una pausa vera, anche se dura un’ora.',
	},
	{
		id: 'paraffina',
		nome: 'Mani nuove alla paraffina',
		area: 'mani',
		min: 30,
		prezzo: 28,
		ora: 'sera',
		testo: 'Un guanto di cera tiepida che ammorbidisce subito. Perfetto da aggiungere a un’altra seduta.',
	},
];

// Il rituale su misura: le tre scelte cambiano i passaggi, la durata e il prezzo
export type Pelle = 'secca' | 'mista' | 'sensibile' | 'matura';
export type Desiderio = 'luce' | 'calma' | 'tono';

export const pelli: { id: Pelle; nome: string; nota: string }[] = [
	{ id: 'secca', nome: 'Secca', nota: 'tira, si screpola' },
	{ id: 'mista', nome: 'Mista', nota: 'lucida al centro' },
	{ id: 'sensibile', nome: 'Sensibile', nota: 'arrossa facilmente' },
	{ id: 'matura', nome: 'Matura', nota: 'cerca elasticità' },
];
export const tempi = [
	{ min: 60, prezzo: 79, nome: 'Un’ora', nota: 'l’essenziale' },
	{ min: 90, prezzo: 112, nome: 'Un’ora e mezza', nota: 'con la luce LED' },
	{ min: 120, prezzo: 148, nome: 'Due ore', nota: 'con spalle e schiena' },
];
export const desideri: { id: Desiderio; nome: string; nota: string; luce: string }[] = [
	{ id: 'luce', nome: 'Luminosità', nota: 'pelle che riflette', luce: '#ffd9a8' },
	{ id: 'calma', nome: 'Calma', nota: 'tensioni che si sciolgono', luce: '#cfe0cf' },
	{ id: 'tono', nome: 'Tonicità', nota: 'contorni più definiti', luce: '#f3b6a8' },
];

export type Passaggio = { nome: string; min: number; testo: string };

const detersione: Record<Pelle, string> = {
	secca: 'Latte struccante cremoso e panno caldo: toglie senza seccare.',
	mista: 'Gel schiumogeno morbido, che pulisce le zone lucide e lascia in pace il resto.',
	sensibile: 'Acqua micellare con dischetti di cotone, senza strofinare.',
	matura: 'Olio detergente massaggiato, poi tolto con un panno tiepido.',
};
const maschera: Record<Desiderio, string> = {
	luce: 'Maschera agli agrumi e vitamina C, per una pelle che torna a riflettere.',
	calma: 'Maschera all’avena e alla camomilla, fresca e lenitiva.',
	tono: 'Maschera ai peptidi vegetali, che compatta e rinforza.',
};
const massaggio: Record<Desiderio, string> = {
	luce: 'Linfodrenaggio con pietra di quarzo: sgonfia e illumina.',
	calma: 'Massaggio lento a mani calde, sulle tempie e sul collo.',
	tono: 'Massaggio modellante dal centro del viso verso l’esterno.',
};
const led: Record<Desiderio, string> = {
	luce: 'Luce ambra, per un incarnato uniforme.',
	calma: 'Luce blu, che riduce arrossamenti e imperfezioni.',
	tono: 'Luce rossa, che stimola il rinnovamento della pelle.',
};

export function componiRituale(pelle: Pelle, min: number, desiderio: Desiderio): Passaggio[] {
	const p: Passaggio[] = [];
	p.push({ nome: 'Accoglienza', min: min === 120 ? 10 : 5, testo: 'Un tè caldo e due parole su come stai: cominciamo dal tuo ritmo.' });
	p.push({ nome: 'Detersione', min: 10, testo: detersione[pelle] });
	if (min >= 90) p.push({ nome: 'Esfoliazione dolce', min: 10, testo: 'Enzimi di papaya, senza grani: la pelle si prepara senza irritarsi.' });
	p.push({ nome: 'Maschera', min: 15, testo: maschera[desiderio] });
	p.push({ nome: 'Massaggio del viso', min: min === 60 ? 20 : 30, testo: massaggio[desiderio] });
	if (min >= 90) p.push({ nome: 'Luce Lumen LED', min: min === 120 ? 15 : 10, testo: led[desiderio] });
	if (min === 120) p.push({ nome: 'Spalle e schiena', min: 20, testo: 'Olio tiepido e pressione media: la tensione che si accumula davanti allo schermo.' });
	p.push({ nome: 'Chiusura', min: 10, testo: 'Siero, crema e protezione solare su misura. Poi ancora un tè, senza fretta.' });
	return p;
}
