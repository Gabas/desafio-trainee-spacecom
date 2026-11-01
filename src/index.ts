import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
// import { performance } from "node:perf_hooks";
import { detectarEncontros } from "./processar.js";

const argumento = process.argv[2] ?? "1";
const caminho = /^\d+$/.test(argumento) ? `data/dataset${argumento}.txt` : argumento;

// const inicio = performance.now();
// const tempoTotal = performance.now() - inicio;
if (!existsSync(caminho)) {
    console.error(`Arquivo não encontrado: ${caminho}`);
    console.error(`Coloque os arquivos de dataset no diretório data/(dataset1.txt ... dataset7.txt).`);
    process.exit(1);
}

const nome = basename(caminho, ".txt").replace(/^dataset/, "resultado");
const encontros = detectarEncontros(caminho);

mkdirSync("output", { recursive: true });
writeFileSync(`output/${nome}.json`, JSON.stringify(encontros, null, 2));

console.log(`${basename(caminho)}: ${encontros.length} encontros`);
// console.log(`Tempo total: ${tempoTotal} ms`);