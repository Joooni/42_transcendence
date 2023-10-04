import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserDataService } from '../services/user-data/user-data.service';
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
	disableNameForm: boolean = true;

	constructor(
		public userService: UserDataService,
		private router: Router,
		private errorService: ErrorService
		) {}

	async ngOnInit() {
		this.updateUser();
	}

	setDisableName(status: boolean) {
		this.disableNameForm = status;
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
		this.invalidCode = false;
		if (this.twoFAEnabled)
			this.twoFAEnabled = false;
		else
			this.twoFAEnabled = true;
	}

	nameHasValidLength(): boolean {
		if (this.newUsername && this.newUsername?.length > 30)
			return true;
		return false;
	}

	async saveNewUsername() {
		let hasError: boolean = false;
		if (this.newUsername && this.newUsername != this.activeUser?.username)
			await this.userService.findUserByUsername(this.newUsername)
			.then(() => {
				this.errorService.showErrorMessage("Username is already taken. Please choose another name.")
				hasError = true;
			})
			.catch(() => {});
		if (!hasError && this.newUsername) {
			this.userService.updateUsername(this.newUsername!)
			.then(() => {
				this.setDisableName(true);
			})
			.catch(() => {
				this.errorService.showErrorMessage("Couldn't save the new username. Please try again!");
				hasError = true;
			});
			this.updateUser();
		} else {
			this.errorService.showErrorMessage("Username cannot be empty!");
			hasError = true;
		}
	}

	async selectOtherMap(map: number) {
		if (map != this.activeUser?.selectedMap) {
			await this.userService.updateSelectedMap(map)
			.catch(() => {
				this.errorService.showErrorMessage("Couldn't save the selected Game Design. Please try again!");
			});
			this.updateUser();
		}
	}

	updateUser() {
		try {
			this.userService.findSelf().then(user => {
				this.activeUser = user;
				this.twoFAEnabled = this.activeUser.twoFAEnabled;
				this.selectedMap = this.activeUser.selectedMap;
			});
		} catch (e) {
			return;
		}
	}

	async onFileSelected(event: Event) {
		const target = event.target as HTMLInputElement;
		const fileList = target.files as FileList;
		const file = fileList[0];
		if (file) {
			await this.userService.uploadPicture(file).catch((e) => {
				this.errorService.showErrorMessage("File upload failed. Please make sure that the file type is either PNG, JPG or JPEG.");
			});
			this.updateUser();
		}
	}
}
