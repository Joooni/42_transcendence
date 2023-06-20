import { Injectable } from '@nestjs/common';
import { objPositions } from './objPositions'

@Injectable()
export class GameService {

	gameData: objPositions = {
		ballX: 472,
		ballY: 32,
		racketLeftX: 20,
		racketLeftY: 298,
		racketRightX: 944,
		racketRightY: 298
	}

	runGame() {
		return this.gameData;
	}
	
}
