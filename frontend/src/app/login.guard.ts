import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, from, map, of } from 'rxjs';
import { UserDataService } from './user-data.service';
import { User } from './user';

// export function LoginGuard: CanActivateFn(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
//   return true;
// };

export function LoginGuard(userData: UserDataService, router: Router): CanActivateFn {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return true;
  }
}
