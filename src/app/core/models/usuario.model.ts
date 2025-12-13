export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'Admin' | 'Productor' | 'Cliente';
  activo: boolean;
}