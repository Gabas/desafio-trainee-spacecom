import { mkdirSync, writeFileSync } from "node:fs";
import { detectarEncontros } from "./processar.js";

const numero = process.argv[2] ?? "1";
const encontros = detectarEncontros(`data/dataset${numero}.txt`);

mkdirSync("output", { recursive: true });
writeFileSync(`output/resultado${numero}.json`, JSON.stringify(encontros, null, 2));

console.log(`dataset${numero}: ${encontros.length} encontros`);