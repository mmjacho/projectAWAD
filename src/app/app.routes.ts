import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Home } from './features/home/home';
import { MainLayout } from './layout/main-layout/main-layout';
import { authGuard } from './core/auth.guard';
import { publicGuard } from './core/public.guard';

export const routes: Routes = [
  /* // 1. Ruta de Login: Usamos publicGuard para que si ya está logueado, lo saque de aquí
  { 
    path: 'login', 
    component: Login, 
    canActivate: [publicGuard] // <--- CAMBIO IMPORTANTE
  },

  // 2. Rutas protegidas: Sugiero agruparlas bajo el Layout Principal
  // Esto hace que el sidebar/header solo aparezcan si estás logueado
  {
    path: '',
    component: MainLayout, // Tu contenedor con Sidebar/Header
    canActivate: [authGuard], // Protege todo lo que esté adentro
    children: [
      { path: 'home', component: Home }, // Ya no necesita repetir el guard
      
      { 
        path: 'usuarios', 
        loadComponent: () => import('./features/usuarios/usuarios.components').then(m => m.UsuariosComponent)
      },
      { 
        path: 'clientes', 
        loadComponent: () => import('./features/clientes/clientes.component').then(m => m.ClientesComponent)
      },
      { 
        path: 'productores', 
        loadComponent: () => import('./features/productores/productores').then(m => m.Productores)
      },
      // Redirección por defecto INTERNA (si entra a localhost:4200/ va al home)
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  // 3. Cualquier ruta desconocida va al login
  { path: '**', redirectTo: '/login' }
 */

  
  { path: 'login', component: Login, canActivate: [publicGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: Home, canActivate: [authGuard] },

  // --- RUTAS NUEVAS AÑADIDAS ---
  { 
    path: 'usuarios', 
    loadComponent: () => import('./features/usuarios/usuarios.components').then(m => m.UsuariosComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'clientes', 
    loadComponent: () => import('./features/clientes/clientes.component').then(m => m.ClientesComponent),
    canActivate: [authGuard] 
  },
  // --- FIN RUTAS NUEVAS ---
  { 
    path: 'productores', 
    loadComponent: () => import('./features/productores/productores').then(m => m.Productores),
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: '/login' }
   
];
