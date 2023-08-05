import { User } from "./user";

export interface Channel {
	id: string;
	name: string;
	owner: User;
	type: number; //ENUM: PUBLIC,PRIVATE,PASSWORD
	users: User[];
	admins: User[];
	mutedUsers: User[];
	invitedUsers: User[];
	bannedUsers: User[];
}