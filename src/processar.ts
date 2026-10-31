import { lerLinhas, parsearLinha } from "./leitor.js";
import { acharParesProximos, criarEncontros } from "./detector.js";
import type { Encontro, Registro } from "./tipos.js";

export function detectarEncontros(caminho: string): Encontro[] {
    const encontros: Encontro[] = [];
    let grupo: Registro[] = [];
    let timestampAtual = "";
    let isCabecalho = true;

    const fecharGrupo = (): void => {
        for (const encontro of criarEncontros(acharParesProximos(grupo))) {
            encontros.push(encontro);
        }
        grupo = [];
    };

    for (const linha of lerLinhas(caminho)) {
        if (isCabecalho) {
            isCabecalho = false;
            continue;
        }
        if (linha.trim() === "") continue;

        const registro = parsearLinha(linha);

        if (registro.timestamp !== timestampAtual) {
            if (registro.timestamp < timestampAtual) {
                throw new Error(`Timestamp fora de ordem: ${registro.timestamp} < ${timestampAtual}`);
            }
            fecharGrupo();
            timestampAtual = registro.timestamp;
        }

        grupo.push(registro);
    }

    fecharGrupo();
    return encontros;

}