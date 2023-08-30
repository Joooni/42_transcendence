import { Component, OnInit, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { GAMES } from '../mock-data/mock_games';
import { Game } from "../models/game";
import { GameDataService } from '../services/game-data/game-data.service';
import { User } from '../models/user';
import { UserDataService } from '../services/user-data/user-data.service';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket/socket.service';
import { onGoingGamesData } from '../game/game-display/GameData';

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
	onGoingGames?: Array<onGoingGamesData>;
	intervalGetOngoingGames: any;
	
	constructor(
		private gameservice: GameDataService,
		private socketService: SocketService,
		private router: Router,
		private userService: UserDataService,
	) {	}

	ngOnInit() {
		this.userService.findSelf().then(user => {
			this.activeUser = user;
		});

		this.socketService.listen('gotGameRequest').subscribe((data) => {
			this.gotGameRequest(data as number)
		})
		this.socketService.listen('sendOngoingGames').subscribe((data) => {
			this.onGoingGames = data as Array<onGoingGamesData> ;
		})
		this.requestOngoingGames();	
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

	requestOngoingGames() {
		this.intervalGetOngoingGames = setInterval(() => {
			this.socketService.emit('requestOngoingGames', this.activeUser?.id)
		}, 5000)
	}

	watchThisMatch(roomNbr: number) {
		this.socketService.emit('watchGame', roomNbr);
		this.router.navigate(['/gameWatch']);
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
		this.socketService.emit2('startGameRequest', this.activeUser?.id, this.gameRequestSender?.id)
		this.socketService.stopListen('withdrawnGameRequest');
		const popup = document.getElementById('popup-got-game-request');
		popup?.classList.toggle('show-popup');
		this.gameRequestSender = undefined;
		this.router.navigate(['/game']);
	}

	closePopUpNoToGameRequest() {
		this.socketService.stopListen('withdrawnGameRequest');
		this.socketService.emit2('gameRequestDecliend', this.activeUser?.id, this.gameRequestSender?.id)
		const popup = document.getElementById('popup-got-game-request');
		popup?.classList.toggle('show-popup');
		this.gameRequestSender = undefined;
	}

}
