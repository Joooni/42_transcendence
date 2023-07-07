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

	constructor(
		private userDataService: UserDataService,
		private socketService: SocketService
		) { this.initialize(); }

	initialize() {
		this.userDataService.findSelf()
		.then(user => this.activeUser = user);
	}
	
	//Doesn't work?
	ngOnInit(): void {
		this.userDataService.findSelf()
		.then(user => this.activeUser = user);
		console.log('message.service is initialized'); // Will never initialized?
		// this.getMessagesFromDatabase();
		// this.socketService.listen('message').subscribe((data) => {
		// 	console.log('received a message from the server');
		// 	this.receiveInput(data as Message);
		// });
	}

	sendMessage(message: Message) {
		this.socketService.emit("message", message);
	}

	async getDMs(activeUser: User, selectedUser: User): Promise<Message[]> {
		let dms: Message[] = [];
		
		const response: any = await graphQLService.query(
			`
			query{
				messagesDM(id: ${activeUser.id}, idReceiver: ${selectedUser.id}){
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

		if (response.messagesDM === undefined) {
			console.log('No messages from the DB');
		}

		response.messagesDM.forEach((message: Message) => {
			let tmp: Message = {...message, timestamp: new Date(message.timestamp)};
			dms.push(tmp);
		});

		dms.sort((objA, objB) => objA.timestamp.getTime() - objB.timestamp.getTime());
		console.log('Aktuelle dms:', dms);
		return(dms);
	}

	getChannelMessages(channel: Channel): Observable<Message[]> {
		//FE implementation for testing
		let channelMessages: Message[] = [];

		// for (let message of this.messages) {
		// 	if (message.receiver ===  channel)
		// 		channelMessages.push(message);
		// }
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
