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
├── data/                   # datos de ejemplo (muestra de 2.500 registros del JSON del Sprint 1)
├── utils/                  # cálculos (filtros, agregados) y formatos
└── components/
    ├── layout/   DashboardLayout, NavMenu, SourceCard, Header
    ├── filters/  FilterBar, SelectFilter
    ├── kpi/      KpiGrid, KpiCard
    ├── charts/   ChartCard, TimeSeriesChart, ServiceBreakdown, TerritoryMap, RankingList, TopSubtypesChart
    ├── table/    DataTable
    └── common/   Badge, iconos
scripts/generar_muestra.py  # genera src/data/incidentes_muestra.json (semilla 911)
capturas/                   # capturas de escritorio y móvil
```
