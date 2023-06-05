import { ActivatedRoute, CanActivateFn, Router } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './services/auth.service';
import { tap } from 'rxjs/operators';
import { UserDataService } from './user-data.service';
import { User } from './user';
import { USERS } from './mock_users';

// export function LoginGuard: CanActivateFn(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
//   return true;
// };

export function LoginGuard(): CanActivateFn {
  return async () => {
    console.log('inside login guard 1');
    const userDataService = inject(UserDataService);
    let user: User = USERS[0];
    console.log('empty user: ', user);
    // check if there is a user present
    try {
      user = await userDataService.findSelf();
    } catch (error) {
      await userDataService.logout();
    }

    const router = inject(Router);
    const route = inject(ActivatedRoute);
    const code = route.snapshot.paramMap.get('code');

    if ( !user.isLoggedIn ) {
      return router.createUrlTree(['/login']);
    }
    if ( !user.isLoggedIn && router.url === '/login' && code) {
      await userDataService.login(code);
    }
    router.navigate([], {
      queryParams: {
        'code': null,
      },
      queryParamsHandling: 'merge'
    });
    const authService = inject(AuthService);
    if (authService.isAuthenticated())
      return true;
    return router.createUrlTree(['/login']);
  }
}
  // return () => {
  //   console.log('inside login guard return');
  //   const router = new Router();
  //   const cookieService = inject(CookieService);
  //   const jwtHelper = new JwtHelperService();
  //   const cookie = cookieService.get('jwt');
  //   const decodedToken = jwtHelper.decodeToken(cookie);
  //   console.log('cookie: ', cookie);
  //   console.log('decoded Token: ', decodedToken);
  //   if (cookie) {
  //     return true;
  //   } else {
  //     router.createUrlTree(['/login']);
  //     return false;
  //   }
  // }

