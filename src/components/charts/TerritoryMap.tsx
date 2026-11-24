import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CENTROIDES, CONTORNO } from '../../data/geografia';
import { COLORES } from '../../theme';
import type { ProvinciaResumen } from '../../types';
import { formatoNumero, nombreLegible } from '../../utils/formatos';

export type TerritoryMapProps = {
  provincias: ProvinciaResumen[];
};

const LON0 = -81.4;
const LAT0 = 1.7;
const ESCALA = 50;
const ANCHO = 320;
const ALTO = 345;
const px = (lon: number) => (lon - LON0) * ESCALA;
const py = (lat: number) => (LAT0 - lat) * ESCALA;

// Escala de color: de azul claro (pocos casos) a azul intenso (muchos).
const COLOR_ESCALA = ['#CFE0FD', '#9DBEF9', '#6B9BF4', '#3F78EA', '#1D4ED8'];
const colorPara = (t: number) => COLOR_ESCALA[Math.min(COLOR_ESCALA.length - 1, Math.floor(t * COLOR_ESCALA.length))];

/** Mapa de calor esquemático del Ecuador continental: una burbuja por provincia. */
export default function TerritoryMap({ provincias }: TerritoryMapProps) {
  const max = Math.max(1, ...provincias.map((p) => p.casos));
  const contorno = CONTORNO.map(([lo, la], i) => `${i ? 'L' : 'M'}${px(lo).toFixed(1)},${py(la).toFixed(1)}`).join(' ') + ' Z';
  // Se dibujan primero las burbujas grandes para que las pequeñas queden encima.
  const burbujas = [...provincias].filter((p) => CENTROIDES[p.provincia]).sort((a, b) => b.casos - a.casos);

  return (
    <Box sx={{ width: '100%', maxWidth: 320, mx: 'auto' }}>
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} width="100%" role="img" aria-label="Mapa de calor de emergencias por provincia" style={{ display: 'block' }}>
        <path d={contorno} fill="#EDF2FB" stroke="#C9D6EE" strokeWidth="1.5" strokeLinejoin="round" />
        {burbujas.map((p) => {
          const t = Math.sqrt(p.casos / max);
          const [lo, la] = CENTROIDES[p.provincia];
          const r = 6 + 20 * t;
          return (
            <g key={p.provincia}>
              <title>{`${nombreLegible(p.provincia)}: ${formatoNumero(p.casos)} emergencias`}</title>
              <circle cx={px(lo)} cy={py(la)} r={r} fill={colorPara(t)} fillOpacity="0.8" stroke="#fff" strokeWidth="1.5" />
              {t > 0.45 && <circle cx={px(lo)} cy={py(la)} r="2.5" fill="#fff" />}
            </g>
          );
        })}
      </svg>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 1 }}>
        <Typography sx={{ fontSize: '0.65rem', color: COLORES.textoSuave }}>Menor</Typography>
        {COLOR_ESCALA.map((c) => (
          <Box key={c} sx={{ width: 22, height: 6, borderRadius: 99, bgcolor: c }} />
        ))}
        <Typography sx={{ fontSize: '0.65rem', color: COLORES.textoSuave }}>Mayor</Typography>
      </Box>
      <Typography sx={{ fontSize: '0.62rem', color: COLORES.textoSuave, textAlign: 'center', mt: 0.5 }}>
        Mapa esquemático · Galápagos no se representa
      </Typography>
    </Box>
  );
}
