
import { Component, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDataService } from '../services/user-data/user-data.service';
import { AuthService } from '../services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { ErrorService } from '../services/error/error.service';
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
    public userDataService: UserDataService,
    private readonly router: Router, 
		private errorService: ErrorService,
	) {}

  activeUser?: boolean;
  twoFACode?: string;
	wrongCode: boolean = false;

  async ngOnInit() {
    try {
			this.activeUser = await this.authService.isUserAuthenticated();
			this.activatedRoute.queryParamMap.subscribe((params) => {
				const code = params.get('code');
				const bypassId = params.get('id') as string | undefined;
				if (code) {
					this.router.navigate([], {
						queryParams: {
							'code': null,
						},
						queryParamsHandling: 'merge'
					});
					this.userDataService.login(code, bypassId).then((result) => {
						if (result === false) {
							const popup = document.getElementById("popup-2FA-login");
							popup?.classList.toggle('show-popup');
						}
					});
				}
			});
		} catch (error) {
			this.errorService.showErrorMessage();
		}
  }

  onLogin() {
    window.location.href = `http://${environment.DOMAIN}:3000/auth/login`;
  };

	async popUpConfirm() {
		await this.userDataService.verify2FA(this.twoFACode!)
		.then(() => {
			const popup = document.getElementById("popup-2FA-login");
			popup?.classList.toggle('show-popup');
			this.wrongCode = false;
			try {
				this.userDataService.updateStatus('online');
			} catch (e) {}
      this.router.navigate(['/home']);
		})
		.catch(() => {
			this.wrongCode = true;	
		})
	}
}
