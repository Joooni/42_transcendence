import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';

import { User } from '../user';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  
  Users: User[] = [];
  selectedUser?: User;
  activeUser?: User;
  
  constructor(
    private userService: UserDataService,
    private route: ActivatedRoute,
    private location: Location,
    private cookie: CookieService
    ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getActiveUserID() {
		this.userService.getUserByUsername(this.cookie.get("username")).subscribe(user => this.activeUser = user);
		return this.activeUser?.id;
	}

  isProfileOfActiveUser() {
    if (this.activeUser?.id === this.selectedUser?.id)
      return true;
    return false;
  }

  getUser(): void {
    const username = String(this.route.snapshot.paramMap.get('username'));
    console.log(username);
    this.userService.getUserByUsername(username).subscribe(user => this.selectedUser = user);
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(users => this.Users = users);
  }
}
