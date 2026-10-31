import { readFileSync } from "node:fs";
import type { Registro } from "./tipos.js";

function semAspas(str: string): string {
    return str.replaceAll('"', "").trim();
}

export function parsearLinha(linha: string): Registro {
    const [id, faccao, timestamp, lat, lon, medida, restricoes] = linha.split(";");

    const listaRestricoes = semAspas(restricoes);

    return {
        id: Number(id),
        faccao: semAspas(faccao),
        timestamp: semAspas(timestamp),
        lat: Number(lat),
        lon: Number(lon),
        medidaProtetiva: semAspas(medida) === "true",
        restricoes: listaRestricoes === "" ? [] : listaRestricoes.split(",").map(Number),
    };
}

export function lerDataset(caminho: string): Registro[] {
    const conteudo = readFileSync(caminho, "utf-8");
    const linhas = conteudo.split("\n").slice(1);

    const registros: Registro[] = [];
    for (const linha of linhas) {
        if (linha.trim() === "") continue;
        registros.push(parsearLinha(linha));
    }

    return registros;
}