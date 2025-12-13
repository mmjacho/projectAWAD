import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service'; // Ajusta la ruta a tu servicio

export const publicGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Si YA está logueado, no debe ver el login, lo mandamos al home
  if (auth.isLoggedIn()) {
    console.log('Usuario ya autenticado, redirigiendo a Home...');
    router.navigateByUrl('/home');
    return false; // Bloquea el acceso al Login
  }

  // Si NO está logueado, permite entrar al Login
  return true;
};