import { haversine } from "./haversine.js";
import type { Encontro, Registro, TipoEncontro } from "./tipos.js";

const RAIO_METROS = 20;

export interface ParProximo {
    a: Registro;
    b: Registro;
    distanciaMetros: number;
}

export function acharParesProximos(grupo: Registro[]): ParProximo[] {
    const pares: ParProximo[] = [];

    for (let i = 0; i < grupo.length; i++) {
        for (let j = i + 1; j < grupo.length; j++) {
            const a = grupo[i];
            const b = grupo[j];
            const distanciaMetros = haversine(a.lat, a.lon, b.lat, b.lon);

            if (distanciaMetros < RAIO_METROS) {
                pares.push({ a, b, distanciaMetros });
            }
        }
    }

    return pares;
}

export function classificar(a: Registro, b: Registro): TipoEncontro | null {
    if (a.medidaProtetiva || b.medidaProtetiva) {
        const vitima = a.medidaProtetiva ? a : b;
        const outro = a.medidaProtetiva ? b : a;

        return vitima.restricoes.includes(outro.id) ? "protetiva" : null;
    }

    if (a.faccao !== "" && a.faccao === b.faccao) {
        return "faccao";
    }

    return "generico";
}

export function criarEncontros(pares: ParProximo[]): Encontro[] {
    const encontros: Encontro[] = [];

    for (const { a, b, distanciaMetros } of pares) {
        const tipo = classificar(a, b);
        if (tipo === null) continue;

        encontros.push({
            tipo,
            monitoradosEncontro: [a.id, b.id],
            timestamp: a.timestamp,
            posicoes: {
                [a.id]: { lat: a.lat, lon: a.lon },
                [b.id]: { lat: b.lat, lon: b.lon },
            },
            distanciaMetros,
        });
        
    }

    return encontros;
}