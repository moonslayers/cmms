export type WorkOrderPriority = 'baja' | 'media' | 'alta' | 'crítica';

export type WorkOrderStatus =
  | 'abierta'
  | 'en_progreso'
  | 'en_espera'
  | 'completada'
  | 'cancelada';

export type WorkOrderType = 'correctivo' | 'preventivo' | 'predictivo';

export interface WorkOrder {
  id: string;
  titulo: string;
  descripcion: string;
  assetTag: string;
  ubicacion: string;
  prioridad: WorkOrderPriority;
  estado: WorkOrderStatus;
  tipo: WorkOrderType;
  tecnicoAsignado: string;
  fechaCreacion: string;
  fechaProgramada: string;
  fechaCompletada: string | null;
  costoEstimado: number;
  repuestosUsados: string[];
}
