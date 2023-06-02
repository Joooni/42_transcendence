import graphQLService from './GraphQLService';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from './user';
import { USERS } from './mock_users';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})


export class UserDataService {

  users = USERS;


  constructor(
    private http: HttpClient,
    private readonly cookieService: CookieService,
    ) {}


  async fetchJwt(code: string) {
    return this.http.get('http://localhost:3000/auth/callback', {
      params: { string: 'code' },
      withCredentials: true,
    })
    // .pipe((res) => {
    //   tap((res) => {
    //     console.log('res: ', res);
    //   })
    //   // if (typeof res.data.isAuthenticated === 'undefined')
    //   //   throw new Error('Empty user authentication.');
    //   // return { require2FAVerify: !res.data.isAuthenticated };
    // })
    // .catch((error) => {
    //   if (typeof error.response === 'undefined') throw error;
    //   throw new Error(error.response.data.message);
    // });
  }



  //   async fetchJwt(code: string) {
  //   console.log('inside fetchJwt');
  //   const url = 'http://localhost:3000/auth/callback';
	// 	const params = new HttpParams().set('code', code);
	// 	const options = { withCredentials: true };
	// 	// 1. check if user is logged in
	// 	// -> if yes, redirect to profile page
	// 	// -> if no, take login route (redirect to :3000/auth/login)
	// 	return this.http.get<any>(url, { params, ...options }).pipe(
	// 		map(res => {
	// 			if (typeof res.isAuthenticated === 'undefined') {throw new Error('Empty user authentication')};
	// 			return { require2FAVerify: !res.isAuthenticated };
	// 		}),
	// 	)
  // }

  getUserByID(id: number): Observable<User> {
    const User = this.users.find(elem => elem.id === id)!;
    return of(User);
  }

  async findSelf(): Promise<User> {
    const user = await graphQLService.query(
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
      mutation updateLoggedIn( $status: boolean! ){
        updateLoggedIn( status: $status ) {
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
