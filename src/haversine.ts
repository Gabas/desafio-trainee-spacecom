export const RAIO_TERRA_METROS = 6371000;

const GRAUS_PARA_RADIANOS = Math.PI / 180;

function grausParaRadianos(graus: number): number {
  return graus * GRAUS_PARA_RADIANOS;
}

export function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {

    const phi1 = grausParaRadianos(lat1);
    const phi2 = grausParaRadianos(lat2);
    const deltaPhi = grausParaRadianos(lat2 - lat1);
    const deltaLambda = grausParaRadianos(lon2 - lon1);

    const a =
        Math.sin(deltaPhi / 2) ** 2 +
        Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return RAIO_TERRA_METROS * c;
}