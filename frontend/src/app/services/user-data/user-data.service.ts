import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { User } from '../../objects/user';
import { USERS } from '../../objects/mock_users';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

	//initalization can be deleted afterwards
	users = USERS;

	constructor(private http: HttpClient) {}

	//update - BE call instead
	getUserByID(id: number): Observable<User> {
		const User = this.users.find(elem => elem.id === id)!;
		return of(User);
	}

	//update - BE call instead
	getUserByUsername(name: string): Observable<User> {
		const User = this.users.find(elem => elem.username === name)!;
		return of(User);
	}

	//update - BE call instead
	updateUserData(user: User) {
		const userToUpdate = this.users.find(elem => elem.id === user.id);
		if (userToUpdate)
		{
			userToUpdate.username = user.username;
			userToUpdate.twoFAEnabled = user.twoFAEnabled;
			userToUpdate.map = user.map;
		}
	}

	//update - BE call instead
	getAllUsersFor(userid: number): Observable<User[]> {
		return of(this.users);
	}

}
