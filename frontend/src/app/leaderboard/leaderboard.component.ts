import { Component } from '@angular/core';
import { User } from '../models/user';
import { UserDataService } from '../services/user-data/user-data.service';
import { GameInviteService } from '../services/game-invite/game-invite.service';
import { ErrorService } from '../services/error/error.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent {
  activeUser?: User;
  userList: User[] = [];

  constructor(
    private userService: UserDataService,
		private gameInviteService: GameInviteService,
		private errorService: ErrorService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
			await this.userService.findSelf().then(user => this.activeUser = user);
    	this.userList = await this.userService.getUsersSortedByRank();
		} catch (e) {
			this.errorService.showErrorMessage('Something went wrong fetching Leaderboard Data. Please try again.')
		}
  }

	sendGameRequest(user: User) {
		this.gameInviteService.sendGameRequest(user);
	}

  isOnline(user: User): boolean {
    if (user.status == 'online')
      return true;
    return false;
  }
}
