// Dati statici di Ordito, importabili anche dal frontmatter .astro (nessun codice che usi il browser).

// Punti caldi sulla scena: dove stanno nello spazio 3D e in quali passi del racconto compaiono
export const caldi: { id: string; nome: string; pos: [number, number, number]; passi: number[]; attr: Record<string, string> }[] = [
	{ id: 'serratura', nome: 'Serratura', pos: [5.4, 1.55, 1.1], passi: [1], attr: { 'data-toggle': 'serratura' } },
	{ id: 'luci', nome: 'Luci soggiorno', pos: [-2.6, 2.7, 0.3], passi: [2], attr: { 'data-luce': 'soggiorno' } },
	{ id: 'tv', nome: 'Televisore', pos: [-2.6, 2.0, -3.2], passi: [2], attr: { 'data-toggle': 'tv' } },
	{ id: 'ev', nome: 'Ricarica auto', pos: [8.6, 2.5, 6.6], passi: [3], attr: { 'data-toggle': 'ev' } },
	{ id: 'tapparelle', nome: 'Tapparelle', pos: [-2.7, 6.3, -3.3], passi: [4], attr: { 'data-tap-toggle': '1' } },
	{ id: 'clima', nome: 'Clima', pos: [-0.9, 5.0, -3.4], passi: [4], attr: { 'data-clima': '1' } },
	{ id: 'allarme', nome: 'Allarme', pos: [4.7, 7.7, 3.3], passi: [5], attr: { 'data-toggle': 'allarme' } },
];

// Capitolato: voci per area, con prezzo "da" per metro quadro e risparmio di energia attribuibile
export const aree = [
	{ id: 'luci', nome: 'Luci e scenari', nota: 'Luce che segue la giornata, scene a un tocco', da: 14, risp: 0.03 },
	{ id: 'clima', nome: 'Clima intelligente', nota: 'Zone, programmi e risparmio quando sei via', da: 22, risp: 0.14 },
	{ id: 'sicurezza', nome: 'Sicurezza', nota: 'Serratura, sensori, telecamere, allarme', da: 26, risp: 0 },
	{ id: 'energia', nome: 'Energia', nota: 'Fotovoltaico, accumulo, ricarica auto', da: 48, risp: 0.32 },
	{ id: 'intrattenimento', nome: 'Audio e video', nota: 'Impianto multiroom e sala cinema', da: 18, risp: 0 },
	{ id: 'assistente', nome: 'Assistente e regole', nota: 'Le tue regole, anche a voce', da: 9, risp: 0.04 },
] as const;

export const tipi = [
	{ id: 'casa', nome: 'Casa', coeff: 1, base: 1900, mq: [50, 400, 110] },
	{ id: 'studio', nome: 'Studio professionale', coeff: 0.92, base: 2400, mq: [40, 250, 90] },
	{ id: 'ufficio', nome: 'Ufficio', coeff: 0.85, base: 3200, mq: [60, 600, 180] },
	{ id: 'negozio', nome: 'Negozio', coeff: 0.88, base: 2200, mq: [30, 400, 80] },
] as const;

export const casi = [
	{
		id: 'villa',
		nome: 'Villa sulle colline',
		luogo: 'Esempio · Brianza',
		tipo: 'Casa · 280 m²',
		titolo: 'Una villa che si spegne da sola',
		sfida: 'Quattro generazioni sotto lo stesso tetto, orari diversi e bollette in crescita: serviva una casa che sapesse di chi era la stanza e a che ora.',
		soluzione: 'Zone di clima per ogni piano, luci a scene, fotovoltaico con accumulo e un’unica regola “nessuno in casa”: tutto in modalità risparmio in un tocco.',
		numeri: [['−31%', 'energia dalla rete'], ['6', 'zone di clima'], ['2 giorni', 'di installazione']],
		piano: 'M10 10h120v70h-60v40h-60zM70 80h60v40h-60z',
	},
	{
		id: 'studio',
		nome: 'Studio notarile',
		luogo: 'Esempio · Milano',
		tipo: 'Studio · 140 m²',
		titolo: 'Un ufficio che apre e chiude con te',
		sfida: 'Accessi diversi per soci e personale, sale riunioni da prenotare e archivio da proteggere, senza chiavi da far girare.',
		soluzione: 'Serrature con chiavi digitali a tempo, sale che si preparano (luce, clima, schermo) all’orario della riunione e un allarme per zone.',
		numeri: [['0', 'chiavi fisiche in giro'], ['12', 'accessi a tempo'], ['−18%', 'consumi fuori orario']],
		piano: 'M10 10h50v50h-50zM60 10h70v30h-70zM60 40h70v50h-70zM10 60h50v50h-50z',
	},
	{
		id: 'loft',
		nome: 'Loft con terrazzo',
		luogo: 'Esempio · Torino',
		tipo: 'Casa · 95 m²',
		titolo: 'Piccolo, ma con tutto a portata di voce',
		sfida: 'Poco spazio e nessuna voglia di tavolette ovunque: comandi invisibili, cantiere senza opere murarie.',
		soluzione: 'Dispositivi senza fili, scene “film” e “cena”, tende motorizzate sul terrazzo e un assistente che risponde anche quando la connessione cade.',
		numeri: [['0', 'opere murarie'], ['4', 'scene a voce'], ['1 giorno', 'di installazione']],
		piano: 'M10 20h120v70h-120zM90 20v70',
	},
] as const;
