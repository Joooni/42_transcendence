import { User } from "./user";
import { Channel } from "./channel";

export interface Message {
	id?: number;
	sender: User;
	receiverUser?: User;
	receiverChannel?: Channel;
	timestamp: Date;
	content: string;
}