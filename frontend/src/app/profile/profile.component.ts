import { Component } from '@angular/core';
import { User } from '../user';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  
  selectedUser?: User;
  
  constructor(private userDataService: UserDataService) {}

  ngOnInit(): void {
    this.getUserByUsername();
  }

  getUserByUsername(): void {
    this.selectedUser = this.userDataService.getUserByUsername("JonDude");
  }

}
