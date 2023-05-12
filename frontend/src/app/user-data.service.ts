import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user';
import { USERS } from './mock_users';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }

  // getUserByID(userID:number) {
  //   return USERS.find(elem => elem.id == userID);
  // }

  getUserByUsername(username:string): Observable<User> {
    const User = USERS.find(elem => elem.username === username)!;
    return of(User);
  }

  getUsers(): Observable<User[]> {
    const users = of(USERS);
    return users;
  }

}
