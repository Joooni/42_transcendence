import { Component } from '@angular/core';
import { ChatComponent } from '../chat.component';

@Component({
  selector: 'app-chat-direct-message',
  templateUrl: './chat-direct-message.component.html',
  styleUrls: ['./chat-direct-message.component.css']
})
export class ChatDirectMessageComponent {

	constructor(public chatComponent: ChatComponent) {}

}
