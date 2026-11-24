import type {
  Filtros,
  OpcionesFiltros,
  ProvinciaResumen,
  PuntoSerie,
  Registro,
  ServicioResumen,
  SubtipoResumen,
} from '../types';
import { nombreLegible } from './formatos';

export const TODAS_PROVINCIAS = 'Todas las provincias';
export const TODOS_CANTONES = 'Todos los cantones';
export const TODOS_SERVICIOS = 'Todos los servicios';

export const FILTROS_INICIALES = (periodo: string): Filtros => ({
  periodo,
  provincia: TODAS_PROVINCIAS,
  canton: TODOS_CANTONES,
  servicio: TODOS_SERVICIOS,
});

const ordenar = (a: string, b: string) => a.localeCompare(b, 'es');

export function filtrarRegistros(registros: Registro[], f: Filtros): Registro[] {
  return registros.filter(
    (r) =>
      (f.provincia === TODAS_PROVINCIAS || (r.provincia !== null && nombreLegible(r.provincia) === f.provincia)) &&
      (f.canton === TODOS_CANTONES || (r.canton !== null && nombreLegible(r.canton) === f.canton)) &&
      (f.servicio === TODOS_SERVICIOS || r.servicio === f.servicio),
  );
}

export function calcularOpciones(registros: Registro[], filtros: Filtros, periodo: string): OpcionesFiltros {
  const provincias = new Set<string>();
  const cantones = new Set<string>();
  const servicios = new Set<string>();
  for (const r of registros) {
    if (r.provincia) provincias.add(nombreLegible(r.provincia));
    if (
      r.canton &&
      r.provincia &&
      (filtros.provincia === TODAS_PROVINCIAS || nombreLegible(r.provincia) === filtros.provincia)
    ) {
      cantones.add(nombreLegible(r.canton));
    }
    servicios.add(r.servicio);
  }
  return {
    periodo: [periodo],
    provincia: [TODAS_PROVINCIAS, ...[...provincias].sort(ordenar)],
    canton: [TODOS_CANTONES, ...[...cantones].sort(ordenar)],
    servicio: [TODOS_SERVICIOS, ...[...servicios].sort(ordenar)],
  };
}

function contar<T>(items: T[], clave: (x: T) => string | null): Map<string, number> {
  const m = new Map<string, number>();
  for (const it of items) {
    const k = clave(it);
    if (k !== null) m.set(k, (m.get(k) ?? 0) + 1);
  }
  return m;
}

const topN = (m: Map<string, number>) => [...m.entries()].sort((a, b) => b[1] - a[1] || ordenar(a[0], b[0]));

/** Serie diaria completa del mes (los días sin registros cuentan 0). */
export function serieDiaria(registros: Registro[], mesISO: string): PuntoSerie[] {
  const [a, m] = mesISO.split('-').map(Number);
  const dias = new Date(a, m, 0).getDate();
  const porDia = contar(registros, (r) => r.fecha);
  return Array.from({ length: dias }, (_, i) => {
    const fecha = `${mesISO}-${String(i + 1).padStart(2, '0')}`;
    return { fecha, total: porDia.get(fecha) ?? 0 };
  });
}

const suma = (xs: PuntoSerie[]) => xs.reduce((s, p) => s + p.total, 0);

function variacion(actual: number, previo: number): number | undefined {
  return previo > 0 ? ((actual - previo) / previo) * 100 : undefined;
}

/** Últimos 7 días del periodo frente a los 7 días anteriores. */
export function variacionSemanal(serie: PuntoSerie[]): number | undefined {
  const n = serie.length;
  return variacion(suma(serie.slice(n - 7)), suma(serie.slice(n - 14, n - 7)));
}

/** Promedio diario de la 2.ª quincena frente a la 1.ª. */
export function variacionQuincenal(serie: PuntoSerie[]): number | undefined {
  const mitad = Math.floor(serie.length / 2);
  const a = serie.slice(0, mitad);
  const b = serie.slice(mitad);
  return variacion(suma(b) / b.length, suma(a) / a.length);
}

/** Servicios ordenados; los que exceden `maximo` se agrupan en "Otros servicios". */
export function resumenServicios(registros: Registro[], maximo = 4): ServicioResumen[] {
  const total = registros.length;
  if (!total) return [];
  const lista = topN(contar(registros, (r) => r.servicio));
  const visibles = lista.slice(0, maximo);
  const resto = lista.slice(maximo).reduce((s, [, c]) => s + c, 0);
  if (resto > 0) visibles.push(['Otros servicios', resto]);
  return visibles.map(([nombre, casos]) => ({ nombre, casos, porcentaje: (casos / total) * 100 }));
}

export function resumenProvincias(registros: Registro[]): ProvinciaResumen[] {
  const total = registros.filter((r) => r.provincia).length; // los registros sin ubicación no entran al mapa
  return topN(contar(registros, (r) => r.provincia)).map(([provincia, casos]) => ({
    provincia,
    casos,
    porcentaje: total ? (casos / total) * 100 : 0,
  }));
}

export function resumenSubtipos(registros: Registro[], limite = 5): SubtipoResumen[] {
  const servicioDe = new Map<string, string>();
  for (const r of registros) servicioDe.set(r.subtipo, r.servicio);
  return topN(contar(registros, (r) => r.subtipo))
    .slice(0, limite)
    .map(([nombre, casos]) => ({ nombre, servicio: servicioDe.get(nombre) ?? '', casos }));
}
