import { ChannelMute } from "./channelMute";
import { User } from "./user";

export interface Channel {
	id: string;
	name: string;
	createdAt: Date;
	owner: User;
	type: string;
	users: User[];
	admins: User[];
	mutedUsers: ChannelMute[];
	invitedUsers: User[];
	bannedUsers: User[];
}