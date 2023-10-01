import { Component } from '@angular/core';
import { User } from '../models/user';
import { UserDataService } from '../services/user-data/user-data.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent {
  activeUser?: User;
  userList: User[] = [];

  constructor(
    private userService: UserDataService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.userService.findSelf().then(user => this.activeUser = user);
    this.userList = await this.userService.getUsersSortedByRank();
  }
}
