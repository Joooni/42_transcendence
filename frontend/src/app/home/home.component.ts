import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { User } from '../user';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
	
	activeUser?: User;
	
	constructor(private cookie: CookieService, private userService: UserDataService) {}

	ngOnInit() {
		this.userService.getUserByID(parseInt(this.cookie.get("userid"))).subscribe(user => this.activeUser = user);
	}

	onLogin() {
		this.cookie.set("userid", "1");//has to be set to the active user after authentication
		this.userService.getUserByID(parseInt(this.cookie.get("userid"))).subscribe(user => this.activeUser = user);
	}

	deleteAllCookies() {
		this.cookie.deleteAll();
		this.activeUser = undefined;
	}
}
