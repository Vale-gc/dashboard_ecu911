// Mapa esquemático del Ecuador continental (aproximado, sin fines cartográficos).
// Coordenadas [longitud, latitud] del centro de cada provincia.
export const CENTROIDES: Record<string, [number, number]> = {
  AZUAY: [-79.0, -2.9],
  BOLIVAR: [-79.05, -1.7],
  'CAÑAR': [-79.0, -2.55],
  CARCHI: [-77.9, 0.72],
  CHIMBORAZO: [-78.75, -1.95],
  COTOPAXI: [-78.75, -0.8],
  'EL ORO': [-79.8, -3.4],
  ESMERALDAS: [-79.35, 0.75],
  GUAYAS: [-80.0, -2.2],
  IMBABURA: [-78.3, 0.4],
  LOJA: [-79.7, -4.2],
  'LOS RIOS': [-79.55, -1.5],
  MANABI: [-80.2, -0.95],
  'MORONA SANTIAGO': [-78.0, -2.5],
  NAPO: [-77.8, -0.95],
  ORELLANA: [-76.9, -0.6],
  PASTAZA: [-77.8, -1.8],
  PICHINCHA: [-78.6, -0.2],
  'SANTA ELENA': [-80.65, -2.2],
  'SANTO DOMINGO DE LOS TSACHILAS': [-79.2, -0.3],
  SUCUMBIOS: [-76.6, 0.1],
  TUNGURAHUA: [-78.6, -1.25],
  'ZAMORA CHINCHIPE': [-78.7, -4.1],
};

// Contorno aproximado (lon, lat), en sentido horario.
export const CONTORNO: [number, number][] = [
  [-79.0, 1.45], [-78.4, 1.2], [-77.9, 0.8], [-77.5, 0.6], [-77.0, 0.35], [-76.4, 0.25],
  [-75.3, -0.1], [-75.5, -0.9], [-76.0, -1.5], [-76.7, -1.8], [-77.3, -2.3], [-78.0, -3.0],
  [-78.5, -3.4], [-78.4, -4.2], [-78.9, -4.9], [-79.3, -4.5], [-79.6, -4.3], [-80.2, -4.4],
  [-80.4, -3.9], [-80.1, -3.4], [-80.3, -3.0], [-80.9, -2.3], [-81.0, -2.2], [-80.6, -1.8],
  [-80.8, -1.2], [-80.5, -0.8], [-80.1, -0.2], [-80.1, 0.5], [-79.9, 0.9],
];
