import { Component, OnInit, OnDestroy } from '@angular/core';
import { Game } from "../models/game";
import { User } from '../models/user';
import { UserDataService } from '../services/user-data/user-data.service';
import { SocketService } from '../services/socket/socket.service';
import { onGoingGamesData } from '../game/game-display/GameData';
import { GameDisplayService } from '../services/game-display/game-display.service';
import { Router } from '@angular/router';
import { ErrorService } from '../services/error/error.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	activeMatches?: Array<Game>;
	activeUser?: User;
	onGoingGames?: Array<onGoingGamesData>;
	intervalGetOngoingGames: any;
	top3?: Array<User>;
	
	constructor(
		private socketService: SocketService,
		private router: Router,
		private userService: UserDataService,
		private errorService: ErrorService
	) {	}

	ngOnInit() {
		try {
			this.userService.findSelf().then(user => {
				this.activeUser = user;
			});
	
			this.connectSocket();
	
			this.socketService.listen('sendOngoingGames').subscribe((data) => {
				this.onGoingGames = data as Array<onGoingGamesData> ;
			})
			this.requestOngoingGames();
			this.getTop3();
		} catch (e) {
			this.errorService.showErrorMessage("You have been logged out. Please refresh and/or log in again.");
		}
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

	requestOngoingGames() {
		this.intervalGetOngoingGames = setInterval(() => {
			this.socketService.emit('requestOngoingGames', this.activeUser?.id)
		}, 5000)
	}
	
	async getTop3() {
		this.top3 = await this.userService.getTop3();
	}

	joinGame() {
		this.router.navigate(['/gameSearch']);
	}

	leaderboard() {
		this.router.navigate(['/leaderboard']);
	}

	watchThisMatch(roomNbr: number) {
		this.socketService.emit('watchGame', roomNbr);
		this.router.navigate(['/gameWatch']);
	}
}
