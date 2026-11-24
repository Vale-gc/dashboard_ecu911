/** Formatos de presentación en español (separador de miles ".", decimal ","). */
export function formatoNumero(n: number): string {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function formatoDecimal(n: number, decimales = 1): string {
  return n.toFixed(decimales).replace('.', ',');
}

export function formatoPorcentaje(n: number, decimales = 1): string {
  return `${formatoDecimal(n, decimales)}%`;
}

export function formatoVariacion(n: number): string {
  return `${n > 0 ? '+' : ''}${formatoDecimal(n, 1)}%`;
}

/** "2026-10-02" -> "02/10/2026" */
export function formatoFecha(iso: string): string {
  const [a, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${a}`;
}

const ACENTOS: Record<string, string> = {
  MANABI: 'Manabí',
  'LOS RIOS': 'Los Ríos',
  SUCUMBIOS: 'Sucumbíos',
  GALAPAGOS: 'Galápagos',
  'SANTO DOMINGO DE LOS TSACHILAS': 'Santo Domingo de los Tsáchilas',
  'ZONA NO DELIMITADA': 'Zona no delimitada',
};
const MINUSCULAS = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'y']);

/** "GUAYAS" -> "Guayas", "SANTA ELENA" -> "Santa Elena" (los datos vienen en mayúsculas). */
export function nombreLegible(texto: string): string {
  if (ACENTOS[texto]) return ACENTOS[texto];
  return texto
    .toLowerCase()
    .split(' ')
    .map((p, i) => (i > 0 && MINUSCULAS.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(' ');
}
