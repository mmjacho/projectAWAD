export interface ClienteRequest {
  transaccion: string;
  id?: number;
  ruc?: string;
  razonSocial?: string;
  email?: string;
  telefono?: string;
  tipo?: string;
  anulado?: boolean;
}