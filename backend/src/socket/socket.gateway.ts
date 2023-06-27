import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { Message } from 'src/messages/entities/message.entity';
import { MessageObj } from 'src/objects/message';
import { User } from "src/objects/user";
import { UsersService } from 'src/users/users.service';
import { Inject } from '@nestjs/common';
import { MessagesService } from 'src/messages/messages.service';
import { Any } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { GameModule } from '../game/game.module';
import { GameService } from 'src/game/game.service';

@WebSocketGateway({cors: 'http://localhost:80'})
export class SocketGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  intervalRunGame : any;
  
  constructor(
    private readonly messagesService: MessagesService,
    private readonly usersService: UsersService,
    private gameService: GameService
    ) {}

  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('SocketGateway initialized');
  }

  async handleConnection(client: Socket) {
    client.emit('identify');
    console.log('SocketClient connected:', client.id);
    //Save client.id in database user
    //set user status to online
  }

  async handleDisconnect(client: Socket) {
    console.log('SocketClient disconnected:', client.id);
    let user = await this.usersService.findOnebySocketId(client.id);
    this.usersService.updateSocketId(user.id, '');
    //Function does not exist yet:
    //this.usersService.updateStatus(userid, 'online');

    //Delete client.id from database user
    //set user status to offline
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, message: MessageObj): void {
    this.messagesService.receiveMessage(client, message);
  }

  @SubscribeMessage('identify')
  identifyUser(client: Socket, userid: number | undefined): void {
    if (typeof userid !== 'undefined') {
      console.log('SocketId will be updated in database', userid);
      this.usersService.updateSocketId(userid, client.id);
      //Function does not exist yet:
      //this.usersService.updateStatus(userid, 'online');
    }
    else {
      console.log('Error Socket: User not identified');
      client.emit('identify');
    }
  }

  @SubscribeMessage('startGame')
	startGame(client: Socket, message: string) {
	
		this.intervalRunGame = setInterval(() => {
			this.gameService.runGame(); 
			this.server.emit('getGameData', this.gameService.gameData)}, 1000 / 25);
			if (this.gameService.gameEnds === true) {
				clearInterval(this.intervalRunGame);
			}

	}

  @SubscribeMessage('stopGame')
	stopGame(client: Socket, message: string) {
 	 
		clearInterval(this.intervalRunGame);
		this.gameService.resetGame();
		this.server.emit('getGameData', this.gameService.gameData);
	}

  @SubscribeMessage('sendRacketPositionLeft')
	getRacketPositionLeft(client: Socket, position: number) {
 	 
		this.gameService.gameData.racketLeftY = position;
	}

	@SubscribeMessage('sendRacketPositionRight')
	getRacketPositionRight(client: Socket, position: number) {
 	 
		this.gameService.gameData.racketRightY = position;
	}

}
