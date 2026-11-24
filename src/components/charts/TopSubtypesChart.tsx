import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { COLORES } from '../../theme';
import type { SubtipoResumen } from '../../types';
import { formatoNumero } from '../../utils/formatos';
import { PALETA_BADGE } from '../common/Badge';
import { colorDeServicio } from '../common/iconos';

export type TopSubtypesChartProps = {
  subtipos: SubtipoResumen[];
  onVerDetalle: () => void;
};

const ALTO_BARRAS = 170;

/** Subtipos de incidente más frecuentes (barras verticales) con acceso a la sección Servicios. */
export default function TopSubtypesChart({ subtipos, onVerDetalle }: TopSubtypesChartProps) {
  const max = Math.max(1, ...subtipos.map((s) => s.casos));
  return (
    <Box>
      {subtipos.length === 0 ? (
        <Typography color="text.secondary">Sin registros para los filtros elegidos.</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${subtipos.length}, minmax(0, 1fr))`, gap: { xs: 0.75, md: 1.5 } }}>
          {subtipos.map((s) => {
            const p = PALETA_BADGE[colorDeServicio(s.servicio)];
            return (
              <Box key={s.nombre} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 0 }}>
                <Typography sx={{ fontSize: { xs: '0.68rem', md: '0.75rem' }, fontWeight: 700, mb: 0.5 }}>{formatoNumero(s.casos)}</Typography>
                <Box sx={{ height: ALTO_BARRAS, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                  <Box
                    title={`${s.nombre}: ${formatoNumero(s.casos)}`}
                    sx={{ width: { xs: '70%', md: '60%' }, maxWidth: 44, height: `${Math.max(4, (s.casos / max) * 100)}%`, bgcolor: p.solido, borderRadius: '8px 8px 2px 2px' }}
                  />
                </Box>
                <Typography
                  sx={{
                    mt: 1,
                    fontSize: { xs: '0.6rem', md: '0.68rem' },
                    fontWeight: 600,
                    textAlign: 'center',
                    lineHeight: 1.25,
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    width: '100%',
                    overflowWrap: 'anywhere',
                    minHeight: { xs: '3.2em', md: '3.4em' },
                  }}
                >
                  {s.nombre}
                </Typography>
                <Typography sx={{ fontSize: '0.58rem', color: 'text.secondary', textAlign: 'center', mt: 0.25, lineHeight: 1.2, overflowWrap: 'anywhere' }}>
                  {s.servicio}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
      <Button
        fullWidth
        onClick={onVerDetalle}
        endIcon={<ArrowForward />}
        sx={{ mt: 2.5, py: 1.1, borderRadius: 1, bgcolor: COLORES.grisSuave, color: COLORES.azul, fontWeight: 700, '&:hover': { bgcolor: COLORES.azulSuave } }}
      >
        Ver detalle de servicios
      </Button>
    </Box>
  );
}
