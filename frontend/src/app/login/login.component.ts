import { HttpClient } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import  axios from 'axios';
import { Response } from 'express';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

@Injectable()
export class LoginComponent {
  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      const code = params.get('code');
        console.log('code: ', code);
        return axios.get('http://localhost:3000/auth/callback', { params: { code }, withCredentials: true }).then((res) => {
          if (typeof res.data.isAuthenticated === 'undefined')
            throw new Error('Empty user authentication');
          return { require2FAVerify: !res.data.isAuthenticated };
        }).catch((error) => {
          if (typeof error.response === 'undefined') throw error;
          throw new Error(error.response.data.message);
        })
    });
  }

  onLogin() {
    console.log('before window.location.href');
    window.location.href = 'http://localhost:3000/auth/login';
    console.log('after window.location.href');
  };

}
