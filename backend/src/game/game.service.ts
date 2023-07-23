import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Socket } from 'socket.io';
import { HttpService } from '@nestjs/axios';
import { Match } from './match.entity';
import { MatchService } from './match/match.service';
import { createMatch } from './create-match.input';
import { gameData, gameDataBE } from './match/GameData';

@Injectable()
export class GameService {

	playerWaitingID: number | undefined;
	gameDataMap: Map<number, gameData>;
	gameDataBEMap: Map<number, gameDataBE>
	room: number;

	constructor(
		@InjectRepository(Match) private readonly matchRepository: Repository<Match>,
		private readonly configService: ConfigService,
		private readonly httpService: HttpService,
		private matchService: MatchService)
		{
			this.room = 0;
			this.playerWaitingID = undefined;
			this.gameDataMap = new Map;
			this.gameDataBEMap = new Map;
		}

	checkForOpponent(userID: number, userSocket: Socket) : number | undefined {
		if (this.playerWaitingID === undefined) {
			this.playerWaitingID = userID;		
			while (this.gameDataMap.has(this.room)) {
				this.room++;
			}
			this.gameDataMap.set(this.room, {
				roomNbr: this.room,
				ballX: 472,
				ballY: 324,
				ballMoveSpeed: 10,
				ballMoveDegree: -90,
				racketLeftY: 298, 
				racketRightY: 298,
				goalTriggerLeft: false,
				goalTriggerRight: false,
				goalsRight: 0,
				goalsLeft: 0,
				leftUserID: userID,
				rightUserID: 0,
				gameEnds: false
			});
			this.gameDataBEMap.set(this.room, {	
				leftUserSocket: userSocket,
				rightUserSocket: undefined,
			});
			return (undefined);
		} else if (this.gameDataMap.get(this.room)!.leftUserID !== userID) {
			this.playerWaitingID = undefined;
			this.gameDataMap.get(this.room)!.rightUserID = userID;
			this.gameDataBEMap.get(this.room)!.rightUserSocket = userSocket;
			return (this.room);
		}
		return (undefined);
	}

	startMatch(gameData: gameData) : gameData {
		gameData = this.matchService.runGame(gameData);
		return (gameData);
	}




	// async createMatchDB(newMatch: createMatch): Promise<void> {
	// 	try {
	// 		await this.matchRepository.insert(newMatch = {
	// 			gameID: 1,
	// 			firstPlayer: "left",
	// 			secondPlayer: "right",
	// 			goalsFirstPlayer: 5,
	// 			goalsSecondPlayer: 0
	// 		});
	// 	} catch (error) {
	// 		if (!(error instanceof QueryFailedError)) 
	// 			return Promise.reject(error);
	// 		// const existingMatch: gameEnt[] = await this.gameRepository.find({where: { gfdsgfds }})
	// 	}
	// 	return Promise.resolve();
	// }

	async findAllMatches(): Promise<Match[]> {
		return this.matchRepository.find();
	}

	findMatchById(identifier: number): Promise<Match> {
		return this.matchRepository.findOneByOrFail({ gameID: identifier });
	}





}
