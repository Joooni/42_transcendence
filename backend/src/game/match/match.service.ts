import { Injectable } from '@nestjs/common';
import { objPositions } from './objPositions';


@Injectable()
export class MatchService {

	gameData: objPositions = {
		ballX: 472,
		ballY: 324,
		racketLeftY: 298,
		racketRightY: 298,
		goalTriggerLeft: false,
		goalTriggerRight: false,
		goalsRight: 0,
		goalsLeft: 0,
		isPlayerLeft: true
	}

	ballMoveSpeed : number;
	ballMoveDegree : number;

	ball = {
		startX: 472,
		startY: 324,
	}

	racketRight = {
		startX: 944,
		startY: 298,
	}

	racketLeft = {
		startX: 20,
		startY: 298,
	}

	gameEnds: boolean;

	constructor() {
		this.ballMoveSpeed = 10;
		this.ballMoveDegree = -90;
		this.gameEnds = false;
	}

	runGame() {
		this.prepareAfterGoal();
		this.ballMovement();
		this.goalControl();
	}

	ballMovement() {
		var ballPosY : number = this.gameData.ballY + 100 / 2;							/* 100 == ball.height */
		var racketLeftPosY : number = this.gameData.racketLeftY + (160 / 2);			/* 160 == racketLeft.height*/
		var racketRightPosY  = this.gameData.racketRightY + (160 / 2);					/* 160 == racketRight.height*/

		if (this.gameData.ballY <= 5 || this.gameData.ballY >= 663)
			this.ballMoveDegree = 180 - this.ballMoveDegree;
		if (this.gameData.ballX <= 70) {
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
			else if (this.ballMoveDegree < 0) {
				this.gameData.goalTriggerLeft = true;
			}
			if (this.ballMoveSpeed < 70)
				this.ballMoveSpeed += 1;
		}
		if (this.gameData.ballX >= 854) {
			if (ballPosY >= racketRightPosY - 100 && ballPosY < racketRightPosY - 82)
				this.ballMoveDegree = -160;
			else if (ballPosY >= racketRightPosY - 82 && ballPosY < racketRightPosY - 64)
				this.ballMoveDegree = -146;	
			else if (ballPosY >= racketRightPosY - 64 && ballPosY < racketRightPosY - 46)
				this.ballMoveDegree = -132;
			else if (ballPosY >= racketRightPosY - 46 && ballPosY < racketRightPosY - 28)
				this.ballMoveDegree = -118; 
			else if (ballPosY >= racketRightPosY - 28 && ballPosY < racketRightPosY - 10)
				this.ballMoveDegree = -104; 
			else if (ballPosY >= racketRightPosY - 10 && ballPosY < racketRightPosY + 10)
				this.ballMoveDegree = -90;
			else if (ballPosY >= racketRightPosY + 10 && ballPosY < racketRightPosY + 28)
				this.ballMoveDegree = -76;
			else if (ballPosY >= racketRightPosY + 28 && ballPosY < racketRightPosY + 48)
				this.ballMoveDegree = -62; 
			else if (ballPosY >= racketRightPosY + 48 && ballPosY < racketRightPosY + 64)
				this.ballMoveDegree = -48;
			else if (ballPosY >= racketRightPosY + 64 && ballPosY < racketRightPosY + 82)
				this.ballMoveDegree = -34; 	
			else if (ballPosY >= racketRightPosY + 82 && ballPosY < racketRightPosY + 100)
				this.ballMoveDegree = -20;
			else if (this.ballMoveDegree > 0) {
				this.gameData.goalTriggerRight = true;
			}
			if (this.ballMoveSpeed < 70)
				this.ballMoveSpeed += 1;
		}
		if (this.gameData.ballX >= 0 && this.gameData.ballX <= 924) {
			this.gameData.ballX += Math.sin(this.radInDegrees(this.ballMoveDegree)) * this.ballMoveSpeed;
			this.gameData.ballY += Math.cos(this.radInDegrees(this.ballMoveDegree)) * this.ballMoveSpeed;
		}
	}

	radInDegrees(degrees: number): number {
		return (degrees * Math.PI / 180);
	}
	
	goalControl() {
		if (this.gameData.goalTriggerLeft == true || this.gameData.goalTriggerRight == true) {
			this.ballMoveSpeed = 0;				
			if (this.gameData.goalTriggerLeft == true) {
				this.gameData.goalsRight++;
				this.ballMoveDegree = -90;
			}
			if (this.gameData.goalTriggerRight == true) {
				this.gameData.goalsLeft++;
				this.ballMoveDegree = 90;
			}
			setTimeout(() => {
				if (this.gameData.goalsLeft < 5 && this.gameData.goalsRight < 5) {
					this.ballMoveSpeed = 10;
				}
				else {
					this.gameEnds = true;
				}
			}, 3000);
		}
	}


	prepareAfterGoal() {
		if (this.gameData.goalTriggerLeft == true || this.gameData.goalTriggerRight == true) {
			this.gameData.ballX = this.ball.startX;
			this.gameData.ballY = this.ball.startY;
			this.gameData.goalTriggerLeft = false;
			this.gameData.goalTriggerRight = false;	
		}
	}

	resetGame() {
		this.gameData.ballX = 472,
		this.gameData.ballY = 324,
		this.gameData.racketLeftY = 298,
		this.gameData.racketRightY = 298,
		this.gameData.goalTriggerLeft = false,
		this.gameData.goalTriggerRight = false,
		this.gameData.goalsRight = 0,
		this.gameData.goalsLeft = 0,
		this.gameData.isPlayerLeft = true
	}
}
