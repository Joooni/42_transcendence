import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class HomeComponent implements OnInit, OnDestroy {

	games = GAMES;
	activeMatches?: Array<Game>;
	activeUser?: User;
	senderUser?: User;
	gameRequestSender?: User;

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

		this.socketService.listen('gotGameRequest').subscribe((data) => {
			this.gotGameRequest(data as number)
		})
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

	ngOnDestroy() {
		this.socketService.stopListen('gotGameRequest');
	}

	sendMessage(eventName: string, data: string) {
		this.socketService.emit(eventName, data);
	}



	async gotGameRequest(senderID: number) {
		this.gameRequestSender = await this.userService.findUserById(senderID);
		const popup = document.getElementById('popup-got-game-request');
		popup?.classList.toggle('show-popup');
		this.socketService.listen('withdrawnGameRequest').subscribe((data) => {
			const popup = document.getElementById('popup-got-game-request');
			popup?.classList.toggle('show-popup');
			this.gameRequestSender = undefined;
			this.socketService.stopListen('withdrawnGameRequest');
		})
	}
	
	closePopUpYesToGameRequest() {
		this.socketService.stopListen('withdrawnGameRequest');
		const popup = document.getElementById('popup-got-game-request');
		popup?.classList.toggle('show-popup');
		this.gameRequestSender = undefined;
	}

	closePopUpNoToGameRequest() {
		this.socketService.stopListen('withdrawnGameRequest');
		this.socketService.emit2('gameRequestDecliend', this.activeUser?.id, this.gameRequestSender?.id)
		const popup = document.getElementById('popup-got-game-request');
		popup?.classList.toggle('show-popup');
		this.gameRequestSender = undefined;
	}

}
