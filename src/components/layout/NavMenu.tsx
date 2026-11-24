import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import MonitorHeartOutlined from '@mui/icons-material/MonitorHeartOutlined';
import { COLORES } from '../../theme';
import type { Fuente, Seccion, SeccionId } from '../../types';
import { ICONOS } from '../common/iconos';
import SourceCard from './SourceCard';

export type NavMenuProps = {
  secciones: Seccion[];
  seccionActiva: SeccionId;
  onNavegar: (id: SeccionId) => void;
  // Se reenvían a SourceCard (solo visible en escritorio).
  fuente: Fuente;
  actualizado: boolean;
};

/**
 * Menú de navegación. Es un único componente: en escritorio es una barra lateral fija
 * (icono + texto) y en móvil una barra superior con logo e iconos (solo cambia el CSS).
 */
export default function NavMenu({ secciones, seccionActiva, onNavegar, fuente, actualizado }: NavMenuProps) {
  return (
    <Box
      component="nav"
      aria-label="Secciones del dashboard"
      sx={{
        bgcolor: COLORES.marino,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        height: { md: '100vh' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: { xs: 2, md: 3 }, pt: { xs: 1.5, md: 3 }, pb: { xs: 1, md: 2.5 } }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 0.85,
            bgcolor: COLORES.azul,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <MonitorHeartOutlined sx={{ fontSize: 20 }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1rem', lineHeight: 1.15 }}>ECU 911</Typography>
          <Typography sx={{ display: { xs: 'none', md: 'block' }, fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>
            Analítica nacional
          </Typography>
        </Box>
      </Box>

      <Box
        component="ul"
        sx={{
          listStyle: 'none',
          m: 0,
          p: { xs: 1, md: 2 },
          pt: { md: 1 },
          display: 'flex',
          flexDirection: { xs: 'row', md: 'column' },
          gap: { xs: 0.5, md: 0.5 },
          borderTop: { md: '1px solid rgba(255,255,255,0.08)' },
        }}
      >
        {secciones.map((s) => {
          const activa = s.id === seccionActiva;
          const Icono = ICONOS[s.icono];
          return (
            <Box component="li" key={s.id} sx={{ flex: { xs: 1, md: 'none' } }}>
              <ButtonBase
                onClick={() => onNavegar(s.id)}
                aria-label={s.etiqueta}
                aria-current={activa ? 'true' : undefined}
                sx={{
                  width: '100%',
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  gap: 1.5,
                  px: 1.5,
                  py: { xs: 1, md: 1.25 },
                  borderRadius: 0.85,
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: activa ? '#fff' : 'rgba(255,255,255,0.65)',
                  bgcolor: activa ? COLORES.azul : 'transparent',
                  transition: 'background-color .15s',
                  '&:hover': { bgcolor: activa ? COLORES.azul : 'rgba(255,255,255,0.07)' },
                }}
              >
                <Icono sx={{ fontSize: 20 }} />
                <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
                  {s.etiqueta}
                </Box>
              </ButtonBase>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ mt: 'auto', display: { xs: 'none', md: 'block' } }}>
        <SourceCard fuente={fuente} actualizado={actualizado} />
      </Box>
    </Box>
  );
}
