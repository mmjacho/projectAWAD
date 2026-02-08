export interface ProductorRequest {
  transaccion: string;
  id?: number;
  cedula?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  direccion?: string;
  anulado?: boolean;
}