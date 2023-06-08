import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRelationService {

	//initalization can be deleted afterwards
	friends: number[] = [
		3,
		6,
		7
	];

	//initalization can be deleted afterwards
	blocked: number[] = [
		2,
		4
	];

	constructor() { }

	//update - BE call instead
	getFriendsOf(userid: number): Observable<any> {
		return of(this.friends);
	}

	//update - BE call instead
	getBlockedOf(userid: number): Observable<any> {
		return of(this.blocked);
	}
}
