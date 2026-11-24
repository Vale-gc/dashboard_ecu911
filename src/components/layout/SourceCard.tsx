import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { COLORES } from '../../theme';
import type { Fuente } from '../../types';

export type SourceCardProps = {
  fuente: Fuente;
  actualizado: boolean;
};

/** Tarjeta "Fuente oficial": origen de los datos y estado de actualización. */
export default function SourceCard({ fuente, actualizado }: SourceCardProps) {
  return (
    <Box
      sx={{
        m: 2,
        p: 2,
        borderRadius: 1.25,
        bgcolor: COLORES.marinoClaro,
        border: '1px solid rgba(255,255,255,0.08)',
        color: '#fff',
      }}
    >
      <Typography variant="overline" sx={{ color: COLORES.azul, filter: 'brightness(1.6)' }}>
        Fuente oficial
      </Typography>
      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', mt: 0.5 }}>{fuente.nombre}</Typography>
      <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)', mt: 0.25 }}>{fuente.entidad}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: actualizado ? COLORES.verde : COLORES.naranja,
          }}
        />
        <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)' }}>
          {actualizado ? 'Datos actualizados' : 'Datos desactualizados'}
        </Typography>
      </Box>
    </Box>
  );
}
