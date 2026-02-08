import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Pedido } from '../../core/models/pedido.model';
import { ApiResponse } from '../../core/response/api-response';
import { tap } from 'rxjs/operators';
import { InventarioService } from '../inventario/inventario.service'; // Para recargar stock al vender

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private http = inject(HttpClient);
  private inventarioService = inject(InventarioService); // Inyectamos para refrescar inventario

  private _pedidos = signal<Pedido[]>([]);
  public readonly pedidos = this._pedidos.asReadonly();

  constructor() {
    this.loadPedidos();
  }

  loadPedidos() {
    const url = environment.UrlServicioGetPedido;
    this.http.post<ApiResponse<Pedido[]>>(url, { transaccion: 'TRX_GET_ALL_PEDIDOS' })
        .subscribe(res => { if(res.success) this._pedidos.set(res.data); });
  }

  registrarPedido(pedido: any) {
    const url = environment.UrlServicioSetPedido;
    
    // Armamos el objeto tal cual lo espera el backend (PedidoRequest)
    // Nota: El backend espera 'Items' con mayúscula o según tu serializador, revisa eso.
    const payload = { 
        ...pedido, 
        transaccion: 'TRX_INSERT_PEDIDO',
        // Aseguramos que la fecha vaya en formato ISO
        fecha: new Date(pedido.fecha).toISOString()
    };

    return this.http.post<ApiResponse<Pedido>>(url, payload).pipe(
        tap(res => { 
            if(res.success) {
                this.loadPedidos(); // Recargar lista ventas
                this.inventarioService.loadLotes(); // Recargar stock (bajó por la venta)
                this.inventarioService.loadMovimientos(); // Recargar kardex
            }
        })
    );
  }

  anularPedido(id: number) {
    const url = environment.UrlServicioSetPedido;
    const payload = { id, transaccion: 'TRX_ANULAR_PEDIDO' };

    return this.http.post<ApiResponse<Pedido>>(url, payload).pipe(
        tap(res => { 
            if(res.success) {
                this.loadPedidos();
                this.inventarioService.loadLotes(); // El stock sube al anular
                this.inventarioService.loadMovimientos();
            }
        })
    );
  }
}