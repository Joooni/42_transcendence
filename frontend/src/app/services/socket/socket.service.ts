import { Injectable } from '@angular/core';
import axios from 'axios';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  
  constructor(private socket: Socket) {
    this.socket.on('connect', async () => {
      this.connectSocket();
    });
  }
  
  connected = false;

  async connectSocket() {
    return new Promise<void>(async (resolve, reject) => {
      const socketId = this.socket.ioSocket.id;
      console.log('socketid:', socketId);
      try {
        await axios.get(`http://localhost:3000/socket/verify/${socketId}`, { withCredentials: true });
        console.log('Socket verified');
        this.connected = true;
        resolve();
      } catch (error) {
        console.log('Error verifying socket:', error);
        reject(error);
      }
    });
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      })
    });
  }

  disconnect() {
    this.socket.disconnect();
    this.connected = false;
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  emit2(eventName: string, data1: any, data2: any) {
    this.socket.emit(eventName, data1, data2);
  }
}
