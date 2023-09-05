import { Component, Input } from "@angular/core";
import { Channel } from "src/app/models/channel";
import { User } from "src/app/models/user";
import { ChatComponent } from "../../chat.component";
import { UserDataService } from "src/app/services/user-data/user-data.service";
import { ChannelDataService } from "src/app/services/channel-data/channel-data.service";
import { SocketService } from "src/app/services/socket/socket.service";

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
		private channelService: ChannelDataService,
		private socket: SocketService,
	) {}

	ngOnInit() {
		this.userDataService.findSelf().then(user => this.activeUser = user);
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
		//TO-DO: TBD if admins can remove other admins
		return (this.userIsAdmin(this.selectedUser) && this.userIsOwner(this.activeUser));
	}

	canBeMuted(): boolean {
		if (this.userIsOwner(this.selectedUser) || !this.activeUser)
			return false;
		if (this.channel.mutedUsers.some(user => user.id === this.selectedUser.id))
			return false;
		if (this.userIsAdmin(this.activeUser) || this.userIsOwner(this.activeUser))
			return true;
		return false;
	}

	canBeUnmuted(): boolean {
		if (!this.channel.mutedUsers.some(user => user.id === this.selectedUser.id) || !this.activeUser)
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
		if (this.userIsOwner(this.selectedUser) || !this.activeUser)
			return false;
		return this.userIsAdmin(this.activeUser) || this.userIsOwner(this.activeUser)
	}

	canBeUnbanned(): boolean {
		if (!this.channel.bannedUsers.some(user => user.id === this.selectedUser.id) || !this.activeUser)
			return false;
		return this.userIsAdmin(this.activeUser) || this.userIsOwner(this.activeUser);
	}

	setUserAsAdmin() {
		console.log('setUserAsAdmin() called for ' + this.selectedUser.username);
		if (!this.chatComponent.activeUser) {
			console.log('Error: activeUser is undefined');
			return;
		}
		this.socket.emit('channel:SetUserAsAdmin', {
			activeUser: this.chatComponent.activeUser.id,
			selectedUser: this.selectedUser.id,
			channelId: this.channel.id 
		});
		// this.updateUserAndChannel();
	}

	removeUserAsAdmin() {
		console.log('removeUserAsAdmin() called for ' + this.selectedUser.username);
		if (!this.chatComponent.activeUser) {
			console.log('Error: activeUser is undefined');
			return;
		}
		this.socket.emit('channel:RemoveUserAsAdmin', {
			activeUser: this.chatComponent.activeUser.id,
			selectedUser: this.selectedUser.id,
			channelId: this.channel.id 
		});
		// this.updateUserAndChannel();
	}

	muteUser() {
		console.log('muteUser() called for ' + this.selectedUser.username);
		this.updateUserAndChannel();
	}

	unmuteUser() {
		console.log('unmuteUser() called for ' + this.selectedUser.username);
		this.updateUserAndChannel();
	}

	kickUser() {
		console.log('kickUser() called for ' + this.selectedUser.username);
		if (!this.chatComponent.activeUser) {
			console.log('Error: activeUser is undefined');
			return;
		}
		this.socket.emit('channel:KickUser', {
			activeUser: this.chatComponent.activeUser.id,
			selectedUser: this.selectedUser.id,
			channelId: this.channel.id 
		});
		// this.updateUserAndChannel();
	}

	banUser() {
		console.log('banUser() called for ' + this.selectedUser.username);
		if (!this.chatComponent.activeUser) {
			console.log('Error: activeUser is undefined');
			return;
		}
		this.socket.emit('channel:BanUser', {
			activeUser: this.chatComponent.activeUser.id,
			selectedUser: this.selectedUser.id,
			channelId: this.channel.id 
		});
		// this.updateUserAndChannel();
	}

	unbanUser() {
		console.log('unbanUser() called for ' + this.selectedUser.username);
		if (!this.chatComponent.activeUser) {
			console.log('Error: activeUser is undefined');
			return;
		}
		this.socket.emit('channel:UnbanUser', {
			activeUser: this.chatComponent.activeUser.id,
			selectedUser: this.selectedUser.id,
			channelId: this.channel.id 
		});
		// this.updateUserAndChannel();
	}

	//so that the available options in the dropdown update
	private async updateUserAndChannel() {
		await this.userDataService.findUserById(this.selectedUser.id).then(user => this.selectedUser = user);
		await this.channelService.getChannel(this.channel.id).then(channel => this.channel = channel);
	}

	private userIsAdmin(user: User): boolean {
		return this.channel.admins.some(elem => elem.id === user.id);
	}

	private userIsOwner(user: User): boolean {
		return this.channel.owner.id === user.id;
	}
}