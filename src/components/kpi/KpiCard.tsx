import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { COLORES } from '../../theme';
import type { ColorBadge, NombreIcono } from '../../types';
import { formatoNumero, formatoVariacion } from '../../utils/formatos';
import { PALETA_BADGE } from '../common/Badge';
import { ICONOS } from '../common/iconos';

export type KpiCardProps = {
  titulo: string;
  detalle: string;
  icono: NombreIcono;
  valor: number | string;
  variacion?: number;
};

const COLOR_ICONO: Partial<Record<NombreIcono, ColorBadge>> = {
  actividad: 'azul',
  calendario: 'verde',
  ubicacion: 'morado',
  escudo: 'naranja',
};

/** Indicador clave (reutilizable): muestra un valor ya calculado, con icono y variación opcional. */
export default function KpiCard({ titulo, detalle, icono, valor, variacion }: KpiCardProps) {
  const Icono = ICONOS[icono];
  const color = PALETA_BADGE[COLOR_ICONO[icono] ?? 'azul'];
  const sube = (variacion ?? 0) >= 0;
  const esTexto = typeof valor === 'string' && /[^\d.,]/.test(valor); // p. ej. el nombre de una provincia
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1.75, md: 2.25 },
        borderRadius: 1.5,
        borderColor: COLORES.borde,
        position: 'relative',
        overflow: 'hidden',
        minWidth: 0,
      }}
    >
      <Box
        aria-hidden
        sx={{ position: 'absolute', right: -28, bottom: -28, width: 84, height: 84, borderRadius: '50%', bgcolor: color.fondo, opacity: 0.6 }}
      />
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 0.85, bgcolor: color.fondo, color: color.solido, display: 'grid', placeItems: 'center' }}>
          <Icono sx={{ fontSize: 18 }} />
        </Box>
        {variacion !== undefined && (
          <Box
            component="span"
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: 99,
              fontSize: '0.68rem',
              fontWeight: 700,
              bgcolor: sube ? PALETA_BADGE.verde.fondo : PALETA_BADGE.rojo.fondo,
              color: sube ? PALETA_BADGE.verde.texto : PALETA_BADGE.rojo.texto,
            }}
          >
            {formatoVariacion(variacion)}
          </Box>
        )}
      </Box>
      <Typography sx={{ position: 'relative', fontSize: '0.75rem', color: 'text.secondary', fontWeight: 500 }}>{titulo}</Typography>
      <Typography
        component="p"
        title={String(valor)}
        sx={{
          position: 'relative',
          fontSize: esTexto ? { xs: '1.05rem', md: '1.25rem' } : { xs: '1.4rem', md: '1.7rem' },
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: esTexto ? 1.25 : 1.2,
          my: 0.25,
          overflow: 'hidden',
          ...(esTexto
            ? { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }
            : { textOverflow: 'ellipsis', whiteSpace: 'nowrap' }),
        }}
      >
        {typeof valor === 'number' ? formatoNumero(valor) : valor}
      </Typography>
      <Typography sx={{ position: 'relative', fontSize: '0.7rem', color: 'text.secondary' }}>{detalle}</Typography>
    </Paper>
  );
}
