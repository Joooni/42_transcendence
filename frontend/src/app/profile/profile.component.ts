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
    private location: Location,
    private cookie: CookieService,
    private gameservice: GameDataService
    ) {}

  ngOnInit(): void {
    this.userService.getUserByID(parseInt(this.cookie.get("userid"))).subscribe(user => this.activeUser = user);
    const username = String(this.route.snapshot.paramMap.get('username'));
    this.userService.getUserByUsername(username).subscribe(user => this.selectedUser = user);
    this.gameHistory = this.gameservice.getMatchesOfUser(this.activeUser?.id);
  }

  isProfileOfActiveUser() {
    if (this.activeUser?.id === this.selectedUser?.id)
      return true;
    return false;
  }
}
