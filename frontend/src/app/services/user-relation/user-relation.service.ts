import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SocketService } from '../socket/socket.service';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserRelationService {

	constructor(private socket: SocketService) {}
	
	acceptFriendRequest(activeUser: User, otherUser: User) {
		this.socket.emit('acceptFriendRequest', {
			ownid: activeUser.id,
			otherid: otherUser.id
		});
	}

	declineFriendRequest(activeUser: User, otherUser: User) {
		this.socket.emit('declineFriendRequest', {
			ownid: activeUser.id,
			otherid: otherUser.id
		});
	}

	withdrawFriendRequest(activeUser: User, otherUser: User) {
		this.socket.emit('withdrawFriendRequest', {
			ownid: activeUser.id,
			otherid: otherUser.id
		});
	}

	sendFriendRequest(activeUser: User, otherUser: User) {
		this.socket.emit('sendFriendRequest', {
			ownid: activeUser.id,
			otherid: otherUser.id,
		})
	}

	removeAsFriend(activeUser: User, otherUser: User) {
		this.socket.emit('removeFriend', {
			ownid: activeUser.id,
			otherid: otherUser.id,
		})
	}

	blockUser(activeUser: User, otherUser: User) {
		this.socket.emit('blockUser', {
			ownid: activeUser.id,
			otherid: otherUser.id,
		})
	}

	unblockUser(activeUser: User, otherUser: User) {
		this.socket.emit('unblockUser', {
			ownid: activeUser.id,
			otherid: otherUser.id,
		})
	}
}
