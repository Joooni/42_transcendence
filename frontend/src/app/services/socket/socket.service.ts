import { Injectable } from '@angular/core';
import axios from 'axios';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(
    public socket: Socket,
    ) {
      this.socket.on('connect', async () => {
        this.connectSocket();
      });
    }
  
  public isAuthenticated: boolean = false;
  connected = false;

  async connectSocket() {
    return new Promise<void>(async (resolve, reject) => {
      const socketId = this.socket.ioSocket.id;
      if (this.isAuthenticated) {
        try {
          await axios.get(`http://${environment.DOMAIN}:3000/socket/verify/${socketId}`, { withCredentials: true });
          this.connected = true;
          resolve();
        } catch (error) {
          // console.log('Error verifying socket');
          // reject(error);
        }
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

  stopListen(eventName: string) {
      this.socket.off(eventName);  
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  emit2(eventName: string, data1: any, data2: any) {
    this.socket.emit(eventName, data1, data2);
  }

  emit3(eventName: string, data1: any, data2: any, data3: any) {
    this.socket.emit(eventName, data1, data2, data3);
  }
}
