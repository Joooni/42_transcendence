import { Injectable } from '@angular/core';
import { objPositions } from '../../../game/game-display/objPositions'
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GameDisplayService {

	background = {
		width: 1024,
		height: 768,
		src : '../../../../assets/gameObjects/hintergrund1.png',
		img: new Image
	}

	racketPositionY: number;
	racketPositionStartY: number;

	racketLeft = {
		racketLeftX: 20,
		width: 60,
		height: 160,
		src : '../../../../assets/gameObjects/banane_links.png',
		img: new Image
	}

	racketRight = { 
		racketRightX: 944,
		width: 60,
		height: 160,
		src : '../../../../assets/gameObjects/banane_rechts.png',
		img: new Image
	}

	ball = {
		width: 100,
		height: 100,
		src : '../../../../assets/gameObjects/DK_Fass1.png',
		img: new Image
	}

	goal = {
		x: 156,
		y: 324,
		width: 712,
		height: 163,
		src : '../../../../assets/gameObjects/goal.png',
		img: new Image
	}
	
	goalsLeft = {
		x: 206,
		y: 101,
		width: 101,
		height: 156,
		img: new Image
	}
	
	goalsRight = {
		x: 718,
		y: 101,
		width: 101,
		height: 156,
		img: new Image
	}
	
	explosion = {
		x: 0,
		y: 0,
		width: 195,
		height: 200,
		src : '../../../../assets/gameObjects/explosion.png',
		img: new Image
	}

	goalTrigger: boolean;
	gameEnds : boolean;
	gameReset: boolean;

	result = {
		x: 232,
		y: 324,
		width: 560,
		height: 157,
		src : '../../../../assets/gameObjects/result.png',
		img: new Image
	}

	constructor() {
		this.goalTrigger = false;
		this.gameEnds = false;
		this.gameReset = false;
		this.racketPositionStartY = 298;
		this.racketPositionY = this.racketPositionStartY
	}

	imageControl(data: objPositions) {
		if (data.goalTriggerLeft == true || data.goalTriggerRight == true || this.gameReset == true) {
			if (this.gameReset == false) {
				this.goalTrigger = true;
			}
			this.explosion.y = data.ballY - 55;
			if (data.goalTriggerLeft == true) {
				this.explosion.x = data.ballX - 80;
			}
			else {
				this.explosion.x = data.ballX - 35;
			}	
			if (data.goalTriggerLeft == true || this.gameReset == true) {
				if (data.goalsRight == 1) {
					this.goalsRight.width = 56;
				}
				else {
					this.goalsRight.width = 101;
				}
				this.goalsRight.img.src = '../../../../assets/gameObjects/nbr' + data.goalsRight + '.png' ;
			}
			if (data.goalTriggerRight == true || this.gameReset == true) {
				if (data.goalsLeft == 1) {
					this.goalsLeft.width = 56;
				}
				else {
					this.goalsLeft.width = 101;
				}
				this.goalsLeft.img.src = '../../../../assets/gameObjects/nbr' + data.goalsLeft + '.png' ;
			}
			this.gameReset = false;
			setTimeout(() => {
				this.racketPositionY = this.racketPositionStartY;
				this.goalTrigger = false;
				if (data.goalsLeft >= 5 || data.goalsRight >= 5)
					this.gameEnds = true;
			}, 3000);
		}
	}

	radInDegrees(degrees: number): number {
		return (degrees * Math.PI / 180);
	}

	loadImages() {
		this.background.img.src = this.background.src;

		this.ball.img.src = this.ball.src;
		this.racketLeft.img.src = this.racketLeft.src;
		this.racketRight.img.src = this.racketRight.src;

		this.goal.img.src = this.goal.src;	
		this.explosion.img.src = this.explosion.src;
	
		this.goalsLeft.img.src = '../../../../assets/gameObjects/nbr0.png';	
		this.goalsRight.img.src = '../../../../assets/gameObjects/nbr0.png';
	
		this.result.img.src = this.result.src;
	}


}
