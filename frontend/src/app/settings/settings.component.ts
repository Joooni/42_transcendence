import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { User } from '../user';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
	constructor(private cookie: CookieService, private userService: UserDataService) {}

	activeUser?: User;
	
	getActiveUserID() {
		this.userService.getUserByUsername(this.cookie.get("username")).subscribe(user => this.activeUser = user);
		return this.activeUser?.id;
	}

	getActiveUsername() {
		this.userService.getUserByUsername(this.cookie.get("username")).subscribe(user => this.activeUser = user);
		return this.activeUser?.username;
	}
}
