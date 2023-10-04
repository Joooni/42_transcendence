import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameDisplayService } from 'src/app/services/game-display/game-display.service';
import { SocketService } from 'src/app/services/socket/socket.service';
import { gameData } from '../game-display/GameData';
import { User } from 'src/app/models/user';
import { UserDataService } from 'src/app/services/user-data/user-data.service';
import { ErrorService } from 'src/app/services/error/error.service';

@Component({
  selector: 'app-game-watch',
  templateUrl: './game-watch.component.html',
  styleUrls: ['./game-watch.component.css']
})
export class GameWatchComponent implements AfterViewInit {
	
	stopWatch: boolean;
	watchingRoom?: number;

	leftPlayer?: User;
	rightPlayer?: User;

	@ViewChild('canvasEle')
	private canvasEle: ElementRef<HTMLCanvasElement> = {} as ElementRef<HTMLCanvasElement>;
	private context: any;

	constructor(
		private gameDisplayService: GameDisplayService,
		private socketService: SocketService,
		private router: Router,
		private userDataService: UserDataService,
		private errorService: ErrorService
	)
	{
		this.stopWatch = false;
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
	}

	stopWatching() {
		this.socketService.emit('stopWatchGame', this.watchingRoom);
		this.watchingRoom = undefined;
		this.router.navigate(['/home']);
	}

	runGame(data: gameData) {
		try {
			if (this.watchingRoom == undefined)
				this.watchingRoom = data.roomNbr;
			this.getPlayerData(data);
			this.gameDisplayService.imageControl(data);
			this.draw(data);
		} catch (e) {
			this.errorService.showErrorMessage('Game could not be initialized. Please try again.');
			this.router.navigate(['/home']);
		}
	}

	async getPlayerData(data: gameData) {
		try {
			this.leftPlayer = await this.userDataService.findUserById(data.leftUserID);
			this.rightPlayer = await this.userDataService.findUserById(data.rightUserID);
		} catch (e) {
			throw e;
		}
	}

	draw(data: gameData) {
		this.context.drawImage(this.gameDisplayService.background.img, 0, 0, this.gameDisplayService.background.width, this.gameDisplayService.background.height);

		this.context.drawImage(this.gameDisplayService.racketRight.img, this.gameDisplayService.racketRight.racketRightX, data.racketRightY, this.gameDisplayService.racketRight.width, this.gameDisplayService.racketRight.height);
		this.context.drawImage(this.gameDisplayService.racketLeft.img, this.gameDisplayService.racketLeft.racketLeftX, data.racketLeftY, this.gameDisplayService.racketLeft.width, this.gameDisplayService.racketLeft.height);

		this.context.drawImage(this.gameDisplayService.goalsLeft.img, this.gameDisplayService.goalsLeft.x, this.gameDisplayService.goalsLeft.y, this.gameDisplayService.goalsLeft.width, this.gameDisplayService.goalsLeft.height);
		this.context.drawImage(this.gameDisplayService.goalsRight.img, this.gameDisplayService.goalsRight.x, this.gameDisplayService.goalsRight.y, this.gameDisplayService.goalsRight.width, this.gameDisplayService.goalsRight.height);
		this.context.drawImage(this.gameDisplayService.ball.img, data.ballX, data.ballY, this.gameDisplayService.ball.width, this.gameDisplayService.ball.height);

		if (this.gameDisplayService.goalTrigger == true && data.userQuit == undefined) {
			this.context.drawImage(this.gameDisplayService.goal.img, this.gameDisplayService.goal.x, this.gameDisplayService.goal.y, this.gameDisplayService.goal.width, this.gameDisplayService.goal.height);
			this.context.drawImage(this.gameDisplayService.explosion.img, this.gameDisplayService.explosion.x, this.gameDisplayService.explosion.y, this.gameDisplayService.explosion.width, this.gameDisplayService.explosion.height);
		}
		
		if (data.goalsLeft >= 5 || data.goalsRight >= 5) {
			setTimeout(() => {
				this.context.drawImage(this.gameDisplayService.result.img, this.gameDisplayService.result.x, this.gameDisplayService.result.y, this.gameDisplayService.result.width, this.gameDisplayService.result.height);
				if (data.userQuit != undefined) {
					this.context.drawImage(this.gameDisplayService.plyQuit.img, this.gameDisplayService.plyQuit.x, this.gameDisplayService.plyQuit.y, this.gameDisplayService.plyQuit.width, this.gameDisplayService.plyQuit.height);
				}
			}, 1000);
		}
	}
}
