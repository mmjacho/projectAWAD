export interface Finca {
  id: number;
  nombre: string;
  ubicacion: string;
  hectareas: number;
  productorId: number; // Relación con el Productor
  activa: boolean;
}