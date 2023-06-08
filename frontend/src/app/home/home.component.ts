import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GAMES } from '../mock_games';
import { Game } from "../game";
import { GameDataService } from '../game-data.service';

import { User } from '../user';
import { UserDataService } from '../user-data.service';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
	
	activeUser?: User;
	games = GAMES;
	activeMatches?: Array<Game>;
	
	constructor(private cookie: CookieService, private userService: UserDataService,
		private gameservice: GameDataService, private socket: SocketService) {	}

	ngOnInit() {
		this.userService.getUserByID(parseInt(this.cookie.get("userid"))).subscribe(user => this.activeUser = user);
		this.activeMatches = this.gameservice.getActiveMatches();
		this.socket.listen('message').subscribe((data) => {
			console.log(data);
		})
	}

	onLogin() {
		this.cookie.set("userid", "1");//has to be set to the active user after authentication
		this.userService.getUserByID(parseInt(this.cookie.get("userid"))).subscribe(user => this.activeUser = user);
	}

	deleteAllCookies() {
		this.cookie.deleteAll();
		this.activeUser = undefined;
	}

	sendMessage(eventName: string, data: string) {
		this.socket.emit(eventName, data);
	}
}
