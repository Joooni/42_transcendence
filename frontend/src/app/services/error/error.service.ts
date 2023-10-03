import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class ErrorService {
	public showError: boolean = false;
	public errorMessage: string = "Ooops, something went wrong. Please try again."

  constructor(private socket: SocketService,
			  private router: Router,
			  private authService: AuthService,
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

	public closeError() {
		this.showError = false;
		this.errorMessage = "Ooops, something went wrong. Please try again."
	}
}
