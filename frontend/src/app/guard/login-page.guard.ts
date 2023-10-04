import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';

export const loginPageGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated: boolean = await authService.isUserAuthenticated();
  if ( isAuthenticated ) {
    return router.createUrlTree(['/home']);
  }
  return true;
};