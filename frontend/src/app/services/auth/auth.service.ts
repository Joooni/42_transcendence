import { Injectable, OnDestroy } from '@angular/core';
import { USERS } from 'src/app/mock-data/mock_users';
import { User } from 'src/app/models/user';
import { UserDataService } from '../user-data/user-data.service';
import { Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';
import { SocketService } from '../socket/socket.service';

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
        } catch (error) {
          this.isAuthenticated = false;
          //TO-DO: disconnect socket
          this.socketService.disconnect();
          this.router.navigate(['/login']);
        }
      });
  }

  async isUserAuthenticated(): Promise<boolean> {
    try {
      await this.userDataService.findSelf();
      this.isAuthenticated = true;
    } catch (error) {
      this.isAuthenticated = false;
      return false;
    }
    return true;
  }

  async twoFAEnabled(): Promise<boolean> {
    let user: User = USERS[0];
    try {
      const user = await this.userDataService.findSelf();
    } catch (error) {}
    return user.twoFAEnabled;
  }

  ngOnDestroy(): void {
    if (this.authSubscription)
      this,this.authSubscription.unsubscribe();
  }
}
