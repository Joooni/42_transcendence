import { Channel } from "./channel";

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
	rank: number;
	map: number;
	selectedMap?: number;
	achievements: number[];
	ownedChannels: Channel[];
	channelList: Channel[];
	adminInChannel: Channel[];
	mutedInChannel: Channel[];
	invitedInChannel: Channel[];
	bannedInChannel: Channel[];
	friends: User[];
	sendFriendRequests: User[];
	incomingFriendRequests: User[];
	blockedUsers: User[];
	blockedFromOther: User[];
}