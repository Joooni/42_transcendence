import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { User } from '../objects/user';
import { USERS } from '../objects/mock_users';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  users = USERS;

  constructor(private http: HttpClient) {}

  getUserByID(id: number): Observable<User> {
    const User = this.users.find(elem => elem.id === id)!;
    return of(User);
  }

  // getUser(identifier: number | string): Observable<User> {
  //   this.http.get()
  // }

  getUserByUsername(name: string): Observable<User> {
    const User = this.users.find(elem => elem.username === name)!;
    return of(User);
  }

  updateUserData(user: User) {
    const userToUpdate = this.users.find(elem => elem.id === user.id);
    if (userToUpdate)
    {
      userToUpdate.username = user.username;
      userToUpdate.twoFAEnabled = user.twoFAEnabled;
      userToUpdate.map = user.map;
    }
  }

}
