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
import { MatchService } from 'src/game/match/match.service';
import { ChannelsService } from 'src/channels/channels.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: ['http://localhost:80', 'http://localhost:3000'] })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  intervalSearchOpp: any;
  intervalRunGame: any;

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
    socket.emit('identify');
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

  async diconnectUser(socketId: string) {
    this.server.to(socketId).disconnectSockets();
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







  @SubscribeMessage('startGame')
  startGame(client: Socket, userID: number) {
    if (userID === this.gameService.playerWaitingID) {
      return;
    }
    const roomNbr = this.gameService.checkForOpponent(userID, client);
    console.log(
      'User with ID:  ',
      userID,
      ' is searching a game. The roomNbr is:  ',
      roomNbr,
    );
    if (roomNbr !== undefined) {
      this.gameService.room = 0;
      this.gameService.gameDataBEMap
        .get(roomNbr)
        ?.leftUserSocket.join(roomNbr.toString());
      this.gameService.gameDataBEMap
        .get(roomNbr)
        ?.rightUserSocket!.join(roomNbr.toString());
      console.log('The game with id:  ', roomNbr, '   is running');
      this.intervalRunGame = setInterval(() => {
        this.gameService.startMatch(
          this.gameService.gameDataMap.get(roomNbr!)!,
        );
        this.server
          .to(roomNbr!.toString())
          .emit('getGameData', this.gameService.gameDataMap.get(roomNbr!)!);
        if (this.gameService.gameDataMap.get(roomNbr!)!.gameEnds === true) {
          clearInterval(this.intervalRunGame);
          this.gameService.gameDataBEMap
            .get(roomNbr!)
            ?.leftUserSocket.leave(roomNbr!.toString());
          this.gameService.gameDataBEMap
            .get(roomNbr!)
            ?.rightUserSocket!.leave(roomNbr!.toString());
          console.log(
            'The game with id:  ',
            roomNbr,
            '   is over. The users with id:  ',
            this.gameService.gameDataMap.get(roomNbr!)?.leftUserID,
            '  and  ',
            this.gameService.gameDataMap.get(roomNbr!)?.rightUserID,
            'left.',
          );
          this.gameService.gameDataBEMap.delete(roomNbr!);
          this.gameService.gameDataMap.delete(roomNbr!);
        }
      }, 1000 / 25);
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

  @SubscribeMessage('sendRacketPositionLeft')
  getRacketPositionLeft(client: Socket, data: number[]) {
    this.gameService.gameDataMap.get(data[1])!.racketLeftY = data[0];
  }

  @SubscribeMessage('sendRacketPositionRight')
  getRacketPositionRight(client: Socket, data: number[]) {
    this.gameService.gameDataMap.get(data[1])!.racketRightY = data[0];
  }
}
