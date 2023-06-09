import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { User } from '../models/user';
import { SocketService } from '../services/socket/socket.service';
import { UserDataService } from '../services/user-data/user-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
	
	activeUser?: User;
	
	constructor(private cookie: CookieService, private userService: UserDataService) {}

	checkForActiveUser(): boolean {
		this.userService.getUserByID(parseInt(this.cookie.get("userid"))).subscribe(user => this.activeUser = user);
		if (this.activeUser)
			return true;
		return false;
	}
}
