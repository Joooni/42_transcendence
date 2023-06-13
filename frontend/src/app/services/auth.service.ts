import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { USERS } from '../mock_users';
import { User } from '../objects/user';
import { UserDataService } from './user-data/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService, private readonly userDataService: UserDataService) { }

  async isAuthenticated(): Promise<boolean> {
    let user: User = USERS[0];
    try {
      const user = await this.userDataService.findSelf();
    } catch (error) {
      return false;
    }
    return true;
  }

  async twoFAEnabled(): Promise<boolean> {
    let user: User = USERS[0];
    try {
      const user = await this.userDataService.findSelf();
    } catch (error) {}
    return user.twoFAEnabled;
  }
}
