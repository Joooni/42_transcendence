import { Injectable } from '@nestjs/common';
import { gameData } from './GameData';

@Injectable()
export class MatchService {
  ball = {
    startX: 472,
    startY: 324,
  };

  racketRight = {
    startX: 944,
    startY: 298,
  };

  racketLeft = {
    startX: 20,
    startY: 298,
  };

  //constructor() {}


  runGame(gameData: gameData): gameData {
	if (gameData.userQuit != undefined) {
		gameData = this.userLeft(gameData);
	} else {
		gameData = this.prepareAfterGoal(gameData);
		gameData = this.ballMovement(gameData);
	}
	gameData = this.goalControl(gameData);

    return gameData;
  }



  ballMovement(gameData: gameData): gameData {
    const ballPosY: number = gameData.ballY + 100 / 2; /* 100 == ball.height */
    const racketLeftPosY: number =
      gameData.racketLeftY + 160 / 2; /* 160 == racketLeft.height*/
    const racketRightPosY =
      gameData.racketRightY + 160 / 2; /* 160 == racketRight.height*/

    if (gameData.ballY <= 5 || gameData.ballY >= 663)
      gameData.ballMoveDegree = 180 - gameData.ballMoveDegree;
    if (gameData.ballX <= 70) {
      if (ballPosY >= racketLeftPosY - 100 && ballPosY < racketLeftPosY - 82)
        gameData.ballMoveDegree = 160;
      else if (
        ballPosY >= racketLeftPosY - 82 &&
        ballPosY < racketLeftPosY - 64
      ) {
        gameData.ballMoveDegree = 146;
      } else if (
        ballPosY >= racketLeftPosY - 64 &&
        ballPosY < racketLeftPosY - 46
      )
        gameData.ballMoveDegree = 132;
      else if (
        ballPosY >= racketLeftPosY - 46 &&
        ballPosY < racketLeftPosY - 28
      )
        gameData.ballMoveDegree = 118;
      else if (
        ballPosY >= racketLeftPosY - 28 &&
        ballPosY < racketLeftPosY - 10
      )
        gameData.ballMoveDegree = 104;
      else if (
        ballPosY >= racketLeftPosY - 10 &&
        ballPosY < racketLeftPosY + 10
      )
        gameData.ballMoveDegree = 90;
      else if (
        ballPosY >= racketLeftPosY + 10 &&
        ballPosY < racketLeftPosY + 28
      )
        gameData.ballMoveDegree = 76;
      else if (
        ballPosY >= racketLeftPosY + 28 &&
        ballPosY < racketLeftPosY + 48
      )
        gameData.ballMoveDegree = 62;
      else if (
        ballPosY >= racketLeftPosY + 48 &&
        ballPosY < racketLeftPosY + 64
      )
        gameData.ballMoveDegree = 48;
      else if (
        ballPosY >= racketLeftPosY + 64 &&
        ballPosY < racketLeftPosY + 82
      )
        gameData.ballMoveDegree = 34;
      else if (
        ballPosY >= racketLeftPosY + 82 &&
        ballPosY < racketLeftPosY + 100
      )
        gameData.ballMoveDegree = 20;
      else if (gameData.ballMoveDegree < 0 || gameData.ballMoveDegree > 180) {
        gameData.goalTriggerLeft = true;
      }
      if (gameData.ballMoveSpeed < 50) gameData.ballMoveSpeed += 1;
    }
    if (gameData.ballX >= 854) {
      if (ballPosY >= racketRightPosY - 100 && ballPosY < racketRightPosY - 82)
        gameData.ballMoveDegree = -160;
      else if (
        ballPosY >= racketRightPosY - 82 &&
        ballPosY < racketRightPosY - 64
      )
        gameData.ballMoveDegree = -146;
      else if (
        ballPosY >= racketRightPosY - 64 &&
        ballPosY < racketRightPosY - 46
      )
        gameData.ballMoveDegree = -132;
      else if (
        ballPosY >= racketRightPosY - 46 &&
        ballPosY < racketRightPosY - 28
      )
        gameData.ballMoveDegree = -118;
      else if (
        ballPosY >= racketRightPosY - 28 &&
        ballPosY < racketRightPosY - 10
      )
        gameData.ballMoveDegree = -104;
      else if (
        ballPosY >= racketRightPosY - 10 &&
        ballPosY < racketRightPosY + 10
      )
        gameData.ballMoveDegree = -90;
      else if (
        ballPosY >= racketRightPosY + 10 &&
        ballPosY < racketRightPosY + 28
      )
        gameData.ballMoveDegree = -76;
      else if (
        ballPosY >= racketRightPosY + 28 &&
        ballPosY < racketRightPosY + 48
      )
        gameData.ballMoveDegree = -62;
      else if (
        ballPosY >= racketRightPosY + 48 &&
        ballPosY < racketRightPosY + 64
      )
        gameData.ballMoveDegree = -48;
      else if (
        ballPosY >= racketRightPosY + 64 &&
        ballPosY < racketRightPosY + 82
      )
        gameData.ballMoveDegree = -34;
      else if (
        ballPosY >= racketRightPosY + 82 &&
        ballPosY < racketRightPosY + 100
      )
        gameData.ballMoveDegree = -20;
      else if (gameData.ballMoveDegree > 0) {
        gameData.goalTriggerRight = true;
      }
      if (gameData.ballMoveSpeed < 70) gameData.ballMoveSpeed += 1;
    }
    if (gameData.ballX >= 0 && gameData.ballX <= 924) {
      gameData.ballX +=
        Math.sin(this.radInDegrees(gameData.ballMoveDegree)) *
        gameData.ballMoveSpeed;
      gameData.ballY +=
        Math.cos(this.radInDegrees(gameData.ballMoveDegree)) *
        gameData.ballMoveSpeed;
    }
    return gameData;
  }

  radInDegrees(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  userLeft(gameData: gameData): gameData {
	if (gameData.userQuit === gameData.rightUserID) {
		gameData.goalsLeft = 4;
		gameData.goalTriggerRight = true;
	} else {
		gameData.goalsRight = 4;
		gameData.goalTriggerLeft = true;
	}
	return gameData;	
  }

  goalControl(gameData: gameData): gameData {
    if (gameData.goalTriggerLeft == true || gameData.goalTriggerRight == true) {
      gameData.ballMoveSpeed = 0;
      if (gameData.goalTriggerLeft == true) {
        gameData.goalsRight++;
        gameData.ballMoveDegree = -90;
      }
      if (gameData.goalTriggerRight == true) {
        gameData.goalsLeft++;
        gameData.ballMoveDegree = 90;
      }
      setTimeout(() => {
        if (gameData.goalsLeft < 5 && gameData.goalsRight < 5) {
          gameData.ballMoveSpeed = 10;
        } else {
          gameData.gameEnds = true;
        }
      }, 3000);
    }
    return gameData;
  }

  prepareAfterGoal(gameData: gameData): gameData {
    if (gameData.goalTriggerLeft == true || gameData.goalTriggerRight == true) {
      gameData.ballX = this.ball.startX;
      gameData.ballY = this.ball.startY;
      gameData.goalTriggerLeft = false;
      gameData.goalTriggerRight = false;
    }
    return gameData;
  }

  resetGame(gameData: gameData) {
    (gameData.ballX = 472),
      (gameData.ballY = 324),
      (gameData.racketLeftY = 298),
      (gameData.racketRightY = 298),
      (gameData.goalTriggerLeft = false),
      (gameData.goalTriggerRight = false),
      (gameData.goalsRight = 0),
      (gameData.goalsLeft = 0);
  }
}
