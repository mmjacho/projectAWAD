import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AuthService {
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
  }
}