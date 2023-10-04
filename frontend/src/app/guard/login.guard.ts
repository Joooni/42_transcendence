import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { UserDataService } from '../services/user-data/user-data.service';

export const LoginGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const userDataService = inject(UserDataService);
    const code = route.paramMap.get('code');
    const bypassId = route.paramMap.get('id') as string | undefined;
    const isAuthenticated: boolean = await authService.isUserAuthenticated();
    if ( !isAuthenticated && code) {
      await userDataService.login(code, bypassId).catch(() => {});
    }
    if ( !isAuthenticated ) {
      return router.createUrlTree(['/login']);
    }
    return true;
  }
