import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import axios from 'axios';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { gameData } from 'src/app/game/game-display/GameData';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket, private http: HttpClient) {
    this.socket.connect();
    this.listen('identify').subscribe(() => {
      const socketId = this.socket.ioSocket.id;
      console.log(socketId);
      axios.get(`http://localhost:3000/socket/verify/${socketId}`, { withCredentials: true });
    });
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      })
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  emit2(eventName: string, data1: any, data2: any) {
    this.socket.emit(eventName, data1, data2);
  }
}
