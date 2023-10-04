import { Component, OnInit } from '@angular/core';

import { User } from '../models/user';
import { SocketService } from '../services/socket/socket.service';
import { AuthService } from '../services/auth/auth.service';
import { UserDataService } from '../services/user-data/user-data.service';
import { GameInviteService } from '../services/game-invite/game-invite.service';
import { ErrorService } from '../services/error/error.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	
	activeUser?: User;
	isAuthenticated: boolean = false;
	
	constructor(
		private authService: AuthService,
		private userDataService: UserDataService,
		private gameInviteService: GameInviteService,
		private errorService: ErrorService,
	) {

		window.addEventListener('pageshow', function (event) {
			if (event.persisted) {
				window.location.reload();
			}
		});

		if ((window.performance.getEntries()[0] as PerformanceNavigationTiming).type  === 'back_forward'){
			window.location.reload();
		}
	}

	ngOnInit() {
		try {
			this.checkAuthentication();
			this.gameInviteService.initGameInviteService();
			this.errorService.initErrorService();
		} catch (e) {
			this.errorService.showErrorMessage("You have been logged out. Please refresh and/or log in again.");
		}

	}

	checkAuthentication() {
		setInterval(() => {
			this.isAuthenticated = this.authService.isAuthenticated;
			if (this.isAuthenticated) {
				this.userDataService.findSelf()
					.then((user) => {
						this.activeUser = user;
						if (!this.activeUser?.hasLoggedInBefore)
							this.errorService.showFirstLoginPopup();
					}).catch(() => {});
			}
		}, 500);
	}
}
