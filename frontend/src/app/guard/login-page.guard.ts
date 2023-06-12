import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { UserDataService } from '../services/user-data/user-data.service';
import { USERS } from '../mock_users';
import { User } from '../objects/user';

export const loginPageGuard: CanActivateFn = async () => {
  console.log('loginPageGuard');
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated: boolean = await authService.isAuthenticated();
  // const twoFAEnabled: boolean = await authService.twoFAEnabled();
  // console.log('login page guard isAuthed: ', isAuthenticated);
  if ( isAuthenticated ) {
    return router.createUrlTree(['/home']);
  }
  return true;
};