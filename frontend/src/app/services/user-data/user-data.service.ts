import graphQLService from '../graphQL/GraphQLService';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../models/user';
import axios from 'axios';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private router: Router) {}

  async fetchJwt(code: string, bypassId?: string) {
    return axios.get(`http://${environment.DOMAIN}:3000/auth/callback`, { params: { code, id: bypassId }, withCredentials: true })
    .then((res) => {
      if (typeof res.data.isAuthenticated === 'undefined')
        throw new Error('Empty user authentication');
      return { require2FAVerify: !res.data.isAuthenticated };
    }).catch((error) => {
      if (typeof error.response === 'undefined') throw error;
      throw new Error(error.response.data.message);
    });
  }

  async login(code: string, bypassId?: string): Promise<boolean> {
    try {
      const { require2FAVerify } = await this.fetchJwt(code, bypassId);
      if (require2FAVerify) {
        return new Promise((resolve) => {
					resolve(false);
				});
      }
      const user: User = await this.findSelf();
      this.updateStatus('online');
      this.router.navigate(['/home']);
			return new Promise((resolve) => {
				resolve(true);
			})
    } catch (error: any) {
      await this.logout();
      if (typeof error.response === 'undefined') throw error;
      throw new Error(error.response.data.message);
    }
  }

  async generate2FA(): Promise<any> {
    return axios.get(`http://${environment.DOMAIN}:3000/2fa/generate`, {
      withCredentials: true,
    });
  }

  twoFACodeIsValid(code: string | undefined): boolean {
    if (!code)
      return false;
    return (/^\d+$/.test(code) && code.length === 6); //tests if string is numerical
  }

  async verify2FA(code: string): Promise<void> {
    return axios.get(`http://${environment.DOMAIN}:3000/2fa/verify`, {
      params: { code },
      withCredentials: true,
    });
  }

  async enable2FA(code: string): Promise<void> {
    return axios.get(`http://${environment.DOMAIN}:3000/2fa/enable`, {
      params: { code },
      withCredentials: true,
    });
  }

  async disable2FA(code: string): Promise<void> {
    return axios.get(`http://${environment.DOMAIN}:3000/2fa/disable`, {
      params: { code },
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
      await axios.get(`http://${environment.DOMAIN}:3000/auth/logout`, {withCredentials: true}).then(() => {
        this.updateStatus('offline');
        return;
      }).catch((error) => {
        if (typeof error.response === 'undefined') throw error;
        throw new Error(error.response.data.message);
      })
    }
  }

  async uploadPicture(uploadedPicture: File): Promise<void> {
    const userID: number = (await this.findSelf()).id;
    const formData = new FormData();
    formData.append('picture', uploadedPicture);
    try {
      return axios.post(
        `http://${environment.DOMAIN}:3000/users/upload/${userID}`,
        formData,
        {
          withCredentials: true,
        },
      ).then((res) => {
        if (typeof res.data.url === 'undefined')
          throw new Error('Picture url is empty.');
      }).catch((error) => {
        if (typeof error.response === 'undefined') throw error;
        throw new Error(error.response.data.message);
      });
   } catch {
    throw new Error("Error uploading picture");
   }
  }

  async findSelf(): Promise<User> {
    const { userById } = await graphQLService.query(
      `
      query {
        userById {
          id
          intra
          username
          email
          picture
          twoFAEnabled
					hasTwoFASecret
					status
          wins
          losses
          xp
          map
					selectedMap
          achievements
          channelList {
            id
            name
          }
          invitedInChannel {
            id
            name
          }
          friends {
            id
            username
            status
            picture
          }
					sendFriendRequests {
            id
            username
            status
            picture
          }
					incomingFriendRequests {
            id
            username
            status
            picture
          }
          blockedUsers {
            id
            username
            status
            picture
          }
          blockedFromOther {
            id
            username
            status
            picture
          }
        }
      }
      `,
      undefined,
      { fetchPolicy: 'network-only' },
    );
      if (typeof userById === 'undefined') throw new Error('Empty user data');
      return userById;
  }

     // We don't need it?
  // async findAll(): Promise<User[]> {
  //   const response = await graphQLService.query(
  //     `
  //       query {
  //         allUsers {
  //           id
  //           intra
  //           username
  //           email
  //           picture
  //           twoFAEnabled
  //           status
  //           wins
  //           losses
  //           xp
  //           achievements
  //         }
  //       }
  //     `,
  //     undefined,
  //     { fetchPolicy: 'network-only' },
  //   );
  //   if (typeof response === 'undefined') {
  //     return Promise.reject(new Error('Empty user data'));
  //   }
  //   return response.allUsers;
  // }

  async findAllExceptMyself(): Promise<User[]> {
    let response = await graphQLService.query(
      `
        query {
          allUsersExceptMyself {
            id
            intra
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
    const editableResult = (response.allUsersExceptMyself as User[]).map(users => ({...users}));
    return editableResult;
  }

  async findUserById(id: number): Promise<User> {
    const { userById } = await graphQLService.query(
      `
      query findUserById($id: Int) {
        userById(id: $id) {
          id
          intra
          username
          email
          picture
          twoFAEnabled
          status
          wins
          losses
          xp
          achievements
          channelList {
            id
            name
          }
        }
      }
      `,
      { id },
      { fetchPolicy: 'network-only' },
    );
		if (typeof userById === 'undefined') throw new Error('Empty user data');
    const editableResult = {...userById};
    return editableResult;
  }

	async findUserByUsername(username: string): Promise<User> {
    const { userByName } = await graphQLService.query(
      `
      query findUserByUsername($username: String!) {
        userByName(username: $username) {
          id
          intra
          username
          email
          picture
          twoFAEnabled
          wins
          losses
          xp
          rank
          achievements
					channelList {
            id
            name
          }
        }
      }
      `,
      { username },
      { fetchPolicy: 'network-only' },
    );
    if (typeof userByName === 'undefined') throw new Error('Empty user data');
    return userByName;
  }

  async getUsersSortedByRank(): Promise<User[]> {
    const response = await graphQLService.query(
      `
      query usersSortedByRank {
        getUserSortedByRank {
          id
          rank
          xp
          username
          picture
          wins
          losses
        }
      }
      `,
      undefined,
      { fetchPolicy: 'network-only' },
    );
    if (typeof response === 'undefined') {
      return Promise.reject(new Error('Empty user data'));
    }
    return response.getUserSortedByRank;
  }

  async getTop3(): Promise<User[]> {
    const response = await graphQLService.query(
      `
      query getTop3 {
        getTop3 {
          id
          rank
          xp
          username
          picture
          wins
          losses
        }
      }
      `,
      undefined,
      { fetchPolicy: 'network-only' },
    );
    if (typeof response === 'undefined') {
      return Promise.reject(new Error('Empty user data'));
    }
    return response.getTop3;
  }

  async updateUsername(username: string) {
    if (username.length > 30)
      throw new Error('Username too long');
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

	async updateSelectedMap(selectedMap: number) {
		const { updateSelectedMap } = await graphQLService.mutation(
      `
      mutation updateSelectedMap( $selectedMap: Float! ){
        updateSelectedMap( selectedMap: $selectedMap ) {
          selectedMap
        }
      }
      `,
      { selectedMap },
    );
    if (typeof updateSelectedMap === 'undefined')
      throw new Error('Empty users data');
    return updateSelectedMap;
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
}
