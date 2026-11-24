"""
Sprint 2 - Datos de ejemplo para el dashboard
Toma el JSON generado en el Sprint 1 y extrae una muestra aleatoria reproducible
de registros para que la interfaz React pueda cargarse sin descargar los 98 MB completos.

Uso:
  python scripts/generar_muestra.py
  python scripts/generar_muestra.py --n 2500 --semilla 911
"""
import argparse
import json
import random
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--entrada", default=str(RAIZ / "datos" / "incidentes_octubre_2026.json"))
    p.add_argument("--salida", default=str(RAIZ / "src" / "data" / "incidentes_muestra.json"))
    p.add_argument("--n", type=int, default=2500)
    p.add_argument("--semilla", type=int, default=911)
    a = p.parse_args()

    with open(a.entrada, encoding="utf-8") as f:
        registros = json.load(f)

    # Los registros sin ubicación (provincia nula) se excluyen de la muestra: solo se usan para totales.
    con_ubicacion = [r for r in registros if r["provincia"] is not None]
    rnd = random.Random(a.semilla)
    muestra = rnd.sample(con_ubicacion, a.n)
    muestra.sort(key=lambda r: (r["fecha"], r["provincia"], r["canton"]))

    salida = {
        "meta": {
            "fuente": "ECU911_Base de Emergencias",
            "periodo": "Octubre 2026",
            "totalRegistrosOrigen": len(registros),
            "registrosEnMuestra": len(muestra),
            "semilla": a.semilla,
        },
        "registros": muestra,
    }
    Path(a.salida).parent.mkdir(parents=True, exist_ok=True)
    with open(a.salida, "w", encoding="utf-8") as f:
        json.dump(salida, f, ensure_ascii=False, separators=(",", ":"))
    print(f"Muestra: {len(muestra)} de {len(registros)} registros -> {a.salida}")


if __name__ == "__main__":
    main()
