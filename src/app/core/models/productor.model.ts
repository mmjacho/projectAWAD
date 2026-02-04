export interface Productor {
  id: number;
  cedula: string; // Importante para identificación legal
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion: string;
  anulado: boolean;
}