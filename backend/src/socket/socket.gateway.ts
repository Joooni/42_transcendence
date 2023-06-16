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
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({cors: 'http://localhost:80'})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  userService: UsersService;

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
}