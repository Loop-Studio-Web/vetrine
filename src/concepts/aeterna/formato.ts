// Formattazione condivisa dentro Aeterna (sicura anche lato server, a differenza di motore.ts che usa il browser).
/** Euro con la virgola. */
export const euro = (n: number) => `€\u00a0${n.toLocaleString('it-IT')}`;
