import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  console.log('inicio sesion =>',auth.isLoggedIn());
  
  if (!auth.isLoggedIn()) {
    router.navigateByUrl('/login');
    return false;
  }
  return true;
};
