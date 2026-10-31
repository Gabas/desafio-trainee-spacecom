import { lerDataset } from "./leitor.js";
import { agruparPorTimestamp } from "./agrupador.js";
import { acharParesProximos, criarEncontros } from "./detector.js";
import type { Encontro } from "./tipos.js";

export function detectarEncontros(caminho: string): Encontro[] {
    const grupos = agruparPorTimestamp(lerDataset(caminho));

    const encontros: Encontro[] = [];
    for (const grupo of grupos.values()) {
        encontros.push(...criarEncontros(acharParesProximos(grupo)));
    }

    return encontros;
}