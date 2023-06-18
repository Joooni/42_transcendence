import { Injectable, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Channel } from 'src/app/models/channel';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { SocketService } from '../socket/socket.service';
import { UserDataService } from '../user-data/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService implements OnInit {
	
	private changeDMSubject = new Subject<any>();

	activeUser?: User;
	id = 0;

	//only for FE testing, to be removed later
	messages: Message[] = [];

	constructor(
		private userDataService: UserDataService,
		private socketService: SocketService
		) { }

	ngOnInit(): void {
		this.userDataService.findSelf().then(user => this.activeUser = user);
	}

	sendMessage(message: Message) {
		this.socketService.emit("message", message);

		//only for FE testing, to be removed later
		message.id = this.id;
		this.messages.push(message);
		this.id++;
	}

	getDMs(user1: User, user2: User): Observable<Message[]> {
		//FE implementation for testing
		let dms: Message[] = [];

		for (let message of this.messages) {
			if (message.sender === user1 && message.receiver === user2)
				dms.push(message);
			if (message.sender === user2 && message.receiver === user1)
				dms.push(message);
		}
		dms.sort((objA, objB) => objA.timestamp.getTime() - objB.timestamp.getTime());
		return of(dms);

		//BE implementation as soon as available
	}

	getChannelMessages(channel: Channel): Observable<Message[]> {
		//FE implementation for testing
		let channelMessages: Message[] = [];

		for (let message of this.messages) {
			if (message.receiver ===  channel)
				channelMessages.push(message);
		}
		channelMessages.sort((objA, objB) => objA.timestamp.getTime() - objB.timestamp.getTime());
		return of(channelMessages);

		//BE implementation as soon as available
	}

	changeOfDM(event: any) {
		this.changeDMSubject.next(event);
	}

	get events$ () {
		return this.changeDMSubject.asObservable();
	}
}
