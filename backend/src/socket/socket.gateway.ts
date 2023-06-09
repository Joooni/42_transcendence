import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { MessageObj } from 'src/objects/message';
import { UsersService } from 'src/users/users.service';
import { MessagesService } from 'src/messages/messages.service';
import { GameService } from 'src/game/game.service';
import { MatchService } from 'src/game/match/match.service';
import { gameData, gameDataBE } from 'src/game/match/GameData';

@WebSocketGateway({ cors: ['http://localhost:80', 'http://localhost:3000'] })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  intervalSearchOpp: any;
  intervalRunGame: any;
  io: Server;

  private socketMap: Map<number, Socket> = new Map<number, Socket>();

  constructor(
    private readonly usersService: UsersService,
    private matchService: MatchService,
    private gameService: GameService,
    //private socketModule: SocketModule
    // @Inject(MessagesService)
    private readonly messagesService: MessagesService,
  ) {
	const io = new Server;
  }



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
      this.usersService.updateStatus(user.id, 'offline');
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

      this.usersService.updateStatus(userid, 'online');
    } else {
      console.log('Error Socket: User not identified');
      client.emit('identify');
    }
  }


  @SubscribeMessage('startGame')
  startGame(client: Socket, userID: number) {
	if (userID === this.gameService.playerWaitingID) {
		return;
	}
 	var roomNbr = this.gameService.checkForOpponent(userID, client);
	console.log("User with ID:  ", userID, " is searching a game. The roomNbr is:  ", roomNbr);
	if (roomNbr !== undefined) {
		this.gameService.room = 0;
		this.gameService.gameDataBEMap.get(roomNbr)?.leftUserSocket.join(roomNbr.toString());
		this.gameService.gameDataBEMap.get(roomNbr)?.rightUserSocket!.join(roomNbr.toString());
		console.log("The game with id:  ", roomNbr, "   is running");
		this.intervalRunGame = setInterval(() => {		
			this.gameService.startMatch(this.gameService.gameDataMap.get(roomNbr!)!);
			this.server.to(roomNbr!.toString()).emit('getGameData', this.gameService.gameDataMap.get(roomNbr!)!);
			if (this.gameService.gameDataMap.get(roomNbr!)!.gameEnds === true) {
				clearInterval(this.intervalRunGame);
				this.gameService.gameDataBEMap.get(roomNbr!)?.leftUserSocket.leave(roomNbr!.toString());
				this.gameService.gameDataBEMap.get(roomNbr!)?.rightUserSocket!.leave(roomNbr!.toString());
				console.log("The game with id:  ", roomNbr, "   is over. The users with id:  ", this.gameService.gameDataMap.get(roomNbr!)?.leftUserID, "  and  ", this.gameService.gameDataMap.get(roomNbr!)?.rightUserID, "left." );
				this.gameService.gameDataBEMap.delete(roomNbr!)
				this.gameService.gameDataMap.delete(roomNbr!);
			}			
		}, 1000 / 25);
	}
  }

  @SubscribeMessage('stopSearching')
  stopSearching(client: Socket) {
	console.log("User with ID:  ", this.gameService.playerWaitingID, " stoped searching a game.");
    this.gameService.playerWaitingID = undefined;
	this.gameService.gameDataBEMap.delete(this.gameService.room);
	this.gameService.gameDataMap.delete(this.gameService.room);
	this.gameService.room = 0;
  }

  @SubscribeMessage('sendRacketPositionLeft')
  getRacketPositionLeft(client: Socket, data: number[]) {
	this.gameService.gameDataMap.get(data[1])!.racketLeftY = data[0];
  }
    
  @SubscribeMessage('sendRacketPositionRight')
  getRacketPositionRight(client: Socket, data: number[]) {
	this.gameService.gameDataMap.get(data[1])!.racketRightY = data[0];
  }
}
