import { Component, OnInit } from '@angular/core';
import { Notification } from '../models/notification';
import { UserDataService } from '../services/user-data/user-data.service';
import { User } from '../models/user';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
	
	notifications: Notification[] = [];
	activeUser?: User;
	
	constructor(private userDataService: UserDataService) {}

	async ngOnInit() {
		await this.userDataService.findSelf().then(user => this.activeUser = user);
		this.updateNotifications();
	}

	acceptFriendRequest(notification: Notification) {
		//remove sender from incomingFriendRequest
		//remove recipient from senders sendFriendRequests
		//add sender to recipients friend list
		//add recipient to senders friend list
	}

	declineFriendRequest(notification: Notification) {
		//remove sender from incomingFriendRequest
		//remove recipient from senders sendFriendRequests
	}

	acceptChannelInvite(notification: Notification) {
		//remove recipient from channels invite list
		//remove channel from recipients channel list
		//add recipient to channel member list
		//add channel to recipients channel list
	}

	declineChannelInvite(notification: Notification) {
		//remove recipient from channels invite list - or maybe not??
		//remove channel from recipients channel list
	}

	withdrawFriendRequest(notification: Notification) {
		//remove sender from incomingFriendRequest
		//remove recipient from senders sendFriendRequests
	}

	private updateNotifications() {
		this.notifications = [];
		for (let user of this.activeUser?.incomingFriendRequests!) {
			this.notifications.push({
				type: "incomingFriendRequest",
				sender: user
			});
		}
		for (let channel of this.activeUser?.invitedInChannel!) {
			this.notifications.push({
				type: "channelInvite",
				subject: channel
			});
		}
		for (let user of this.activeUser?.sendFriendRequests!) {
			this.notifications.push({
				type: "sendFriendRequest",
				recipient: user
			});
		}
	}
}
