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
	gameMode?: number;
	gameModeString?: string;

	showGotGameRequestPopup: boolean = false;
	showSendGameRequestPopup: boolean = false;
	showDeclinedGameRequestPopup: boolean = false;
	showWaitForGameRequestAnswerPopup: boolean = false;

  constructor(
		private socket: SocketService,
		private router: Router,
		private userService: UserDataService
	) {}

	initGameInviteService() {
		console.log('initGameInviteService()');

		this.socket.socket.on('gotGameRequest', ({senderID, gameMode}: {senderID: number; gameMode: number}) => {
			this.gotGameRequest(senderID as number, gameMode as number);
		})

		// this.socket.listen('gotGameRequest').subscribe(data => {
		// 	console.log('game request... the sender is   ' + data);
		// this.gotGameRequest(data as number[]);
		// });
	}

	async getActiveUser() {
		if (!this.activeUser) {
			await this.userService.findSelf().then(user => this.activeUser = user);
		}
	}

	async gotGameRequest(senderID: number, gameMode: number) {
		this.gameRequestSender = await this.userService.findUserById(senderID);
		this.gameMode = gameMode;
		if (gameMode === 0)
			this.gameModeString = "Normal Mode";
		else
			this.gameModeString = "Alternative Mode";
		this.showGotGameRequestPopup = true;
		this.socket.listen('withdrawnGameRequest').subscribe(() => {
			this.socket.stopListen('withdrawnGameRequest');
			this.showGotGameRequestPopup = false;
			this.gameRequestSender = undefined;
		})
	}

	async acceptGameRequest() {		
		console.log("_______ TEST1 ________");
		await this.getActiveUser();
		this.socket.emit3('startGameWithRequest', this.activeUser?.id, this.gameRequestSender?.id, this.gameMode)
		this.socket.stopListen('withdrawnGameRequest');
		this.showGotGameRequestPopup = false;
		this.gameRequestSender = undefined;
		this.router.navigate(['/game']);
	}

	async declineGameRequest() {
		console.log("_______ TEST1 ________");
		await this.getActiveUser();
		this.socket.emit2('gameRequestDecliend', this.activeUser?.id, this.gameRequestSender?.id)
		this.socket.stopListen('withdrawnGameRequest');
		this.showGotGameRequestPopup = false;
		this.gameRequestSender = undefined;
	}

	async sendGameRequest(selectedUser: User) {
		await this.getActiveUser();
		this.showSendGameRequestPopup = true;
		this.gameRequestRecipient = selectedUser;
		this.socket.emit2('setStatusToGaming', this.activeUser?.id, this.gameRequestRecipient!.id);
	}

	async waitForGameRequestAnswer(gameMode: number) {
		this.showSendGameRequestPopup = false;
		this.showWaitForGameRequestAnswerPopup = true
		await this.getActiveUser();
		console.log("_______ TEST1 ________");
		this.socket.emit3('sendGameRequest', this.activeUser?.id, this.gameRequestRecipient!.id, gameMode);
		console.log("_______ TEST2 ________");
		this.socket.listen('gameRequestDecliend').subscribe(() => {
			console.log("got gamerequest decliend");
			this.showWaitForGameRequestAnswerPopup = false;
			this.sendGameRequestWasDeclined();
		})
		this.socket.listen('gameRequestAccepted').subscribe((data) => {
			console.log("got gamerequest accepted");
			this.showWaitForGameRequestAnswerPopup = false;
			this.router.navigate(['/game']);
		})
	}

	async cancelGameRequest() {
		await this.getActiveUser();
		this.socket.emit2('gameRequestWithdrawn', this.activeUser?.id, this.gameRequestRecipient?.id);
		this.gameRequestRecipient = undefined;
		this.showWaitForGameRequestAnswerPopup = false;
	}

	sendGameRequestWasDeclined() {
		this.socket.stopListen('gameRequestDecliend');
		this.showWaitForGameRequestAnswerPopup = false;
		this.showDeclinedGameRequestPopup = true;
	}

	closeDeclinedGameRequestPopup() {
		this.showDeclinedGameRequestPopup = false;
		this.gameRequestRecipient = undefined;
	}

	ngOnDestroy() {
		this.socket.stopListen('gotGameRequest');
		console.log("GAME_INVITE DESTROYED");
	}
}