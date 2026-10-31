export interface Registro {
    id: number;
    faccao: string;
    timestamp: string;
    lat: number;
    lon: number;
    medidaProtetiva: boolean;
    restricoes: number[];
}