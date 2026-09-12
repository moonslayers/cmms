export type AssetCategory =
  | 'CNC'
  | 'compresor'
  | 'bomba'
  | 'cinta_transportadora'
  | 'montacargas'
  | 'horno'
  | 'torno'
  | 'generador'
  | 'transformador'
  | 'refrigeración';

export type AssetStatus = 'operativo' | 'en_mantenimiento' | 'fuera_de_servicio';

export type AssetCriticality = 'baja' | 'media' | 'alta' | 'crítica';

export interface Asset {
  id: string;
  nombre: string;
  categoria: AssetCategory;
  ubicacion: string;
  criticidad: AssetCriticality;
  estado: AssetStatus;
  fabricante: string;
  modelo: string;
  numeroSerie: string;
  fechaInstalacion: string;
  ultimoMantenimiento: string;
  proximoMantenimiento: string;
}
