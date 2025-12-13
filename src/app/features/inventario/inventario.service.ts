import { Injectable, signal, computed } from '@angular/core';
import { Lote, Movimiento, TipoMovimiento } from '../../core/models/inventario.model';

// Datos iniciales simulados
const MOCK_LOTES: Lote[] = [
  { 
    id: 1, codigo: 'L-2025-001', parcelaId: 1, fechaCosecha: new Date('2025-01-10'), 
    cantidadInicial: 50, stockActual: 45, unidad: 'qq', estado: 'DISPONIBLE', calidad: 'Primera' 
  },
  { 
    id: 2, codigo: 'L-2025-002', parcelaId: 2, fechaCosecha: new Date('2025-01-12'), 
    cantidadInicial: 30, stockActual: 0, unidad: 'qq', estado: 'AGOTADO', calidad: 'Segunda' 
  }
];

const MOCK_MOVIMIENTOS: Movimiento[] = [
  { id: 1, loteId: 1, fecha: new Date('2025-01-10'), tipo: 'COSECHA', cantidad: 50, esEntrada: true, motivo: 'Ingreso inicial por cosecha' },
  { id: 2, loteId: 1, fecha: new Date('2025-01-15'), tipo: 'VENTA', cantidad: 5, esEntrada: false, motivo: 'Venta Cliente A' },
  { id: 3, loteId: 2, fecha: new Date('2025-01-12'), tipo: 'COSECHA', cantidad: 30, esEntrada: true, motivo: 'Ingreso inicial' },
  { id: 4, loteId: 2, fecha: new Date('2025-01-20'), tipo: 'VENTA', cantidad: 30, esEntrada: false, motivo: 'Venta Total' },
];

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private _lotes = signal<Lote[]>(MOCK_LOTES);
  private _movimientos = signal<Movimiento[]>(MOCK_MOVIMIENTOS);

  public readonly lotes = this._lotes.asReadonly();
  public readonly movimientos = this._movimientos.asReadonly();

  // KPI: Total de Quintales en Stock (Signal Computada)
  public readonly totalStock = computed(() => 
    this._lotes().reduce((acc, lote) => acc + lote.stockActual, 0)
  );

  constructor() {}

  // --- LÓGICA DE LOTES ---

  // Crear Lote (Nace de una Cosecha)
  registrarCosecha(data: Omit<Lote, 'id' | 'codigo' | 'stockActual' | 'estado'>) {
    const nextId = this._lotes().length + 1;
    // Generar código L-{AÑO}-{ID}
    const year = new Date().getFullYear();
    const codigo = `L-${year}-${nextId.toString().padStart(3, '0')}`;

    const nuevoLote: Lote = {
      ...data,
      id: nextId,
      codigo,
      stockActual: data.cantidadInicial,
      estado: 'DISPONIBLE'
    };

    // 1. Guardar Lote
    this._lotes.update(l => [nuevoLote, ...l]);

    // 2. Registrar Movimiento Automático de Entrada
    this.registrarMovimiento({
      loteId: nextId,
      fecha: data.fechaCosecha,
      tipo: 'COSECHA',
      cantidad: data.cantidadInicial,
      esEntrada: true,
      motivo: 'Registro inicial de cosecha'
    }, false); // false para no actualizar stock dos veces
  }

  // --- LÓGICA DE MOVIMIENTOS ---

  registrarMovimiento(mov: Omit<Movimiento, 'id'>, actualizarStock = true) {
    const newId = this._movimientos().length + 1;
    const movimientoReal = { ...mov, id: newId };

    // 1. Guardar Movimiento
    this._movimientos.update(m => [movimientoReal, ...m]);

    if (actualizarStock) {
      // 2. Actualizar Stock del Lote
      this._lotes.update(lotes => lotes.map(lote => {
        if (lote.id === mov.loteId) {
          const nuevoStock = mov.esEntrada 
            ? lote.stockActual + mov.cantidad 
            : lote.stockActual - mov.cantidad;
          
          return {
            ...lote,
            stockActual: nuevoStock,
            estado: nuevoStock <= 0 ? 'AGOTADO' : 'DISPONIBLE'
          };
        }
        return lote;
      }));
    }
  }
}
