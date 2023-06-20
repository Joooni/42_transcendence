import graphQLService from '../graphQL/GraphQLService';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../models/user';
import axios from 'axios';
import { Router } from '@angular/router';

// for FE-testing - to be deleted when BE provides test data
import { USERS } from '../../mock-data/mock_users';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  // for FE-testing - to be deleted when BE provides test data
  users = USERS;

  constructor(private router: Router) {}

  async fetchJwt(code: string, bypassId?: string) {
    return axios.get('http://localhost:3000/auth/callback', { params: { code, id: bypassId }, withCredentials: true })
    .then((res) => {
      if (typeof res.data.isAuthenticated === 'undefined')
        throw new Error('Empty user authentication');
      return { require2FAVerify: !res.data.isAuthenticated };
    }).catch((error) => {
      if (typeof error.response === 'undefined') throw error;
      throw new Error(error.response.data.message);
    });
  }

  async login(code: string, bypassId?: string): Promise<void> {
    try {
      const { require2FAVerify } = await this.fetchJwt(code, bypassId);
      if (require2FAVerify) {
        await this.verify2FA(code);
        return;
      }
      const user: User = await this.findSelf();
      this.updateLoggedIn(user, true);
      this.router.navigate(['/home']);
    } catch (error: any) {
      await this.logout();
      if (typeof error.response === 'undefined') throw error;
      throw new Error(error.response.data.message);
    }
  }

  async generate2FA(): Promise<string> {
    return axios.get('http://localhost:3000/2fa/generate', {
      withCredentials: true,
    }).then((res) => {
      return URL.createObjectURL(res.data);
    }).catch((error) => {
      if (typeof error.response === 'undefined') throw error;
      throw new Error(error.response.data.message);
    });
  }

  async verify2FA(code: string): Promise<void> {
    console.log('UserDataService verify2FA with code: ', code);
    return axios.get('http://localhost:3000/2fa/verify', {
      params: { code },
      withCredentials: true,
    }).then(() => {
      return ;
    }).catch((error) => {
      if (typeof error.response === 'undefined') throw error;
      throw new Error(error.response.data.message);
    });
  }

  async enable2FA(code: string): Promise<void> {
    return axios.get('http://localhost:3000/2fa/enable', {
      params: { code },
      withCredentials: true,
    }).then(() => {
      return ;
    }).catch((error) => {
      if (typeof error.response === 'undefined') throw error;
      throw new Error(error.response.data.message);
    });
  }

  async disable2FA(): Promise<void> {
    return axios.get('http://localhost:3000/2fa/disable', {
      withCredentials: true,
    }).then(() => {
      return ;
    }).catch((error) => {
      if (typeof error.response === 'undefined') throw error;
      throw new Error(error.response.data.message);
    });
  }

  async logout(): Promise<void> {
    const user: User = await this.findSelf();
    if (user.status !== "offline" || user.id > 0) {
      await axios.get('http://localhost:3000/auth/logout', {withCredentials: true}).then(() => {
        this.updateLoggedIn(user, false);
        return;
      }).catch((error) => {
        if (typeof error.response === 'undefined') throw error;
        throw new Error(error.response.data.message);
      })
    }
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

  async findAll(): Promise<User[]> {
    const response = await graphQLService.query(
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
          status
          wins
          losses
          isLoggedIn
        }
      }
      `,
      undefined,
      { fetchPolicy: 'network-only' },
    );
    if (typeof response === 'undefined') {
      return Promise.reject(new Error('Empty user data'));
    }
    const users = response.users;
    console.log(users);
    return users;
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

  // for FE-testing - to be deleted when BE provides test data
  getUserByID(id: number): Observable<User> {
    const User = this.users.find(elem => elem.id === id)!;
    return of(User);
  }

  // for FE-testing - to be deleted when BE provides test data
  getUserByUsername(name: string): Observable<User> {
    const User = this.users.find(elem => elem.username === name)!;
    return of(User);
  }

  // for FE-testing - to be deleted when BE provides test data
  getAllUsers(): Observable<User[]> {
		return of(this.users);
	}
}
