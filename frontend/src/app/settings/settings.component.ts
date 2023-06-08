import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { User } from '../objects/user';
import { UserDataService } from '../services/user-data/user-data.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

	activeUser?: User;
	changedUserData?: User;
	selectedGameDesign?: string;

	constructor(
		private cookie: CookieService,
		private userService: UserDataService,
		private router: Router
		) {}

	ngOnInit() {
		this.userService.getUserByID(parseInt(this.cookie.get("userid"))).subscribe(user => this.activeUser = user);
		this.changedUserData = Object.assign({}, this.activeUser);
		this.selectedGameDesign = this.changedUserData.map.toString();
	}

	saveChanges() {
		console.log('saveChanges called');
		if (this.selectedGameDesign && this.changedUserData)
		{
			this.changedUserData.map = parseInt(this.selectedGameDesign);
			// see if this works
			console.log("new username: ", this.changedUserData.username);
			this.userService.updateUsername(this.changedUserData.username);
		}
		this.router.navigate(['/profile/' + this.changedUserData?.username]);
	}
}
