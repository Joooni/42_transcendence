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

	ngOnInit() {
		this.userDataService.findSelf().then(user => this.activeUser = user);
		this.updateNotifications();
	}

	private updateNotifications() {
		this.notifications = [];
		for (let channel of this.activeUser?.invitedInChannel!) {
			this.notifications.push({
				type: "channelInvite",
				sender: channel
			});
		}
		for (let user of this.activeUser?.incomingFriendRequests!) {
			this.notifications.push({
				type: "incomingFriendRequest",
				sender: user
			});
		}
		for (let user of this.activeUser?.sendFriendRequests!) {
			this.notifications.push({
				type: "sendFriendRequest",
				sender: user
			});
		}
	}
}
