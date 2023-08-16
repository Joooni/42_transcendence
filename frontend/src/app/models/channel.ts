import { User } from "./user";

export interface Channel {
	id: string;
	name: string;
	createdAt: Date;
	owner: User;
	type: string; //ENUM: PUBLIC,PRIVATE,PASSWORD
	users: User[];
	admins: User[];
	mutedUsers: User[];
	invitedUsers: User[];
	bannedUsers: User[];
}