import { Component } from '@angular/core';
import { ErrorService } from '../services/error/error.service';
import { UserDataService } from '../services/user-data/user-data.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {
	newUsername?: string;
	errorMessage?: string;
	disableNameForm: boolean = true;
	
	constructor(
		public errorService: ErrorService,
		private userService: UserDataService
	) {}

	setDisableName(status: boolean) {
		this.disableNameForm = status;
	}

	nameHasValidLength(): boolean {
		if (this.newUsername && this.newUsername?.length > 30)
			return true;
		return false;
	}

	async saveNewUsername() {
		let hasError: boolean = false;
		if (this.newUsername && this.newUsername != this.errorService.activeUser?.username)
			await this.userService.findUserByUsername(this.newUsername)
			.then(() => {
				this.errorMessage = "Username is already taken. Please choose another name.";
				hasError = true;
			})
			.catch(() => {});
		if (!hasError && this.newUsername) {
			this.userService.updateUsername(this.newUsername!)
			.then(() => {
				this.setDisableName(true);
			})
			.catch(() => {
				this.errorMessage = "Couldn't save the new username. Please try again!";
				hasError = true;
			});
			this.errorService.updateUser();
		} else {
			this.errorMessage = "Username cannot be empty!";
			hasError = true;
		}
	}

	async onFileSelected(event: Event) {
		const target = event.target as HTMLInputElement;
		const fileList = target.files as FileList;
		const file = fileList[0];
		if (file) {
			await this.userService.uploadPicture(file).catch(() => {
				this.errorMessage = "File upload failed. Please make sure that the file is less than 5MB and its type is either PNG, JPG (JPEG is cool, too) or GIF.";
			});
			this.errorService.updateUser();
		}
	}
}
