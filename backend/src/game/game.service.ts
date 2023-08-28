import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Socket, Server } from 'socket.io';
import { HttpService } from '@nestjs/axios';
import { Match } from './entitites/match.entity';
import { MatchService } from './match/match.service';
import { gameData, gameDataBE,onGoingGamesData } from './match/GameData';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GameService {
  playerWaitingID: number | undefined;
  gameDataMap: Map<number, gameData>;
  gameDataBEMap: Map<number, gameDataBE>;
  room: number;
  intervalRunGame: any;


  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private matchService: MatchService,
	private usersService: UsersService
  ) {
    this.room = 0;
    this.playerWaitingID = undefined;
    this.gameDataMap = new Map();
    this.gameDataBEMap = new Map();
  }

  checkForOpponent(userID: number, userSocket: Socket): number | undefined {
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
        gameEnds: false,
      });
      this.gameDataBEMap.set(this.room, {
        leftUserSocket: userSocket,
        rightUserSocket: undefined,
      });
      return undefined;
    } else if (this.gameDataMap.get(this.room)!.leftUserID !== userID) {
      this.playerWaitingID = undefined;
      this.gameDataMap.get(this.room)!.rightUserID = userID;
      this.gameDataBEMap.get(this.room)!.rightUserSocket = userSocket;
      return this.room;
    }
    return undefined;
  }

  startWithGameRequest(gameRequestSenderID: number, gameRequestSenderSocket: Socket, gameRequestRecepientID: number, gameRequestRecepientSocket: Socket) : number {
	var room : number = 0; 
	while (this.gameDataMap.has(room)) {
        room++;
    }
	this.gameDataMap.set(room, {
		roomNbr: room,
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
		leftUserID: gameRequestSenderID,
		rightUserID: gameRequestRecepientID,
		gameEnds: false,
	});
	this.gameDataBEMap.set(room, {
		leftUserSocket: gameRequestSenderSocket,
		rightUserSocket: gameRequestRecepientSocket,
	});
	return room;
  }


  startMatch(roomNbr: number, server: Server) {
	this.gameDataBEMap.get(roomNbr)?.leftUserSocket.join(roomNbr.toString());
	this.gameDataBEMap.get(roomNbr)?.rightUserSocket!.join(roomNbr.toString());
	console.log('The game with id:  ', roomNbr, '   is running');
	this.intervalRunGame = setInterval(() => {
		this.matchService.runGame(this.gameDataMap.get(roomNbr!)!);
		server.to(roomNbr!.toString()).emit('getGameData', this.gameDataMap.get(roomNbr!)!);
		if (this.gameDataMap.get(roomNbr!)!.gameEnds === true) {
			clearInterval(this.intervalRunGame);
			//console.log(this.gameDataMap.get(roomNbr!));
			this.createMatchDB(this.gameDataMap.get(roomNbr!)?.leftUserID!, this.gameDataMap.get(roomNbr!)?.rightUserID!, this.gameDataMap.get(roomNbr!)!.goalsLeft!, this.gameDataMap.get(roomNbr!)!.goalsRight!);
			this.gameDataBEMap.get(roomNbr!)?.leftUserSocket.leave(roomNbr!.toString());
			this.gameDataBEMap.get(roomNbr!)?.rightUserSocket!.leave(roomNbr!.toString());
			console.log('The game with id:  ', roomNbr,'   is over. The users with id:  ', this.gameDataMap.get(roomNbr!)?.leftUserID,
			'  and  ', this.gameDataMap.get(roomNbr!)?.rightUserID, 'left.',
			);
			this.gameDataBEMap.delete(roomNbr!);
			this.gameDataMap.delete(roomNbr!);
		}
	}, 1000 / 25);
  }

  

//   onGoingGames() {
// 	var room = 0;
// 	var oGGData : onGoingGamesData[] = new Array;
// 	while (room <= 50) {
// 		if (this.gameDataMap.has(room)) {
// 			oGGData.push({
// 				roomNbr: this.gameDataMap.get(room)!.roomNbr,
// 				leftUserID: this.gameDataMap.get(room)!.leftUserID,
// 				rightUserID: this.gameDataMap.get(room)!.rightUserID,
// 				goalsLeft: this.gameDataMap.get(room)!.goalsLeft,
// 				goalsRight: this.gameDataMap.get(room)!.goalsRight	
// 			})
// 		}
// 		room++;
//       }
//   }

  async createMatchDB(firstPlayer: number, secondPlayer: number, goalsFirstPlayer: number, goalsSecondPlayer: number): Promise<void> {
	
  	try {
      const match = new Match()
      match.firstPlayer = await this.usersService.findOne(firstPlayer);
      match.secondPlayer = await this.usersService.findOne(secondPlayer);
      match.goalsFirstPlayer = goalsFirstPlayer;
      match.goalsSecondPlayer = goalsSecondPlayer;
      this.matchRepository.insert(match);
  	} catch (error) {
		  console.log("Error while pushing match in Database", error);
  	}
  	return Promise.resolve();
  }

  async findAllMatches(): Promise<Match[]> {
    return this.matchRepository.createQueryBuilder('match')
	.leftJoinAndSelect('match.firstPlayer', 'firstPlayer').leftJoinAndSelect('match.secondPlayer', 'secondPlayer').getMany();
  }

  findMatchById(identifier: number): Promise<Match> {
    return this.matchRepository.findOneByOrFail({ gameID: identifier });
  }
}
