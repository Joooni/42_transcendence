import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDataService } from '../services/user-data/user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

@Injectable()
export class LoginComponent {
  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private readonly userDataService: UserDataService) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const code = params.get('code');
      if (code) {
        this.userDataService.login(code);
      } else {
        return ;
      }
    });
  }

  onLogin() {
    window.location.href = 'http://localhost:3000/auth/login';
  };

}
