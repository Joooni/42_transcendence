import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
	constructor(private cookie: CookieService) {}

	getActiveUserID() {
		return this.cookie.get("userid");
	}

	getActiveUsername() {
		return this.cookie.get("username");
	}

	onLogin() {
		this.cookie.set("userid", "1");//has to be set to the active user after authentication
		this.cookie.set("username", "MusterDude");
	}

	deleteAllCookies() {
		this.cookie.deleteAll();
	}
}
