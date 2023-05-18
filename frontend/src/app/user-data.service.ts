import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user';
import { USERS } from './mock_users';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  users = USERS;
  
  constructor() { }

  getUserByID(id: number): Observable<User> {
    const User = this.users.find(elem => elem.id === id)!;
    return of(User);
  }

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
