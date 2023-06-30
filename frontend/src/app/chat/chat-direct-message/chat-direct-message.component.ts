import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChatComponent } from '../chat.component';
import { Message } from '../../models/message'
import { MessageService } from 'src/app/services/message/message.service';

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
	) {}

	ngOnInit(): void {
		if (this.chatComponent.activeUser && this.chatComponent.selectedUser) {
			this.messageService.getDMs(this.chatComponent.activeUser, this.chatComponent.selectedUser)
			.subscribe(dms => this.messages = dms);
		}
		this.messageService.events$.forEach(event => this.updateMessages());
	}

	sendInput() {
		if (this.chatComponent.activeUser && this.chatComponent.selectedUser && this.messageInput.value) {
			const message: Message = {
				sender: this.chatComponent.activeUser,
				receiver: this.chatComponent.selectedUser,
				timestamp: new Date,
				content: this.messageInput.value
			}
			this.messageService.sendMessage(message);
		}
		this.updateMessages();
		this.messageInput.setValue('');
	}

	updateMessages() {
		if (this.chatComponent.activeUser && this.chatComponent.selectedUser) {
			this.messageService.getDMs(this.chatComponent.activeUser, this.chatComponent.selectedUser)
			.subscribe(dms => this.messages = dms);
			console.log('updateMessages was called');
		}
	}
}
