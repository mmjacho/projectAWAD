import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Lote } from '../../core/models/inventario.model';
import { Calidad } from '../../core/models/calidad.model';
import { Unidad } from '../../core/models/unidad.model';
import { Movimiento } from '../../core/models/movimiento.model';
import { ApiResponse } from '../../core/response/api-response';
import { tap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class InventarioService {
  private http = inject(HttpClient);

  // Datos
  private _lotes = signal<Lote[]>([]);
  public readonly lotes = this._lotes.asReadonly();
  
  // Catálogos
  private _calidades = signal<Calidad[]>([]);
  public readonly calidades = this._calidades.asReadonly();
    
  public _unidades = signal<Unidad[]>([]);
  public readonly unidades = this._unidades.asReadonly();

  private _movimientos = signal<Movimiento[]>([]);
  public readonly movimientos = this._movimientos.asReadonly();


  public readonly totalStock = computed(() => 
    this._lotes().reduce((acc, l) => acc + l.stockActual, 0)
  );

  constructor() {
    this.loadLotes();
    this.loadCalidades();
    this.loadUnidades();
    this.loadMovimientos();
  }

  public loadCalidades() {
      const url = environment.UrlServicioGetCalidades;
      const payload = { transaccion: 'TRX_GET_CALIDADES' };
      this.http.post<ApiResponse<Calidad[]>>(url, payload).subscribe({
        next: (res) => { if (res.success) this._calidades.set(res.data); }
      });
    }

  public loadUnidades() {
      const url = environment.UrlServicioGetUnidades;
      const payload = { transaccion: 'TRX_GET_UNIDADES' };
      this.http.post<ApiResponse<Unidad[]>>(url, payload).subscribe({
        next: (res) => { if (res.success) this._unidades.set(res.data); }
      });
    }

  loadLotes() {
      const url = environment.UrlServicioGetLotes;
      this.http.post<ApiResponse<Lote[]>>(url, { transaccion: 'TRX_GET_ALL_LOTES' })
        .subscribe(res => { if(res.success) this._lotes.set(res.data); });
  }

  public loadMovimientos() {
    const url = environment.UrlServicioGetMovimientos;
    // Usamos un objeto simple con la transacción
    const payload = { transaccion: 'TRX_GET_ALL_MOVIMIENTOS' };

    this.http.post<ApiResponse<Movimiento[]>>(url, payload).subscribe({
      next: (res) => {
        if (res.success) {
          this._movimientos.set(res.data);
        }
      },
      error: (err) => console.error('Error cargando kardex:', err)
    });
  }

  // Registrar Cosecha (Crea Lote + Movimiento en Backend)
  registrarCosecha(data: any) { // Data viene del form
      const url = environment.UrlServicioSetLote;
      const payload = { ...data, transaccion: 'TRX_INSERT_COSECHA' };
      
      return this.http.post<ApiResponse<any>>(url, payload).pipe(
          tap(res => { if(res.success) this.loadLotes(); this.loadMovimientos(); })
      );
  }
}