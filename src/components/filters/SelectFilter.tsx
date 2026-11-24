import { useId } from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { COLORES } from '../../theme';

export type SelectFilterProps = {
  etiqueta: string;
  opciones: string[];
  valor: string;
  onChange: (nuevoValor: string) => void;
};

/** Filtro desplegable (reutilizable): elige una opción y notifica el cambio. */
export default function SelectFilter({ etiqueta, opciones, valor, onChange }: SelectFilterProps) {
  const id = useId();
  return (
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography variant="overline" id={`${id}-label`} component="label" sx={{ color: COLORES.textoSuave, display: 'block', mb: 0.5 }}>
        {etiqueta}
      </Typography>
      <Select
        size="small"
        fullWidth
        value={valor}
        labelId={`${id}-label`}
        onChange={(e) => onChange(e.target.value)}
        MenuProps={{ slotProps: { paper: { sx: { maxHeight: 320 } } } }}
      >
        {opciones.map((o) => (
          <MenuItem key={o} value={o} sx={{ fontSize: '0.8125rem' }}>
            {o}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
