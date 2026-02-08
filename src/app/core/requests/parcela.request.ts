export interface ParcelaRequest {
  transaccion: string;
  id?: number;
  nombre?: string;
  descripcion?: string;
  area?: number;
  fincaId?: number;
  variedadId?: number;
  anulado?: boolean;
}