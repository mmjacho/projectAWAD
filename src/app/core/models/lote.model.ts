export interface Lote {
  id: number;
  codigo: string;
  parcelaId: number;
  fechaCosecha: Date;
  cantidadInicial: number;
  stockActual: number;
  unidadCodigo: string; // "qq", "kg" (Viene del JOIN en SP)
  calidadNombre: string; // "Primera" (Viene del JOIN)
  estado: string; 
  notas?: string;
}