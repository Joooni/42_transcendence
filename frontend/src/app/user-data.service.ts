import { Injectable } from '@angular/core';
import { User } from './user';
import { USERS } from './mock_users';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }

  getUserByID(userID:number) {
    return USERS.find(elem => elem.id == userID);
  }

  getUserByUsername(name:string) {
    return USERS.find(elem => elem.username == name);
  }

  getUsers() {
    return USERS;
  }

}
