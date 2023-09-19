import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
	public showError: boolean = false;
	public errorMessage: string = "Ooops, something went wrong. Please try again."

  constructor(private socket: SocketService) {}

	initErrorService() {
		console.log('initErrorService()');
		this.socket.listen('alreadyConnected').subscribe(data => {
			console.log('got error that user is already connected');
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
