export type UserRole = 'admin' | 'supervisor' | 'técnico' | 'visor';

export interface User {
  id: string;
  nombre: string;
  email: string;
  empresa: string;
  rol?: UserRole;
  iniciales?: string;
}
