export type PlanFrequency =
  | 'diaria'
  | 'semanal'
  | 'mensual'
  | 'trimestral'
  | 'anual'
  | number;

export type PlanStatus = 'activo' | 'pausado' | 'vencido';

export interface PreventivePlan {
  id: string;
  nombre: string;
  assetTag: string;
  frecuencia: PlanFrequency;
  proximaFecha: string;
  ultimaEjecucion: string | null;
  tecnico: string;
  duracionEstimadaHoras: number;
  estado: PlanStatus;
}
