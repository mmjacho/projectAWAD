export interface Parcela {
  id: number;
  nombre: string;
  descripcion?: string;
  area: number;
  fincaId: number;
  variedadId: number; // Ahora es ID, no string
  variedadNombre?: string; // Opcional para mostrar en tabla si el backend lo envía
  anulado: boolean;
}