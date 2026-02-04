import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../core/models/usuario.model';
import { Rol } from '../../core/models/rol.model'; // Importar modelo Rol
import { UsuarioRequest } from '../../core/requests/usuario.request';
import { ApiResponse } from '../../core/response/api-response';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

interface RolesRequest { transaccion: string; }

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl; // Usa la URL centralizada

  private _roles = signal<Rol[]>([]);
  public readonly roles = this._roles.asReadonly();

  // Señal privada y pública de solo lectura
  private _usuarios = signal<Usuario[]>([]);
  public readonly usuarios = this._usuarios.asReadonly();

  constructor() {
    // Cargar usuarios al iniciar el servicio
    this.loadUsuarios();
    this.loadRoles();
  }

  public loadUsuarios() {
    const url = environment.UrlServicioGetUsuario;
    const payload: UsuarioRequest = { transaccion: 'TRX_GET_ALL_USUARIOS' };

    this.http.post<ApiResponse<Usuario[]>>(url, payload).subscribe({
      next: (response) => {
        if (response.success) {
          this._usuarios.set(response.data);
        } else {
          console.error('Error cargando usuarios:', response.message);
        }
      },
      error: (err) => console.error('Error HTTP:', err)
    });
  }

  public loadRoles() {
    const url = environment.UrlServicioGetRoles;
    const payload: RolesRequest = { transaccion: 'TRX_GET_ALL_ROLES' };

    this.http.post<ApiResponse<Rol[]>>(url, payload).subscribe({
      next: (response) => {
        if (response.success) {
          this._roles.set(response.data);
        }
      },
      error: (err) => console.error('Error cargando roles:', err)
    });
  }

  // Añadir usuario
  addUser(usuario: Usuario): Observable<ApiResponse<Usuario>> {
    const url = environment.UrlServicioSetUsuario;
    
    // Mapeamos el modelo de UI al Request que espera el SP
    const payload: UsuarioRequest = {
      transaccion: 'TRX_Insert_Usuario',
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      cedula: usuario.cedula,
      codigo: usuario.codigo,
      contrasenia: usuario.contrasenia, // Ahora sí se envía desde el form
      rolId: usuario.rolId,
      activo: !usuario.anulado,// Enviaremos el bool como espera tu lógica o ajustamos el request
      anulado : usuario.anulado
      // OJO: Tu Request backend tiene "Activo" o "Anulado"? 
      // Si tu backend en UsuarioRequest tiene 'Anulado', envía 'anulado: usuario.anulado'.
      // Si usaremos la lógica del form donde true es activo:
    };

    return this.http.post<ApiResponse<Usuario>>(url, payload).pipe(
      tap((res) => {
        if (res.success) this.loadUsuarios(); // Recargamos la lista tras guardar
      })
    );
  }

  updateUser(usuario: Usuario): Observable<ApiResponse<Usuario>> {
    const url = environment.UrlServicioSetUsuario;

    const payload: UsuarioRequest = {
      transaccion: 'TRX_Update_Usuario',
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      cedula: usuario.cedula,
      codigo: usuario.codigo,
      contrasenia: usuario.contrasenia,
      rolId: usuario.rolId,
      // Si está activo (true) -> Anulado es false
      activo: !usuario.anulado,
      anulado : usuario.anulado
    };

    return this.http.post<ApiResponse<Usuario>>(url, payload).pipe(
      tap((res) => {
        if (res.success) this.loadUsuarios();
      })
    );
  }

  /**
   * Elimina (Anula) un usuario
   */
  deleteUser(id: number): Observable<ApiResponse<Usuario>> {
    const url = environment.UrlServicioSetUsuario;
    const payload: UsuarioRequest = {
      transaccion: 'TRX_Delete_Usuario',
      id: id
    };

    return this.http.post<ApiResponse<Usuario>>(url, payload).pipe(
      tap((res) => {
        if (res.success) this.loadUsuarios();
      })
    );
  }

  // Helper simple para convertir el string del select a un ID numérico
  // Idealmente esto vendría de una tabla de roles en BD
  private mapRolToId(rolName: string): number {
    switch (rolName) {
      case 'Admin': return 1;
      case 'Productor': return 2;
      case 'Cliente': return 3;
      default: return 3;
    }
  }
}