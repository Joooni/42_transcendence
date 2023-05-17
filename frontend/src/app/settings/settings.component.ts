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
	
	activeUser?: User;
	
	changedUserData?: User;
	
	constructor(private cookie: CookieService, private userService: UserDataService) {}
	
	ngOnInit() {
		this.getActiveUserID();
		this.changedUserData = Object.assign({}, this.activeUser);
	}
	
	getActiveUserID() {
		this.userService.getUserByUsername(this.cookie.get("username")).subscribe(user => this.activeUser = user);
		return this.activeUser?.id;
	}

	getActiveUsername() {
		this.userService.getUserByUsername(this.cookie.get("username")).subscribe(user => this.activeUser = user);
		return this.activeUser?.username;
	}

	changeUserData() {
		console.log(this.changedUserData);
	}

	mapNumberIs(map: number): boolean {
		if (map == this.changedUserData?.map)
			return true;
		return false;
	}
}
