import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserDataService } from '../services/user-data/user-data.service';
import { USERS } from '../mock-data/mock_users';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

	activeUser?: User;
	newUsername?: string;
	twoFAEnabled: boolean = false;
	selectedMap?: number;
	twoFACode?: string;

	constructor(
		private userService: UserDataService,
		private router: Router
		) {}

	async ngOnInit() {
		await this.userService.findSelf().then(user => this.activeUser = user)
		this.twoFAEnabled = this.activeUser!.twoFAEnabled;
		// this.selectedMap = this.activeUser.map;
	}

	toggle2FA() {
		if (this.twoFAEnabled) {
			this.userService.disable2FA();
		}
		else {
			const popup = document.getElementById("popup-2FA-code");
			popup?.classList.toggle('show-popup');
			// if has secret: enable() & get code
			// if failure: error message & don't set toggle true/ maybe call generate
			// else: generate
			// if failure: error message & don't set toggle true
		}
		console.log(this.twoFAEnabled);
	}

	popUpConfirm() {
		if (this.twoFACode)
			this.userService.enable2FA(this.twoFACode)
	}

	popUpCancel(popUpId: string) {
		const popup = document.getElementById(popUpId);
		popup?.classList.toggle('show-popup');
		this.twoFAEnabled = false;
	}

	saveChanges() {
		console.log(this.newUsername);
// 	this.router.navigate(['/profile/' + this.changedUserData?.username]);
	}

	// saveChanges() {
	// 	console.log('saveChanges called');
	// 	if (this.selectedGameDesign && this.changedUserData)
	// 	{
	// 		// this.changedUserData.map = parseInt(this.selectedGameDesign);
	// 		// see if this works
	// 		console.log("new username: ", this.changedUserData.username);
	// 		this.userService.updateUsername(this.changedUserData.username);
	// 	}
	// 	this.router.navigate(['/profile/' + this.changedUserData?.username]);
	// }
}
