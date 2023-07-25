export interface User {
	id: number;
	intra: string;
	firstname: string;
	lastname: string;
	username: string;
	email: string;
	picture: string;
	twoFAEnabled: boolean;
	hasTwoFASecret?: boolean;
	status: string;
	wins: number;
	losses: number;
	xp: number;
	selectedMap?: number;
	achievements: number[];
}