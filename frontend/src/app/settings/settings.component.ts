import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { User } from '../models/user';
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

	async ngOnInit() {
		await this.userService.findSelf().then(user => this.activeUser = user)
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
