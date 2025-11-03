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
  { path: '', component: Home, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
