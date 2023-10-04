import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Channel } from 'src/app/models/channel';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import graphQLService from '../graphQL/GraphQLService';
import { SocketService } from '../socket/socket.service';
import { UserDataService } from '../user-data/user-data.service';
import { ErrorService } from '../error/error.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
	
	private changeDMSubject = new Subject<any>();

	activeUser?: User;

	constructor(
		private userDataService: UserDataService,
		private socketService: SocketService,
		private errorService: ErrorService
		) { this.initialize(); }

	initialize() {
		try {
			this.userDataService.findSelf()
				.then(user => this.activeUser = user);
		} catch (e) {
			this.errorService.showErrorMessage("You have been logged out. Please refresh and/or log in again.");
		}
	}

	sendMessage(message: Message) {
		this.socketService.emit("message", message);
	}

	async getDMs(activeUser: User, selectedUser: User): Promise<Message[]> {
		let dms: Message[] = [];
		try {
			const response: any = await graphQLService.query(
				`
				query{
					messagesDM(id: ${activeUser.id}, idReceiver: ${selectedUser.id}){
						id
						sender {
							id
							intra
							username
							email
							picture
							twoFAEnabled
							status
							wins
							losses
							map
						}
						receiverUser {
							id
							intra
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
	
			response.messagesDM.forEach((message: Message) => {
				let tmp: Message = {...message, timestamp: new Date(message.timestamp)};
				dms.push(tmp);
			});
	
			dms.sort((objA, objB) => objA.timestamp.getTime() - objB.timestamp.getTime());
		} catch (e) {}

		return(dms);
	}

	async getChannelMessages(channel: Channel): Promise<Message[]> {
		let mes: Message[] = [];
		try {
			const response: any = await graphQLService.query(
				`
				query{
					messagesChannel(id: "${channel.id}"){
						id
						sender {
							id
							intra
							username
							email
							picture
							twoFAEnabled
							status
							wins
							losses
							map
						}
						receiverChannel {
							id
							name
						}
						timestamp
						content
					}
				}
				`,
				undefined,
				{ fetchPolicy: 'network-only' },
			);
	
			response.messagesChannel.forEach((message: Message) => {
				let tmp: Message = {...message, timestamp: new Date(message.timestamp)};
				mes.push(tmp);
			});
	
			mes.sort((objA, objB) => objA.timestamp.getTime() - objB.timestamp.getTime());
		} catch (e) {}
		return(mes);
	}

	changeOfDM(event: any) {
		this.changeDMSubject.next(event);
	}

	get events$ () {
		return this.changeDMSubject.asObservable();
	}

}
