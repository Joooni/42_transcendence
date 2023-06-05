import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { USERS } from '../mock_users';
import { User } from '../user';
import { UserDataService } from '../user-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService, private readonly userDataService: UserDataService) { }

  isAuthenticated() {
    let user: User = USERS[0];
    const cookie = this.cookieService.get('jwt');
    try {
      const user = this.userDataService.findSelf();
    } catch (error) {
      console.log('isAuthenticated() catch block');
      return false;
    }
    console.log('user: ', user);
    console.log('cookie: ', cookie);
    if (!user || !cookie) {
      console.log('inside if');
      return false;
    }
    return true;
  }
}
