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
import { Any } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { GameModule } from '../game/game.module';
import { GameService } from 'src/game/game.service';

@WebSocketGateway({cors: 'http://localhost:80'})
export class SocketGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{

	intervalRunGame : any;

	constructor(private gameService: GameService) {}


	@WebSocketServer()
	server: Server;

	afterInit() {
    	console.log('ChatGateway initialized');
	}

	handleConnection(client: Socket) {
		console.log('Client connected:', client.id);
	}

	handleDisconnect(client: Socket) {
		console.log('Client disconnected:', client.id);
	}
	
	@SubscribeMessage('message')
	handleMessage(client: Socket, message: string): string {

		console.log(client.id, 'send a message:', message);    
		this.server.emit('message', 'Hello from the server');
		return 'Hello world!';
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

