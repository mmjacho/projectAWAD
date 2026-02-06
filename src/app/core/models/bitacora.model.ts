export type TipoEvento = 'LABOR' | 'PLAGA';
export type Severidad = 'BAJA' | 'MEDIA' | 'ALTA' | null;

export interface Bitacora {
  id: number;
  parcelaId: number;
  fecha: Date; // O string si viene ISO desde backend
  tipo: TipoEvento;
  nombreEvento: string;
  severidad: Severidad;
  notas: string;
}