import { Injectable } from '@angular/core';
import { SocketService } from '../socket/socket.service';
import { User } from 'src/app/models/user';
import { UserDataService } from '../user-data/user-data.service';
import { Router } from '@angular/router';
import { ErrorService } from '../error/error.service';

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
		private userService: UserDataService,
		private errorService: ErrorService
	) {}

	initGameInviteService() {
		this.socket.socket.on('gotGameRequest', ({senderID, gameMode}: {senderID: number; gameMode: number}) => {
			this.gotGameRequest(senderID as number, gameMode as number);
		})
	}

	async getActiveUser() {
		try {
			if (!this.activeUser) {
				await this.userService.findSelf().then(user => this.activeUser = user);
			}
		} catch (e) {
			this.declineGameRequest();
		}
	}

	async gotGameRequest(senderID: number, gameMode: number) {
        try {
            this.gameRequestSender = await this.userService.findUserById(senderID);
            if (this.router.url.endsWith('/game')) {
                this.declineGameRequest();
            } else {
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
        } catch (e) {
            this.declineGameRequest();
        }
    }

	async acceptGameRequest() {		
		try {
			await this.getActiveUser();
			this.socket.emit3('startGameWithRequest', this.activeUser?.id, this.gameRequestSender?.id, this.gameMode)
			this.socket.stopListen('withdrawnGameRequest');
			this.showGotGameRequestPopup = false;
			this.gameRequestSender = undefined;
			this.router.navigate(['/game']);
		} catch (e) {
			this.errorService.showErrorMessage('Something went wrong. Please try again.')
			this.declineGameRequest();
		}
	}

	async declineGameRequest() {
		try {
			await this.getActiveUser();
			this.socket.emit2('gameRequestDecliend', this.activeUser?.id, this.gameRequestSender?.id)
			this.socket.stopListen('withdrawnGameRequest');
			this.showGotGameRequestPopup = false;
			this.gameRequestSender = undefined;
		} catch (e) {
			this.socket.stopListen('withdrawnGameRequest');
			this.showGotGameRequestPopup = false;
			this.gameRequestSender = undefined;
		}
	}

	async sendGameRequest(selectedUser: User) {
		try {
			await this.getActiveUser();
			this.showSendGameRequestPopup = true;
			this.gameRequestRecipient = selectedUser;
			this.socket.emit2('setStatusToGaming', this.activeUser?.id, this.gameRequestRecipient!.id);
		} catch (e) {
			this.errorService.showErrorMessage('Something went wrong. Please try again.');
		}
	}

	async waitForGameRequestAnswer(gameMode: number) {
		try {
			if (this.gameRequestRecipient!.status === "online") {
				this.showSendGameRequestPopup = false;
				this.showWaitForGameRequestAnswerPopup = true
				await this.getActiveUser();
				this.socket.emit3('sendGameRequest', this.activeUser?.id, this.gameRequestRecipient!.id, gameMode);
				this.socket.listen('gameRequestDecliend').subscribe(() => {
					this.showWaitForGameRequestAnswerPopup = false;
					this.sendGameRequestWasDeclined();
				})
				this.socket.listen('gameRequestAccepted').subscribe((data) => {
					this.showWaitForGameRequestAnswerPopup = false;
					this.router.navigate(['/game']);
					this.showSendGameRequestPopup = false;
					this.gameRequestRecipient = undefined;
				})
			} else {
				this.showSendGameRequestPopup = false;
				this.showDeclinedGameRequestPopup = true;
			}
		} catch (e) {
			this.cancelGameRequest();
		}
	}

	async cancelGameRequest() {
		try {
			await this.getActiveUser();
		} catch (e) {}
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
	}
}