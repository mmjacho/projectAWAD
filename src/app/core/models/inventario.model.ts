export type EstadoLote = 'DISPONIBLE' | 'AGOTADO' | 'CUARENTENA';
export type TipoMovimiento = 'COSECHA' | 'VENTA' | 'MERMA' | 'AJUSTE';

export interface Lote {
  id: number;
  codigo: string;       // Ej: "L-2025-001"
  parcelaId: number;    // Origen (Trazabilidad)
  fechaCosecha: Date;
  cantidadInicial: number;
  stockActual: number;
  unidad: string;       // 'qq' (quintales) o 'kg'
  estado: EstadoLote;
  calidad: string;      // Ej: 'Primera', 'Descarte'
  notas?: string;
}

export interface Movimiento {
  id: number;
  loteId: number;
  fecha: Date;
  tipo: TipoMovimiento;
  cantidad: number;     // Valor absoluto
  esEntrada: boolean;   // true suma, false resta
  motivo: string;
}