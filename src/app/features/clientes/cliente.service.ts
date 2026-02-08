import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Cliente } from '../../core/models/cliente.model';
import { ClienteRequest } from '../../core/requests/cliente.request';
import { ApiResponse } from '../../core/response/api-response';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);
  
  // Señales
  private _clientes = signal<Cliente[]>([]);
  public readonly clientes = this._clientes.asReadonly();

  constructor() {
    this.loadClientes();
  }

  public loadClientes() {
    const url = environment.UrlServicioGetCliente;
    const payload: ClienteRequest = { transaccion: 'TRX_GET_ALL_CLIENTES' };

    this.http.post<ApiResponse<Cliente[]>>(url, payload).subscribe({
      next: (response) => {
        if (response.success) {
          this._clientes.set(response.data);
        }
      },
      error: (err) => console.error('Error cargando clientes:', err)
    });
  }

  addCliente(cliente: Cliente): Observable<ApiResponse<Cliente>> {
    const url = environment.UrlServicioSetCliente;
    const payload: ClienteRequest = {
      transaccion: 'TRX_INSERT_CLIENTE',
      ruc: cliente.ruc,
      razonSocial: cliente.razonSocial,
      email: cliente.email,
      telefono: cliente.telefono,
      tipo: cliente.tipo,
      anulado: false // Por defecto activo al crear
    };

    return this.http.post<ApiResponse<Cliente>>(url, payload).pipe(
      tap(res => { if (res.success) this.loadClientes(); })
    );
  }

  updateCliente(cliente: Cliente): Observable<ApiResponse<Cliente>> {
    const url = environment.UrlServicioSetCliente;
    const payload: ClienteRequest = {
      transaccion: 'TRX_UPDATE_CLIENTE',
      id: cliente.id,
      ruc: cliente.ruc,
      razonSocial: cliente.razonSocial,
      email: cliente.email,
      telefono: cliente.telefono,
      tipo: cliente.tipo,
      anulado: cliente.anulado
    };

    return this.http.post<ApiResponse<Cliente>>(url, payload).pipe(
      tap(res => { if (res.success) this.loadClientes(); })
    );
  }

  deleteCliente(id: number): Observable<ApiResponse<Cliente>> {
    const url = environment.UrlServicioSetCliente;
    const payload: ClienteRequest = {
      transaccion: 'TRX_DELETE_CLIENTE',
      id: id
    };

    return this.http.post<ApiResponse<Cliente>>(url, payload).pipe(
      tap(res => { if (res.success) this.loadClientes(); })
    );
  }
}