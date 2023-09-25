import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatComponent } from '../chat.component';
import { Message } from '../../models/message'
import { MessageService } from 'src/app/services/message/message.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { User } from 'src/app/models/user';
import { ChannelDataService } from 'src/app/services/channel-data/channel-data.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';

@Component({
  selector: 'app-chat-channel',
  templateUrl: './chat-channel.component.html',
  styleUrls: ['./chat-channel.component.css']
})
export class ChatChannelComponent {

	messageInput = new FormControl('');

	messages?: Message[];

	activeUser!: User;
	invitedUserId: string = '';
	invitableUsers: User[] = [];

	selectedChannelType?: string;
	newPassword: string = '';


	constructor(
		public chatComponent: ChatComponent,
		private messageService: MessageService,
		private socketService: SocketService,
		private channelDataService: ChannelDataService,
		private errorService: ErrorService,
		private socket: SocketService,
		private userService: UserDataService
	) {}

	ngOnInit(): void {
		if (this.chatComponent.activeUser && this.chatComponent.selectedChannel) {
			this.activeUser = this.chatComponent.activeUser;
			//TO-DO: TBD ob channel type string oder number
			this.selectedChannelType = this.chatComponent.selectedChannel.type;
			this.messageService.getChannelMessages(this.chatComponent.selectedChannel)
			.then(messages => this.messages = messages);
		}
		this.messageService.events$.forEach(event => this.updateMessages());
		
		console.log('Now i will listen to messages');
		this.socketService.listen('message').subscribe((data) => {
			console.log('received a message from the server');

			let tmpMes: Message = {...data as Message, timestamp: new Date((data as Message).timestamp)};
			if (tmpMes.receiverChannel?.id === this.chatComponent.selectedChannel?.id) {
				this.messages?.push(tmpMes);
			}
		});
	}

	sendInput() {
		if (this.activeUser && this.chatComponent.selectedChannel && this.messageInput.value) {
			const message: Message = {
				sender: this.activeUser,
				receiverChannel: this.chatComponent.selectedChannel,
				timestamp: new Date,
				content: this.messageInput.value
			}
			this.messageService.sendMessage(message);
		}
		this.messageInput.setValue('');
	}

	updateMessages() {
		if (this.chatComponent.activeUser && this.chatComponent.selectedChannel) {
			this.messageService.getChannelMessages(this.chatComponent.selectedChannel)
			.then(messages => this.messages = messages);
			console.log('updateMessages was called');
		}
	}

	isNotOwnerOrAdmin(user: User): boolean {
		if (user.id === this.chatComponent.selectedChannel?.owner.id)
			return false;
		const rtrn = this.chatComponent.selectedChannel?.admins.some((elem) => elem.id === user.id);
		if (rtrn)
			return false;
		return true;
	}

	openLeaveChannelPopUp() {
		const popup = document.getElementById('popup-leave-channel');
		popup?.classList.toggle('show-popup');
	}

	openInviteUserPopUp() {
		this.setInvitableUsers();
		const popup = document.getElementById('popup-invite-channel');
		popup?.classList.toggle('show-popup');
	}

	openChannelSettingsPopUp() {
		this.newPassword = '';
		console.log('selectedChannel: ' + this.chatComponent.selectedChannel);
		this.selectedChannelType = this.chatComponent.selectedChannel?.type;
		const popup = document.getElementById('popup-channel-settings');
		popup?.classList.toggle('show-popup');
	}

	closePopUp(popupName: string) {
		const popup = document.getElementById(popupName);
		popup?.classList.toggle('show-popup');
	}

	async leaveChannel() {
		try {
			const dbChannel = await this.channelDataService.getChannel(this.chatComponent.selectedChannel!.id);
			this.socket.emit('leaveChannel', {
				channelid: this.chatComponent.selectedChannel!.id,
				userid: this.activeUser?.id,
			});
			this.chatComponent.selectedChannel = undefined;
			this.closePopUp('popup-leave-channel');
		} catch (e) {
			this.closePopUp('popup-leave-channel');
			this.errorService.showErrorMessage('The Channel you are trying to leave does not exist anymore');
			this.chatComponent.selectedChannel = undefined;
		}
		await this.chatComponent.updateChannelList();
	}

	async setInvitableUsers() {
		this.invitedUserId = '';
		const invitableUsers: User[] = [];
		let allUsers: User[];
		await this.userService.findAllExceptMyself().then(users => allUsers = users);
		for (let user of allUsers!) {
			if (this.chatComponent.selectedChannel?.users.some((elem) => elem.id === user.id))
				continue;
			// TO-DO:
			// if (/* i blocked the user / he blocked me*/)
			// 	continue;
			//tbd if we only allow inviting friends?
			invitableUsers.push(user);
		}
		this.invitableUsers = invitableUsers;
	}

	async inviteUser() {
		console.log('inviteUser has been called for:');
		console.log(this.invitedUserId);
		//PROBLEM: initial value of channel is string ('public') not enum numeric value )
		const userId = Number(this.invitedUserId);
		let invitedUser: User;
		await this.userService.findUserById(userId).then(user => invitedUser = user);
		
		//TO-DO: add function to actually send an invite to someone
		if (!this.invitedUserId)
			return;
		const tmp: number = parseInt(this.invitedUserId, 10);
		this.socket.emit('inviteUser', {
			channelid: this.chatComponent.selectedChannel!.id,
			activeUserid: this.activeUser?.id,
			inviteThisUserId: tmp,
		});
		this.closePopUp('popup-invite-channel');
	}

	updateChannelSettings() {
		console.log('The new channel type is: ' + this.selectedChannelType);
		if (this.newPassword)
			console.log('The new channel password is: ' + this.newPassword);

		this.socket.emit('channel:ChangeType', {
			channelid: this.chatComponent.selectedChannel!.id,
			activeUser: this.activeUser?.id,
			newType: this.selectedChannelType,
			password: this.newPassword,
		});
		this.closePopUp('popup-channel-settings');
	}

	isMuted(user: User): boolean {
		return this.chatComponent.selectedChannel!.mutedUsers.some(mutedUser => mutedUser.user.id === user.id);
	}

	disableSaveSettings(): boolean {
		//TO-DO: TBD ob channel type string oder number
		if (this.selectedChannelType === 'protected' && !this.newPassword)
			return true;
		if (this.selectedChannelType === this.chatComponent.selectedChannel?.type)
			return true;
		return false;
	}
}
