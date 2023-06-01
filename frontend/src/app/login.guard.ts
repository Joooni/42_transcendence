import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { UserDataService } from './user-data.service';

// export function LoginGuard: CanActivateFn(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
//   return true;
// };

export function LoginGuard(userData: UserDataService, router: Router): (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Observable<boolean> {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return userData.fetchSelfData().pipe(
      catchError(() => {
        userData.logout();
        return of(false);
      }),
      map(() =>{
        if (!userData.isLoggedIn && route.routeConfig?.path !== 'login') {
          return router.createUrlTree(['/login']);
        }

        if (
          !userData.isLoggedIn && route.routeConfig?.path === 'login' && route.queryParams['code']
        ) {
          userData.login(route.queryParams['code']);
          const queryParams = route.queryParams;
          delete queryParams['code'];
          return router.createUrlTree([route.url],{ queryParams });
        }

        if (userData.isLoggedIn && route.routeConfig?.path === 'login') {
          return router.createUrlTree(['/home']);
        }

        return true;
      })
    );
  };
}

// export class LoginGuard {
//   constructor(private userStore: UserStoreService, private router: Router) {}

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
//     return this.userStore.fetchSelfData().pipe(
//       tap(() => {}),
//       catchError(() => {
//         this.userStore.logout();
//         return of(false);
//       }),
//       map(() => {
//         if (!this.userStore.isLoggedIn && route.routeConfig?.path !== 'login') {
//           this.router.navigate(['/login']);
//           return false;
//         }

//         if (
//           !this.userStore.isLoggedIn &&
//           route.routeConfig?.path === 'login' &&
//           route.queryParams.code
//         ) {
//           // Remove bypass for production
//           this.userStore.login(route.queryParams.code, route.queryParams.id);
//           delete route.queryParams.code;
//           this.router.navigate([route.url], { queryParams: route.queryParams });
//           return false;
//         }

//         if (this.userStore.isLoggedIn && route.routeConfig?.path === 'login') {
//           this.router.navigate(['/home']);
//           return false;
//         }

//         return true;
//       })
//     );
//   }
// }