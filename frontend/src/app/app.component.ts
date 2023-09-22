import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
	constructor(private cookie: CookieService,
				public router: Router
		) {}

	ngOnInit() {
		if((window.performance.getEntries()[0] as PerformanceNavigationTiming).type  === 'back_forward'){
			this.router.navigateByUrl('/');
		}
	}


	setCookie() {
		this.cookie.set("userid", "1");//has to be set to the active user after authentication
		this.cookie.set("username", "MusterDude");
	}
}
