import { ActivatedRoute, CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { UserDataService } from './user-data.service';

// export function LoginGuard: CanActivateFn(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
//   return true;
// };

export function LoginGuard(): CanActivateFn {
  return async () => {
    console.log('inside loginguard');
    const router = inject(Router);
    const authService = inject(AuthService);
    const userDataService = inject(UserDataService);
    const route = inject(ActivatedRoute);
    const code = route.snapshot.paramMap.get('code');
    console.log('code', code);
    if (authService.isAuthenticated() && router.url === '/login') {
      console.log('isAuthenticated + route /login');
      return router.createUrlTree(['/home']);
    }
    if (authService.isAuthenticated()) {
      console.log('isAuthenticated');
      return true;
    }
    if ( router.url !== '/login') {
      console.log('route not /login');
      return router.createUrlTree(['/login']);
    }
    if ( router.url === '/login' && code) {
      await userDataService.login(code);
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
