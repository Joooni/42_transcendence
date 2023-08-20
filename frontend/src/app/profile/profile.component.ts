import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

import { User } from '../models/user';
import { UserDataService } from '../services/user-data/user-data.service';
import { Game, GameHistory } from '../models/game';
import { GameDataService } from '../services/game-data/game-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  selectedUser?: User;
  activeUser?: User;
  gameHistory?: Array<GameHistory>;

  constructor(
    private userService: UserDataService,
    private route: ActivatedRoute,
    private gameservice: GameDataService
    ) {}

  async ngOnInit(): Promise<void> {
    await this.userService.findSelf().then(user => this.activeUser = user)
    const username = String(this.route.snapshot.paramMap.get('username'));
    await this.userService.findUserByUsername(username).then(user => this.selectedUser = user);
    this.gameHistory = this.gameservice.getMatchesOfUser(this.selectedUser?.id);
  }

  isProfileOfActiveUser() {
    if (this.activeUser?.id === this.selectedUser?.id)
      return true;
    return false;
  }

  /*
  here I would like do declare an uploadProfilePicture method
  that takes a file as an input and passes it to the
  the userDataService.uploadPicture method
  */

}
