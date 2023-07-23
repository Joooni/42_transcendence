import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserDataService } from '../services/user-data/user-data.service';
import { USERS } from '../mock-data/mock_users';
import { FormControl } from '@angular/forms';
import { getStoreKeyName } from '@apollo/client/utilities';
import { ErrorService } from '../services/error/error.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

	activeUser?: User;
	newUsername?: string;
	selectedMap?: number;
	twoFAEnabled: boolean = false;
	twoFACode?: string;
	qrCode?: string;
	invalidCode: boolean = false;

	constructor(
		public userService: UserDataService,
		private router: Router,
		private errorService: ErrorService
		) {}

	async ngOnInit() {
		await this.userService.findSelf().then(user => this.activeUser = user)
		this.twoFAEnabled = this.activeUser!.twoFAEnabled;
		this.selectedMap = this.activeUser!.selectedMap;
		console.log(this.selectedMap);
	}

	async toggle2FA() {
		if (this.twoFAEnabled) {
			const popup = document.getElementById("popup-2FA-code");
			popup?.classList.toggle('show-popup');
		}
		else if (this.activeUser?.hasTwoFASecret) {
			const popup = document.getElementById("popup-2FA-code");
			popup?.classList.toggle('show-popup');
		}
		else {
			await this.userService.generate2FA()
			.then((value) => {
				this.qrCode = value.data;
				const popup = document.getElementById("popup-2FA-qr");
				popup?.classList.toggle('show-popup');
			})
			.catch(() => {
				this.errorService.showErrorMessage();
			});
		}
	}

	async popUpCodeConfirm(popUpId: string) {
		if (this.twoFAEnabled) {
			await this.userService.enable2FA(this.twoFACode!)
			.then(() => {
				this.userService.findSelf().then(user => this.activeUser = user);
				const popup = document.getElementById(popUpId);
				popup?.classList.toggle('show-popup');
				this.twoFACode = undefined;
				this.invalidCode = false;
			})
			.catch((error) => {
				this.invalidCode = true;
				this.twoFAEnabled = false;
			});
		}
		else {
			await this.userService.disable2FA(this.twoFACode!)
			.then(() => {
				this.userService.findSelf().then(user => this.activeUser = user);	
				const popup = document.getElementById(popUpId);
				popup?.classList.toggle('show-popup');
				this.twoFACode = undefined;
				this.invalidCode = false;
			})
			.catch((error) => {
				this.invalidCode = true;
				this.twoFAEnabled = true;
			});
		}
	}

	popUpCancel(popUpId: string) {
		const popup = document.getElementById(popUpId);
		popup?.classList.toggle('show-popup');
		this.twoFACode = undefined;
		getStoreKeyName
		this.invalidCode = false;
		if (this.twoFAEnabled)
			this.twoFAEnabled = false;
		else
			this.twoFAEnabled = true;
	}

	async saveChanges() {
		let hasError: boolean = false;
		if (this.newUsername)
			//check if username unique -> find user by name
			await this.userService.updateUsername(this.newUsername)
			.then(() => {
				this.userService.findSelf().then(user => this.activeUser = user);
			})
			.catch(() => {
				this.errorService.showErrorMessage("Couldn't save the new username. Please try again!");
				hasError = true;
			})
		if (this.selectedMap != this.activeUser?.selectedMap)
			await this.userService.updateSelectedMap(Number(this.selectedMap!))
			.catch(error => {
				this.errorService.showErrorMessage("Couldn't save the selected Game Design. Please try again!");
				hasError = true;
			})
		if (!hasError)
			this.router.navigate(['/profile/' + this.activeUser?.username]);
	}
}
