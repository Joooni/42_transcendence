import graphQLService from './GraphQLService';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user';
import { USERS } from './mock_users';
import { HttpClient } from '@angular/common/http';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client/core';


@Injectable({
  providedIn: 'root'
})


export class UserDataService {

  users = USERS;


  constructor(
    private http: HttpClient,
    ) {}


  getUserByID(id: number): Observable<User> {
    const User = this.users.find(elem => elem.id === id)!;
    return of(User);
  }

  async findAll(): Promise<User> {
    const user = await graphQLService.query(
      `
      query {
        users {
          id
          intra
          firstname
          lastname
          username
          email
          picture
          twoFAEnabled
          wins
          losses
        }
      }
      `,
      undefined,
      { fetchPolicy: 'network-only' },
    );
    if (typeof user === 'undefined') throw new Error('Empty user data');
    return user;
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
