import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Productor } from '../../core/models/productor.model';
import { ProductorRequest } from '../../core/requests/productor.request';
import { ApiResponse } from '../../core/response/api-response';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductoresService {
  private http = inject(HttpClient);
  
  // Señales
  private _productores = signal<Productor[]>([]);
  public readonly productores = this._productores.asReadonly();

  constructor() {
    this.loadProductores();
  }

  public loadProductores() {
    const url = environment.UrlServicioGetProductor;
    const payload: ProductorRequest = { transaccion: 'TRX_GET_ALL_PRODUCTORES' };

    this.http.post<ApiResponse<Productor[]>>(url, payload).subscribe({
      next: (response) => {
        if (response.success) {
          this._productores.set(response.data);
        }
      },
      error: (err) => console.error('Error:', err)
    });
  }

  addProductor(productor: Productor): Observable<ApiResponse<Productor>> {
    const url = environment.UrlServicioSetProductor;
    const payload: ProductorRequest = {
      transaccion: 'TRX_INSERT_PRODUCTOR',
      cedula: productor.cedula,
      nombre: productor.nombre,
      apellido: productor.apellido,
      email: productor.email,
      telefono: productor.telefono,
      direccion: productor.direccion,
      anulado: productor.anulado // false si es activo
    };

    return this.http.post<ApiResponse<Productor>>(url, payload).pipe(
      tap(res => { if (res.success) this.loadProductores(); })
    );
  }

  updateProductor(productor: Productor): Observable<ApiResponse<Productor>> {
    const url = environment.UrlServicioSetProductor;
    const payload: ProductorRequest = {
      transaccion: 'TRX_UPDATE_PRODUCTOR',
      id: productor.id,
      cedula: productor.cedula,
      nombre: productor.nombre,
      apellido: productor.apellido,
      email: productor.email,
      telefono: productor.telefono,
      direccion: productor.direccion,
      anulado: productor.anulado
    };

    return this.http.post<ApiResponse<Productor>>(url, payload).pipe(
      tap(res => { if (res.success) this.loadProductores(); })
    );
  }

  deleteProductor(id: number): Observable<ApiResponse<Productor>> {
    const url = environment.UrlServicioSetProductor;
    const payload: ProductorRequest = {
      transaccion: 'TRX_DELETE_PRODUCTOR',
      id: id
    };

    return this.http.post<ApiResponse<Productor>>(url, payload).pipe(
      tap(res => { if (res.success) this.loadProductores(); })
    );
  }
}