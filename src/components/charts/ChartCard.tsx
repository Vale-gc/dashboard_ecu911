import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { COLORES } from '../../theme';

export type ChartCardProps = {
  etiqueta: string;
  titulo: string;
  subtitulo: string;
  children: ReactNode;
  /** Opcional: elemento a la derecha del encabezado (por ejemplo, un Badge). */
  accion?: ReactNode;
};

/** Marco común (reutilizable) de cada gráfico: etiqueta, título, subtítulo y contenido. */
export default function ChartCard({ etiqueta, titulo, subtitulo, children, accion }: ChartCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: { xs: 2, md: 3 }, borderRadius: 1.5, borderColor: COLORES.borde, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1, mb: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" sx={{ color: COLORES.azul }}>
            {etiqueta}
          </Typography>
          <Typography variant="h2" component="h2">
            {titulo}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{subtitulo}</Typography>
        </Box>
        {accion}
      </Box>
      <Box sx={{ flex: 1, minHeight: 0 }}>{children}</Box>
    </Paper>
  );
}
