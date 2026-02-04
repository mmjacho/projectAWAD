export interface FincaRequest {
  transaccion: string;
  id?: number;
  nombre?: string;
  ubicacion?: string;
  hectareas?: number;
  productorId?: number;
  anulado?: boolean;
}