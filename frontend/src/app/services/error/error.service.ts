import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { UserDataService } from '../user-data/user-data.service';
import { User } from 'src/app/models/user';


@Injectable({
  providedIn: 'root'
})
export class ErrorService {
	public showError: boolean = false;
	public errorMessage: string = "Ooops, something went wrong. Please try again."

	public showFirstLoginPrompt: boolean = false;
	public activeUser?: User;

  constructor(
		private socket: SocketService,
		private router: Router,
		private authService: AuthService,
		private userService: UserDataService
	) {}

	async initErrorService() {
		this.socket.listen('alreadyConnected').subscribe(data => {
			this.router.navigate(['/alreadyConnected']);
			this.authService.logout();
		})
	}

	public showErrorMessage(message?: string) {
		this.showError = true;
		if (message)
			this.errorMessage = message;
	}

	public async showFirstLoginPopup() {
		try {
			await this.updateUser();
			this.showFirstLoginPrompt = true;
		} catch(e) {}
	}

	public closeError() {
		this.showError = false;
		this.errorMessage = "Ooops, something went wrong. Please try again."
	}

	public async closeFirstLoginPopup() {
		try {
			await this.userService.updateHasLoggedInBefore();
		} catch (e) {}
		this.showFirstLoginPrompt = false;
	}

	async updateUser() {
		await this.userService.findSelf().then(user => {
			this.activeUser = user;
		});
	}
}
