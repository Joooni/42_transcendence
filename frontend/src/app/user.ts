export interface User {
	id: number;
	intra: string;
	firstname: string;
	lastname: string;
	username: string;
	email: string;
	picture: string;
	twoFAEnabled: boolean;
	twoFAsecret: string | null;
	status: string;
	wins: number;
	losses: number;
	xp: number;
	rank: number;
	map: number;
	isLoggedIn: boolean;
	require2FAVerify?: boolean;
}