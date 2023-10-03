import { Injectable, OnDestroy } from '@angular/core';
import { UserDataService } from '../user-data/user-data.service';
import { Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';
import { SocketService } from '../socket/socket.service';
import { environment } from 'src/environments/environment';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private authSubscription?: Subscription;
  public isAuthenticated: boolean = false;

  constructor(
    private readonly userDataService: UserDataService,
    private router: Router,
    private readonly socketService: SocketService,
    ) {
    this.checkAuthenticationStatus();
  }

  private checkAuthenticationStatus() {
    this.authSubscription = interval(2000)
      .subscribe(async () => {
        try {
          await this.userDataService.findSelf();
          this.isAuthenticated = true;
          this.socketService.isAuthenticated = true;
        } catch (error) {
          this.isAuthenticated = false;
          this.socketService.isAuthenticated = false;
          this.socketService.disconnect();
          this.router.navigate(['/login']);
        }
      });
  }

  async isUserAuthenticated(): Promise<boolean> {
    try {
      await this.userDataService.findSelf();
      this.isAuthenticated = true;
      this.socketService.isAuthenticated = true;
    } catch (error) {
      this.isAuthenticated = false;
      this.socketService.isAuthenticated = false;
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    if (this.authSubscription)
      this,this.authSubscription.unsubscribe();
  }

  async logout() {
    const url = `http://${environment.DOMAIN}:3000/auth/logout`;
    await axios.get(url, { withCredentials: true });
  }
}
