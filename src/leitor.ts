import { closeSync, openSync, readSync } from "node:fs";
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

const TAMANHO_BUFFER = 8 * 1024 * 1024; // 8MB

export function* lerLinhas(caminho: string): Generator<string> {
    const arquivo = openSync(caminho, "r");
    const buffer = Buffer.alloc(TAMANHO_BUFFER);
    let resto = "";

    try {
        let lidos = readSync(arquivo, buffer, 0, buffer.length, null);
        while (lidos > 0) {
            const linhas = (resto + buffer.toString("latin1", 0, lidos)).split("\n");
            resto = linhas.pop() ?? "";

            yield* linhas;
            lidos = readSync(arquivo, buffer, 0, buffer.length, null);
        }
        if (resto !== "") {
            yield resto;
        }
    } finally {
        closeSync(arquivo);
    }
}