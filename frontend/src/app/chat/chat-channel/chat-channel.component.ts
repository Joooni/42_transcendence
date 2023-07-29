import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatComponent } from '../chat.component';
import { Message } from '../../models/message'
import { MessageService } from 'src/app/services/message/message.service';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-chat-channel',
  templateUrl: './chat-channel.component.html',
  styleUrls: ['./chat-channel.component.css']
})
export class ChatChannelComponent {

	messageInput = new FormControl('');

	messages?: Message[];

	constructor(
		public chatComponent: ChatComponent,
		private messageService: MessageService,
		private socketService: SocketService,
	) {}

	ngOnInit(): void {
		if (this.chatComponent.activeUser && this.chatComponent.selectedChannel) {
			this.messageService.getChannelMessages(this.chatComponent.selectedChannel)
			.subscribe(messages => this.messages = messages);
		}
		this.messageService.events$.forEach(event => this.updateMessages());
		
		console.log('Now i will listen to messages');
		this.socketService.listen('message').subscribe((data) => {
			console.log('received a message from the server');

			let tmpMes: Message = {...data as Message, timestamp: new Date((data as Message).timestamp)};
			if (tmpMes.sender.id === this.chatComponent.selectedUser?.id) {
				this.messages?.push(tmpMes);
			}
		});
	}

	sendInput() {
		if (this.chatComponent.activeUser && this.chatComponent.selectedChannel && this.messageInput.value) {
			const message: Message = {
				sender: this.chatComponent.activeUser,
				receiver: this.chatComponent.selectedChannel,
				timestamp: new Date,
				content: this.messageInput.value
			}
			this.messageService.sendMessage(message);
			this.messages?.push(message);
		}
		this.messageInput.setValue('');
	}

	updateMessages() {
		if (this.chatComponent.activeUser && this.chatComponent.selectedUser) {
			this.messageService.getDMs(this.chatComponent.activeUser, this.chatComponent.selectedUser)
			.then(dms => this.messages = dms);
			console.log('updateMessages was called');
		}
	}
}
