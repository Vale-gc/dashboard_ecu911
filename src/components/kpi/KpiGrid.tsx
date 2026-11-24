import Box from '@mui/material/Box';
import type { Indicador } from '../../types';
import KpiCard from './KpiCard';

export type KpiGridProps = {
  indicadores: Indicador[];
};

/** Distribuye los indicadores: 4 columnas en escritorio, cuadrícula de 2 columnas en móvil. */
export default function KpiGrid({ indicadores }: KpiGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
        gap: { xs: 1.5, md: 2.5 },
      }}
    >
      {indicadores.map((i) => (
        <KpiCard key={i.titulo} {...i} />
      ))}
    </Box>
  );
}
