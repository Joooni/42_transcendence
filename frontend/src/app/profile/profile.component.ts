import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/user';
import { UserDataService } from '../services/user-data/user-data.service';
import { Match } from '../models/game';
import { GameDataService } from '../services/game-data/game-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  selectedUser?: User;
	hasSelectedUser: boolean = true;
  activeUser?: User;
  gameHistory?: Match[];

  constructor(
    private userService: UserDataService,
    private route: ActivatedRoute,
    private gameservice: GameDataService,
    ) {
    }
    async ngOnInit(): Promise<void> {
    const username = String(this.route.snapshot.paramMap.get('username'));
    await this.userService.findUserByUsername(username).then(user => {
      this.selectedUser = user;
    }).catch((e) => this.hasSelectedUser = false);
		console.log(this.selectedUser);
		await this.userService.findSelf().then(user => this.activeUser = user)
    this.gameHistory = await this.gameservice.getMatchesOfUser(this.selectedUser?.id);
    for (let game of this.gameHistory) {
      game.timestamp = new Date(game.timestamp);
    }
  }

  isProfileOfActiveUser() {
    if (this.activeUser?.id === this.selectedUser?.id)
      return true;
    return false;
  }

  archivementIsUnlocked(id: number): boolean {
    return this.selectedUser?.achievements.includes(id) ?? false;
  }

  getOtherPlayer(match: Match): User {
    if (match.firstPlayer.id === this.selectedUser?.id)
      return match.secondPlayer;
    else
      return match.firstPlayer;
  }

  getOwnScore(match: Match): number {
    if (match.firstPlayer.id === this.selectedUser?.id)
      return match.goalsFirstPlayer;
    else
      return match.goalsSecondPlayer;
  }

  getOtherScore(match: Match): number {
    if (match.firstPlayer.id === this.selectedUser?.id)
      return match.goalsSecondPlayer;
    else
      return match.goalsFirstPlayer;
  }

  getOwnXP(match: Match): number {
    if (match.firstPlayer.id === this.selectedUser?.id)
      return match.xpFirstPlayer;
    else
      return match.xpSecondPlayer;
  }
}
