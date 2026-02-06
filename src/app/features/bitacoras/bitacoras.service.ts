import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Bitacora } from '../../core/models/bitacora.model';
import { Plaga } from '../../core/models/plaga.model';
import { Labor } from '../../core/models/labor.model';
import { ApiResponse } from '../../core/response/api-response';
import { tap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class BitacorasService {
  private http = inject(HttpClient);
  
  // Datos principales
  private _registros = signal<Bitacora[]>([]);
  public readonly registros = this._registros.asReadonly();

  // Catálogos
  public _labores = signal<Labor[]>([]);
  public readonly labores = this._labores.asReadonly();

  public _plagas = signal<Plaga[]>([]);
   public readonly plagas = this._plagas.asReadonly();

  constructor() {
    this.loadRegistros();
    this.loadLabores();
    this.loadPlagas();
  }

  public loadLabores() {
    const url = environment.UrlServicioGetLabor;
    const payload = { transaccion: 'TRX_GET_ALL_LABORES' };
    this.http.post<ApiResponse<Labor[]>>(url, payload).subscribe({
      next: (res) => { if (res.success) this._labores.set(res.data); }
    });
  }

  public loadPlagas() {
    const url = environment.UrlServicioGetPlaga;
    const payload = { transaccion: 'TRX_GET_ALL_PLAGAS' };
    this.http.post<ApiResponse<Plaga[]>>(url, payload).subscribe({
      next: (res) => { if (res.success) this._plagas.set(res.data); }
    });
  }

  loadRegistros() {
    const url = environment.UrlServicioGetBitacora;
    this.http.post<ApiResponse<Bitacora[]>>(url, { transaccion: 'TRX_GET_ALL_BITACORA' })
        .subscribe(res => { if(res.success) this._registros.set(res.data); });
  }

  addRegistro(item: Bitacora) {
     const url = environment.UrlServicioSetBitacora;
     const payload = { ...item, transaccion: 'TRX_INSERT_BITACORA' };
     
     return this.http.post<ApiResponse<Bitacora>>(url, payload).pipe(
        tap((res) => {
            if (res.success) this.loadRegistros(); 
        })
     );
  }
  
  updateRegistro(item: Bitacora) {
     const url = environment.UrlServicioSetBitacora;
     const payload = { ...item, transaccion: 'TRX_UPDATE_BITACORA' };
     
     return this.http.post<ApiResponse<Bitacora>>(url, payload).pipe(
        tap((res) => {
            if (res.success) this.loadRegistros(); 
        })
     );
  }

  deleteRegistro(id: number) {
     const url = environment.UrlServicioSetBitacora;
     const payload = { id, transaccion: 'TRX_DELETE_BITACORA' };
     
     return this.http.post<ApiResponse<Bitacora>>(url, payload).pipe(
        tap((res) => {
            if (res.success) this.loadRegistros(); 
        })
     );
  }
}