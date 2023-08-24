import { Component, Input } from "@angular/core";
import { User } from "src/app/models/user";
import { SocketService } from "src/app/services/socket/socket.service";
import { UserDataService } from "src/app/services/user-data/user-data.service";
import { ChatComponent } from "../chat.component";
import { GameInviteService } from "src/app/services/game-invite/game-invite.service";

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
		private socketService: SocketService,
		private gameInviteService: GameInviteService
	) {}

	ngOnInit() {
		this.userDataService.findSelf().then(user => this.activeUser = user);
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
		console.log('send Friend Request to ' + this.selectedUser.username);
		this.socketService.emit('sendFriendRequest', {
			ownid: this.activeUser?.id,
			otherid: this.selectedUser.id,
		})
	}

	removeAsFriend() {
		console.log('remove ' + this.selectedUser.username + ' as friend');
		this.socketService.emit('removeFriend', {
			ownid: this.activeUser?.id,
			otherid: this.selectedUser.id,
		})
	}

	blockUser() {
		console.log('block ' + this.selectedUser.username);
		this.socketService.emit('blockUser', {
			ownid: this.activeUser?.id,
			otherid: this.selectedUser.id,
		})
	}

	unblockUser() {
		console.log('unblock ' + this.selectedUser.username);
		this.socketService.emit('unblockUser', {
			ownid: this.activeUser?.id,
			otherid: this.selectedUser.id,
		})
	}


}