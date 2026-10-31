import type { Registro } from "./tipos.js";

export function agruparPorTimestamp(registros: Registro[]): Map<String, Registro[]> {

    const grupos = new Map<string, Registro[]>();

    for (const registro of registros) {
        const grupo = grupos.get(registro.timestamp);
        
        if (grupo === undefined) {
            grupos.set(registro.timestamp, [registro]);
        } else {
            grupo.push(registro);
        }
    }

    return grupos;
}
