import { Component, Input } from "@angular/core";
import { User } from "src/app/models/user";
import { UserDataService } from "src/app/services/user-data/user-data.service";
import { ChatComponent } from "../chat.component";

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
		private chatComponent: ChatComponent
	) {}

	ngOnInit() {
		this.userDataService.findSelf().then(user => this.activeUser = user);
	}

	isBlockedByActiveUser(): boolean {
		//TO-DO: check if active user is blocking that user
		return false;
	}

	isFriendsWithActiveUser(): boolean {
		return true;
	}

	openDMWithUser() {
		this.chatComponent.selectUser(this.selectedUser);
	}

	sendGameRequest() {
		console.log('send Game Request to ' + this.selectedUser);
		//TO-DO: Function to send game request
	}

	sendFriendRequest() {
		console.log('send Friend Request to ' + this.selectedUser);
		//TO-DO: Function to send friend request
	}

	removeAsFriend() {
		console.log('remove ' + this.selectedUser + ' as friend');
		//TO-DO: Function to remove as friend
	}

	blockUser() {
		console.log('block ' + this.selectedUser);
		//TO-DO: Function to block someone
		//when blocking someone, that person should automatically be unfriended as well, if necessary
	}

	unblockUser() {
		console.log('unblock ' + this.selectedUser);
		//TO-DO: Function to unblock someone
	}
}