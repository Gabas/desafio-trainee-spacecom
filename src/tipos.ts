export interface Registro {
    id: number;
    faccao: string;
    timestamp: string;
    lat: number;
    lon: number;
    medidaProtetiva: boolean;
    restricoes: number[];
}

export type TipoEncontro = "generico" | "faccao" | "protetiva";

export interface Posicao {
    lat: number;
    lon: number;
}

export interface Encontro {
    tipo: TipoEncontro;
    monitoradosEncontro: [number, number];
    timestamp: string;
    posicoes: Record<number, Posicao>;
    distanciaMetros: number;
}