import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GAMES } from '../mock-data/mock_games';
import { Game } from "../models/game";
import { GameDataService } from '../services/game-data/game-data.service';
import { User } from '../models/user';
import { UserDataService } from '../services/user-data/user-data.service';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

	games = GAMES;
	activeMatches?: Array<Game>;
	activeUser?: User;

	constructor(
		private gameservice: GameDataService,
		private socketService: SocketService,
		private router: Router,
		private userService: UserDataService
	) {	}

	ngOnInit() {
		this.userService.findSelf().then(user => {
			this.activeUser = user;
		});
		this.activeMatches = this.gameservice.getActiveMatches();
		this.connectSocket();
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

	sendMessage(eventName: string, data: string) {
		this.socketService.emit(eventName, data);
	}
}
