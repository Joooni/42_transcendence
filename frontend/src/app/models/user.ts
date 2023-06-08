export interface User {
	id: number;
	intra: string;
	firstname: string;
	lastname: string;
	username: string;
	email: string;
	picture: string;
	twoFAEnabled: boolean;
	twoFAsecret?: string; //tbd if necessary in FE?
	status: string;
	wins: number;
	losses: number;
	// xp: number;
	// rank: number;
	map: number;
	// achievements: number[];
	isLoggedIn: boolean; //tbd if redundant with status?
}