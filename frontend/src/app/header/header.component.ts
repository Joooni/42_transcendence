import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
	constructor(private cookie: CookieService) {}

	getActiveUserID() {
		return this.cookie.get("userid");
	}

	getActiveUsername() {
		return this.cookie.get("username");
	}
}
