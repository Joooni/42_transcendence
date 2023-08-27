import { Component, OnInit } from '@angular/core';
import { Notification } from '../models/notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
	
	notifications?: Notification[];
	
	ngOnInit() {
		this.updateNotifications();
	}

	private updateNotifications() {
		console.log('TEST');
	}
}
