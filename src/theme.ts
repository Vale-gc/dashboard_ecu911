import { createTheme } from '@mui/material/styles';

export const COLORES = {
  azul: '#2563EB',
  azulSuave: '#E8F0FE',
  verde: '#12A37F',
  verdeSuave: '#E3F6F0',
  naranja: '#F59E0B',
  naranjaSuave: '#FEF3DC',
  morado: '#7C5CDB',
  moradoSuave: '#EFEAFC',
  rojo: '#E5484D',
  rojoSuave: '#FDEBEC',
  gris: '#64748B',
  grisSuave: '#EEF1F6',
  marino: '#0E1A33',
  marinoClaro: '#16264A',
  borde: '#E4E9F2',
  texto: '#0F172A',
  textoSuave: '#64748B',
};

// Punto de quiebre principal: 768 px separa móvil de escritorio (ver "Adaptación responsiva").
export const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 480, md: 768, lg: 1100, xl: 1536 } },
  palette: {
    primary: { main: COLORES.azul },
    success: { main: COLORES.verde },
    error: { main: COLORES.rojo },
    text: { primary: COLORES.texto, secondary: COLORES.textoSuave },
    background: { default: '#F4F6FB', paper: '#FFFFFF' },
    divider: COLORES.borde,
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    h1: { fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 },
    h2: { fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.01em' },
    overline: { fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', lineHeight: 1.4 },
    caption: { fontSize: '0.75rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontSize: '0.8125rem',
          fontWeight: 500,
          backgroundColor: '#fff',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: COLORES.borde },
        },
      },
    },
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});
