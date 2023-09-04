import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { User } from 'src/app/models/user';
import { UserDataService } from '../user-data/user-data.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GameInviteService {

	gameRequestSender?: User;
	gameRequestRecipient?: User;
	activeUser?: User;

	showGotGameRequestPopup: boolean = false;
	showSendGameRequestPopup: boolean = false;
	showDeclinedGameRequestPopup: boolean = false;

  constructor(
		private socket: SocketService,
		private router: Router,
		private userService: UserDataService
	) {}

	initGameInviteService() {
		console.log('initGameInviteService()');
		this.socket.listen('gotGameRequest').subscribe(data => {
			console.log('game request');
			this.gotGameRequest(data as number)
		});
	}

	async getActiveUser() {
		if (!this.activeUser) {
			await this.userService.findSelf().then(user => this.activeUser = user);
		}
	}

	async gotGameRequest(senderID: number) {
		this.gameRequestSender = await this.userService.findUserById(senderID);
		this.showGotGameRequestPopup = true;
		this.socket.listen('withdrawnGameRequest').subscribe(() => {
			this.socket.stopListen('withdrawnGameRequest');
			this.showGotGameRequestPopup = false;
			this.gameRequestSender = undefined;
		})
	}

	async acceptGameRequest() {		
		await this.getActiveUser();
		this.socket.emit2('startGameRequest', this.activeUser?.id, this.gameRequestSender?.id)
		this.socket.stopListen('withdrawnGameRequest');
		this.showGotGameRequestPopup = false;
		this.gameRequestSender = undefined;
		this.router.navigate(['/game']);
	}

	async declineGameRequest() {
		await this.getActiveUser();
		this.socket.emit2('gameRequestDecliend', this.activeUser?.id, this.gameRequestSender?.id)
		this.socket.stopListen('withdrawnGameRequest');
		this.showGotGameRequestPopup = false;
		this.gameRequestSender = undefined;
	}

	async sendGameRequest(selectedUser: User) {
		this.showSendGameRequestPopup = true;
		this.gameRequestRecipient = selectedUser;
		await this.getActiveUser();
		this.socket.emit2('sendGameRequest', this.activeUser?.id, selectedUser.id);
		this.socket.listen('gameRequestDecliend').subscribe(() => {
			this.sendGameRequestWasDeclined();
		})
		this.socket.listen('gameRequestAccepted').subscribe((data) => {
			this.router.navigate(['/game']);
		})		
	}

	async cancelGameRequest() {
		await this.getActiveUser();
		this.socket.emit2('gameRequestWithdrawn', this.activeUser?.id, this.gameRequestRecipient?.id);
		this.gameRequestRecipient = undefined;
		this.showSendGameRequestPopup = false;
	}

	sendGameRequestWasDeclined() {
		this.socket.stopListen('gameRequestDecliend');
		this.showSendGameRequestPopup = false;
		this.showDeclinedGameRequestPopup = true;
	}

	closeDeclinedGameRequestPopup() {
		this.showDeclinedGameRequestPopup = false;
		this.gameRequestRecipient = undefined;
	}

	ngOnDestroy() {
		this.socket.stopListen('gotGameRequest');
	}
}