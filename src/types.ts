// Tipos compartidos por los componentes del dashboard (ver Tabla 4 de las props).

/** Registro del JSON generado en el Sprint 1 (una emergencia coordinada). */
export type Registro = {
  fecha: string; // ISO 8601: "2026-10-02"
  provincia: string | null;
  canton: string | null;
  cod_parroquia: string | null;
  parroquia: string | null;
  servicio: string;
  subtipo: string;
};

export type MetaDatos = {
  fuente: string;
  periodo: string;
  totalRegistrosOrigen: number;
  registrosEnMuestra: number;
  semilla: number;
};

export type Filtros = {
  periodo: string;
  provincia: string;
  canton: string;
  servicio: string;
};

export type ClaveFiltro = keyof Filtros;
export type OpcionesFiltros = Record<ClaveFiltro, string[]>;

export type SeccionId = 'resumen' | 'servicios' | 'territorio' | 'datos';
export type NombreIcono =
  | 'resumen'
  | 'servicios'
  | 'territorio'
  | 'datos'
  | 'actividad'
  | 'calendario'
  | 'ubicacion'
  | 'escudo';

export type Seccion = { id: SeccionId; etiqueta: string; icono: NombreIcono };

export type Fuente = { nombre: string; entidad: string };

export type Indicador = {
  titulo: string;
  valor: number | string;
  detalle: string;
  variacion?: number;
  icono: NombreIcono;
};

export type PuntoSerie = { fecha: string; total: number };
export type ServicioResumen = { nombre: string; casos: number; porcentaje: number };
export type ProvinciaResumen = { provincia: string; casos: number; porcentaje: number };
export type SubtipoResumen = { nombre: string; servicio: string; casos: number };

export type Columna<T> = {
  clave: keyof T & string;
  titulo: string;
  /** Opcional: dibuja la celda de forma personalizada (por ejemplo, con un Badge). */
  render?: (fila: T) => React.ReactNode;
};

export type ColorBadge = 'azul' | 'verde' | 'naranja' | 'morado' | 'rojo' | 'gris';
