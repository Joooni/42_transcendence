import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { Router } from '@angular/router';
import { UserDataService } from '../user-data/user-data.service';
import { User } from 'src/app/models/user';


@Injectable({
  providedIn: 'root'
})
export class ErrorService {
	public showError: boolean = false;
	public errorMessage: string = "Ooops, something went wrong. Please try again."

  constructor(private socket: SocketService,
			  private router: Router,
			  private userService: UserDataService,
			  private socketService: SocketService,
	) {}

	async initErrorService() {
		console.log('initErrorService()');
		this.socket.listen('alreadyConnected').subscribe(data => {
			console.log('got error that user is already connected');
			this.router.navigate(['/alreadyConnected']);
		})

		// var user: User;
		// await this.userService.findSelf().then(db => user = db);
		
		// setTimeout(() =)
				
		// if (this.socket.connected === false)
		// 	this.router.navigate(['/alreadyConnected']);
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
