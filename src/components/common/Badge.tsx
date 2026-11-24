import Box from '@mui/material/Box';
import { COLORES } from '../../theme';
import type { ColorBadge } from '../../types';

export type BadgeProps = {
  texto: string;
  color: ColorBadge;
};

export const PALETA_BADGE: Record<ColorBadge, { fondo: string; texto: string; solido: string }> = {
  azul: { fondo: COLORES.azulSuave, texto: '#1D4ED8', solido: COLORES.azul },
  verde: { fondo: COLORES.verdeSuave, texto: '#0B7A5F', solido: COLORES.verde },
  naranja: { fondo: COLORES.naranjaSuave, texto: '#A15C07', solido: COLORES.naranja },
  morado: { fondo: COLORES.moradoSuave, texto: '#5B3FB8', solido: COLORES.morado },
  rojo: { fondo: COLORES.rojoSuave, texto: '#B4282D', solido: COLORES.rojo },
  gris: { fondo: COLORES.grisSuave, texto: '#475569', solido: COLORES.gris },
};

/** Etiqueta de color (reutilizable): resalta el tipo de servicio o un contador. */
export default function Badge({ texto, color }: BadgeProps) {
  const p = PALETA_BADGE[color];
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        px: 1.25,
        py: 0.4,
        borderRadius: 99,
        bgcolor: p.fondo,
        color: p.texto,
        fontSize: '0.7rem',
        fontWeight: 700,
        lineHeight: 1.3,
        whiteSpace: 'nowrap',
      }}
    >
      {texto}
    </Box>
  );
}
