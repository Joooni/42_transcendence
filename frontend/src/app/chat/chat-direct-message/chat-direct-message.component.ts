import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatComponent } from '../chat.component';
import { Message } from '../../models/message'
import { MessageService } from 'src/app/services/message/message.service';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-chat-direct-message',
  templateUrl: './chat-direct-message.component.html',
  styleUrls: ['./chat-direct-message.component.css']
})
export class ChatDirectMessageComponent implements OnInit {

	messageInput = new FormControl('');

	messages?: Message[];

	constructor(
		public chatComponent: ChatComponent,
		private messageService: MessageService,
		private socketService: SocketService,
	) {}

	ngOnInit(): void {
		if (this.chatComponent.activeUser && this.chatComponent.selectedUser) {
			this.messageService.getDMs(this.chatComponent.activeUser, this.chatComponent.selectedUser)
			.then(dms => this.messages = dms);
		}
		this.messageService.events$.forEach(event => this.updateMessages());
		
		this.socketService.listen('message').subscribe((data) => {
			let tmpMes: Message = {...data as Message, timestamp: new Date((data as Message).timestamp)};
			if (tmpMes.sender.id === this.chatComponent.selectedUser?.id) {
				this.messages?.push(tmpMes);
			}
		});
	}

	sendInput() {
		if (this.chatComponent.activeUser && this.chatComponent.selectedUser && this.messageInput.value) {
			const message: Message = {
				sender: this.chatComponent.activeUser,
				receiverUser: this.chatComponent.selectedUser,
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
		}
	}
}
