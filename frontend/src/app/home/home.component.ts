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
		private socket: SocketService,
		private router: Router,
		private userService: UserDataService
	) {	}

	ngOnInit() {
		this.userService.findSelf().then(user => {
			this.activeUser = user;
		});
		this.activeMatches = this.gameservice.getActiveMatches();
		this.socket.listen('identify').subscribe(() => {
			this.socket.emit('identify', this.activeUser?.id);
		});
	}

	sendMessage(eventName: string, data: string) {
		this.socket.emit(eventName, data);
	}
}
