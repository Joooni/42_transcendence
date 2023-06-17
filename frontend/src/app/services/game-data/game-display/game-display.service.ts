import { Injectable } from '@angular/core';
import { objPositions } from './objPositions'
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

	racketLeft = {
		startX: 20,
		startY: 298,
		width: 60,
		height: 160,
		src : '../../../../assets/gameObjects/banane_links.png',
		img: new Image
	}

	racketRight = {
		startX: 944,
		startY: 298, 
		width: 60,
		height: 160,
		src : '../../../../assets/gameObjects/banane_rechts.png',
		img: new Image
	}

	ball = {
		startX: 472,
		startY: 324,
		width: 100,
		height: 100,
		src : '../../../../assets/gameObjects/DK_Fass1.png',
		img: new Image
	}

	ballMoveSpeed : number;
	ballMoveDegree : number;

	positions = {
		ballX: 472,
		ballY: 324,
		racketLeftX: 20,
		racketLeftY: 298,
		racketRightX: 944,
		racketRightY: 298
	};

	goalTriggerLeft : boolean;
	goalTriggerRight : boolean;
	goalTrigger : boolean;

	goal = {
		x: 156,
		y: 324,
		width: 712,
		height: 163,
		src : '../../../../assets/gameObjects/goal.png',
		img: new Image
	}
	
	goalsLeft = {
		count: 0,
		x: 206,
		y: 101,
		width: 101,
		height: 156,
		img: new Image
	}
	
	goalsRight = {
		count: 0,
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

	gameEnds : boolean;

	result = {
		x: 232,
		y: 324,
		width: 560,
		height: 157,
		src : '../../../../assets/gameObjects/result.png',
		img: new Image
	}

	constructor() {
		this.ballMoveSpeed = 10;
		this.ballMoveDegree = -90;

		this.goalTriggerLeft = false;
		this.goalTriggerRight = false;
		this.goalTrigger = false;

		this.gameEnds = false;
	}

	gameControl() {
		if (this.goalTriggerLeft == true || this.goalTriggerRight == true) {
			this.explosion.y = this.positions.ballY - 50;
			if (this.goalTriggerLeft == true)
				this.explosion.x = this.positions.ballX - 100; 
			else 
				this.explosion.x = this.positions.ballX; 
			this.goalTrigger = true;
			this.ballMoveSpeed = 0;
			this.positions.ballX = this.ball.startX;
			this.positions.ballY =  this.ball.startY;				
			if (this.goalTriggerLeft == true) {
				this.goalsRight.count++;
				if (this.goalsRight.count == 1) {
					this.goalsRight.width = 56;
				}
				else {
					this.goalsRight.width = 101;
				}
				this.goalsRight.img.src = '../../../../assets/gameObjects/nbr' + this.goalsRight.count + '.png' ;
				this.ballMoveDegree = -90;
			}
			if (this.goalTriggerRight == true) {
				this.goalsLeft.count++;
				if (this.goalsLeft.count == 1) {
					this.goalsLeft.width = 56;
				}
				else {
					this.goalsLeft.width = 101;
				}
				this.goalsLeft.img.src = '../../../../assets/gameObjects/nbr' + this.goalsLeft.count + '.png' ;
				this.ballMoveDegree = 90;
			}
			this.goalTriggerLeft = false;
			this.goalTriggerRight = false;

			setTimeout(() => {
				this.goalTrigger = false;
				this.positions.racketLeftY = this.racketLeft.startY;
				if (this.goalsLeft.count < 5 && this.goalsRight.count < 5)
					this.ballMoveSpeed = 10;
				else
					this.gameEnds = true;
			}, 3000);
		}
	}

	ballMovement() {
		var ballPosY : number = this.positions.ballY + this.ball.height / 2;
		var racketLeftPosY : number = this.positions.racketLeftY + (this.racketLeft.height / 2);
		var raracketRightPosY  = this.positions.racketRightY + (this.racketRight.height / 2);

		if (this.positions.ballY <= 5 || this.positions.ballY >= 663)
			this.ballMoveDegree = 180 - this.ballMoveDegree;
		if (this.positions.ballX <= 70) {
			if (ballPosY >= racketLeftPosY - 100 && ballPosY < racketLeftPosY - 82)
				this.ballMoveDegree = 160;
			else if (ballPosY >= racketLeftPosY - 82 && ballPosY < racketLeftPosY - 64)
				{this.ballMoveDegree = 146;} 	
			else if (ballPosY >= racketLeftPosY - 64 && ballPosY < racketLeftPosY - 46)
				this.ballMoveDegree = 132;
			else if (ballPosY >= racketLeftPosY - 46 && ballPosY < racketLeftPosY - 28)
				this.ballMoveDegree = 118; 
			else if (ballPosY >= racketLeftPosY - 28 && ballPosY < racketLeftPosY - 10)
				this.ballMoveDegree = 104; 
			else if (ballPosY >= racketLeftPosY - 10 && ballPosY < racketLeftPosY + 10)
				this.ballMoveDegree = 90;
			else if (ballPosY >= racketLeftPosY + 10 && ballPosY < racketLeftPosY + 28)
				this.ballMoveDegree = 76;
			else if (ballPosY >= racketLeftPosY + 28 && ballPosY < racketLeftPosY + 48)
				this.ballMoveDegree = 62; 
			else if (ballPosY >= racketLeftPosY + 48 && ballPosY < racketLeftPosY + 64)
				this.ballMoveDegree = 48;
			else if (ballPosY >= racketLeftPosY + 64 && ballPosY < racketLeftPosY + 82)
				this.ballMoveDegree = 34; 	
			else if (ballPosY >= racketLeftPosY + 82 && ballPosY < racketLeftPosY + 100)
				this.ballMoveDegree = 20;
			else if (this.ballMoveDegree < 0)
				this.goalTriggerLeft = true;
			if (this.ballMoveSpeed < 70)
				this.ballMoveSpeed += 1;
		}
		if (this.positions.ballX >= 854) {
			if (ballPosY >= raracketRightPosY - 100 && ballPosY < raracketRightPosY - 82)
				this.ballMoveDegree = -160;
			else if (ballPosY >= raracketRightPosY - 82 && ballPosY < raracketRightPosY - 64)
				this.ballMoveDegree = -146;	
			else if (ballPosY >= raracketRightPosY - 64 && ballPosY < raracketRightPosY - 46)
				this.ballMoveDegree = -132;
			else if (ballPosY >= raracketRightPosY - 46 && ballPosY < raracketRightPosY - 28)
				this.ballMoveDegree = -118; 
			else if (ballPosY >= raracketRightPosY - 28 && ballPosY < raracketRightPosY - 10)
				this.ballMoveDegree = -104; 
			else if (ballPosY >= raracketRightPosY - 10 && ballPosY < raracketRightPosY + 10)
				this.ballMoveDegree = -90;
			else if (ballPosY >= raracketRightPosY + 10 && ballPosY < raracketRightPosY + 28)
				this.ballMoveDegree = -76;
			else if (ballPosY >= raracketRightPosY + 28 && ballPosY < raracketRightPosY + 48)
				this.ballMoveDegree = -62; 
			else if (ballPosY >= raracketRightPosY + 48 && ballPosY < raracketRightPosY + 64)
				this.ballMoveDegree = -48;
			else if (ballPosY >= raracketRightPosY + 64 && ballPosY < raracketRightPosY + 82)
				this.ballMoveDegree = -34; 	
			else if (ballPosY >= raracketRightPosY + 82 && ballPosY < raracketRightPosY + 100)
				this.ballMoveDegree = -20;
			else if (this.ballMoveDegree > 0)
				this.goalTriggerRight = true;
			if (this.ballMoveSpeed < 70)
				this.ballMoveSpeed += 1;
		}
		if (this.positions.ballX >= 0 && this.positions.ballX <= 924) {
			this.positions.ballX += Math.sin(this.radInDegrees(this.ballMoveDegree)) * this.ballMoveSpeed;
			this.positions.ballY += Math.cos(this.radInDegrees(this.ballMoveDegree)) * this.ballMoveSpeed;
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
