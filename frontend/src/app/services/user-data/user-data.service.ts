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
      this.updateStatus('online');
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
        this.updateStatus('offline');
        return;
      }).catch((error) => {
        if (typeof error.response === 'undefined') throw error;
        throw new Error(error.response.data.message);
      })
    }
  }

  async findSelf(): Promise<User> {
    const { userById } = await graphQLService.query(
      `
      query {
        userById {
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
          xp
          achievements
        }
      }
      `,
      undefined,
      { fetchPolicy: 'network-only' },
    );
      if (typeof userById === 'undefined') throw new Error('Empty user data');
      return userById;
  }

  async findAll(): Promise<User[]> {
    const response = await graphQLService.query(
      `
      query {
        allUsers {
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
          xp
          achievements
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
    return users;
  }

  async findUserById(id: number): Promise<User> {
    const { userById } = await graphQLService.query(
      `
      query findUserById($id: Int!) {
        userById(id: $id) {
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
          xp
          achievements
        }
      }
      `,
      { id },
    );
		if (typeof userById === 'undefined') throw new Error('Empty user data');
		return userById;
  }

	async findUserByUsername(username: string): Promise<User> {
    const { userByName } = await graphQLService.query(
      `
      query findUserByUsername($username: String!) {
        userByName(username: $username) {
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
          xp
          achievements
        }
      }
      `,
      { username },
    );
    if (typeof userByName === 'undefined') throw new Error('Empty user data');
    return userByName;
  }

  async updateUsername(username: string) {
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

  async updateStatus(status: string) {
    const { updateStatus } = await graphQLService.mutation(
      `
      mutation updateStatus( $status: String! ){
        updateStatus( status: $status ) {
          status
        }
      }
      `,
      { status },
    );
    if (typeof updateStatus === 'undefined')
      throw new Error('Empty user data');
    return updateStatus;
  }

  async updateAchievements(user: User, newAchievement: number) {
    const id = user.id;
    const { updateAchievements } = await graphQLService.mutation(
      `
      mutation updateAchievements($id: Float!, $newAchievement: Float!) {
        updateAchievements(id: $id, newAchievement: $newAchievement) {
          achievements
        }
      }
      `,
      { id, newAchievement },
    );
    if (typeof updateAchievements === 'undefined')
      throw new Error('Empty user data');
    return updateAchievements;
  }

  // for FE-testing - to be deleted when BE provides test data
  getAllUsers(): Observable<User[]> {
		return of(this.users);
	}
}
