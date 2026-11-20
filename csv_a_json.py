"""
Sprint 1 - Transformación de datos CSV a JSON
Dataset: Base de Emergencias ECU 911 (datosabiertos.gob.ec)

Pasos que realiza el script:
  1. Lee el CSV (detecta codificación y separador).
  2. Normaliza los nombres de columna (minúsculas, sin tildes, sin símbolos).
  3. Limpia espacios y convierte valores vacíos o "N/A" en null.
  4. Detecta el tipo de cada columna (número, fecha o texto) y convierte los valores.
  5. Guarda el JSON, una muestra de registros y un reporte de validación.
  6. Vuelve a leer el JSON y verifica estructura, cantidad de registros y tipos.

Uso:
  python csv_a_json.py entrada.csv
  python csv_a_json.py entrada.csv -o salida.json --muestra 5 --indent 0
"""
import argparse
import csv
import json
import re
import sys
import unicodedata
from datetime import datetime
from functools import lru_cache
from pathlib import Path

VALORES_FALTANTES = {"", "na", "n/a", "nan", "null", "none", "-", "--", "s/n",
                     "sin dato", "sin datos", "no registra"}
TOKENS_CODIGO = {"cod", "codigo", "id", "cedula", "telefono"}
FORMATOS_FECHA = ["%Y-%m-%d", "%d/%m/%Y", "%Y/%m/%d", "%d-%m-%Y"]
FORMATOS_FECHA_HORA = ["%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M",
                       "%d/%m/%Y %H:%M:%S", "%d/%m/%Y %H:%M", "%Y/%m/%d %H:%M:%S"]
RE_NUMERO = re.compile(r"^[+-]?\d+([.,]\d+)?$")
RE_ISO_FECHA = re.compile(r"^\d{4}-\d{2}-\d{2}$")
RE_ISO_FECHA_HORA = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$")
TAM_MUESTRA = 5000  # valores por columna usados para detectar fechas
UMBRAL = 0.95  # % mínimo de valores que deben cumplir un tipo para asignarlo a la columna


# ---------- utilidades ----------
def normalizar_nombre(nombre):
    n = unicodedata.normalize("NFKD", nombre).encode("ascii", "ignore").decode()
    n = re.sub(r"[^a-z0-9]+", "_", n.lower()).strip("_")
    return n or "columna"


def limpiar(valor):
    if valor is None:
        return None
    v = re.sub(r"\s+", " ", valor).strip()
    return None if v.lower() in VALORES_FALTANTES else v


def parsear_numero(v):
    if not RE_NUMERO.match(v):
        return None
    v = v.replace(",", ".")
    return float(v) if "." in v else int(v)


@lru_cache(maxsize=None)  # las fechas se repiten mucho: se calcula una sola vez por valor distinto
def parsear_fecha(v):
    """Devuelve (texto ISO, tiene_hora) o None."""
    for f in FORMATOS_FECHA_HORA:
        try:
            return datetime.strptime(v, f).strftime("%Y-%m-%dT%H:%M:%S"), True
        except ValueError:
            pass
    for f in FORMATOS_FECHA:
        try:
            return datetime.strptime(v, f).strftime("%Y-%m-%d"), False
        except ValueError:
            pass
    return None


def tiene_ceros_izquierda(v):
    return len(v) > 1 and v[0] == "0" and v[1].isdigit()


# ---------- lectura ----------
def leer_csv(ruta):
    for codificacion in ("utf-8-sig", "utf-8", "cp1252", "latin-1"):
        try:
            with open(ruta, newline="", encoding=codificacion) as f:
                muestra = f.read(20000)
                f.seek(0)
                try:
                    sep = csv.Sniffer().sniff(muestra, delimiters=",;\t|").delimiter
                except csv.Error:
                    sep = ","
                filas = list(csv.reader(f, delimiter=sep))
            return filas, codificacion, sep
        except UnicodeDecodeError:
            continue
    sys.exit("No se pudo leer el archivo con ninguna codificación conocida.")


# ---------- transformación ----------
def avisar(msg):
    print(msg, file=sys.stderr, flush=True)


def transformar(ruta_csv):
    avisar("1/4 Leyendo el CSV...")
    filas, codificacion, sep = leer_csv(ruta_csv)
    encabezado_original = [h.strip() for h in filas[0]]
    nombres, usados = [], {}
    for h in encabezado_original:
        n = normalizar_nombre(h)
        usados[n] = usados.get(n, 0) + 1
        nombres.append(n if usados[n] == 1 else f"{n}_{usados[n]}")
    ncol = len(nombres)

    datos, filas_ajustadas = [], 0
    for fila in filas[1:]:
        if not any(c.strip() for c in fila):
            continue  # fila completamente vacía
        if len(fila) != ncol:
            filas_ajustadas += 1
            fila = (fila + [""] * ncol)[:ncol]
        datos.append([limpiar(c) for c in fila])

    # 1) detectar el tipo de cada columna
    avisar(f"2/4 Detectando tipos de datos ({len(datos)} filas)...")
    tipos = {}
    for j, nombre in enumerate(nombres):
        valores = [r[j] for r in datos if r[j] is not None]
        if not valores or set(nombre.split("_")) & TOKENS_CODIGO:
            tipos[nombre] = "texto"  # los códigos se conservan como texto (ceros a la izquierda)
            continue
        # las fechas se detectan sobre una muestra repartida por todo el archivo (es más rápido)
        paso = max(1, len(valores) // TAM_MUESTRA)
        fechas = [parsear_fecha(v) for v in valores[::paso]]
        n_fecha = sum(1 for x in fechas if x)
        n_num = sum(1 for v in valores if parsear_numero(v) is not None)
        ceros = any(tiene_ceros_izquierda(v) for v in valores if RE_NUMERO.match(v))
        if n_fecha / len(fechas) >= UMBRAL:
            tipos[nombre] = "fecha_hora" if any(x[1] for x in fechas if x) else "fecha"
        elif n_num / len(valores) >= UMBRAL and not ceros:
            decimales = any("." in v or "," in v for v in valores if RE_NUMERO.match(v))
            tipos[nombre] = "numero_decimal" if decimales else "numero_entero"
        else:
            tipos[nombre] = "texto"

    # 2) convertir valores
    avisar("3/4 Convirtiendo valores...")
    registros = []
    estad = {n: {"tipo": tipos[n], "nulos": 0, "inconsistentes": 0, "ejemplos_inconsistentes": []}
             for n in nombres}
    for r in datos:
        reg = {}
        for j, nombre in enumerate(nombres):
            v, tipo, e = r[j], tipos[nombre], estad[nombre]
            if v is None:
                e["nulos"] += 1
                reg[nombre] = None
                continue
            if tipo.startswith("numero"):
                x = parsear_numero(v)
                if x is not None and tipo == "numero_decimal":
                    x = float(x)
            elif tipo.startswith("fecha"):
                p = parsear_fecha(v)
                x = None
                if p:
                    x = p[0] if tipo == "fecha_hora" else p[0][:10]
            else:
                x = v
            if x is None:
                e["inconsistentes"] += 1
                if len(e["ejemplos_inconsistentes"]) < 5:
                    e["ejemplos_inconsistentes"].append(v)
            reg[nombre] = x
        registros.append(reg)

    reporte = {
        "archivo_csv": Path(ruta_csv).name,
        "codificacion": codificacion,
        "separador": sep,
        "filas_leidas_csv": len(datos),
        "filas_con_columnas_ajustadas": filas_ajustadas,
        "columnas": {n: {**estad[n], "nombre_original": encabezado_original[i]}
                     for i, n in enumerate(nombres)},
    }
    return registros, reporte


# ---------- validación del JSON generado ----------
def validar_json(ruta_json, reporte):
    errores = []
    with open(ruta_json, encoding="utf-8") as f:
        datos = json.load(f)
    if not isinstance(datos, list):
        return ["El JSON no es una lista de registros."]
    if len(datos) != reporte["filas_leidas_csv"]:
        errores.append(f"Cantidad distinta: CSV={reporte['filas_leidas_csv']} JSON={len(datos)}")
    columnas = reporte["columnas"]
    claves = set(columnas)
    for i, reg in enumerate(datos):
        if set(reg) != claves:
            errores.append(f"Registro {i}: claves distintas a las esperadas")
            break
    for nombre, info in columnas.items():
        t = info["tipo"]
        for i, reg in enumerate(datos):
            v = reg.get(nombre)
            if v is None:
                continue
            ok = ((t == "numero_entero" and isinstance(v, int) and not isinstance(v, bool))
                  or (t == "numero_decimal" and isinstance(v, float))
                  or (t == "fecha" and isinstance(v, str) and RE_ISO_FECHA.match(v))
                  or (t == "fecha_hora" and isinstance(v, str) and RE_ISO_FECHA_HORA.match(v))
                  or (t == "texto" and isinstance(v, str)))
            if not ok:
                errores.append(f"Columna '{nombre}' (registro {i}): valor {v!r} no es {t}")
                break
    return errores


def main():
    ap = argparse.ArgumentParser(description="Convierte el CSV de emergencias a JSON y lo valida.")
    ap.add_argument("csv", help="archivo CSV de entrada")
    ap.add_argument("-o", "--salida", help="archivo JSON de salida (por defecto, mismo nombre que el CSV)")
    ap.add_argument("--muestra", type=int, default=5, help="registros de la muestra (por defecto 5)")
    ap.add_argument("--indent", type=int, default=0, help="sangría del JSON (0 = compacto)")
    a = ap.parse_args()

    ruta_csv = Path(a.csv)
    ruta_json = Path(a.salida) if a.salida else ruta_csv.with_suffix(".json")
    registros, reporte = transformar(ruta_csv)

    avisar("4/4 Guardando y validando el JSON...")
    with open(ruta_json, "w", encoding="utf-8") as f:
        json.dump(registros, f, ensure_ascii=False, indent=a.indent or None,
                  separators=None if a.indent else (",", ":"))  # compacto: archivo más liviano
    ruta_muestra = ruta_json.with_name(ruta_json.stem + "_muestra.json")
    with open(ruta_muestra, "w", encoding="utf-8") as f:
        json.dump(registros[:a.muestra], f, ensure_ascii=False, indent=2)

    errores = validar_json(ruta_json, reporte)
    reporte["validacion"] = {"correcta": not errores, "errores": errores}
    ruta_reporte = ruta_json.with_name(ruta_json.stem + "_reporte.json")
    with open(ruta_reporte, "w", encoding="utf-8") as f:
        json.dump(reporte, f, ensure_ascii=False, indent=2)

    print(f"CSV: {reporte['archivo_csv']} | codificación: {reporte['codificacion']} | "
          f"separador: {reporte['separador']!r}")
    print(f"Registros en CSV: {reporte['filas_leidas_csv']} | en JSON: {len(registros)}")
    print(f"{'columna':28}{'tipo':16}{'nulos':>10}{'inconsist.':>12}")
    for n, i in reporte["columnas"].items():
        print(f"{n:28}{i['tipo']:16}{i['nulos']:>10}{i['inconsistentes']:>12}")
    print("Validación:", "CORRECTA" if not errores else "CON ERRORES")
    for e in errores:
        print("  -", e)
    print(f"Archivos generados: {ruta_json.name}, {ruta_muestra.name}, {ruta_reporte.name}")
    sys.exit(1 if errores else 0)


if __name__ == "__main__":
    main()