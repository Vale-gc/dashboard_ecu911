import { useEffect, useState } from 'react';
import { obtenerEmergencias } from '../firebase/emergencias';
import type { Emergencias } from '../firebase/emergencias';

export type EstadoEmergencias = {
  datos: Emergencias | null;
  cargando: boolean;
  error: string | null;
};

/**
 * Consulta las emergencias a Firebase cuando el componente se monta.
 * - useState guarda los registros recuperados y los estados de carga y error.
 * - useEffect (con arreglo de dependencias vacío) lanza la consulta una sola vez.
 */
export function useEmergencias(): EstadoEmergencias {
  const [datos, setDatos] = useState<Emergencias | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false; // evita actualizar el estado si el componente ya se desmontó

    obtenerEmergencias()
      .then((resultado) => {
        if (!cancelado) setDatos(resultado);
      })
      .catch((e: unknown) => {
        if (!cancelado) setError(e instanceof Error ? e.message : 'No se pudieron recuperar los datos.');
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  return { datos, cargando, error };
}
