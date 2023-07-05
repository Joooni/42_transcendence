import { Injectable, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Channel } from 'src/app/models/channel';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import graphQLService from '../graphQL/GraphQLService';
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
		) { this.initialize(); }

	initialize() {
		this.userDataService.findSelf()
		.then(user => this.activeUser = user)
		.then(() => this.getMessagesFromDatabase());
	}
	
	//Doesn't work?
	ngOnInit(): void {
		this.userDataService.findSelf()
		.then(user => this.activeUser = user);
		console.log('message.service is initialized'); // Will never initialized?
		this.getMessagesFromDatabase();
		// this.socketService.listen('message').subscribe((data) => {
		// 	console.log('received a message from the server');
		// 	this.receiveInput(data as Message);
		// });
	}

	sendMessage(message: Message) {
		this.socketService.emit("message", message);

		//only for FE testing, to be removed later
		message.id = this.id;
		this.messages.push(message);
		this.id++;
	}

	receiveInput(message: Message) {
		console.log('receiveInput was called');
		message.id = this.id;
		message.timestamp = new Date(message.timestamp);
		this.messages.push(message);
		this.id++;
		console.log('the message should be saved now', this.messages);
	}

	getDMs(user1: User, user2: User): Observable<Message[]> {
		//FE implementation for testing
		let dms: Message[] = [];

		for (let message of this.messages) {
			if (message.sender.id === user1.id && message.receiver.id === user2.id) {
				dms.push(message);
			}
			else if (message.sender.id === user2.id && message.receiver.id === user1.id) {
				dms.push(message);
			}
			else {
				console.log('Found a strange message');
			}
		}
		dms.sort((objA, objB) => objA.timestamp.getTime() - objB.timestamp.getTime());
		console.log('Aktuelle dms:', dms);
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

	async getMessagesFromDatabase() {
		console.log('will get messages from database');
		const userId = this.activeUser?.id;
		if (!userId) {
			console.log('no user id in getMessagesFromDatabase()');
			return;
		}
		const response: any = await graphQLService.query(
			`
			query{
				messagesUser(id: ${userId}){
					id
					sender {
						id
						intra
						firstname
						lastname
						username
						email
						picture
						twoFAEnabled
						status
						wins
						losses
						map
					}
					receiver {
						id
						intra
						firstname
						lastname
						username
						email
						picture
						twoFAEnabled
						status
						wins
						losses
						map
					}
					timestamp
					content
				}
			}
			`,
			undefined,
			{ fetchPolicy: 'network-only' },
		);
		console.log('got messages from DB:', response);
		response.messagesUser.forEach((message: Message) => {
			let tmp: Message = {...message, timestamp: new Date(message.timestamp)};
			this.messages?.push(tmp);
		});
	}
}
