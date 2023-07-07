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
	selectedGameDesign?: string = '1';
	has2FASecret?: boolean = false;
	test: boolean = true;

	constructor(
		private userService: UserDataService,
		private router: Router
		) {}

	async ngOnInit() {
		await this.userService.findSelf().then(user => this.activeUser = user)
		console.log(this.activeUser);
		this.changedUserData = Object.assign({}, this.activeUser);
		// this.selectedGameDesign = this.changedUserData.map.toString();
	}

	toggle2FA() {
		if (this.changedUserData?.twoFAEnabled) {
			console.log('enabled');
		}
		else {
			console.log('disabled');
		}
		//if toggle was inactive activate 
		//call either generate or enable 2FA based on if there is a secret already
		//generate 2FA: show a QR code in a pop-up
		//enable 2FA: enter code in a pop-up
		//if toggle activate, deactivate : call disable 2FA
		console.log(this.changedUserData);
	}

	saveChanges() {
		console.log('saveChanges called');
		if (this.selectedGameDesign && this.changedUserData)
		{
			// this.changedUserData.map = parseInt(this.selectedGameDesign);
			// see if this works
			console.log("new username: ", this.changedUserData.username);
			this.userService.updateUsername(this.changedUserData.username);
		}
		this.router.navigate(['/profile/' + this.changedUserData?.username]);
	}
}
