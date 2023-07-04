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

@WebSocketGateway({ cors: ['http://localhost:80', 'http://localhost:3000'] })


export class SocketGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  intervalRunGame : any;
  private socketMap: Map<number, Socket> = new Map<number, Socket>()
  
  constructor(
    private readonly usersService: UsersService,
    private gameService: GameService,
    //private socketModule: SocketModule
    @Inject(MessagesService)
    private readonly messagesService: MessagesService,
    ) {} 

  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('SocketGateway initialized');
  }

  async handleConnection(client: Socket) {
    client.emit('identify');
    console.log('SocketClient connected:', client.id);
  }

  async handleDisconnect(client: Socket) {
    console.log('SocketClient disconnected:', client.id);
    try {
      let user = await this.usersService.findOnebySocketId(client.id);
      this.usersService.updateSocketid(user.id, ''); // Delete SocketId in database
      this.removeSocket(user.id); // Remove Socket from SocketMap
      
      //Function does not exist yet:
      //this.usersService.updateStatus(userid, 'online');
    } catch (error) {
      console.log('Error Socket: User not found');
    }
  }

  addSocket(userid: number, socket: Socket): void {
	  this.socketMap.set(userid, socket);
	}
  
	getSocket(userid: number): Socket | undefined {
	  return this.socketMap.get(userid);
	}
  
	removeSocket(userid: number): void {
	  this.socketMap.delete(userid);
	}

  

  @SubscribeMessage('message')
  handleMessage(client: Socket, message: MessageObj): void {
    console.log('Message received');
    this.messagesService.receiveMessage(client, message);
    let socket = this.getSocket(message.receiver.id);
    // client.emit('message', message); // Zurück an den Absender
    if (socket) {
      socket.emit('message', message);
    }
  }

  @SubscribeMessage('identify')
  identifyUser(client: Socket, userid: number | undefined): void {
    if (typeof userid !== 'undefined' && userid !== null) {
      console.log('SocketId will be updated in database', userid);
      this.usersService.updateSocketid(userid, client.id); // Update SocketId in database
      this.addSocket(userid, client); // Add Socket to SocketMap

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
