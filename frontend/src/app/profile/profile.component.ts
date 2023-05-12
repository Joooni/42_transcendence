import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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
  
  constructor(
    private userDataService: UserDataService,
    private route: ActivatedRoute,
    private location: Location
    ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const username = String(this.route.snapshot.paramMap.get('username'));
    console.log(username);
    this.userDataService.getUserByUsername(username).subscribe(user => this.selectedUser = user);
  }

  getUsers(): void {
    this.userDataService.getUsers().subscribe(users => this.Users = users);
  }
}
