import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoginRequest } from '../core/requests/login.request'; // Ver punto 2
import { ApiResponse } from '../core/response/api-response';

export interface AutorizacionData {
  token: string;
  // Agrega aquí otras propiedades que devuelva tu clase Autorizacion en C#
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // URL de tu API (Asegúrate de cambiar el puerto por el real de tu .NET)
  private baseUrl = environment.UrlServicioAutorizacion;

  private _isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));
  public isLoggedIn = this._isLoggedIn.asReadonly();
  
  login(user: string, pass: string) {
    // Construimos el objeto que espera tu UsuarioRequest en C#
    const payload: LoginRequest = {
      cedula: user,
      contrasenia: pass,
      transaccion: 'TRX_VALIDAR_USUARIO' // O el código que tu SP espere para login
    };

    console.log(this.baseUrl);

    return this.http.post<ApiResponse<AutorizacionData>>(this.baseUrl, payload)
      .pipe(
        tap(response => {
          if (response.success && response.data?.token) {
            // Guardar token y actualizar estado
            localStorage.setItem('token', response.data.token);
            this._isLoggedIn.set(true);
            this.router.navigateByUrl('/home'); // Redirigir al dashboard
          } else {
            alert(response.message || 'Error al iniciar sesión');
          }
        }),
        catchError(error => {
          console.error('Login error', error);
          alert('Error de conexión o credenciales inválidas');
          return throwError(() => error);
        })
      )
      .subscribe(); // Nos suscribimos para ejecutar la petición
  }

  logout() {
    localStorage.removeItem('token');
    this._isLoggedIn.set(false);
    this.router.navigateByUrl('/login');
  }

  /*
  private _isLoggedIn = signal<boolean>(false);
  isLoggedIn = this._isLoggedIn.asReadonly();

  constructor(private router: Router) {
    const token = localStorage.getItem('token');
    this._isLoggedIn.set(!!token);
  }

  login(user: string, pass: string) {
    if (user === 'admin' && pass === '1234') {
      localStorage.setItem('token', 'fake-jwt-token');
      this._isLoggedIn.set(true);
      console.log('Valor signal:', this._isLoggedIn());
      this.router.navigateByUrl('/home');
      alert('bienvenido a AgroCafé Admin.');
    } else {
      alert('Credenciales incorrectas');
      console.log('Valor signal:', this._isLoggedIn());
    }
  }

  logout() {
    localStorage.removeItem('token');
    this._isLoggedIn.set(false);
    this.router.navigateByUrl('/login');
  }*/
}