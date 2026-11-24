import type { SvgIconComponent } from '@mui/icons-material';
import GridViewOutlined from '@mui/icons-material/GridViewOutlined';
import MapOutlined from '@mui/icons-material/MapOutlined';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import StorageOutlined from '@mui/icons-material/StorageOutlined';
import MonitorHeartOutlined from '@mui/icons-material/MonitorHeartOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import type { ColorBadge, NombreIcono } from '../../types';

export const ICONOS: Record<NombreIcono, SvgIconComponent> = {
  resumen: GridViewOutlined,
  servicios: ShieldOutlined,
  territorio: MapOutlined,
  datos: StorageOutlined,
  actividad: MonitorHeartOutlined,
  calendario: CalendarMonthOutlined,
  ubicacion: PlaceOutlined,
  escudo: ShieldOutlined,
};

/** Color de cada servicio, usado en el Badge, las barras y los gráficos. */
export const COLOR_SERVICIO: Record<string, ColorBadge> = {
  'Seguridad Ciudadana': 'azul',
  'Gestión Sanitaria': 'verde',
  'Tránsito y Movilidad': 'naranja',
  'Servicios Municipales': 'morado',
  'Gestión de Siniestros': 'rojo',
  'Gestión de Riesgos': 'naranja',
  'Servicio Militar': 'gris',
};
export const colorDeServicio = (servicio: string): ColorBadge => COLOR_SERVICIO[servicio] ?? 'gris';
