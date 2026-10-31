import { readFileSync } from "node:fs";
import type { Encontro } from "./tipos.js";

function chave(encontro: Encontro): string {
    const [x, y] = encontro.monitoradosEncontro;
    return `${encontro.timestamp}|${Math.min(x, y)}|${Math.max(x, y)}|${encontro.tipo}`;
}

function lerEncontros(caminho: string): Encontro[] {
    return JSON.parse(readFileSync(caminho, "utf-8")) as Encontro[];
}

const numero = process.argv[2] ?? "1";
const gerados = lerEncontros(`output/resultado${numero}.json`);
const esperados = lerEncontros(`output/respostas${numero}.json`);

const chavesEsperadas = new Set(esperados.map(chave));
const chavesGeradas = new Set(gerados.map(chave));

const corretos = gerados.filter((e) => chavesEsperadas.has(chave(e))).length;
const incorretos = gerados.length - corretos;
const faltantes = esperados.filter((e) => !chavesGeradas.has(chave(e))).length;

console.log(`dataset${numero}`);
console.log(`  esperados: ${esperados.length}`);
console.log(`  gerados:   ${gerados.length}`);
console.log(`  corretos:  ${corretos}`);
console.log(`  incorretos (a mais): ${incorretos}`);
console.log(`  faltantes: ${faltantes}`);
console.log(`  score: ${corretos - incorretos}`);