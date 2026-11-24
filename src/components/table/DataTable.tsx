import { useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { COLORES } from '../../theme';
import type { Columna } from '../../types';

export type DataTableProps<T extends object> = {
  columnas: Columna<T>[];
  filas: T[];
  filasPorPagina: number;
};

/**
 * Tabla genérica (reutilizable): se configura con columnas y filas.
 * El orden y la página son estado LOCAL (useState), porque solo afectan a esta tabla.
 */
export default function DataTable<T extends object>({ columnas, filas, filasPorPagina }: DataTableProps<T>) {
  const [orden, setOrden] = useState<{ clave: (keyof T & string) | null; dir: 'asc' | 'desc' }>({ clave: null, dir: 'asc' });
  const [pagina, setPagina] = useState(0);

  const ordenarPor = (clave: keyof T & string) => {
    setOrden((o) => (o.clave === clave ? { clave, dir: o.dir === 'asc' ? 'desc' : 'asc' } : { clave, dir: 'asc' }));
    setPagina(0);
  };

  const ordenadas = orden.clave
    ? [...filas].sort((a, b) => {
        const va = String(a[orden.clave!] ?? '');
        const vb = String(b[orden.clave!] ?? '');
        return (orden.dir === 'asc' ? 1 : -1) * va.localeCompare(vb, 'es', { numeric: true });
      })
    : filas;

  // Si los filtros reducen las filas, se evita quedar en una página que ya no existe.
  const paginaSegura = Math.min(pagina, Math.max(0, Math.ceil(filas.length / filasPorPagina) - 1));
  const visibles = ordenadas.slice(paginaSegura * filasPorPagina, (paginaSegura + 1) * filasPorPagina);

  return (
    <Box>
      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table size="small" sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow>
              {columnas.map((c) => (
                <TableCell
                  key={c.clave}
                  sortDirection={orden.clave === c.clave ? orden.dir : false}
                  sx={{ bgcolor: '#F6F8FC', color: COLORES.azul, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: `1px solid ${COLORES.borde}`, whiteSpace: 'nowrap' }}
                >
                  <TableSortLabel
                    active={orden.clave === c.clave}
                    direction={orden.clave === c.clave ? orden.dir : 'asc'}
                    onClick={() => ordenarPor(c.clave)}
                    sx={{ '&.Mui-active, &:hover': { color: COLORES.azul } }}
                  >
                    {c.titulo}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibles.map((f, i) => (
              <TableRow key={i} hover>
                {columnas.map((c) => (
                  <TableCell key={c.clave} sx={{ fontSize: '0.75rem', color: COLORES.textoSuave, borderBottom: `1px solid ${COLORES.borde}`, py: 1.25, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {c.render ? c.render(f) : String(f[c.clave] ?? '—')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {visibles.length === 0 && (
              <TableRow>
                <TableCell colSpan={columnas.length} sx={{ textAlign: 'center', color: 'text.secondary', py: 4 }}>
                  No hay registros para los filtros elegidos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filas.length}
        page={paginaSegura}
        rowsPerPage={filasPorPagina}
        rowsPerPageOptions={[filasPorPagina]}
        onPageChange={(_, p) => setPagina(p)}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count}`}
        sx={{ '.MuiTablePagination-toolbar': { px: 0 }, '.MuiTablePagination-selectLabel': { display: 'none' } }}
      />
    </Box>
  );
}
