import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Badge from './components/common/Badge';
import { colorDeServicio } from './components/common/iconos';
import ChartCard from './components/charts/ChartCard';
import RankingList from './components/charts/RankingList';
import ServiceBreakdown from './components/charts/ServiceBreakdown';
import TerritoryMap from './components/charts/TerritoryMap';
import TimeSeriesChart from './components/charts/TimeSeriesChart';
import TopSubtypesChart from './components/charts/TopSubtypesChart';
import FilterBar from './components/filters/FilterBar';
import KpiGrid from './components/kpi/KpiGrid';
import DashboardLayout, { SeccionDashboard } from './components/layout/DashboardLayout';
import Header from './components/layout/Header';
import NavMenu from './components/layout/NavMenu';
import DataTable from './components/table/DataTable';
import { FUENTE, SECCIONES } from './data/datos';
import { useEmergencias } from './hooks/useEmergencias';
import type { Emergencias } from './firebase/emergencias';
import type { ClaveFiltro, Columna, Filtros, Indicador, Registro, SeccionId } from './types';
import {
  FILTROS_INICIALES,
  TODOS_CANTONES,
  calcularOpciones,
  filtrarRegistros,
  resumenProvincias,
  resumenServicios,
  resumenSubtipos,
  serieDiaria,
  variacionQuincenal,
  variacionSemanal,
} from './utils/calculos';
import { formatoDecimal, formatoFecha, formatoNumero, formatoPorcentaje, nombreLegible } from './utils/formatos';

const COLUMNAS: Columna<Registro>[] = [
  { clave: 'fecha', titulo: 'Fecha', render: (r) => formatoFecha(r.fecha) },
  { clave: 'provincia', titulo: 'Provincia', render: (r) => <b style={{ color: '#0F172A' }}>{r.provincia ?? '—'}</b> },
  { clave: 'canton', titulo: 'Cantón' },
  {
    clave: 'cod_parroquia',
    titulo: 'Cod_parroquia',
    render: (r) => (
      <Box component="span" sx={{ px: 1, py: 0.3, borderRadius: 1.5, bgcolor: '#EEF1F6', fontFamily: 'ui-monospace, monospace', fontSize: '0.68rem' }}>
        {r.cod_parroquia ?? '—'}
      </Box>
    ),
  },
  { clave: 'parroquia', titulo: 'Parroquia' },
  { clave: 'servicio', titulo: 'Servicio', render: (r) => <Badge texto={r.servicio} color={colorDeServicio(r.servicio)} /> },
  { clave: 'subtipo', titulo: 'Subtipo' },
];

/** Descarga un CSV con los indicadores y los filtros vigentes. */
function descargarResumen(indicadores: Indicador[], filtros: Filtros) {
  const celda = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const filas = [
    ['Indicador', 'Valor', 'Detalle'],
    ...indicadores.map((i) => [i.titulo, String(i.valor), i.detalle]),
    [],
    ['Filtro', 'Valor'],
    ...(Object.entries(filtros) as [string, string][]),
  ];
  const csv = '﻿' + filas.map((f) => f.map(celda).join(';')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resumen_ecu911.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Componente raíz. Recupera los datos de Firebase (useEmergencias) y muestra el estado
 * de carga o de error; cuando los datos llegan, pinta el dashboard.
 */
export default function App() {
  const { datos, cargando, error } = useEmergencias();

  if (cargando) {
    return (
      <Box role="status" sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', alignContent: 'center', gap: 2 }}>
        <CircularProgress />
        <Typography color="text.secondary">Recuperando emergencias desde Firebase…</Typography>
      </Box>
    );
  }

  if (error || !datos) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
        <Alert severity="error" sx={{ maxWidth: 560 }}>
          <b>No se pudieron cargar los datos.</b> {error}
        </Alert>
      </Box>
    );
  }

  return <Dashboard meta={datos.meta} registros={datos.registros} />;
}

/**
 * Contenedor del dashboard. Es el ÚNICO dueño del estado compartido:
 * filtros activos y sección activa. De ahí calcula los datos derivados y los reparte por props.
 */
function Dashboard({ meta: META, registros: REGISTROS }: Emergencias) {
  const MES_ISO = REGISTROS[0]?.fecha.slice(0, 7) ?? ''; // "2026-10"
  const FILTROS_BASE = useMemo(() => FILTROS_INICIALES(META.periodo), [META.periodo]);

  // --- Estado (useState) ---
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_BASE);
  const [seccionActiva, setSeccionActiva] = useState<SeccionId>('resumen');
  const navegandoHasta = useRef(0); // ignora al observador mientras dura el desplazamiento suave

  // --- Datos derivados (se recalculan solo cuando cambian los filtros) ---
  const filtrados = useMemo(() => filtrarRegistros(REGISTROS, filtros), [REGISTROS, filtros]);
  const opciones = useMemo(() => calcularOpciones(REGISTROS, filtros, META.periodo), [REGISTROS, META.periodo, filtros]);
  const serie = useMemo(() => serieDiaria(filtrados, MES_ISO), [filtrados, MES_ISO]);
  const servicios = useMemo(() => resumenServicios(filtrados, 4), [filtrados]);
  const provincias = useMemo(() => resumenProvincias(filtrados), [filtrados]);
  const subtipos = useMemo(() => resumenSubtipos(filtrados, 5), [filtrados]);

  const indicadores = useMemo<Indicador[]>(() => {
    const total = filtrados.length;
    const topServicio = resumenServicios(filtrados, 99)[0];
    const topProvincia = provincias[0];
    return [
      {
        titulo: 'Total de emergencias',
        valor: total,
        detalle: `Registros en la muestra · ${META.periodo}`,
        variacion: variacionSemanal(serie),
        icono: 'actividad',
      },
      {
        titulo: 'Promedio diario',
        valor: formatoDecimal(total / serie.length, 1),
        detalle: 'Emergencias por día',
        variacion: variacionQuincenal(serie),
        icono: 'calendario',
      },
      {
        titulo: 'Provincia con más casos',
        valor: topProvincia ? nombreLegible(topProvincia.provincia) : '—',
        detalle: topProvincia ? `${formatoNumero(topProvincia.casos)} emergencias` : 'Sin datos',
        icono: 'ubicacion',
      },
      {
        titulo: 'Servicio predominante',
        valor: topServicio?.nombre ?? '—',
        detalle: topServicio ? `${formatoPorcentaje(topServicio.porcentaje)} del total` : 'Sin datos',
        icono: 'escudo',
      },
    ];
  }, [filtrados, provincias, serie, META.periodo]);

  // --- Acciones del usuario (suben desde los hijos mediante funciones) ---
  const cambiarFiltro = useCallback((clave: ClaveFiltro, valor: string) => {
    setFiltros((f) => ({
      ...f,
      [clave]: valor,
      // Al cambiar de provincia, el cantón elegido deja de ser válido.
      ...(clave === 'provincia' ? { canton: TODOS_CANTONES } : {}),
    }));
  }, []);

  const restablecer = useCallback(() => setFiltros(FILTROS_BASE), [FILTROS_BASE]);

  const navegar = useCallback((id: SeccionId) => {
    setSeccionActiva(id);
    navegandoHasta.current = Date.now() + 900;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // La sección activa sigue al desplazamiento (IntersectionObserver).
  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        if (Date.now() < navegandoHasta.current) return;
        const visible = entradas.find((e) => e.isIntersecting);
        if (visible) setSeccionActiva(visible.target.id as SeccionId);
      },
      { rootMargin: '-25% 0px -65% 0px' },
    );
    SECCIONES.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observador.observe(el);
    });
    return () => observador.disconnect();
  }, []);

  const hayCambios = (Object.keys(filtros) as ClaveFiltro[]).some((k) => filtros[k] !== FILTROS_BASE[k]);
  const dosColumnas = { xs: '1fr', lg: '1.5fr 1fr' };

  return (
    <DashboardLayout
      menu={<NavMenu secciones={SECCIONES} seccionActiva={seccionActiva} onNavegar={navegar} fuente={FUENTE} actualizado />}
    >
      <SeccionDashboard id="resumen">
        <Header
          etiqueta="MONITOREO NACIONAL"
          titulo="Emergencias coordinadas"
          subtitulo="Patrones temporales, territoriales y operativos del servicio ECU 911."
          onExportar={() => descargarResumen(indicadores, filtros)}
        />
        <FilterBar filtros={filtros} opciones={opciones} onCambiar={cambiarFiltro} onRestablecer={restablecer} hayCambios={hayCambios} />
        <KpiGrid indicadores={indicadores} />
      </SeccionDashboard>

      <SeccionDashboard id="servicios">
        <Box sx={{ display: 'grid', gridTemplateColumns: dosColumnas, gap: { xs: 2.5, md: 3 } }}>
          <ChartCard etiqueta="EVOLUCIÓN TEMPORAL" titulo="Emergencias por día" subtitulo={`Comportamiento diario durante ${META.periodo.toLowerCase()}`}>
            <TimeSeriesChart datos={serie} tendencia={variacionSemanal(serie)} />
          </ChartCard>
          <ChartCard etiqueta="COMPOSICIÓN" titulo="Por tipo de servicio" subtitulo="Participación sobre el total">
            <ServiceBreakdown servicios={servicios} />
          </ChartCard>
        </Box>
      </SeccionDashboard>

      <SeccionDashboard id="territorio">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.25fr 1fr' }, gap: { xs: 2.5, md: 3 } }}>
          <ChartCard
            etiqueta="DISTRIBUCIÓN TERRITORIAL"
            titulo="Concentración por provincia"
            subtitulo="Emergencias coordinadas y densidad relativa"
            accion={<Badge texto="Mapa de calor" color="azul" />}
          >
            {/* Consulta de contenedor: mapa y ranking van lado a lado solo si la tarjeta es ancha. */}
            <Box sx={{ containerType: 'inline-size' }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: 3,
                  alignItems: 'center',
                  '@container (min-width: 520px)': { gridTemplateColumns: '1fr 1fr' },
                }}
              >
                <TerritoryMap provincias={provincias} />
                <RankingList items={provincias} limite={5} />
              </Box>
            </Box>
          </ChartCard>
          <ChartCard etiqueta="INCIDENTES" titulo="Subtipos más frecuentes" subtitulo="Principales motivos de coordinación">
            <TopSubtypesChart subtipos={subtipos} onVerDetalle={() => navegar('servicios')} />
          </ChartCard>
        </Box>
      </SeccionDashboard>

      <SeccionDashboard id="datos">
        <ChartCard
          etiqueta="DETALLE DE REGISTROS"
          titulo="Datos de emergencias"
          subtitulo={`Muestra de ${formatoNumero(META.registrosEnMuestra)} de ${formatoNumero(META.totalRegistrosOrigen)} registros del archivo mensual`}
          accion={<Badge texto={`${formatoNumero(filtrados.length)} registros`} color="azul" />}
        >
          <DataTable columnas={COLUMNAS} filas={filtrados} filasPorPagina={10} />
        </ChartCard>
      </SeccionDashboard>
    </DashboardLayout>
  );
}
