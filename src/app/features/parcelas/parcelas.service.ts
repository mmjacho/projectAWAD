import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Parcela } from '../../core/models/parcela.model';
import { Variedad } from '../../core/models/variedad.model'; // Nuevo
import { ParcelaRequest } from '../../core/requests/parcela.request'; // Crear interfaz similar a las anteriores
import { ApiResponse } from '../../core/response/api-response';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParcelasService {
  private http = inject(HttpClient);
  
  private _parcelas = signal<Parcela[]>([]);
  public readonly parcelas = this._parcelas.asReadonly();

  // Señal para catálogo de variedades
  private _variedades = signal<Variedad[]>([]);
  public readonly variedades = this._variedades.asReadonly();

  constructor() {
    this.loadParcelas();
    this.loadVariedades(); // Cargar catálogo al inicio
  }

  public loadParcelas() {
    const url = environment.UrlServicioGetParcela;
    const payload = { transaccion: 'TRX_GET_ALL_PARCELAS' };
    this.http.post<ApiResponse<Parcela[]>>(url, payload).subscribe({
      next: (res) => { if (res.success) this._parcelas.set(res.data); }
    });
  }

  public loadVariedades() {
    const url = environment.UrlServicioGetVariedad;
    const payload = { transaccion: 'TRX_GET_ALL_VARIEDADES' };
    this.http.post<ApiResponse<Variedad[]>>(url, payload).subscribe({
      next: (res) => { if (res.success) this._variedades.set(res.data); }
    });
  }

  addParcela(parcela: Parcela): Observable<ApiResponse<Parcela>> {
    
    const url = environment.UrlServicioSetParcela;
    const payload: ParcelaRequest = { // Asumiendo que creaste esta interfaz
      transaccion: 'TRX_INSERT_PARCELA',
      nombre: parcela.nombre,
      descripcion: parcela.descripcion,
      area: parcela.area,
      fincaId: parcela.fincaId,
      variedadId: parcela.variedadId,
      anulado: parcela.anulado
    };

    return this.http.post<ApiResponse<Parcela>>(url, payload).pipe(
      tap(res => { if (res.success) this.loadParcelas(); })
    );
  }

  updateParcela(parcela: Parcela): Observable<ApiResponse<Parcela>> {
      // Lógica similar a addParcela con TRX_UPDATE_PARCELA y el ID
      const url = environment.UrlServicioSetParcela;
      const payload: ParcelaRequest = {
        transaccion: 'TRX_UPDATE_PARCELA',
        id: parcela.id,
        nombre: parcela.nombre,
        descripcion: parcela.descripcion,
        area: parcela.area,
        fincaId: parcela.fincaId,
        variedadId: parcela.variedadId,
        anulado: parcela.anulado
      };
      return this.http.post<ApiResponse<Parcela>>(url, payload).pipe(
        tap(res => { if (res.success) this.loadParcelas(); })
      );
  }

  deleteParcela(id: number): Observable<ApiResponse<Parcela>> {
      const url = environment.UrlServicioSetParcela;
      const payload = { transaccion: 'TRX_DELETE_PARCELA', id: id };
      return this.http.post<ApiResponse<Parcela>>(url, payload).pipe(
        tap(res => { if (res.success) this.loadParcelas(); })
      );
  }
}