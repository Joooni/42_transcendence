import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserDataService } from '../services/user-data/user-data.service';

@Component({
  selector: 'app-two-fa',
  templateUrl: './two-fa.component.html',
  styleUrls: ['./two-fa.component.css']
})

export class TwoFAComponent {
  constructor(private authService: AuthService, private userDataService: UserDataService) {}

  async onSubmit(code: string) {
    await this.userDataService.verify2FA(code);

  }

}
