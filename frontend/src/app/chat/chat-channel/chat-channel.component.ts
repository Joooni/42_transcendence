import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatComponent } from '../chat.component';
import { Message } from '../../models/message'
import { MessageService } from 'src/app/services/message/message.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { User } from 'src/app/models/user';
import { ChannelDataService } from 'src/app/services/channel-data/channel-data.service';
import { ErrorService } from 'src/app/services/error/error.service';
import { Socket } from 'ngx-socket-io';
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
	invitedUserId: number | null = null;
	invitableUsers: User[] = [];

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

	closePopUp(popupName: string) {
		const popup = document.getElementById(popupName);
		popup?.classList.toggle('show-popup');
	}

	async leaveChannel() {
		try {
			const dbChannel = await this.channelDataService.getChannel(this.chatComponent.selectedChannel!.id);
			//TBD: i would find it better if he could leave and the channel would be deleted
			// if (dbChannel.owner.id === this.activeUser?.id) {
			// 	console.log("You can't leave, because you are the owner");
			// 	return;
			// }
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
		this.invitedUserId = null;
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
		let invitedUser: User;
		await this.userService.findUserById(this.invitedUserId!).then(user => invitedUser = user);
		
		//TO-DO: add function to actually send an invite to someone
		
		this.closePopUp('popup-invite-channel');
	}

	isMuted(user: User): boolean {
		return this.chatComponent.selectedChannel!.mutedUsers.some((elem) => elem.id === user.id);
	}
}
