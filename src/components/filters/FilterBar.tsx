import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TuneRounded from '@mui/icons-material/TuneRounded';
import { COLORES } from '../../theme';
import type { ClaveFiltro, Filtros, OpcionesFiltros } from '../../types';
import SelectFilter from './SelectFilter';

export type FilterBarProps = {
  filtros: Filtros;
  opciones: OpcionesFiltros;
  onCambiar: (filtro: ClaveFiltro, valor: string) => void;
  onRestablecer: () => void;
  /** Opcional: deshabilita "Restablecer" cuando ya están los valores iniciales. */
  hayCambios?: boolean;
};

const CAMPOS: { clave: ClaveFiltro; etiqueta: string }[] = [
  { clave: 'periodo', etiqueta: 'Periodo' },
  { clave: 'provincia', etiqueta: 'Provincia' },
  { clave: 'canton', etiqueta: 'Cantón' },
  { clave: 'servicio', etiqueta: 'Servicio' },
];

/** Barra de filtros: una fila en escritorio, apilada en una sola tarjeta en móvil. */
export default function FilterBar({ filtros, opciones, onCambiar, onRestablecer, hayCambios = true }: FilterBarProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 1.5,
        borderColor: COLORES.borde,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'flex-end' },
        gap: { xs: 2, md: 2.5 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: COLORES.textoSuave, pb: { md: 1 } }}>
        <TuneRounded fontSize="small" />
        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Filtros</Typography>
      </Box>
      {CAMPOS.map((c) => (
        <SelectFilter
          key={c.clave}
          etiqueta={c.etiqueta}
          opciones={opciones[c.clave]}
          valor={filtros[c.clave]}
          onChange={(v) => onCambiar(c.clave, v)}
        />
      ))}
      <Button
        onClick={onRestablecer}
        disabled={!hayCambios}
        sx={{ color: COLORES.azul, fontWeight: 700, alignSelf: { xs: 'center', md: 'flex-end' }, mb: { md: 0.25 } }}
      >
        Restablecer
      </Button>
    </Paper>
  );
}
