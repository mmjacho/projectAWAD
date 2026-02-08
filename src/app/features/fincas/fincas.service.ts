import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Finca } from '../../core/models/finca.model';
import { FincaRequest } from '../../core/requests/finca.request';
import { ApiResponse } from '../../core/response/api-response';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FincasService {
  private http = inject(HttpClient);
  
  private _fincas = signal<Finca[]>([]);
  public readonly fincas = this._fincas.asReadonly();

  constructor() {
    this.loadFincas();
  }

  public loadFincas() {
    const url = environment.UrlServicioGetFinca;
    const payload: FincaRequest = { transaccion: 'TRX_GET_ALL_FINCAS' };

    this.http.post<ApiResponse<Finca[]>>(url, payload).subscribe({
      next: (res) => { if (res.success) this._fincas.set(res.data); },
      error: (err) => console.error('Error:', err)
    });
  }

  addFinca(finca: Finca): Observable<ApiResponse<Finca>> {
    const url = environment.UrlServicioSetFinca;
    const payload: FincaRequest = {
      transaccion: 'TRX_INSERT_FINCA',
      nombre: finca.nombre,
      ubicacion: finca.ubicacion,
      hectareas: finca.hectareas,
      productorId: finca.productorId,
      anulado: finca.anulado // false si es activa
    };

    return this.http.post<ApiResponse<Finca>>(url, payload).pipe(
      tap(res => { if (res.success) this.loadFincas(); })
    );
  }

  updateFinca(finca: Finca): Observable<ApiResponse<Finca>> {
    const url = environment.UrlServicioSetFinca;
    const payload: FincaRequest = {
      transaccion: 'TRX_UPDATE_FINCA',
      id: finca.id,
      nombre: finca.nombre,
      ubicacion: finca.ubicacion,
      hectareas: finca.hectareas,
      productorId: finca.productorId,
      anulado: finca.anulado
    };

    return this.http.post<ApiResponse<Finca>>(url, payload).pipe(
      tap(res => { if (res.success) this.loadFincas(); })
    );
  }

  deleteFinca(id: number): Observable<ApiResponse<Finca>> {
    const url = environment.UrlServicioSetFinca;
    const payload: FincaRequest = { transaccion: 'TRX_DELETE_FINCA', id: id };
    
    return this.http.post<ApiResponse<Finca>>(url, payload).pipe(
      tap(res => { if (res.success) this.loadFincas(); })
    );
  }
}