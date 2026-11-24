import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';
import { COLORES } from '../../theme';

export type HeaderProps = {
  etiqueta: string;
  titulo: string;
  subtitulo: string;
  onExportar: () => void;
};

/** Encabezado: etiqueta, título, subtítulo y botón "Exportar resumen" (solo icono en móvil). */
export default function Header({ etiqueta, titulo, subtitulo, onExportar }: HeaderProps) {
  const botonSx = { borderColor: COLORES.borde, color: COLORES.texto, bgcolor: '#fff' };
  return (
    <Box component="header" sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="overline" sx={{ color: COLORES.azul }}>
          {etiqueta}
        </Typography>
        <Typography variant="h1" component="h1" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
          {titulo}
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.8rem', md: '0.875rem' }, mt: 0.5 }}>
          {subtitulo}
        </Typography>
      </Box>
      <Button
        variant="outlined"
        onClick={onExportar}
        startIcon={<FileDownloadOutlined />}
        sx={{ ...botonSx, display: { xs: 'none', md: 'inline-flex' }, flexShrink: 0, borderRadius: 1, px: 2.5, py: 1.1 }}
      >
        Exportar resumen
      </Button>
      <IconButton
        onClick={onExportar}
        aria-label="Exportar resumen"
        sx={{ ...botonSx, display: { xs: 'inline-flex', md: 'none' }, border: '1px solid', borderRadius: 1, flexShrink: 0 }}
      >
        <FileDownloadOutlined />
      </IconButton>
    </Box>
  );
}
