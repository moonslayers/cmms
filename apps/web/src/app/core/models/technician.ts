export type TechnicianSpecialty =
  | 'electromecánico'
  | 'mecánico'
  | 'eléctrico'
  | 'instrumentación'
  | 'hidráulico'
  | 'refrigeración'
  | 'soldadura'
  | 'automatización';

export type TechnicianAvailability = 'disponible' | 'en_campo' | 'no_disponible';

export interface Technician {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  especialidad: TechnicianSpecialty;
  disponibilidad: TechnicianAvailability;
  cargaTrabajo: number;
  ordenesActivas: number;
  iniciales: string;
}
