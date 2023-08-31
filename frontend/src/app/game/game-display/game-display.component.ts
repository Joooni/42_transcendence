import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, Input, HostListener } from '@angular/core';
// import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy,} from '@angular/core';

import { GameDisplayService } from 'src/app/services/game-data/game-display/game-display.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { gameData } from './GameData';

@Component({
  selector: 'app-game-display',
  templateUrl: './game-display.component.html',
  styleUrls: ['./game-display.component.css']
})

export class GameDisplayComponent implements AfterViewInit, OnDestroy {

	moveUp: boolean;
	moveDown: boolean;
	search: boolean;
	stopSearch: boolean;
	countdown: number;
	roomNbr?: number;

	@ViewChild('canvasEle')
	private canvasEle: ElementRef<HTMLCanvasElement> = {} as ElementRef<HTMLCanvasElement>;
	private context: any;

	constructor(private gameDisplayService: GameDisplayService, private socketService: SocketService) {
		this.moveUp = false;
		this.moveDown = false;
		this.search = true;
		this.stopSearch = false;
		this.gameDisplayService.loadImages();
		this.countdown = 3;
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

		// window.addEventListener('beforeunload', (event) => {
		// 	this.socketService.emit2('userLeftGame', this.gameDisplayService.activeUser?.id, this.roomNbr);
		// 	event.preventDefault();
		// 	event.stopImmediatePropagation();
		// 	event.returnValue = '';
		// });
	}

	ngOnDestroy() {
		if (this.roomNbr != undefined) {
			this.socketService.emit2('userLeftGame', this.gameDisplayService.activeUser?.id, this.roomNbr);
		}
	}

	// @HostListener('window:onbeforeunload', [ '$event' ])
	// beforeUnload(event: any) {
	// 	this.socketService.emit2('userLeftGame', this.gameDisplayService.activeUser?.id, this.roomNbr);
	// 	event.preventDefault();
	// 	event.stopImmediatePropagation();
	// 	event.returnValue = '';
	// }

	startGame() {
		this.search = false;
		this.stopSearch = true;
		this.socketService.emit('startGameSearching', this.gameDisplayService.activeUser?.id);
	}

	stopSearching() {
		this.stopSearch = false;
		this.search = true;
		this.socketService.emit('stopSearching', undefined);
	}

	runGame(data: gameData) {
		if (this.stopSearch === true) {
			this.stopSearch = false
		}
		if (this.search === true) {
			this.search = false
		}
		if (this.countdown > 0) {
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
		console.log("The roomNbr is :   ", data.roomNbr);
		if (this.gameDisplayService.activeUser?.id === data.leftUserID) {
			this.socketService.emit2('sendRacketPositionLeft', this.gameDisplayService.racketPositionY, data.roomNbr);
		} else if (this.gameDisplayService.activeUser?.id === data.rightUserID) {
			this.socketService.emit2('sendRacketPositionRight', this.gameDisplayService.racketPositionY, data.roomNbr);
		}
	}

	racketMovement() {
		if (this.gameDisplayService.gameEnds == false && this.moveUp == true && this.gameDisplayService.racketPositionY > 8) {
			this.gameDisplayService.racketPositionY -= 10;
		}
		if (this.gameDisplayService.gameEnds == false && this.moveDown == true && this.gameDisplayService.racketPositionY < 600) {
			this.gameDisplayService.racketPositionY += 10;
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

		if (this.gameDisplayService.goalTrigger == true) {
			this.context.drawImage(this.gameDisplayService.goal.img, this.gameDisplayService.goal.x, this.gameDisplayService.goal.y, this.gameDisplayService.goal.width, this.gameDisplayService.goal.height);
			this.context.drawImage(this.gameDisplayService.explosion.img, this.gameDisplayService.explosion.x, this.gameDisplayService.explosion.y, this.gameDisplayService.explosion.width, this.gameDisplayService.explosion.height);
		}
		
		if (data.goalsLeft >= 3 || data.goalsRight >= 3) {
			this.roomNbr = undefined;
			setTimeout(() => {
				this.context.drawImage(this.gameDisplayService.result.img, this.gameDisplayService.result.x, this.gameDisplayService.result.y, this.gameDisplayService.result.width, this.gameDisplayService.result.height);
			}, 3000);
			
		}
	}
}
