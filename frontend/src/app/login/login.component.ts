
import { Component, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDataService } from '../services/user-data/user-data.service';
import { AuthService } from '../services/auth.service';
import { loginPageGuard } from '../guard/login-page.guard';
import { User } from '../objects/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

@Injectable()
export class LoginComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly userDataService: UserDataService,
    private readonly router: Router) {}

  activeUser?: boolean;
  twoFAEnabled?: boolean;
  twoFAString?: string;

  async ngOnInit() {
    this.activeUser = await this.authService.isAuthenticated();
    this.twoFAEnabled = await this.authService.twoFAEnabled();
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const code = params.get('code');
      if (code) {
        this.userDataService.login(code);
        this.router.navigate([], {
          queryParams: {
            'code': null,
          },
          queryParamsHandling: 'merge'
        });
      } else {
        return ;
      }
    });
  }


  onEnter() {
    if (typeof this.twoFAString === 'undefined' || this.twoFAString.length === 0)
      return ;
    console.log('2fa string: ', this.twoFAString);
    this.userDataService.verify2FA(this.twoFAString);
  }

  onLogin() {
    window.location.href = 'http://localhost:3000/auth/login';
  };

}
