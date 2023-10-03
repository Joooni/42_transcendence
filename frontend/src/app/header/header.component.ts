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
			console.log('caught error in header onInit')
		}

	}

	checkAuthentication() {
		setInterval(() => {
			try {
				this.isAuthenticated = this.authService.isAuthenticated;
				if (this.isAuthenticated) {
					console.log('check auth by calling findself')
					this.userDataService.findSelf().then(user => this.activeUser = user);
				}
			} catch (e) {
				console.log('caught error in header checkAuth');
			}
		}, 500);
	}
}
