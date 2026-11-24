import { useId, useState } from 'react';
import type { PointerEvent } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import { COLORES } from '../../theme';
import type { PuntoSerie } from '../../types';
import { formatoDecimal, formatoFecha, formatoNumero } from '../../utils/formatos';
import { useAncho } from '../../utils/useAncho';

export type TimeSeriesChartProps = {
  datos: PuntoSerie[];
  /** Variación porcentual para la nota de tendencia (opcional). */
  tendencia?: number;
};

const ALTO = 230;
const M = { izq: 34, der: 10, arr: 14, aba: 26 };

function techo(max: number): number {
  if (max <= 5) return 5;
  const paso = Math.pow(10, Math.floor(Math.log10(max)));
  return Math.ceil(max / paso) * paso;
}

/** Serie temporal diaria (SVG) con tooltip al pasar el puntero y nota de tendencia. */
export default function TimeSeriesChart({ datos, tendencia }: TimeSeriesChartProps) {
  const [ref, ancho] = useAncho<HTMLDivElement>();
  const [activo, setActivo] = useState<number | null>(null); // estado local: punto resaltado
  const gradId = useId();

  const n = datos.length;
  const maxY = techo(Math.max(0, ...datos.map((d) => d.total)));
  const w = Math.max(ancho - M.izq - M.der, 10);
  const h = ALTO - M.arr - M.aba;
  const x = (i: number) => M.izq + (n > 1 ? (i / (n - 1)) * w : 0);
  const y = (v: number) => M.arr + h - (v / maxY) * h;

  const linea = datos.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.total).toFixed(1)}`).join(' ');
  const area = n ? `${linea} L${x(n - 1).toFixed(1)},${M.arr + h} L${x(0).toFixed(1)},${M.arr + h} Z` : '';
  const marcasX = datos.map((_, i) => i).filter((i) => i % 7 === 0); // días 1, 8, 15, 22 y 29
  const idx = activo ?? n - 1;

  const alMover = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const i = Math.round(((e.clientX - r.left - M.izq) / w) * (n - 1));
    setActivo(Math.min(n - 1, Math.max(0, i)));
  };

  const sube = (tendencia ?? 0) >= 0;
  const Flecha = sube ? TrendingUp : TrendingDown;

  return (
    <Box>
      <Box ref={ref} sx={{ position: 'relative', width: '100%', height: ALTO }}>
        {ancho > 0 && n > 0 && (
          <>
            <svg
              width={ancho}
              height={ALTO}
              role="img"
              aria-label="Gráfico de emergencias por día"
              onPointerMove={alMover}
              onPointerLeave={() => setActivo(null)}
              style={{ display: 'block', touchAction: 'pan-y' }}
            >
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORES.azul} stopOpacity="0.28" />
                  <stop offset="100%" stopColor={COLORES.azul} stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 0.5, 1].map((t) => (
                <g key={t}>
                  <line x1={M.izq} x2={M.izq + w} y1={y(maxY * t)} y2={y(maxY * t)} stroke={COLORES.borde} strokeDasharray={t === 0 ? undefined : '3 4'} />
                  <text x={M.izq - 8} y={y(maxY * t) + 4} textAnchor="end" fontSize="10" fill={COLORES.textoSuave}>
                    {formatoNumero(maxY * t)}
                  </text>
                </g>
              ))}
              <path d={area} fill={`url(#${gradId})`} />
              <path d={linea} fill="none" stroke={COLORES.azul} strokeWidth="2.25" strokeLinejoin="round" strokeLinecap="round" />
              {marcasX.map((i) => (
                <text key={i} x={x(i)} y={ALTO - 6} textAnchor={i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'} fontSize="10" fill={COLORES.textoSuave}>
                  {`${Number(datos[i].fecha.slice(8))} oct`}
                </text>
              ))}
              {activo !== null && <line x1={x(idx)} x2={x(idx)} y1={M.arr} y2={M.arr + h} stroke={COLORES.azul} strokeOpacity="0.35" />}
              <circle cx={x(idx)} cy={y(datos[idx].total)} r="4.5" fill="#fff" stroke={COLORES.azul} strokeWidth="2.25" />
            </svg>
            {activo !== null && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: Math.min(Math.max(x(idx) - 55, 0), ancho - 110),
                  width: 110,
                  px: 1,
                  py: 0.5,
                  borderRadius: 0.6,
                  bgcolor: COLORES.marino,
                  color: '#fff',
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}
              >
                <b>{formatoNumero(datos[idx].total)}</b> · {formatoFecha(datos[idx].fecha).slice(0, 5)}
              </Box>
            )}
          </>
        )}
      </Box>
      {tendencia !== undefined && (
        <Box
          sx={{
            mt: 1.5,
            px: 1.5,
            py: 1,
            borderRadius: 1,
            bgcolor: COLORES.azulSuave,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Flecha sx={{ fontSize: 16, color: COLORES.azul }} />
          <Typography sx={{ fontSize: '0.72rem', color: COLORES.texto }}>
            <b>Tendencia {sube ? 'ascendente' : 'descendente'}</b>{' '}
            <Box component="span" sx={{ color: 'text.secondary' }}>
              El volumen diario {sube ? 'creció' : 'cayó'} {formatoDecimal(Math.abs(tendencia))}% frente a la semana anterior.
            </Box>
          </Typography>
        </Box>
      )}
    </Box>
  );
}
