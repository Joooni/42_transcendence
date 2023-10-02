import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/user';
import { UserDataService } from '../services/user-data/user-data.service';
import { Match } from '../models/game';
import { GameDataService } from '../services/game-data/game-data.service';
import { UserRelationService } from '../services/user-relation/user-relation.service';
import { SocketService } from '../services/socket/socket.service';

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
		private userRelationService: UserRelationService,
		private socket: SocketService
    ) {
    }
    async ngOnInit(): Promise<void> {
		this.updateUserData();

		this.socket.listen('updateUserList').subscribe(() => {
			this.updateUserData();
		});

		this.socket.listen('updateNotifications').subscribe(() => {
			this.updateUserData();
		})
  }

	async updateUserData() {
		const username = String(this.route.snapshot.paramMap.get('username'));
		await this.userService.findUserByUsername(username).then(user => 
			this.selectedUser = user
		).catch(() => 
			this.hasSelectedUser = false
		);
		this.userService.findSelf().then(user => this.activeUser = user);
		this.gameservice.getMatchesOfUser(this.selectedUser?.id).then(history => {
			this.gameHistory = history;
			for(let game of this.gameHistory)
				game.timestamp = new Date(game.timestamp);
		});
	}

  isProfileOfActiveUser(): boolean {
    if (this.activeUser?.id === this.selectedUser?.id)
      return true;
    return false;
  }

	isFriendsWithActiveUser(): boolean {
		if (this.activeUser?.friends.some(user => {
			return user.id === this.selectedUser?.id;
		})) {
			return true;
		}
		return false;
	}

	hasSentFriendRequestToActiveUser(): boolean {
		if (this.activeUser?.incomingFriendRequests.some(user => {
			return user.id === this.selectedUser?.id;
		}))
			return true;
		return false;
	}

	hasReceivedFriendRequestFromActiveUser(): boolean {
		if (this.activeUser?.sendFriendRequests.some(user => {
			return user.id === this.selectedUser?.id;
		}))
			return true;
		return false;
	}

	hasBeenBlockedByActiveUser(): boolean {
		if (this.activeUser?.blockedUsers.some(user => {
			return user.id === this.selectedUser?.id;
		}))
			return true;
		return false;
	}

	hasBlockedActiveUser(): boolean {
		if (this.activeUser?.blockedFromOther.some(user => {
			return user.id === this.selectedUser?.id;
		}))
			return true;
		return false;
	}

	hasNoRelationWithActiveUser(): boolean {
		if (this.isFriendsWithActiveUser() || this.hasSentFriendRequestToActiveUser()
			|| this.hasReceivedFriendRequestFromActiveUser() || this.hasBeenBlockedByActiveUser()) {
			return false;
		}
		return true;
	}

	unfriendSelectedUser() {
		this.userRelationService.removeAsFriend(this.activeUser!, this.selectedUser!);
	}

	acceptFriendRequestFromSelectedUser() {
		this.userRelationService.acceptFriendRequest(this.activeUser!, this.selectedUser!);
	}

	declineFriendRequestFromSelectedUser() {
		this.userRelationService.declineFriendRequest(this.activeUser!, this.selectedUser!);
	}

	withdrawFriendRequestToSelectedUser() {
		this.userRelationService.withdrawFriendRequest(this.activeUser!, this.selectedUser!);
	}

	unblockSelectedUser() {
		this.userRelationService.unblockUser(this.activeUser!, this.selectedUser!);
	}

	sendFriendRequestToSelectedUser() {
		this.userRelationService.sendFriendRequest(this.activeUser!, this.selectedUser!);
	}

	blockSelectedUser() {
		this.userRelationService.blockUser(this.activeUser!, this.selectedUser!);
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
