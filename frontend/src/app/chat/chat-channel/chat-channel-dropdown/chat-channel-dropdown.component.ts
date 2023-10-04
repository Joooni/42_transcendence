import { Component, Input } from "@angular/core";
import { Channel } from "src/app/models/channel";
import { User } from "src/app/models/user";
import { ChatComponent } from "../../chat.component";
import { UserDataService } from "src/app/services/user-data/user-data.service";
import { SocketService } from "src/app/services/socket/socket.service";
import { ErrorService } from "src/app/services/error/error.service";

@Component({
	selector: 'app-chat-channel-dropdown',
	templateUrl: './chat-channel-dropdown.component.html',
	styleUrls: ['./chat-channel-dropdown.component.css'] 
})
export class ChatChannelDropdownComponent {
	@Input()
	selectedUser!: User;

	@Input()
	channel!: Channel;

	activeUser?: User;

	constructor(
		private chatComponent: ChatComponent,
		private userDataService: UserDataService,
		private socket: SocketService,
		private errorService: ErrorService,
	) {}

	ngOnInit() {
		try {
			this.userDataService.findSelf().then(user => this.activeUser = user);
		} catch (e) {
			this.errorService.showErrorMessage("You have been logged out. Please refresh and/or log in again.");
		}
	}

	isBannedOrOffline(): boolean {
		return this.channel.bannedUsers.some(user => user.id === this.selectedUser.id) || this.selectedUser.status === 'offline'
	}

	canBeSetAsAdmin(): boolean {
		if (this.userIsAdmin(this.selectedUser) || this.userIsOwner(this.selectedUser) || !this.activeUser)
			return false;
		if (this.userIsAdmin(this.activeUser) || this.userIsOwner(this.activeUser))
			return true;
		return false;
	}

	canBeRemovedAsAdmin(): boolean {
		if (this.userIsOwner(this.selectedUser) || !this.activeUser)
			return false;
		return (this.userIsAdmin(this.selectedUser) && this.userIsOwner(this.activeUser));
	}

	canBeMuted(): boolean {
		if (this.userIsOwner(this.selectedUser) || !this.activeUser)
			return false;
		if (this.channel.mutedUsers.some(mutedUser => mutedUser.user.id === this.selectedUser.id))
			return false;
		if (this.userIsAdmin(this.activeUser) || this.userIsOwner(this.activeUser))
			return true;
		return false;
	}

	canBeUnmuted(): boolean {
		if (!this.channel.mutedUsers.some(mutedUser => mutedUser.user.id === this.selectedUser.id) || !this.activeUser)
			return false;
		if (this.userIsAdmin(this.activeUser) || this.userIsOwner(this.activeUser))
			return true;
		return false;
	}

	canBeKicked(): boolean {
		if (this.userIsOwner(this.selectedUser) || !this.activeUser)
			return false;
		return this.userIsAdmin(this.activeUser) || this.userIsOwner(this.activeUser)
	}

	canBeBanned(): boolean {
		if (this.userIsOwner(this.selectedUser) || !this.activeUser || this.channel.bannedUsers.some(user => user.id === this.selectedUser.id))
			return false;
		return this.userIsAdmin(this.activeUser) || this.userIsOwner(this.activeUser)
	}

	canBeUnbanned(): boolean {
		if (!this.channel.bannedUsers.some(user => user.id === this.selectedUser.id) || !this.activeUser)
			return false;
		return this.userIsAdmin(this.activeUser) || this.userIsOwner(this.activeUser);
	}

	setUserAsAdmin() {
		if (!this.chatComponent.activeUser) {
			this.errorService.showErrorMessage("You have been logged out. Please refresh and/or log in again.");
			return;
		}
		this.socket.emit('channel:SetUserAsAdmin', {
			activeUser: this.chatComponent.activeUser.id,
			selectedUser: this.selectedUser.id,
			channelId: this.channel.id 
		});
	}

	removeUserAsAdmin() {
		if (!this.chatComponent.activeUser) {
			this.errorService.showErrorMessage("You have been logged out. Please refresh and/or log in again.");
			return;
		}
		this.socket.emit('channel:RemoveUserAsAdmin', {
			activeUser: this.chatComponent.activeUser.id,
			selectedUser: this.selectedUser.id,
			channelId: this.channel.id 
		});
	}

	muteUser() {
		if (!this.chatComponent.activeUser) {
			this.errorService.showErrorMessage("You have been logged out. Please refresh and/or log in again.");
			return;
		}
		this.socket.emit('channel:MuteUser', {
			activeUser: this.chatComponent.activeUser.id,
			selectedUser: this.selectedUser.id,
			channelId: this.channel.id,
			time: 1,
		});
	}

	unmuteUser() {
		if (!this.chatComponent.activeUser) {
			this.errorService.showErrorMessage("You have been logged out. Please refresh and/or log in again.");
			return;
		}
		this.socket.emit('channel:UnmuteUser', {
			activeUser: this.chatComponent.activeUser.id,
			selectedUser: this.selectedUser.id,
			channelId: this.channel.id,
		});
	}

	kickUser() {
		if (!this.chatComponent.activeUser) {
			this.errorService.showErrorMessage("You have been logged out. Please refresh and/or log in again.");
			return;
		}
		this.socket.emit('channel:KickUser', {
			activeUser: this.chatComponent.activeUser.id,
			selectedUser: this.selectedUser.id,
			channelId: this.channel.id 
		});
	}

	banUser() {
		if (!this.chatComponent.activeUser) {
			this.errorService.showErrorMessage("You have been logged out. Please refresh and/or log in again.");
			return;
		}
		this.socket.emit('channel:BanUser', {
			activeUser: this.chatComponent.activeUser.id,
			selectedUser: this.selectedUser.id,
			channelId: this.channel.id 
		});
	}

	unbanUser() {
		if (!this.chatComponent.activeUser) {
			this.errorService.showErrorMessage("You have been logged out. Please refresh and/or log in again.");
			return;
		}
		this.socket.emit('channel:UnbanUser', {
			activeUser: this.chatComponent.activeUser.id,
			selectedUser: this.selectedUser.id,
			channelId: this.channel.id 
		});
	}

	private userIsAdmin(user: User): boolean {
		return this.channel.admins.some(elem => elem.id === user.id);
	}

	private userIsOwner(user: User): boolean {
		return this.channel.owner.id === user.id;
	}
}