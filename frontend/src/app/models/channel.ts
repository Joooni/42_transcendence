import { User } from "./user";

export interface Channel {
	id: string;
	name: string;
	owner: User;
	type: string; //ENUM: PUBLIC,PRIVATE,PASSWORD,DM
	users: number[];
	admins: number[];
	muted: number[];
	invited: number[];
	banned: number[];

	hasUnreadMessagesToActiveUser?: boolean;
}