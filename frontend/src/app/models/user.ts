export interface User {
	id: number;
	intra: string;
	firstname: string;
	lastname: string;
	username: string;
	email: string;
	picture: string;
	twoFAEnabled: boolean;
	status: string;
	wins: number;
	losses: number;
	// xp: number;
	map: number;
	// achievements: number[];
}