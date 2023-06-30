import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {

	private socketMap: Map<number, Socket> = new Map<number, Socket>()

	addSocket(userid: number, socket: Socket): void {
	  this.socketMap.set(userid, socket);
	}
  
	getSocket(userid: number): Socket | undefined {
	  return this.socketMap.get(userid);
	}
  
	removeSocket(userid: number): void {
	  this.socketMap.delete(userid);
	}
}
