import graphQLService from '../graphQL/GraphQLService';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../objects/user';
import { USERS } from '../../mock_users';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})


export class UserDataService {

  users = USERS;

  constructor() {}


  async fetchJwt(code: string) {
    return axios.get('http://localhost:3000/auth/callback', { params: { code }, withCredentials: true })
    .then((res) => {
      if (typeof res.data.isAuthenticated === 'undefined')
        throw new Error('Empty user authentication');
      return { require2FAVerify: !res.data.isAuthenticated };
    }).catch((error) => {
      if (typeof error.response === 'undefined') throw error;
      throw new Error(error.response.data.message);
    });
  }

  async login(code: string): Promise<void> {
    try {
      const { require2FAVerify } = await this.fetchJwt(code);
      if (require2FAVerify) {
        await this.verify2FA(code);
        return;
      }
      const user: User = await this.findSelf();
      this.updateLoggedIn(user, true);
    } catch (error: any) {
      await this.logout();
      if (typeof error.response === 'undefined') throw error;
      throw new Error(error.response.data.message);
    }
  }

  async verify2FA(code: string): Promise<void> {

  }

  async logout(): Promise<void> {
    const user: User = await this.findSelf();
    if (user.isLoggedIn || user.id > 0) {
      await axios.get('http://localhost:3000/auth/logout', {withCredentials: true}).then(() => {
        this.updateLoggedIn(user, false);
        return;
      }).catch((error) => {
        if (typeof error.response === 'undefined') throw error;
        throw new Error(error.response.data.message);
      })
    }
  }

  getUserByID(id: number): Observable<User> {
    const User = this.users.find(elem => elem.id === id)!;
    return of(User);
  }

  async findSelf(): Promise<User> {
    const { user } = await graphQLService.query(
      `
      query {
        user {
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
          isLoggedIn
        }
      }
      `,
      undefined,
      { fetchPolicy: 'network-only' },
    );
      if (typeof user === 'undefined') throw new Error('Empty user data');
      return user;
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

  async findUserById(id: number): Promise<User> {
    const user = await graphQLService.query(
      `
      query User($id: Int!) {
        user(id: $id) {
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
          isLoggedIn
        }
      }
      `,
      { id },
    );
      if (typeof user === 'undefined') throw new Error('Empty user data');
      return user;
  }

  async updateUsername(username: string) {
    console.log('inside UserDataService.updateUsername');
    const { updateUsername } = await graphQLService.mutation(
      `
      mutation updateUsername( $username: String! ){
        updateUsername( username: $username ) {
          username
        }
      }
      `,
      { username },
    );
    if (typeof updateUsername === 'undefined')
      throw new Error('Empty users data');
    return updateUsername;
  }

  getUserByUsername(name: string): Observable<User> {
    const User = this.users.find(elem => elem.username === name)!;
    return of(User);
  }

  async updateLoggedIn(user: User, status: boolean) {
    const { updateLoggedIn } = await graphQLService.mutation(
      `
      mutation updateLoggedIn( $status: Boolean! ){
        updateLoggedIn( isLoggedIn: $status ) {
          status
        }
      }
      `,
      { status },
    );
    if (typeof updateLoggedIn === 'undefined')
      throw new Error('Empty user data');
    return updateLoggedIn;
  }
}
