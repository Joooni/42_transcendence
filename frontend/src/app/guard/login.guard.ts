import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserDataService } from '../services/user-data/user-data.service';

export const LoginGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const userDataService = inject(UserDataService);
    const code = route.paramMap.get('code');
    const isAuthenticated: boolean = await authService.isAuthenticated();
    if ( !isAuthenticated && code) {
      await userDataService.login(code);
    }
    if ( !isAuthenticated ) {
      return router.createUrlTree(['/login']);
    }
    return true;
  }

