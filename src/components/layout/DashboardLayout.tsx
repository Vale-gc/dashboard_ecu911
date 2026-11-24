import type { ReactNode } from 'react';
import Box from '@mui/material/Box';

export type DashboardLayoutProps = {
  menu: ReactNode;
  children: ReactNode;
};

/** Estructura general: menú lateral fijo (escritorio) o barra superior (móvil) + contenido. */
export default function DashboardLayout({ menu, children }: DashboardLayoutProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '248px minmax(0, 1fr)' },
        minHeight: '100vh',
      }}
    >
      <Box component="aside" sx={{ position: 'sticky', top: 0, zIndex: 20, alignSelf: 'start' }}>
        {menu}
      </Box>
      <Box component="main" sx={{ px: { xs: 2, md: 4 }, py: { xs: 2.5, md: 4 }, minWidth: 0 }}>
        <Box sx={{ maxWidth: 1240, mx: 'auto', display: 'flex', flexDirection: 'column', gap: { xs: 2.5, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

/** Contenedor de cada sección del menú (ancla para el desplazamiento y el IntersectionObserver). */
export function SeccionDashboard({ id, children }: { id: string; children: ReactNode }) {
  return (
    <Box
      component="section"
      id={id}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2.5, md: 3 },
        scrollMarginTop: { xs: '116px', md: '24px' },
      }}
    >
      {children}
    </Box>
  );
}
