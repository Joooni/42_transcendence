import { ActivatedRoute, CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserDataService } from '../services/user-data/user-data.service';

// export function LoginGuard: CanActivateFn(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
//   return true;
// };

export function LoginGuard(): CanActivateFn {
  return async () => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const userDataService = inject(UserDataService);
    const route = inject(ActivatedRoute);
    const code = route.snapshot.paramMap.get('code');
    const isAuthenticated: boolean = await authService.isAuthenticated();
    if ( !isAuthenticated && router.url !== '/login') {
      return router.createUrlTree(['/login']);
    }
    if ( !isAuthenticated && router.url === '/login' && code) {
      await userDataService.login(code);
      return true;
    }
    if ( isAuthenticated && router.url === '/login') {
      router.createUrlTree(['/home']);
      return true;
    }
  return false;
  }
}

// const code = route.snapshot.paramMap.get('code');

// if ( !user.isLoggedIn && router.url !== '/login') {
//   return router.createUrlTree(['/login']);
// }
// if ( !user.isLoggedIn && router.url === '/login' && code) {
//   await userDataService.login(code);
// }
// router.navigate([], {
//   queryParams: {
//     'code': null,
//   },
//   queryParamsHandling: 'merge'
// });
