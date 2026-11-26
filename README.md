# Sprint 1: Transformación de datos CSV a JSON

Proyecto 3: Dashboard interactivo de emergencias del ECU 911.
Dataset: *Base de Emergencias* (Servicio Integrado de Seguridad ECU 911), publicado en
https://www.datosabiertos.gob.ec/dataset/base-de-emergencias con licencia Creative Commons Atribución.

## Contenido del repositorio

| Archivo | Descripción |
|---|---|
| `datos/ECU911_Base de Emergencias_AAAAMM.csv` | CSV original descargado del portal |
| `datos/ECU911_Base de Emergencias_AAAAMM.json` | JSON generado por el script |
| `datos/..._muestra.json` | Primeros registros del JSON (evidencia de la estructura) |
| `datos/..._reporte.json` | Reporte de tipos, valores nulos e inconsistentes, y resultado de la validación |
| `csv_a_json.py` | Script de transformación y validación |

## Requisitos

Python 3.8 o superior. El script usa solo la biblioteca estándar, no hay que instalar nada.

## Cómo ejecutarlo

```bash
python csv_a_json.py "datos/ECU911_Base de Emergencias_AAAAMM.csv"
```

Opciones:

- `-o salida.json`: nombre del JSON de salida (por defecto, el mismo del CSV).
- `--muestra 5`: cantidad de registros de la muestra.
- `--indent 2`: JSON con sangría (por defecto sale compacto para ocupar menos espacio).

## Qué hace el script

1. **Lectura:** detecta la codificación (UTF-8, Windows-1252 o Latin-1) y el separador (`,` `;` tab o `|`).
2. **Nombres de columna:** los pasa a minúsculas, sin tildes ni símbolos (`CANTÓN` pasa a `canton`).
   Así son claves válidas para Firebase, que no admite `. $ # [ ] /`.
3. **Limpieza:** elimina espacios sobrantes y convierte vacíos, `N/A`, `NULL`, `-`, etc. en `null`.
4. **Tipos de datos:** una columna se considera numérica o de fecha si al menos el 95 % de sus valores lo son.
   - Números: se guardan como número (`int` o `float`); la coma decimal se convierte a punto.
   - Fechas: se guardan en formato ISO 8601 (`2026-09-01` o `2026-09-01T08:15:00`).
   - Texto: el resto. Las columnas de código (`cod_parroquia`, etc.) se conservan como texto para no perder ceros a la izquierda (`090150`).
5. **Inconsistencias:** un valor que no cumple el tipo de su columna se guarda como `null` y se cuenta en el reporte, con ejemplos.
6. **Validación del JSON:** vuelve a leer el archivo y comprueba que sea una lista, que tenga la misma cantidad de registros que el CSV, que todos los registros tengan las mismas claves y que cada valor respete el tipo de su columna.

## Estructura del JSON

Una lista de registros, uno por fila del CSV:

```json
[
  {
    "fecha": "2026-09-01T08:15:00",
    "provincia": "GUAYAS",
    "canton": "GUAYAQUIL",
    "cod_parroquia": "090150",
    "parroquia": "TARQUI",
    "servicio": "Seguridad Ciudadana",
    "subtipo": "Patrullaje policial",
    "latitud": -2.15
  }
]
```

## Subir el trabajo a GitHub

```bash
git add csv_a_json.py README.md datos/
git commit -m "Sprint 1: transformación de datos CSV a JSON"
git push
git rev-parse HEAD     # SHA completo del commit, para el reporte
```

---

# Sprint 2: Componentes e interfaces React

Interfaz del dashboard con **React + TypeScript + Vite + Material UI**.

## Ejecutar

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # comprueba tipos y genera dist/
```

## Estructura

```
src/
├── App.tsx                 # contenedor: único dueño del estado (filtros, sección activa)
├── main.tsx · theme.ts     # tema de Material UI (punto de quiebre md = 768 px)
├── types.ts                # tipos de las props y de los datos
├── data/                   # solo constantes de la interfaz (los registros vienen de Firebase desde el Sprint 3)
├── utils/                  # cálculos (filtros, agregados) y formatos
└── components/
    ├── layout/   DashboardLayout, NavMenu, SourceCard, Header
    ├── filters/  FilterBar, SelectFilter
    ├── kpi/      KpiGrid, KpiCard
    ├── charts/   ChartCard, TimeSeriesChart, ServiceBreakdown, TerritoryMap, RankingList, TopSubtypesChart
    ├── table/    DataTable
    └── common/   Badge, iconos
scripts/generar_muestra.py  # genera datos/incidentes_octubre_2026_firebase.json (semilla 911)
capturas/                   # capturas de escritorio y móvil
```

---

# Sprint 3: Conexión de React con Firebase

Los datos ya no están dentro de la aplicación: se leen de **Firebase Realtime Database**.

## Estructura nueva

```
src/
├── firebase/
│   ├── config.ts          # inicializa Firebase con las variables VITE_FIREBASE_* (un solo punto de configuración)
│   └── emergencias.ts     # obtenerEmergencias(): lee /meta y /registros y los normaliza al tipo Registro
├── hooks/useEmergencias.ts  # useState (datos, cargando, error) + useEffect (consulta al montar)
└── App.tsx                # muestra "cargando" o error; con datos pinta <Dashboard />
datos/incidentes_octubre_2026_firebase.json   # archivo que se importa en Firebase
.env.example                                  # plantilla de variables de entorno
```

## Puesta en marcha

1. En [Firebase Console](https://console.firebase.google.com) crea un proyecto y una **Realtime Database**.
2. En la base de datos, menú ⋮ → **Importar JSON** y elige `datos/incidentes_octubre_2026_firebase.json`
   (importar en la raíz `/`). Deben aparecer los nodos `meta` y `registros` (2.500 registros).
3. Pestaña **Reglas** (solo para desarrollo): `{ "rules": { ".read": true, ".write": false } }` → Publicar.
4. En *Configuración del proyecto → Tus apps → Web (`</>`)* copia la configuración del SDK.
5. `cp .env.example .env.local` y completa los valores (incluido `VITE_FIREBASE_DATABASE_URL`).
6. `npm install && npm run dev`.

## Notas

- Se importa la **muestra de 2.500 registros** (misma estructura del JSON del Sprint 1) y no los 454.099 completos:
  el JSON completo pesa ~98 MB y el navegador lo descargaría entero en cada carga.
- Firebase no guarda valores `null`; `obtenerEmergencias()` los restituye para respetar el tipo `Registro`.
- `.env.local` está en `.gitignore`. La configuración web de Firebase no es secreta, pero así cada quien usa su proyecto.
