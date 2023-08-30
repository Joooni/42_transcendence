import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageObj } from 'src/objects/message';
import { UsersService } from 'src/users/users.service';
import { MessagesService } from 'src/messages/messages.service';
import { GameService } from 'src/game/game.service';
import { ChannelsService } from 'src/channels/channels.service';

@WebSocketGateway({ cors: ['http://localhost:80', 'http://localhost:3000'] })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  intervalSearchOpp: any;

  constructor(
    private readonly usersService: UsersService,
    private gameService: GameService,
    private readonly messagesService: MessagesService,
    private readonly channelsService: ChannelsService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log('SocketGateway initialized');
  }

  async handleConnection(socket: Socket) {
    console.log('SocketClient connected:', socket.id);
  }

  async handleDisconnect(client: Socket) {
    console.log('SocketClient disconnected:', client.id);
    try {
      const user = await this.usersService.findOnebySocketId(client.id);
      this.usersService.updateSocketid(user.id, ''); // Delete SocketId in database
      this.updateStatusAndEmit(user.id, 'offline');
    } catch (error) {
      console.log('Error Socket: User not found');
    }
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, message: MessageObj): void {
    console.log('Message received');
    this.messagesService.receiveMessage(client, message);

    if (message.receiverUser !== undefined) {
      //DM
      this.usersService.findOne(message.receiverUser.id).then((user) => {
        if (user && user.socketid !== '') {
          this.server.to(user.socketid).emit('message', message);
        }
      });
    } else if (message.receiverChannel !== undefined) {
      //Channel message
      this.server.to(message.receiverChannel.id).emit('message', message);
    } else {
      console.log('Error: Receiver is neither a user nor a channel');
    }
  }

  @SubscribeMessage('createChannel')
  async createChannel(client: Socket, obj: any) {
    await this.channelsService.createChannel(
      client,
      obj.channelname,
      obj.ownerid,
      obj.type,
      obj.password,
    );
    this.server.emit('updateChannelList', {});
  }

  @SubscribeMessage('joinChannelRoom')
  joinChannelRoom(client: Socket, obj: any): void {
    this.channelsService.joinChannelRoom(client, obj.channelid, obj.userid);
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(client: Socket, obj: any) {
    await this.channelsService.addUserToChannel(
      client,
      obj.channelid,
      obj.userid,
    );
    this.server.to(obj.channelid).emit('updateChannel', {});
  }

  @SubscribeMessage('leaveChannel')
  async leaveChannel(client: Socket, obj: any) {
    await this.channelsService.removeUserFromChannel(
      this.server,
      client,
      obj.channelid,
      obj.userid,
    );
  }

  @SubscribeMessage('inviteUser')
  async inviteUser(client: Socket, obj: any) {
    try {
      const invitedUser = await this.channelsService.inviteUserToChannel(
        client,
        obj.inviteThisUserId,
        obj.activeUserid,
        obj.channelid,
      );
      if (!invitedUser) {
        console.log('Error: Invited user not found');
        return;
      }

      await this.server.fetchSockets().then((sockets) => {
        for (const i of sockets) {
          if (i.id == invitedUser.socketid) {
            i.emit('updateChannelList', {});
            return;
          }
        }
        throw new Error('Error Socket: User not found or not online');
      });
    } catch (error) {
      console.log('Error: ', error);
    }
    return;
  }

  async updateStatusAndEmit(userid: number, status: string) {
    await this.usersService.updateStatus(userid, status);
    this.server.emit('updateUser', {
      id: userid,
      status: status,
    });
  }

  @SubscribeMessage('sendFriendRequest')
  async sendFriendRequest(client: Socket, obj: any) {
    await this.usersService.sendFriendRequest(obj.ownid, obj.otherid);
    this.acceptFriendRequest(client, {
      ownid: obj.otherid,
      otherid: obj.ownid,
    });
  }

  @SubscribeMessage('acceptFriendRequest')
  async acceptFriendRequest(client: Socket, obj: any) {
    await this.usersService.acceptFriendRequest(
      this.server,
      obj.ownid,
      obj.otherid,
    );
  }

  @SubscribeMessage('removeFriend')
  async removeFriend(client: Socket, obj: any) {
    await this.usersService.removeFriend(this.server, obj.ownid, obj.otherid);
  }

  @SubscribeMessage('blockUser')
  async blockUser(client: Socket, obj: any) {
    await this.usersService.blockUser(this.server, obj.ownid, obj.otherid);
  }

  @SubscribeMessage('unblockUser')
  async unblockUser(client: Socket, obj: any) {
    await this.usersService.unblockUser(this.server, obj.ownid, obj.otherid);
  }
  

	@SubscribeMessage('startGameRequest')
	startGameRequest(client: Socket, data: number[]) {
		const gameRequestSenderID : number = data[1];
		const gameRequestRecipientID : number = data[0];
		console.log('The GameRequest from User with ID:  ', gameRequestSenderID, '  was accepted by the User with ID:   ', gameRequestRecipientID);
		const gameRequestSenderSocket = this.getSocket(gameRequestSenderID);
		gameRequestSenderSocket?.emit("gameRequestAccepted", gameRequestRecipientID);
		const roomNbr = this.gameService.startWithGameRequest(gameRequestSenderID, gameRequestSenderSocket!, gameRequestRecipientID, client);
		this.gameService.startCountdown(roomNbr, this.server);
	}


@SubscribeMessage('startGameSearching')
startGame(client: Socket, userID: number) {
  if (userID === this.gameService.playerWaitingID) {
	return;
  }
  const roomNbr = this.gameService.checkForOpponent(userID, client);
  console.log('User with ID:  ', userID, ' is searching a game. The roomNbr is:  ', roomNbr);
  if (roomNbr !== undefined) {
	  this.gameService.room = 0;
	  this.gameService.startCountdown(roomNbr, this.server);
  }
}
 

  @SubscribeMessage('stopSearching')
  stopSearching(client: Socket) {
    console.log(
      'User with ID:  ',
      this.gameService.playerWaitingID,
      ' stoped searching a game.',
    );
    this.gameService.playerWaitingID = undefined;
    this.gameService.gameDataBEMap.delete(this.gameService.room);
    this.gameService.gameDataMap.delete(this.gameService.room);
    this.gameService.room = 0;
  }


  @SubscribeMessage('sendGameRequest')
  sendGameRequest(client: Socket, data: number[]) {
  	const gameRequestSenderID : number = data[0];
	const gameRequestRecipientID : number = data[1];
	console.log('User with ID:  ', gameRequestSenderID, '  sent a game requested to User with ID:   ', gameRequestRecipientID);
	const gameRequestRecipientSocket = this.getSocket(gameRequestRecipientID);
	gameRequestRecipientSocket?.emit("gotGameRequest", gameRequestSenderID);
  }

  @SubscribeMessage('gameRequestWithdrawn')
  gameRequestWithdrawn(client: Socket, data: number[]) {
  	const gameRequestSenderID : number = data[0];
	const gameRequestRecipientID : number = data[1];
	console.log('User with ID:  ', gameRequestSenderID, '  withdrawn the game requested to User with ID:   ', gameRequestRecipientID);
	const gameRequestRecipientSocket = this.getSocket(gameRequestRecipientID);
	gameRequestRecipientSocket?.emit("withdrawnGameRequest", gameRequestSenderID);
  }

  @SubscribeMessage('gameRequestDecliend')
  gameRequestDecliend(client: Socket, data: number[]) {
	const gameRequestSenderID : number = data[1];
	const gameRequestRecipientID : number = data[0];
	console.log('The GameRequest from User with ID:  ', gameRequestSenderID, '  was decliend by the User with ID:   ', gameRequestRecipientID);
	const gameRequestSenderSocket = this.getSocket(gameRequestSenderID);
	gameRequestSenderSocket?.emit("gameRequestDecliend", gameRequestRecipientID);
  }
  

  @SubscribeMessage('sendRacketPositionLeft')
  getRacketPositionLeft(client: Socket, data: number[]) {
    this.gameService.gameDataMap.get(data[1])!.racketLeftY = data[0];
  }

  @SubscribeMessage('sendRacketPositionRight')
  getRacketPositionRight(client: Socket, data: number[]) {
    this.gameService.gameDataMap.get(data[1])!.racketRightY = data[0];
  }

  @SubscribeMessage('requestOngoingGames')
  requestOngoingGames(client: Socket, data: number[]) {
    this.gameService.sendOngoingGames(this.server);
  }
  

  @SubscribeMessage('watchGame')
  watchGame(client: Socket, data: number) {
    this.gameService.joinWatchGame(data, client);
  }
  @SubscribeMessage('StopWatchGame')
  stopWatchGame(client: Socket, data: number) {
    this.gameService.leaveWatchGame(data, client);
  }





}
