export type TipoEvento = 'LABOR' | 'PLAGA';
export type Severidad = 'BAJA' | 'MEDIA' | 'ALTA' | null;

export interface Bitacora {
  id: number;
  parcelaId: number;    // ¿Dónde ocurrió?
  fecha: Date;          // ¿Cuándo?
  tipo: TipoEvento;     // ¿Qué fue?
  nombreEvento: string; // Ej: "Fertilización NPK", "Roya del Café"
  severidad: Severidad; // Solo si es Plaga
  notas: string;
}