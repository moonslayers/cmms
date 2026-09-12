import type { DashboardData } from '../models';
import { MOCK_WORK_ORDERS } from './work-order.mock';
import { MOCK_SPARE_PARTS } from './spare-part.mock';
import { MOCK_PREVENTIVE_PLANS } from './preventive-plan.mock';
import { MOCK_ASSETS } from './asset.mock';

const totalOT = MOCK_WORK_ORDERS.length;
const otAbiertas = MOCK_WORK_ORDERS.filter(
  (o) => o.estado === 'abierta' || o.estado === 'en_progreso' || o.estado === 'en_espera',
).length;
const otCompletadas = MOCK_WORK_ORDERS.filter((o) => o.estado === 'completada').length;
const planesCumplidos = MOCK_PREVENTIVE_PLANS.filter(
  (p) => p.estado === 'activo' && new Date(p.proximaFecha) >= new Date(),
).length;
const totalPlanesActivos = MOCK_PREVENTIVE_PLANS.filter((p) => p.estado === 'activo').length;
const cumplimientoPreventivo =
  totalPlanesActivos > 0 ? Math.round((planesCumplidos / totalPlanesActivos) * 100) : 0;

const activosOperativos = MOCK_ASSETS.filter((a) => a.estado === 'operativo').length;
const disponibilidadActivos = Math.round((activosOperativos / MOCK_ASSETS.length) * 100);

const repuestosBajoStock = MOCK_SPARE_PARTS.filter((s) => s.stockActual < s.stockMinimo).length;

export const MOCK_DASHBOARD_DATA: DashboardData = {
  kpis: {
    otAbiertas: {
      label: 'Órdenes abiertas',
      value: otAbiertas,
      unit: `de ${totalOT}`,
      trend: 'down',
      trendValue: 12,
    },
    cumplimientoPreventivo: {
      label: 'Cumplimiento preventivo',
      value: cumplimientoPreventivo,
      unit: '%',
      trend: 'up',
      trendValue: 5,
    },
    disponibilidadActivos: {
      label: 'Disponibilidad activos',
      value: disponibilidadActivos,
      unit: '%',
      trend: 'up',
      trendValue: 3,
    },
    repuestosBajoStock: {
      label: 'Repuestos bajo stock',
      value: repuestosBajoStock,
      trend: 'up',
      trendValue: 2,
    },
  },
  otPorEstado: [
    { label: 'Abierta', value: MOCK_WORK_ORDERS.filter((o) => o.estado === 'abierta').length },
    {
      label: 'En progreso',
      value: MOCK_WORK_ORDERS.filter((o) => o.estado === 'en_progreso').length,
    },
    {
      label: 'En espera',
      value: MOCK_WORK_ORDERS.filter((o) => o.estado === 'en_espera').length,
    },
    {
      label: 'Completada',
      value: otCompletadas,
    },
    {
      label: 'Cancelada',
      value: MOCK_WORK_ORDERS.filter((o) => o.estado === 'cancelada').length,
    },
  ],
  tendenciaMensual: [
    { label: 'Abr 2026', value: 18 },
    { label: 'May 2026', value: 22 },
    { label: 'Jun 2026', value: 15 },
    { label: 'Jul 2026', value: 20 },
    { label: 'Ago 2026', value: 24 },
    { label: 'Sep 2026', value: 14 },
  ],
  distribucionPorTipo: [
    {
      label: 'Correctivo',
      value: MOCK_WORK_ORDERS.filter((o) => o.tipo === 'correctivo').length,
    },
    {
      label: 'Preventivo',
      value: MOCK_WORK_ORDERS.filter((o) => o.tipo === 'preventivo').length,
    },
    {
      label: 'Predictivo',
      value: MOCK_WORK_ORDERS.filter((o) => o.tipo === 'predictivo').length,
    },
  ],
  costoPorMes: [
    { label: 'Abr 2026', value: 45200 },
    { label: 'May 2026', value: 62800 },
    { label: 'Jun 2026', value: 31400 },
    { label: 'Jul 2026', value: 54600 },
    { label: 'Ago 2026', value: 72100 },
    { label: 'Sep 2026', value: 48900 },
  ],
};

export const MOCK_RECENT_WORK_ORDERS = MOCK_WORK_ORDERS.filter(
  (o) => o.estado === 'en_progreso' || o.estado === 'abierta',
).slice(0, 5);

export const MOCK_UPCOMING_PREVENTIVE = MOCK_PREVENTIVE_PLANS
  .filter((p) => p.estado === 'activo')
  .sort((a, b) => new Date(a.proximaFecha).getTime() - new Date(b.proximaFecha).getTime())
  .slice(0, 5);

export const MOCK_LOW_STOCK_PARTS = MOCK_SPARE_PARTS.filter(
  (s) => s.stockActual < s.stockMinimo,
);
