export type SparePartCategory =
  | 'rodamiento'
  | 'filtro'
  | 'correa'
  | 'sello'
  | 'motor'
  | 'bombilla'
  | 'fusible'
  | 'válvula'
  | 'sensor'
  | 'lubricante';

export interface SparePart {
  sku: string;
  nombre: string;
  categoria: SparePartCategory;
  stockActual: number;
  stockMinimo: number;
  unidad: string;
  costoUnitario: number;
  proveedor: string;
  ubicacionAlmacen: string;
}
