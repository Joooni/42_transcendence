import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Socket, Server } from 'socket.io';
import { HttpService } from '@nestjs/axios';
import { Match } from './entitites/match.entity';
import { MatchService } from './match/match.service';
import { gameData, gameDataBE, onGoingGamesData } from './match/GameData';
import { UsersService } from 'src/users/users.service';
import { matches } from 'class-validator';
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

  startMatch(roomNbr: number, server: Server) {
    this.intervalRunGame = setInterval(() => {
      this.matchService.runGame(this.gameDataMap.get(roomNbr!)!);
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
        this.gameDataBEMap.delete(roomNbr!);
        this.gameDataMap.delete(roomNbr!);
      }
    }, 1000 / 25);
  }

  startCountdown(roomNbr: number, server: Server) {
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
          this.startMatch(roomNbr, server);
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
        this.gameDataMap.get(room)!.rightUserID != 0
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

  userLeftGame(server: Server, activeUserID: number, roomNbr: number) {
    console.log(
      'user with id:   ',
      activeUserID,
      '    leaved the game in room:   ',
      roomNbr,
      '   . We have to add the behaviour here.',
    );
  }

  async createMatchDB(
    firstPlayer: number,
    secondPlayer: number,
    goalsFirstPlayer: number,
    goalsSecondPlayer: number,
  ): Promise<void> {
    try {
      const match = new Match();
      match.firstPlayer = await this.usersService.findOne(firstPlayer);
      match.secondPlayer = await this.usersService.findOne(secondPlayer);
      match.goalsFirstPlayer = goalsFirstPlayer;
      match.goalsSecondPlayer = goalsSecondPlayer;
      const obj = await this.usersService.calcXP(
        match.firstPlayer.id,
        match.goalsFirstPlayer,
        match.secondPlayer.id,
        match.goalsSecondPlayer,
      );
      match.xpFirstPlayer = obj.player1xp;
      match.xpSecondPlayer = obj.player2xp;
      if (match.goalsFirstPlayer > match.goalsSecondPlayer) {
        match.firstPlayer.wins += 1;
        match.secondPlayer.losses += 1;
      }
      else {
        match.secondPlayer.wins += 1;
        match.firstPlayer.losses += 1;
      }
      await this.matchRepository.insert(match);
      await this.userRepository.save(match.firstPlayer);
      await this.userRepository.save(match.secondPlayer);
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
