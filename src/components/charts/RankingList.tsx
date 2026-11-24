import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { COLORES } from '../../theme';
import type { ProvinciaResumen } from '../../types';
import { formatoNumero, formatoPorcentaje, nombreLegible } from '../../utils/formatos';

export type RankingListProps = {
  items: ProvinciaResumen[];
  limite: number;
};

/** Provincias con más casos, ordenadas, con su número de emergencias y porcentaje. */
export default function RankingList({ items, limite }: RankingListProps) {
  const visibles = items.slice(0, limite);
  if (!visibles.length) return <Typography color="text.secondary">Sin datos territoriales.</Typography>;
  return (
    <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {visibles.map((p, i) => (
        <Box
          component="li"
          key={p.provincia}
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5, borderBottom: i < visibles.length - 1 ? `1px solid ${COLORES.borde}` : 'none' }}
        >
          <Box sx={{ width: 22, height: 22, borderRadius: 0.6, bgcolor: COLORES.grisSuave, display: 'grid', placeItems: 'center', fontSize: '0.7rem', fontWeight: 700, color: COLORES.gris }}>
            {i + 1}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.2 }} noWrap>
              {nombreLegible(p.provincia)}
            </Typography>
            <Typography sx={{ fontSize: '0.68rem', color: 'text.secondary' }}>{formatoNumero(p.casos)} emergencias</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: COLORES.azul }}>{formatoPorcentaje(p.porcentaje)}</Typography>
        </Box>
      ))}
    </Box>
  );
}
