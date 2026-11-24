import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import type { ServicioResumen } from '../../types';
import { formatoNumero, formatoPorcentaje } from '../../utils/formatos';
import { PALETA_BADGE } from '../common/Badge';
import { colorDeServicio } from '../common/iconos';

export type ServiceBreakdownProps = {
  servicios: ServicioResumen[];
};

/** Participación por tipo de servicio: barras horizontales con porcentaje y número de casos. */
export default function ServiceBreakdown({ servicios }: ServiceBreakdownProps) {
  if (!servicios.length) return <Typography color="text.secondary">Sin registros para los filtros elegidos.</Typography>;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {servicios.map((s) => {
        const p = PALETA_BADGE[colorDeServicio(s.nombre)];
        return (
          <Box key={s.nombre}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 0.75 }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{s.nombre}</Typography>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: p.texto }}>{formatoPorcentaje(s.porcentaje, s.porcentaje < 10 ? 1 : 0)}</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={s.porcentaje}
              aria-label={`${s.nombre}: ${formatoPorcentaje(s.porcentaje)}`}
              sx={{ height: 8, borderRadius: 99, bgcolor: p.fondo, '& .MuiLinearProgress-bar': { bgcolor: p.solido, borderRadius: 99 } }}
            />
            <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary', mt: 0.5 }}>{formatoNumero(s.casos)} casos</Typography>
          </Box>
        );
      })}
    </Box>
  );
}
