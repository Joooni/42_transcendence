import { Channel } from "./channel";
import { User } from "./user";

export interface Notification {
	type: string;
	sender: User | Channel;
}