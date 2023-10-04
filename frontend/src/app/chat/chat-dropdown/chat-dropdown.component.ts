import { Component, Input } from "@angular/core";
import { User } from "src/app/models/user";
import { UserDataService } from "src/app/services/user-data/user-data.service";
import { ChatComponent } from "../chat.component";
import { GameInviteService } from "src/app/services/game-invite/game-invite.service";
import { UserRelationService } from "src/app/services/user-relation/user-relation.service";
import { ErrorService } from "src/app/services/error/error.service";

@Component({
	selector: 'app-chat-dropdown',
	templateUrl: './chat-dropdown.component.html',
	styleUrls: ['./chat-dropdown.component.css'] 
})
export class ChatDropdownComponent {
	@Input()
	selectedUser!: User;

	activeUser?: User;

	constructor(
		private userDataService: UserDataService,
		private chatComponent: ChatComponent,
		private gameInviteService: GameInviteService,
		private userRelationService: UserRelationService,
		private errorService: ErrorService
	) {}

	ngOnInit() {
		try {
			this.userDataService.findSelf().then(user => this.activeUser = user);
		} catch (e) {
			this.errorService.showErrorMessage("You have been logged out. Please refresh and/or log in again.");
		}
	}

	isBlockedOrOffline(): boolean {
		return this.isBlockedByActiveUser() || this.selectedUser.status === 'offline';
	}

	isBlockedByActiveUser(): boolean {
		const user = this.activeUser?.blockedUsers.find(user => user.id === this.selectedUser.id);
		if(user)
			return true;
		return false;
	}

	isBlockedByOtherUser(): boolean {
		const user = this.activeUser?.blockedFromOther.find(user => user.id === this.selectedUser.id);
		if(user)
			return true;
		return false;
	}

	isFriendsWithActiveUser(): boolean {
		const user = this.activeUser?.friends.find(user => user.id === this.selectedUser.id);
		if (user)
			return true;
		return false;
	}

	openDMWithUser() {
		this.chatComponent.selectUser(this.selectedUser);
	}

	sendGameRequest() {
		this.gameInviteService.sendGameRequest(this.selectedUser);
	}

	sendFriendRequest() {
		this.userRelationService.sendFriendRequest(this.activeUser!, this.selectedUser);
		this.toggleShowPopup('popup-friend-request');
	}

	removeAsFriend() {
		this.userRelationService.removeAsFriend(this.activeUser!, this.selectedUser);
	}

	blockUser() {
		this.userRelationService.blockUser(this.activeUser!, this.selectedUser);
	}

	unblockUser() {
		this.userRelationService.unblockUser(this.activeUser!, this.selectedUser);
	}

	toggleShowPopup(id: string) {
		const popup = document.getElementById(id);
		popup?.classList.toggle('show-popup');
	}
}