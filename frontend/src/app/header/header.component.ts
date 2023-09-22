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
		private socketService: SocketService,
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
		// this.connectSocket();
		this.checkAuthentication();
		this.gameInviteService.initGameInviteService();
		this.errorService.initErrorService();
	}

	checkAuthentication() {
		setInterval(() => {
			this.isAuthenticated = this.authService.isAuthenticated;
			if (this.isAuthenticated)
				this.userDataService.findSelf().then(user => this.activeUser = user);
		}, 500);
	}

	async connectSocket() {
		for (let i = 0; i < 20; i++) {
			await new Promise(resolve => setTimeout(resolve, 500));
			if (this.socketService.connected == false)
				await this.socketService.connectSocket();
			else
				break;
		}
	}
}
