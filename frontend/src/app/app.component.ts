import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	constructor(private cookie: CookieService) {}

	setCookie() {
		this.cookie.set("userid", "1");//has to be set to the active user after authentication
		this.cookie.set("username", "MusterDude");
	}
}
