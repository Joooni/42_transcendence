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
import { MessageObj } from 'src/objects/message';
import { UsersService } from 'src/users/users.service';
import { Inject } from '@nestjs/common';
import { MessagesService } from 'src/messages/messages.service';
import { GameService } from 'src/game/game.service';

@WebSocketGateway({ cors: ['http://localhost:80', 'http://localhost:3000'] })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  intervalRunGame: any;
  private socketMap: Map<number, Socket> = new Map<number, Socket>();

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
      const user = await this.usersService.findOnebySocketId(client.id);
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
    const socket = this.getSocket(message.receiver.id);
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
    } else {
      console.log('Error Socket: User not identified');
      client.emit('identify');
    }
  }

  // startGame(client: Socket, message: string) {
  @SubscribeMessage('startGame')
  startGame() {
    this.intervalRunGame = setInterval(() => {
      this.gameService.runGame();
      this.server.emit('getGameData', this.gameService.gameData);
    }, 1000 / 25);
    if (this.gameService.gameEnds === true) {
      clearInterval(this.intervalRunGame);
    }
  }

  // stopGame(client: Socket, message: string) {
  @SubscribeMessage('stopGame')
  stopGame() {
    clearInterval(this.intervalRunGame);
    this.gameService.resetGame();
    this.server.emit('getGameData', this.gameService.gameData);
  }

  // getRacketPositionLeft(client: Socket, position: number) {
  @SubscribeMessage('sendRacketPositionLeft')
  getRacketPositionLeft(position: number) {
    this.gameService.gameData.racketLeftY = position;
  }

  // getRacketPositionRight(client: Socket, position: number ) {
  @SubscribeMessage('sendRacketPositionRight')
  getRacketPositionRight(position: number) {
    this.gameService.gameData.racketRightY = position;
  }
}
