export type LocationType = 'planta' | 'área' | 'ubicación';

export interface Location {
  id: string;
  nombre: string;
  tipo: LocationType;
  parentId: string | null;
  activosCount: number;
}
