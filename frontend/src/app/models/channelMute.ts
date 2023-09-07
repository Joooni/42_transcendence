import { Channel } from "./channel";
import { User } from "./user";

export interface ChannelMute {
	id: number;
	channel: Channel;
	user: User;
	mutedUntil: Date;
}