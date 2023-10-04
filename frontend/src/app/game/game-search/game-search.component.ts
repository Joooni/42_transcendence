import { Component, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user';
import { GameDisplayService } from 'src/app/services/game-display/game-display.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { Router } from '@angular/router';
import { ErrorService } from 'src/app/services/error/error.service';

@Component({
  selector: 'app-game-search',
  templateUrl: './game-search.component.html',
  styleUrls: ['./game-search.component.css']
})
export class GameSearchComponent implements OnDestroy {

	search: boolean;
	stopSearch: boolean;
	activeUser?: User;


	constructor (
		private gameDisplayService: GameDisplayService, 
		private socketService: SocketService, 
		private userDataService: UserDataService,
		private router: Router,
		private errorService: ErrorService
	) {
		this.search = true;
		this.stopSearch = false;
		this.gameDisplayService.restartService();
		this.loadUser();
	}

	ngOnDestroy() {
		if (this.stopSearch === true) {
			this.socketService.emit('stopSearching', this.activeUser?.id);
		}
	}

	async loadUser() {
		try {
			await this.userDataService.findSelf().then(async user => this.activeUser = user);
		} catch (e) {
			this.errorService.showErrorMessage("You have been logged out. Please refresh and/or log in again.");
		}
	}

	startGame() {
		this.search = false;
		this.stopSearch = true;
		this.socketService.emit('startGameSearching', this.activeUser?.id);
		this.socketService.listen('gameFound').subscribe(() => {
			this.router.navigate(['/game']);
		});

	}

	stopSearching() {
		this.stopSearch = false;
		this.search = true;
		this.socketService.emit('stopSearching', this.activeUser?.id);
	}
}
