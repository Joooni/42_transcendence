import { Component, OnInit } from '@angular/core';
import { Notification } from '../models/notification';
import { UserDataService } from '../services/user-data/user-data.service';
import { User } from '../models/user';
import { SocketService } from '../services/socket/socket.service';
import { Subscription } from 'rxjs';
import { UserRelationService } from '../services/user-relation/user-relation.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
	
	subscriptions: Subscription[] = [];
	notifications: Notification[] = [];
	activeUser?: User;
	
	constructor(
		private userDataService: UserDataService,
		private socket: SocketService,
		private userRelationService: UserRelationService
	) {}

	async ngOnInit() {
		await this.updateNotifications();
		const subscription = this.socket.listen('updateNotifications').subscribe(() => {
			this.updateNotifications();
		})
		this.subscriptions.push(subscription);
	}

	acceptFriendRequest(notification: Notification) {
		this.userRelationService.acceptFriendRequest(this.activeUser!, notification.sender!);
	}

	declineFriendRequest(notification: Notification) {
		this.userRelationService.declineFriendRequest(this.activeUser!, notification.sender!);
	}

	acceptChannelInvite(notification: Notification) {
		this.socket.emit('joinChannel', {
			channelid: notification.subject?.id,
			userid: this.activeUser?.id
		});
	}

	declineChannelInvite(notification: Notification) {
		this.socket.emit('declineChannelInvite', {
			channelid: notification.subject?.id,
			userid: this.activeUser?.id
		});
	}

	withdrawFriendRequest(notification: Notification) {
		this.userRelationService.withdrawFriendRequest(this.activeUser!, notification.recipient!);
	}

	private async updateNotifications() {
		try {
			await this.userDataService.findSelf().then(user => this.activeUser = user);
		} catch (e) {
			return;
		}
		
		this.notifications = [];
		for (let user of this.activeUser?.incomingFriendRequests!) {
			this.notifications.push({
				type: "incomingFriendRequest",
				sender: user,
				recipient: this.activeUser
			});
		}
		for (let channel of this.activeUser?.invitedInChannel!) {
			this.notifications.push({
				type: "channelInvite",
				subject: channel,
				recipient: this.activeUser
			});
		}
		for (let user of this.activeUser?.sendFriendRequests!) {
			this.notifications.push({
				type: "sendFriendRequest",
				recipient: user,
				sender: this.activeUser
			});
		}
	}

	ngOnDestroy() {
		while (this.subscriptions.length > 0)
			this.subscriptions.pop()?.unsubscribe();
	}
}
