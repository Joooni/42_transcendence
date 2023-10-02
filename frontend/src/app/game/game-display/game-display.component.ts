import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { GameDisplayService } from 'src/app/services/game-data/game-display/game-display.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { gameData } from './GameData';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-game-display',
  templateUrl: './game-display.component.html',
  styleUrls: ['./game-display.component.css']
})

export class GameDisplayComponent implements AfterViewInit, OnDestroy {

	moveUp: boolean;
	moveDown: boolean;
	countdown: number;
	roomNbr?: number;
	leftPlayer?: User;
	rightPlayer?: User;

	@ViewChild('canvasEle')
	private canvasEle: ElementRef<HTMLCanvasElement> = {} as ElementRef<HTMLCanvasElement>;
	private context: any;

	constructor(private gameDisplayService: GameDisplayService, private socketService: SocketService, private userDataService: UserDataService, private router: Router) {
		this.moveUp = false;
		this.moveDown = false;
		this.countdown = 3;
		this.gameDisplayService.loadImages();
	}

	ngAfterViewInit() {
		this.context = this.canvasEle.nativeElement.getContext('2d');
		this.context.canvas.width =  1024;
		this.context.canvas.height = 768;

		if (window.innerWidth <= window.innerHeight) {
			this.context.canvas.style.width = '90%';
		} else {
			this.context.canvas.style.height = '58%';
		}
		this.socketService.listen('getGameData').subscribe((data) => {
			this.runGame(data as gameData)
		})
		this.gameDisplayService.restartService();
	}

	ngOnDestroy() {
		if (this.roomNbr != undefined) {
			this.socketService.emit2('userLeftGame', this.gameDisplayService.activeUser?.id, this.roomNbr);
		}
		this.leftPlayer = undefined;
		this.rightPlayer = undefined;
	}

	leavePage() {
		this.router.navigate(['/home']);
	}

	runGame(data: gameData) {
		if (this.countdown > 0) {
			this.getPlayerData(data);
			this.handleCountdown(data);
		} else {
			this.racketMovement();
			if (data.gameEnds === false) {
				this.sendRacketPosition(data);
			}
			this.gameDisplayService.imageControl(data);
			this.draw(data);
		}
	}

	async getPlayerData(data: gameData) {
		this.leftPlayer = await this.userDataService.findUserById(data.leftUserID);
		this.rightPlayer = await this.userDataService.findUserById(data.rightUserID);
	}

	handleCountdown(data: gameData) {
		this.draw(data);
		if (this.countdown === 3) {
			this.roomNbr = data.roomNbr;
			this.context.drawImage(this.gameDisplayService.countdown.img3, this.gameDisplayService.countdown.x, this.gameDisplayService.countdown.y, this.gameDisplayService.countdown.width, this.gameDisplayService.countdown.height);
		} else if (this.countdown === 2) {
			this.context.drawImage(this.gameDisplayService.countdown.img2, this.gameDisplayService.countdown.x, this.gameDisplayService.countdown.y, this.gameDisplayService.countdown.width, this.gameDisplayService.countdown.height);
		} else if (this.countdown === 1) {
			this.gameDisplayService.countdown.width = 56;
			this.gameDisplayService.countdown.x += 24;
			this.context.drawImage(this.gameDisplayService.countdown.img1, this.gameDisplayService.countdown.x, this.gameDisplayService.countdown.y, this.gameDisplayService.countdown.width, this.gameDisplayService.countdown.height);
		}
		this.countdown--;
	}

	sendRacketPosition(data: gameData) {
		if (this.gameDisplayService.activeUser?.id === data.leftUserID) {
			this.socketService.emit2('sendRacketPositionLeft', this.gameDisplayService.racketPositionY, data.roomNbr);
		} else if (this.gameDisplayService.activeUser?.id === data.rightUserID) {
			this.socketService.emit2('sendRacketPositionRight', this.gameDisplayService.racketPositionY, data.roomNbr);
		}
	}

	racketMovement() {
		if (this.gameDisplayService.gameEnds == false && this.moveUp == true && this.gameDisplayService.racketPositionY > 8) {
			this.gameDisplayService.racketPositionY -= 14;
		}
		if (this.gameDisplayService.gameEnds == false && this.moveDown == true && this.gameDisplayService.racketPositionY < 600) {
			this.gameDisplayService.racketPositionY += 14;
		}
	}

	draw(data: gameData) {
		this.context.drawImage(this.gameDisplayService.background.img, 0, 0, this.gameDisplayService.background.width, this.gameDisplayService.background.height);

		if (this.gameDisplayService.activeUser?.id === data.leftUserID) {
			this.context.drawImage(this.gameDisplayService.racketLeft.img, this.gameDisplayService.racketLeft.racketLeftX, this.gameDisplayService.racketPositionY, this.gameDisplayService.racketLeft.width, this.gameDisplayService.racketLeft.height);
			this.context.drawImage(this.gameDisplayService.racketRight.img, this.gameDisplayService.racketRight.racketRightX, data.racketRightY, this.gameDisplayService.racketRight.width, this.gameDisplayService.racketRight.height);
		} else if (this.gameDisplayService.activeUser?.id === data.rightUserID) {
			this.context.drawImage(this.gameDisplayService.racketLeft.img, this.gameDisplayService.racketLeft.racketLeftX, data.racketLeftY, this.gameDisplayService.racketLeft.width, this.gameDisplayService.racketLeft.height);
			this.context.drawImage(this.gameDisplayService.racketRight.img, this.gameDisplayService.racketRight.racketRightX, this.gameDisplayService.racketPositionY, this.gameDisplayService.racketRight.width, this.gameDisplayService.racketRight.height);
		}

		this.context.drawImage(this.gameDisplayService.goalsLeft.img, this.gameDisplayService.goalsLeft.x, this.gameDisplayService.goalsLeft.y, this.gameDisplayService.goalsLeft.width, this.gameDisplayService.goalsLeft.height);
		this.context.drawImage(this.gameDisplayService.goalsRight.img, this.gameDisplayService.goalsRight.x, this.gameDisplayService.goalsRight.y, this.gameDisplayService.goalsRight.width, this.gameDisplayService.goalsRight.height);
		this.context.drawImage(this.gameDisplayService.ball.img, data.ballX, data.ballY, this.gameDisplayService.ball.width, this.gameDisplayService.ball.height);

		if (this.gameDisplayService.goalTrigger == true && data.userQuit == undefined) {
			this.context.drawImage(this.gameDisplayService.goal.img, this.gameDisplayService.goal.x, this.gameDisplayService.goal.y, this.gameDisplayService.goal.width, this.gameDisplayService.goal.height);
			this.context.drawImage(this.gameDisplayService.explosion.img, this.gameDisplayService.explosion.x, this.gameDisplayService.explosion.y, this.gameDisplayService.explosion.width, this.gameDisplayService.explosion.height);
		}
		
		if (data.goalsLeft >= 5 || data.goalsRight >= 5) {
			this.roomNbr = undefined;
			setTimeout(() => {
				this.context.drawImage(this.gameDisplayService.result.img, this.gameDisplayService.result.x, this.gameDisplayService.result.y, this.gameDisplayService.result.width, this.gameDisplayService.result.height);
				if (data.userQuit != undefined) {
					this.context.drawImage(this.gameDisplayService.oppQuit.img, this.gameDisplayService.oppQuit.x, this.gameDisplayService.oppQuit.y, this.gameDisplayService.oppQuit.width, this.gameDisplayService.oppQuit.height);
				}
			}, 1000);
			
		}
	}
}
