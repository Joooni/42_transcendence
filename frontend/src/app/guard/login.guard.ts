import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserDataService } from '../services/user-data/user-data.service';

export const LoginGuard: CanActivateFn = async (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const userDataService = inject(UserDataService);
    const code = route.paramMap.get('code');
    const bypassId = route.paramMap.get('id') as string | undefined;
    const isAuthenticated: boolean = await authService.isAuthenticated();
    // todo: if user is not logged in yet and 2FA is active,
    // show OTP input field and wait for this to verify
    // Maybe do this in the frontend component, though
    if ( !isAuthenticated && code) {
      await userDataService.login(code, bypassId);
    }
    if ( !isAuthenticated ) {
      return router.createUrlTree(['/login']);
    }
    return true;
  }

