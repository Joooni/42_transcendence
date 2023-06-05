import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService) { }

  isAuthenticated() {
    const cookie = this.cookieService.get('jwt');
    console.log('cookie: ', cookie);
    if (cookie) {
      return false;
    }
    return true;
  }
}
