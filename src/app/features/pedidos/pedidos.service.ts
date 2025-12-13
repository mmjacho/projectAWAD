import { Injectable, signal, inject } from '@angular/core';
import { Pedido } from '../../core/models/pedido.model';
import { InventarioService } from '../inventario/inventario.service';

const MOCK_PEDIDOS: Pedido[] = [];

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  private _pedidos = signal<Pedido[]>(MOCK_PEDIDOS);
  public readonly pedidos = this._pedidos.asReadonly();
  
  // Inyectamos inventario para descontar stock
  private inventarioService = inject(InventarioService);

  constructor() {}

  registrarPedido(pedido: Omit<Pedido, 'id' | 'numeroFactura'>) {
    const currentId = this._pedidos().length + 1;
    const numeroFactura = `FAC-${new Date().getFullYear()}-${currentId.toString().padStart(4, '0')}`;

    const nuevoPedido: Pedido = {
      ...pedido,
      id: currentId,
      numeroFactura
    };

    // 1. Guardar el pedido
    this._pedidos.update(lista => [nuevoPedido, ...lista]);

    // 2. Descontar del Inventario (IMPORTANTE)
    // Recorremos los items y registramos una SALIDA por cada uno
    nuevoPedido.items.forEach(item => {
      this.inventarioService.registrarMovimiento({
        loteId: item.loteId,
        fecha: pedido.fecha,
        tipo: 'VENTA',
        cantidad: item.cantidad,
        esEntrada: false, // Resta stock
        motivo: `Venta Factura ${numeroFactura}`
      });
    });
  }

  anularPedido(id: number) {
    // Aquí iría la lógica para devolver el stock (Entrada por anulación)
    // Por simplicidad solo cambiamos el estado
    this._pedidos.update(lista => 
      lista.map(p => p.id === id ? { ...p, estado: 'ANULADO' } : p)
    );
  }
}
