import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Home } from './features/home/home';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  /*{
    path: 'login',
    component: Login
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }*/
  { path: 'login', component: Login },
 
  // 👉 Por defecto redirigimos a login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
   // 👉 Home solo se puede entrar si está logueado
  { path: 'home', component: Home, canActivate: [authGuard] },
  
  // 👉 cualquier ruta desconocida vuelve a login
  { path: '**', redirectTo: '/login' }
];
