import { get, ref } from 'firebase/database';
import type { MetaDatos, Registro } from '../types';
import { firebaseConfigurado, obtenerDb } from './config';

export type Emergencias = { meta: MetaDatos; registros: Registro[] };

/**
 * Estructura en Realtime Database (el JSON del Sprint 1 se importó en la raíz):
 *   /meta       → datos del archivo (fuente, periodo, totales)
 *   /registros  → lista de emergencias (claves 0, 1, 2, …)
 */
type RegistroCrudo = Partial<Registro>;

/**
 * Firebase no guarda valores `null`: un campo nulo del JSON simplemente no existe en la base.
 * Se vuelve a `null` para respetar el tipo `Registro` que usan los componentes.
 */
function normalizar(r: RegistroCrudo): Registro {
  return {
    fecha: r.fecha ?? '',
    provincia: r.provincia ?? null,
    canton: r.canton ?? null,
    cod_parroquia: r.cod_parroquia ?? null,
    parroquia: r.parroquia ?? null,
    servicio: r.servicio ?? '',
    subtipo: r.subtipo ?? '',
  };
}

/** Lee `meta` y `registros` de Firebase en paralelo. */
export async function obtenerEmergencias(): Promise<Emergencias> {
  if (!firebaseConfigurado) {
    throw new Error('Falta la configuración de Firebase. Copia .env.example a .env.local y completa los valores.');
  }

  const db = obtenerDb();
  const [metaSnap, registrosSnap] = await Promise.all([get(ref(db, 'meta')), get(ref(db, 'registros'))]);

  if (!metaSnap.exists() || !registrosSnap.exists()) {
    throw new Error('La base de datos está vacía. Importa el archivo datos/incidentes_octubre_2026_firebase.json.');
  }

  // Firebase devuelve un arreglo si las claves son 0..n-1 y un objeto en caso contrario.
  const crudos = Object.values(registrosSnap.val() as Record<string, RegistroCrudo>);

  return { meta: metaSnap.val() as MetaDatos, registros: crudos.map(normalizar) };
}
