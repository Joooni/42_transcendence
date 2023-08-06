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

@Component({
  selector: 'app-chat-channel',
  templateUrl: './chat-channel.component.html',
  styleUrls: ['./chat-channel.component.css']
})
export class ChatChannelComponent {

	messageInput = new FormControl('');

	messages?: Message[];

	activeUser!: User;

	constructor(
		public chatComponent: ChatComponent,
		private messageService: MessageService,
		private socketService: SocketService,
		private channelDataService: ChannelDataService,
		private errorService: ErrorService,
		private socket: SocketService
	) {}

	ngOnInit(): void {
		if (this.chatComponent.activeUser && this.chatComponent.selectedChannel) {
			this.activeUser = this.chatComponent.activeUser;
			this.messageService.getChannelMessages(this.chatComponent.selectedChannel)
			.subscribe(messages => this.messages = messages);
		}
		this.messageService.events$.forEach(event => this.updateMessages());
		
		console.log('Now i will listen to messages');
		this.socketService.listen('message').subscribe((data) => {
			console.log('received a message from the server');

			let tmpMes: Message = {...data as Message, timestamp: new Date((data as Message).timestamp)};
			//das funktioniert glaube ich nicht @Florian - wie bekomme ich hier die Messages für den Channel
			if (tmpMes.sender.id === this.chatComponent.selectedUser?.id) {
				this.messages?.push(tmpMes);
			}
		});
	}

	sendInput() {
		if (this.activeUser && this.chatComponent.selectedChannel && this.messageInput.value) {
			const message: Message = {
				sender: this.activeUser,
				receiver: this.chatComponent.selectedChannel,
				timestamp: new Date,
				content: this.messageInput.value
			}
			this.messageService.sendMessage(message);
			this.messages?.push(message);
		}
		this.messageInput.setValue('');
	}

	private updateMessages() {
		if (this.activeUser && this.chatComponent.selectedChannel) {
			this.messageService.getChannelMessages(this.chatComponent.selectedChannel)
			.subscribe(messages => this.messages = messages);
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

	closePopUp(popupName: string) {
		const popup = document.getElementById(popupName);
		popup?.classList.toggle('show-popup');
	}

	async leaveChannel() {
		try {
			const dbChannel = await this.channelDataService.getChannel(this.chatComponent.selectedChannel!.id);
			//tbd, i would find it better if he could leave and the channel would be deleted
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
}
