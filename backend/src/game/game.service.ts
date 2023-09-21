import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Socket, Server } from 'socket.io';
import { HttpService } from '@nestjs/axios';
import { Match } from './entitites/match.entity';
import { MatchService } from './match/match.service';
import { gameData, gameDataBE, onGoingGamesData } from './match/GameData';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private matchService: MatchService,
    private usersService: UsersService,
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
        usersWatching: new Array<Socket>(),
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

  startWithGameRequest(
    gameRequestSenderID: number,
    gameRequestSenderSocket: Socket,
    gameRequestRecepientID: number,
    gameRequestRecepientSocket: Socket,
  ): number {
    let room = 0;
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
      usersWatching: new Array<Socket>(),
    });
    return room;
  }

  startMatch(roomNbr: number, server: Server, gameMode: number) {
    this.intervalRunGame = setInterval(() => {
      this.matchService.runGame(this.gameDataMap.get(roomNbr!)!, gameMode);
      server
        .to(roomNbr!.toString())
        .emit('getGameData', this.gameDataMap.get(roomNbr!)!);
      if (this.gameDataMap.get(roomNbr!)!.gameEnds === true) {
        clearInterval(this.intervalRunGame);
        //console.log(this.gameDataMap.get(roomNbr!));
        this.createMatchDB(
          this.gameDataMap.get(roomNbr!)!.leftUserID!,
          this.gameDataMap.get(roomNbr!)!.rightUserID!,
          this.gameDataMap.get(roomNbr!)!.goalsLeft!,
          this.gameDataMap.get(roomNbr!)!.goalsRight!,
        );

		if (this.gameDataMap.get(roomNbr!)!.userQuit !== this.gameDataMap.get(roomNbr!)!.rightUserID) {
			this.usersService.updateStatus(this.gameDataMap.get(roomNbr!)!.rightUserID, "online");
			server.emit('updateUser', {
				id: this.gameDataMap.get(roomNbr!)!.rightUserID,
				status: "online",
			  });
		}
		if (this.gameDataMap.get(roomNbr!)!.userQuit !== this.gameDataMap.get(roomNbr!)!.leftUserID) {
			this.usersService.updateStatus(this.gameDataMap.get(roomNbr!)!.leftUserID, "online");
			server.emit('updateUser', {
				id: this.gameDataMap.get(roomNbr!)!.leftUserID,
				status: "online",
			  });
		}

        this.gameDataBEMap
          .get(roomNbr!)!
          .leftUserSocket.leave(roomNbr!.toString());
        this.gameDataBEMap
          .get(roomNbr!)!
          .rightUserSocket!.leave(roomNbr!.toString());
        while (
          this.gameDataBEMap.get(roomNbr)!.usersWatching &&
          this.gameDataBEMap.get(roomNbr)!.usersWatching.length! > 0
        ) {
          this.gameDataBEMap
            .get(roomNbr)
            ?.usersWatching.at(0)
            ?.leave(roomNbr!.toString());
          this.gameDataBEMap.get(roomNbr)?.usersWatching.shift();
        }
        console.log(
          'The game with id:  ',
          roomNbr,
          '   is over. The users with id:  ',
          this.gameDataMap.get(roomNbr!)?.leftUserID,
          '  and  ',
          this.gameDataMap.get(roomNbr!)?.rightUserID,
          'left.',
        );

		setTimeout(() => {
			this.gameDataBEMap.delete(roomNbr!);
       		this.gameDataMap.delete(roomNbr!);
		  }, 1000)

      }
    }, 1000 / 25);
  }

  async startCountdown(roomNbr: number, server: Server, gameMode: number) {
    this.gameDataBEMap.get(roomNbr)?.leftUserSocket.join(roomNbr.toString());
    this.gameDataBEMap.get(roomNbr)?.rightUserSocket!.join(roomNbr.toString());
    console.log('The game with id:  ', roomNbr, '   is running');
    server
      .to(roomNbr!.toString())
      .emit('getGameData', this.gameDataMap.get(roomNbr!)!);
    setTimeout(() => {
      server
        .to(roomNbr!.toString())
        .emit('getGameData', this.gameDataMap.get(roomNbr!)!);
      setTimeout(() => {
        server
          .to(roomNbr!.toString())
          .emit('getGameData', this.gameDataMap.get(roomNbr!)!);
        setTimeout(() => {
          this.startMatch(roomNbr, server, gameMode);
        }, 1000);
      }, 1000);
    }, 1000);
  }

  joinWatchGame(roomNbr: number, userSocket: Socket) {
    userSocket.join(roomNbr.toString());
    this.gameDataBEMap.get(roomNbr)?.usersWatching.push(userSocket);
  }

  leaveWatchGame(roomNbr: number, userSocket: Socket) {
    userSocket.leave(roomNbr.toString());
    this.gameDataBEMap.get(roomNbr)!.usersWatching = this.gameDataBEMap
      .get(roomNbr)!
      .usersWatching.filter((item) => item != userSocket);
  }
  

  async sendOngoingGames(server: Server) {
    let room = 0;
    const oGGData: onGoingGamesData[] = [];
    while (room <= 50) {
      if (
        this.gameDataMap.has(room) &&
        this.gameDataMap.get(room)!.rightUserID != 0 &&
		this.gameDataMap.get(room)!.gameEnds == false
      ) {
        oGGData.push({
          roomNbr: this.gameDataMap.get(room)!.roomNbr,
          leftUserID: this.gameDataMap.get(room)!.leftUserID,
          leftUserName: (
            await this.usersService.findOne(
              this.gameDataMap.get(room)!.leftUserID,
            )
          ).username,
          rightUserID: this.gameDataMap.get(room)!.rightUserID,
          rightUserName: (
            await this.usersService.findOne(
              this.gameDataMap.get(room)!.rightUserID,
            )
          ).username,
          goalsLeft: this.gameDataMap.get(room)!.goalsLeft,
          goalsRight: this.gameDataMap.get(room)!.goalsRight,
        });
      }
      room++;
    }
    server.emit('sendOngoingGames', oGGData);
  }

  exitRoomsAfterSocketDiscon(user: User) {
    let key: number;
    let value: gameData;
    for ([key, value] of this.gameDataMap.entries()) {
      if (value.leftUserID == user.id) {
        // console.log("The socket was in room", key, value);
        this.userLeftGame(user.id, key);
      }
      if (value.rightUserID == user.id) {
        // console.log("The socket was in room", key, value);
        this.userLeftGame(user.id, key);
      }
    }
  }

  userLeftGame(activeUserID: number, roomNbr: number) {
    console.log(
      'user with id:   ',
      activeUserID,
      '    leaved the game in room:   ',
      roomNbr,
    );
    this.gameDataMap.get(roomNbr)!.userQuit = activeUserID;
    // Achievement: Ragequit
    this.usersService.updateAchievements(activeUserID, 6);
  }

  async createMatchDB(
    firstPlayerId: number,
    secondPlayerId: number,
    goalsFirstPlayer: number,
    goalsSecondPlayer: number,
  ): Promise<void> {
    try {
      const match = new Match();
      const firstPlayer = await this.usersService.findOne(firstPlayerId);
      const secondPlayer = await this.usersService.findOne(secondPlayerId);
      match.goalsFirstPlayer = goalsFirstPlayer;
      match.goalsSecondPlayer = goalsSecondPlayer;
      const obj = await this.usersService.calcXP(
        firstPlayer,
        match.goalsFirstPlayer,
        secondPlayer,
        match.goalsSecondPlayer,
      );
      match.xpFirstPlayer = obj.player1xp;
      match.xpSecondPlayer = obj.player2xp;
      firstPlayer.xp += obj.player1xp;
      secondPlayer.xp += obj.player2xp;
      // First player wins
      if (match.goalsFirstPlayer > match.goalsSecondPlayer) {
        // Achievement: Destroyed the enemy
        if (
          match.goalsSecondPlayer == 0 &&
          !firstPlayer.achievements.includes(2)
        ) {
          firstPlayer.achievements.push(2);
        }
        firstPlayer.wins += 1;
        secondPlayer.losses += 1;
        // Achievement: won 5 games
        if (firstPlayer.wins >= 5 && !firstPlayer.achievements.includes(3)) {
          firstPlayer.achievements.push(3);
        }
      }
      // Second player wins
      else {
        // Achievement: Destroyed the enemy
        if (
          match.goalsFirstPlayer == 0 &&
          !secondPlayer.achievements.includes(2)
        ) {
          secondPlayer.achievements.push(2);
        }
        secondPlayer.wins += 1;
        firstPlayer.losses += 1;
        // Achievement: won 5 games
        if (firstPlayer.wins >= 5 && !firstPlayer.achievements.includes(3)) {
          firstPlayer.achievements.push(3);
        }
      }
      match.firstPlayer = firstPlayer;
      match.secondPlayer = secondPlayer;
      await this.userRepository.save(firstPlayer);
      await this.userRepository.save(secondPlayer);
      await this.matchRepository.save(match);
      await this.usersService.updateRanksByXP();
    } catch (error) {
      console.log('Error while pushing match in Database', error);
    }
    return Promise.resolve();
  }

  async findAllMatches(): Promise<Match[]> {
    return this.matchRepository
      .createQueryBuilder('match')
      .leftJoinAndSelect('match.firstPlayer', 'firstPlayer')
      .leftJoinAndSelect('match.secondPlayer', 'secondPlayer')
      .getMany();
  }

  findMatchById(identifier: number): Promise<Match> {
    return this.matchRepository.findOneByOrFail({ gameID: identifier });
  }

  async findMatchesByPlayerId(identifier: number): Promise<Match[]> {
    const matches = await this.matchRepository
      .createQueryBuilder('match')
      .where('match.firstPlayer = :firstid', { firstid: identifier })
      .orWhere('match.secondPlayer = :secondid', { secondid: identifier })
      .leftJoinAndSelect('match.firstPlayer', 'firstPlayer')
      .leftJoinAndSelect('match.secondPlayer', 'secondPlayer')
      .orderBy('match.timestamp', 'DESC')
      .getMany();
    return matches;
  }
}
