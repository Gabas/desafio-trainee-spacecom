import { mkdirSync, writeFileSync } from "node:fs";
// import { performance } from "node:perf_hooks";
import { detectarEncontros } from "./processar.js";

const numero = process.argv[2] ?? "1";

// const inicio = performance.now();
const encontros = detectarEncontros(`data/dataset${numero}.txt`);
// const tempoTotal = performance.now() - inicio;

mkdirSync("output", { recursive: true });
writeFileSync(`output/resultado${numero}.json`, JSON.stringify(encontros, null, 2));

console.log(`dataset${numero}: ${encontros.length} encontros`);
// console.log(`Tempo total: ${tempoTotal} ms`);