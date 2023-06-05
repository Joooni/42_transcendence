import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import  axios from 'axios';
import { Response } from 'express';
import { LoginGuard } from '../login.guard';
import { UserDataService } from '../user-data.service';

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
    console.log('before window.location.href');
    window.location.href = 'http://localhost:3000/auth/login';
    console.log('after window.location.href');
  };

  findSelf() {
    console.log('findself: ',this.userDataService.findSelf());
  }
}
