import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Usuario } from '../../core/models/usuario.model';
import { UsuarioRequest } from '../../core/requests/usuario.request';
import { ApiResponse } from '../../core/response/api-response';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

// // Datos quemados
// const MOCK_USUARIOS: Usuario[] = [
//   { id: 1, nombre: 'Ana', apellido: 'García', email: 'ana.garcia@email.com', rol: 'Admin', activo: true },
//   { id: 2, nombre: 'Luis', apellido: 'Martínez', email: 'luis.martinez@email.com', rol: 'Productor', activo: true },
//   { id: 3, nombre: 'Sofía', apellido: 'Hernández', email: 'sofia.h@email.com', rol: 'Cliente', activo: false },
//   { id: 4, nombre: 'Carlos', apellido: 'López', email: 'carlos.lopez@email.com', rol: 'Productor', activo: true },
// ];

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl; // Usa la URL centralizada

  // Señal privada y pública de solo lectura
  private _usuarios = signal<Usuario[]>([]);
  public readonly usuarios = this._usuarios.asReadonly();

  constructor() {
    // Cargar usuarios al iniciar el servicio
    this.loadUsuarios();
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

  // Añadir usuario
  addUser(usuario: Usuario): Observable<ApiResponse<Usuario>> {
    const url = environment.UrlServicioSetUsuario;
    
    // Mapeamos el modelo de UI al Request que espera el SP
    const payload: UsuarioRequest = {
      transaccion: 'TRX_Insert_Usuario',
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rolId: this.mapRolToId(usuario.rol), // Método auxiliar para convertir rol string a ID
      activo: usuario.activo,
      // VALORES POR DEFECTO (Necesarios porque el SP los pide y no están en el form)
      codigo: usuario.email.split('@')[0], 
      cedula: '9999999999', 
      contrasenia: '123456'
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
      rolId: this.mapRolToId(usuario.rol),
      activo: usuario.activo,
      // Mantener datos obligatorios del SP
      codigo: usuario.email.split('@')[0],
      cedula: '9999999999', 
      contrasenia: '123456' 
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