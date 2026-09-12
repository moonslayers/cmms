export type TrendDirection = 'up' | 'down' | 'flat';

export interface KpiValue {
  label: string;
  value: number | string;
  unit?: string;
  trend?: TrendDirection;
  trendValue?: number;
}

export interface ChartSeries {
  label: string;
  value: number;
}

export interface DashboardKpis {
  otAbiertas: KpiValue;
  cumplimientoPreventivo: KpiValue;
  disponibilidadActivos: KpiValue;
  repuestosBajoStock: KpiValue;
}

export interface DashboardData {
  kpis: DashboardKpis;
  otPorEstado: ChartSeries[];
  tendenciaMensual: ChartSeries[];
  distribucionPorTipo: ChartSeries[];
  costoPorMes: ChartSeries[];
}
