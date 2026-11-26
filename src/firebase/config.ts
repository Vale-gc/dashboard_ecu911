import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import type { Database } from 'firebase/database';

/**
 * Configuración de Firebase. Los valores salen de las variables de entorno de Vite
 * (archivo `.env.local`, que no se sube al repositorio; ver `.env.example`).
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/** Indica si falta la configuración mínima, para mostrar un error claro en vez de uno críptico del SDK. */
export const firebaseConfigurado = Boolean(firebaseConfig.databaseURL && firebaseConfig.projectId);

let db: Database | null = null;

/**
 * Instancia única de Realtime Database, compartida por toda la aplicación.
 * Se crea la primera vez que se pide (no al importar el módulo), para que un error de
 * configuración llegue al estado de error de la interfaz en lugar de dejar la página en blanco.
 */
export function obtenerDb(): Database {
  if (!db) db = getDatabase(initializeApp(firebaseConfig));
  return db;
}
