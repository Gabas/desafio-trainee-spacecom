import { lerDataset } from "./leitor.js";
import { agruparPorTimestamp } from "./agrupador.js";
import { acharParesProximos, criarEncontros } from "./detector.js";
import type { Encontro } from "./tipos.js";

const grupos = agruparPorTimestamp(lerDataset("data/dataset1.txt"));

const encontros: Encontro[] = [];

for  (const grupo of grupos.values()) {
    encontros.push(...criarEncontros(acharParesProximos(grupo)));
}

const porTipo = { generico: 0, faccao: 0, protetiva: 0 };

for (const encontro of encontros) {
    porTipo[encontro.tipo]++;
}

console.log(encontros.length);
console.log(porTipo);
console.log(encontros[0]);