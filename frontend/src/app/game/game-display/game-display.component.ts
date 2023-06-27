import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { GameDisplayService } from 'src/app/services/game-data/game-display/game-display.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { objPositions } from './objPositions';

@Component({
  selector: 'app-game-display',
  templateUrl: './game-display.component.html',
  styleUrls: ['./game-display.component.css']
})

export class GameDisplayComponent implements AfterViewInit {
	
	moveUp: boolean;
	moveDown: boolean;
	ready: boolean;
	gameRunning: boolean;

	@ViewChild('canvasEle')
	private canvasEle: ElementRef<HTMLCanvasElement> = {} as ElementRef<HTMLCanvasElement>;
	private context: any;

	constructor(private gameDisplayService: GameDisplayService, private socketService: SocketService) {
		this.moveUp = false;
		this.moveDown = false;
		this.ready = true;
		this.gameRunning = false;
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
		console.log(window.innerHeight);
		console.log(window.innerWidth);
		this.socketService.listen('getGameData').subscribe((data) => {
			this.runGame(data as objPositions)
		})
	}

	startGame() {
		this.gameRunning = true;
		this.socketService.emit('startGame', undefined);
	}

	stopGame() {
		this.gameDisplayService.gameReset = true;
		this.socketService.emit('stopGame', undefined);
	}

	runGame(data: objPositions) {
		this.racketMovement();
		this.sendRacketPosition(data);
		this.gameDisplayService.imageControl(data);
		this.draw(data);
	}

	sendRacketPosition(data: objPositions) {
		if (data.isPlayerLeft === true) {
			this.socketService.emit('sendRacketPositionLeft', this.gameDisplayService.racketPositionY);
		} else {
			this.socketService.emit('sendRacketPositionRight', this.gameDisplayService.racketPositionY);
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

	draw(data: objPositions) {
		this.context.drawImage(this.gameDisplayService.background.img, 0, 0, this.gameDisplayService.background.width, this.gameDisplayService.background.height);

		if (data.isPlayerLeft === true) {
			this.context.drawImage(this.gameDisplayService.racketLeft.img, this.gameDisplayService.racketLeft.racketLeftX, this.gameDisplayService.racketPositionY, this.gameDisplayService.racketLeft.width, this.gameDisplayService.racketLeft.height);
			this.context.drawImage(this.gameDisplayService.racketRight.img, this.gameDisplayService.racketRight.racketRightX, data.racketRightY, this.gameDisplayService.racketRight.width, this.gameDisplayService.racketRight.height);
		} else {
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
		if (this.gameDisplayService.gameEnds == true) {
			this.context.drawImage(this.gameDisplayService.result.img, this.gameDisplayService.result.x, this.gameDisplayService.result.y, this.gameDisplayService.result.width, this.gameDisplayService.result.height);
		}
	}
}
