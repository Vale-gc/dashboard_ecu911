import muestra from './incidentes_muestra.json';
import type { Fuente, MetaDatos, Registro, Seccion } from '../types';

/** Datos de ejemplo: muestra aleatoria (semilla 911) del JSON del Sprint 1. */
export const META: MetaDatos = muestra.meta;
export const REGISTROS: Registro[] = muestra.registros;

export const FUENTE: Fuente = {
  nombre: 'Base de Emergencias',
  entidad: 'Servicio Integrado de Seguridad ECU 911',
};

export const SECCIONES: Seccion[] = [
  { id: 'resumen', etiqueta: 'Resumen', icono: 'resumen' },
  { id: 'servicios', etiqueta: 'Servicios', icono: 'servicios' },
  { id: 'territorio', etiqueta: 'Territorio', icono: 'territorio' },
  { id: 'datos', etiqueta: 'Datos', icono: 'datos' },
];
