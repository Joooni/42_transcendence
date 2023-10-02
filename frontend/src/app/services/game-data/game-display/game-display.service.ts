import { Injectable } from '@angular/core';
import { gameData } from '../../../game/game-display/GameData'

import { User } from 'src/app/models/user';
import { UserDataService } from '../../user-data/user-data.service';

@Injectable({
  providedIn: 'root'
})

export class GameDisplayService {

	activeUser?: User;

	background = {
		width: 1024,
		height: 768,
		img: new Image
	}

	racketPositionY: number;
	racketPositionStartY: number;

	racketLeft = {
		racketLeftX: 20,
		width: 60,
		height: 160,
		img: new Image
	}


	racketRight = { 
		racketRightX: 944,
		width: 60,
		height: 160,
		img: new Image
	}

	ball = {
		width: 100,
		height: 100,
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

	result = {
		x: 232,
		y: 324,
		width: 560,
		height: 157,
		src : '../../../../assets/gameObjects/result.png',
		img: new Image
	}

	oppQuit = {
		x: 160,
		y: 524,
		width: 705,
		height: 41,
		src : '../../../../assets/gameObjects/oppQuit.png',
		img: new Image
	}

	plyQuit = {
		x: 241,
		y: 524,
		width: 542,
		height: 41,
		src : '../../../../assets/gameObjects/plyQuit.png',
		img: new Image
	}


	countdown = {
		x: 462,
		y: 324,
		width: 101,
		height: 156,
		img1: new Image,
		img2: new Image,
		img3: new Image
	}

	constructor(private userDataService: UserDataService,
	) {
		this.goalTrigger = false;
		this.gameEnds = false;
		this.racketPositionStartY = 298;
		this.racketPositionY = this.racketPositionStartY
	}

	restartService() {
		this.goalTrigger = false;
		this.gameEnds = false;
		this.racketPositionY = this.racketPositionStartY
		this.goalsRight.width = 101;
		this.goalsLeft.width = 101;
		this.countdown.width = 101;
	}


	async imageControl(data: gameData) {
		if (data.goalTriggerLeft == true || data.goalTriggerRight == true) {
			this.goalTrigger = true;
			this.explosion.y = data.ballY - 55;
			if (data.goalTriggerLeft == true) {
				this.explosion.x = data.ballX - 80;
			}
			else {
				this.explosion.x = data.ballX - 35;
			}	
			if (data.goalTriggerLeft == true) {
				if (data.goalsRight == 1) {
					this.goalsRight.width = 56;
				}
				else {
					this.goalsRight.width = 101;
				}
				this.goalsRight.img.src = '../../../../assets/gameObjects/nbr' + data.goalsRight + '.png' ;
			}
			if (data.goalTriggerRight == true) {
				if (data.goalsLeft == 1) {
					this.goalsLeft.width = 56;
				}
				else {
					this.goalsLeft.width = 101;
				}
				this.goalsLeft.img.src = '../../../../assets/gameObjects/nbr' + data.goalsLeft + '.png' ;
			}
			
			if (data.goalsLeft >= 5 || data.goalsRight >= 5) {
				this.gameEnds = true;
				setTimeout(() => {
					this.racketPositionY = this.racketPositionStartY;
					this.goalTrigger = false;
				}, 900);
			} else {
			setTimeout(() => {
					this.racketPositionY = this.racketPositionStartY;
					this.goalTrigger = false;
				}, 2900);
			}
		}
	}

	radInDegrees(degrees: number): number {
		return (degrees * Math.PI / 180);
	}

	async loadImages() {
		await this.userDataService.findSelf().then(async user => this.activeUser = user);
		var check = this.activeUser?.selectedMap;

		if (check == 2) {
			this.background.img.src = '../../../../assets/gameObjects/look1/hintergrund1.png';
			this.racketLeft.img.src = '../../../../assets/gameObjects/look1/banane_links.png';
			this.racketRight.img.src = '../../../../assets/gameObjects/look1/banane_rechts.png';
			this.ball.img.src = '../../../../assets/gameObjects/look1/DK_Fass1.png';
		} else {
			this.background.img.src = '../../../../assets/gameObjects/look2/hintergrund.png';
			this.racketLeft.img.src = '../../../../assets/gameObjects/look2/racket_left.png';
			this.racketRight.img.src = '../../../../assets/gameObjects/look2/racket_right.png';
			this.ball.img.src = '../../../../assets/gameObjects/look2/ball2.png';
		}

		this.countdown.img1.src = '../../../../assets/gameObjects/nbr1.png';
		this.countdown.img2.src = '../../../../assets/gameObjects/nbr2.png';
		this.countdown.img3.src = '../../../../assets/gameObjects/nbr3.png';
		

		this.goal.img.src = this.goal.src;	
		this.explosion.img.src = this.explosion.src;
	
		this.goalsLeft.img.src = '../../../../assets/gameObjects/nbr0.png';	
		this.goalsRight.img.src = '../../../../assets/gameObjects/nbr0.png';
	
		this.result.img.src = this.result.src;
		this.oppQuit.img.src = this.oppQuit.src;
		this.plyQuit.img.src = this.plyQuit.src;
		
	}


}
